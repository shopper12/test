#!/usr/bin/env python3
from __future__ import annotations

import html as html_lib
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "trip-live.json"
UA = "offshore-wind-benchmark-trip/5.1 (+https://shopper12.github.io/test/)"
BAD = re.compile(r"(?i)(logo|icon|favicon|sprite|avatar|placeholder|blank|pixel|tracking|cookie|consent|loader|spinner|flag|social|facebook|instagram|linkedin|youtube|arrow|chevron|qr|barcode)")
GOOD_EXT = re.compile(r"(?i)\.(?:jpe?g|png|webp)(?:\?|$)")


def fetch(url: str) -> str:
    req=Request(url,headers={"User-Agent":UA,"Accept-Language":"en,ko;q=0.8"})
    with urlopen(req,timeout=18) as r:
        raw=r.read(3_000_000)
        charset=r.headers.get_content_charset() or "utf-8"
        return raw.decode(charset,errors="replace")


def attrs(tag: str) -> dict[str,str]:
    out={}
    for k,v1,v2,v3 in re.findall(r'''([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))''',tag):
        out[k.lower()]=html_lib.unescape(v1 or v2 or v3 or "")
    return out


def candidate_score(name: str, page: str, tag: str, a: dict[str,str]) -> tuple[int,str]:
    src=a.get("src") or a.get("data-src") or a.get("data-lazy-src") or a.get("data-original") or ""
    if not src or src.startswith("data:"):
        return (-999,"")
    src=urljoin(page,src)
    parsed=urlparse(src)
    if parsed.scheme not in {"http","https"}:
        return (-999,"")
    text=" ".join([src,a.get("alt","") or "",a.get("title","") or "",a.get("class","") or ""])
    if BAD.search(text):
        return (-999,"")
    if not GOOD_EXT.search(src) and not any(x in src.lower() for x in ["image","img","media","cdn","photo"]):
        return (-10,src)
    score=0
    nwords=[w for w in re.findall(r"[a-z0-9]+",name.lower()) if len(w)>=4]
    low=text.lower()
    score+=sum(8 for w in nwords if w in low)
    if any(k in low for k in ["hero","banner","header","gallery","hotel","room","restaurant","food","wind","harbor","harbour","airport","attraction"]): score+=8
    try:
        w=int(re.sub(r"\D","",a.get("width","") or "0") or 0); h=int(re.sub(r"\D","",a.get("height","") or "0") or 0)
        if w>=600 or h>=400: score+=8
        elif w and h and (w<180 or h<120): score-=20
    except Exception: pass
    if parsed.netloc==urlparse(page).netloc: score+=4
    return (score,src)


def find_content_image(name: str,page: str) -> dict:
    try:
        text=fetch(page)
        ranked=[]
        for match in re.finditer(r"<img\b[^>]*>",text,re.I|re.S):
            tag=match.group(0); a=attrs(tag); score,src=candidate_score(name,page,tag,a)
            if src and score>-50: ranked.append((score,src,a.get("alt","") or ""))
        ranked.sort(key=lambda x:x[0],reverse=True)
        if not ranked:
            return {"url":"","error":"no suitable first-party content image"}
        score,src,alt=ranked[0]
        if page.startswith("https://") and src.startswith("http://") and urlparse(src).netloc==urlparse(page).netloc:
            src="https://"+src[len("http://"):]
        return {"url":src,"image_alt":alt,"content_image_score":score,"content_image_fallback":True}
    except Exception as exc:
        return {"url":"","error":str(exc)[:220]}


def main():
    p=json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    photos=p.get("photos",{})
    targets=[(name,row) for name,row in photos.items() if not row.get("url") and row.get("page_url")]
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures={pool.submit(find_content_image,name,row["page_url"]):(name,row) for name,row in targets}
        for fut in as_completed(futures):
            name,row=futures[fut]
            result=fut.result()
            if result.get("url"):
                row.update(result)
                row.pop("error",None)
    # Fix same-host mixed content even for metadata images.
    for row in photos.values():
        page=row.get("page_url",""); url=row.get("url","")
        if page.startswith("https://") and url.startswith("http://") and urlparse(page).netloc==urlparse(url).netloc:
            row["url"]="https://"+url[len("http://"):]
    p.setdefault("sources",{})["photos"]="First-party official/business/tourism website representative metadata or page-content images only; no Wikimedia/stock fallback"
    SNAPSHOT.write_text(json.dumps(p,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"photos_total":len(photos),"photos_with_images":sum(bool(x.get("url")) for x in photos.values()),"content_fallbacks":sum(bool(x.get("content_image_fallback")) for x in photos.values())},ensure_ascii=False))

if __name__=="__main__":
    main()
