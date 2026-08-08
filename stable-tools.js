import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V13";
import { longRangeWeather } from "./weather-fallback.js?v=LIVE_TRAVEL_V13";

const BUILD="LIVE_TRAVEL_V13";
const HOST_ID="stable-live-tools";
const state={weather:null,loadedAt:0,selectedEvent:null};
const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function host(){return document.getElementById(HOST_ID);}
function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary||DEFAULT_ITINERARY;
  return ITINERARIES[key]||ITINERARIES[DEFAULT_ITINERARY];
}
function activeTab(){return document.querySelector("#tabs [data-tab].active")?.dataset?.tab||"timeline";}
function activeDayId(){return Number(document.querySelector(".day-tab.active")?.dataset?.day||1);}
function activeDay(){
  const p=activePlan(),id=activeDayId();
  return p.officialSeed.days.find(d=>Number(d.id)===id)||p.officialSeed.days[0];
}
function eventsForDay(){
  const id=activeDayId();
  return (activePlan().officialSeed.events||[]).filter(e=>Number(e.day_id)===id).slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
}

async function loadWeather(force=false){
  if(!force&&state.weather&&Date.now()-state.loadedAt<300000)return;
  try{
    const r=await fetch(`./trip-live.json?v=${Date.now()}`,{cache:"no-store"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const p=await r.json();state.weather=p.weather||{};state.loadedAt=Date.now();
  }catch(e){console.warn(`[${BUILD}] weather`,e);state.loadedAt=Date.now();}
}

function fallbackCard(text){
  const f=longRangeWeather(text);if(!f)return"";
  return `<article><b>${esc(f.label)} · 장기전망/평년</b><small>${esc(f.basis)}</small><p><strong>예상 기준 ${esc(f.highC)}℃ / ${esc(f.lowC)}℃</strong><br>정식 단기예보가 발표되면 자동으로 공식예보가 우선됩니다.</p><div class="stable-source-links"><a href="${esc(f.sourceUrl)}" target="_blank" rel="noopener noreferrer">월간 전망 원문 ↗</a>${f.officialUrl?`<a href="${esc(f.officialUrl)}" target="_blank" rel="noopener noreferrer">${esc(f.officialLabel)} ↗</a>`:""}</div></article>`;
}
function weatherHtml(day){
  const bundle=state.weather?.[day.date],rows=bundle?.locations||[];
  if(!rows.length){
    const fallback=fallbackCard(day.cities);
    return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>공식 단기예보 전에는 월간전망 또는 9월 평년값을 표시합니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${fallback||"<article><b>장기 날씨 기준 준비 중</b></article>"}</div></section>`;
  }
  return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 날씨</h2><p>공식 시간별 예보가 있으면 우선하고, 발표 전이면 월간전망/평년값을 사용합니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${rows.map(loc=>{
    const hourly=loc.kind==="official_hourly"?(loc.hourly||[]).slice(0,6):[];
    if(hourly.length)return `<article><b>${esc(loc.city||"")} · 공식예보</b><small>${esc(loc.authority||"")}</small><div class="stable-hourly">${hourly.map(r=>`<span><strong>${esc(r.time||"")}</strong>${r.temperature_c!=null?` ${esc(r.temperature_c)}℃`:""}${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;
    return fallbackCard(`${loc.city||""} ${(loc.aliases||[]).join(" ")}`)||`<article><b>${esc(loc.city||"")} · 예보 발표 전</b><small>${esc(loc.authority||"")}</small><p>${esc(loc.reason||"공식 예보 범위 밖입니다.")}</p>${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;
  }).join("")}</div></section>`;
}

function eventButton(e){
  return `<button type="button" class="stable-map-event ${String(state.selectedEvent)===String(e.id)?"active":""}" data-stable-map-event="${esc(e.id)}"><span>${esc(e.time_start||"")}${e.time_end?`–${esc(e.time_end)}`:""}</span><span><b>${esc(e.title||"")}</b><small>${e.location?`📍 ${esc(e.location)}`:""}${e.transport?` · ${esc(e.transport)}`:""}</small></span><strong>경로 보기 →</strong></button>`;
}
function mapScheduleHtml(day){
  const events=eventsForDay();
  return `<section class="stable-card stable-map-schedule"><div class="stable-head"><div><h2>🗺 Day ${day.id} 세부일정 · 클릭하면 위 지도에 경로 표시</h2><p>이동 일정은 명시된 출발·도착을, 장소 일정은 직전 일정 위치→선택 장소 경로를 표시합니다.</p></div></div><div class="stable-map-events">${events.map(eventButton).join("")}</div></section>`;
}

function parseMapUrl(href){
  if(!href)return null;
  try{
    const u=new URL(href,location.href),p=u.searchParams;
    const origin=p.get("origin")||p.get("saddr"),destination=p.get("destination")||p.get("daddr");
    if(origin&&destination)return{kind:"route",origin,destination,waypoints:p.get("waypoints")||"",mode:p.get("travelmode")||""};
    const q=p.get("query")||p.get("q");if(q)return{kind:"place",query:q};
  }catch{}
  return null;
}
function routeFromText(e){
  for(const raw of [e?.location,e?.title]){
    const parts=String(raw||"").split(/\s*(?:→|->|⇒)\s*/).map(x=>x.trim()).filter(Boolean);
    if(parts.length>=2)return{kind:"route",origin:parts[0],destination:parts.at(-1),waypoints:parts.slice(1,-1).join("|")};
  }
  return null;
}
function modeFor(e){
  const t=`${e?.category||""} ${e?.transport||""}`.toLowerCase();
  if(/thsr|mrt|metro|subway|rail|train|기차|철도|열차|버스|bus|u-bahn|s-bahn|dsb|db\/|ns\//.test(t))return"transit";
  if(/도보|walk/.test(t))return"walking";
  return"driving";
}
function placeText(e){return String(e?.location||e?.title||"").trim();}
function derivedRoute(e){
  const events=eventsForDay(),idx=events.findIndex(x=>String(x.id)===String(e.id));
  if(idx<=0)return null;
  const destination=placeText(e);if(!destination)return null;
  for(let i=idx-1;i>=0;i--){
    const origin=placeText(events[i]);
    if(origin&&origin!==destination&&!/[→⇒]/.test(origin))return{kind:"route",origin,destination,waypoints:"",mode:modeFor(e),derived:true};
  }
  return null;
}
function viewFor(e){
  const explicit=parseMapUrl(e?.map_url);if(explicit){explicit.mode=explicit.mode||modeFor(e);return explicit;}
  const textRoute=routeFromText(e);if(textRoute){textRoute.mode=modeFor(e);return textRoute;}
  return derivedRoute(e)||{kind:"place",query:placeText(e)};
}
function mapSrc(v){
  if(v.kind==="place")return `https://maps.google.com/maps?${new URLSearchParams({q:v.query,z:"17",output:"embed"}).toString()}`;
  const dest=v.waypoints?`${v.waypoints.replaceAll("|"," to:")} to:${v.destination}`:v.destination;
  const p=new URLSearchParams({output:"embed",saddr:v.origin,daddr:dest});
  if(v.mode==="walking")p.set("dirflg","w");else if(v.mode==="transit")p.set("dirflg","r");else p.set("dirflg","d");
  return `https://maps.google.com/maps?${p.toString()}`;
}
function focusMap(eventId){
  const e=eventsForDay().find(x=>String(x.id)===String(eventId));if(!e)return false;
  const map=document.getElementById("map");if(!map)return false;
  const v=viewFor(e),src=mapSrc(v);state.selectedEvent=eventId;
  let shell=map.querySelector(":scope > .stable-map-shell");
  if(!shell){shell=document.createElement("div");shell.className="stable-map-shell";map.append(shell);}
  const title=v.kind==="route"?`${v.origin} → ${v.destination}`:v.query;
  shell.innerHTML=`<div class="stable-map-bar"><div><b>${esc(e.title||title)}</b><small>${v.kind==="route"?`${esc(v.origin)} → ${esc(v.destination)}${v.waypoints?` · 경유 ${esc(v.waypoints.replaceAll("|"," → "))}`:""}${v.derived?" · 직전 일정 기준 경로":""}`:`${esc(v.query)} · 첫 일정은 위치 표시`}</small></div><button type="button" data-stable-map-close>기본 지도로</button></div><iframe title="${esc(e.title||title)}" src="${esc(src)}" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  host()?.querySelectorAll("[data-stable-map-event]").forEach(b=>b.classList.toggle("active",String(b.dataset.stableMapEvent)===String(eventId)));
  map.scrollIntoView({behavior:"smooth",block:"center"});
  return true;
}
window.__tripMapFocus=focusMap;

function render(){
  const h=host();if(!h)return;
  const tab=activeTab(),day=activeDay();
  if(tab==="timeline"){h.hidden=false;h.innerHTML=weatherHtml(day);return;}
  if(tab==="map"){h.hidden=false;h.innerHTML=`${weatherHtml(day)}${mapScheduleHtml(day)}`;return;}
  h.hidden=true;h.innerHTML="";
}
async function sync(forceWeather=false){await loadWeather(forceWeather);render();}

let lastPointerEvent="";
function activateMapEvent(target,eventType){
  const button=target?.closest?.("[data-stable-map-event]");if(!button)return false;
  const token=`${eventType}:${button.dataset.stableMapEvent}`;
  if(token===lastPointerEvent)return true;
  lastPointerEvent=token;setTimeout(()=>{lastPointerEvent="";},250);
  focusMap(button.dataset.stableMapEvent);
  return true;
}
document.addEventListener("pointerup",e=>{
  if(activateMapEvent(e.target,"pointerup")){e.preventDefault();e.stopPropagation();}
},true);
document.addEventListener("click",e=>{
  const refresh=e.target.closest("[data-stable-weather-refresh]");if(refresh){e.preventDefault();sync(true);return;}
  if(activateMapEvent(e.target,"click")){e.preventDefault();e.stopPropagation();return;}
  const close=e.target.closest("[data-stable-map-close]");if(close){e.preventDefault();document.querySelector("#map > .stable-map-shell")?.remove();state.selectedEvent=null;render();return;}
  if(e.target.closest(".day-tab,.itinerary-tab,#tabs [data-tab]"))setTimeout(render,120);
},true);

// Critical: watch only direct children of #main-content. Leaflet continuously mutates
// descendants inside #map; observing the full subtree replaced schedule buttons between
// pointerdown and pointerup, so browsers could never produce a stable click target.
const tabObserver=new MutationObserver(()=>{clearTimeout(tabObserver._t);tabObserver._t=setTimeout(render,50);});
tabObserver.observe(document.getElementById("tabs")||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
const main=document.getElementById("main-content");
if(main){
  const mainObserver=new MutationObserver(()=>{clearTimeout(mainObserver._t);mainObserver._t=setTimeout(render,80);});
  mainObserver.observe(main,{childList:true,subtree:false});
}
window.addEventListener("load",()=>sync(false));
sync(false);
