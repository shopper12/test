from pathlib import Path

# stable-tools.js: current cloud/local event location is authoritative when edited or ID is non-canonical.
p=Path('stable-tools.js')
s=p.read_text(encoding='utf-8')
s=s.replace('mappingLabel, parseMapUrl }', 'mappingLabel, parseMapUrl, routeFromText, placeForEvent }', 1)
old='function viewFor(event){const explicit=parseMapUrl(event?.map_url);return explicit?{...explicit,source:"live_event_map_url",verified:true}:eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));}'
new='''function viewFor(event){
  const explicit=parseMapUrl(event?.map_url);if(explicit)return{...explicit,source:"live_event_map_url",verified:true};
  const base=(activePlan().officialSeed.events||[]).find(x=>String(x.id)===String(event?.id));
  const changed=!base||String(base.location||"")!==String(event?.location||"")||String(base.title||"")!==String(event?.title||"")||String(base.transport||"")!==String(event?.transport||"");
  if(changed){const route=routeFromText(event);if(route)return{...route,source:"live_event_text",verified:true};const query=placeForEvent(event);if(query)return{kind:"place",query,source:"live_event_place",verified:true};}
  return eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));
}'''
if old not in s: raise SystemExit('stable viewFor not found')
s=s.replace(old,new,1)
old='''function mapSidebarHtml(){
  const events=eventsForMap(),all=allEventsSorted(),audit=auditEventMappings(events),valid=audit.filter(r=>r.mapped&&!r.ambiguous&&r.verified).length,id=selectedDayId();
  const routes=events.filter(e=>viewFor(e).kind==="route"),places=events.filter(e=>viewFor(e).kind==="place");
  const routeAudit=auditFullRouteContinuity(id==null?all:events),connected=routeAudit.filter(r=>r.connected&&r.verified).length,cov=manifestCoverage(events);
  const dayIds=[...new Set(events.map(e=>Number(e.day_id)))];
  return `<div class="map-schedule-sidebar-head"><div><b>${id==null?"전체 지도 일정 · 시간순":`Day ${id} 지도 일정 · 시간순`}</b><small>${events.length}개 · 이동 경로 ${routes.length} · 장소·체류 ${places.length} · 검증 매핑 ${valid}/${events.length}</small></div><span class="map-audit-ok">${valid===events.length&&connected===routeAudit.length&&cov.covered===cov.total?"전체 검증 완료":"경로 점검 필요"}</span></div>${dayIds.map(dayId=>mapDayGroup(dayId,events.filter(e=>Number(e.day_id)===dayId))).join("")}`;
}'''
new='''function mapSidebarHtml(){
  const events=eventsForMap(),all=allEventsSorted(),id=selectedDayId(),canonicalIds=new Set((activePlan().officialSeed.events||[]).map(e=>String(e.id))),canonical=events.every(e=>canonicalIds.has(String(e.id)));
  const views=events.map(e=>viewFor(e)),valid=views.filter(v=>v&&(v.kind==="place"?Boolean(v.query):Boolean(v.origin&&v.destination))).length;
  const routes=views.filter(v=>v.kind==="route"),places=views.filter(v=>v.kind==="place");
  const routeAudit=canonical?auditFullRouteContinuity(id==null?all:events):[],connected=routeAudit.filter(r=>r.connected&&r.verified).length,cov=canonical?manifestCoverage(events):{covered:events.length,total:events.length};
  const dayIds=[...new Set(events.map(e=>Number(e.day_id)))],ok=valid===events.length&&(!canonical||(connected===routeAudit.length&&cov.covered===cov.total));
  return `<div class="map-schedule-sidebar-head"><div><b>${id==null?"전체 지도 일정 · 시간순":`Day ${id} 지도 일정 · 시간순`}</b><small>${events.length}개 · 이동 경로 ${routes.length} · 장소·체류 ${places.length} · ${canonical?"검증 매핑":"실시간 연동"} ${valid}/${events.length}</small></div><span class="map-audit-ok">${ok?(canonical?"전체 검증 완료":"현재 일정·지도 연동"):"경로 점검 필요"}</span></div>${dayIds.map(dayId=>mapDayGroup(dayId,events.filter(e=>Number(e.day_id)===dayId))).join("")}`;
}'''
if old not in s: raise SystemExit('mapSidebarHtml block not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

# timeline runtime: fix stale fixed breakdown after new OWC origin.
p=Path('timeline-runtime-v17.js')
s=p.read_text(encoding='utf-8')
s=s.replace('"d7-07":[[0,15,"도보 · HafenCity → Elbphilharmonie"', '"d7-07":[[0,15,"도보 · OWC Alter Wall 69 → Elbphilharmonie"', 1)
p.write_text(s,encoding='utf-8')

# itinerary-data: remove stale hard-coded price deltas from dynamic fare comparison and mark TK20 time reconfirmation.
p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')
s=s.replace('notes:"비용안보다 약 102만원(4인) 비싸지만 인천 도착은 약 1시간 빠름."', 'notes:"9/12 08:35 ICN 도착 비교안. TK20 출발시각은 날짜별 판매화면과 계절운항표에 10분 차이가 있어 발권 직전 재확인."', 1)
s=s.replace('alternative: "SAS 직항은 약 1,291만원(4인) 추가"', 'alternative: "SAS 직항 및 다른 1회 경유편은 최신 자동운임으로 비교"', 1)
s=s.replace('alternative: "Air France CDG 경유는 4인 약 102만원 저렴"', 'alternative: "Air France CDG 경유 비용안과 최신 자동운임 비교"', 1)
s=s.replace('status: "IST 1회 환승·도착시간 우선"', 'status: "IST 1회 환승·TK20 시각 재확인"', 1)
s=s.replace('notes: "비용안보다 약 1시간 빠르게 인천 도착."', 'notes: "TK1784 + TK20 · 9/11 CPH 출발 · 9/12 08:35 ICN 도착. TK20 출발시각은 발권 직전 재확인."', 1)
s=s.replace('"공식 공개 시작가 약 US$109/실·박. Skyborn·Speicherstadt 도보권."', '"공식 공개 시작가 약 US$109/실·박. DNV·Skyborn·OWC Hamburg를 하루에 연결하기 좋은 도심권."', 1)
p.write_text(s,encoding='utf-8')
print('final live route linkage applied')