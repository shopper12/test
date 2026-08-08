#!/usr/bin/env python3
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import json

import update_official_web_content as base


def main():
    payload = json.loads(base.SNAPSHOT.read_text(encoding="utf-8")) if base.SNAPSHOT.exists() else {}
    payload["schema_version"] = max(5, int(payload.get("schema_version", 0) or 0))
    payload["official_web_generated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    photos = {}
    weather = {date:{"date":date,"kind":"official_weather_bundle","locations":[]} for date in base.WEATHER}
    jobs = {}
    with ThreadPoolExecutor(max_workers=12) as pool:
        for name,url in base.PHOTO_PAGES.items():
            jobs[pool.submit(base.official_photo,name,url)] = ("photo",name,None)
        for date,sources in base.WEATHER.items():
            for idx,source in enumerate(sources):
                jobs[pool.submit(base.weather_location,date,source)] = ("weather",date,idx)
        weather_slots = {date:[None]*len(sources) for date,sources in base.WEATHER.items()}
        for future in as_completed(jobs):
            kind,key,idx = jobs[future]
            try:
                result = future.result()
            except Exception as exc:
                result = {"error":str(exc)[:240]}
            if kind == "photo":
                photos[key] = result
            else:
                weather_slots[key][idx] = result

    payload["photos"] = {name:photos.get(name,{"url":"","page_url":url,"source":"official_website","official":True,"name":name,"error":"refresh missing"}) for name,url in base.PHOTO_PAGES.items()}
    for date,rows in weather_slots.items():
        weather[date]["locations"] = [row for row in rows if row]
    payload["weather"] = weather
    payload.setdefault("sources", {})
    payload["sources"]["photos"] = "First-party venue/company/hotel/official-tourism website metadata only; no Wikimedia/stock fallback"
    payload["sources"]["weather"] = "National meteorological authorities only (CWA, KNMI, DWD, DMI, KMA); no historical/climatology fallback"
    base.SNAPSHOT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({
        "schema_version":payload["schema_version"],
        "photos_with_images":sum(bool(p.get("url")) for p in payload["photos"].values()),
        "weather_days":len(payload["weather"]),
        "hourly_points":sum(len(loc.get("hourly",[])) for day in payload["weather"].values() for loc in day["locations"]),
    },ensure_ascii=False))


if __name__ == "__main__":
    main()
