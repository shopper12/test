import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V10";

const BUILD="LIVE_TRAVEL_V10";
const WEATHER_URL="./trip-live.json";
const GOOGLE_KEY_STORAGE="offshore-trip-google-maps-embed-key";
const state={weather:null,weatherLoadedAt:0,selectedEventId:null,selectedDay:null,lastMapKey:""};

const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const fmt=v=>new Intl.NumberFormat("ko-KR").format(Math.round(Number(v)||0));

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary||DEFAULT_ITINERARY;
  return ITINERARIES[key]||ITINERARIES[DEFAULT_ITINERARY];
}
function activeTab(){return document.querySelector("#tabs [data-tab].active")?.dataset?.tab||"timeline";}
function activeDayId(){return Number(document.querySelector(".day-tab.active")?.dataset?.day||1);}
function activeDay(){
  const plan=activePlan(),id=activeDayId();
  return plan.officialSeed.days.find(d=>Number(d.id)===id)||plan.officialSeed.days[0];
}
function activeDate(){
  const text=document.querySelector(".day-tab.active span")?.textContent||"";
  return text.match(/\d{4}-\d{2}-\d{2}/)?.[0]||activeDay()?.date||"";
}
function eventsForDay(){
  const id=activeDayId();
  return (activePlan().officialSeed.events||[]).filter(e=>Number(e.day_id)===id).slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
}
function eventById(id){return (activePlan().officialSeed.events||[]).find(e=>String(e.id)===String(id));}

async function loadWeather(force=false){
  if(!force&&state.weather&&Date.now()-state.weatherLoadedAt<300000)return state.weather;
  try{
    const res=await fetch(`${WEATHER_URL}?runtime=${Date.now()}`,{cache:"no-store"});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const payload=await res.json();
    state.weather=payload.weather||{};
    state.weatherLoadedAt=Date.now();
  }catch(error){
    console.warn(`[${BUILD}] weather load failed`,error);
  }
  return state.weather;
}

function weatherPanelHtml(){
  const date=activeDate(),bundle=state.weather?.[date],locations=bundle?.locations||[];
  if(!locations.length){
    return `<div class="runtime-weather-head"><div><b>🌦 ${esc(date)} 공식 날씨</b><span>공식 기상자료를 다시 읽는 중입니다.</span></div><button type="button" class="btn small" data-runtime-weather-refresh>다시 읽기</button></div>`;
  }
  return `<div class="runtime-weather-head"><div><b>🌦 ${esc(date)} 공식 날씨</b><span>출장일 예보가 발표되면 시간대별 정보로 자동 전환됩니다.</span></div><button type="button" class="btn small" data-runtime-weather-refresh>다시 읽기</button></div><div class="runtime-weather-grid">${locations.map(loc=>{
    const hourly=loc.kind==="official_hourly"?(loc.hourly||[]):[];
    const sample=hourly.slice(0,6);
    return `<article class="runtime-weather-card"><b>${esc(loc.city||"")}</b><small>${esc(loc.authority||"")}</small>${sample.length?`<div class="runtime-hourly">${sample.map(row=>`<span><strong>${esc(row.time||"")}</strong>${row.temperature_c!=null?` ${esc(row.temperature_c)}℃`:""}${row.precip_probability_pct!=null?` · 비 ${esc(row.precip_probability_pct)}%`:""}${row.wind_speed!=null?` · 풍속 ${esc(row.wind_speed)}`:""}</span>`).join("")}</div>`:`<p><strong>시간별 예보 발표 전</strong><br>${esc(loc.reason||"공식 예보 범위 밖입니다.")}</p>`}${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;
  }).join("")}</div>`;
}

function ensureWeatherPanel(){
  const tab=activeTab();
  if(!["timeline","map"].includes(tab))return;
  const main=document.querySelector("#main-content");if(!main)return;
  let panel=main.querySelector("#runtime-weather-panel");
  if(!panel){
    panel=document.createElement("section");panel.id="runtime-weather-panel";panel.className="runtime-panel runtime-weather-panel";
    const anchor=tab==="timeline"?main.querySelector(".day-summary"):main.querySelector(".day-tabs");
    if(anchor)anchor.after(panel);else main.prepend(panel);
  }
  const key=`${activeDate()}:${state.weatherLoadedAt}:${state.weather?.[activeDate()]?.locations?.length||0}`;
  if(panel.dataset.key!==key){panel.dataset.key=key;panel.innerHTML=weatherPanelHtml();}
}

function bookingUrl(h){
  const p=new URLSearchParams({ss:`${h.name} ${h.city||""}`.trim(),checkin:h.check_in,checkout:h.check_out,group_adults:"4",no_rooms:String(h.rooms||2),group_children:"0",selected_currency:"KRW",order:"price"});
  return `https://www.booking.com/searchresults.ko.html?${p.toString()}`;
}
function hotelPanelHtml(){
  const hotels=activePlan().officialSeed.hotels||[];
  return `<div class="runtime-panel-head"><div><h2>🏨 호텔 실제 예약</h2><p>전체일정에서 바로 예약 사이트로 이동합니다. 성인 4명 · ${hotels[0]?.rooms||2}실 조건.</p></div></div><div class="runtime-hotel-grid">${hotels.map(h=>`<article class="runtime-hotel-card"><div><span>${esc(h.city||"")}</span><b>${esc(h.name)}</b><small>${esc(h.check_in)} → ${esc(h.check_out)} · ${esc(h.nights||"")}박 · ${esc(h.rooms||2)}실</small>${h.min_krw!=null?`<strong>계획범위 4인 ₩${fmt(h.min_krw)}~₩${fmt(h.max_krw)}</strong>`:""}</div><div class="runtime-hotel-actions"><a class="btn small primary runtime-booking-link" href="${esc(bookingUrl(h))}" data-runtime-booking-url="${esc(bookingUrl(h))}">Booking.com 실제 예약</a>${h.url?`<a class="btn small" href="${esc(h.url)}" target="_blank" rel="noreferrer">호텔 공식 사이트 ↗</a>`:""}</div></article>`).join("")}</div>`;
}
function ensureHotelPanel(){
  if(activeTab()!=="timeline")return;
  const main=document.querySelector("#main-content");if(!main)return;
  main.querySelectorAll(".all-hotel-booking-panel").forEach(el=>el.hidden=true);
  let panel=main.querySelector("#runtime-hotel-panel");
  if(!panel){
    panel=document.createElement("section");panel.id="runtime-hotel-panel";panel.className="runtime-panel runtime-hotel-panel";
    const anchor=main.querySelector("#runtime-weather-panel")||main.querySelector(".day-summary")||main.querySelector(".day-tabs");
    if(anchor)anchor.after(panel);else main.prepend(panel);
  }
  const hotels=activePlan().officialSeed.hotels||[];
  const key=hotels.map(h=>`${h.name}:${h.check_in}:${h.check_out}:${h.rooms||2}`).join("|");
  if(panel.dataset.key!==key){panel.dataset.key=key;panel.innerHTML=hotelPanelHtml();}
}

function modeForEvent(event){
  const text=`${event?.category||""} ${event?.transport||""}`.toLowerCase();
  if(/thsr|mrt|metro|subway|rail|train|기차|철도|열차|버스|bus|u-bahn|s-bahn|dsb|db\/|ns\//.test(text))return "transit";
  if(/도보|walk/.test(text))return "walking";
  if(/항공|flight|airline/.test(text))return "flying";
  return "driving";
}
function parseMapUrl(href){
  if(!href)return null;
  try{
    const url=new URL(href,location.href),p=url.searchParams;
    const origin=p.get("origin")||p.get("saddr"),destination=p.get("destination")||p.get("daddr");
    if(origin&&destination)return{kind:"route",origin,destination,waypoints:p.get("waypoints")||"",mode:p.get("travelmode")||""};
    const q=p.get("query")||p.get("q");if(q)return{kind:"place",query:q};
  }catch{}
  return null;
}
function routeFromText(event){
  for(const raw of [event?.location,event?.title]){
    if(!raw)continue;
    const parts=String(raw).split(/\s*(?:→|->|⇒)\s*/).map(v=>v.trim()).filter(Boolean);
    if(parts.length>=2)return{kind:"route",origin:parts[0],destination:parts.at(-1),waypoints:parts.slice(1,-1).join("|")};
  }
  return null;
}
function mapViewForEvent(event){
  const explicit=parseMapUrl(event?.map_url);if(explicit){explicit.mode=explicit.mode||modeForEvent(event);return explicit;}
  const text=routeFromText(event);if(text){text.mode=modeForEvent(event);return text;}
  return {kind:"place",query:event?.location||event?.title||""};
}
function googleKey(){return String(window.GOOGLE_MAPS_EMBED_KEY||localStorage.getItem(GOOGLE_KEY_STORAGE)||"").trim();}
function apiDirections(view,key){
  const p=new URLSearchParams({key,origin:view.origin,destination:view.destination,mode:view.mode||"driving",units:"metric",language:"ko",region:"kr"});
  if(view.waypoints)p.set("waypoints",view.waypoints);
  return `https://www.google.com/maps/embed/v1/directions?${p.toString()}`;
}
function apiPlace(view,key){
  const p=new URLSearchParams({key,q:view.query,zoom:"17",language:"ko",region:"kr"});
  return `https://www.google.com/maps/embed/v1/place?${p.toString()}`;
}
function fallbackDirections(view){
  const p=new URLSearchParams({output:"embed",saddr:view.origin,daddr:view.waypoints?`${view.waypoints.replaceAll("|"," to:")} to:${view.destination}`:view.destination});
  if(view.mode==="walking")p.set("dirflg","w");else if(view.mode==="transit")p.set("dirflg","r");else p.set("dirflg","d");
  return `https://maps.google.com/maps?${p.toString()}`;
}
function fallbackPlace(view){return `https://maps.google.com/maps?${new URLSearchParams({q:view.query,z:"17",output:"embed"}).toString()}`;}
function mapSrc(view){const key=googleKey();return key?(view.kind==="route"?apiDirections(view,key):apiPlace(view,key)):(view.kind==="route"?fallbackDirections(view):fallbackPlace(view));}

function focusMapEvent(event){
  if(!event)return;
  const host=document.querySelector("#map");if(!host)return;
  const view=mapViewForEvent(event),src=mapSrc(view);
  let shell=host.querySelector(":scope > .google-map-shell");
  if(!shell){shell=document.createElement("div");shell.className="google-map-shell runtime-map-shell";host.append(shell);}
  const key=`${event.id}:${src}`;
  state.selectedEventId=String(event.id||"");state.selectedDay=activeDayId();
  if(state.lastMapKey!==key||!shell.querySelector("iframe")){
    state.lastMapKey=key;
    const title=view.kind==="route"?`${view.origin} → ${view.destination}`:view.query;
    shell.innerHTML=`<div class="runtime-map-controls"><div><b>${esc(event.title||title)}</b><small>${view.kind==="route"?`출발 ${esc(view.origin)} · 도착 ${esc(view.destination)}${view.waypoints?` · 경유 ${esc(view.waypoints.replaceAll("|"," → "))}`:""}`:`${esc(view.query)} · 확대 17`}</small></div><span>${googleKey()?"Google Maps Embed API":"Google Maps 내장형 호환모드"}</span></div><iframe class="google-map-frame runtime-map-frame" title="${esc(event.title||title)}" src="${esc(src)}" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }
  shell.classList.remove("map-focused");void shell.offsetWidth;shell.classList.add("map-focused");
  setTimeout(()=>shell.classList.remove("map-focused"),800);
  host.scrollIntoView({behavior:"smooth",block:"center"});
}
function focusMapPlace(query,title=query){
  if(!query)return;
  focusMapEvent({id:`place:${query}`,title,location:query,category:"장소"});
}

function mapCardHtml(e){
  return `<button type="button" class="runtime-map-event" data-runtime-map-event-id="${esc(e.id)}"><span class="runtime-map-time">${esc(e.time_start||"")}${e.time_end?`–${esc(e.time_end)}`:""}</span><span class="runtime-map-main"><b>${esc(e.title)}</b><small>${e.location?`📍 ${esc(e.location)}`:""}${e.transport?` · ${esc(e.transport)}`:""}</small></span><span class="runtime-map-go">지도에서 보기 →</span></button>`;
}
function ensureMapSchedule(){
  if(activeTab()!=="map")return;
  const main=document.querySelector("#main-content");if(!main)return;
  main.querySelectorAll(".map-schedule-section").forEach(el=>{if(el.id!=="runtime-map-schedule")el.hidden=true;});
  let section=main.querySelector("#runtime-map-schedule");
  if(!section){section=document.createElement("section");section.id="runtime-map-schedule";section.className="runtime-panel runtime-map-schedule";(main.querySelector(".legend")||main.querySelector(".map-layout")||main.lastElementChild)?.after(section);}
  const events=eventsForDay(),key=`${activeDayId()}:${events.map(e=>e.id).join("|")}`;
  if(section.dataset.key!==key){section.dataset.key=key;section.innerHTML=`<div class="runtime-panel-head"><div><h2>🗺 세부 일정 · 클릭하면 지도 이동</h2><p>각 일정을 누르면 위 지도가 해당 장소 또는 출발지→도착지 경로로 즉시 이동·확대됩니다.</p></div></div><div class="runtime-map-events">${events.map(mapCardHtml).join("")}</div>`;}
  if(state.selectedDay!==activeDayId()){state.selectedEventId=null;state.lastMapKey="";state.selectedDay=activeDayId();}
  if(state.selectedEventId){const e=eventById(state.selectedEventId);if(e)focusMapEvent(e);}
}

async function sync(){
  await loadWeather(false);
  ensureWeatherPanel();
  ensureHotelPanel();
  ensureMapSchedule();
}

// Capture clicks before older enhancement handlers can reinterpret the same card.
document.addEventListener("click",event=>{
  const refresh=event.target.closest("[data-runtime-weather-refresh]");
  if(refresh){event.preventDefault();loadWeather(true).then(()=>{document.querySelector("#runtime-weather-panel")?.remove();sync();});return;}

  const booking=event.target.closest("[data-runtime-booking-url]");
  if(booking){
    const url=booking.dataset.runtimeBookingUrl;
    if(url){event.preventDefault();event.stopImmediatePropagation();window.location.assign(url);}
    return;
  }

  const runtime=event.target.closest("[data-runtime-map-event-id]");
  if(runtime){event.preventDefault();event.stopImmediatePropagation();focusMapEvent(eventById(runtime.dataset.runtimeMapEventId));return;}

  const legacy=event.target.closest("[data-map-event-id]");
  if(legacy && !event.target.closest("a")){
    const id=legacy.dataset.mapEventId;if(id){event.preventDefault();event.stopImmediatePropagation();focusMapEvent(eventById(id));}
  }
},true);

document.addEventListener("trip:map-event",event=>focusMapEvent(event.detail?.event));
document.addEventListener("trip:map-place",event=>focusMapPlace(event.detail?.query,event.detail?.title||event.detail?.query));

const observer=new MutationObserver(()=>{clearTimeout(observer._runtime);observer._runtime=setTimeout(sync,80);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",sync);
setInterval(()=>loadWeather(true).then(sync),600000);
