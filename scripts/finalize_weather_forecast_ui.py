from pathlib import Path

# Do not keep all-null forecast rows at the far end of the 16-day model horizon.
p=Path('scripts/update_official_web_content.py')
s=p.read_text(encoding='utf-8')
old='''        return {\n            "provider": "Open-Meteo",\n            "source_url": "https://open-meteo.com/en/docs",\n            "date": target_date,\n            "weather_code": val("weather_code"),\n            "temperature_max_c": val("temperature_2m_max"),\n            "temperature_min_c": val("temperature_2m_min"),\n            "precip_probability_max_pct": val("precipitation_probability_max"),\n            "precipitation_sum_mm": val("precipitation_sum"),\n            "wind_speed_max_kmh": val("wind_speed_10m_max"),\n            "wind_gusts_max_kmh": val("wind_gusts_10m_max"),\n        }'''
new='''        result = {\n            "provider": "Open-Meteo",\n            "source_url": "https://open-meteo.com/en/docs",\n            "date": target_date,\n            "weather_code": val("weather_code"),\n            "temperature_max_c": val("temperature_2m_max"),\n            "temperature_min_c": val("temperature_2m_min"),\n            "precip_probability_max_pct": val("precipitation_probability_max"),\n            "precipitation_sum_mm": val("precipitation_sum"),\n            "wind_speed_max_kmh": val("wind_speed_10m_max"),\n            "wind_gusts_max_kmh": val("wind_gusts_10m_max"),\n        }\n        core = [result[k] for k in ("weather_code", "temperature_max_c", "temperature_min_c", "precip_probability_max_pct", "precipitation_sum_mm", "wind_speed_max_kmh", "wind_gusts_max_kmh")]\n        return result if any(v is not None for v in core) else None'''
if old not in s:
    raise SystemExit('Open-Meteo return block not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

# Add operational impact advice to the existing weather card; no new weather component is created.
p=Path('stable-tools.js')
s=p.read_text(encoding='utf-8')
needle='''function modelWeatherArticle(loc){const m=loc?.model_daily;if(!m)return"";'''
if needle not in s:
    raise SystemExit('modelWeatherArticle marker not found')
impact='''function weatherImpact(m){\n  if(!m)return"";const tips=[];const rain=Number(m.precip_probability_max_pct),mm=Number(m.precipitation_sum_mm),wind=Number(m.wind_speed_max_kmh),gust=Number(m.wind_gusts_max_kmh),hi=Number(m.temperature_max_c),lo=Number(m.temperature_min_c);\n  if((Number.isFinite(rain)&&rain>=70)||(Number.isFinite(mm)&&mm>=10))tips.push("우천 대비 · 야외 관광·항만 외부동선 축소/실내 대체 검토");\n  else if((Number.isFinite(rain)&&rain>=40)||(Number.isFinite(mm)&&mm>=2))tips.push("우산·방수 외투 준비 · 야외 이동시간에 여유 확보");\n  if((Number.isFinite(gust)&&gust>=50)||(Number.isFinite(wind)&&wind>=25))tips.push("강풍 주의 · 해안·항만·선박 인접 이동 및 우산 사용 주의");\n  if(Number.isFinite(hi)&&hi>=30)tips.push("고온·습도 대비 · 수분 보충");\n  if(Number.isFinite(lo)&&lo<=12)tips.push("아침·저녁 방풍 겉옷 준비");\n  if(!tips.length)tips.push("현재 전망상 기본 일정 유지 가능 · 출발 전 최신예보 재확인");\n  return tips.join(" / ");\n}\n'''
s=s.replace(needle,impact+needle,1)
old='''<p>${esc(loc.reason||"")}</p><div class="stable-source-links">'''
new='''<p class="weather-impact"><b>일정 영향</b> · ${esc(weatherImpact(m))}</p><p>${esc(loc.reason||"")}</p><div class="stable-source-links">'''
if old not in s:
    raise SystemExit('weather article reason marker not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
