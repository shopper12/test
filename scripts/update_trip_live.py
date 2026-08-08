#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

from fast_flights import FlightQuery, Passengers, create_query
from fast_flights.fetcher import fetch_flights_html

sys.path.insert(0, str(Path(__file__).resolve().parent))
from update_flight_prices import parse_offers, serialize_offer

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "trip-live.json"
FARES = ROOT / "flight-prices.json"

DAYS = [
    ("2026-09-02", "Taichung", 24.1477, 120.6736, "taiwan"),
    ("2026-09-03", "Taichung / Lukang", 24.0766, 120.4350, "taiwan"),
    ("2026-09-04", "Taichung / Taoyuan", 25.0330, 121.5654, "taiwan"),
    ("2026-09-05", "Rotterdam", 51.9244, 4.4777, "rotterdam"),
    ("2026-09-06", "Rotterdam / Kinderdijk", 51.9244, 4.4777, "rotterdam"),
    ("2026-09-07", "Rotterdam / Rijswijk", 51.9244, 4.4777, "rotterdam"),
    ("2026-09-08", "Hamburg", 53.5511, 9.9937, "hamburg"),
    ("2026-09-09", "Hamburg / Esbjerg", 55.4765, 8.4594, "esbjerg"),
    ("2026-09-10", "Esbjerg / Copenhagen", 55.4765, 8.4594, "esbjerg"),
    ("2026-09-11", "Copenhagen", 55.6761, 12.5683, "copenhagen"),
    ("2026-09-12", "Incheon", 37.4563, 126.7052, "incheon"),
]

BASELINES = {
    "taiwan": dict(temp_min_c=24, temp_max_c=31, precip_probability_pct=55, wind_max_kmh=24, summary="덥고 습하며 소나기·태풍 영향 가능", clothing="반팔+통풍 좋은 긴바지, 실내 냉방용 얇은 겉옷", umbrella=True),
    "rotterdam": dict(temp_min_c=12, temp_max_c=20, precip_probability_pct=40, wind_max_kmh=28, summary="선선하고 바람·간헐적 비 가능", clothing="긴팔+경량 방풍재킷, 방수 신발 권장", umbrella=True),
    "hamburg": dict(temp_min_c=11, temp_max_c=19, precip_probability_pct=45, wind_max_kmh=27, summary="선선하고 흐림·비 변동성 큼", clothing="긴팔+얇은 니트/재킷, 방수 겉옷", umbrella=True),
    "esbjerg": dict(temp_min_c=11, temp_max_c=18, precip_probability_pct=50, wind_max_kmh=34, summary="북해 바람이 강하고 체감온도 낮을 수 있음", clothing="방풍·방수 재킷, 얇은 레이어드", umbrella=True),
    "copenhagen": dict(temp_min_c=11, temp_max_c=19, precip_probability_pct=40, wind_max_kmh=28, summary="선선하고 바람·짧은 비 가능", clothing="긴팔+경량 방풍재킷", umbrella=True),
    "incheon": dict(temp_min_c=19, temp_max_c=27, precip_probability_pct=35, wind_max_kmh=20, summary="초가을, 습도와 비 가능성 확인 필요", clothing="반팔/긴팔 혼용+얇은 겉옷", umbrella=True),
}

PHOTOS = {
    "TIPC Port of Taichung": ["Port of Taichung Taiwan", "TIPC", "Taichung Port"],
    "VESTAS O&M Base": ["Vestas offshore wind", "Vestas", "offshore wind turbine"],
    "Holiday Inn Express Taichung Park": ["Taichung Park", "Holiday Inn Taichung"],
    "Wuqi Fishing Harbor": ["Wuqi Fishing Port", "Wuqi Fishing Harbor"],
    "Gaomei Wetlands": ["Gaomei Wetlands", "Gaomei"],
    "Lukang Old Street": ["Lukang Old Street", "Lukang"],
    "National Taichung Theater": ["National Taichung Theater"],
    "Schiphol Airport": ["Amsterdam Airport Schiphol"],
    "Holiday Inn Express Rotterdam Central": ["Rotterdam Centraal", "Rotterdam"],
    "Markthal Rotterdam": ["Markthal Rotterdam"],
    "Cube Houses": ["Cube houses Rotterdam", "Kubuswoningen"],
    "Historic Delfshaven": ["Delfshaven Rotterdam"],
    "Restaurant Bazar": ["Witte de Withstraat Rotterdam", "Rotterdam Bazar"],
    "Kinderdijk": ["Kinderdijk windmills"],
    "Port of Rotterdam Authority": ["World Port Center Rotterdam", "Port of Rotterdam"],
    "Rotterdam Offshore Group": ["Port of Rotterdam offshore", "Rotterdam port"],
    "TNO Kesslerpark": ["Rijswijk Netherlands", "TNO Netherlands"],
    "Motel One Hamburg-Fleetinsel": ["Fleetinsel Hamburg", "Hamburg Fleet"],
    "Speicherstadt": ["Speicherstadt Hamburg"],
    "Skyborn Renewables": ["HafenCity Hamburg", "offshore wind Hamburg"],
    "Elbphilharmonie": ["Elbphilharmonie Hamburg"],
    "Oberhafen-Kantine": ["Oberhafen Hamburg"],
    "CABINN Plus Esbjerg": ["Esbjerg Denmark city"],
    "Men at Sea": ["Men at Sea Esbjerg"],
    "Esbjerg Street Food": ["Esbjerg Denmark"],
    "Blue Water Shipping": ["Port of Esbjerg", "Esbjerg harbor"],
    "CABINN Metro": ["Orestad Copenhagen", "Copenhagen Orestad"],
    "Field's Food Court": ["Fields Copenhagen", "Orestad Copenhagen"],
    "Copenhagen Airport": ["Copenhagen Airport"],
}

STOP_CITIES = {
    "PVG": {"city":"상하이", "plan":"푸동공항→Maglev/Metro로 루자쭈이·와이탄 짧은 동선. 공항 재도착은 국제선 출발 3시간 전 목표.", "query":"The Bund Shanghai"},
    "PEK": {"city":"베이징", "plan":"공항철도→둥즈먼 후 왕푸징·톈안먼 외곽 중심의 짧은 동선. 교통체증을 고려해 3시간 이상 공항 버퍼 확보.", "query":"Wangfujing Beijing"},
    "PKX": {"city":"베이징", "plan":"다싱공항철도 이용. 도심 체류를 짧게 잡고 국제선 3시간 전 공항 복귀.", "query":"Qianmen Beijing"},
    "HKG": {"city":"홍콩", "plan":"Airport Express→Hong Kong Station, Central·Victoria Harbour 중심 3~4시간 관광 후 공항 복귀.", "query":"Central Hong Kong Victoria Harbour"},
    "TPE": {"city":"타이베이", "plan":"Airport MRT→Taipei Main Station, 중정기념당·시먼딩 중 1~2곳만 선택 후 공항 복귀.", "query":"Chiang Kai-shek Memorial Hall Taipei"},
    "NRT": {"city":"도쿄", "plan":"Narita Express/Skyliner로 우에노·도쿄역 권역 중 한 곳만 방문. 공항 복귀시간을 넉넉히 확보.", "query":"Ueno Tokyo"},
    "HND": {"city":"도쿄", "plan":"모노레일/게이큐로 시나가와·하마마쓰초·도쿄역 권역의 짧은 관광 후 복귀.", "query":"Tokyo Station"},
    "KIX": {"city":"오사카", "plan":"난카이/하루카로 난바 또는 우메다 한 곳만 방문 후 간사이공항으로 복귀.", "query":"Dotonbori Osaka"},
}


def get_json(url: str, timeout: int = 25):
    req = Request(url, headers={"User-Agent":"offshore-trip-dashboard/3.0 (+https://shopper12.github.io/test/)"})
    with urlopen(req, timeout=timeout) as r:
        return json.load(r)


def weather_row(date: str, city: str, lat: float, lon: float, baseline_key: str):
    target = datetime.fromisoformat(date).date()
    today = datetime.now(timezone.utc).date()
    if today <= target <= today + timedelta(days=16):
        params = urlencode({
            "latitude":lat,"longitude":lon,"timezone":"auto","start_date":date,"end_date":date,
            "daily":"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        })
        try:
            data=get_json("https://api.open-meteo.com/v1/forecast?"+params)
            d=data.get("daily",{})
            tmax=round(float(d.get("temperature_2m_max",[None])[0]),1)
            tmin=round(float(d.get("temperature_2m_min",[None])[0]),1)
            pop=int(d.get("precipitation_probability_max",[0])[0] or 0)
            wind=round(float(d.get("wind_speed_10m_max",[0])[0] or 0),1)
            code=int(d.get("weather_code",[0])[0] or 0)
            if code>=95: summary="뇌우 가능"
            elif code>=80: summary="소나기 가능"
            elif code>=61: summary="비 가능"
            elif code>=51: summary="이슬비 가능"
            elif code>=45: summary="안개·흐림 가능"
            elif code>=3: summary="흐림"
            elif code>=1: summary="대체로 맑음"
            else: summary="맑음"
            base=BASELINES[baseline_key]
            clothing=base["clothing"]
            if tmax<17: clothing="긴팔+재킷/니트 레이어드"
            elif tmax>27: clothing="통풍 좋은 여름옷+실내 냉방용 얇은 겉옷"
            return {"city":city,"kind":"forecast","summary":summary,"temp_min_c":tmin,"temp_max_c":tmax,"precip_probability_pct":pop,"wind_max_kmh":wind,"clothing":clothing,"umbrella":pop>=35,"source":"Open-Meteo"}
        except Exception as exc:
            fallback=dict(BASELINES[baseline_key]); fallback.update(city=city,kind="climate_baseline",source="seasonal baseline",error=str(exc)); return fallback
    fallback=dict(BASELINES[baseline_key]); fallback.update(city=city,kind="climate_baseline",source="September seasonal baseline"); return fallback


def commons_photo(search_terms: list[str]):
    for term in search_terms:
        try:
            params=urlencode({"action":"query","format":"json","generator":"search","gsrsearch":term,"gsrnamespace":6,"gsrlimit":5,"prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":640,"origin":"*"})
            data=get_json("https://commons.wikimedia.org/w/api.php?"+params)
            pages=list((data.get("query",{}).get("pages",{}) or {}).values())
            for p in pages:
                info=(p.get("imageinfo") or [{}])[0]
                url=info.get("thumburl") or info.get("url")
                if not url: continue
                meta=info.get("extmetadata") or {}
                credit=(meta.get("Artist") or {}).get("value") or "Wikimedia Commons"
                credit=credit.replace("<span>","").replace("</span>","")[:120]
                page_url="https://commons.wikimedia.org/wiki/"+quote(p.get("title","").replace(" ","_"),safe=":_/()")
                return {"url":url,"page_url":page_url,"credit":credit,"aliases":search_terms,"query":term}
        except Exception:
            continue
    return {"url":"","page_url":"","credit":"","aliases":search_terms,"query":search_terms[0]}


def parse_dt(date: str, time: str):
    return datetime.fromisoformat(f"{date}T{time}:00")


def stopover_candidate():
    query=create_query(flights=[FlightQuery(date="2026-09-11",from_airport="CPH",to_airport="ICN")],seat="economy",trip="one-way",passengers=Passengers(adults=4),language="ko",currency="KRW",max_stops=1)
    offers=parse_offers(fetch_flights_html(query))
    eligible=[]
    for o in offers:
        legs=o.get("legs") or []
        if len(legs)!=2: continue
        via=legs[0]["destination"]
        if via not in STOP_CITIES: continue
        if legs[1]["duration_minutes"]>300: continue
        arr=parse_dt(legs[0]["arrival_date"],legs[0]["arrival_time"])
        dep=parse_dt(legs[1]["departure_date"],legs[1]["departure_time"])
        if arr.date()!=dep.date(): continue
        layover=(dep-arr).total_seconds()/3600
        if layover<6 or layover>14: continue
        if arr.hour>15 or dep.hour<14: continue
        eligible.append((o,layover,via))
    current=None
    try:
        current=json.loads(FARES.read_text(encoding="utf-8")).get("fares",{}).get("route_f3",{}).get("selected",{}).get("total_krw")
    except Exception:
        pass
    if not eligible:
        return {"recommended":False,"reason":"6~14시간 당일 경유·동아시아 마지막 구간 5시간 이내 조건을 만족하는 더 나은 후보를 찾지 못했습니다.","query_url":query.url()}
    eligible.sort(key=lambda x:x[0]["price"])
    offer,layover,via=eligible[0]
    ser=serialize_offer(offer); info=STOP_CITIES[via]
    delta=int(ser["total_krw"])-int(current) if current else None
    recommended=current is not None and int(ser["total_krw"])<int(current)
    return {"recommended":recommended,"via_airport":via,"via_city":info["city"],"layover_hours":round(layover,1),"total_krw":ser["total_krw"],"per_person_krw":ser["per_person_krw"],"price_delta_vs_current_krw":delta,"current_total_krw":current,"sightseeing_plan":info["plan"],"city_map_url":"https://www.google.com/maps/search/?api=1&query="+quote(info["query"]),"query_url":query.url(),"legs":ser["legs"],"reason":"현재 채택편보다 저렴할 때만 추천 표시" if recommended else "관광 가능 후보는 있으나 현재 채택편보다 저렴하지 않아 유지"}


def main():
    now=datetime.now(timezone.utc).replace(microsecond=0)
    previous={}
    if OUTPUT.exists():
        try: previous=json.loads(OUTPUT.read_text(encoding="utf-8"))
        except Exception: previous={}
    weather={date:weather_row(date,city,lat,lon,key) for date,city,lat,lon,key in DAYS}
    photos={}
    old_photos=previous.get("photos",{})
    for name,aliases in PHOTOS.items():
        old=old_photos.get(name) or {}
        photos[name]=old if old.get("url") else commons_photo([name,*aliases])
    try: stopover=stopover_candidate()
    except Exception as exc:
        stopover=previous.get("return_stopover") or {"recommended":False,"reason":f"귀국 경유편 조회 오류: {exc}"}
    payload={"schema_version":3,"generated_at":now.isoformat().replace("+00:00","Z"),"fresh_until":(now+timedelta(hours=2)).isoformat().replace("+00:00","Z"),"weather":weather,"photos":photos,"return_stopover":stopover,"sources":{"weather":"Open-Meteo forecast (up to 16 days) + seasonal baseline until forecast window","photos":"Wikimedia Commons API","return_fares":"Google Flights via fast-flights"}}
    OUTPUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(payload,ensure_ascii=False))

if __name__=="__main__": main()
