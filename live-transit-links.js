import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V16";

const TRANSIT_URL="./transit-live.json";
const state={transit:null,loadedAt:0,itinerary:DEFAULT_ITINERARY,modalEventId:null};
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
  if(/Rotterdam|Delfshaven|Erasmusbrug|Katendrecht|Wilhelminaplein/i.test(text)&&/metro|메트로|tram|트램|bus|버스/i.test(text))ids.push("ret");
  if(/Waterbus|WaterShuttle|Kinderdijk|킨더다이크/i.test(text))ids.push("waterbus");
  if(/DB\/|DB |Hamburg Hbf|Hamburg.*Esbjerg|Rotterdam.*Hamburg/i.test(text)&&/train|rail|철도|열차|교통|DB/i.test(text))ids.push("db");
  if(/HVV|U-Bahn|S-Bahn|Landungsbr|HafenCity/i.test(text)&&/버스|bus|bahn|metro|subway|교통/i.test(text))ids.push("hvv");
  if(/DSB|Esbjerg St\.?|København H|Copenhagen Central/i.test(text)&&/train|rail|철도|열차|교통|DSB/i.test(text)){ids.push("dsb","rejseplanen");}
  if(/metro|subway|지하철|버스|bus|기차|train/i.test(text)&&/Copenhagen|København|Esbjerg|Ørestad/i.test(text))ids.push("rejseplanen");
  return [...new Set(ids)];
}
function statusClass(p){return p?.status==="normal"?"normal":p?.status==="alert"?"alert":p?.status==="source_error"?"error":"live";}
function statusLabel(p){return p?.status==="normal"?"정상":p?.status==="alert"?"운행공지":p?.status==="source_error"?"수집오류":"최신";}
function fetchedLabel(p){
  if(!p?.fetched_at)return"갱신시각 미확인";
  try{return new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(p.fetched_at))+" KST";}catch{return p.fetched_at;}
}
function transitHtml(event,compact=false){
  const rows=providerIdsForEvent(event).map(provider).filter(Boolean);if(!rows.length)return"";
  return `<div class="transit-live-box ${compact?"compact":""}"><div class="transit-provider-summary">${rows.map(p=>`<span class="transit-summary-pill ${statusClass(p)}"><i></i>${esc(p.name)} · ${esc(statusLabel(p))}</span>`).join("")}</div><button type="button" class="btn small transit-inside-btn" data-transit-event="${esc(event.id)}">🚌 대시보드에서 실시간 확인</button></div>`;
}

function ensureTransitModal(){
  let modal=document.getElementById("dashboard-transit-modal");if(modal)return modal;
  modal=document.createElement("div");modal.id="dashboard-transit-modal";modal.className="dashboard-transit-modal";modal.hidden=true;
  modal.innerHTML=`<div class="dashboard-transit-dialog" role="dialog" aria-modal="true" aria-labelledby="dashboard-transit-title"><div class="dashboard-transit-head"><div><b id="dashboard-transit-title">대중교통 실시간 정보</b><small>운영사 공식 페이지를 자동 수집한 최신 스냅샷</small></div><button type="button" class="btn small" data-transit-close>닫기</button></div><div id="dashboard-transit-body"></div><div class="dashboard-transit-foot"><span>외부 페이지로 이동하지 않고 현재 대시보드 안에서 확인합니다.</span><button type="button" class="btn small primary" data-transit-refresh>실시간 다시 읽기</button></div></div>`;
  document.body.append(modal);return modal;
}
function renderTransitModal(event){
  const modal=ensureTransitModal(),body=modal.querySelector("#dashboard-transit-body"),rows=providerIdsForEvent(event).map(provider).filter(Boolean);
  body.innerHTML=`<div class="transit-modal-event"><b>${esc(event.title||"")}</b><span>${esc(event.time_start||"")}~${esc(event.time_end||"")} · ${esc(event.transport||"")}</span></div>${rows.length?rows.map(p=>`<article class="transit-modal-card ${statusClass(p)}"><div class="transit-modal-card-head"><b>${esc(p.name)}</b><span>${esc(statusLabel(p))}</span></div><p>${esc(p.summary||"공식 최신 운행정보를 자동 수집 중입니다.")}</p><small>최근 수집 ${esc(fetchedLabel(p))}</small></article>`).join(""):`<div class="empty">이 일정에 연결된 실시간 대중교통 운영사가 없습니다.</div>`}`;
  modal.hidden=false;document.body.classList.add("transit-modal-open");state.modalEventId=event.id;
}
function closeTransitModal(){const modal=document.getElementById("dashboard-transit-modal");if(modal)modal.hidden=true;document.body.classList.remove("transit-modal-open");state.modalEventId=null;}

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
function mapUrlPlaces(event){
  const out=[];if(!event?.map_url)return out;
  try{const u=new URL(event.map_url),p=u.searchParams;for(const key of ["origin","saddr","destination","daddr","query","q"]){const v=p.get(key);if(v)out.push(v);}for(const v of String(p.get("waypoints")||"").split("|"))if(v)out.push(v);}catch{}
  return out;
}
const GENERIC_PLACE=/^(?:Taichung|Rotterdam|Hamburg|HafenCity|Esbjerg Centrum|Ørestad,? Copenhagen|호텔|공항|도심|라운지)$/i;
const TITLE_NOISE=/조식|체크아웃|체크인|짐\s*보관|회의|현장견학|이동|입국|출국|수속|점심$|저녁$|내용\s*정리|일정\s*점검|환승$|귀국|산책$|간단한|일몰$|관람|휴식|중식|업무공간/;
function cleanPlaceLabel(v){return String(v||"").replace(/\+/g," ").replace(/\s+/g," ").trim();}
function titlePlaceCandidates(event){return String(event?.title||"").split("·").map(x=>x.replace(/\s*(?:점심|저녁|일몰|외부|산책)$/g,"").trim()).filter(x=>x&&x.length>2&&!TITLE_NOISE.test(x)&&!/[→]/.test(x));}
function locationCandidates(event){return String(event?.location||"").split(/\s*→\s*/).map(cleanPlaceLabel).filter(x=>x&&x.length>1);}
function allPlaceLinksHtml(event,compact=false){
  const links=[],seen=[];
  const add=(label,url,kind="place")=>{label=cleanPlaceLabel(label);const n=norm(label);if(!label||!n||seen.some(x=>x===n||x.includes(n)||n.includes(x)))return;seen.push(n);links.push({label,url,kind});};
  for(const h of hotelMatches(event))add(h.name,googleHotelUrl(h),"hotel");
  for(const r of restaurantMatches(event))add(r.name,r.url||googleMapsPlace(r.name,r.city),"restaurant");
  for(const label of mapUrlPlaces(event))add(label,googleMapsPlace(label));
  for(const label of locationCandidates(event))add(label,googleMapsPlace(label));
  for(const label of titlePlaceCandidates(event))if(!GENERIC_PLACE.test(label))add(label,googleMapsPlace(label));
  if(!links.length&&event.location)add(event.location,googleMapsPlace(event.location));
  return links.length?`<div class="all-place-links ${compact?"compact":""}"><span class="all-place-links-label">📍 장소</span>${links.map(x=>`<a class="entity-name-link ${x.kind}" href="${esc(x.url)}" target="_blank" rel="noreferrer">${esc(x.label)} ↗</a>`).join("")}</div>`:"";
}

function parseClock(v){const m=String(v||"").match(/(?:\d+\/\d+\s+)?(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):null;}
function eventMinutes(event){const s=parseClock(event.time_start),e=parseClock(event.time_end);if(s==null||e==null)return null;return e<s?e+1440-s:e-s;}
function clockAt(event,offset){const s=parseClock(event.time_start);if(s==null)return"";const v=(s+offset)%1440;return `${String(Math.floor(v/60)).padStart(2,"0")}:${String(v%60).padStart(2,"0")}`;}
function seg(event,a,b,label,kind){return{start:clockAt(event,a),end:clockAt(event,b),minutes:b-a,label,kind};}
function tpeSegments(event){const total=eventMinutes(event)||140;return[
  seg(event,0,25,"택시 · 타이중 시내 → THSR Taichung","move"),seg(event,25,45,"THSR 승차 대기·탑승","wait"),seg(event,45,90,"THSR · Taichung → Taoyuan","move"),seg(event,90,102,"A18 환승·도보","wait"),seg(event,102,125,"Airport MRT · A18 → TPE","move"),seg(event,125,total,"터미널 이동·출국 준비 버퍼","wait"),
];}
function fixedSegments(event){
  const total=eventMinutes(event);if(!total)return null;const key=`${state.itinerary}:${event.id}`;
  if((state.itinerary==="cost_optimized"&&event.id==="d3-02")||(state.itinerary==="time_optimized"&&event.id==="d3-03"))return tpeSegments(event);
  if(key==="time_optimized:d3-01")return[seg(event,0,20,"택시 · 호텔 → National Taichung Theater","move"),seg(event,20,total,"National Taichung Theater·Calligraphy Greenway 관람·도보","stay")];
  if(key==="time_optimized:d3-02")return[seg(event,0,10,"택시 · 극장권 → Miyahara/구도심","move"),seg(event,10,total,"Miyahara·구도심 도보·점심","stay")];
  const templates={
    "d1-03":[[0,40,"입국심사·수하물","stay"],[40,85,"택시 · RMQ → 호텔","move"],[85,110,"호텔 짐 보관","stay"]],
    "d1-07":[[0,15,"차량 · TIPC → Wuqi Fishing Harbor","move"],[15,45,"우치어항 체류","stay"],[45,65,"차량 · 우치어항 → Gaomei Wetlands","move"],[65,130,"가오메이 습지 체류·일몰","stay"]],
    "d1-08":[[0,75,"차량 · Gaomei Wetlands → 호텔","move"],[75,100,"호텔 체크인","stay"]],
    "d2-04":[[0,15,"기사차량 · VESTAS Base → Lukang Old Street","move"],[15,90,"루강 옛거리·용산사 도보 체류","stay"]],
    "d4-03":[[0,10,"도보 · 호텔/중앙역권 → 메트로","move"],[10,20,"RET 메트로 · Blaak 방면","move"],[20,-1,"Markthal·Cube Houses·Oude Haven 도보·식사","stay"]],
    "d4-05":[[0,20,"RET 트램 · Delfshaven 방면","move"],[20,100,"Delfshaven·Erasmusbrug 도보 체류","stay"],[100,115,"트램/도보 · Bazar 이동","move"],[115,-1,"Restaurant Bazar 저녁","stay"]],
    "d5-03":[[0,15,"도보 · Erasmusbrug 선착장","move"],[15,65,"Waterbus/WaterShuttle · Rotterdam → Kinderdijk","move"],[65,-1,"Kinderdijk 풍차군 도보 체류","stay"]],
    "d5-04":[[0,15,"RET 메트로 · Katendrecht 방면","move"],[15,-1,"Fenix Food Factory·항만 저녁","stay"]],
    "d6-04":[[0,35,"Wilhelminaplein 인근 점심","stay"],[35,55,"택시 · ROG Drutenstraat 7 이동","move"]],
    "d6-08":[[0,40,"택시 · TNO Rijswijk → Rotterdam Centraal","move"],[40,70,"도보·호텔 짐 회수/승차 준비","wait"]],
    "d7-07":[[0,15,"도보 · HafenCity → Elbphilharmonie","move"],[15,95,"Elbphilharmonie Plaza 체류","stay"],[95,110,"HVV U-Bahn · Landungsbrücken 이동","move"],[110,180,"Landungsbrücken 산책·저녁","stay"]],
    "d8-01":[[0,50,"조식·체크아웃","stay"],[50,75,"U-Bahn 또는 택시 · Hamburg Hbf 이동","move"],[75,105,"역 도보·승차 준비 버퍼","wait"]],
    "d8-03":[[0,12,"도보 · Esbjerg St. → CABINN Plus","move"],[12,50,"호텔 체크인·정비","stay"]],
    "d8-04":[[0,25,"버스 · 도심 → Sædding Strand","move"],[25,180,"Men at Sea·박물관 외부 도보 체류","stay"]],
    "d9-04":[[0,20,"택시 · Blue Water Shipping → Esbjerg Centrum","move"],[20,60,"점심","stay"],[60,90,"도보 · 호텔 복귀","move"]],
    "d9-07":[[0,15,"기차 · København H → Ørestad","move"],[15,25,"도보 · Ørestad → CABINN Metro","move"],[25,55,"호텔 체크인","stay"]],
    "d10-01":[[0,20,"호텔 체크아웃","stay"],[20,35,"도보 · CABINN Metro → Ørestad Station","move"],[35,50,"기차 · Ørestad → Copenhagen Airport","move"],[50,75,"공항 터미널 이동·수속 버퍼","wait"]],
  };
  const t=templates[event.id];if(!t)return null;return t.map(([a,b,label,kind])=>seg(event,a,b===-1?total:b,label,kind));
}
function genericSegments(event){
  const total=eventMinutes(event);if(!total)return[];const plus=String(event.transport||"").split("+").map(x=>x.trim()).filter(Boolean);
  if(plus.length>1){const activity=/관광|식사|업무|숙박|개인정비/.test(event.category||"")&&total>=60;if(activity){const move=Math.min(20,Math.max(8,Math.round(total*.12))),rows=[];let at=0;for(const mode of plus){rows.push(seg(event,at,Math.min(total,at+move),`${mode} 이동`,`move`));at+=move;}if(at<total)rows.push(seg(event,at,total,"목적지 체류","stay"));return rows;}const each=Math.floor(total/plus.length);return plus.map((mode,i)=>seg(event,i*each,i===plus.length-1?total:(i+1)*each,`${mode} 이동`,`move`));}
  if(/\/|또는/.test(event.transport||"")&&/교통/.test(event.category||""))return[seg(event,0,total,`${event.transport} 중 당일 최적수단 선택`,`move`)];
  const kind=/교통|항공|출국·교통/.test(event.category||"")?"move":/환승/.test(event.category||"")?"wait":"stay";return[seg(event,0,total,kind==="move"?"이동":kind==="wait"?"대기·환승":"체류",kind)];
}
function scheduleBreakdownHtml(event){
  const rows=fixedSegments(event)||genericSegments(event);if(!rows.length)return"";const move=rows.filter(x=>x.kind==="move").reduce((s,x)=>s+x.minutes,0),wait=rows.filter(x=>x.kind==="wait").reduce((s,x)=>s+x.minutes,0),stay=rows.filter(x=>x.kind==="stay").reduce((s,x)=>s+x.minutes,0);
  return `<div class="event-time-breakdown"><div class="event-time-breakdown-head"><b>시간 구분</b><span>${move?`이동 ${move}분`:""}${wait?` · 대기/환승 ${wait}분`:""}${stay?` · 체류 ${stay}분`:""}</span></div><div class="event-leg-list">${rows.map(r=>`<div class="event-leg ${r.kind}"><span class="event-leg-time">${esc(r.start)}–${esc(r.end)}</span><span class="event-leg-kind">${r.kind==="move"?"이동":r.kind==="wait"?"대기·환승":"체류"}</span><b>${esc(r.label)}</b></div>`).join("")}</div></div>`;
}

function ensureInternalMapButton(body,event){
  body.querySelectorAll('.link-row a').forEach(a=>{if(/^지도/.test(a.textContent.trim())||/google\.(?:com|co\.[a-z]+)\/maps|maps\.google/i.test(a.href)){const b=document.createElement("button");b.type="button";b.className="dashboard-map-link";b.dataset.dashboardMapEvent=event.id;b.textContent="🗺 지도 메뉴에서 이 일정 보기";a.replaceWith(b);}});
  const old=body.querySelector("[data-map-event-id]");if(old){old.removeAttribute("data-map-event-id");old.dataset.dashboardMapEvent=event.id;old.textContent="🗺 지도 메뉴에서 이 일정 보기";}
  if(!body.querySelector("[data-dashboard-map-event]")){let row=body.querySelector(".link-row");if(!row){row=document.createElement("div");row.className="link-row";body.append(row);}row.insertAdjacentHTML("beforeend",`<button type="button" class="dashboard-map-link" data-dashboard-map-event="${esc(event.id)}">🗺 지도 메뉴에서 이 일정 보기</button>`);}
}
function openDashboardMap(id){
  const tab=document.querySelector('#tabs [data-tab="map"]');if(tab&&!tab.classList.contains("active"))tab.click();
  const focus=()=>{const button=[...document.querySelectorAll("#route-list [data-stable-map-event]")].find(x=>String(x.dataset.stableMapEvent)===String(id));const ok=typeof window.__tripMapFocus==="function"?window.__tripMapFocus(id):false;if(button)button.scrollIntoView({behavior:"smooth",block:"center"});else if(ok)document.querySelector("#map")?.scrollIntoView({behavior:"smooth",block:"center"});return Boolean(button||ok);};
  [80,180,360,700,1100].forEach(ms=>setTimeout(focus,ms));
}
window.__openDashboardMapEvent=openDashboardMap;

function decorateTimeline(){
  const events=activePlan().officialSeed.events||[];
  document.querySelectorAll("#main-content .event-card[data-event-id]").forEach(card=>{
    const event=events.find(e=>String(e.id)===String(card.dataset.eventId));if(!event)return;const body=card.querySelector(":scope > div:nth-child(2)");if(!body)return;
    body.querySelector(":scope > .all-place-links")?.remove();body.querySelector(":scope > .transit-live-box")?.remove();body.querySelector(":scope > .event-time-breakdown")?.remove();
    const anchor=body.querySelector(".meta")||body.querySelector(".event-title");anchor?.insertAdjacentHTML("afterend",scheduleBreakdownHtml(event));const places=allPlaceLinksHtml(event);if(places)body.insertAdjacentHTML("beforeend",places);const transit=transitHtml(event);if(transit)body.insertAdjacentHTML("beforeend",transit);ensureInternalMapButton(body,event);
  });
}
function decorateMapSidebar(){
  document.querySelectorAll("#route-list [data-stable-map-event]").forEach(button=>{const event=eventById(button.dataset.stableMapEvent);if(!event)return;let extras=button.nextElementSibling;if(!extras||!extras.classList.contains("map-sidebar-live-extras")){extras=document.createElement("div");extras.className="map-sidebar-live-extras";button.after(extras);}extras.innerHTML=`${allPlaceLinksHtml(event,true)}${transitHtml(event,true)}`;extras.hidden=!extras.innerHTML.trim();});
}
function decorate(){decorateTimeline();decorateMapSidebar();}
async function load(force=false){
  if(!force&&state.transit&&Date.now()-state.loadedAt<120000){decorate();return;}
  try{const r=await fetch(`${TRANSIT_URL}?ts=${Date.now()}`,{cache:"no-store"});if(!r.ok)throw new Error(`transit-live HTTP ${r.status}`);state.transit=await r.json();state.loadedAt=Date.now();}catch(e){console.warn("live transit load failed",e);state.loadedAt=Date.now();}decorate();
}

const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(decorate,140);});observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("click",e=>{
  const map=e.target.closest("[data-dashboard-map-event]");if(map){e.preventDefault();e.stopPropagation();openDashboardMap(map.dataset.dashboardMapEvent);return;}
  const transit=e.target.closest("[data-transit-event]");if(transit){e.preventDefault();e.stopPropagation();const event=eventById(transit.dataset.transitEvent);if(event)renderTransitModal(event);return;}
  if(e.target.closest("[data-transit-close]")){e.preventDefault();closeTransitModal();return;}
  if(e.target.closest("[data-transit-refresh]")){e.preventDefault();const id=state.modalEventId;load(true).then(()=>{const event=eventById(id);if(event)renderTransitModal(event);});return;}
  if(e.target.id==="dashboard-transit-modal"){closeTransitModal();return;}
  if(e.target.closest(".day-tab,.itinerary-tab,#tabs [data-tab]"))setTimeout(()=>load(false),180);
},true);
window.addEventListener("keydown",e=>{if(e.key==="Escape")closeTransitModal();});window.addEventListener("load",()=>load(true));load(true);
