from __future__ import annotations

import html
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT = Path("transit-live.json")
UA = "Mozilla/5.0 (compatible; OffshoreTripDashboard/1.0; +https://shopper12.github.io/test/)"

SOURCES = [
    {
        "id": "thsr",
        "name": "Taiwan High Speed Rail (THSR)",
        "country": "Taiwan",
        "mode": "rail",
        "status_url": "https://en.thsrc.com.tw/ArticleContent/3ec1c04f-d3de-45b1-becc-cba412d55123",
        "planner_url": "https://en.thsrc.com.tw/ArticleContent/a3b630bb-1066-4352-a1ef-58c7b4e8ef7c",
        "official": True,
    },
    {
        "id": "taoyuan_mrt",
        "name": "Taoyuan Airport MRT",
        "country": "Taiwan",
        "mode": "metro",
        "status_url": "https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/dep-A18",
        "planner_url": "https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A18",
        "official": True,
    },
    {
        "id": "ns",
        "name": "NS Netherlands",
        "country": "Netherlands",
        "mode": "rail",
        "status_url": "https://www.ns.nl/en/travel-information",
        "planner_url": "https://www.ns.nl/en/travel-information",
        "official": True,
    },
    {
        "id": "ret",
        "name": "RET Rotterdam",
        "country": "Netherlands",
        "mode": "metro_bus_tram",
        "status_url": "https://www.ret.nl/en/home/travelling-with-the-ret/status-updates.html",
        "planner_url": "https://www.ret.nl/en/home/travelling-with-the-ret/plan-your-trip.html",
        "official": True,
    },
    {
        "id": "waterbus",
        "name": "Waterbus / WaterShuttle Rotterdam",
        "country": "Netherlands",
        "mode": "ferry",
        "status_url": "https://www.waterbus.nl/en/travel-information/service-reports/",
        "planner_url": "https://www.waterbus.nl/en/",
        "official": True,
    },
    {
        "id": "db",
        "name": "Deutsche Bahn",
        "country": "Germany",
        "mode": "rail",
        "status_url": "https://www.bahn.de/service/fahrplaene",
        "planner_url": "https://int.bahn.de/en",
        "official": True,
    },
    {
        "id": "hvv",
        "name": "HVV Hamburg",
        "country": "Germany",
        "mode": "metro_bus",
        "status_url": "https://www.hvv.de/en/timetables/all-departures/",
        "planner_url": "https://www.hvv.de/en",
        "official": True,
    },
    {
        "id": "dsb",
        "name": "DSB Denmark",
        "country": "Denmark",
        "mode": "rail",
        "status_url": "https://www.dsb.dk/trafikinformation/",
        "planner_url": "https://www.rejseplanen.dk/bin/query.exe/en",
        "official": True,
    },
    {
        "id": "rejseplanen",
        "name": "Rejseplanen",
        "country": "Denmark",
        "mode": "multimodal",
        "status_url": "https://www.rejseplanen.dk/bin/query.exe/en",
        "planner_url": "https://www.rejseplanen.dk/bin/query.exe/en",
        "official": True,
    },
]


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "da,en-US;q=0.9,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=18) as r:
        raw = r.read().decode(r.headers.get_content_charset() or "utf-8", errors="replace")
    raw = re.sub(r"(?is)<script.*?</script>|<style.*?</style>", " ", raw)
    raw = re.sub(r"(?s)<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def clip(text: str, marker: str, size: int = 260) -> str:
    i = text.lower().find(marker.lower())
    if i < 0:
        return ""
    return text[i : i + size].strip()


def summarize(source: dict, text: str) -> tuple[str, str]:
    sid = source["id"]
    low = text.lower()
    if sid == "thsr":
        if "on schedule" in low:
            return "normal", "THSR 공식 운행상태: on schedule"
        s = clip(text, "Train Operation Status", 300)
        return ("alert" if s else "unknown", s or "THSR 공식 운행상태 페이지 확인 필요")
    if sid == "taoyuan_mrt":
        if "8/31" in text or "行前3天" in text or "3 days" in low:
            return "advisory", "9월 시간표는 출발 3일 전 공식 시간표 재확인 대상"
        return "normal", "A18 Taoyuan HSR Station 공식 시간표 제공 중"
    if sid == "ns":
        s = clip(text, "Current situation on the track", 280)
        return "live", s or "NS Journey Planner가 공사·지연·취소를 최신 반영"
    if sid == "ret":
        s = clip(text, "Status updates", 420) or clip(text, "diversions", 420)
        has_alert = any(marker in low for marker in ("diversion", "not served", "delay", "disruption"))
        return ("alert" if has_alert else "live"), s or "RET 버스·트램·메트로 최신 우회·장애정보 사용"
    if sid == "waterbus":
        s = clip(text, "Service Announcements", 420) or clip(text, "service", 420)
        has_alert = any(marker in low for marker in ("delay", "cancel", "closure", "disruption", "service announcement"))
        return ("alert" if has_alert else "live"), s or "Waterbus/WaterShuttle 공식 운항·서비스 알림 사용"
    if sid == "db":
        s = clip(text, "Fahrpläne & aktuelle Meldungen", 280) or clip(text, "Aktuelle Verkehrs", 280)
        return "live", s or "DB Reiseauskunft/DB Navigator 최신 운행정보 사용"
    if sid == "hvv":
        s = clip(text, "All departures", 320)
        return "live", s or "HVV 정류장별 실시간 출발정보 사용"
    if sid == "dsb":
        s = (
            clip(text, "Akutte ændringer", 520)
            or clip(text, "Planlagte ændringer", 520)
            or clip(text, "Trafikinformation", 520)
            or clip(text, "Acute changes", 520)
        )
        has_alert = any(marker in low for marker in ("akutte ændringer", "acute changes", "togbus", "aflyst", "forsink"))
        return ("alert" if has_alert else "live"), s or "DSB Trafikinformation 최신 운행정보 사용"
    if sid == "rejseplanen":
        s = clip(text, "Timetable valid", 180)
        return "live", s or "Rejseplanen 최신 통합 대중교통 경로 사용"
    return "unknown", "공식 실시간 페이지 확인"


def main() -> None:
    old = {}
    if OUT.exists():
        try:
            old = json.loads(OUT.read_text(encoding="utf-8"))
        except Exception:
            old = {}
    old_by_id = {x.get("id"): x for x in old.get("providers", [])}
    rows = []
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    for source in SOURCES:
        row = dict(source)
        try:
            text = fetch_text(source["status_url"])
            status, summary = summarize(source, text)
            row.update(status=status, summary=summary, fetched_at=now, fetch_ok=True)
        except Exception as exc:
            prev = old_by_id.get(source["id"], {})
            row.update(
                status="source_error",
                summary="공식 사이트 자동조회 실패 — 아래 공식 실시간 링크에서 직접 확인",
                fetched_at=now,
                fetch_ok=False,
                error=str(exc)[:180],
                previous_summary=prev.get("summary"),
            )
        rows.append(row)
    payload = {
        "schema_version": 2,
        "generated_at": now,
        "refresh_policy": "GitHub Actions hourly; official operator and official journey-planner sources",
        "providers": rows,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"generated_at": now, "providers": {r["id"]: r["status"] for r in rows}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
