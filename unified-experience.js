import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V7";

const LIVE_URL="./trip-live.json";
const FARES_URL="./flight-prices.json";
const uiState={live:null,fares:null,loadedAt:0,itinerary:DEFAULT_ITINERARY};

const MENU={
  "Chun Shui Tang Siwei Original Store":{items:["오리지널 버블 밀크티","대만식 면·딤섬류","차·간식"],note:"원조점. 당일 메뉴·가격은 공식 메뉴에서 최종 확인",url:"https://www.chunshuitang.com.tw/en/location-detail/original_store/"},
  "Markthal Rotterdam":{items:["고다 치즈","키블링·해산물","중동·아시아·지중해 푸드스탠드"],note:"여러 점포를 한 장소에서 선택",url:"https://markthal.nl/en/food-spots/"},
  "Restaurant Bazar":{items:["중동·북아프리카 플래터","그릴·쿠스쿠스","메제·샐러드"],note:"공식 메뉴에서 당일 품목 확인",url:"https://restaurantbazar.nl/menukaart/"},
  "Oberhafen-Kantine":{items:["함부르크식 계절요리","북독일 가정식","계절 소규모 메뉴"],note:"계절·재고에 따라 변경",url:"https://www.oberhafenkantine-hamburg.de/portfolio-item/a-la-carte/"},
  "Esbjerg Street Food":{items:["버거·그릴","아시아·중동 스트리트푸드","맥주·간단식"],note:"입점 점포별 메뉴 선택",url:"https://esbjergstreetfood.dk/"},
  "Field's Food Court":{items:["덴마크·유럽 캐주얼","아시아 음식","버거·샐러드·카페"],note:"4인이 각자 선택하기 편한 푸드코트",url:"https://fields.steenstrom.dk/"},
  "Wuqi Fishing Harbor":{items:["제철 해산물","생선·조개구이","대만식 해산물 간식"],note:"당일 어획·점포별 가격 차이 큼",url:"https://travel.taichung.gov.tw/en"},
};

const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const norm=v=>String(v||"").toLowerCase().replace(/[^a-z0-9가-힣]+/g," ").trim();
const fmt=v=>new Intl.NumberFormat("ko-KR").format(Math.round(Number(v)||0));

async function loadData(force=false){
  if(!force&&uiState.live&&uiState.fares&&Date.now()-uiState.loadedAt<300000)return;
  const [live,fares]=await Promise.allSettled([
    fetch(`${LIVE_URL}?ts=${Date.now()}`,{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(`trip-live HTTP ${r.status}`);return r.json();}),
    fetch(`${FARES_URL}?ts=${Date.now()}`,{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(`fares HTTP ${r.status}`);return r.json();}),
  ]);
  if(live.status==="fulfilled")uiState.live=live.value; else console.warn(live.reason);
  if(fares.status==="fulfilled")uiState.fares=fares.value; else console.warn(fares.reason);
  uiState.loadedAt=Date.now();
}

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary;
  if(key&&ITINERARIES[key])uiState.itinerary=key;
  return ITINERARIES[uiState.itinerary]||ITINERARIES[DEFAULT_ITINERARY];
}
function activeDayId(){return Number(document.querySelector(".day-tab.active")?.dataset?.day||1);}
function activeDay(){const p=activePlan();return p.officialSeed.days.find(d=>Number(d.id)===activeDayId())||p.officialSeed.days[0];}
function isMapTab(){return document.querySelector('#tabs [data-tab="map"]')?.classList.contains("active");}
function isTimelineTab(){return document.querySelector('#tabs [data-tab="timeline"]')?.classList.contains("active");}

function findPhoto(text){
  const target=norm(text),photos=uiState.live?.photos||{};
  let best=null,bestScore=0;
  for(const [name,p] of Object.entries(photos)){
    const n=norm(name);if(!n)continue;
    let score=0;
    if(target.includes(n)||n.includes(target))score=100;
    else for(const token of n.split(" "))if(token.length>3&&target.includes(token))score+=8;
    if(score>bestScore){best=p;bestScore=score;}
  }
  return bestScore>=8?best:null;
}
function photoHtml(text,cls="ops-photo"){
  const p=findPhoto(text);if(!p?.url)return "";
  return `<a class="${cls}" href="${esc(p.page_url||p.url)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(p.url)}" alt="${esc(text)}"><span>공식 웹사이트 사진</span></a>`;
}

function weatherLocation(date,text){
  const rows=uiState.live?.weather?.[date]?.locations||[];if(!rows.length)return null;
  const t=norm(text);
  return rows.find(loc=>(loc.aliases||[]).some(a=>t.includes(norm(a))))||rows[0];
}
function nearestHourly(loc,time){
  const rows=loc?.hourly||[];if(!rows.length)return[];
  const h=Number(String(time||"09:00").slice(0,2))||9;
  return rows.slice().sort((a,b)=>Math.abs(Number(String(a.time||"").slice(0,2))-h)-Math.abs(Number(String(b.time||"").slice(0,2))-h)).slice(0,3).sort((a,b)=>String(a.time).localeCompare(String(b.time)));
}
function weatherHtml(day,event){
  const loc=weatherLocation(day.date,`${event?.title||""} ${event?.location||""} ${day.cities||""}`);
  if(!loc)return `<div class="event-official-weather"><div class="official-weather pending"><b>🌦 공식 기상예보 확인 중</b></div></div>`;
  if(loc.kind!=="official_hourly"||!(loc.hourly||[]).length){
    return `<div class="event-official-weather"><div class="official-weather pending"><b>🌦 ${esc(loc.city)} · 시간별 예보 발표 전</b><span>${esc(loc.reason||"공식 예보 범위 밖")}</span><a href="${esc(loc.source_url)}" target="_blank" rel="noreferrer">${esc(loc.authority)} 원문 ↗</a></div></div>`;
  }
  const rows=nearestHourly(loc,event?.time_start);
  return `<div class="event-official-weather"><div class="official-weather"><b>🌦 ${esc(loc.city)} · ${esc(loc.authority)}</b><div class="hourly-strip">${rows.map(r=>`<span><strong>${esc(r.time)}</strong> ${esc(r.temperature_c)}℃${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div></div></div>`;
}

function flightFareId(row){
  const origin=String(row?.origin||"").match(/[A-Z]{3}/)?.[0]||"",destination=String(row?.destination||"").match(/[A-Z]{3}/)?.[0]||"";
  const ids={cost_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_save","CPH-ICN":"route_f3"},time_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_direct","CPH-ICN":"route_f3"}};
  return ids[uiState.itinerary]?.[`${origin}-${destination}`]||null;
}
function fareFor(row){const id=flightFareId(row);return id?uiState.fares?.fares?.[id]:null;}
function hotelBookingUrl(h){return `https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(`${h.name} ${h.city}`)}&checkin=${h.check_in}&checkout=${h.check_out}&group_adults=4&no_rooms=${h.rooms||2}&group_children=0&selected_currency=KRW&order=price`;}

function flightCard(f){
  const fare=fareFor(f),selected=fare?.selected,booking=fare?.query_url||"https://www.google.com/travel/flights";
  return `<article class="ops-card master-ops-card">${photoHtml(`${f.origin} ${f.destination} Airport`)}<div><span class="ops-kicker">✈ 항공</span><b>${esc(f.flight_no)} · ${esc(f.origin)}→${esc(f.destination)}</b><small>${esc(f.depart_time)} → ${esc(f.arrive_time)} · ${esc(f.status)}</small><strong>${selected?.total_krw?`4인 ₩${fmt(selected.total_krw)} · 1인 ₩${fmt(selected.per_person_krw)}`:"현재 운임 재조회 중"}</strong><div class="ops-actions"><a class="btn small primary" href="${esc(booking)}" target="_blank" rel="noreferrer">실제 항공 조회·예약 ↗</a><a class="btn small" href="${esc(f.url)}" target="_blank" rel="noreferrer">항공사 공식 ↗</a></div></div></article>`;
}
function hotelCard(h,day){
  const phase=day.date===h.check_in?"체크인":day.date===h.check_out?"체크아웃":"숙박 중";
  return `<article class="ops-card master-ops-card">${photoHtml(h.name)}<div><span class="ops-kicker">🏨 호텔 · ${phase}</span><b>${esc(h.name)}</b><small>${esc(h.check_in)} → ${esc(h.check_out)} · ${h.rooms||2}실 · ${esc(h.status)}</small><strong>${h.min_krw!=null?`4인 ₩${fmt(h.min_krw)}~₩${fmt(h.max_krw)}`:"현재가 확인"}</strong><div class="ops-actions"><a class="btn small primary" href="${esc(hotelBookingUrl(h))}" target="_blank" rel="noreferrer">Booking 실제 객실·결제 ↗</a><a class="btn small" href="${esc(h.url)}" target="_blank" rel="noreferrer">호텔 공식 ↗</a></div></div></article>`;
}
function transportCard(e){
  return `<article class="ops-card master-ops-card compact"><div><span class="ops-kicker">🚆 교통</span><b>${esc(e.title)}</b><small>${esc(e.time_start||"")} · ${esc(e.transport||"")} · ${esc(e.duration||"")}</small>${e.min_cost_krw!=null?`<strong>4인 ₩${fmt(e.min_cost_krw)}~₩${fmt(e.max_cost_krw)}</strong>`:""}<div class="ops-actions">${e.booking_url?`<a class="btn small primary" href="${esc(e.booking_url)}" target="_blank" rel="noreferrer">공식 시간표·예매 ↗</a>`:"<span class=\"ops-pay-note\">택시·도보 등 현장/앱 결제</span>"}${e.map_url?`<button class="btn small map-route-action" type="button" data-map-event-id="${esc(e.id)}">지도에서 경로</button>`:""}</div></div></article>`;
}
function restaurantCard(r){
  const menu=MENU[r.name],url=menu?.url||r.url;
  return `<article class="ops-card master-ops-card">${photoHtml(r.name)}<div><span class="ops-kicker">🍽 맛집 · ${esc(r.meal_type)}</span><b>${esc(r.name)}</b><small>${esc(r.city)} · 1인 ${esc(r.price_per_person)}</small>${menu?`<div class="ops-menu"><b>추천 메뉴</b> ${menu.items.map(esc).join(" · ")}<br><span>${esc(menu.note)}</span></div>`:""}<div class="ops-actions"><a class="btn small primary" href="${esc(url)}" target="_blank" rel="noreferrer">${menu?"실제 메뉴·예약 확인":"식당 공식 확인"} ↗</a><button class="btn small map-place-action" type="button" data-map-place-query="${esc(`${r.name} ${r.city}`)}">지도에서 위치</button></div></div></article>`;
}

function dailyBoardHtml(day){
  const seed=activePlan().officialSeed,id=Number(day.id),date=day.date;
  const flights=(seed.flights||[]).filter(f=>Number(f.day_id)===id);
  const hotels=(seed.hotels||[]).filter(h=>date>=h.check_in&&date<=h.check_out);
  const transport=(seed.events||[]).filter(e=>Number(e.day_id)===id&&/교통|출국|환승/.test(String(e.category||""))).slice(0,8);
  const restaurants=(seed.restaurants||[]).filter(r=>Number(r.day_id)===id);
  return `<div class="section-head"><h2>항공 · 호텔 · 교통 · 맛집 · 예약 한눈에</h2><button class="btn small" type="button" data-master-refresh>실시간 다시 읽기</button></div><div class="ops-groups master-ops-groups">${flights.length?`<section><h3>✈ 항공</h3>${flights.map(flightCard).join("")}</section>`:""}${hotels.length?`<section><h3>🏨 숙박</h3>${hotels.map(h=>hotelCard(h,day)).join("")}</section>`:""}${transport.length?`<section><h3>🚆 교통·렌터카 판단</h3>${transport.map(transportCard).join("")}<p class="ops-note">렌터카를 별도 메뉴로 빼지 않고 실제 일정 교통과 함께 표시합니다. 편도반납·주차·시간을 비교해 채택된 교통을 우선합니다.</p></section>`:""}${restaurants.length?`<section><h3>🍽 음식점·메뉴</h3>${restaurants.map(restaurantCard).join("")}</section>`:""}</div>`;
}

function eventActionHtml(event){
  const seed=activePlan().officialSeed,dayId=Number(event.day_id),links=[];
  if(/항공/.test(event.category||"")){
    const f=(seed.flights||[]).find(x=>Number(x.day_id)===dayId&&(String(event.title).includes(x.origin)||String(event.title).includes(x.destination)));
    if(f){const fare=fareFor(f);links.push(`<a class="btn small primary" href="${esc(fare?.query_url||"https://www.google.com/travel/flights")}" target="_blank" rel="noreferrer">항공 실제 조회·예약 ↗</a>`);links.push(`<a class="btn small" href="${esc(f.url)}" target="_blank" rel="noreferrer">항공사 공식 ↗</a>`);}
  }
  if(/숙박/.test(event.category||"")||/호텔|CABINN|Holiday Inn|Motel One/i.test(event.location||"")){
    const h=(seed.hotels||[]).find(x=>norm(event.location).includes(norm(x.name))||norm(x.name).includes(norm(event.location)));
    if(h){links.push(`<a class="btn small primary" href="${esc(hotelBookingUrl(h))}" target="_blank" rel="noreferrer">호텔 실제 객실·결제 ↗</a>`);links.push(`<a class="btn small" href="${esc(h.url)}" target="_blank" rel="noreferrer">호텔 공식 ↗</a>`);}
  }
  if(/식사/.test(event.category||"")){
    const r=(seed.restaurants||[]).filter(x=>Number(x.day_id)===dayId).find(x=>norm(event.title).includes(norm(x.name))||norm(event.location).includes(norm(x.city)));
    if(r){const m=MENU[r.name];links.push(`<a class="btn small primary" href="${esc(m?.url||r.url)}" target="_blank" rel="noreferrer">${m?"메뉴·예약":"식당 확인"} ↗</a>`);}
  }
  if(/교통|출국|환승/.test(event.category||"")&&event.booking_url)links.push(`<a class="btn small primary" href="${esc(event.booking_url)}" target="_blank" rel="noreferrer">공식 시간표·예매 ↗</a>`);
  if(event.official_url)links.push(`<a class="btn small" href="${esc(event.official_url)}" target="_blank" rel="noreferrer">공식 사이트 ↗</a>`);
  links.push(`<button type="button" class="btn small map-route-action" data-map-event-id="${esc(event.id)}">🗺 지도에서 세부 경로</button>`);
  return `<div class="event-action-strip master-event-actions">${links.join("")}</div>`;
}

function decorateCard(card,event,day){
  const body=card.querySelector(":scope > div:nth-child(2)");if(!body||!event)return;
  if(!body.querySelector(":scope > .live-thumb")){
    const p=findPhoto(`${event.title} ${event.location}`);
    if(p?.url)body.insertAdjacentHTML("afterbegin",`<a class="live-thumb" href="${esc(p.page_url||p.url)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(p.url)}" alt="${esc(event.title)}"><span>공식 웹사이트 사진</span></a>`);
  }
  if(!body.querySelector(".event-official-weather"))body.insertAdjacentHTML("beforeend",weatherHtml(day,event));
  const existing=body.querySelector(".event-action-strip");
  if(existing)existing.outerHTML=eventActionHtml(event);else body.insertAdjacentHTML("beforeend",eventActionHtml(event));
}

function ensureTimelineUnified(){
  if(!isTimelineTab())return;
  const day=activeDay(),summary=document.querySelector(".day-summary");if(!summary)return;
  let board=document.querySelector(".unified-day-board");
  if(!board){board=document.createElement("section");board.className="unified-day-board";summary.after(board);}
  const key=`${uiState.itinerary}:${day.id}:${uiState.live?.generated_at||""}:${uiState.fares?.generated_at||""}`;
  if(board.dataset.masterKey!==key){board.dataset.masterKey=key;board.innerHTML=dailyBoardHtml(day);}
  const events=activePlan().officialSeed.events||[];
  document.querySelectorAll(".event-card[data-event-id]").forEach(card=>{
    const ev=events.find(e=>String(e.id)===String(card.dataset.eventId));if(ev)decorateCard(card,ev,day);
  });
}

function mapEventCard(event,day){
  return `<article class="event-card map-schedule-event" data-event-id="${esc(event.id)}" data-map-event-id="${esc(event.id)}"><div class="event-time">${esc(event.time_start||"")}${event.time_end?`<br>~ ${esc(event.time_end)}`:""}</div><div>${photoHtml(`${event.title} ${event.location}`,"live-thumb")}<div class="event-title">${event.category?`<span class="chip">${esc(event.category)}</span>`:""}<span>${esc(event.title)}</span></div><div class="meta">${event.location?`<span>📍 ${esc(event.location)}</span>`:""}${event.transport?`<span>🚗 ${esc(event.transport)}</span>`:""}${event.duration?`<span>⏱ ${esc(event.duration)}</span>`:""}</div>${event.min_cost_krw!=null?`<div class="cost"><b>₩${fmt(event.min_cost_krw)}~₩${fmt(event.max_cost_krw)}</b>${event.cost_basis?` <span>(${esc(event.cost_basis)})</span>`:""}</div>`:""}${event.notes?`<div class="notes">${esc(event.notes)}</div>`:""}${weatherHtml(day,event)}${eventActionHtml(event)}</div><div class="map-card-route-hint">누르면<br>지도 경로</div></article>`;
}

function ensureMapUnified(){
  if(!isMapTab())return;
  const day=activeDay(),main=document.querySelector("#main-content"),anchor=main?.querySelector(".legend")||main?.querySelector(".map-layout");if(!anchor)return;
  let section=main.querySelector(".map-schedule-section");
  if(!section){section=document.createElement("section");section.className="map-schedule-section";anchor.after(section);}
  const key=`${uiState.itinerary}:${day.id}:${uiState.live?.generated_at||""}:${uiState.fares?.generated_at||""}`;
  if(section.dataset.masterKey===key)return;
  section.dataset.masterKey=key;
  const events=(activePlan().officialSeed.events||[]).filter(e=>Number(e.day_id)===Number(day.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  section.innerHTML=`<div class="day-summary map-day-summary"><div class="day-summary-title"><h2>Day ${esc(day.id)} · ${esc(day.date)} ${esc(day.weekday)}</h2></div><p>${esc(day.cities)} · 숙박: ${esc(day.lodging)}</p><p>${esc(day.summary)}</p><p class="map-schedule-help">아래 일정 카드를 누르면 위 Google Maps가 해당 장소 또는 이동구간의 세부 경로로 바로 바뀝니다.</p></div><section class="unified-day-board">${dailyBoardHtml(day)}</section><div class="section-head"><h2>상세 일정 · 전체일정과 동일</h2><span>카드 클릭 → Google Maps 세부 경로</span></div><div class="cards map-schedule-cards">${events.map(e=>mapEventCard(e,day)).join("")}</div>`;
}

function eventById(id){return (activePlan().officialSeed.events||[]).find(e=>String(e.id)===String(id));}
function dispatchMapEvent(id){const event=eventById(id);if(event)document.dispatchEvent(new CustomEvent("trip:map-event",{detail:{event}}));}

async function refresh(){await loadData(true);document.querySelectorAll(".unified-day-board,.map-schedule-section").forEach(el=>delete el.dataset.masterKey);sync();}
async function sync(){
  await loadData(false);
  ensureTimelineUnified();
  ensureMapUnified();
}

document.addEventListener("click",event=>{
  const refreshButton=event.target.closest("[data-master-refresh]");if(refreshButton){event.preventDefault();refreshButton.disabled=true;refreshButton.textContent="조회 중…";refresh().finally(()=>{refreshButton.disabled=false;refreshButton.textContent="실시간 다시 읽기";});return;}
  const route=event.target.closest("[data-map-event-id]");if(route){
    const id=route.dataset.mapEventId;if(!id)return;
    if(!isMapTab())document.querySelector('#tabs [data-tab="map"]')?.click();
    setTimeout(()=>{dispatchMapEvent(id);document.querySelector("#map")?.scrollIntoView({behavior:"smooth",block:"center"});},220);
    return;
  }
  const place=event.target.closest("[data-map-place-query]");if(place){
    if(!isMapTab())document.querySelector('#tabs [data-tab="map"]')?.click();
    const query=place.dataset.mapPlaceQuery;
    setTimeout(()=>document.dispatchEvent(new CustomEvent("trip:map-place",{detail:{query}})),220);
  }
},true);

const observer=new MutationObserver(()=>{clearTimeout(observer._u);observer._u=setTimeout(sync,110);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",sync);
setInterval(()=>refresh(),600000);
