import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V11";

const BUILD="LIVE_TRAVEL_V11";
const HOST_ID="stable-live-tools";
const state={weather:null,loadedAt:0,selectedEvent:null};
const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const fmt=v=>new Intl.NumberFormat("ko-KR").format(Math.round(Number(v)||0));

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

function weatherHtml(day){
  const bundle=state.weather?.[day.date],rows=bundle?.locations||[];
  if(!rows.length)return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 공식 날씨</h2><p>공식 날씨 정보를 읽는 중입니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div></section>`;
  return `<section class="stable-card stable-weather"><div class="stable-head"><div><h2>🌦 ${esc(day.date)} 공식 날씨</h2><p>출장일 예보 발표 전에는 평년값 대신 공식 발표대기 상태와 원문만 표시합니다.</p></div><button class="btn small" type="button" data-stable-weather-refresh>다시 읽기</button></div><div class="stable-weather-grid">${rows.map(loc=>{
    const hourly=loc.kind==="official_hourly"?(loc.hourly||[]).slice(0,6):[];
    return `<article><b>${esc(loc.city||"")}</b><small>${esc(loc.authority||"")}</small>${hourly.length?`<div class="stable-hourly">${hourly.map(r=>`<span><strong>${esc(r.time||"")}</strong>${r.temperature_c!=null?` ${esc(r.temperature_c)}℃`:""}${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div>`:`<p><b>시간별 예보 발표 전</b><br>${esc(loc.reason||"공식 예보 범위 밖입니다.")}</p>`}${loc.source_url?`<a href="${esc(loc.source_url)}" target="_blank" rel="noopener noreferrer">공식 기상청 원문 ↗</a>`:""}</article>`;
  }).join("")}</div></section>`;
}

function bookingUrl(h){
  const p=new URLSearchParams({ss:`${h.name} ${h.city||""}`.trim(),checkin:h.check_in,checkout:h.check_out,group_adults:"4",no_rooms:String(h.rooms||2),group_children:"0",selected_currency:"KRW",order:"price"});
  return `https://www.booking.com/searchresults.ko.html?${p.toString()}`;
}
function hotelsHtml(){
  const hotels=activePlan().officialSeed.hotels||[];
  return `<section class="stable-card stable-hotels"><div class="stable-head"><div><h2>🏨 전체 호텔 실제 예약</h2><p>성인 4명 · 일정의 체크인/체크아웃 · ${hotels[0]?.rooms||2}실 조건을 링크에 직접 넣었습니다.</p></div></div><div class="stable-hotel-grid">${hotels.map(h=>`<article><div><span>${esc(h.city||"")}</span><b>${esc(h.name||"")}</b><small>${esc(h.check_in)} → ${esc(h.check_out)} · ${esc(h.nights||"")}박 · ${esc(h.rooms||2)}실</small>${h.min_krw!=null?`<strong>계획범위 4인 ₩${fmt(h.min_krw)}~₩${fmt(h.max_krw)}</strong>`:""}</div><div class="stable-hotel-actions"><a class="btn small primary" href="${esc(bookingUrl(h))}" target="_blank" rel="noopener noreferrer">Booking.com 실제 예약 ↗</a>${h.url?`<a class="btn small" href="${esc(h.url)}" target="_blank" rel="noopener noreferrer">호텔 공식 사이트 ↗</a>`:""}</div></article>`).join("")}</div></section>`;
}

function eventButton(e){
  return `<button type="button" class="stable-map-event ${String(state.selectedEvent)===String(e.id)?"active":""}" data-stable-map-event="${esc(e.id)}"><span>${esc(e.time_start||"")}${e.time_end?`–${esc(e.time_end)}`:""}</span><span><b>${esc(e.title||"")}</b><small>${e.location?`📍 ${esc(e.location)}`:""}${e.transport?` · ${esc(e.transport)}`:""}</small></span><strong>지도 이동 →</strong></button>`;
}
function mapScheduleHtml(day){
  const events=eventsForDay();
  return `<section class="stable-card stable-map-schedule"><div class="stable-head"><div><h2>🗺 Day ${day.id} 세부일정 · 클릭하면 위 지도 이동</h2><p>일정 버튼은 지도 iframe을 직접 교체하므로 앱 재렌더링과 별개로 동작합니다.</p></div></div><div class="stable-map-events">${events.map(eventButton).join("")}</div></section>`;
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
function viewFor(e){
  const a=parseMapUrl(e?.map_url);if(a)return a;
  const b=routeFromText(e);if(b){b.mode=modeFor(e);return b;}
  return{kind:"place",query:e?.location||e?.title||""};
}
function mapSrc(v){
  if(v.kind==="place")return `https://maps.google.com/maps?${new URLSearchParams({q:v.query,z:"17",output:"embed"}).toString()}`;
  const dest=v.waypoints?`${v.waypoints.replaceAll("|"," to:")} to:${v.destination}`:v.destination;
  const p=new URLSearchParams({output:"embed",saddr:v.origin,daddr:dest});
  if(v.mode==="walking")p.set("dirflg","w");else if(v.mode==="transit")p.set("dirflg","r");else p.set("dirflg","d");
  return `https://maps.google.com/maps?${p.toString()}`;
}
function focusMap(eventId){
  const e=eventsForDay().find(x=>String(x.id)===String(eventId));if(!e)return;
  const map=document.getElementById("map");if(!map)return;
  const v=viewFor(e),src=mapSrc(v);state.selectedEvent=eventId;
  let shell=map.querySelector(":scope > .stable-map-shell");
  if(!shell){shell=document.createElement("div");shell.className="stable-map-shell";map.append(shell);}
  const title=v.kind==="route"?`${v.origin} → ${v.destination}`:v.query;
  shell.innerHTML=`<div class="stable-map-bar"><div><b>${esc(e.title||title)}</b><small>${v.kind==="route"?`${esc(v.origin)} → ${esc(v.destination)}${v.waypoints?` · 경유 ${esc(v.waypoints.replaceAll("|"," → "))}`:""}`:`${esc(v.query)} · 확대 17`}</small></div><button type="button" data-stable-map-close>기본 지도로</button></div><iframe title="${esc(e.title||title)}" src="${esc(src)}" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  host()?.querySelectorAll("[data-stable-map-event]").forEach(b=>b.classList.toggle("active",String(b.dataset.stableMapEvent)===String(eventId)));
  map.scrollIntoView({behavior:"smooth",block:"center"});
}

function render(){
  const h=host();if(!h)return;
  const tab=activeTab(),day=activeDay();
  if(tab==="timeline"){h.hidden=false;h.innerHTML=`${weatherHtml(day)}${hotelsHtml()}`;return;}
  if(tab==="map"){h.hidden=false;h.innerHTML=`${weatherHtml(day)}${mapScheduleHtml(day)}`;return;}
  h.hidden=true;h.innerHTML="";
}
async function sync(forceWeather=false){await loadWeather(forceWeather);render();}

document.addEventListener("click",e=>{
  const refresh=e.target.closest("[data-stable-weather-refresh]");if(refresh){e.preventDefault();sync(true);return;}
  const eventButton=e.target.closest("[data-stable-map-event]");if(eventButton){e.preventDefault();e.stopPropagation();focusMap(eventButton.dataset.stableMapEvent);return;}
  const close=e.target.closest("[data-stable-map-close]");if(close){e.preventDefault();document.querySelector("#map > .stable-map-shell")?.remove();state.selectedEvent=null;render();}
},true);

const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(()=>render(),70);});
observer.observe(document.getElementById("tabs")||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
observer.observe(document.getElementById("main-content")||document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",()=>sync(false));
sync(false);
