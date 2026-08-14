from pathlib import Path

p=Path('stable-tools.js')
s=p.read_text(encoding='utf-8')
old='''function viewFor(event){
  const explicit=parseMapUrl(event?.map_url);if(explicit)return{...explicit,source:"live_event_map_url",verified:true};
  const base=(activePlan().officialSeed.events||[]).find(x=>String(x.id)===String(event?.id));
  const changed=!base||String(base.location||"")!==String(event?.location||"")||String(base.title||"")!==String(event?.title||"")||String(base.transport||"")!==String(event?.transport||"");
  if(changed){const route=routeFromText(event);if(route)return{...route,source:"live_event_text",verified:true};const query=placeForEvent(event);if(query)return{kind:"place",query,source:"live_event_place",verified:true};}
  return eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));
}'''
new='''function viewFor(event){
  const explicit=parseMapUrl(event?.map_url);if(explicit)return{...explicit,source:"live_event_map_url",verified:true};
  const official=activePlan().officialSeed.events||[];
  const base=official.find(x=>String(x.id)===String(event?.id))||official.find(x=>Number(x.day_id)===Number(event?.day_id)&&String(x.title||"").trim()===String(event?.title||"").trim());
  const changed=!base||String(base.location||"")!==String(event?.location||"")||String(base.title||"")!==String(event?.title||"")||String(base.transport||"")!==String(event?.transport||"");
  if(changed){const route=routeFromText(event);if(route)return{...route,source:"live_event_text",verified:true};const query=placeForEvent(event);if(query)return{kind:"place",query,source:"live_event_place",verified:true};}
  if(base&&String(base.id)!==String(event?.id))return{...eventMapView([],base,dayForEvent(event)),source:"live_semantic_manifest",verified:true};
  return eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));
}'''
if old not in s: raise SystemExit('viewFor block not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

p=Path('report-memo.js')
s=p.read_text(encoding='utf-8')
old='''function meetingFor(event, meetings = []) {
  const hint = MEETING_HINTS[String(event?.id || "")];
  const hay = norm(`${event?.title || ""} ${event?.location || ""}`);
  const rows = (meetings || []).filter((m) => Number(m?.day_id) === Number(event?.day_id));
  if (hint) {
    const n = norm(hint);
    const hit = rows.find((m) => norm(`${m?.organization || ""} ${m?.agenda || ""}`).includes(n));
    if (hit) return hit;
  }
  return rows.find((m) => {
    const org = norm(m?.organization);
    return org && (hay.includes(org) || org.split(" ").some((token) => token.length >= 4 && hay.includes(token)));
  }) || null;
}'''
new='''function meetingFor(event, meetings = []) {
  const hint = MEETING_HINTS[String(event?.id || "")];
  const hay = norm(`${event?.title || ""} ${event?.location || ""}`);
  const all = meetings || [], sameDay = all.filter((m) => Number(m?.day_id) === Number(event?.day_id));
  const match = (rows) => rows.find((m) => {
    const org = norm(m?.organization);
    return org && (hay.includes(org) || org.split(" ").some((token) => token.length >= 4 && hay.includes(token)));
  });
  if (hint) {
    const n = norm(hint);
    const hit = sameDay.find((m) => norm(`${m?.organization || ""} ${m?.agenda || ""}`).includes(n)) || all.find((m) => norm(`${m?.organization || ""} ${m?.agenda || ""}`).includes(n));
    if (hit) return hit;
  }
  return match(sameDay) || match(all) || null;
}'''
if old not in s: raise SystemExit('meetingFor block not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('semantic live linkage finalized')