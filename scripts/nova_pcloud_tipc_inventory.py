#!/usr/bin/env python3
"""Inventory pCloud public-link photos. No pCloud credentials required.
Outputs are local/Actions artifacts ONLY; nothing is committed or published to Pages.
"""
import argparse, csv, json, os, re, sys, time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_HOSTS = ("https://api.pcloud.com", "https://eapi.pcloud.com")
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".tif", ".tiff")
VIDEO_EXTS = (".mp4", ".mov", ".m4v")
KST = timezone(timedelta(hours=9))
TWT = timezone(timedelta(hours=8))

def call_api(method, params, timeout=30):
    last = None
    for base in API_HOSTS:
        url = f"{base}/{method}?{urlencode(params)}"
        try:
            with urlopen(Request(url, headers={"User-Agent": "WP-NOVA-photo-audit/1.0", "Accept": "application/json"}), timeout=timeout) as f:
                data = json.load(f)
            if data.get("result") != 0:
                raise RuntimeError(f"pCloud {method}: {data.get('result')}: {data.get('error', 'unknown')}")
            return data
        except Exception as ex:
            last = ex
    raise RuntimeError(f"Both pCloud API hosts failed: {last}")

def walk(meta, prefix=""):
    name = str(meta.get("name", ""))
    folder = meta.get("isfolder", False)
    path = f"{prefix}/{name}" if name else prefix
    if folder:
        for child in meta.get("contents", []):
            yield from walk(child, path)
    else:
        yield (path.lstrip("/"), meta)

def to_row(path, m):
    return {
        "path": path, "filename": m.get("name", ""), "fileid": m.get("fileid", ""),
        "size_bytes": m.get("size", ""), "created": m.get("created", ""),
        "modified": m.get("modified", ""),
        "kind": "photo" if path.lower().endswith(IMAGE_EXTS) else ("video" if path.lower().endswith(VIDEO_EXTS) else "other"),
    }

def score_candidate(row):
    s = (row["filename"] + " " + row["path"]).lower()
    score = 0
    reasons = []
    if re.search(r"(tipc|taichung|台中|臺中|台灣港務|臺灣港務|port.of.taichung|타이중|기념|group)", s):
        score += 5
        reasons.append("name/path keyword")
    if re.search(r"2026[-_]?09[-_]?0[23]|2026090[23]|img[-_]?2026090[23]", s):
        score += 3
        reasons.append("filename date Sep 2–3")
    # pCloud created/modified timestamps are file system timestamps, NOT capture/EXIF time.
    date_str = str(row["created"]) + " " + str(row["modified"])
    if "Sep 2026" in date_str or "2026-09" in date_str:
        score += 1
        reasons.append("metadata date Sep 2026 (not EXIF)")
    if row["kind"] == "photo": score += 1
    return score, "; ".join(reasons)


def make_contact_sheet(code, rows, out, limit=80):
    """Download temporary pCloud public thumbnails, not originals.
    Photo contents stay in short-lived Actions artifacts, never in git."""
    try:
        from PIL import Image, ImageDraw, ImageOps
        import io
    except ImportError:
        print("Pillow unavailable; skipping contact sheet", file=sys.stderr)
        return
    cols, cell_w, img_h, label_h = 5, 240, 170, 48
    chosen = [r for r in rows if r.get("fileid")][:limit]
    if not chosen: return
    sheet = Image.new("RGB", (cols * cell_w, ((len(chosen)+cols-1)//cols)*(img_h+label_h)), "white")
    d = ImageDraw.Draw(sheet)
    ok = 0
    for i, r in enumerate(chosen):
        x = (i % cols)*cell_w
        y = (i // cols)*(img_h+label_h)
        try:
            link = call_api("getpubthumblink", {"code":code, "fileid":r["fileid"],"size":"400x300","crop":0},timeout=20)
            hosts = link.get("hosts") or []
            path = link.get("path")
            if not hosts or not path: raise RuntimeError("missing thumbnail hosts or path")
            thumburl = "https://" + hosts[0] + path
            with urlopen(Request(thumburl,headers={"User-Agent":"WP-NOVA-photo-audit/1.0"}),timeout=20) as f:
                raw = f.read(2_000_000)
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            im.thumbnail((cell_w-10,img_h-10))
            sheet.paste(im,(x+(cell_w-im.width)//2,y+(img_h-im.height)//2))
            ok+=1
        except Exception as err:
            d.text((x+8,y+45),"thumbnail unavailable",fill="black")
        filename = str(r["filename"])
        d.text((x+6,y+img_h+3), f"{i+1}. {filename[:34]}", fill="black")
        d.text((x+6,y+img_h+23), f"score {r['score']} | id {r['fileid']}",fill="black")
    if ok:
        sheet.save(out/"TIPC_contact_sheet.jpg",quality=85,optimize=True)
    print(f"Contact sheet: {ok}/{len(chosen)} thumbnails loaded")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--code", default=os.environ.get("PCLOUD_PUBLIC_CODE", ""), help="Public share code, not a password")
    p.add_argument("--out", default="photo-audit")
    p.add_argument("--exif-csv", default="", help="Optional Google Takeout/EXIF CSV with filename and local photo timestamp for a future join")
    args = p.parse_args()
    if not args.code:
        p.error("--code or PCLOUD_PUBLIC_CODE required")
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    data = call_api("showpublink", {"code": args.code})
    root = data.get("metadata") or {}
    files = [to_row(path, meta) for path, meta in walk(root)]
    if not files:
        raise RuntimeError("pCloud returned no files (empty folder, nested listing unavailable, or link blocked)")
    fields = ["path","filename","fileid","size_bytes","created","modified","kind"]
    with (out/"all_files.csv").open("w", newline="", encoding="utf-8-sig") as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(files)
    ranked = []
    for row in files:
        if row["kind"] != "photo": continue
        score, reason = score_candidate(row)
        ranked.append({"score":score,"reason":reason,**row})
    ranked.sort(key=lambda x:(-x["score"],x["path"]))
    with (out/"TIPC_candidates.csv").open("w",newline="",encoding="utf-8-sig") as f:
        fields2 = ["score","reason"]+fields
        w=csv.DictWriter(f,fieldnames=fields2);w.writeheader();w.writerows(ranked)
    report = [
        "# TIPC / Taichung photo audit",
        "",
        "- Visit confirmed by official trip report: **2026-09-03, Taichung Port (TIPC)**.",
        "- Existing GitHub itinerary is an Aug 30 *plan*, listing TIPC on Sep 2. Do not use its date as actual attendance.",
        "- Files below are **candidates**, not confirmed TIPC commemorative photos.",
        "- pCloud created/modified times are **not EXIF camera capture times**. Google Timeline is **not connected** to this workflow.",
        "- Group-photo identification requires visual inspection of the thumbnails or original photos.",
        "",
        f"- pCloud files: **{len(files)}**; images: **{len(ranked)}**.",
        "",
        "| Rank | File name | Score | Reason |",
        "|---|---|---|---|",
    ]
    for idx,r in enumerate(ranked[:60],1):
        report.append(f"| {idx} | {r['path'].replace('|','/')} | {r['score']} | {r['reason']} |")
    (out/"TIPC_report.md").write_text("\n".join(report)+"\n", encoding="utf-8")
    make_contact_sheet(args.code, ranked, out)
    # JSON machine-readable inventory for downstream data verification.
    (out/"manifest.json").write_text(json.dumps({
        "source":"pCloud public share metadata", "source_visit_date":"2026-09-03",
        "actual_capture_times_verified":False, "google_timeline_checked":False,
        "all_file_count":len(files), "candidate_count":len(ranked)
    },ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Complete: {len(files)} files, {len(ranked)} photos. Top candidates:")
    for r in ranked[:12]:
        print(f"score={r['score']}: {r['path']}")
    print(f"Artifact directory: {out}")

if __name__=="__main__":
    main()
