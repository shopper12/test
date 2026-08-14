import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";
import { longRangeWeather } from "./weather-fallback.js?v=LIVE_TRAVEL_V17";
import { auditEventMappings, auditFullRouteContinuity, eventMapView, flightRoutePoints, googleMapsEmbedUrl, manifestCoverage, mappingLabel, parseMapUrl, routeFromText, placeForEvent } from "./map-routing.mjs?v=LIVE_TRAVEL_V17";

const BUILD="LIVE_TRAVEL_V17";
const HOST_ID="stable-live-tools";
const state={weather:null,loadedAt:0,selectedEvent:null,flightMap:null,dataRevision:0};
const esc=v=>String(v??"").replace(/[&<>'\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]));

function host(){return document.getElementById(HOST_ID);}
function activePlanKey(){return document.querySelector(".itinerary-tab.active")?.dataset?.itinerary||DEFAULT_ITINERARY;}
function activePlan(){return ITINERARIES[activePlanKey()]||ITINERARIES[DEFAULT_ITINERARY];}
function liveSeed(){const x=window.__tripDashboardLiveData?.();return x?.events&&x?.days?x:activePlan().officialSeed;}
function activeTab(){return document.querySelector("#tabs [data-tab].active")?.dataset?.tab||"timeline";}
function selectedDayId(){const button=document.querySelector(".day-tab.active");return button?Number(button.dataset.day):null;}
function activeDay(){const seed=liveSeed(),id=selectedDayId()??1;return seed.days.find(d=>Number(d.id)===id)||seed.days[0];}
function dayForEvent(event){return liveSeed().days.find(d=>Number(d.id)===Number(event?.day_id))||{};}
function timeMinutes(value){const m=String(value||"").match(/(?:^|\s)(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):9999;}
function allEventsSorted(){return (liveSeed().events||[]).slice().sort((a,b)=>Number(a.day_id)-Number(b.day_id)||timeMinutes(a.time_start)-timeMinutes(b.time_start)||(a.sort_order||0)-(b.sort_order||0)||String(a.id).localeCompare(String(b.id)));}
function eventsForDay(dayId){return allEventsSorted().filter(e=>Number(e.day_id)===Number(dayId));}
function eventsForMap(){const id=selectedDayId();return id==null?allEventsSorted():eventsForDay(id);}
function eventById(id){return (liveSeed().events||[]).find(e=>String(e.id)===String(id));}
function viewFor(event){
  const explicit=parseMapUrl(event?.map_url);if(explicit)return{...explicit,source:"live_event_map_url",verified:true};
  const official=activePlan().officialSeed.events||[];
  const base=official.find(x=>String(x.id)===String(event?.id))||official.find(x=>Number(x.day_id)===Number(event?.day_id)&&String(x.title||"").trim()===String(event?.title||"").trim());
  const changed=!base||String(base.location||"")!==String(event?.location||"")||String(base.title||"")!==String(event?.title||"")||String(base.transport||"")!==String(event?.transport||"");
  if(changed){const route=routeFromText(event);if(route)return{...route,source:"live_event_text",verified:true};const query=placeForEvent(event);if(query)return{kind:"place",query,source:"live_event_place",verified:true};}
  if(base&&String(base.id)!==String(event?.id))return{...eventMapView([],base,dayForEvent(event)),source:"live_semantic_manifest",verified:true};
  return eventMapView(eventsForDay(event.day_id),event,dayForEvent(event));
}

async function loadWeather(force=false){
  if(!force&&state.weather&&Date.now()-state.loadedAt<300000)return;
  try{const r=await fetch(`./trip-live.json?v=${Date.now()}`,{cache:"no-store"});if(!r.ok)throw new Error(`HTTP ${r.status}`);const p=await r.json();state.weather=p.weather||{};state.loadedAt=Date.now();}
  catch(e){console.warn(`[${BUILD}] weather`,e);state.loadedAt=Date.now();}
}
function fallbackCard(text){const f=longRangeWeather(text);if(!f)return"";return `<article><b>${esc(f.label)} · 장기전망/평년</b><small>${esc(f.basis)}</small><p><strong>예상 기준 ${esc(f.highC)}℃ / ${esc(f.lowC)}℃</strong><br>정식 단기예보가 발표되면 자동으로 공식예보가 우선됩니다.</p><div class="stable-source-links"><a href="${esc(f.sourceUrl)}" target="_blank" rel="noopener noreferrer">월간 전망 원문 ↗</a>${f.officialUrl?`<a href="${esc(f.officialUrl)}" target="_blank" rel="noopener noreferrer">${esc(f.officialLabel)} ↗</a>`:""}</div></article>`;}
function weatherHtml(day){
  const bundle=state.weather?.[day.date],rows=bundle?.locations||[];
  if(!rows.length){const fallback=fallbackCard(day.cities);return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>공식 단기예보 전에는 월간전망 또는 9월 평년값을 표시합니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${fallback||"<article><b>장기 날씨 기준 준비 중</b></article>"}</div></section>`;}
  return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>공식 시간별 예보가 있으면 우선하고, 발표 전이면 월간전망/평년값을 사용합니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${rows.map(loc=>{const hourly=loc.kind==="official_hourly"?(loc.hourly||[]).slice(0,6):[];if(hourly.length)return `<article><b>${esc(loc.city||"")} · 공식예보</b><small>${esc(loc.authority||"")}</small><div class="stable-hourly">${hourly.map(r=>`<span><strong>${esc(r.time||"")}</strong>${r.temperature_c!=null?` ${esc(r.temperature_c)}℃`:""}${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;return fallbackCard(`${loc.city||""} ${(loc.aliases||[]).join(" ")}`)||`<article><b>${esc(loc.city||"")} · 예보 발표 전</b><small>${esc(loc.authority||"")}</small><p>${esc(loc.reason||"공식 예보 범위 밖입니다.")}</p>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;}).join("")}</div></section>`;
}

function scheduleStatusLabel(status){return status==="confirmed"?"확정":status==="provisional"?"재확인":status==="flexible"?"현장 선택":"시간표";}
function scheduleLegsHtml(event,compact=false){const legs=event?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||event.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}
function mapSidebarItem(event){
  const view=viewFor(event),active=String(state.selectedEvent)===String(event.id);
  return `<button type="button" class="map-schedule-sidebar-item ${active?"active":""} ${view.kind}" data-stable-map-event="${esc(event.id)}" data-map-kind="${esc(view.kind)}"><span class="map-sidebar-time">${esc(event.time_start||"")}${event.time_end?`<small>~ ${esc(event.time_end)}</small>`:""}</span><span class="map-sidebar-body"><b>${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small>${scheduleLegsHtml(event,true)}</span><span class="map-sidebar-kind ${view.kind}">${view.kind==="route"?"이동 경로":"장소·체류"}</span></button>`;
}
function mapDayGroup(dayId,items){
  const day=liveSeed().days.find(d=>Number(d.id)===Number(dayId))||{};
  return `<section class="map-sidebar-group day" data-map-day="${esc(dayId)}"><div class="map-sidebar-group-head"><div><b>Day ${esc(dayId)} · ${esc(day.date||"")}</b><small>${esc(day.cities||"")}</small></div><span>${items.length}개 · 시간순</span></div><div class="map-schedule-sidebar-list">${items.map(mapSidebarItem).join("")}</div></section>`;
}
function mapSidebarHtml(){
  const events=eventsForMap(),all=allEventsSorted(),id=selectedDayId(),canonicalIds=new Set((activePlan().officialSeed.events||[]).map(e=>String(e.id))),canonical=events.every(e=>canonicalIds.has(String(e.id)));
  const views=events.map(e=>viewFor(e)),valid=views.filter(v=>v&&(v.kind==="place"?Boolean(v.query):Boolean(v.origin&&v.destination))).length;
  const routes=views.filter(v=>v.kind==="route"),places=views.filter(v=>v.kind==="place");
  const routeAudit=canonical?auditFullRouteContinuity(id==null?all:events):[],connected=routeAudit.filter(r=>r.connected&&r.verified).length,cov=canonical?manifestCoverage(events):{covered:events.length,total:events.length};
  const dayIds=[...new Set(events.map(e=>Number(e.day_id)))],ok=valid===events.length&&(!canonical||(connected===routeAudit.length&&cov.covered===cov.total));
  return `<div class="map-schedule-sidebar-head"><div><b>${id==null?"전체 지도 일정 · 시간순":`Day ${id} 지도 일정 · 시간순`}</b><small>${events.length}개 · 이동 경로 ${routes.length} · 장소·체류 ${places.length} · ${canonical?"검증 매핑":"실시간 연동"} ${valid}/${events.length}</small></div><span class="map-audit-ok">${ok?(canonical?"전체 검증 완료":"현재 일정·지도 연동"):"경로 점검 필요"}</span></div>${dayIds.map(dayId=>mapDayGroup(dayId,events.filter(e=>Number(e.day_id)===dayId))).join("")}`;
}
function renderMapSidebar(){
  if(activeTab()!=="map")return false;const list=document.getElementById("route-list");if(!list)return false;
  const key=`${activePlanKey()}:${selectedDayId()??"all"}:${eventsForMap().length}:${state.dataRevision}:v17-live`;
  if(list.dataset.stableSidebarKey===key&&list.querySelector("[data-stable-map-event]"))return true;
  list.dataset.stableSidebarKey=key;list.classList.add("map-schedule-sidebar");list.innerHTML=mapSidebarHtml();return true;
}
function scheduleMapSidebar(){[40,120,260,520,900].forEach(ms=>setTimeout(renderMapSidebar,ms));}
window.addEventListener("trip-data-changed",()=>{state.dataRevision+=1;state.selectedEvent=null;scheduleMapSidebar();setTimeout(render,0);});

function destroyFlightMap(){if(state.flightMap){try{state.flightMap.remove();}catch{}state.flightMap=null;}}
function renderFlightRoute(shell,event,view){
  const pts=flightRoutePoints(view),host=shell.querySelector("[data-flight-map]");if(!host||pts.length!==2)return false;
  if(!window.L){host.innerHTML=`<div class="flight-route-fallback"><b>${esc(view.origin)}</b><span>✈</span><b>${esc(view.destination)}</b></div>`;return true;}
  destroyFlightMap();state.flightMap=L.map(host,{scrollWheelZoom:true,zoomControl:true});L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(state.flightMap);
  const ll=pts.map(p=>[p.lat,p.lng]);pts.forEach(p=>L.marker([p.lat,p.lng]).bindPopup(`<b>${esc(p.name)}</b>`).addTo(state.flightMap));L.polyline(ll,{weight:4,dashArray:"10 8",opacity:.9}).addTo(state.flightMap);state.flightMap.fitBounds(ll,{padding:[45,45]});setTimeout(()=>state.flightMap?.invalidateSize(),80);return true;
}
function focusMap(eventId){
  const event=eventById(eventId),map=document.getElementById("map");if(!event||!map)return false;
  const view=viewFor(event);state.selectedEvent=event.id;destroyFlightMap();let shell=map.querySelector(":scope > .event-map-shell");if(!shell){shell=document.createElement("div");shell.className="event-map-shell";map.append(shell);}
  const target=view.kind==="route"?`${view.origin} → ${view.destination}`:view.query;
  const via=view.waypoints?` · 경유 ${esc(view.waypoints.replaceAll("|"," → "))}`:"";
  if(view.kind==="route"&&view.mode==="flight"){
    shell.innerHTML=`<div class="event-map-bar"><div><b>✈ ${esc(event.title||target)}</b><small>${esc(target)} · 이동 경로${via}</small></div><div class="event-map-actions"><button type="button" data-event-map-close>기본 지도</button></div></div><div class="flight-route-map" data-flight-map aria-label="${esc(event.title||target)} 항공 경로"></div>`;
    renderFlightRoute(shell,event,view);
  }else{
    const src=googleMapsEmbedUrl(view);if(!src)return false;
    shell.innerHTML=`<div class="event-map-bar"><div><b>${view.kind==="route"?"🧭":"📍"} ${esc(event.title||target)}</b><small>${esc(target)} · ${esc(mappingLabel(view))}${via}</small></div><div class="event-map-actions"><button type="button" data-event-map-close>기본 지도</button></div></div><iframe title="${esc(event.title||target)}" src="${esc(src)}" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }
  document.querySelectorAll("#route-list [data-stable-map-event]").forEach(button=>button.classList.toggle("active",String(button.dataset.stableMapEvent)===String(event.id)));
  shell.querySelector("[data-event-map-close]")?.addEventListener("click",()=>{destroyFlightMap();shell.remove();state.selectedEvent=null;document.querySelectorAll("#route-list [data-stable-map-event]").forEach(button=>button.classList.remove("active"));});return true;
}
window.__tripMapFocus=focusMap;
window.__tripMapAudit=()=>auditEventMappings(liveSeed().events||[]);
window.__tripMapContinuityAudit=()=>auditFullRouteContinuity(liveSeed().events||[]);
window.__tripMapManifestCoverage=()=>manifestCoverage(liveSeed().events||[]);
window.__tripMapChronologicalAudit=()=>eventsForMap().map(e=>({id:e.id,day_id:Number(e.day_id),time_start:e.time_start,minutes:timeMinutes(e.time_start),kind:viewFor(e).kind,title:e.title}));

function render(){const h=host();if(!h)return;const tab=activeTab();if(tab==="timeline"){h.hidden=false;h.innerHTML=weatherHtml(activeDay());return;}if(tab==="map"){h.hidden=true;h.innerHTML="";scheduleMapSidebar();return;}h.hidden=true;h.innerHTML="";}
async function sync(forceWeather=false){await loadWeather(forceWeather);render();}
let activationLock="";
function activateMapEvent(target,type){const button=target?.closest?.("#route-list [data-stable-map-event]");if(!button)return false;const token=`${type}:${button.dataset.stableMapEvent}`;if(token===activationLock)return true;activationLock=token;setTimeout(()=>{activationLock="";},250);return focusMap(button.dataset.stableMapEvent);}
document.addEventListener("pointerup",e=>{if(activateMapEvent(e.target,"pointerup")){e.preventDefault();e.stopPropagation();}},true);
document.addEventListener("click",e=>{const refresh=e.target.closest("[data-stable-weather-refresh]");if(refresh){e.preventDefault();sync(true);return;}if(activateMapEvent(e.target,"click")){e.preventDefault();e.stopPropagation();return;}if(e.target.closest(".day-tab,.itinerary-tab,#tabs [data-tab],#show-all-route"))setTimeout(()=>{state.selectedEvent=null;render();},80);},true);
const tabObserver=new MutationObserver(()=>{clearTimeout(tabObserver._t);tabObserver._t=setTimeout(render,50);});tabObserver.observe(document.getElementById("tabs")||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
const main=document.getElementById("main-content");if(main){const mainObserver=new MutationObserver(()=>{clearTimeout(mainObserver._t);mainObserver._t=setTimeout(render,80);});mainObserver.observe(main,{childList:true,subtree:false});}
window.addEventListener("load",()=>sync(false));sync(false);
