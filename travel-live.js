import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V5";

const LIVE_URL = "./trip-live.json";
const FARES_URL = "./flight-prices.json";
const TRANSITOUS_PLAN_URL = "https://api.transitous.org/api/v6/plan";
const state = { live:null, fares:null, loadedAt:0, itinerary:DEFAULT_ITINERARY };

const MENU = {
  "Chun Shui Tang Siwei Original Store": {items:["오리지널 버블 밀크티","대만식 면·딤섬류","차·간식"],note:"원조점. 당일 메뉴·가격은 공식 메뉴 확인",url:"https://www.chunshuitang.com.tw/en/location-detail/original_store/"},
  "Markthal Rotterdam": {items:["고다 치즈","키블링·해산물","중동·아시아·지중해 푸드스탠드"],note:"여러 점포를 한 장소에서 선택",url:"https://markthal.nl/en/food-spots/"},
  "Restaurant Bazar": {items:["중동·북아프리카 플래터","그릴·쿠스쿠스","메제·샐러드"],note:"공식 메뉴에서 당일 품목 확인",url:"https://restaurantbazar.nl/menukaart/"},
  "Oberhafen-Kantine": {items:["함부르크식 계절요리","북독일 가정식","계절 소규모 메뉴"],note:"계절·재고에 따라 변경",url:"https://www.oberhafenkantine-hamburg.de/portfolio-item/a-la-carte/"},
  "Esbjerg Street Food": {items:["버거·그릴","아시아·중동 스트리트푸드","맥주·간단식"],note:"입점 점포별 메뉴 선택",url:"https://esbjergstreetfood.dk/"},
  "Field's Food Court": {items:["덴마크·유럽 캐주얼","아시아 음식","버거·샐러드·카페"],note:"4인이 각자 선택하기 편한 푸드코트",url:"https://fields.steenstrom.dk/"},
  "Wuqi Fishing Harbor": {items:["제철 해산물","생선·조개구이","대만식 해산물 간식"],note:"당일 어획·점포별 가격 차이 큼",url:"https://travel.taichung.gov.tw/en"},
};

const esc = v => String(v ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const normalize = s => String(s||"").toLowerCase().replace(/[^a-z0-9가-힣]+/g," ").trim();
const fmt = n => new Intl.NumberFormat("ko-KR").format(Math.round(Number(n)||0));

async function loadLive(force=false){
  if(!force && state.live && Date.now()-state.loadedAt<300000)return state.live;
  try{
    const r=await fetch(`${LIVE_URL}?ts=${Date.now()}`,{cache:"no-store"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    state.live=await r.json();
    state.loadedAt=Date.now();
  }catch(err){ console.warn("trip-live.json load failed",err); }
  return state.live;
}

async function loadFares(force=false){
  if(!force && state.fares && Date.now()-state.loadedAt<300000)return state.fares;
  try{
    const r=await fetch(`${FARES_URL}?ts=${Date.now()}`,{cache:"no-store"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    state.fares=await r.json();
  }catch(err){ console.warn("flight-prices.json load failed",err); }
  return state.fares;
}

function currentItinerary(){
  const active=document.querySelector(".itinerary-tab.active");
  const key=active?.dataset?.itinerary;
  if(key && ITINERARIES[key])state.itinerary=key;
  return ITINERARIES[state.itinerary]||ITINERARIES[DEFAULT_ITINERARY];
}

function currentDayId(){
  const active=document.querySelector("[data-day].active");
  return active?Number(active.dataset.day):null;
}

function currentDay(){
  const plan=currentItinerary();
  return plan.officialSeed.days.find(d=>Number(d.id)===Number(currentDayId()))||plan.officialSeed.days[0];
}

function flightFareId(row){
  const origin=String(row?.origin||"").match(/[A-Z]{3}/)?.[0]||"";
  const destination=String(row?.destination||"").match(/[A-Z]{3}/)?.[0]||"";
  const maps={
    cost_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_save","CPH-ICN":"route_f3"},
    time_optimized:{"ICN-RMQ":"route_f1","TPE-AMS":"route_f2_direct","CPH-ICN":"route_f3"},
  };
  return maps[state.itinerary]?.[`${origin}-${destination}`]||null;
}

function fareForFlight(row){
  const id=flightFareId(row);
  return id?state.fares?.fares?.[id]:null;
}

function hotelBookingUrl(h){
  return `https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(`${h.name} ${h.city}`)}&checkin=${h.check_in}&checkout=${h.check_out}&group_adults=4&no_rooms=${h.rooms||2}&group_children=0&selected_currency=KRW`;
}

function findPhoto(text){
  const t=normalize(text), photos=state.live?.photos||{};
  for(const [name,p] of Object.entries(photos)){
    const n=normalize(name);
    if(n && (t.includes(n)||n.includes(t)))return p;
  }
  return null;
}

function photoHtml(name,cls="ops-photo"){
  const p=findPhoto(name);
  if(!p?.url)return "";
  return `<a class="${cls}" href="${esc(p.page_url||p.url)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(p.url)}" alt="${esc(name)}"><span>공식 웹사이트 사진</span></a>`;
}

function matchingWeatherLocation(date,text=""){
  const bundle=state.live?.weather?.[date];
  const locations=bundle?.locations||[];
  if(!locations.length)return null;
  const target=normalize(text);
  return locations.find(loc=>(loc.aliases||[]).some(a=>target.includes(normalize(a))))||locations[0];
}

function nearestHourly(loc,time){
  const rows=loc?.hourly||[];
  if(!rows.length)return [];
  const hour=Number(String(time||"09:00").slice(0,2))||9;
  return rows.slice().sort((a,b)=>Math.abs(Number(a.time?.slice(0,2))-hour)-Math.abs(Number(b.time?.slice(0,2))-hour)).slice(0,3).sort((a,b)=>String(a.time).localeCompare(String(b.time)));
}

function officialWeatherHtml(loc,time,compact=false){
  if(!loc)return `<div class="official-weather pending">공식 기상예보 소스 확인 중</div>`;
  const link=`<a href="${esc(loc.source_url)}" target="_blank" rel="noreferrer">${esc(loc.authority)} 원문 ↗</a>`;
  if(loc.kind!=="official_hourly" || !(loc.hourly||[]).length){
    return `<div class="official-weather pending"><b>🌦 ${esc(loc.city)} · 공식 시간대별 예보 미발표</b><span>${esc(loc.reason||"공식 예보 범위 밖")}</span>${link}</div>`;
  }
  const rows=nearestHourly(loc,time);
  return `<div class="official-weather"><b>🌦 ${esc(loc.city)} · ${esc(loc.authority)}</b><div class="hourly-strip">${rows.map(r=>`<span><strong>${esc(r.time)}</strong> ${esc(r.temperature_c)}℃${r.precip_probability_pct!=null?` · 비 ${esc(r.precip_probability_pct)}%`:""}${r.wind_speed!=null?` · 풍속 ${esc(r.wind_speed)}`:""}</span>`).join("")}</div>${compact?"":link}</div>`;
}

function enhanceWeather(){
  const box=document.querySelector(".day-summary");
  if(!box)return;
  const day=currentDay(), date=day?.date;
  if(!date)return;
  let host=box.querySelector(".official-day-weather");
  if(!host){host=document.createElement("div");host.className="official-day-weather";box.append(host);}
  const locations=state.live?.weather?.[date]?.locations||[];
  host.innerHTML=locations.map(loc=>officialWeatherHtml(loc,"09:00")).join("");
}

function matchPlanEvent(card){
  const plan=currentItinerary(), dayId=currentDayId();
  const title=normalize(card.querySelector(".event-title")?.textContent||"");
  return (plan.officialSeed.events||[]).filter(e=>Number(e.day_id)===Number(dayId)).find(e=>{
    const t=normalize(e.title);return t && (title.includes(t)||t.includes(title));
  })||null;
}

function enhanceEventWeather(){
  const day=currentDay(); if(!day)return;
  document.querySelectorAll(".event-card").forEach(card=>{
    if(card.querySelector(".event-official-weather"))return;
    const ev=matchPlanEvent(card);
    const text=`${ev?.title||card.textContent} ${ev?.location||""}`;
    const loc=matchingWeatherLocation(day.date,text);
    const div=document.createElement("div");div.className="event-official-weather";
    div.innerHTML=officialWeatherHtml(loc,ev?.time_start||card.querySelector(".event-time")?.textContent||"09:00",true);
    card.querySelector(":scope > div:nth-child(2)")?.append(div);
  });
}

function flightOpsCard(f){
  const fare=fareForFlight(f), selected=fare?.selected, live=selected?.total_krw;
  const booking=fare?.query_url||f.url;
  return `<article class="ops-card">${photoHtml(f.origin==="ICN"?"Copenhagen Airport":f.destination==="AMS"?"Schiphol Airport":"Copenhagen Airport")}<div><span class="ops-kicker">항공</span><b>${esc(f.flight_no)} · ${esc(f.origin)}→${esc(f.destination)}</b><small>${esc(f.depart_time)} → ${esc(f.arrive_time)} · ${esc(f.status)}</small>${live?`<strong>4인 ₩${fmt(live)} · 1인 ₩${fmt(selected.per_person_krw)}</strong>`:`<strong>현재가 자동조회 중</strong>`}<div class="ops-actions"><a class="btn small primary" href="${esc(booking)}" target="_blank" rel="noreferrer">현재가·예약 ↗</a><a class="btn small" href="${esc(f.url)}" target="_blank" rel="noreferrer">항공사 공식 ↗</a></div></div></article>`;
}

function hotelOpsCard(h){
  return `<article class="ops-card">${photoHtml(h.name)}<div><span class="ops-kicker">숙박</span><b>${esc(h.name)}</b><small>${esc(h.check_in)}→${esc(h.check_out)} · ${h.rooms||2}실 · ${esc(h.status)}</small><strong>4인 ${h.min_krw?`₩${fmt(h.min_krw)}~₩${fmt(h.max_krw)}`:"현재가 확인"}</strong><div class="ops-actions"><a class="btn small primary" href="${esc(hotelBookingUrl(h))}" target="_blank" rel="noreferrer">Booking 현재가·결제 ↗</a><a class="btn small" href="${esc(h.url)}" target="_blank" rel="noreferrer">호텔 공식 ↗</a></div></div></article>`;
}

function transportOpsCard(e){
  return `<article class="ops-card compact"><div><span class="ops-kicker">교통</span><b>${esc(e.title)}</b><small>${esc(e.time_start||"")} · ${esc(e.transport||"")} · ${esc(e.duration||"")}</small>${e.min_cost_krw!=null?`<strong>4인 ₩${fmt(e.min_cost_krw)}~₩${fmt(e.max_cost_krw)}</strong>`:""}${e.booking_url?`<div class="ops-actions"><a class="btn small primary" href="${esc(e.booking_url)}" target="_blank" rel="noreferrer">실시간 시간표·예매 ↗</a></div>`:""}</div></article>`;
}

function restaurantOpsCard(r){
  const m=MENU[r.name];
  return `<article class="ops-card">${photoHtml(r.name)}<div><span class="ops-kicker">맛집</span><b>${esc(r.name)}</b><small>${esc(r.meal_type)} · 1인 ${esc(r.price_per_person)}</small>${m?`<div class="ops-menu"><b>추천</b> ${m.items.map(esc).join(" · ")}<br><span>${esc(m.note)}</span></div>`:""}<div class="ops-actions"><a class="btn small primary" href="${esc(m?.url||r.url)}" target="_blank" rel="noreferrer">${m?"메뉴·예약":"공식·예약"} ↗</a></div></div></article>`;
}

function enhanceUnifiedTimeline(){
  const summary=document.querySelector(".day-summary");
  if(!summary||document.querySelector(".unified-day-board"))return;
  const plan=currentItinerary(), day=currentDay(); if(!day)return;
  const seed=plan.officialSeed, date=day.date, dayId=Number(day.id);
  const flights=(seed.flights||[]).filter(x=>Number(x.day_id)===dayId);
  const hotels=(seed.hotels||[]).filter(h=>date>=h.check_in && date<h.check_out || Number(h.day_id)===dayId && h.check_in===date);
  const transport=(seed.events||[]).filter(e=>Number(e.day_id)===dayId && /교통|항공|출국|환승/.test(String(e.category||""))).slice(0,6);
  const restaurants=(seed.restaurants||[]).filter(r=>Number(r.day_id)===dayId);
  const board=document.createElement("section"); board.className="unified-day-board";
  board.innerHTML=`<div class="section-head"><h2>오늘의 예약·이동·식사 한눈에</h2><button class="btn small" id="unified-refresh">실시간 다시 읽기</button></div>
    <div class="ops-groups">
      ${flights.length?`<section><h3>✈ 항공</h3>${flights.map(flightOpsCard).join("")}</section>`:""}
      ${hotels.length?`<section><h3>🏨 숙박</h3>${hotels.map(hotelOpsCard).join("")}</section>`:""}
      ${transport.length?`<section><h3>🚆 교통·렌터카 판단</h3>${transport.map(transportOpsCard).join("")}<p class="ops-note">렌터카는 기존 비용·편도반납·주차 조건상 비추천 구간이 많아, 실제 채택 교통을 우선 표시합니다.</p></section>`:""}
      ${restaurants.length?`<section><h3>🍽 맛집·메뉴</h3>${restaurants.map(restaurantOpsCard).join("")}</section>`:""}
    </div>`;
  summary.after(board);
  board.querySelector("#unified-refresh")?.addEventListener("click",async e=>{
    const b=e.currentTarget;b.disabled=true;b.textContent="조회 중…";
    await Promise.all([loadLive(true),loadFares(true)]);
    b.disabled=false;b.textContent="실시간 다시 읽기";
    board.remove();document.querySelectorAll(".event-official-weather,.event-action-strip,.live-thumb").forEach(el=>el.remove());
    enhanceAll();
  });
}

function enhanceEventActions(){
  const plan=currentItinerary(), dayId=currentDayId();
  document.querySelectorAll(".event-card").forEach(card=>{
    if(card.querySelector(".event-action-strip"))return;
    const ev=matchPlanEvent(card); if(!ev)return;
    const strip=document.createElement("div");strip.className="event-action-strip";
    const links=[];
    if(/항공/.test(ev.category||"")){
      const f=(plan.officialSeed.flights||[]).find(x=>Number(x.day_id)===Number(dayId) && (String(ev.title).includes(x.origin)||String(ev.title).includes(x.destination)));
      const fare=f&&fareForFlight(f); if(f)links.push(["항공 현재가·예약",fare?.query_url||f.url,"primary"]);
    }
    if(/숙박/.test(ev.category||"") || /호텔|CABINN|Holiday Inn|Motel One/i.test(ev.location||"")){
      const h=(plan.officialSeed.hotels||[]).find(x=>normalize(ev.location).includes(normalize(x.name))||normalize(x.name).includes(normalize(ev.location)));
      if(h){links.push(["객실 현재가·결제",hotelBookingUrl(h),"primary"]);links.push(["호텔 공식",h.url,""]);}
    }
    if(/식사/.test(ev.category||"")){
      const r=(plan.officialSeed.restaurants||[]).filter(x=>Number(x.day_id)===Number(dayId)).find(x=>normalize(ev.title).includes(normalize(x.name))||normalize(ev.location).includes(normalize(x.city)));
      if(r){const m=MENU[r.name];links.push([m?"메뉴·예약":"식당 확인",m?.url||r.url,"primary"]);}
    }
    if(/교통|출국|환승/.test(ev.category||"") && ev.booking_url)links.push(["시간표·예매",ev.booking_url,"primary"]);
    if(ev.official_url)links.push(["공식 사이트",ev.official_url,""]);
    if(!links.length)return;
    strip.innerHTML=links.map(([label,url,type])=>`<a class="btn small ${type}" href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`).join("");
    card.querySelector(":scope > div:nth-child(2)")?.append(strip);
  });
}

function enhancePhotos(){
  document.querySelectorAll(".event-card").forEach(card=>{
    const body=card.querySelector(":scope > div:nth-child(2)"); if(!body||body.querySelector(":scope > .live-thumb"))return;
    const text=`${card.querySelector(".event-title")?.textContent||""} ${card.querySelector(".meta")?.textContent||""}`;
    const p=findPhoto(text); if(!p?.url)return;
    const fig=document.createElement("a");fig.className="live-thumb";fig.href=p.page_url||p.url;fig.target="_blank";fig.rel="noreferrer";
    fig.innerHTML=`<img loading="lazy" src="${esc(p.url)}" alt="${esc(text)}"><span>공식 웹사이트</span>`;body.prepend(fig);
  });
}

function installLeafletCapture(){
  const L=window.L;if(!L||L.__tripLivePatched)return;
  L.__tripLivePatched=true;
  const mapFactory=L.map.bind(L), markerFactory=L.marker.bind(L);
  L.map=(...args)=>{const map=mapFactory(...args);window.__tripLiveMap=map;window.__tripLiveMarkers=[];window.__tripDetailedRouteGroup=null;return map;};
  L.marker=(latlng,...args)=>{const marker=markerFactory(latlng,...args);(window.__tripLiveMarkers||(window.__tripLiveMarkers=[])).push(marker);return marker;};
}

function routePointsForCurrentView(){
  const plan=currentItinerary(), day=currentDayId();
  return (plan.officialSeed.map_points||[]).filter(p=>!day||Number(p.day_id)===Number(day)).sort((a,b)=>Number(a.day_id)-Number(b.day_id)||Number(a.sort_order)-Number(b.sort_order));
}

function isTransitSegment(type){return ["subway","rail","hsr"].includes(type);}
function transitousSupported(a,b){return [a,b].every(p=>Number(p?.lat)>45&&Number(p?.lat)<60&&Number(p?.lng)>-5&&Number(p?.lng)<20);}
function tripDate(dayId){const plan=currentItinerary();return plan.officialSeed.days.find(d=>Number(d.id)===Number(dayId))?.date||"2026-09-01";}
function plannedTime(a,b){return `${a?.popup||""} ${b?.popup||""}`.match(/\b([01]\d|2[0-3]):[0-5]\d\b/)?.[0]||"09:00";}

function decodePolyline(encoded,precision=6){
  if(!encoded)return[];let index=0,lat=0,lng=0;const out=[],factor=Math.pow(10,Number(precision)||6);
  while(index<encoded.length){let result=0,shift=0,b;do{b=encoded.charCodeAt(index++)-63;result|=(b&0x1f)<<shift;shift+=5;}while(b>=0x20&&index<=encoded.length);lat+=(result&1)?~(result>>1):(result>>1);result=0;shift=0;do{b=encoded.charCodeAt(index++)-63;result|=(b&0x1f)<<shift;shift+=5;}while(b>=0x20&&index<=encoded.length);lng+=(result&1)?~(result>>1):(result>>1);out.push([lat/factor,lng/factor]);}
  return out;
}

function ensureDetailedGroup(map){
  if(window.__tripDetailedRouteGroup)map.removeLayer(window.__tripDetailedRouteGroup);
  window.__tripDetailedRouteGroup=window.L.layerGroup().addTo(map);return window.__tripDetailedRouteGroup;
}

async function drawRoadSegment(group,a,b){
  const url=`https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
  const r=await fetch(url),json=await r.json(),route=json.routes?.[0];
  if(!route)return[];
  const layer=window.L.geoJSON(route.geometry,{style:{weight:6,opacity:.78}}).addTo(group);layer.bindTooltip(`${a.name} → ${b.name} · ${Math.round(route.distance/1000)}km · 약 ${Math.round(route.duration/60)}분`);
  return route.geometry.coordinates.map(([lng,lat])=>[lat,lng]);
}

async function drawTransitSegment(group,a,b){
  if(!transitousSupported(a,b))return[];
  const params=new URLSearchParams({fromPlace:`${a.lat},${a.lng}`,toPlace:`${b.lat},${b.lng}`,time:`${tripDate(b.day_id)}T${plannedTime(a,b)}:00+02:00`,transitModes:"TRANSIT",directModes:"",detailedLegs:"true",detailedTransfers:"true",maxItineraries:"3",language:"en"});
  const r=await fetch(`${TRANSITOUS_PLAN_URL}?${params.toString()}`,{headers:{Accept:"application/json"}});if(!r.ok)throw new Error(`Transitous ${r.status}`);
  const data=await r.json(),itinerary=(data.itineraries||[])[0];if(!itinerary?.legs?.length)return[];
  const bounds=[];
  itinerary.legs.forEach(leg=>{const g=leg.legGeometry||{},pts=decodePolyline(g.points,g.precision);if(pts.length>1){const raw=String(leg.routeColor||"").replace("#","");const opt={weight:6,opacity:.86};if(/^[0-9a-fA-F]{6}$/.test(raw))opt.color=`#${raw}`;window.L.polyline(pts,opt).bindTooltip(`${leg.displayName||leg.routeShortName||leg.mode||"Transit"} · ${leg.from?.name||""} → ${leg.to?.name||""}`).addTo(group);bounds.push(...pts);}});
  return bounds;
}

async function drawDetailedRoutes(focusIndex=null){
  const map=window.__tripLiveMap, pts=routePointsForCurrentView();if(!map||pts.length<2)return;
  const group=ensureDetailedGroup(map), bounds=[];
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1],b=pts[i];if(Number(a.day_id)!==Number(b.day_id))continue;
    if(focusIndex!=null && i!==focusIndex)continue;
    try{
      let segment=[];
      if(b.segment_type==="car")segment=await drawRoadSegment(group,a,b);
      else if(isTransitSegment(b.segment_type))segment=await drawTransitSegment(group,a,b);
      if(segment.length)bounds.push(...segment);
    }catch(err){console.warn("internal route detail failed",a.name,b.name,err);}
  }
  if(bounds.length>1)map.fitBounds(bounds,{padding:[28,28],maxZoom:15});
}

function enhanceMap(){
  const host=document.querySelector("#route-list"),map=window.__tripLiveMap,markers=window.__tripLiveMarkers||[];if(!host||!map||!markers.length)return;
  const stops=[...host.querySelectorAll(".route-stop")],pts=routePointsForCurrentView();if(stops.length!==markers.length||pts.length!==stops.length)return;
  stops.forEach((stop,i)=>{
    if(stop.dataset.liveBound)return;stop.dataset.liveBound="1";stop.classList.add("live-route-stop");
    const p=pts[i],prev=pts[i-1],marker=markers[i];
    if(i>0&&Number(prev.day_id)===Number(p.day_id)){
      const row=document.createElement("div");row.className="live-route-actions";
      const exact=isTransitSegment(p.segment_type)&&!transitousSupported(prev,p)?"대만 대중교통은 현재 지도 내 개략선":"실제 경로 상세";
      row.innerHTML=`<span class="line-badge">${esc(p.segment_type||"car")}</span><button type="button" class="transit-map-btn">🗺 ${exact}</button>`;
      stop.querySelector("div:last-child")?.append(row);
      row.querySelector("button")?.addEventListener("click",e=>{e.stopPropagation();drawDetailedRoutes(i);});
    }
    stop.addEventListener("click",e=>{if(e.target.closest("button,a"))return;stops.forEach(x=>x.classList.remove("route-selected"));stop.classList.add("route-selected");const ll=marker.getLatLng();map.flyTo(ll,Math.max(map.getZoom(),13),{duration:.6});marker.openPopup();if(i>0)drawDetailedRoutes(i);});
    marker.on("click",()=>{stops.forEach(x=>x.classList.remove("route-selected"));stop.classList.add("route-selected");stop.scrollIntoView({behavior:"smooth",block:"nearest"});if(i>0)drawDetailedRoutes(i);});
  });
  if(!host.querySelector(".map-live-note")){
    const note=document.createElement("div");note.className="map-live-note";note.innerHTML="<b>외부 지도 없이 이 화면에서 경로를 확인합니다.</b> 자동차는 OSRM 실제 도로선, 유럽 철도·지하철·버스는 Transitous/MOTIS GTFS 형상을 지도 안에 직접 그립니다. 대만 THSR/Airport MRT는 공개 라우팅 소스가 없어 현재 일정 지점 연결선으로 표시하며, 외부 Google Maps 이동은 제거했습니다.";host.prepend(note);
  }
  if(!host.dataset.autoDetailed){host.dataset.autoDetailed="1";drawDetailedRoutes();}
}

function enhanceReturnStopover(){
  if(currentDayId()!==10)return;
  const board=document.querySelector(".unified-day-board");if(!board||board.querySelector(".return-stopover-panel"))return;
  const s=state.live?.return_stopover;if(!s)return;
  const panel=document.createElement("section");panel.className=`return-stopover-panel ${s.recommended?"recommended":"hold"}`;
  panel.innerHTML=s.recommended?`<h3>✈ 귀국 관광경유 후보</h3><p><b>${esc(s.via_city)} (${esc(s.via_airport)})</b> · 경유 ${esc(s.layover_hours)}시간 · 4인 ₩${fmt(s.total_krw)}</p><p>${esc(s.sightseeing_plan)}</p><a class="btn small primary" href="${esc(s.query_url)}" target="_blank" rel="noreferrer">항공 예약 후보 ↗</a>`:`<h3>✈ 귀국 경유 자동비교</h3><p>관광시간까지 확보하면서 현재 귀국편보다 싼 후보가 없어 기존 편 유지.</p><small>${esc(s.reason||"")}</small>`;
  board.append(panel);
}

async function enhanceAll(){
  await Promise.all([loadLive(false),loadFares(false)]);
  currentItinerary();
  enhanceWeather();enhanceUnifiedTimeline();enhanceEventWeather();enhanceEventActions();enhancePhotos();enhanceMap();enhanceReturnStopover();
}

installLeafletCapture();
const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(enhanceAll,90);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",enhanceAll);
setInterval(()=>Promise.all([loadLive(true),loadFares(true)]).then(enhanceAll),600000);
