#!/usr/bin/env python3
"""Refresh the PDF-route dashboard's Google Flights price snapshots.

The file stores the absolute cheapest offer and the timetable-compatible offer
separately. Google occasionally emits an unpriced placeholder result; the
upstream fast-flights parser stops on that row, so this script skips only the
malformed row and preserves every valid priced offer.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fast_flights import FlightQuery, Passengers, create_query
from fast_flights.fetcher import fetch_flights_html
from selectolax.lexbor import LexborHTMLParser


ROUTES = [
    {
        "id": "route_f1",
        "label": "공통 · 인천 → 타이중 직항",
        "date": "2026-09-02",
        "origin": "ICN",
        "destination": "RMQ",
        "max_stops": 0,
        "preferred_departure": "07:55",
        "preferred_arrival": "09:40",
        "reason": "계획서 첫날 TIPC 회의에 맞춘 타이중 직항",
    },
    {
        "id": "route_f2_direct",
        "label": "시간 우선 · 타이베이 → 암스테르담 직항",
        "date": "2026-09-04",
        "origin": "TPE",
        "destination": "AMS",
        "max_stops": 0,
        "preferred_departure": "23:10",
        "preferred_arrival": "07:40",
        "reason": "대만에서 유럽으로 환승 없이 이동하는 중화항공 직항",
    },
    {
        "id": "route_f3",
        "label": "공통 · 코펜하겐 → 이스탄불 → 인천",
        "date": "2026-09-11",
        "origin": "CPH",
        "destination": "ICN",
        "max_stops": 1,
        "preferred_departure": "10:25",
        "preferred_arrival": "08:35",
        "via": ["IST"],
        "reason": "계획서의 에스비에르 출국 대신 전날 코펜하겐 이동 후 1회 환승",
    },
    {
        "id": "compare_rmq_ams",
        "label": "비교 · 타이중 → 홍콩 → 암스테르담",
        "date": "2026-09-04",
        "origin": "RMQ",
        "destination": "AMS",
        "max_stops": 1,
        "preferred_departure": "13:35",
        "preferred_arrival": "06:55",
        "via": ["HKG"],
        "reason": "계획서의 홍콩 경유 선택지 비교",
    },
    {
        "id": "compare_ams_ham",
        "label": "비교 · 암스테르담 → 함부르크 직항",
        "date": "2026-09-07",
        "origin": "AMS",
        "destination": "HAM",
        "max_stops": 0,
        "preferred_departure": "20:50",
        "preferred_arrival": "21:55",
        "reason": "계획서 항공과 로테르담발 국제열차 비교",
    },
    {
        "id": "compare_bll_icn",
        "label": "비교 · 빌룬 → 인천",
        "date": "2026-09-11",
        "origin": "BLL",
        "destination": "ICN",
        "max_stops": 1,
        "preferred_departure": "18:50",
        "preferred_arrival": "09:55",
        "via": ["FRA"],
        "reason": "에스비에르에서 빌룬공항으로 이동하는 대안 비교",
    },
    {
        "id": "compare_cph_direct",
        "label": "비교 · 코펜하겐 → 인천 직항",
        "date": "2026-09-11",
        "origin": "CPH",
        "destination": "ICN",
        "max_stops": 0,
        "preferred_departure": "23:55",
        "preferred_arrival": "18:35",
        "reason": "귀국 직항의 시간·가격 비교",
    },
]

AIRLINE_ALIASES = {
    "TW": "티웨이항공",
}


def time_text(value: list[int | None] | None) -> str:
    value = value or []
    hour = 0 if not value or value[0] is None else int(value[0])
    minute = 0 if len(value) < 2 or value[1] is None else int(value[1])
    return f"{hour:02d}:{minute:02d}"


def date_text(value: list[int] | None) -> str:
    if not value or len(value) < 3:
        raise ValueError("운항 날짜가 누락되었습니다.")
    return f"{int(value[0]):04d}-{int(value[1]):02d}-{int(value[2]):02d}"


def parse_offers(html: str) -> list[dict[str, Any]]:
    parser = LexborHTMLParser(html)
    script = parser.css_first(r"script.ds\:1")
    if script is None:
        raise RuntimeError("Google Flights 응답에서 운임 데이터를 찾지 못했습니다.")
    js = script.text()
    data = js.split("data:", 1)[1].rsplit(",", 1)[0]
    payload = json.loads(data)
    raw_rows = payload[3][0] or []
    offers: list[dict[str, Any]] = []

    for row in raw_rows:
        try:
            price = int(row[1][0][1])
            flight = row[0]
            legs = []
            for item in flight[2] or []:
                legs.append(
                    {
                        "origin": item[3],
                        "destination": item[6],
                        "departure_date": date_text(item[20]),
                        "departure_time": time_text(item[8]),
                        "arrival_date": date_text(item[21]),
                        "arrival_time": time_text(item[10]),
                        "duration_minutes": int(item[11]),
                        "aircraft": item[17] or "",
                    }
                )
            if not legs:
                continue
            offers.append(
                {
                    "price": price,
                    "carrier_code": flight[0],
                    "airlines": (
                        [AIRLINE_ALIASES[flight[0]]]
                        if flight[0] in AIRLINE_ALIASES
                        else list(flight[1] or [])
                    ),
                    "legs": legs,
                }
            )
        except (IndexError, TypeError, ValueError):
            # Google may include an unpriced "more flights" placeholder.
            continue

    if not offers:
        raise RuntimeError("유효한 가격이 있는 검색 결과가 없습니다.")
    return sorted(offers, key=lambda item: item["price"])


def serialize_offer(offer: dict[str, Any]) -> dict[str, Any]:
    total = int(offer["price"])
    legs = offer["legs"]
    return {
        "total_krw": total,
        "per_person_krw": round(total / 4),
        "airlines": offer["airlines"],
        "carrier_code": offer["carrier_code"],
        "stops": max(0, len(legs) - 1),
        "legs": legs,
    }


def preferred_offer(
    offers: list[dict[str, Any]], route: dict[str, Any]
) -> dict[str, Any] | None:
    wanted_times = route.get("preferred_departures")
    if not wanted_times and route.get("preferred_departure"):
        wanted_times = [route["preferred_departure"]]
    wanted_arrival = route.get("preferred_arrival")
    wanted_via = route.get("via", [])

    for offer in offers:
        legs = offer["legs"]
        if wanted_times and legs[0]["departure_time"] not in wanted_times:
            continue
        if wanted_arrival and legs[-1]["arrival_time"] != wanted_arrival:
            continue
        via = [leg["destination"] for leg in legs[:-1]]
        if wanted_via and via != wanted_via:
            continue
        return offer
    return None


def load_previous(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def fetch_route(route: dict[str, Any]) -> dict[str, Any]:
    query = create_query(
        flights=[
            FlightQuery(
                date=route["date"],
                from_airport=route["origin"],
                to_airport=route["destination"],
            )
        ],
        seat="economy",
        trip="one-way",
        passengers=Passengers(adults=4),
        language="ko",
        currency="KRW",
        max_stops=route["max_stops"],
    )
    offers = parse_offers(fetch_flights_html(query))
    cheapest = offers[0]
    selected = preferred_offer(offers, route)
    selected_fallback = selected is None
    selected = selected or cheapest
    return {
        "label": route["label"],
        "date": route["date"],
        "origin": route["origin"],
        "destination": route["destination"],
        "query_url": query.url(),
        "lowest": serialize_offer(cheapest),
        "selected": serialize_offer(selected),
        "selected_reason": route["reason"],
        "selected_fallback": selected_fallback,
        "status": "ok",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default=str(Path(__file__).resolve().parents[1] / "flight-prices.json"),
    )
    args = parser.parse_args()
    output = Path(args.output)
    previous = load_previous(output)
    previous_fares = previous.get("fares", {})
    fares: dict[str, Any] = {}
    errors: list[str] = []

    results: dict[str, dict[str, Any]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        future_routes = {
            executor.submit(fetch_route, route): route for route in ROUTES
        }
        for future in concurrent.futures.as_completed(future_routes):
            route = future_routes[future]
            try:
                results[route["id"]] = future.result()
            except Exception as exc:
                errors.append(f'{route["id"]}: {exc}')
                prior = previous_fares.get(route["id"])
                if prior:
                    results[route["id"]] = {
                        **prior,
                        "status": "stale",
                        "error": str(exc),
                    }
                else:
                    results[route["id"]] = {
                        "label": route["label"],
                        "date": route["date"],
                        "origin": route["origin"],
                        "destination": route["destination"],
                        "status": "error",
                        "error": str(exc),
                    }
    fares = {route["id"]: results[route["id"]] for route in ROUTES}

    now = datetime.now(timezone.utc).replace(microsecond=0)
    payload = {
        "schema_version": 2,
        "source": "Google Flights",
        "source_library": "fast-flights 3.0.1 + robust priced-offer parser",
        "currency": "KRW",
        "passengers": 4,
        "cabin": "economy",
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "fresh_until": (now + timedelta(hours=2)).isoformat().replace("+00:00", "Z"),
        "fare_scope": "Google Flights가 표시한 성인 4명 총액. 위탁수하물·좌석·결제수수료는 최종 예약화면에서 추가될 수 있음.",
        "fares": fares,
        "errors": errors,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    temp = output.with_suffix(".tmp")
    temp.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temp.replace(output)
    print(json.dumps(payload, ensure_ascii=False))
    return 0 if not errors else 2


if __name__ == "__main__":
    raise SystemExit(main())
