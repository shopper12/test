import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V3";

const LIVE_URL = "./trip-live.json";
const state = { live: null, loadedAt: 0, itinerary: DEFAULT_ITINERARY };
const PHOTO_CACHE = new Map();

const MENU = {
  "Chun Shui Tang Siwei Original Store": { items:["오리지널 버블 밀크티","대만식 면·딤섬류","차·간식"], note:"원조점. 공식 메뉴 버튼에서 당일 품목·가격 확인", url:"https://www.chunshuitang.com.tw/en/location-detail/original_store/" },
  "Markthal Rotterdam": { items:["네덜란드 치즈·고다","해산물·키블링","중동·아시아·지중해 푸드스탠드"], note:"여러 식당을 한 장소에서 선택", url:"https://markthal.nl/en/food-spots/" },
  "Restaurant Bazar": { items:["중동·북아프리카 플래터","그릴·쿠스쿠스류","메제·샐러드"], note:"공식 다국어 메뉴 확인", url:"https://restaurantbazar.nl/menukaart/" },
  "Oberhafen-Kantine": { items:["함부르크식 계절요리","북독일 가정식","계절별 소규모 메뉴"], note:"계절·재고에 따라 메뉴 변경", url:"https://www.oberhafenkantine-hamburg.de/portfolio-item/a-la-carte/" },
  "Esbjerg Street Food": { items:["버거·그릴","아시아·중동 스트리트푸드","맥주·간단식"], note:"입점 점포는 변동 가능. 현장 메뉴 확인", url:"https://www.google.com/maps/search/?api=1&query=Esbjerg+Street+Food" },
  "Field's Food Court": { items:["덴마크·유럽 캐주얼","아시아 음식","버거·샐러드·카페"], note:"출장 4인이 각자 선택하기 편한 푸드코트", url:"https://fields.steenstrom.dk/" },
  "Wuqi Fishing Harbor": { items:["제철 해산물","생선·조개구이","대만식 해산물 간식"], note:"당일 어획·점포별 가격 차이 큼", url:"https://www.google.com/maps/search/?api=1&query=Wuqi+Fishing+Harbor" },
};

function googleDirections(a,b,mode="driving"){
  if(!a||!b)return "#";
  const origin=`${a.lat},${a.lng}`, destination=`${b.lat},${b.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}&dir_action=navigate`;
}

function currentItinerary(){
  const active=document.querySelector(".itinerary-tab.active");
  const key=active?.dataset?.itinerary;
  state.itinerary=ITINERARIES[key]?key:state.itinerary;
  return ITINERARIES[state.itinerary]||ITINERARIES[DEFAULT_ITINERARY];
}

async function loadLive(force=false){
  if(!force && state.live && Date.now()-state.loadedAt<300000)return state.live;
  try{
    const r=await fetch(`${LIVE_URL}?ts=${Date.now()}`,{cache:"no-store"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    state.live=await r.json(); state.loadedAt=Date.now();
  }catch(err){ console.warn("trip-live.json load failed",err); }
  return state.live;
}

function installLeafletCapture(){
  const L=window.L;
  if(!L || L.__tripLivePatched)return;
  L.__tripLivePatched=true;
  const mapFactory=L.map.bind(L), markerFactory=L.marker.bind(L);
  L.map=(...args)=>{
    const map=mapFactory(...args);
    window.__tripLiveMap=map;
    window.__tripLiveMarkers=[];
    return map;
  };
  L.marker=(latlng,...args)=>{
    const marker=markerFactory(latlng,...args);
    (window.__tripLiveMarkers||(window.__tripLiveMarkers=[])).push(marker);
    return marker;
  };
}

function routePointsForCurrentView(){
  const plan=currentItinerary();
  const dayButton=document.querySelector("[data-day].active");
  const activeDay=dayButton?Number(dayButton.dataset.day):null;
  const pts=(plan.officialSeed.map_points||[]).filter(p=>!activeDay||Number(p.day_id)===activeDay)
    .sort((a,b)=>Number(a.day_id)-Number(b.day_id)||Number(a.sort_order)-Number(b.sort_order));
  return pts;
}

function modeForSegment(type){
  if(type==="car")return "driving";
  if(["subway","rail","hsr"].includes(type))return "transit";
  return "walking";
}

function transportLabel(type,a,b){
  const text=`${a?.name||""} ${b?.name||""}`;
  if(type==="hsr")return "THSR 고속철도";
  if(/Taoyuan Airport/.test(text)&&type==="subway")return "Airport MRT";
  if(/Schiphol|Rotterdam Centraal/.test(text)&&type==="rail")return "NS Intercity / IC Direct";
  if(/Rotterdam/.test(text)&&type==="subway")return "RET Metro·Tram·Waterbus 실시간 경로";
  if(/Hamburg/.test(text)&&type==="subway")return "HVV U-Bahn·S-Bahn·Bus 실시간 경로";
  if(/Esbjerg/.test(text)&&type==="subway")return "Sydtrafik 버스·도보 실시간 경로";
  if(/Copenhagen|CABINN Metro/.test(text)&&type==="subway")return "DSB·Metro·Øresund 실시간 경로";
  if(type==="rail")return "국제·도시간 철도";
  if(type==="car")return "Google Maps 최적 자동차 내비";
  return type;
}

function enhanceMap(){
  const host=document.querySelector("#route-list");
  const map=window.__tripLiveMap, markers=window.__tripLiveMarkers||[];
  if(!host||!map||!markers.length)return;
  const stops=[...host.querySelectorAll(".route-stop")];
  const pts=routePointsForCurrentView();
  if(stops.length!==markers.length || pts.length!==stops.length)return;
  stops.forEach((stop,i)=>{
    if(stop.dataset.liveBound)return;
    stop.dataset.liveBound="1";
    const p=pts[i], prev=pts[i-1], marker=markers[i];
    stop.classList.add("live-route-stop");
    if(i>0 && Number(prev.day_id)===Number(p.day_id)){
      const mode=modeForSegment(p.segment_type);
      const row=document.createElement("div"); row.className="live-route-actions";
      row.innerHTML=`<span class="line-badge">${transportLabel(p.segment_type,prev,p)}</span><a target="_blank" rel="noreferrer" href="${googleDirections(prev,p,mode)}">${mode==="driving"?"🚗 내비 시작":"🚇 실제 노선·시간표"} ↗</a>`;
      stop.querySelector("div:last-child")?.append(row);
    }
    stop.addEventListener("click",e=>{
      if(e.target.closest("a"))return;
      stops.forEach(x=>x.classList.remove("route-selected")); stop.classList.add("route-selected");
      const ll=marker.getLatLng();
      map.flyTo(ll,Math.max(map.getZoom(),13),{duration:.75}); marker.openPopup();
    });
    marker.on("click",()=>{
      stops.forEach(x=>x.classList.remove("route-selected")); stop.classList.add("route-selected");
      stop.scrollIntoView({behavior:"smooth",block:"nearest"});
    });
  });
  if(!host.querySelector(".map-live-note")){
    const note=document.createElement("div"); note.className="map-live-note";
    note.innerHTML="자동차는 대시보드 안에서 OSRM 실제 도로선을 표시합니다. 철도·지하철·버스는 <b>실제 노선·시간표</b>를 누르면 해당 출발·도착점으로 Google Maps 실시간 대중교통 경로가 열립니다. 장소/핀을 누르면 지도 카메라와 일정 목록이 함께 이동합니다.";
    host.prepend(note);
  }
}

function weatherForDate(date){ return state.live?.weather?.[date]||null; }
function weatherCardHtml(w,date){
  if(!w)return `<div class="weather-live pending">🌦 ${date} 예보 자동갱신 대기 · 출발 16일 전부터 실제 일별 예보로 전환</div>`;
  const status=w.kind==="forecast"?"실제 예보":"평년 참고";
  return `<div class="weather-live"><b>🌦 ${w.city} · ${date} ${status}</b><span>${w.summary||""} · ${w.temp_min_c??"?"}~${w.temp_max_c??"?"}℃ · 강수 ${w.precip_probability_pct??"?"}% · 바람 ${w.wind_max_kmh??"?"}km/h</span><span>👕 ${w.clothing||"얇은 겉옷 준비"} ${w.umbrella?"☂ 우산 휴대":""}</span></div>`;
}

function enhanceWeather(){
  const box=document.querySelector(".day-summary"); if(!box)return;
  const h=box.querySelector("h2")?.textContent||"";
  const date=h.match(/20\d{2}-\d{2}-\d{2}/)?.[0]; if(!date)return;
  let target=box.querySelector(".weather-live");
  const html=weatherCardHtml(weatherForDate(date),date);
  if(target){ target.outerHTML=html; } else box.insertAdjacentHTML("beforeend",html);
}

function normalize(s){return String(s||"").toLowerCase().replace(/[^a-z0-9가-힣]+/g," ");}
function findPhoto(text){
  const photos=state.live?.photos||{}; const t=normalize(text);
  let best=null;
  for(const [key,p] of Object.entries(photos)){
    const aliases=[key,...(p.aliases||[])].map(normalize);
    if(aliases.some(a=>a && (t.includes(a)||a.includes(t)))){ best=p; break; }
  }
  return best;
}

function addThumb(el,text){
  if(!el||el.querySelector(":scope > .live-thumb"))return;
  const p=findPhoto(text); if(!p?.url)return;
  const fig=document.createElement("a"); fig.className="live-thumb"; fig.href=p.page_url||p.url; fig.target="_blank"; fig.rel="noreferrer";
  fig.innerHTML=`<img loading="lazy" src="${p.url}" alt="${text}"><span>${p.credit||"Wikimedia Commons"}</span>`;
  el.prepend(fig);
}

function enhancePhotos(){
  document.querySelectorAll(".event-card").forEach(card=>{
    const title=card.querySelector(".event-title")?.textContent||"";
    const meta=card.querySelector(".meta")?.textContent||"";
    addThumb(card.querySelector(":scope > div:nth-child(2)"),`${title} ${meta}`);
  });
  document.querySelectorAll(".data-table tbody tr").forEach(row=>{
    const text=row.textContent||""; const p=findPhoto(text); if(!p?.url||row.querySelector(".table-thumb"))return;
    const td=row.querySelector("td:nth-child(2)")||row.querySelector("td:first-child");
    if(!td)return; td.insertAdjacentHTML("afterbegin",`<a class="table-thumb" href="${p.page_url||p.url}" target="_blank" rel="noreferrer"><img loading="lazy" src="${p.url}" alt="${text.slice(0,80)}"></a>`);
  });
}

function enhanceMenus(){
  document.querySelectorAll(".data-table tbody tr").forEach(row=>{
    const cells=row.querySelectorAll("td"); if(cells.length<3)return;
    const text=row.textContent||"";
    const match=Object.entries(MENU).find(([name])=>text.includes(name));
    if(!match||row.querySelector(".menu-tip"))return;
    const [name,m]=match;
    const td=[...cells].find(c=>c.textContent.includes(name)); if(!td)return;
    td.insertAdjacentHTML("beforeend",`<div class="menu-tip"><b>추천 메뉴</b> ${m.items.join(" · ")}<br><span>${m.note}</span> <a href="${m.url}" target="_blank" rel="noreferrer">메뉴 확인 ↗</a></div>`);
  });
}

async function enhanceBooking(){
  const banner=document.querySelector(".price-banner"); if(!banner||document.querySelector(".live-booking-panel"))return;
  const panel=document.createElement("div"); panel.className="live-booking-panel";
  panel.innerHTML=`<div><b>🔄 예약 실시간 확인</b><span>버튼을 누를 때 최신 항공 스냅샷을 다시 읽고, Booking/Google Flights/Skyscanner 링크는 선택된 날짜·4인 조건으로 실시간 재고 화면을 엽니다.</span></div><button class="btn small primary" id="live-booking-refresh">지금 다시 조회</button>`;
  banner.after(panel);
  panel.querySelector("button").onclick=async()=>{
    const b=panel.querySelector("button"); b.disabled=true; b.textContent="조회 중…";
    await Promise.all([loadLive(true),fetch(`./flight-prices.json?ts=${Date.now()}`,{cache:"no-store"}).catch(()=>null)]);
    b.disabled=false; b.textContent="지금 다시 조회";
    panel.querySelector("span").textContent=`${new Date().toLocaleString("ko-KR")} 최신 파일 확인 완료 · 실제 결제 가능 여부와 최종가는 예약 사이트에서 확정`;
    enhanceAll();
  };
}

function enhanceReturnStopover(){
  const main=document.querySelector("#main-content"); if(!main||main.querySelector(".return-stopover-panel"))return;
  const s=state.live?.return_stopover; if(!s)return;
  const panel=document.createElement("section"); panel.className=`return-stopover-panel ${s.recommended?"recommended":"hold"}`;
  if(s.recommended){
    panel.innerHTML=`<h3>✈ 귀국 경유 관광 자동 후보 · ${s.via_city} (${s.via_airport})</h3><p><b>4인 ₩${Number(s.total_krw||0).toLocaleString("ko-KR")}</b> · 현재 채택 귀국편보다 약 ₩${Number(Math.abs(s.price_delta_vs_current_krw||0)).toLocaleString("ko-KR")} 저렴 · 경유 ${s.layover_hours}시간</p><p>${s.sightseeing_plan}</p><div class="link-row"><a href="${s.query_url}" target="_blank" rel="noreferrer">Google Flights 후보 확인 ↗</a><a href="${s.city_map_url}" target="_blank" rel="noreferrer">경유 관광 동선 ↗</a></div><small>가격이 더 싸고 공항 복귀 버퍼가 확보되는 경우에만 추천으로 표시합니다. 발권 전 입국·환승·수하물 조건 재확인.</small>`;
  }else{
    panel.innerHTML=`<h3>✈ 귀국 경유 관광 자동 비교</h3><p>현재 검색에서는 관광 가능한 장시간 경유편이 기존 채택편보다 싸지 않아 <b>기존 귀국편 유지</b>가 유리합니다.</p><small>${s.reason||"매시간 다시 비교합니다."}</small>`;
  }
  const banner=main.querySelector(".price-banner"); (banner||main.firstElementChild)?.after(panel);
}

async function enhanceAll(){
  await loadLive(false);
  currentItinerary();
  enhanceMap(); enhanceWeather(); enhancePhotos(); enhanceMenus(); enhanceBooking(); enhanceReturnStopover();
}

installLeafletCapture();
const observer=new MutationObserver(()=>{ clearTimeout(observer._t); observer._t=setTimeout(enhanceAll,80); });
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",enhanceAll);
setInterval(()=>loadLive(true).then(enhanceAll),600000);
