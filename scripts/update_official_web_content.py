#!/usr/bin/env python3
from __future__ import annotations

import html as html_lib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "trip-live.json"
USER_AGENT = "offshore-wind-benchmark-trip/5.0 (+https://shopper12.github.io/test/)"

# Only first-party venue/company/hotel/official tourism pages are used for photos.
# If a page blocks automated access or does not expose a representative meta image,
# no image is emitted. Wikimedia/stock fallbacks are deliberately prohibited.
PHOTO_PAGES = {
    "TIPC Port of Taichung": "https://tc.twport.com.tw/en",
    "VESTAS O&M Base": "https://www.vestas.com/en/energy-solutions/offshore-wind-turbines",
    "Holiday Inn Express Taichung Park": "https://www.ihg.com/holidayinnexpress/hotels/us/en/taichung/txgsr/hoteldetail",
    "Wuqi Fishing Harbor": "https://travel.taichung.gov.tw/en",
    "Gaomei Wetlands": "https://travel.taichung.gov.tw/en",
    "Lukang Old Street": "https://tourism.chcg.gov.tw/",
    "National Taichung Theater": "https://www.npac-ntt.org/en",
    "Chun Shui Tang Siwei Original Store": "https://www.chunshuitang.com.tw/en/location-detail/original_store/",
    "Schiphol Airport": "https://www.schiphol.nl/en/",
    "Holiday Inn Express Rotterdam Central": "https://www.ihg.com/holidayinnexpress/hotels/us/en/rotterdam/rtmcs/hoteldetail",
    "Holiday Inn Express Rotterdam Central Station": "https://www.ihg.com/holidayinnexpress/hotels/us/en/rotterdam/rtmcs/hoteldetail",
    "Markthal Rotterdam": "https://markthal.nl/en/",
    "Cube Houses": "https://www.rotterdam.info/en/visit/guide",
    "Historic Delfshaven": "https://www.rotterdam.info/en/visit/guide",
    "Restaurant Bazar": "https://hotelbazar.nl/en/restaurant-bazar/",
    "Kinderdijk": "https://kinderdijk.com/",
    "Port of Rotterdam Authority": "https://www.portofrotterdam.com/en",
    "Rotterdam Offshore Group": "https://www.rotterdamoffshore.com/",
    "TNO Kesslerpark": "https://www.tno.nl/en/about-tno/contact/locations/rijswijk-kesslerpark/",
    "Motel One Hamburg-Fleetinsel": "https://www.motel-one.com/en/hotels/hamburg/hotel-hamburg-fleetinsel/",
    "Speicherstadt": "https://www.hamburg.com/visitors/sights/maritime/",
    "Skyborn Renewables": "https://www.skybornrenewables.com/",
    "Elbphilharmonie": "https://www.elbphilharmonie.de/en/",
    "Oberhafen-Kantine": "https://www.oberhafenkantine-hamburg.de/",
    "CABINN Plus Esbjerg": "https://en.cabinn.com/hotel/cabinn-plus-esbjerg",
    "Men at Sea": "https://www.visitdenmark.com/denmark/plan-your-trip/men-sea-gdk610143",
    "Esbjerg Street Food": "https://esbjergstreetfood.dk/",
    "Blue Water Shipping": "https://www.bws.net/contact/denmark/esbjerg",
    "CABINN Metro": "https://en.cabinn.com/hotel/cabinn-metro",
    "Field's Food Court": "https://fields.steenstrom.dk/",
    "Copenhagen Airport": "https://www.cph.dk/en",
}

# Forecast cards are intentionally fail-closed: no climatology, normals, or historical
# substitutions. Until the national authority publishes the target time, the dashboard
# says "official forecast not published" instead of fabricating a value.
WEATHER = {
    "2026-09-02": [dict(city="Taichung", aliases=["Taichung","Wuqi","Port of Taichung"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.1477, lon=120.6736)],
    "2026-09-03": [dict(city="Taichung / Changhua", aliases=["Taichung","Changhua","OEG"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.0756, lon=120.5440)],
    "2026-09-04": [dict(city="Taichung", aliases=["Taichung"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.1477, lon=120.6736),dict(city="Taoyuan / TPE", aliases=["Taoyuan","TPE"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=25.0797, lon=121.2342)],
    "2026-09-05": [dict(city="Amsterdam", aliases=["Amsterdam","Schiphol","Sloterdijk","Urban Lodge"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=52.3676, lon=4.9041)],
    "2026-09-06": [dict(city="Amsterdam", aliases=["Amsterdam","Urban Lodge"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=52.3676, lon=4.9041)],
    "2026-09-07": [dict(city="Amsterdam / Den Helder", aliases=["Amsterdam","Den Helder","OEG Subsea","Schiphol"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=52.9563, lon=4.7608),dict(city="Hamburg", aliases=["Hamburg","HAM"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937)],
    "2026-09-08": [dict(city="Hamburg", aliases=["Hamburg","OWC","DNV"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937)],
    "2026-09-09": [dict(city="Hamburg", aliases=["Hamburg","Skyborn"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937),dict(city="Esbjerg", aliases=["Esbjerg","Hotel Britannia"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2622447/Esbjerg", horizon=216, lat=55.4765, lon=8.4594)],
    "2026-09-10": [dict(city="Esbjerg", aliases=["Esbjerg","Blue Water"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2622447/Esbjerg", horizon=216, lat=55.4765, lon=8.4594),dict(city="Aarhus", aliases=["Aarhus","OWC Denmark"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2624652/Aarhus", horizon=216, lat=56.1629, lon=10.2039)],
    "2026-09-11": [dict(city="Esbjerg", aliases=["Esbjerg","EBJ"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2622447/Esbjerg", horizon=216, lat=55.4765, lon=8.4594),dict(city="Aberdeen", aliases=["Aberdeen","ABZ"], country="United Kingdom", authority="Met Office", url="https://www.metoffice.gov.uk/weather/forecast/gfnm4z8f4", horizon=168, lat=57.1497, lon=-2.0943),dict(city="Amsterdam", aliases=["Amsterdam","AMS","Schiphol"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=52.3676, lon=4.9041)],
    "2026-09-12": [dict(city="Incheon", aliases=["Incheon","ICN"], country="South Korea", authority="Korea Meteorological Administration (KMA)", url="https://www.weather.go.kr/neng/forecast/short-term.do", horizon=240, lat=37.4602, lon=126.4407)],
}

META_PATTERNS = [
    r'<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)',
    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image(?::secure_url)?["\']',
    r'<meta[^>]+name=["\']twitter:image(?::src)?["\'][^>]+content=["\']([^"\']+)',
    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image(?::src)?["\']',
]


def fetch_text(url: str, timeout: int = 25) -> str:
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en,ko;q=0.8"})
    with urlopen(req, timeout=timeout) as response:
        raw = response.read(2_500_000)
        charset = response.headers.get_content_charset() or "utf-8"
        return raw.decode(charset, errors="replace")


def page_title(text: str) -> str:
    match = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
    if not match:
        return "official website"
    return re.sub(r"\s+", " ", html_lib.unescape(re.sub(r"<[^>]+>", "", match.group(1)))).strip()[:140]


def official_photo(name: str, page_url: str) -> dict:
    try:
        text = fetch_text(page_url)
        image = ""
        for pattern in META_PATTERNS:
            match = re.search(pattern, text, re.I | re.S)
            if match:
                image = html_lib.unescape(match.group(1).strip())
                break
        if not image:
            # JSON-LD image is still first-party page metadata, not a third-party image search.
            match = re.search(r'"image"\s*:\s*(?:\[\s*)?["\']([^"\']+)', text, re.I | re.S)
            if match:
                image = html_lib.unescape(match.group(1).strip())
        if image:
            image = urljoin(page_url, image)
        return {
            "url": image,
            "page_url": page_url,
            "credit": page_title(text),
            "source": "official_website",
            "official": True,
            "name": name,
        }
    except Exception as exc:
        return {
            "url": "",
            "page_url": page_url,
            "credit": "official website",
            "source": "official_website",
            "official": True,
            "name": name,
            "error": str(exc)[:240],
        }


def extract_iso_hourly(text: str, target_date: str) -> list[dict]:
    """Best-effort extractor for official pages that embed JSON forecast series.

    It only emits records when an ISO timestamp and meteorological values are present
    together in page source. It never synthesizes or backfills values.
    """
    points: list[dict] = []
    seen = set()
    for match in re.finditer(rf"{re.escape(target_date)}T(\d{{2}}):(?:00|30)(?::00)?(?:Z|[+\-]\d{{2}}:?\d{{2}})?", text):
        hour = match.group(1) + ":00"
        if hour in seen:
            continue
        window = text[max(0, match.start()-700):min(len(text), match.end()+1200)]
        temp_m = re.search(r'(?i)(?:air[_-]?temperature|temperature|temp)\D{0,45}(-?\d{1,2}(?:\.\d+)?)', window)
        precip_m = re.search(r'(?i)(?:probability[_ -]?of[_ -]?precipitation|precipitation[_ -]?probability|rain[_ -]?probability)\D{0,45}(\d{1,3}(?:\.\d+)?)', window)
        wind_m = re.search(r'(?i)(?:wind[_ -]?speed|windspeed)\D{0,45}(\d{1,2}(?:\.\d+)?)', window)
        if not temp_m:
            continue
        row = {"time": hour, "temperature_c": float(temp_m.group(1))}
        if precip_m:
            row["precip_probability_pct"] = min(100, float(precip_m.group(1)))
        if wind_m:
            row["wind_speed"] = float(wind_m.group(1))
        points.append(row)
        seen.add(hour)
    return sorted(points, key=lambda row: row["time"])



def open_meteo_daily(target_date: str, source: dict) -> dict | None:
    """Keyless 16-day numerical guidance used only when official numeric values are not extractable.

    National meteorological authorities remain the authoritative warning/source links.
    """
    if source.get("lat") is None or source.get("lon") is None:
        return None
    params = {
        "latitude": source["lat"],
        "longitude": source["lon"],
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max",
        "timezone": "auto",
        "forecast_days": 16,
    }
    url = "https://api.open-meteo.com/v1/forecast?" + urlencode(params)
    try:
        req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
        with urlopen(req, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
        daily = data.get("daily") or {}
        times = daily.get("time") or []
        if target_date not in times:
            return None
        i = times.index(target_date)
        def val(key):
            arr = daily.get(key) or []
            return arr[i] if i < len(arr) else None
        result = {
            "provider": "Open-Meteo",
            "source_url": "https://open-meteo.com/en/docs",
            "date": target_date,
            "weather_code": val("weather_code"),
            "temperature_max_c": val("temperature_2m_max"),
            "temperature_min_c": val("temperature_2m_min"),
            "precip_probability_max_pct": val("precipitation_probability_max"),
            "precipitation_sum_mm": val("precipitation_sum"),
            "wind_speed_max_kmh": val("wind_speed_10m_max"),
            "wind_gusts_max_kmh": val("wind_gusts_10m_max"),
        }
        core = [result[k] for k in ("weather_code", "temperature_max_c", "temperature_min_c", "precip_probability_max_pct", "precipitation_sum_mm", "wind_speed_max_kmh", "wind_gusts_max_kmh")]
        return result if any(v is not None for v in core) else None
    except Exception:
        return None


def confidence_label(hours_until: float) -> str:
    if hours_until <= 168:
        return "단기예보"
    if hours_until <= 240:
        return "중기전망"
    return "장기전망"

def weather_location(target_date: str, source: dict) -> dict:
    now = datetime.now(timezone.utc)
    target = datetime.fromisoformat(target_date + "T12:00:00+00:00")
    hours_until = (target - now).total_seconds() / 3600
    row = {
        "city": source["city"],
        "aliases": source["aliases"],
        "country": source["country"],
        "authority": source["authority"],
        "source_url": source["url"],
        "forecast_horizon_hours": source["horizon"],
        "checked_at": now.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "hourly": [],
        "forecast_confidence": confidence_label(hours_until),
    }
    model = open_meteo_daily(target_date, source)
    if model:
        row["model_daily"] = model
    try:
        text = fetch_text(source["url"])
        row["source_reachable"] = True
        row["source_page_title"] = page_title(text)
    except Exception as exc:
        row["source_reachable"] = False
        row["kind"] = "official_source_error_model_support" if model else "official_source_error"
        row["reason"] = f"공식 기상기관 페이지 접근 실패: {str(exc)[:180]}" + (" · 수치예보는 보조 모델값" if model else "")
        return row

    hourly = extract_iso_hourly(text, target_date) if hours_until <= source["horizon"] else []
    if hourly:
        row["kind"] = "official_hourly"
        row["hourly"] = hourly
        row["reason"] = "공식 기상기관 페이지에 게시된 시간대별 예보를 추출했습니다."
    elif model:
        row["kind"] = "model_guidance"
        if hours_until <= source["horizon"]:
            row["reason"] = f"{source['authority']} 공식 원문을 함께 확인하십시오. 수치는 Open-Meteo 16일 수치예보 보조값이며 경보·특보보다 우선하지 않습니다."
        else:
            row["reason"] = f"{source['authority']}의 상세 수치예보 전 구간입니다. 현재 수치는 Open-Meteo 16일 수치예보의 {confidence_label(hours_until)} 보조값이며 날짜가 가까워질수록 자동 갱신됩니다."
    else:
        row["kind"] = "official_pending"
        row["reason"] = f"{source['authority']}의 상세 수치예보 발표 전입니다. 공식 원문을 계속 자동 확인합니다."
    return row


def main() -> None:
    payload = json.loads(SNAPSHOT.read_text(encoding="utf-8")) if SNAPSHOT.exists() else {}
    payload["schema_version"] = max(5, int(payload.get("schema_version", 0) or 0))
    payload["official_web_generated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    payload["photos"] = {name: official_photo(name, url) for name, url in PHOTO_PAGES.items()}
    payload["weather"] = {
        date: {
            "date": date,
            "kind": "official_weather_bundle",
            "locations": [weather_location(date, source) for source in sources],
        }
        for date, sources in WEATHER.items()
    }
    payload.setdefault("sources", {})
    payload["sources"]["photos"] = "First-party venue/company/hotel/official-tourism website metadata only; no Wikimedia/stock fallback"
    payload["sources"]["weather"] = "National meteorological authorities only (CWA, KNMI, DWD, DMI, KMA); no historical/climatology fallback"
    SNAPSHOT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "schema_version": payload["schema_version"],
        "photos_with_images": sum(bool(p.get("url")) for p in payload["photos"].values()),
        "weather_days": len(payload["weather"]),
        "hourly_points": sum(len(loc.get("hourly", [])) for day in payload["weather"].values() for loc in day["locations"]),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
