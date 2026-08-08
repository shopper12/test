import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V15";

const TRANSIT_URL="./transit-live.json";
const state={transit:null,loadedAt:0,itinerary:DEFAULT_ITINERARY};
const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const norm=v=>String(v||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9가-힣]+/g," ").trim();

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary;
  if(key&&ITINERARIES[key])state.itinerary=key;
  return ITINERARIES[state.itinerary]||ITINERARIES[DEFAULT_ITINERARY];
}
function eventById(id){return (activePlan().officialSeed.events||[]).find(e=>String(e.id)===String(id));}
function dayById(id){return (activePlan().officialSeed.days||[]).find(d=>Number(d.id)===Number(id));}
function provider(id){return (state.transit?.providers||[]).find(p=>p.id===id);}
function providerIdsForEvent(event){
  const text=`${event?.title||""} ${event?.location||""} ${event?.transport||""} ${event?.category||""}`;
  const ids=[];
  if(/THSR|high.?speed/i.test(text))ids.push("thsr");
  if(/Airport MRT|Taoyuan.*MRT|공항.*MRT/i.test(text))ids.push("taoyuan_mrt");
  if(/NS\/|NS |Schiphol.*Rotterdam|Rotterdam Centraal/i.test(text)&&/train|rail|철도|열차|교통|NS/i.test(text))ids.push("ns");
  if(/DB\/|DB |Hamburg Hbf|Hamburg.*Esbjerg|Rotterdam.*Hamburg/i.test(text)&&/train|rail|철도|열차|교통|DB/i.test(text))ids.push("db");
  if(/HVV|U-Bahn|S-Bahn|Landungsbr|HafenCity/i.test(text)&&/버스|bus|bahn|metro|subway|교통/i.test(text))ids.push("hvv");
  if(/DSB|Esbjerg St\.?|København H|Copenhagen Central/i.test(text)&&/train|rail|철도|열차|교통|DSB/i.test(text)){ids.push("dsb","rejseplanen");}
  if(/metro|subway|지하철|버스|bus/i.test(text)&&/Copenhagen|København|Esbjerg/i.test(text))ids.push("rejseplanen");
  return [...new Set(ids)];
}
function statusClass(p){return p?.status==="normal"?"normal":p?.status==="alert"?"alert":p?.status==="source_error"?"error":"live";}
function transitHtml(event,compact=false){
  const rows=providerIdsForEvent(event).map(provider).filter(Boolean);if(!rows.length)return"";
  return `<div class="transit-live-box ${compact?"compact":""}">${rows.map(p=>`<div class="transit-provider ${statusClass(p)}"><span class="transit-dot"></span><div><b>🚆 ${esc(p.name)}</b>${compact?"":`<small>${esc(p.summary||"공식 최신 운행정보 확인")}${p.fetched_at?` · ${esc(new Date(p.fetched_at).toLocaleString("ko-KR",{timeZone:"Asia/Seoul",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}))} KST`:""}</small>`}</div><span class="transit-provider-links"><a href="${esc(p.status_url)}" target="_blank" rel="noreferrer">실시간 상태 ↗</a><a href="${esc(p.planner_url)}" target="_blank" rel="noreferrer">최신 시간표 ↗</a></span></div>`).join("")}</div>`;
}

function googleHotelUrl(h){const q=`${h.name} ${h.city||""} ${h.check_in||""} ${h.check_out||""}`;return `https://www.google.com/travel/hotels?q=${encodeURIComponent(q)}&hl=ko&curr=KRW`;}
function googleMapsPlace(name,city=""){return `https://www.google.com/maps/search/?${new URLSearchParams({api:"1",query:`${name} ${city}`.trim()}).toString()}`;}
function hotelMatches(event){
  const seed=activePlan().officialSeed,day=dayById(event.day_id),text=norm(`${event.title||""} ${event.location||""}`),hotels=seed.hotels||[];
  const exact=hotels.filter(h=>text.includes(norm(h.name))||norm(h.name).includes(text));if(exact.length)return exact;
  if(!day||!/숙박|호텔|체크인|체크아웃|조식/i.test(`${event.category||""} ${event.title||""}`))return[];
  return hotels.filter(h=>day.date>=h.check_in&&day.date<=h.check_out).slice(0,1);
}
function restaurantMatches(event){
  const rows=(activePlan().officialSeed.restaurants||[]).filter(r=>Number(r.day_id)===Number(event.day_id));if(!rows.length)return[];
  const text=norm(`${event.title||""} ${event.location||""}`),exact=rows.filter(r=>text.includes(norm(r.name))||norm(r.name).includes(text));
  if(exact.length)return exact;
  return /식사|점심|저녁|조식|맛집/i.test(`${event.category||""} ${event.title||""}`)?rows:[];
}
function entityLinksHtml(event,compact=false){
  const links=[];
  for(const h of hotelMatches(event))links.push(`<a class="entity-name-link hotel" href="${esc(googleHotelUrl(h))}" target="_blank" rel="noreferrer">🏨 ${esc(h.name)} ↗</a>`);
  for(const r of restaurantMatches(event))links.push(`<a class="entity-name-link restaurant" href="${esc(r.url||googleMapsPlace(r.name,r.city))}" target="_blank" rel="noreferrer">🍽 ${esc(r.name)} ↗</a>`);
  if(!links.length)return"";
  return `<div class="entity-name-links ${compact?"compact":""}">${links.join("")}</div>`;
}

function decorateTimeline(){
  const events=activePlan().officialSeed.events||[];
  document.querySelectorAll("#main-content .event-card[data-event-id]").forEach(card=>{
    const event=events.find(e=>String(e.id)===String(card.dataset.eventId));if(!event)return;
    const body=card.querySelector(":scope > div:nth-child(2)");if(!body)return;
    body.querySelector(":scope > .entity-name-links")?.remove();
    body.querySelector(":scope > .transit-live-box")?.remove();
    const entities=entityLinksHtml(event),transit=transitHtml(event);
    if(entities)body.insertAdjacentHTML("beforeend",entities);
    if(transit)body.insertAdjacentHTML("beforeend",transit);
  });
}
function decorateMapSidebar(){
  document.querySelectorAll("#route-list [data-stable-map-event]").forEach(button=>{
    const event=eventById(button.dataset.stableMapEvent);if(!event)return;
    let extras=button.nextElementSibling;
    if(!extras||!extras.classList.contains("map-sidebar-live-extras")){extras=document.createElement("div");extras.className="map-sidebar-live-extras";button.after(extras);}
    extras.innerHTML=`${entityLinksHtml(event,true)}${transitHtml(event,true)}`;
    extras.hidden=!extras.innerHTML.trim();
  });
}
function decorate(){decorateTimeline();decorateMapSidebar();}
async function load(force=false){
  if(!force&&state.transit&&Date.now()-state.loadedAt<120000){decorate();return;}
  try{
    const r=await fetch(`${TRANSIT_URL}?ts=${Date.now()}`,{cache:"no-store"});if(!r.ok)throw new Error(`transit-live HTTP ${r.status}`);
    state.transit=await r.json();state.loadedAt=Date.now();
  }catch(e){console.warn("live transit load failed",e);state.loadedAt=Date.now();}
  decorate();
}

const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(decorate,140);});
observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("click",e=>{if(e.target.closest(".day-tab,.itinerary-tab,#tabs [data-tab]"))setTimeout(()=>load(false),180);},true);
window.addEventListener("load",()=>load(true));
load(true);
