from pathlib import Path
import re

HOTEL = "PREMIER SUITES Rotterdam"
ADDR = "Weena 710, 3014 DA Rotterdam, The Netherlands"
OFFICIAL = "https://www.premiersuiteseurope.com/en/locations/the-netherlands/rotterdam/serviced-apartments-rotterdam"

p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')

# Force a new cloud seed revision even though this is another update on the same date.
s=s.replace('lastVerified: "2026-08-20",','lastVerified: "2026-08-20-r2",',1)

# Day lodging names and summary.
s=s.replace('lodging: "Holiday Inn Express Rotterdam Central",','lodging: "PREMIER SUITES Rotterdam",')
s=s.replace('"스키폴 직통열차 · Markthal·큐브하우스 · 13:00 네덜란드 일정 점검회의",','"07:40 스키폴 도착 · Rotterdam Centraal 직통 · PREMIER SUITES 10:00~11:00 얼리체크인 요청 · Markthal·큐브하우스 · 13:00 일정 점검회의",',1)

# CI73 arrives 07:40 for both itinerary tabs; remove stale 06:35 branch.
s=s.replace('      saving ? "06:35" : "07:40",\n      saving ? "08:40" : "09:40",','      "07:40",\n      "09:45",',1)

# Replace Day 4 hotel arrival block with the booked property and correctly qualified early check-in.
pat=r'''    e\(\n      "d4-02",.*?\n    \),\n    e\(\n      "d4-03",'''
m=re.search(pat,s,re.S)
if not m: raise SystemExit('d4-02 block not found')
replacement='''    e(\n      "d4-02",\n      4,\n      "09:45",\n      "10:30",\n      "PREMIER SUITES 도착·짐 보관·얼리 체크인 요청",\n      "숙박",\n      "PREMIER SUITES Rotterdam, Weena 710, 3014 DA Rotterdam",\n      "도보",\n      "45분",\n      {\n        official_url: "'''+OFFICIAL+'''",\n        map_url: "https://www.google.com/maps/dir/?api=1&origin=Rotterdam+Centraal&destination=PREMIER+SUITES+Rotterdam+Weena+710&travelmode=walking",\n        notes: "9/5~9/7 예약 숙소. 10:00~11:00 얼리 체크인을 요청했으며 '가능한 경우 제공' 상태라 확정 체크인 시간이 아님. 공식 기본 체크인은 15:00, 체크아웃은 11:00. 얼리 체크인 불가 시 1층 수하물 보관실에 짐을 맡기고 일정 진행.",\n      },\n    ),\n    e(\n      "d4-03",'''
s=s[:m.start()]+replacement+s[m.end():]

s=s.replace('      saving ? "09:30" : "10:30",\n      "12:30",','      "10:45",\n      "12:30",',1)
s=s.replace('      saving ? "3시간" : "2시간",','      "1시간 45분",',1)
s=s.replace('https://www.google.com/maps/dir/?api=1&origin=Rotterdam+Centraal&destination=Oude+Haven+Rotterdam&waypoints=Markthal+Rotterdam%7CCube+Houses','https://www.google.com/maps/dir/?api=1&origin=PREMIER+SUITES+Rotterdam+Weena+710&destination=Oude+Haven+Rotterdam&waypoints=Markthal+Rotterdam%7CCube+Houses',1)

# Meeting location must not assume early check-in succeeded.
s=s.replace('      "호텔 회의공간/공용공간",\n      "도보",\n      "3시간",','      "PREMIER SUITES Rotterdam co-working area 또는 Rotterdam Centraal 인근 업무공간",\n      "도보",\n      "3시간",\n      { notes: "얼리 체크인 여부와 무관하게 진행 가능하도록 공식 co-working area 또는 중앙역 인근 업무공간을 사용. 객실 입실이 완료되면 객실에서 진행 가능." },',1)

# Replace remaining Rotterdam hotel references in events and encoded map origins.
s=s.replace('Holiday Inn Express Rotterdam Central Station', HOTEL)
s=s.replace('Holiday Inn Express Rotterdam Central', HOTEL)
s=s.replace('Holiday+Inn+Express+Rotterdam+Central', 'PREMIER+SUITES+Rotterdam+Weena+710')

# Ensure checkout and Port of Rotterdam departure are based at Weena 710.
s=s.replace('"PREMIER SUITES Rotterdam",\n      "도보",\n      "50분",','"PREMIER SUITES Rotterdam, Weena 710, 3014 DA Rotterdam",\n      "도보",\n      "50분",',1)
s=s.replace('"TNO → 로테르담 중앙역·짐 회수",\n      "교통",\n      "Rijswijk → Rotterdam Centraal",','"TNO → PREMIER SUITES 짐 회수 → 로테르담 중앙역",\n      "교통",\n      "TNO Kesslerpark 1 → PREMIER SUITES Rotterdam, Weena 710 → Rotterdam Centraal",',1)

# Replace hotel record with only facts supported by the booking message / official property info.
pat=r'''  \{\n    id: "h2",.*?\n    sort_order: 20,\n  \},'''
m=re.search(pat,s,re.S)
if not m: raise SystemExit('h2 block not found')
h2='''  {\n    id: "h2",\n    day_id: 4,\n    name: "PREMIER SUITES Rotterdam",\n    city: "Rotterdam",\n    check_in: "2026-09-05",\n    check_out: "2026-09-07",\n    nights: 2,\n    rooms: null,\n    min_krw: null,\n    max_krw: null,\n    status: "예약숙소·10:00~11:00 얼리체크인 요청(가용 시)",\n    alternative: "",\n    url: "'''+OFFICIAL+'''",\n    notes: "Weena 710, 3014 DA Rotterdam · 9/5~9/7. 숙소 메시지상 10:00~11:00 체크인 요청은 가능한 경우 제공. 공식 기본 체크인 15:00·체크아웃 11:00·24시간 리셉션·수하물 보관 가능. 12:00 이전 얼리체크인은 공식 FAQ상 가용 시 가능하며 €25가 부과될 수 있음. 전달자료에는 객실 수·예약 인원·결제금액이 없어 임의 입력하지 않음.",\n    sort_order: 20,\n  },'''
s=s[:m.start()]+h2+s[m.end():]

# Update map point hotel labels and exact official coordinates.
s=s.replace('name: "Holiday Inn Express Rotterdam Central"','name: "PREMIER SUITES Rotterdam · Weena 710"')
s=s.replace('name: "PREMIER SUITES Rotterdam"','name: "PREMIER SUITES Rotterdam · Weena 710"')
s=s.replace('lat: 51.9255,\n      lng: 4.478,','lat: 51.9225689,\n      lng: 4.469973,')
s=s.replace('url: "https://www.ihg.com/holidayinnexpress/hotels/us/en/rotterdam/rtmcs/hoteldetail"','url: "'+OFFICIAL+'"')
s=s.replace('popup: saving ? "06:35 도착" : "07:40 도착",','popup: "07:40 도착",',1)

# Add an explicit luggage-pickup point on Day 6 before Rotterdam Centraal if not already present.
needle='''    {\n      id: "p34",\n      day_id: 6,\n      name: "Rotterdam Centraal",'''
if needle in s and 'id: "p33a"' not in s:
    insert='''    {\n      id: "p33a",\n      day_id: 6,\n      name: "PREMIER SUITES Rotterdam · Weena 710 · 짐 회수",\n      lat: 51.9225689,\n      lng: 4.469973,\n      sort_order: 5,\n      segment_type: "car",\n      popup: "TNO 미팅 후 수하물 회수",\n      url: "'''+OFFICIAL+'''",\n    },\n'''
    s=s.replace(needle,insert+needle,1)
    s=s.replace('id: "p34",\n      day_id: 6,\n      name: "Rotterdam Centraal",\n      lat: 51.9244,\n      lng: 4.4699,\n      sort_order: 5,','id: "p34",\n      day_id: 6,\n      name: "Rotterdam Centraal",\n      lat: 51.9244,\n      lng: 4.4699,\n      sort_order: 6,',1)
    s=s.replace('id: "p35",\n      day_id: 6,','id: "p35",\n      day_id: 6,',1)

p.write_text(s,encoding='utf-8')

# Verified map manifest: all Rotterdam lodging routes now use Weena 710.
p=Path('map-routing.mjs')
s=p.read_text(encoding='utf-8')
s=s.replace('Holiday Inn Express Rotterdam - Central Station','PREMIER SUITES Rotterdam, Weena 710, 3014 DA Rotterdam')
s=s.replace('"d4-02": {kind:"place",query:"PREMIER SUITES Rotterdam, Weena 710, 3014 DA Rotterdam"},','"d4-02": {kind:"route",origin:"Rotterdam Centraal",destination:"PREMIER SUITES Rotterdam, Weena 710, 3014 DA Rotterdam",mode:"walking"},')
p.write_text(s,encoding='utf-8')

# Timeline detail text: do not retain the previous recommendation hotel and detail the luggage pickup.
p=Path('timeline-runtime-v17.js')
s=p.read_text(encoding='utf-8')
s=s.replace('Holiday Inn Express Rotterdam - Central Station','PREMIER SUITES Rotterdam · Weena 710')
s=s.replace('Holiday Inn Express Rotterdam Central','PREMIER SUITES Rotterdam · Weena 710')
s=s.replace('"d6-08":[[0,40,"택시 · TNO → Rotterdam Centraal","move"],[40,70,"도보·짐 회수·승차 준비","wait"]]', '"d6-08":[[0,25,"택시 · TNO → PREMIER SUITES Weena 710","move"],[25,30,"수하물 회수","wait"],[30,35,"도보 · PREMIER SUITES → Rotterdam Centraal","move"]]')
p.write_text(s,encoding='utf-8')
