from pathlib import Path
import re

p=Path('scripts/update_official_web_content.py')
s=p.read_text(encoding='utf-8')
s=s.replace('from urllib.parse import urljoin', 'from urllib.parse import urljoin, urlencode', 1)

start=s.index('WEATHER = {')
end=s.index('\n\nMETA_PATTERNS', start)
weather='''WEATHER = {
    "2026-09-02": [
        dict(city="Taichung", aliases=["Taichung", "Wuqi", "Port of Taichung"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.1477, lon=120.6736),
    ],
    "2026-09-03": [
        dict(city="Taichung / Lukang", aliases=["Taichung", "Lukang", "VESTAS"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.0766, lon=120.3774),
    ],
    "2026-09-04": [
        dict(city="Taichung", aliases=["Taichung"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=24.1477, lon=120.6736),
        dict(city="Taoyuan / TPE", aliases=["Taoyuan", "TPE"], country="Taiwan", authority="Central Weather Administration (CWA)", url="https://www.cwa.gov.tw/V8/E/W/week.html", horizon=168, lat=25.0797, lon=121.2342),
    ],
    "2026-09-05": [
        dict(city="Amsterdam / Rotterdam", aliases=["Amsterdam", "Schiphol", "Rotterdam"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=51.9244, lon=4.4777),
    ],
    "2026-09-06": [
        dict(city="Rotterdam / Kinderdijk", aliases=["Rotterdam", "Kinderdijk"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=51.9244, lon=4.4777),
    ],
    "2026-09-07": [
        dict(city="Rotterdam / Rijswijk", aliases=["Rotterdam", "Rijswijk", "TNO"], country="Netherlands", authority="KNMI", url="https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/extra/guidance-meerdaagse", horizon=336, lat=51.9687, lon=4.3527),
        dict(city="Hamburg", aliases=["Hamburg"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937),
    ],
    "2026-09-08": [
        dict(city="Hamburg", aliases=["Hamburg", "HafenCity", "Skyborn", "OWC", "DNV"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937),
    ],
    "2026-09-09": [
        dict(city="Hamburg", aliases=["Hamburg"], country="Germany", authority="Deutscher Wetterdienst (DWD)", url="https://www.dwd.de/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html", horizon=240, lat=53.5511, lon=9.9937),
        dict(city="Esbjerg", aliases=["Esbjerg", "Men at Sea"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2622447/Esbjerg", horizon=216, lat=55.4765, lon=8.4594),
    ],
    "2026-09-10": [
        dict(city="Esbjerg", aliases=["Esbjerg", "Blue Water"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2622447/Esbjerg", horizon=216, lat=55.4765, lon=8.4594),
        dict(city="Aarhus", aliases=["Aarhus", "OWC Denmark"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2624652/Aarhus", horizon=216, lat=56.1629, lon=10.2039),
        dict(city="Copenhagen", aliases=["Copenhagen", "København", "CABINN Metro"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2618425/K%C3%B8benhavn", horizon=216, lat=55.6761, lon=12.5683),
    ],
    "2026-09-11": [
        dict(city="Copenhagen", aliases=["Copenhagen", "CPH"], country="Denmark", authority="Danish Meteorological Institute (DMI)", url="https://www.dmi.dk/lokation/show/DK/2618425/K%C3%B8benhavn", horizon=216, lat=55.6761, lon=12.5683),
    ],
    "2026-09-12": [
        dict(city="Incheon", aliases=["Incheon", "ICN"], country="South Korea", authority="Korea Meteorological Administration (KMA)", url="https://www.weather.go.kr/neng/forecast/short-term.do", horizon=240, lat=37.4602, lon=126.4407),
    ],
}'''
s=s[:start]+weather+s[end:]

insert='''\n\ndef open_meteo_daily(target_date: str, source: dict) -> dict | None:\n    """Keyless 16-day numerical guidance used only when official numeric values are not extractable.\n\n    National meteorological authorities remain the authoritative warning/source links.\n    """\n    if source.get("lat") is None or source.get("lon") is None:\n        return None\n    params = {\n        "latitude": source["lat"],\n        "longitude": source["lon"],\n        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max",\n        "timezone": "auto",\n        "forecast_days": 16,\n    }\n    url = "https://api.open-meteo.com/v1/forecast?" + urlencode(params)\n    try:\n        req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})\n        with urlopen(req, timeout=20) as response:\n            data = json.loads(response.read().decode("utf-8"))\n        daily = data.get("daily") or {}\n        times = daily.get("time") or []\n        if target_date not in times:\n            return None\n        i = times.index(target_date)\n        def val(key):\n            arr = daily.get(key) or []\n            return arr[i] if i < len(arr) else None\n        return {\n            "provider": "Open-Meteo",\n            "source_url": "https://open-meteo.com/en/docs",\n            "date": target_date,\n            "weather_code": val("weather_code"),\n            "temperature_max_c": val("temperature_2m_max"),\n            "temperature_min_c": val("temperature_2m_min"),\n            "precip_probability_max_pct": val("precipitation_probability_max"),\n            "precipitation_sum_mm": val("precipitation_sum"),\n            "wind_speed_max_kmh": val("wind_speed_10m_max"),\n            "wind_gusts_max_kmh": val("wind_gusts_10m_max"),\n        }\n    except Exception:\n        return None\n\n\ndef confidence_label(hours_until: float) -> str:\n    if hours_until <= 168:\n        return "단기예보"\n    if hours_until <= 240:\n        return "중기전망"\n    return "장기전망"\n'''
marker='\ndef weather_location(target_date: str, source: dict) -> dict:\n'
if marker not in s: raise SystemExit('weather_location marker not found')
s=s.replace(marker,insert+marker,1)

pat=r'def weather_location\(target_date: str, source: dict\) -> dict:\n.*?\n\ndef main\(\) -> None:'
new='''def weather_location(target_date: str, source: dict) -> dict:\n    now = datetime.now(timezone.utc)\n    target = datetime.fromisoformat(target_date + "T12:00:00+00:00")\n    hours_until = (target - now).total_seconds() / 3600\n    row = {\n        "city": source["city"],\n        "aliases": source["aliases"],\n        "country": source["country"],\n        "authority": source["authority"],\n        "source_url": source["url"],\n        "forecast_horizon_hours": source["horizon"],\n        "checked_at": now.replace(microsecond=0).isoformat().replace("+00:00", "Z"),\n        "hourly": [],\n        "forecast_confidence": confidence_label(hours_until),\n    }\n    model = open_meteo_daily(target_date, source)\n    if model:\n        row["model_daily"] = model\n    try:\n        text = fetch_text(source["url"])\n        row["source_reachable"] = True\n        row["source_page_title"] = page_title(text)\n    except Exception as exc:\n        row["source_reachable"] = False\n        row["kind"] = "official_source_error_model_support" if model else "official_source_error"\n        row["reason"] = f"공식 기상기관 페이지 접근 실패: {str(exc)[:180]}" + (" · 수치예보는 보조 모델값" if model else "")\n        return row\n\n    hourly = extract_iso_hourly(text, target_date) if hours_until <= source["horizon"] else []\n    if hourly:\n        row["kind"] = "official_hourly"\n        row["hourly"] = hourly\n        row["reason"] = "공식 기상기관 페이지에 게시된 시간대별 예보를 추출했습니다."\n    elif model:\n        row["kind"] = "model_guidance"\n        if hours_until <= source["horizon"]:\n            row["reason"] = f"{source['authority']} 공식 원문을 함께 확인하십시오. 수치는 Open-Meteo 16일 수치예보 보조값이며 경보·특보보다 우선하지 않습니다."\n        else:\n            row["reason"] = f"{source['authority']}의 상세 수치예보 전 구간입니다. 현재 수치는 Open-Meteo 16일 수치예보의 {confidence_label(hours_until)} 보조값이며 날짜가 가까워질수록 자동 갱신됩니다."\n    else:\n        row["kind"] = "official_pending"\n        row["reason"] = f"{source['authority']}의 상세 수치예보 발표 전입니다. 공식 원문을 계속 자동 확인합니다."\n    return row\n\n\ndef main() -> None:'''
s,n=re.subn(pat,new,s,count=1,flags=re.S)
if n!=1: raise SystemExit('weather_location replacement failed')
p.write_text(s,encoding='utf-8')

p=Path('scripts/update_official_web_content_fast.py')
s=p.read_text(encoding='utf-8')
s=s.replace('National meteorological authorities only (CWA, KNMI, DWD, DMI, KMA); no historical/climatology fallback', 'National meteorological authorities (CWA, KNMI, DWD, DMI, KMA) for official warnings/source links; Open-Meteo 16-day numerical guidance is clearly labeled as model support when official numeric values are not yet extractable')
p.write_text(s,encoding='utf-8')

p=Path('stable-tools.js')
s=p.read_text(encoding='utf-8')
start=s.index('function weatherHtml(day){')
end=s.index('\n\nfunction scheduleStatusLabel',start)
fn='''function weatherCodeLabel(code){const c=Number(code);if(c===0)return"맑음";if([1,2].includes(c))return"대체로 맑음";if(c===3)return"흐림";if([45,48].includes(c))return"안개";if(c>=51&&c<=67)return"비";if(c>=71&&c<=77)return"눈";if(c>=80&&c<=82)return"소나기";if(c>=95)return"뇌우 가능";return"변동 가능";}\nfunction modelWeatherArticle(loc){const m=loc?.model_daily;if(!m)return"";const rain=m.precip_probability_max_pct!=null?` · 강수 ${esc(m.precip_probability_max_pct)}%`:"";const amount=m.precipitation_sum_mm!=null?` · ${esc(m.precipitation_sum_mm)}mm`:"";const wind=m.wind_speed_max_kmh!=null?` · 바람 최대 ${esc(m.wind_speed_max_kmh)}km/h`:"";const gust=m.wind_gusts_max_kmh!=null?`(돌풍 ${esc(m.wind_gusts_max_kmh)}km/h)`:"";const temp=m.temperature_max_c!=null&&m.temperature_min_c!=null?`${esc(m.temperature_max_c)}℃ / ${esc(m.temperature_min_c)}℃`:"기온 계산 중";return `<article><b>${esc(loc.city||"")} · ${esc(loc.forecast_confidence||"예보")} · 모델값</b><small>${esc(loc.authority||"")} 공식 원문 병행 확인 · Open-Meteo 수치예보</small><p><strong>${temp}</strong> · ${esc(weatherCodeLabel(m.weather_code))}${rain}${amount}${wind}${gust}</p><p>${esc(loc.reason||"")}</p><div class="stable-source-links">${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상기관 원문 ↗</a>`:""}<a href="${esc(m.source_url||"https://open-meteo.com/en/docs")}" target="_blank" rel="noopener noreferrer">수치예보 출처 ↗</a></div></article>`;}\nfunction weatherHtml(day){\n  const bundle=state.weather?.[day.date],rows=bundle?.locations||[];\n  if(!rows.length){const fallback=fallbackCard(day.cities);return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>예보 스냅샷을 불러오는 중입니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${fallback||"<article><b>날씨 갱신 중</b></article>"}</div></section>`;}\n  return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>공식 기상기관 원문·경보를 우선하고, 상세 수치 전에는 16일 수치예보를 보조값으로 표시합니다. 날짜가 가까워질수록 자동 갱신됩니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${rows.map(loc=>{const hourly=loc.kind==="official_hourly"?(loc.hourly||[]).slice(0,6):[];if(hourly.length)return `<article><b>${esc(loc.city||"")} · 공식예보</b><small>${esc(loc.authority||"")}</small><div class="stable-hourly">${hourly.map(r=>`<span><strong>${esc(r.time||"")}</strong>${r.temperature_c!=null?` ${esc(r.temperature_c)}℃`:""}${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;const model=modelWeatherArticle(loc);if(model)return model;return fallbackCard(`${loc.city||""} ${(loc.aliases||[]).join(" ")}`)||`<article><b>${esc(loc.city||"")} · 예보 발표 전</b><small>${esc(loc.authority||"")}</small><p>${esc(loc.reason||"공식 예보 범위 밖입니다.")}</p>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;}).join("")}</div></section>`;\n}'''
s=s[:start]+fn+s[end:]
p.write_text(s,encoding='utf-8')
