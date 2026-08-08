import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";
import { longRangeWeather } from "./weather-fallback.js?v=LIVE_TRAVEL_V12";

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
function dayById(id){return activePlan().officialSeed.days.find(d=>Number(d.id)===Number(id));}
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
  return rows.find(loc=>(loc.aliases||[]).some(a=>t.includes(norm(a))))||null;
}
function nearestHourly(loc,time){
  const rows=loc?.hourly||[];if(!rows.length)return[];
  const h=Number(String(time||"09:00").slice(0,2))||9;
  return rows.slice().sort((a,b)=>Math.abs(Number(String(a.time||"").slice(0,2))-h)-Math.abs(Number(String(b.time||"").slice(0,2))-h)).slice(0,3).sort((a,b)=>String(a.time).localeCompare(String(b.time)));
}
function fallbackWeatherHtml(f){
  return `<div class="event-official-weather"><div class="official-weather pending"><b>🌦 ${esc(f.label)} · 장기전망/9월 평균</b><span><strong>${esc(f.highC)}℃ / ${esc(f.lowC)}℃</strong> · ${esc(f.basis)} · 공식 단기예보가 나오면 자동 대체</span><div class="weather-source-links"><a href="${esc(f.sourceUrl)}" target="_blank" rel="noreferrer">월간 전망 ↗</a>${f.officialUrl?`<a href="${esc(f.officialUrl)}" target="_blank" rel="noreferrer">${esc(f.officialLabel)} ↗</a>`:""}</div></div></div>`;
}
function weatherHtml(day,event){
  const eventText=`${event?.title||""} ${event?.location||""} ${event?.transport||""}`;
  const loc=weatherLocation(day.date,eventText)||weatherLocation(day.date,day.cities||"");
  if(loc?.kind==="official_hourly"&&(loc.hourly||[]).length){
    const rows=nearestHourly(loc,event?.time_start);
    return `<div class="event-official-weather"><div class="official-weather"><b>🌦 ${esc(loc.city)} · ${esc(loc.authority)}</b><div class="hourly-strip">${rows.map(r=>`<span><strong>${esc(r.time)}</strong> ${esc(r.temperature_c)}℃${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div><a href="${esc(loc.source_url)}" target="_blank" rel="noreferrer">공식예보 원문 ↗</a></div></div>`;
  }
  const fallback=longRangeWeather(eventText)||longRangeWeather(day.cities)||longRangeWeather(`${loc?.city||""} ${(loc?.aliases||[]).join(" ")}`);
  if(fallback)return fallbackWeatherHtml(fallback);
  if(loc)return `<div class="event-official-weather"><div class="official-weather pending"><b>🌦 ${esc(loc.city)} · 공식 예보 발표 전</b><span>${esc(loc.reason||"공식 예보 범위 밖")}</span><a href="${esc(loc.source_url)}" target="_blank" rel="noreferrer">${esc(loc.authority)} 원문 ↗</a></div></div>`;
  return `<div class="event-official-weather"><div class="official-weather pending"><b>🌦 장기 날씨 기준 준비 중</b></div></div>`;
}

function flightFareId(row){
  const origin=String(row?.origin||"").match(/[A-Z]{3}/)?.[0]||"",destination=String(row?.destination||"").match(/[A-Z]{3}/)?.[0]||"";
  const ids={cost_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_direct","CPH-ICN":"route_f3"},time_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_direct","CPH-ICN":"route_f3"}};
  return ids[uiState.itinerary]?.[`${origin}-${destination}`]||null;
}
function fareFor(row){const id=flightFareId(row);return id?uiState.fares?.fares?.[id]:null;}
function airportCode(v){return String(v||"").match(/[A-Z]{3}/)?.[0]||"";}
function googleFlightUrl(f){
  const query=`Flights from ${airportCode(f.origin)||f.origin} to ${airportCode(f.destination)||f.destination} on ${f.date} one way economy 4 adults cheapest`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}&curr=KRW&hl=ko`;
}
function skyscannerUrl(f){
  const from=airportCode(f.origin).toLowerCase(),to=airportCode(f.destination).toLowerCase(),date=String(f.date||"").replaceAll("-","").slice(2);
  return from&&to&&date?`https://www.skyscanner.co.kr/transport/flights/${from}/${to}/${date}/?adultsv2=4&cabinclass=economy&rtn=0`:"https://www.skyscanner.co.kr/";
}
function googleHotelsUrl(h){
  const query=`${h.name} ${h.city||""} ${h.check_in} ${h.check_out} 4 adults ${h.rooms||2} rooms`;
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(query)}&hl=ko&curr=KRW`;
}
function flightForEvent(event){
  const flights=(activePlan().officialSeed.flights||[]).filter(x=>Number(x.day_id)===Number(event.day_id));
  if(!flights.length)return null;
  const title=String(event.title||"");
  return flights.find(x=>title.includes(airportCode(x.origin))||title.includes(airportCode(x.destination)))||flights[0];
}
function hotelForEvent(event){
  const seed=activePlan().officialSeed,day=dayById(event.day_id),text=norm(`${event.title||""} ${event.location||""}`);
  const hotels=seed.hotels||[];
  const named=hotels.find(x=>text.includes(norm(x.name))||norm(x.name).includes(text));if(named)return named;
  if(!/숙박|호텔|체크인|체크아웃|조식/i.test(`${event.category||""} ${event.title||""}`)||!day)return null;
  return hotels.find(h=>day.date>=h.check_in&&day.date<=h.check_out)||hotels.find(h=>day.date===h.check_in||day.date===h.check_out)||null;
}
function restaurantsForEvent(event){
  if(!/식사|점심|저녁|조식|맛집/i.test(`${event.category||""} ${event.title||""}`))return[];
  const rows=(activePlan().officialSeed.restaurants||[]).filter(x=>Number(x.day_id)===Number(event.day_id));
  if(!rows.length)return[];
  const text=norm(`${event.title||""} ${event.location||""}`),exact=rows.filter(x=>text.includes(norm(x.name))||norm(x.name).includes(text));
  return exact.length?exact:rows;
}

function eventActionHtml(event){
  const links=[];
  if(/항공/.test(event.category||"")){
    const f=flightForEvent(event);
    if(f){
      const fare=fareFor(f),google=fare?.query_url||googleFlightUrl(f);
      links.push(`<a class="btn small primary" href="${esc(google)}" target="_blank" rel="noreferrer">✈ Google Flights 최저가 비교 ↗</a>`);
      links.push(`<a class="btn small" href="${esc(skyscannerUrl(f))}" target="_blank" rel="noreferrer">Skyscanner 교차비교 ↗</a>`);
      if(fare?.selected?.total_krw)links.push(`<span class="ops-pay-note">최근 조회 4인 ₩${fmt(fare.selected.total_krw)}</span>`);
    }
  }
  const h=hotelForEvent(event);
  if(h)links.push(`<a class="btn small primary" href="${esc(googleHotelsUrl(h))}" target="_blank" rel="noreferrer">🏨 Google Hotels 최저가 비교 ↗</a>`);
  for(const r of restaurantsForEvent(event)){
    const m=MENU[r.name],url=m?.url||r.url;
    if(url)links.push(`<a class="btn small primary" href="${esc(url)}" target="_blank" rel="noreferrer">🍽 ${esc(r.name)} 메뉴·예약 ↗</a>`);
  }
  if(/교통|출국|환승/.test(event.category||"")&&event.booking_url&&!/google\.com\/travel\/flights/i.test(event.booking_url))links.push(`<a class="btn small primary" href="${esc(event.booking_url)}" target="_blank" rel="noreferrer">🚆 공식 시간표·예매 ↗</a>`);
  if(event.official_url)links.push(`<a class="btn small" href="${esc(event.official_url)}" target="_blank" rel="noreferrer">공식 사이트 ↗</a>`);
  links.push(`<button type="button" class="btn small map-route-action" data-map-event-id="${esc(event.id)}">🗺 지도에서 경로 표시</button>`);
  return `<div class="event-action-strip master-event-actions">${links.join("")}</div>`;
}

function decorateCard(card,event,day){
  const body=card.querySelector(":scope > div:nth-child(2)");if(!body||!event)return;
  if(!body.querySelector(":scope > .live-thumb")){
    const p=findPhoto(`${event.title} ${event.location}`);
    if(p?.url)body.insertAdjacentHTML("afterbegin",`<a class="live-thumb" href="${esc(p.page_url||p.url)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(p.url)}" alt="${esc(event.title)}"><span>공식 웹사이트 사진</span></a>`);
  }
  const weather=body.querySelector(".event-official-weather");
  if(weather)weather.outerHTML=weatherHtml(day,event);else body.insertAdjacentHTML("beforeend",weatherHtml(day,event));
  const existing=body.querySelector(".event-action-strip");
  if(existing)existing.outerHTML=eventActionHtml(event);else body.insertAdjacentHTML("beforeend",eventActionHtml(event));
}

function ensureTimelineUnified(){
  if(!isTimelineTab())return;
  document.querySelectorAll(".unified-day-board").forEach(el=>el.remove());
  const day=activeDay(),events=activePlan().officialSeed.events||[];
  document.querySelectorAll("#main-content .event-card[data-event-id]").forEach(card=>{
    const ev=events.find(e=>String(e.id)===String(card.dataset.eventId));if(ev)decorateCard(card,ev,day);
  });
}

function mapEventCard(event,day){
  return `<article class="event-card map-schedule-event" data-event-id="${esc(event.id)}" data-map-event-id="${esc(event.id)}"><div class="event-time">${esc(event.time_start||"")}${event.time_end?`<br>~ ${esc(event.time_end)}`:""}</div><div>${photoHtml(`${event.title} ${event.location}`,"live-thumb")}<div class="event-title">${event.category?`<span class="chip">${esc(event.category)}</span>`:""}<span>${esc(event.title)}</span></div><div class="meta">${event.location?`<span>📍 ${esc(event.location)}</span>`:""}${event.transport?`<span>🚗 ${esc(event.transport)}</span>`:""}${event.duration?`<span>⏱ ${esc(event.duration)}</span>`:""}</div>${event.min_cost_krw!=null?`<div class="cost"><b>₩${fmt(event.min_cost_krw)}~₩${fmt(event.max_cost_krw)}</b>${event.cost_basis?` <span>(${esc(event.cost_basis)})</span>`:""}</div>`:""}${event.notes?`<div class="notes">${esc(event.notes)}</div>`:""}${weatherHtml(day,event)}${eventActionHtml(event)}</div><div class="map-card-route-hint">누르면<br>경로 표시</div></article>`;
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
  section.innerHTML=`<div class="day-summary map-day-summary"><div class="day-summary-title"><h2>Day ${esc(day.id)} · ${esc(day.date)} ${esc(day.weekday)}</h2></div><p>${esc(day.cities)} · 숙박: ${esc(day.lodging)}</p><p>${esc(day.summary)}</p><p class="map-schedule-help">세부 일정 카드를 누르면 위 지도에 해당 이동구간 경로가 표시됩니다. 장소 일정은 직전 일정 위치에서 선택 장소까지의 경로를 계산합니다.</p></div><div class="section-head"><h2>상세 일정 · 전체일정과 동일</h2><span>카드 클릭 → 지도 경로 표시</span></div><div class="cards map-schedule-cards">${events.map(e=>mapEventCard(e,day)).join("")}</div>`;
}

function stableMapButton(id){return [...document.querySelectorAll("[data-stable-map-event]")].find(b=>String(b.dataset.stableMapEvent)===String(id));}
function openMapRoute(id){
  if(!isMapTab())document.querySelector('#tabs [data-tab="map"]')?.click();
  setTimeout(()=>{const b=stableMapButton(id);if(b)b.click();else document.querySelector("#map")?.scrollIntoView({behavior:"smooth",block:"center"});},260);
}

async function refresh(){await loadData(true);document.querySelectorAll(".map-schedule-section").forEach(el=>delete el.dataset.masterKey);sync();}
async function sync(){
  await loadData(false);
  ensureTimelineUnified();
  ensureMapUnified();
}

document.addEventListener("click",event=>{
  const refreshButton=event.target.closest("[data-master-refresh]");if(refreshButton){event.preventDefault();refreshButton.disabled=true;refreshButton.textContent="조회 중…";refresh().finally(()=>{refreshButton.disabled=false;refreshButton.textContent="실시간 다시 읽기";});return;}
  const route=event.target.closest("[data-map-event-id]");if(route){event.preventDefault();event.stopPropagation();const id=route.dataset.mapEventId;if(id)openMapRoute(id);}
},true);

const observer=new MutationObserver(()=>{clearTimeout(observer._u);observer._u=setTimeout(sync,110);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",sync);
sync();
