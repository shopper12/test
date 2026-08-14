from pathlib import Path

itinerary = Path('itinerary-data.js')
text = itinerary.read_text(encoding='utf-8')

replacements = [
    (
        'businessLocationRule: "첨부 계획서의 업무장소 7곳만 유지",',
        'businessLocationRule: "첨부 계획서 업무장소 + 2026-08-14 요청 OWC Germany/Denmark 기술미팅",',
    ),
    (
        'summary:\n        "Skyborn Renewables 회의 · HafenCity·Speicherstadt·Elbphilharmonie",',
        'summary:\n        "Skyborn Renewables 회의 · OWC Germany 기술미팅 · HafenCity·Elbphilharmonie",',
    ),
    (
        'summary:\n        "Blue Water Shipping 회의·내용정리 후 DSB로 코펜하겐 이동 · EBJ/ABZ 환승 제거",',
        'summary:\n        "Blue Water Shipping 회의 · OWC Denmark 기술미팅 · 15:32 DSB로 코펜하겐 이동",',
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f'missing expected text: {old[:80]}')
    text = text.replace(old, new, 1)

old_d706 = '''    e(\n      "d7-06",\n      7,\n      "15:30",\n      "17:30",\n      "Skyborn 회의내용 정리",\n      "업무정리",\n      "HafenCity",\n      "도보",\n      "2시간",\n    ),'''
new_d706 = '''    e(\n      "d7-055",\n      7,\n      "15:15",\n      "15:40",\n      "Skyborn Renewables → OWC Hamburg 이동",\n      "교통",\n      "Ericusspitze 2-4 → Alter Wall 69, Hamburg",\n      "도보/택시",\n      "25분",\n      {\n        sort_order: 55,\n        map_url:\n          "https://www.google.com/maps/dir/?api=1&origin=Skyborn+Renewables+Ericusspitze+2-4+Hamburg&destination=OWC+Alter+Wall+69+Hamburg",\n        notes: "Skyborn 회의 종료 후 OWC Germany 미팅 장소로 바로 이동.",\n      },\n    ),\n    e(\n      "d7-06",\n      7,\n      "15:45",\n      "17:15",\n      "OWC Germany 해상풍력 기술미팅 (요청 중)",\n      "업무",\n      "OWC Hamburg, Alter Wall 69, 20457 Hamburg",\n      "도보",\n      "90분",\n      {\n        official_url: "https://owcltd.com/offices/hamburg/",\n        map_url:\n          "https://www.google.com/maps/search/?api=1&query=OWC+Alter+Wall+69+20457+Hamburg",\n        meeting_status: "OWC 회신·참석자 확인 대기",\n        attendees: [\n          "풍력사업실 김동일 차장",\n          "풍력사업실 송승택 차장",\n          "사업금융부 박보인 차장",\n          "법무실 박주선 팀장",\n        ],\n        meeting_agenda: [\n          "유럽 해상풍력 Owner’s Engineering 및 Technical Advisory 수행 사례",\n          "개발 초기 기술성 검토 및 Technical Risk 관리 방식",\n          "WTG·Foundation·Cable·Offshore Substation 설계 및 기술검토",\n          "설계 최적화·사업비·LCoE 절감 Engineering Approach",\n          "독일 해상풍력 프로젝트·기술자문 사례 및 시장 특성",\n          "국내 해상풍력 사업 적용 시 기술적 시사점",\n        ],\n        notes:\n          "희망일 9/8 또는 9/9 오후 중 현 교통표상 9/8을 우선 반영. 9/9는 10:53 Hamburg Hbf 출발 확정 열차 때문에 오후 미팅 불가. 독일팀에는 독일 프로젝트·기술자문 사례를 중심으로 요청. 시간·참석자는 OWC 일정에 맞춰 조정 가능.",\n      },\n    ),'''
if old_d706 not in text:
    raise SystemExit('d7-06 block not found')
text = text.replace(old_d706, new_d706, 1)

old_d707 = '''    e(\n      "d7-07",\n      7,\n      "17:30",\n      "20:30",\n      "Elbphilharmonie Plaza·Landungsbrücken·저녁",\n      "관광·식사",\n      "Hamburg HafenCity",\n      "도보+U-Bahn",\n      "3시간",'''
new_d707 = '''    e(\n      "d7-07",\n      7,\n      "17:20",\n      "20:30",\n      "Elbphilharmonie Plaza·Landungsbrücken·저녁",\n      "관광·식사",\n      "OWC Hamburg → Elbphilharmonie → Landungsbrücken",\n      "도보+U-Bahn",\n      "3시간 10분",'''
if old_d707 not in text:
    raise SystemExit('d7-07 block not found')
text = text.replace(old_d707, new_d707, 1)

old_d905 = '''    e(\n      "d9-05",\n      9,\n      "13:00",\n      "15:10",\n      "독일·덴마크 방문내용 정리",\n      "업무정리",\n      "CABINN Plus 라운지/도심 업무공간",\n      "도보",\n      "2시간 10분",\n    ),'''
new_d905 = '''    e(\n      "d9-05",\n      9,\n      "13:00",\n      "14:30",\n      "OWC Denmark 해상풍력 기술미팅 (요청 중)",\n      "업무",\n      "CABINN Plus Esbjerg / OWC 지정 Esbjerg 장소(협의 중)",\n      "도보/택시",\n      "90분",\n      {\n        official_url: "https://owcltd.com/offices/",\n        map_url:\n          "https://www.google.com/maps/search/?api=1&query=CABINN+Plus+Esbjerg+Torvegade+27",\n        meeting_status: "OWC Denmark 회신·Esbjerg 참석자·장소 확인 대기",\n        attendees: [\n          "풍력사업실 김동일 차장",\n          "풍력사업실 송승택 차장",\n          "사업금융부 박보인 차장",\n          "법무실 박주선 팀장",\n        ],\n        meeting_agenda: [\n          "덴마크 및 북해 해상풍력 Owner’s Engineering·Technical Advisory 사례",\n          "개발 초기 Technical Risk·설계 의사결정 관리",\n          "WTG·Foundation·Cable·Offshore Substation 패키지 기술검토",\n          "Engineering 최적화와 사업비·LCoE 절감",\n          "Asset Management 및 BoP O&M 기술지원 사례",\n          "독일 대비 덴마크 해상풍력 시장·프로젝트 환경 차이",\n          "국내 사업 적용 가능한 기술적 시사점",\n        ],\n        notes:\n          "덴마크팀과 9/10 오후 별도 미팅 요청을 반영. OWC Denmark 공식 사무실은 Aarhus이므로 Esbjerg 방문 미팅 장소는 OWC 측과 협의 후 확정. 오전 Blue Water Shipping 회의 후 진행하며 15:32 DSB IC850 탑승을 위해 14:30 종료 권고. O&M·Asset Management 사례를 중점 요청.",\n      },\n    ),\n    e(\n      "d9-055",\n      9,\n      "14:30",\n      "15:10",\n      "OWC 미팅 종료·짐 회수 → Esbjerg Station",\n      "교통",\n      "Esbjerg meeting venue → CABINN Plus → Esbjerg St.",\n      "도보/택시",\n      "40분",\n      {\n        sort_order: 55,\n        map_url:\n          "https://www.google.com/maps/dir/?api=1&origin=CABINN+Plus+Esbjerg+Torvegade+27&destination=Esbjerg+Station",\n        notes: "15:32 IC850 탑승 기준 20분 이상 승차 여유 확보. OWC 미팅 장소가 호텔 외부로 확정되면 출발 동선 재산정.",\n      },\n    ),'''
if old_d905 not in text:
    raise SystemExit('d9-05 block not found')
text = text.replace(old_d905, new_d905, 1)

itinerary.write_text(text, encoding='utf-8')

routing = Path('map-routing.mjs')
r = routing.read_text(encoding='utf-8')

old_map_d7 = '''  "d7-05": {kind:"place",query:"Skyborn Renewables, Ericusspitze 2-4, Hamburg"},\n  "d7-06": {kind:"place",query:"HafenCity, Hamburg"},\n  "d7-07": {kind:"route",origin:"HafenCity, Hamburg",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},'''
new_map_d7 = '''  "d7-05": {kind:"place",query:"Skyborn Renewables, Ericusspitze 2-4, Hamburg"},\n  "d7-055": {kind:"route",origin:"Skyborn Renewables, Ericusspitze 2-4, Hamburg",destination:"OWC, Alter Wall 69, 20457 Hamburg",mode:"walking"},\n  "d7-06": {kind:"place",query:"OWC, Alter Wall 69, 20457 Hamburg"},\n  "d7-07": {kind:"route",origin:"OWC, Alter Wall 69, 20457 Hamburg",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},'''
if old_map_d7 not in r:
    raise SystemExit('d7 map manifest block not found')
r = r.replace(old_map_d7, new_map_d7, 1)

old_map_d9 = '''  "d9-04": {kind:"route",origin:"Blue Water Shipping, Trafikhavnskaj 9, Esbjerg",waypoints:"Esbjerg Centrum",destination:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",mode:"driving"},\n  "d9-05": {kind:"place",query:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg"},\n  "d9-06": {kind:"route",origin:"Esbjerg Station",destination:"København H, Copenhagen",mode:"transit"},'''
new_map_d9 = '''  "d9-04": {kind:"route",origin:"Blue Water Shipping, Trafikhavnskaj 9, Esbjerg",waypoints:"Esbjerg Centrum",destination:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",mode:"driving"},\n  "d9-05": {kind:"place",query:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg"},\n  "d9-055": {kind:"route",origin:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",destination:"Esbjerg Station",mode:"walking"},\n  "d9-06": {kind:"route",origin:"Esbjerg Station",destination:"København H, Copenhagen",mode:"transit"},'''
if old_map_d9 not in r:
    raise SystemExit('d9 map manifest block not found')
r = r.replace(old_map_d9, new_map_d9, 1)

routing.write_text(r, encoding='utf-8')

print('OWC meetings patched into itinerary-data.js and map-routing.mjs')
