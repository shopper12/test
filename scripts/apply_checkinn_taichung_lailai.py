from pathlib import Path
import re

HOTEL = "CHECK Inn Taichung LaiLai"
ADDR = "No.125, Sec. 3, Sanmin Rd., North Dist., Taichung City 404, Taiwan"
OFFICIAL = "https://www.checkinn.com.tw/?page_id=22115"
LAT = "24.147736"
LNG = "120.673645"

p = Path('itinerary-data.js')
s = p.read_text(encoding='utf-8')

# New seed revision so existing shared data can distinguish this update.
s = s.replace('lastVerified: "2026-08-20-r2",', 'lastVerified: "2026-08-20-r3",', 1)
s = s.replace('lastVerified: "2026-08-20",', 'lastVerified: "2026-08-20-r3",', 1)

# Day lodging labels.
s = s.replace('lodging: "Holiday Inn Express Taichung Park",', f'lodging: "{HOTEL}",')
s = s.replace('"07:55 RMQ 직항 · TIPC 회의 · 우치항·가오메이 습지 · 계획서 첫날 유지",', '"07:55 RMQ 직항 · CHECK Inn LaiLai 짐 보관 · TIPC 회의 · 우치항·가오메이 습지 · 16:00 이후 체크인",', 1)
s = s.replace('"VESTAS O&M Base 현장·회의 · TIPC 공동 결과공유 · 루강 옛거리",', '"CHECK Inn LaiLai 숙박 · VESTAS O&M Base 현장·회의 · TIPC 공동 결과공유 · 루강 옛거리",', 1)
s = s.replace('summary: "타이중 오전 일정 · 23:10 TPE→AMS 중화항공 직항",', 'summary: "11:00 이전 체크아웃 · 시내 일정 후 호텔 짐 회수 · THSR Taichung→Taoyuan · 23:10 TPE→AMS 직항",', 1)

# Replace event hotel references and map URL origins/destinations.
s = s.replace('Holiday Inn Express Taichung Park', HOTEL)
s = s.replace('Holiday+Inn+Express+Taichung+Park', 'CHECK+Inn+Taichung+LaiLai+No.125+Sec.3+Sanmin+Rd+Taichung')

# First-day arrival: no false early check-in assumption.
s = s.replace('"입국·호텔 이동·짐 보관",\n      "입국·교통",\n      "RMQ → CHECK Inn Taichung LaiLai",', '"입국·예약호텔 이동·짐 보관",\n      "입국·교통",\n      "RMQ → CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., Taichung",', 1)
s = s.replace('      "가오메이 → 호텔·체크인",\n      "교통·숙박",\n      "CHECK Inn Taichung LaiLai",', '      "가오메이 → CHECK Inn LaiLai·체크인",\n      "교통·숙박",\n      "CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., Taichung",', 1)

# Add explicit 9/4 checkout/luggage storage block if missing.
needle = '    e(\n          "d3-01",'
if needle in s and '"d3-00"' not in s:
    block = '''    e(\n          "d3-00",\n          3,\n          "07:30",\n          "08:15",\n          "조식·체크아웃·짐 보관",\n          "숙박·출발준비",\n          "CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., Taichung",\n          "도보",\n          "45분",\n          {\n            official_url: "https://www.checkinn.com.tw/?page_id=22115",\n            map_url: "https://www.google.com/maps/search/?api=1&query=CHECK+Inn+Taichung+LaiLai+No.125+Sec.3+Sanmin+Rd+Taichung",\n            notes: "예약 안내상 9/4 11:00 이전 체크아웃. 오전 시내 일정 동안 수하물을 호텔에 맡긴 뒤 공항 이동 전 회수하는 동선.",\n          },\n        ),\n'''
    s = s.replace(needle, block + needle, 1)

# Day 3 sightseeing ends back at the hotel to retrieve baggage.
s = s.replace('          "10:20",\n          "12:00",\n          "Miyahara·타이중 구도심·점심",', '          "10:20",\n          "12:15",\n          "Miyahara·타이중 구도심·점심·호텔 짐 회수",', 1)
s = s.replace('          "Taichung Station",\n          "택시+도보",\n          "1시간 40분",', '          "Miyahara → CHECK Inn Taichung LaiLai",\n          "택시+도보",\n          "1시간 55분",', 1)
s = s.replace('              "https://www.google.com/maps/search/?api=1&query=Miyahara+Taichung",', '              "https://www.google.com/maps/dir/?api=1&origin=National+Taichung+Theater&destination=CHECK+Inn+Taichung+LaiLai+No.125+Sec.3+Sanmin+Rd+Taichung&waypoints=Miyahara+Taichung",', 1)
s = s.replace('          "13:00",\n          "15:20",\n          "타이중 → 타오위안공항",', '          "12:15",\n          "15:20",\n          "CHECK Inn LaiLai → 타오위안공항",', 1)
s = s.replace('          "Taichung → THSR Taoyuan → TPE",', '          "CHECK Inn Taichung LaiLai → THSR Taichung → THSR Taoyuan → TPE",', 1)

# Replace the Taichung hotel record using only confirmed facts.
pat = r'''  \{\n    id: "h1",.*?\n    sort_order: 10,\n  \},'''
m = re.search(pat, s, re.S)
if not m:
    raise SystemExit('h1 hotel block not found')
h1 = f'''  {{\n    id: "h1",\n    day_id: 1,\n    name: "{HOTEL}",\n    city: "Taichung",\n    check_in: "2026-09-02",\n    check_out: "2026-09-04",\n    nights: 2,\n    rooms: null,\n    min_krw: null,\n    max_krw: null,\n    status: "예약확정·16:00 이후 체크인",\n    alternative: "",\n    url: "{OFFICIAL}",\n    notes: "예약자 Seungtaek Song · 2026-09-02부터 2박 · 체크인 16:00 이후 · 2026-09-04 11:00 이전 체크아웃 · 유료 조기 체크인/연장 서비스는 당일 현장 확인. 주소: No.125, Sec. 3, Sanmin Rd., North Dist., Taichung City 404. 객실 수·예약 인원·결제금액은 제공자료에 없어 임의 입력하지 않음.",\n    sort_order: 10,\n  }},'''
s = s[:m.start()] + h1 + s[m.end():]

# Exact map points for the booked Taichung hotel.
s = s.replace('name: "Holiday Inn Express Taichung Park"', 'name: "CHECK Inn Taichung LaiLai · Sanmin Rd. 125"')
s = s.replace('name: "CHECK Inn Taichung LaiLai"', 'name: "CHECK Inn Taichung LaiLai · Sanmin Rd. 125"')
s = s.replace('lat: 24.1406,\n      lng: 120.6841,', f'lat: {LAT},\n      lng: {LNG},')
s = s.replace('url: "https://www.ihg.com/holidayinnexpress/hotels/us/en/taichung/txgsr/hoteldetail"', f'url: "{OFFICIAL}"')
s = s.replace('popup: "짐 보관",', 'popup: "도착 후 짐 보관 · 체크인 16:00 이후",', 1)
s = s.replace('popup: "숙박",', 'popup: "예약숙박 · 16:00 이후 체크인",', 1)

p.write_text(s, encoding='utf-8')

# Verified map manifest uses the booked hotel and exact address.
p = Path('map-routing.mjs')
s = p.read_text(encoding='utf-8')
OLD = 'Holiday Inn Express Taichung Park'
NEW = 'CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung'
s = s.replace(OLD, NEW)
s = s.replace('"d3-01": {kind:"route",origin:"CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung",waypoints:"National Taichung Theater",destination:"Calligraphy Greenway, Taichung",mode:"driving"},', '"d3-00": {kind:"place",query:"CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung"},\n  "d3-01": {kind:"route",origin:"CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung",waypoints:"National Taichung Theater",destination:"Calligraphy Greenway, Taichung",mode:"driving"},')
s = s.replace('"d3-02": {kind:"route",origin:"Calligraphy Greenway, Taichung",waypoints:"Miyahara, Taichung",destination:"Taichung Station",mode:"driving"},', '"d3-02": {kind:"route",origin:"Calligraphy Greenway, Taichung",waypoints:"Miyahara, Taichung",destination:"CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung",mode:"driving"},')
s = s.replace('"d3-03": {kind:"route",origin:"Taichung Station",waypoints:"THSR Taichung Station|THSR Taoyuan Station",destination:"Taoyuan International Airport",mode:"transit"},', '"d3-03": {kind:"route",origin:"CHECK Inn Taichung LaiLai, No.125 Sec. 3 Sanmin Rd., North Dist., Taichung",waypoints:"THSR Taichung Station|THSR Taoyuan Station",destination:"Taoyuan International Airport",mode:"transit"},')
p.write_text(s, encoding='utf-8')

# Timeline detail labels: checkout and baggage pickup follow the actual reservation rules.
p = Path('timeline-runtime-v17.js')
s = p.read_text(encoding='utf-8')
s = s.replace('Holiday Inn Express Taichung Park', 'CHECK Inn Taichung LaiLai')
s = s.replace('택시 · 타이중 시내 → THSR Taichung', '택시 · CHECK Inn LaiLai → THSR Taichung')
s = s.replace('if(e.id==="d3-02")return[leg(e,0,10,"택시 · 극장권 → Miyahara/구도심","move"),leg(e,10,t,"Miyahara·구도심 도보·점심","stay")];', 'if(e.id==="d3-02")return[leg(e,0,10,"택시 · 극장권 → Miyahara/구도심","move"),leg(e,10,75,"Miyahara·구도심 도보·이른 점심","stay"),leg(e,75,t,"택시 · CHECK Inn LaiLai 복귀·수하물 회수","move")];')
p.write_text(s, encoding='utf-8')
