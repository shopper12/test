from pathlib import Path
import re


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f"missing {label}")
    return text.replace(old, new, 1)

# ---------------------------------------------------------------------------
# itinerary-data.js
# ---------------------------------------------------------------------------
p = Path("itinerary-data.js")
s = p.read_text(encoding="utf-8")

s = replace_once(s, 'lastVerified: "2026-07-31",', 'lastVerified: "2026-08-14",', 'lastVerified')
s = re.sub(r'businessLocationRule:\s*"[^"]+",', 'businessLocationRule: "첨부 계획서 업무장소 + 추가 요청 DNV Hamburg·Skyborn Hamburg·OWC Germany/Denmark 기술미팅",', s, count=1)
s = replace_once(
    s,
    '"Skyborn Renewables 회의 · OWC Germany 기술미팅 · HafenCity·Elbphilharmonie",',
    '"DNV Hamburg 오전 미팅 · Skyborn Renewables 오후 미팅 · OWC Germany 기술미팅 · HafenCity",',
    'day7 summary',
)
s = replace_once(
    s,
    '"10:10 CPH 출발 · Air France 파리 1회 환승 · 4인 자동운임 약 500만원으로 SAS 직항보다 약 1,291만원 절감"',
    '"10:10 CPH 출발 · AF1751→AF264 파리 1회 환승 · 9/12 09:35 인천 도착 · 운임 자동조회"',
    'day10 cost summary',
)
s = replace_once(
    s,
    '"10:25 CPH 출발 · Turkish 이스탄불 1회 환승 · 비용안보다 약 1시간 빠른 08:35 인천 도착"',
    '"10:25 CPH 출발 · TK1784→TK20 이스탄불 1회 환승 · 9/12 08:35 인천 도착 · TK20 출발시각 발권 전 재확인"',
    'day10 time summary',
)

start = s.index('    e(\n      "d7-01",')
end = s.index('    e(\n      "d8-01",', start)
new_day7 = '''    e(
      "d7-01",
      7,
      "08:00",
      "09:00",
      "조식·DNV·Skyborn·OWC 미팅 준비",
      "업무준비",
      "Motel One Hamburg-Fleetinsel",
      "도보",
      "60분",
      {
        notes: "함부르크 3개 기관을 같은 날 도심권에서 연속 방문하도록 자료·질의사항 최종 점검.",
      },
    ),
    e(
      "d7-02",
      7,
      "09:00",
      "09:20",
      "호텔 → DNV Hamburg 이동",
      "교통",
      "Motel One Hamburg-Fleetinsel → DNV, Brooktorkai 18, Hamburg",
      "도보/택시",
      "20분",
      {
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Motel+One+Hamburg+Fleetinsel&destination=DNV+Brooktorkai+18+Hamburg",
        notes: "DNV·Skyborn·OWC가 모두 Hamburg 20457 도심권에 있어 9/8 하루 연속 방문 동선으로 구성.",
      },
    ),
    e(
      "d7-03",
      7,
      "09:30",
      "11:00",
      "DNV Hamburg 해상풍력 기술미팅 (요청 중)",
      "업무",
      "DNV Hamburg Office, Brooktorkai 18, 20457 Hamburg",
      "도보",
      "90분",
      {
        official_url: "https://www.dnv.com/contact/digital-solutions/",
        map_url: "https://www.google.com/maps/search/?api=1&query=DNV+Brooktorkai+18+20457+Hamburg",
        meeting_status: "DNV 현지 관계자 회신·시간 확정 대기",
        notes: "9/8 또는 9/9 오전 요청 중. Digital Twin의 설계·건설·운영 적용, 운영데이터 연계·상태모니터링·O&M 최적화, 프로젝트 인증·기술검증, 기술리스크 대응 경험을 중점 청취.",
      },
    ),
    e(
      "d7-04",
      7,
      "11:00",
      "12:50",
      "HafenCity 점심·DNV → Skyborn 이동",
      "식사·교통",
      "DNV Brooktorkai 18 → HafenCity → Skyborn Ericusspitze 2-4",
      "도보/택시",
      "1시간 50분",
      {
        map_url: "https://www.google.com/maps/dir/?api=1&origin=DNV+Brooktorkai+18+Hamburg&destination=Skyborn+Renewables+Ericusspitze+2-4+Hamburg",
        notes: "DNV 종료 후 HafenCity 권역에서 점심 후 Skyborn으로 이동. 기관 간 이동 버퍼 포함.",
      },
    ),
    e(
      "d7-05",
      7,
      "13:00",
      "14:30",
      "Skyborn Renewables 해상풍력 사업개발 미팅 (요청 중)",
      "업무",
      "Skyborn Renewables GmbH, Ericusspitze 2-4, 20457 Hamburg",
      "도보",
      "90분",
      {
        official_url: "https://www.skybornrenewables.com/contact",
        map_url: "https://www.google.com/maps/search/?api=1&query=Skyborn+Renewables+Ericusspitze+2-4+Hamburg",
        meeting_status: "Skyborn Hamburg 회신·시간 확정 대기",
        notes: "9/8 오후 또는 9/9 오전 요청 중. 유럽 해상풍력 사업개발 경험, 주요 추진사례, 개발·추진과정 주요 이슈와 대응 경험, 국내 사업 적용 시사점을 중심으로 논의.",
      },
    ),
    e(
      "d7-055",
      7,
      "14:30",
      "14:50",
      "Skyborn Renewables → OWC Hamburg 이동",
      "교통",
      "Ericusspitze 2-4 → Alter Wall 69, Hamburg",
      "도보/택시",
      "20분",
      {
        sort_order: 55,
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Skyborn+Renewables+Ericusspitze+2-4+Hamburg&destination=OWC+Alter+Wall+69+Hamburg",
        notes: "Skyborn 미팅 종료 후 OWC Germany 미팅 장소로 이동. 같은 Hamburg 20457 권역.",
      },
    ),
    e(
      "d7-06",
      7,
      "15:00",
      "16:30",
      "OWC Germany 해상풍력 기술미팅 (요청 중)",
      "업무",
      "OWC Hamburg, Alter Wall 69, 20457 Hamburg",
      "도보",
      "90분",
      {
        official_url: "https://owcltd.com/offices/hamburg/",
        map_url: "https://www.google.com/maps/search/?api=1&query=OWC+Alter+Wall+69+20457+Hamburg",
        meeting_status: "OWC Germany 회신·참석자 확인 대기",
        notes: "9/8 또는 9/9 오후 요청 중. 독일 프로젝트 중심 Owner’s Engineering·Technical Advisory, 초기 Technical Risk, WTG·Foundation·Cable·Offshore Substation 기술검토, 설계 최적화·LCoE 절감 사례를 중점 청취.",
      },
    ),
    e(
      "d7-07",
      7,
      "16:30",
      "20:30",
      "OWC 미팅 정리·Elbphilharmonie·Landungsbrücken·저녁",
      "업무정리·관광·식사",
      "OWC Hamburg → Elbphilharmonie → Landungsbrücken",
      "도보+U-Bahn",
      "4시간",
      {
        booking_url: "https://www.elbphilharmonie.de/en/plaza-tickets",
        map_url: "https://www.google.com/maps/dir/?api=1&origin=OWC+Alter+Wall+69+Hamburg&destination=Landungsbrucken&waypoints=Elbphilharmonie",
        notes: "3개 기관 미팅 핵심내용을 우선 메모한 뒤 저녁 일정 진행.",
      },
    ),
'''
s = s[:start] + new_day7 + s[end:]

# Meeting table: insert DNV, deepen Skyborn, add OWC Germany/Denmark while retaining existing IDs where possible.
old_m6 = '''  {
    id: "m6",
    day_id: 7,
    organization: "Skyborn Renewables",
    agenda: "독일 해상풍력 사업개발·인허가·수익성 사례",
    recommended_duration: "2시간",
    contact: "",
    status: "일정협의 필요",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://www.skybornrenewables.com/contact",
    notes: "Ericusspitze 2-4, Hamburg",
    sort_order: 60,
  },'''
new_m6 = '''  {
    id: "m8",
    day_id: 7,
    organization: "DNV Hamburg",
    agenda: "유럽 해상풍력 기술동향·Digital Twin의 설계/건설/운영 적용·운영데이터/상태모니터링/O&M 최적화·프로젝트 인증 및 기술검증·기술리스크 대응",
    recommended_duration: "90분",
    contact: "",
    status: "요청 중",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://www.dnv.com/contact/digital-solutions/",
    notes: "Brooktorkai 18, 20457 Hamburg · 희망 9/8 또는 9/9 오전",
    sort_order: 55,
  },
  {
    id: "m6",
    day_id: 7,
    organization: "Skyborn Renewables Hamburg",
    agenda: "유럽 해상풍력 사업개발 선진사례·주요 추진사례·개발 및 추진과정 주요 이슈와 대응 경험·국내 사업 적용 시사점",
    recommended_duration: "90분",
    contact: "",
    status: "요청 중",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://www.skybornrenewables.com/contact",
    notes: "Ericusspitze 2-4, 20457 Hamburg · 희망 9/8 오후 또는 9/9 오전",
    sort_order: 60,
  },
  {
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
s = replace_once(s, old_m6, new_m6, 'meeting m6')

old_m7 = '''  {
    id: "m7",
    day_id: 9,
    organization: "Blue Water Shipping · Esbjerg",
    agenda: "해상풍력 터빈 공급망·운송·보관·통관",
    recommended_duration: "2시간",
    contact: "",
    status: "일정협의 필요",
    photo_allowed: false,
    ppe_required: false,
    interpreter_needed: false,
    url: "https://www.bws.net/contact/denmark/esbjerg",
    notes: "Trafikhavnskaj 9, 6700 Esbjerg",
    sort_order: 70,
  },'''
new_m7 = old_m7 + '''
  {
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
s = replace_once(s, old_m7, new_m7, 'meeting m7')

# Exact boundary-flight wording; keep price itself live rather than hard-coded.
s = replace_once(s, 'notes: "계획서 원안과 동일. Google Flights 4인 최저가 자동조회.",', 'notes: "출국일 2026-09-02 고정. LJ737 ICN 07:55→RMQ 09:40 현재 판매편 기준이며 운임은 Google Flights 4인 자동조회.",', 'LJ737 notes')
s = replace_once(s, 'status: "직항·자동가격",', 'status: "출국일 고정·현재 판매편",', 'f1 status')
s = replace_once(s, 'notes: "계획서 원안 유지",', 'notes: "2026-09-02 출국일 고정 · LJ737 07:55 ICN → 09:40 RMQ",', 'f1 notes')

s = replace_once(s, 'notes:"현재 4인 Google Flights 자동운임 기준 귀국 최저가 경로.",', 'notes:"귀국일정 경계 고정: 2026-09-11 CPH 출발 → 2026-09-12 ICN 입국. 운임은 Google Flights 자동조회.",', 'AF1751 notes')
s = replace_once(s, 'notes:"CPH→CDG→ICN 연결발권. 4인 약 500만원으로 SAS 직항 약 1,790만원 대비 약 1,291만원 절감.",', 'notes:"CPH→CDG→ICN 연결발권. 2026-09-12 09:35 ICN 입국일 고정이며 가격 비교는 최신 자동조회값을 사용.",', 'AF264 notes')
s = replace_once(s, 'status: "CDG 1회 환승·최저가",', 'status: "귀국일 고정·CDG 1회 환승",', 'cost f3 status')
s = replace_once(s, 'notes: "4인 자동운임 약 500만원. SAS 직항 약 1,790만원 대비 약 72% 저렴.",', 'notes: "AF1751 + AF264 · 9/11 10:10 CPH 출발 · 9/12 09:35 ICN 도착. 운임은 자동조회값 사용.",', 'cost f3 notes')

# Correct Turkish flight number. Keep date-specific Google sale time but explicitly flag the 10-minute timetable discrepancy.
s = s.replace('"TK1784 + TK90"', '"TK1784 + TK20"')
s = s.replace('service:"Turkish Airlines TK90",from:"IST",depart:"17:00",to:"ICN",arrive:"9/12 08:35",source_label:"Google Flights 현재 판매편"', 'service:"Turkish Airlines TK20",from:"IST",depart:"17:00 판매화면 / 정규표 16:50",to:"ICN",arrive:"9/12 08:35",source_label:"Google Flights 날짜별 판매편 + TK20 계절운항표 · 발권 전 최종 재확인"')
s = s.replace('status: "IST 1회 환승·시간우선",', 'status: "IST 1회 환승·TK20 시각 재확인",')

p.write_text(s, encoding="utf-8")

# ---------------------------------------------------------------------------
# map-routing.mjs: new Hamburg chronological route manifest
# ---------------------------------------------------------------------------
p = Path("map-routing.mjs")
s = p.read_text(encoding="utf-8")
start = s.index('  "d7-01":')
end = s.index('  "d8-01":', start)
new_map7 = '''  "d7-01": {kind:"place",query:"Motel One Hamburg-Fleetinsel"},
  "d7-02": {kind:"route",origin:"Motel One Hamburg-Fleetinsel",destination:"DNV, Brooktorkai 18, 20457 Hamburg",mode:"walking"},
  "d7-03": {kind:"place",query:"DNV, Brooktorkai 18, 20457 Hamburg"},
  "d7-04": {kind:"route",origin:"DNV, Brooktorkai 18, 20457 Hamburg",destination:"Skyborn Renewables, Ericusspitze 2-4, Hamburg",mode:"walking"},
  "d7-05": {kind:"place",query:"Skyborn Renewables, Ericusspitze 2-4, Hamburg"},
  "d7-055": {kind:"route",origin:"Skyborn Renewables, Ericusspitze 2-4, Hamburg",destination:"OWC, Alter Wall 69, 20457 Hamburg",mode:"walking"},
  "d7-06": {kind:"place",query:"OWC, Alter Wall 69, 20457 Hamburg"},
  "d7-07": {kind:"route",origin:"OWC, Alter Wall 69, 20457 Hamburg",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},

'''
s = s[:start] + new_map7 + s[end:]
p.write_text(s, encoding="utf-8")

# ---------------------------------------------------------------------------
# app.js: expose the existing live state to map/runtime, emit change events,
# correct fare mapping for the time-optimized itinerary, remove stale verify list.
# ---------------------------------------------------------------------------
p = Path("app.js")
s = p.read_text(encoding="utf-8")
needle = '''const state = {
  itineraryKey: DEFAULT_ITINERARY,
  tab: "timeline",
  activeDay: 1,
  user: null,
  mode: "local",
  data: { ...clone(officialSeed), team_notes: [] },
  map: null,
  subscriptions: [],
  editing: null,
  livePrices: null,
  livePriceError: null,
};'''
insert = needle + '''

// Single live data source for the timeline decorators and verified map sidebar.
// This reuses the existing Supabase/local state instead of maintaining a second copy.
window.__tripDashboardLiveData = () => state.data;
window.__tripDashboardPlanKey = () => state.itineraryKey;'''
s = replace_once(s, needle, insert, 'app state exposure')

s = replace_once(
    s,
    '''    time_optimized:{
      "ICN-RMQ":"route_f1",
      "TPE-AMS":"route_f2_direct",
      "CPH-ICN":"route_f3",
    },''',
    '''    time_optimized:{
      "ICN-RMQ":"route_f1",
      "TPE-AMS":"route_f2_direct",
      "CPH-ICN":"compare_cph_time",
    },''',
    'time fare mapping',
)

old_render_content = '''  main.innerHTML=handlers[state.tab]();
  bindDynamicEvents();
  if(state.tab==="map") setTimeout(drawMap,0);
}'''
new_render_content = '''  main.innerHTML=handlers[state.tab]();
  bindDynamicEvents();
  if(state.tab==="map") setTimeout(drawMap,0);
  queueMicrotask(()=>window.dispatchEvent(new CustomEvent("trip-data-changed",{detail:{itineraryKey:state.itineraryKey,activeDay:state.activeDay}})));
}'''
s = replace_once(s, old_render_content, new_render_content, 'renderContent change event')

s = replace_once(
    s,
    '["업무장소","TIPC·VESTAS·Port of Rotterdam·ROG·TNO·Skyborn·Blue Water Shipping","계획서 일치"],',
    '["업무장소",meetings.map(m=>m.organization).join(" · "),"계획서 + 추가 요청 반영"],',
    'verify organization list',
)
s = replace_once(
    s,
    '["Skyborn Hamburg","https://www.skybornrenewables.com/contact"],',
    '["DNV Hamburg","https://www.dnv.com/contact/digital-solutions/"],\n    ["Skyborn Hamburg","https://www.skybornrenewables.com/contact"],\n    ["OWC Hamburg","https://owcltd.com/offices/hamburg/"],\n    ["OWC Denmark","https://owcltd.com/offices/aarhus-2/"],',
    'verify source links',
)
p.write_text(s, encoding="utf-8")

# ---------------------------------------------------------------------------
# stable-tools.js: use the same live state and re-render map on any schedule edit.
# ---------------------------------------------------------------------------
p = Path("stable-tools.js")
s = p.read_text(encoding="utf-8")
s = replace_once(
    s,
    'auditEventMappings, auditFullRouteContinuity, eventMapView, flightRoutePoints, googleMapsEmbedUrl, manifestCoverage, mappingLabel',
    'auditEventMappings, auditFullRouteContinuity, eventMapView, flightRoutePoints, googleMapsEmbedUrl, manifestCoverage, mappingLabel, parseMapUrl',
    'stable import parseMapUrl',
)
s = replace_once(s, 'const state={weather:null,loadedAt:0,selectedEvent:null,flightMap:null};', 'const state={weather:null,loadedAt:0,selectedEvent:null,flightMap:null,dataRevision:0};', 'stable data revision')
s = replace_once(
    s,
    'function activePlan(){return ITINERARIES[activePlanKey()]||ITINERARIES[DEFAULT_ITINERARY];}',
    'function activePlan(){return ITINERARIES[activePlanKey()]||ITINERARIES[DEFAULT_ITINERARY];}\nfunction liveSeed(){const x=window.__tripDashboardLiveData?.();return x?.events&&x?.days?x:activePlan().officialSeed;}',
    'stable liveSeed',
)
s = replace_once(s, 'function activeDay(){const p=activePlan(),id=selectedDayId()??1;return p.officialSeed.days.find(d=>Number(d.id)===id)||p.officialSeed.days[0];}', 'function activeDay(){const seed=liveSeed(),id=selectedDayId()??1;return seed.days.find(d=>Number(d.id)===id)||seed.days[0];}', 'stable activeDay')
s = replace_once(s, 'function dayForEvent(event){return activePlan().officialSeed.days.find(d=>Number(d.id)===Number(event?.day_id))||{};}', 'function dayForEvent(event){return liveSeed().days.find(d=>Number(d.id)===Number(event?.day_id))||{};}', 'stable dayForEvent')
s = replace_once(s, 'function allEventsSorted(){return (activePlan().officialSeed.events||[]).slice()', 'function allEventsSorted(){return (liveSeed().events||[]).slice()', 'stable all events')
s = replace_once(s, 'function eventById(id){return (activePlan().officialSeed.events||[]).find(e=>String(e.id)===String(id));}', 'function eventById(id){return (liveSeed().events||[]).find(e=>String(e.id)===String(id));}', 'stable eventById')
s = replace_once(s, 'function viewFor(event){return eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));}', 'function viewFor(event){const explicit=parseMapUrl(event?.map_url);return explicit?{...explicit,source:"live_event_map_url",verified:true}:eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));}', 'stable live map url')
s = replace_once(s, 'const day=activePlan().officialSeed.days.find(d=>Number(d.id)===Number(dayId))||{};', 'const day=liveSeed().days.find(d=>Number(d.id)===Number(dayId))||{};', 'stable map day')
s = replace_once(s, 'const key=`${activePlanKey()}:${selectedDayId()??"all"}:${eventsForMap().length}:v17-time`;', 'const key=`${activePlanKey()}:${selectedDayId()??"all"}:${eventsForMap().length}:${state.dataRevision}:v17-live`;','stable sidebar key')
s = s.replace('auditEventMappings(activePlan().officialSeed.events||[])', 'auditEventMappings(liveSeed().events||[])')
s = s.replace('auditFullRouteContinuity(activePlan().officialSeed.events||[])', 'auditFullRouteContinuity(liveSeed().events||[])')
s = s.replace('manifestCoverage(activePlan().officialSeed.events||[])', 'manifestCoverage(liveSeed().events||[])')
# listen after scheduleMapSidebar is defined
marker = 'function scheduleMapSidebar(){[40,120,260,520,900].forEach(ms=>setTimeout(renderMapSidebar,ms));}'
listener = marker + '\nwindow.addEventListener("trip-data-changed",()=>{state.dataRevision+=1;state.selectedEvent=null;scheduleMapSidebar();setTimeout(render,0);});'
s = replace_once(s, marker, listener, 'stable live change listener')
p.write_text(s, encoding="utf-8")

# ---------------------------------------------------------------------------
# timeline-runtime-v17.js: use live state and add generated report memo + copy.
# ---------------------------------------------------------------------------
p = Path("timeline-runtime-v17.js")
s = p.read_text(encoding="utf-8")
s = replace_once(
    s,
    'import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";',
    'import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";\nimport { buildReportMemo } from "./report-memo.js?v=LIVE_TRAVEL_V17";',
    'runtime report import',
)
old = 'const plan=()=>{const k=document.querySelector(".itinerary-tab.active")?.dataset.itinerary;if(k&&ITINERARIES[k])s.plan=k;return ITINERARIES[s.plan]||ITINERARIES[DEFAULT_ITINERARY];};\nconst eventById=id=>(plan().officialSeed.events||[]).find(e=>String(e.id)===String(id));\nconst dayById=id=>(plan().officialSeed.days||[]).find(d=>Number(d.id)===Number(id));'
new = 'const plan=()=>{const k=document.querySelector(".itinerary-tab.active")?.dataset.itinerary;if(k&&ITINERARIES[k])s.plan=k;return ITINERARIES[s.plan]||ITINERARIES[DEFAULT_ITINERARY];};\nconst liveSeed=()=>{const x=window.__tripDashboardLiveData?.();return x?.events&&x?.days?x:plan().officialSeed;};\nconst eventById=id=>(liveSeed().events||[]).find(e=>String(e.id)===String(id));\nconst dayById=id=>(liveSeed().days||[]).find(d=>Number(d.id)===Number(id));'
s = replace_once(s, old, new, 'runtime live seed')
s = replace_once(s, 'function hotelMatches(e){const seed=plan().officialSeed,', 'function hotelMatches(e){const seed=liveSeed(),', 'runtime hotel live')
s = replace_once(s, 'const rows=(plan().officialSeed.restaurants||[])', 'const rows=(liveSeed().restaurants||[])', 'runtime restaurant live')
s = replace_once(s, 'function decorateTimeline(){const ev=plan().officialSeed.events||[];', 'function decorateTimeline(){const seed=liveSeed(),ev=seed.events||[];', 'runtime decorate live')

old_tail = 'const p=placeLinks(e);if(p)body.insertAdjacentHTML("beforeend",p);const t=transitBox(e);if(t)body.insertAdjacentHTML("beforeend",t);mapButton(body,e);});}'
new_tail = '''const p=placeLinks(e);if(p)body.insertAdjacentHTML("beforeend",p);const t=transitBox(e);if(t)body.insertAdjacentHTML("beforeend",t);body.querySelector(":scope > .report-copy-memo")?.remove();const memo=buildReportMemo(e,dayById(e.day_id),seed.meetings||[]);if(memo)body.insertAdjacentHTML("beforeend",`<div class="report-copy-memo"><div class="report-copy-head"><b>📄 보고서용 메모</b><button type="button" class="btn small" data-report-copy="${esc(e.id)}">복사</button></div><pre>${esc(memo)}</pre><small>일정·장소·교통·회의 데이터에서 자동 생성 · 일정 수정 시 함께 갱신</small></div>`);mapButton(body,e);});}'''
s = replace_once(s, old_tail, new_tail, 'runtime report memo decoration')

anchor = 'window.__openDashboardMapEvent=openMap;'
copy_handler = '''window.__openDashboardMapEvent=openMap;

document.addEventListener("click",async ev=>{const b=ev.target.closest?.("[data-report-copy]");if(!b)return;ev.preventDefault();const e=eventById(b.dataset.reportCopy);if(!e)return;const text=buildReportMemo(e,dayById(e.day_id),liveSeed().meetings||[]);try{await navigator.clipboard.writeText(text);b.textContent="복사됨";setTimeout(()=>b.textContent="복사",1200);}catch{const ta=document.createElement("textarea");ta.value=text;document.body.append(ta);ta.select();document.execCommand("copy");ta.remove();b.textContent="복사됨";setTimeout(()=>b.textContent="복사",1200);}});
window.addEventListener("trip-data-changed",()=>setTimeout(decorate,0));'''
s = replace_once(s, anchor, copy_handler, 'runtime copy handler')
p.write_text(s, encoding="utf-8")

# ---------------------------------------------------------------------------
# CSS: reuse existing timeline card, only style report memo sub-panel.
# ---------------------------------------------------------------------------
p = Path("live-transit-links.css")
s = p.read_text(encoding="utf-8")
css = '''

/* Dynamic report-ready memo generated from the same live itinerary data. */
.report-copy-memo{margin-top:10px;padding:11px 12px;border:1px solid var(--line,#d9dee7);border-radius:12px;background:color-mix(in srgb,var(--card,#fff) 92%,#eef4ff 8%)}
.report-copy-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
.report-copy-memo pre{margin:0;white-space:pre-wrap;word-break:keep-all;font:inherit;line-height:1.55;color:var(--text,#172033)}
.report-copy-memo>small{display:block;margin-top:7px;opacity:.68}
@media(max-width:640px){.report-copy-memo{padding:10px}.report-copy-memo pre{font-size:13px;word-break:break-word}}
'''
if '.report-copy-memo{' not in s:
    s += css
p.write_text(s, encoding="utf-8")

print("dynamic trip update applied")
