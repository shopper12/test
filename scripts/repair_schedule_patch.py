from pathlib import Path

p = Path('scripts/apply_schedule_precision.py')
s = p.read_text(encoding='utf-8')
start = s.index('# --- stable-tools.js:')
end = s.index('# --- timeline-runtime-v17.js:')
section = r'''# --- stable-tools.js: show precise legs in chronological map sidebar ---
replace_once('stable-tools.js', '''function mapSidebarItem(event){
  const view=viewFor(event),active=String(state.selectedEvent)===String(event.id);
  return `<button type="button" class="map-schedule-sidebar-item ${active?"active":""} ${view.kind}" data-stable-map-event="${esc(event.id)}" data-map-kind="${esc(view.kind)}"><span class="map-sidebar-time">${esc(event.time_start||"")}${event.time_end?`<small>~ ${esc(event.time_end)}</small>`:""}</span><span class="map-sidebar-body"><b>${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small></span><span class="map-sidebar-kind ${view.kind}">${view.kind==="route"?"이동 경로":"장소·체류"}</span></button>`;
}''', '''function scheduleStatusLabel(status){return status==="confirmed"?"확정":status==="provisional"?"재확인":status==="flexible"?"현장 선택":"시간표";}
function scheduleLegsHtml(event,compact=false){const legs=event?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||event.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}
function mapSidebarItem(event){
  const view=viewFor(event),active=String(state.selectedEvent)===String(event.id);
  return `<button type="button" class="map-schedule-sidebar-item ${active?"active":""} ${view.kind}" data-stable-map-event="${esc(event.id)}" data-map-kind="${esc(view.kind)}"><span class="map-sidebar-time">${esc(event.time_start||"")}${event.time_end?`<small>~ ${esc(event.time_end)}</small>`:""}</span><span class="map-sidebar-body"><b>${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small>${scheduleLegsHtml(event,true)}</span><span class="map-sidebar-kind ${view.kind}">${view.kind==="route"?"이동 경로":"장소·체류"}</span></button>`;
}''')

'''
p.write_text(s[:start] + section + s[end:], encoding='utf-8')
print('schedule patch repaired for chronological sidebar')
