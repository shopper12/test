from pathlib import Path
p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')
s=s.replace('popup: "약 00:05 도착",','popup: "23:16 후보 도착",',1)
s=s.replace('name: "Best Western Plus Hotel St. Raphael · Adenauerallee 41",\n      lat: 53.55293,\n      lng: 10.01636,\n      sort_order: 7,\n      segment_type: "subway",','name: "Best Western Plus Hotel St. Raphael · Adenauerallee 41",\n      lat: 53.55293,\n      lng: 10.01636,\n      sort_order: 7,\n      segment_type: "walk",',1)
p.write_text(s,encoding='utf-8')
