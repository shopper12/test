from pathlib import Path

# map-routing: remove final stale Motel One endpoint
p=Path('map-routing.mjs')
s=p.read_text(encoding='utf-8')
s=s.replace('"d6-10": {kind:"route",origin:"Hamburg Hbf",destination:"Motel One Hamburg-Fleetinsel",mode:"driving"},','"d6-10": {kind:"route",origin:"Hamburg Hbf",destination:"Best Western Plus Hotel St. Raphael, Adenauerallee 41, Hamburg",mode:"walking"},')
p.write_text(s,encoding='utf-8')

# report memo: align event IDs with the new meeting placement.
p=Path('report-memo.js')
s=p.read_text(encoding='utf-8')
old='''  "d7-03": "DNV",\n  "d7-05": "Skyborn",\n  "d7-06": "OWC",\n  "d9-03": "Blue Water",\n  "d9-05": "OWC",'''
new='''  "d7-03": "OWC",\n  "d7-05": "Skyborn",\n  "d8-012": "DNV",\n  "d9-03": "Blue Water",\n  "d9-055": "OWC",'''
if old not in s: raise SystemExit('missing meeting hints')
s=s.replace(old,new,1)
# Event-level live status is more specific than the generic meeting-table status.
s=s.replace('const status = clean(meeting?.status || event?.meeting_status || "일정 협의 중");','const status = clean(event?.meeting_status || meeting?.status || "일정 협의 중");',1)
p.write_text(s,encoding='utf-8')

# timeline detail segmentation: align with latest live itinerary
p=Path('timeline-runtime-v17.js')
s=p.read_text(encoding='utf-8')
old='''"d7-07":[[0,15,"도보 · OWC Alter Wall 69 → Elbphilharmonie","move"],[15,95,"Elbphilharmonie Plaza 체류","stay"],[95,110,"HVV U-Bahn · Landungsbrücken","move"],[110,180,"Landungsbrücken 산책·저녁","stay"]],\n"d8-01":[[0,50,"조식·체크아웃","stay"],[50,75,"U-Bahn 또는 택시 · Hamburg Hbf","move"],[75,105,"역 도보·승차 준비","wait"]],'''
new='''"d7-07":[[0,35,"Best Western St. Raphael → Elbphilharmonie · U-Bahn/도보","move"],[35,105,"Elbphilharmonie Plaza 체류","stay"],[105,125,"HVV · Landungsbrücken 이동","move"],[125,240,"Landungsbrücken 산책·저녁","stay"]],\n"d8-01":[[0,55,"조식·체크아웃·호텔에 수하물 임시보관","stay"]],\n"d8-011":[[0,15,"택시 · Best Western St. Raphael → DNV Brooktorkai 18","move"]],\n"d8-012":[[0,70,"DNV Hamburg 기술미팅 · Digital Twin·인증·기술검증","stay"]],\n"d8-013":[[0,15,"택시 · DNV → Best Western St. Raphael","move"],[15,25,"호텔 수하물 회수","wait"],[25,40,"호텔 → Hamburg Hbf","move"]],'''
if old not in s: raise SystemExit('missing Hamburg fixed segments')
s=s.replace(old,new,1)
old='''"d9-04":[[0,20,"택시 · Blue Water Shipping → Centrum","move"],[20,60,"점심","stay"],[60,90,"도보 · 호텔 복귀","move"]],\n"d9-07":[[0,15,"기차 · København H → Ørestad","move"],[15,25,"도보 · Ørestad → CABINN Metro","move"],[25,55,"호텔 체크인","stay"]],'''
new='''"d9-04":[[0,120,"전용차량 · Blue Water Shipping Esbjerg → Kolding → Vejle → Horsens → OWC Aarhus","move"]],\n"d9-05":[[0,75,"Aarhus 도착·점심·15:00 OWC 미팅 준비","stay"]],\n"d9-055":[[0,90,"OWC Denmark 기술미팅 · René Aagaard / Rune Nørgaard","stay"]],\n"d9-06":[[0,10,"OWC 미팅 핵심내용 메모","stay"],[10,20,"도보 · Banegårdspladsen 4 → Aarhus H","move"],[20,35,"승차 준비","wait"]],\n"d9-07":[[0,196,"DSB InterCityLyn 후보 · Aarhus H → Skanderborg → Horsens → Vejle → Fredericia → Odense → Ringsted → København H","move"]],\n"d9-08":[[0,20,"København H → Ørestad 지역열차","move"],[20,30,"Ørestad → CABINN Metro 도보","move"],[30,84,"체크인·간단한 저녁","stay"]],'''
if old not in s: raise SystemExit('missing Denmark fixed segments')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
