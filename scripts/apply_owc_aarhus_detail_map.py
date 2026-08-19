from pathlib import Path
import re


def replace_once(s, old, new, label):
    if old not in s:
        raise SystemExit(f'missing {label}')
    return s.replace(old, new, 1)

# itinerary-data.js
p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')
s=replace_once(s,'"인천 → 타이중·루강 → 타오위안 → 암스테르담·로테르담·라이스베이크 → 함부르크 → 에스비에르 → 코펜하겐 → 인천",','"인천 → 타이중·루강 → 타오위안 → 암스테르담·로테르담·라이스베이크 → 함부르크 → 에스비에르 → 오르후스 → 코펜하겐 → 인천",','route meta')
s=replace_once(s,'lastVerified: "2026-08-14",','lastVerified: "2026-08-19",','last verified')
s=replace_once(s,'cities: "에스비에르 → 코펜하겐",\n      lodging: "CABINN Metro Copenhagen",\n      summary:\n        "Blue Water Shipping 회의 · OWC Denmark 기술미팅 · 15:32 DSB로 코펜하겐 이동",','cities: "에스비에르 → 오르후스 → 코펜하겐",\n      lodging: "CABINN Metro Copenhagen",\n      summary:\n        "Blue Water Shipping 회의 · 차량으로 Aarhus 이동 · 15:00 OWC Denmark 확정 미팅 · Aarhus H에서 저녁 열차로 코펜하겐 이동",','day9 summary')

start=s.index('    e(\n      "d9-01",')
end=s.index('    ...(saving', start)
new_day9='''    e(
      "d9-01",
      9,
      "07:30",
      "09:05",
      "조식·체크아웃·짐 동반 출발 준비",
      "숙박·업무준비",
      "CABINN Plus Esbjerg, Torvegade 27, 6700 Esbjerg",
      "도보",
      "1시간 35분",
      {
        notes: "OWC Denmark 미팅 장소가 Aarhus로 확정되어 호텔 재방문 없이 짐을 동반해 Blue Water Shipping으로 이동하도록 변경.",
      },
    ),
    e(
      "d9-02",
      9,
      "09:05",
      "09:25",
      "CABINN Plus → Blue Water Shipping 이동",
      "교통",
      "CABINN Plus Esbjerg → Blue Water Shipping, Trafikhavnskaj 9, 6700 Esbjerg",
      "택시/기사차량",
      "20분",
      {
        map_url: "https://www.google.com/maps/dir/?api=1&origin=CABINN+Plus+Esbjerg+Torvegade+27&destination=Blue+Water+Shipping+Trafikhavnskaj+9+Esbjerg&travelmode=driving",
        notes: "짐을 차량에 동반. Blue Water Shipping 공식 Esbjerg 본사 주소 Trafikhavnskaj 9 기준.",
      },
    ),
    e(
      "d9-03",
      9,
      "09:30",
      "11:30",
      "Blue Water Shipping 회의",
      "업무",
      "Blue Water Shipping A/S, Trafikhavnskaj 9, 6700 Esbjerg",
      "도보",
      "2시간",
      {
        official_url: "https://www.bws.net/contact/denmark/esbjerg",
        map_url: "https://www.google.com/maps/search/?api=1&query=Blue+Water+Shipping+Trafikhavnskaj+9+6700+Esbjerg",
        notes: "해상풍력 터빈 공급망·운송·보관·통관·Port Service 및 해상풍력 물류 수행체계 논의.",
      },
    ),
    e(
      "d9-04",
      9,
      "11:30",
      "13:30",
      "Blue Water Shipping → Aarhus 이동",
      "교통",
      "Trafikhavnskaj 9, Esbjerg → Kolding → Vejle → Horsens → Banegårdspladsen 4, 8000 Aarhus C",
      "전용차량/대형택시",
      "최대 약 2시간",
      {
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Blue+Water+Shipping+Trafikhavnskaj+9+Esbjerg&destination=Banegardspladsen+4+8000+Aarhus+C&waypoints=Kolding|Vejle|Horsens&travelmode=driving",
        notes: "OWC 측 안내 최대 약 2시간을 기준으로 차량 이동. 4인+수하물이므로 당일 전용차량 또는 대형택시 사전예약 권고. E20→E45 축으로 이동하고 점심은 도착 후 진행.",
        route_detail: ["Blue Water Shipping · Trafikhavnskaj 9", "E20 · Kolding 방면", "E45 · Vejle", "E45 · Horsens", "OWC Denmark · Banegårdspladsen 4, Aarhus"],
      },
    ),
    e(
      "d9-05",
      9,
      "13:30",
      "14:45",
      "Aarhus 도착·점심·OWC 미팅 준비",
      "식사·업무준비",
      "Banegårdspladsen / Aarhus H 일대, 8000 Aarhus C",
      "도보",
      "1시간 15분",
      {
        map_url: "https://www.google.com/maps/search/?api=1&query=Banegardspladsen+4+8000+Aarhus+C",
        notes: "15:00 확정 미팅 전 30분 이상 도착 버퍼 확보. OWC 사무실이 Aarhus H 바로 앞 Banegårdspladsen에 있어 미팅 후 철도 환승에도 유리.",
      },
    ),
    e(
      "d9-055",
      9,
      "15:00",
      "16:30",
      "OWC Denmark 해상풍력 기술미팅 (15:00 확정)",
      "업무",
      "OWC Denmark, Banegårdspladsen 4, 2. sal th, 8000 Aarhus C, Denmark",
      "도보",
      "90분 계획",
      {
        sort_order: 55,
        official_url: "https://owcltd.com/offices/aarhus-2/",
        map_url: "https://www.google.com/maps/search/?api=1&query=OWC+Banegardspladsen+4+8000+Aarhus+C+Denmark",
        meeting_status: "9/10 15:00·Aarhus 주소·참석자 확정 / 종료시각 16:30은 출장 동선상 계획값",
        attendees: ["René Aagaard · Country Manager, OWC Denmark", "Rune Nørgaard · Deputy Country Manager, OWC Denmark"],
        meeting_agenda: [
          "덴마크 및 북해 해상풍력 Owner’s Engineering·Technical Advisory 수행 사례",
          "개발 초기 Technical Risk·설계 의사결정 관리",
          "WTG·Foundation·Cable·Offshore Substation 패키지 기술검토",
          "Engineering 최적화 및 사업비·LCoE 절감",
          "Asset Management 및 BoP O&M 기술지원 사례",
          "덴마크 WTG 설치·운영·최적화 및 공급망·항만 인프라 대응 경험",
          "독일 대비 덴마크 해상풍력 시장·프로젝트 환경 차이와 국내 적용 시사점",
        ],
        notes: "미팅 시작 15:00, 장소와 참석자 확정. René Aagaard(Country Manager), Rune Nørgaard(Deputy Country Manager) 참석. 종료시각은 회신에 명시되지 않아 90분을 계획값으로 두고 후속 Aarhus H 열차와 연계.",
      },
    ),
    e(
      "d9-06",
      9,
      "16:30",
      "17:05",
      "OWC 미팅 정리·Aarhus H 이동·승차 준비",
      "업무정리·교통",
      "OWC Denmark, Banegårdspladsen 4 → Aarhus H",
      "도보",
      "35분",
      {
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Banegardspladsen+4+8000+Aarhus+C&destination=Aarhus+H&travelmode=walking",
        notes: "OWC 사무실은 Aarhus H 전면 Banegårdspladsen에 위치. 미팅 종료 직후 핵심내용 메모 후 승강장 이동.",
      },
    ),
    e(
      "d9-07",
      9,
      "17:20",
      "20:36",
      "Aarhus → Copenhagen",
      "교통",
      "Aarhus H → Skanderborg → Horsens → Vejle → Fredericia → Odense → Ringsted → København H",
      "DSB InterCityLyn",
      "3시간 16분 후보",
      {
        booking_url: "https://www.dsb.dk/en/",
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Aarhus+H&destination=Kobenhavn+H&waypoints=Skanderborg+Station|Horsens+Station|Vejle+Station|Fredericia+Station|Odense+Station|Ringsted+Station&travelmode=transit",
        min_cost_krw: 320_000,
        max_cost_krw: 600_000,
        cost_basis: "4인·Orange/일반 운임",
        notes: "현재 Rejseplanen K26 패턴상 ICL 50058이 Aarhus H 17:20→København H 20:36. 다만 9/7~9/11 선로공사·일자별 예외가 있어 9/10 실제 운행 여부와 편명은 출발 3일 전 재확인. 미팅이 16:30 종료된다는 계획값 기준 50분 버퍼.",
        route_detail: ["Aarhus H", "Skanderborg St.", "Horsens St.", "Vejle St.", "Fredericia St.", "Odense St.", "Ringsted St.", "København H"],
        schedule_legs: [
          { status: "provisional", service: "DSB ICL 50058 후보", from: "Aarhus H", depart: "17:20 후보", to: "København H", arrive: "20:36 후보", source_label: "Rejseplanen K26 현행 패턴 · 9/10 선로공사/일자별 예외 3일 전 재확인" },
        ],
      },
    ),
    e(
      "d9-08",
      9,
      "20:36",
      "22:00",
      "København H → CABINN Metro 체크인·간단한 저녁",
      "교통·숙박·식사",
      "København H → Ørestad St. → CABINN Metro, Arne Jacobsens Allé 2",
      "지역열차+도보",
      "1시간 24분",
      {
        booking_url: "https://en.cabinn.com/hotel/cabinn-metro",
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Kobenhavn+H&destination=CABINN+Metro+Arne+Jacobsens+Alle+2&waypoints=Orestad+Station&travelmode=transit",
        notes: "Aarhus발 열차 도착 후 Ørestad 방면 첫 적정 지역열차 이용. 9/7~9/12 선로공사 때문에 현지 연결편은 3일 전 재확인하고, 지연 시 København H→호텔 택시로 대체.",
        route_detail: ["København H", "Ørestad St.", "CABINN Metro"],
      },
    ),
'''
s=s[:start]+new_day9+s[end:]

# OWC Germany meeting metadata
old='''  {
    id: "m9",
    day_id: 7,
    organization: "OWC Germany · Hamburg",
    agenda: "독일 해상풍력 Owner’s Engineering·Technical Advisory·초기 Technical Risk·WTG/Foundation/Cable/Offshore Substation 기술검토·설계 최적화 및 LCoE 절감",
    recommended_duration: "90분",
    contact: "",
    status: "요청 중",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://owcltd.com/offices/hamburg/",
    notes: "Alter Wall 69, 20457 Hamburg · 희망 9/8 또는 9/9 오후",
    sort_order: 65,
  },'''
new='''  {
    id: "m9",
    day_id: 7,
    organization: "OWC Germany · Hamburg",
    agenda: "독일 해상풍력 Independent Engineering·기술실사·Lender’s Technical Advisory·Owner’s Engineering·Technical Risk·주요 패키지 기술검토·설계 최적화 및 LCoE 절감",
    recommended_duration: "90분 계획",
    contact: "Christian Apeah · Global Head of Independent Engineering / 기술실사·Lender’s Technical Advisory 부문장",
    status: "참석자 확정·날짜/시간/장소 조율 중",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://owcltd.com/our-people/",
    notes: "Christian Apeah 참석 확정. 해당 주간 OWC Hamburg 사무실 이전으로 날짜·시간·장소 조율 중. 대시보드 9/8 15:00 블록은 동선 검토용 가예약이며 회신 즉시 변경.",
    sort_order: 65,
  },'''
s=replace_once(s,old,new,'m9')
old='''  {
    id: "m10",
    day_id: 9,
    organization: "OWC Denmark · Esbjerg 미팅",
    agenda: "덴마크·북해 Owner’s Engineering/Technical Advisory·Technical Risk·주요 패키지 기술검토·Engineering 최적화·Asset Management·BoP O&M·독일 대비 덴마크 시장 차이",
    recommended_duration: "90분",
    contact: "",
    status: "요청 중",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://owcltd.com/offices/aarhus-2/",
    notes: "OWC Denmark 공식 사무실은 Aarhus. 9/10 오후 Esbjerg 체류 중 현지 미팅 장소·참석자 협의 중.",
    sort_order: 80,
  },'''
new='''  {
    id: "m10",
    day_id: 9,
    organization: "OWC Denmark · Aarhus",
    agenda: "덴마크·북해 Owner’s Engineering/Technical Advisory·Technical Risk·주요 패키지 기술검토·Engineering 최적화·Asset Management·BoP O&M·WTG 설치·운영·최적화·독일 대비 덴마크 시장 차이",
    recommended_duration: "15:00 시작 확정·90분 계획",
    contact: "René Aagaard · Country Manager / Rune Nørgaard · Deputy Country Manager",
    status: "9/10 15:00·주소·참석자 확정",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://owcltd.com/offices/aarhus-2/",
    notes: "Banegårdspladsen 4, 2. sal th, 8000 Aarhus C. Esbjerg에서 차량 최대 약 2시간 안내. 종료시각은 미확정이므로 출장 동선상 16:30을 계획값으로 설정.",
    sort_order: 80,
  },'''
s=replace_once(s,old,new,'m10')

old='''  {
    id: "t5",
    region: "에스비에르→코펜하겐·현지교통",
    recommendation: "DSB InterCity + 대중교통",
    reason: "EBJ→ABZ 항공과 영국 환승 제거",
    min_krw: 620_000,
    max_krw: 900_000,
    notes: "Orange 운임 우선·코펜하겐 공항 전날 이동",
    sort_order: 50,
  },'''
new='''  {
    id: "t5",
    region: "에스비에르→오르후스→코펜하겐",
    recommendation: "전용차량/대형택시 + DSB InterCityLyn",
    reason: "9/10 15:00 OWC Denmark Aarhus 미팅 확정으로 Esbjerg→Aarhus 차량 이동 후 역전 사무실에서 바로 Aarhus H 철도 연계",
    min_krw: 620_000,
    max_krw: 1_200_000,
    notes: "Esbjerg→Aarhus 차량 견적 별도 확인 · Aarhus H→København H Orange 운임 우선 · 9/10 선로공사 3일 전 재확인",
    sort_order: 50,
  },'''
s=replace_once(s,old,new,'t5')

# detailed map points day 7-9, replace p37 through before p51
mstart=s.index('    {\n      id: "p37",')
mend=s.index('    {\n      id: "p51",',mstart)
new_points='''    {
      id: "p37", day_id: 7, name: "Motel One Hamburg-Fleetinsel", lat: 53.5484, lng: 9.9848, sort_order: 1, segment_type: "walk", popup: "08:00 업무 준비", url: "",
    },
    {
      id: "p38", day_id: 7, name: "DNV Hamburg · Brooktorkai 18", lat: 53.5430, lng: 10.0030, sort_order: 2, segment_type: "walk", popup: "09:30 기술미팅", url: "https://www.dnv.com/contact/digital-solutions/",
    },
    {
      id: "p39", day_id: 7, name: "Skyborn Renewables · Ericusspitze 2-4", lat: 53.5454, lng: 10.0032, sort_order: 3, segment_type: "walk", popup: "13:00 사업개발 미팅", url: "https://www.skybornrenewables.com/contact",
    },
    {
      id: "p40", day_id: 7, name: "OWC Hamburg · 장소 조율중", lat: 53.5490, lng: 9.9900, sort_order: 4, segment_type: "walk", popup: "Christian Apeah 참석 확정 · 시간/장소 조율중", url: "https://owcltd.com/our-people/",
    },
    {
      id: "p40a", day_id: 7, name: "Elbphilharmonie", lat: 53.5413, lng: 9.9841, sort_order: 5, segment_type: "subway", popup: "미팅 후", url: "https://www.elbphilharmonie.de/en/plaza-tickets",
    },
    {
      id: "p40b", day_id: 7, name: "Landungsbrücken", lat: 53.5461, lng: 9.9663, sort_order: 6, segment_type: "subway", popup: "저녁", url: "",
    },
    {
      id: "p41", day_id: 8, name: "Motel One Hamburg-Fleetinsel", lat: 53.5484, lng: 9.9848, sort_order: 1, segment_type: "subway", popup: "07:30 체크아웃", url: "",
    },
    {
      id: "p42", day_id: 8, name: "Hamburg Hbf", lat: 53.5527, lng: 10.0067, sort_order: 2, segment_type: "subway", popup: "10:53 ECE 396 출발", url: "",
    },
    {
      id: "p42a", day_id: 8, name: "Kolding St.", lat: 55.4904, lng: 9.4723, sort_order: 3, segment_type: "rail", popup: "13:44 도착 · 14:06 IC2340 환승", url: "",
    },
    {
      id: "p43", day_id: 8, name: "Esbjerg Station", lat: 55.4667, lng: 8.4578, sort_order: 4, segment_type: "rail", popup: "14:54 도착", url: "",
    },
    {
      id: "p44", day_id: 8, name: "CABINN Plus Esbjerg", lat: 55.4676, lng: 8.4525, sort_order: 5, segment_type: "walk", popup: "15:30 체크인", url: "https://en.cabinn.com/hotel/cabinn-esbjerg-plus",
    },
    {
      id: "p45", day_id: 8, name: "Men at Sea", lat: 55.4870, lng: 8.4108, sort_order: 6, segment_type: "subway", popup: "15:45 이후", url: "",
    },
    {
      id: "p46", day_id: 9, name: "CABINN Plus Esbjerg", lat: 55.4676, lng: 8.4525, sort_order: 1, segment_type: "car", popup: "09:05 짐 동반 출발", url: "",
    },
    {
      id: "p47", day_id: 9, name: "Blue Water Shipping · Trafikhavnskaj 9", lat: 55.4650, lng: 8.4430, sort_order: 2, segment_type: "car", popup: "09:30~11:30 회의", url: "https://www.bws.net/contact/denmark/esbjerg",
    },
    {
      id: "p47a", day_id: 9, name: "Kolding · E20/E45", lat: 55.4904, lng: 9.4723, sort_order: 3, segment_type: "car", popup: "Aarhus 차량 이동 경유축", url: "",
    },
    {
      id: "p47b", day_id: 9, name: "Vejle · E45", lat: 55.7113, lng: 9.5364, sort_order: 4, segment_type: "car", popup: "Aarhus 차량 이동 경유축", url: "",
    },
    {
      id: "p47c", day_id: 9, name: "Horsens · E45", lat: 55.8607, lng: 9.8503, sort_order: 5, segment_type: "car", popup: "Aarhus 차량 이동 경유축", url: "",
    },
    {
      id: "p48", day_id: 9, name: "OWC Denmark · Banegårdspladsen 4", lat: 56.1503, lng: 10.2039, sort_order: 6, segment_type: "car", popup: "15:00 미팅 확정 · René Aagaard / Rune Nørgaard", url: "https://owcltd.com/offices/aarhus-2/",
    },
    {
      id: "p48a", day_id: 9, name: "Aarhus H", lat: 56.1500, lng: 10.2030, sort_order: 7, segment_type: "walk", popup: "17:20 ICL 50058 후보", url: "https://www.dsb.dk/en/",
    },
    {
      id: "p48b", day_id: 9, name: "Skanderborg St.", lat: 56.0340, lng: 9.9270, sort_order: 8, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p48c", day_id: 9, name: "Horsens St.", lat: 55.8610, lng: 9.8450, sort_order: 9, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p48d", day_id: 9, name: "Vejle St.", lat: 55.7068, lng: 9.5364, sort_order: 10, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p48e", day_id: 9, name: "Fredericia St.", lat: 55.5683, lng: 9.7538, sort_order: 11, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p48f", day_id: 9, name: "Odense St.", lat: 55.4012, lng: 10.3873, sort_order: 12, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p48g", day_id: 9, name: "Ringsted St.", lat: 55.4425, lng: 11.7901, sort_order: 13, segment_type: "rail", popup: "열차 경유", url: "",
    },
    {
      id: "p49", day_id: 9, name: "København H", lat: 55.6727, lng: 12.5646, sort_order: 14, segment_type: "rail", popup: "20:36 도착 후보", url: "",
    },
    {
      id: "p49a", day_id: 9, name: "Ørestad St.", lat: 55.6280, lng: 12.5790, sort_order: 15, segment_type: "subway", popup: "호텔 환승", url: "",
    },
    {
      id: "p50", day_id: 9, name: "CABINN Metro", lat: 55.6307, lng: 12.5778, sort_order: 16, segment_type: "walk", popup: "체크인·숙박", url: "https://en.cabinn.com/hotel/cabinn-metro",
    },
'''
s=s[:mstart]+new_points+s[mend:]
p.write_text(s,encoding='utf-8')

# map-routing.mjs day9 canonical event routes
p=Path('map-routing.mjs')
s=p.read_text(encoding='utf-8')
start=s.index('  "d9-01":')
end=s.index('  "d10c-01":', start)
new='''  "d9-01": {kind:"place",query:"CABINN Plus Esbjerg, Torvegade 27, 6700 Esbjerg"},
  "d9-02": {kind:"route",origin:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",destination:"Blue Water Shipping, Trafikhavnskaj 9, 6700 Esbjerg",mode:"driving"},
  "d9-03": {kind:"place",query:"Blue Water Shipping, Trafikhavnskaj 9, 6700 Esbjerg"},
  "d9-04": {kind:"route",origin:"Blue Water Shipping, Trafikhavnskaj 9, 6700 Esbjerg",waypoints:"Kolding|Vejle|Horsens",destination:"OWC Denmark, Banegårdspladsen 4, 8000 Aarhus C",mode:"driving"},
  "d9-05": {kind:"place",query:"Banegårdspladsen 4, 8000 Aarhus C"},
  "d9-055": {kind:"place",query:"OWC Denmark, Banegårdspladsen 4, 8000 Aarhus C"},
  "d9-06": {kind:"route",origin:"OWC Denmark, Banegårdspladsen 4, 8000 Aarhus C",destination:"Aarhus H",mode:"walking"},
  "d9-07": {kind:"route",origin:"Aarhus H",waypoints:"Skanderborg Station|Horsens Station|Vejle Station|Fredericia Station|Odense Station|Ringsted Station",destination:"København H, Copenhagen",mode:"transit"},
  "d9-08": {kind:"route",origin:"København H, Copenhagen",waypoints:"Ørestad Station, Copenhagen",destination:"CABINN Metro, Arne Jacobsens Allé 2, Copenhagen",mode:"transit"},

'''
s=s[:start]+new+s[end:]
p.write_text(s,encoding='utf-8')

# report-memo: include named counterpart/contact when present
p=Path('report-memo.js')
s=p.read_text(encoding='utf-8')
old='''    const status = clean(meeting?.status || event?.meeting_status || "일정 협의 중");
    return [
      head,
      `○ 방문·일정: ${org} 방문 및 ${title}`,
      `○ 주요 확인사항: ${agenda}`,
      `○ 추진상태: ${status}`,
'''
new='''    const status = clean(meeting?.status || event?.meeting_status || "일정 협의 중");
    const counterpart = clean(meeting?.contact || (event?.attendees || []).join(" / "));
    return [
      head,
      `○ 방문·일정: ${org} 방문 및 ${title}`,
      counterpart ? `○ 현지 참석자: ${counterpart}` : "",
      `○ 주요 확인사항: ${agenda}`,
      `○ 추진상태: ${status}`,
'''
s=replace_once(s,old,new,'report contact')
s=replace_once(s,'''].join("\\n");\n  }\n\n  if (isTransport(event)) {''','''].filter(Boolean).join("\\n");\n  }\n\n  if (isTransport(event)) {''','report filter')
p.write_text(s,encoding='utf-8')

# app.js meetings contact field, summary copy, detailed base map scale/tooltips
p=Path('app.js')
s=p.read_text(encoding='utf-8')
s=replace_once(s,'["meetings","회의·방문기관"]','["meetings","회의·방문기관"]','noop') if False else s
old='''  meetings:{title:"회의·방문기관",fields:["day_id","organization","agenda","recommended_duration","status","photo_allowed","ppe_required","interpreter_needed","url","notes"],labels:{day_id:"Day",organization:"기관",agenda:"의제",recommended_duration:"권장시간",status:"상태",photo_allowed:"사진",ppe_required:"PPE",interpreter_needed:"통역",url:"링크",notes:"메모"}},'''
new='''  meetings:{title:"회의·방문기관",fields:["day_id","organization","agenda","recommended_duration","contact","status","photo_allowed","ppe_required","interpreter_needed","url","notes"],labels:{day_id:"Day",organization:"기관",agenda:"의제",recommended_duration:"권장시간",contact:"현지 참석자",status:"상태",photo_allowed:"사진",ppe_required:"PPE",interpreter_needed:"통역",url:"링크",notes:"메모"}},'''
s=replace_once(s,old,new,'meeting table contact')
s=s.replace('에스비에르→코펜하겐을 철도로 연결합니다.','에스비에르→Aarhus는 확정 미팅을 위해 전용차량으로 이동하고, Aarhus→코펜하겐은 철도로 연결합니다.')
s=replace_once(s,'state.map=L.map("map",{scrollWheelZoom:true});\n  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(state.map);','state.map=L.map("map",{scrollWheelZoom:true,zoomControl:true});\n  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(state.map);\n  L.control.scale({metric:true,imperial:false}).addTo(state.map);','map scale')
s=replace_once(s,'L.marker(ll).bindPopup(`<b>Day ${p.day_id} · ${esc(p.name)}</b><br>${esc(p.popup||"")}${p.url?`<br><a href="${esc(p.url)}" target="_blank">링크</a>`:""}`).addTo(state.map);','L.marker(ll).bindPopup(`<b>Day ${p.day_id} · ${esc(p.name)}</b><br>${esc(p.popup||"")}${p.url?`<br><a href="${esc(p.url)}" target="_blank">링크</a>`:""}`).bindTooltip(`${esc(p.name)} · ${esc(p.popup||"")}`,{sticky:true}).addTo(state.map);','map tooltip')
p.write_text(s,encoding='utf-8')

# stable-tools detailed route chain in sidebar
p=Path('stable-tools.js')
s=p.read_text(encoding='utf-8')
anchor='''function scheduleLegsHtml(event,compact=false){const legs=event?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||event.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}'''
insert=anchor+'''\nfunction routeDetailHtml(event,view){if(view?.kind!=="route")return"";const explicit=(event?.route_detail||[]).filter(Boolean);const via=String(view.waypoints||"").split("|").filter(Boolean);const steps=explicit.length?explicit:[view.origin,...via,view.destination].filter(Boolean);if(steps.length<2)return"";return `<span class="map-route-detail"><small>상세 경로</small>${steps.map((x,i)=>`<i>${esc(x)}${i<steps.length-1?" →":""}</i>`).join("")}</span>`;}'''
s=replace_once(s,anchor,insert,'route detail helper')
old='''<span class="map-sidebar-body"><b>${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small>${scheduleLegsHtml(event,true)}</span>'''
new='''<span class="map-sidebar-body"><b>${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small>${routeDetailHtml(event,view)}${scheduleLegsHtml(event,true)}</span>'''
s=replace_once(s,old,new,'sidebar detail')
p.write_text(s,encoding='utf-8')

# map sidebar CSS
p=Path('map-sidebar.css')
s=p.read_text(encoding='utf-8')
s+='''\n/* Detailed multi-stop route chain */\n.map-route-detail{display:flex;flex-wrap:wrap;gap:4px 6px;margin-top:6px;align-items:center}\n.map-route-detail>small{width:100%;font-weight:800;opacity:.72}\n.map-route-detail>i{font-style:normal;font-size:11px;line-height:1.35;padding:2px 6px;border-radius:999px;background:rgba(30,92,125,.08);border:1px solid rgba(30,92,125,.12)}\n@media(max-width:720px){.map-route-detail>i{font-size:10px}.map-route-detail{gap:3px 4px}}\n'''
p.write_text(s,encoding='utf-8')

print('OWC Aarhus + detailed map patch applied')
