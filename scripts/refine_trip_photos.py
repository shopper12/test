#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from update_trip_live import commons_photo

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "trip-live.json"

# Commons search can confuse generic English attraction names. Re-query only the
# ambiguous entries with native/canonical names after the bulk snapshot is built.
OVERRIDES = {
    "Men at Sea": ["Mennesket ved Havet Esbjerg sculpture"],
}


def main():
    payload = json.loads(OUTPUT.read_text(encoding="utf-8"))
    photos = payload.setdefault("photos", {})
    for name, terms in OVERRIDES.items():
        refined = commons_photo(terms)
        if refined.get("url"):
            refined["refined"] = True
            photos[name] = refined
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
