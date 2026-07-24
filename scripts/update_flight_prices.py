#!/usr/bin/env python3
"""Refresh the dashboard's Google Flights price snapshot.

Prices are the total shown by Google Flights for four adults in economy.
The cheapest itinerary and the timetable-compatible itinerary are stored
separately so the dashboard never labels a more convenient flight as the
absolute cheapest one.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fast_flights import FlightQuery, Passengers, create_query, get_flights


ROUTES = [
    {
        "id": "f1",
        "label": "인천 → 코펜하겐",
        "date": "2026-09-02",
        "origin": "ICN",
        "destination": "CPH",
        "max_stops": 0,
        "preferred_departure": "23:45",
        "reason": "사용자 지정 9월 2일 저녁 출국 직항",
    },
    {
        "id": "f2",
        "label": "암스테르담 → 오슬로",
        "date": "2026-09-06",
        "origin": "AMS",
        "destination": "OSL",
        "max_stops": 0,
        "preferred_departure": "09:20",
        "reason": "오슬로 관광시간 확보",
    },
    {
        "id": "f3",
        "label": "오슬로 → 타이베이",
        "date": "2026-09-07",
        "origin": "OSL",
        "destination": "TPE",
        "max_stops": 1,
        "preferred_departure": "06:45",
        "via": ["FRA"],
        "reason": "1회 환승·9월 8일 06:15 도착",
    },
    {
        "id": "f4",
        "label": "타이중 → 홍콩",
        "date": "2026-09-11",
        "origin": "RMQ",
        "destination": "HKG",
        "max_stops": 0,
        "preferred_departure": "10:25",
        "reason": "홍콩 당일관광 시간 확보",
    },
    {
        "id": "f5",
        "label": "홍콩 → 인천",
        "date": "2026-09-11",
        "origin": "HKG",
        "destination": "ICN",
        "max_stops": 0,
        "preferred_departure": "21:00",
        "reason": "홍콩 체류시간을 늘리는 야간편",
    },
]


def time_text(value: list[int | None]) -> str:
    hour = 0 if not value or value[0] is None else int(value[0])
    minute = 0 if len(value) < 2 or value[1] is None else int(value[1])
    return f"{hour:02d}:{minute:02d}"


def date_text(value: list[int]) -> str:
    return f"{int(value[0]):04d}-{int(value[1]):02d}-{int(value[2]):02d}"


def serialize_offer(offer: Any) -> dict[str, Any]:
    legs = []
    for leg in offer.flights:
        legs.append(
            {
                "origin": leg.from_airport.code,
                "destination": leg.to_airport.code,
                "departure_date": date_text(leg.departure.date),
                "departure_time": time_text(leg.departure.time),
                "arrival_date": date_text(leg.arrival.date),
                "arrival_time": time_text(leg.arrival.time),
                "duration_minutes": int(leg.duration),
                "aircraft": leg.plane_type or "",
            }
        )
    total = int(offer.price)
    return {
        "total_krw": total,
        "per_person_krw": round(total / 4),
        "airlines": list(offer.airlines),
        "carrier_code": offer.type,
        "stops": max(0, len(legs) - 1),
        "legs": legs,
    }


def preferred_offer(offers: list[Any], route: dict[str, Any]) -> Any | None:
    wanted_time = route.get("preferred_departure")
    wanted_via = route.get("via", [])
    for offer in offers:
        if not offer.flights:
            continue
        first_time = time_text(offer.flights[0].departure.time)
        via = [leg.to_airport.code for leg in offer.flights[:-1]]
        if wanted_time and first_time != wanted_time:
            continue
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
    offers = list(get_flights(query))
    if not offers:
        raise RuntimeError("검색 결과가 없습니다.")
    cheapest = min(offers, key=lambda item: int(item.price))
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

    for route in ROUTES:
        try:
            fares[route["id"]] = fetch_route(route)
        except Exception as exc:  # keep the last good fare if Google blocks one query
            errors.append(f'{route["id"]}: {exc}')
            prior = previous_fares.get(route["id"])
            if prior:
                fares[route["id"]] = {
                    **prior,
                    "status": "stale",
                    "error": str(exc),
                }
            else:
                fares[route["id"]] = {
                    "label": route["label"],
                    "date": route["date"],
                    "origin": route["origin"],
                    "destination": route["destination"],
                    "status": "error",
                    "error": str(exc),
                }

    now = datetime.now(timezone.utc).replace(microsecond=0)
    payload = {
        "schema_version": 1,
        "source": "Google Flights",
        "source_library": "fast-flights 3.0.1",
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
