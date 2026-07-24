#!/usr/bin/env python3
"""Refresh both dashboard itineraries' Google Flights price snapshots.

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
        "id": "eu_f1",
        "label": "유럽 선행 · 인천 → 코펜하겐",
        "date": "2026-09-02",
        "origin": "ICN",
        "destination": "CPH",
        "max_stops": 1,
        "preferred_departure": "22:45",
        "preferred_arrival": "13:15",
        "via": ["DXB"],
        "reason": "직항 대비 대폭 절감하는 두바이 1회 환승",
    },
    {
        "id": "eu_out_direct",
        "label": "비교 · 인천 → 코펜하겐 직항",
        "date": "2026-09-02",
        "origin": "ICN",
        "destination": "CPH",
        "max_stops": 0,
        "preferred_departure": "23:35",
        "reason": "출국 직항 비교",
    },
    {
        "id": "eu_f2",
        "label": "유럽 선행 · 암스테르담 → 오슬로",
        "date": "2026-09-06",
        "origin": "AMS",
        "destination": "OSL",
        "max_stops": 0,
        "preferred_departure": "11:55",
        "reason": "로테르담 출발시간과 오슬로 관광시간 균형",
    },
    {
        "id": "eu_f3",
        "label": "유럽 선행 · 오슬로 → 타이베이",
        "date": "2026-09-07",
        "origin": "OSL",
        "destination": "TPE",
        "max_stops": 1,
        "preferred_departure": "06:45",
        "preferred_arrival": "06:15",
        "via": ["FRA"],
        "reason": "1회 환승·9월 8일 오전 도착",
    },
    {
        "id": "eu_f4",
        "label": "유럽 선행 · 타이중 → 인천 직항",
        "date": "2026-09-11",
        "origin": "RMQ",
        "destination": "ICN",
        "max_stops": 0,
        "preferred_departure": "17:00",
        "reason": "홍콩을 삭제한 최저가 직항 귀국",
    },
    {
        "id": "eu_hk_1",
        "label": "비교 · 타이중 → 홍콩",
        "date": "2026-09-11",
        "origin": "RMQ",
        "destination": "HKG",
        "max_stops": 0,
        "preferred_departure": "10:25",
        "reason": "삭제한 홍콩 당일경유 비교",
    },
    {
        "id": "eu_hk_2",
        "label": "비교 · 홍콩 → 인천",
        "date": "2026-09-11",
        "origin": "HKG",
        "destination": "ICN",
        "max_stops": 0,
        "preferred_departure": "21:00",
        "reason": "삭제한 홍콩 당일경유 비교",
    },
    {
        "id": "tw_f1",
        "label": "대만 선행 · 인천 → 타이베이",
        "date": "2026-09-02",
        "origin": "ICN",
        "destination": "TPE",
        "max_stops": 0,
        "preferred_departure": "20:05",
        "reason": "사용자 지정 저녁 출국 직항",
    },
    {
        "id": "tw_f2",
        "label": "대만 선행 · 타이베이 → 함부르크",
        "date": "2026-09-05",
        "origin": "TPE",
        "destination": "HAM",
        "max_stops": 1,
        "preferred_departure": "23:50",
        "preferred_arrival": "13:35",
        "via": ["DXB"],
        "reason": "일요일 오후 함부르크 관광시간 확보",
    },
    {
        "id": "tw_f3",
        "label": "대만 선행 · 빌룬 → 오슬로",
        "date": "2026-09-08",
        "origin": "BLL",
        "destination": "OSL",
        "max_stops": 0,
        "preferred_departure": "09:40",
        "reason": "오슬로 관광시간 확보",
    },
    {
        "id": "tw_f4",
        "label": "대만 선행 · 오슬로 → 암스테르담",
        "date": "2026-09-09",
        "origin": "OSL",
        "destination": "AMS",
        "max_stops": 0,
        "preferred_departure": "08:00",
        "reason": "네덜란드 평일 업무시간 확보",
    },
    {
        "id": "tw_f5",
        "label": "대만 선행 · 암스테르담 → 인천",
        "date": "2026-09-11",
        "origin": "AMS",
        "destination": "ICN",
        "max_stops": 0,
        "preferred_departure": "21:35",
        "reason": "암스테르담 관광 후 9월 12일 귀국",
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
