import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import {
  APP_VERSION, tripMeta, officialSeed,
} from "./itinerary-data.js";

const SUPABASE_URL = "https://wrozrvsplryfjgckmxvl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_g1uvMhgnSTskTzGCKglOag_cIVpzZ2a";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const MARKER = `__${APP_VERSION}__`;
const LOCAL_ORDER_KEY = `offshore-trip-event-order-${APP_VERSION}`;

const TABLES = ["days","events","flights","hotels","meetings","transport_options","restaurants","map_points","budget_items","team_notes"];
const clone = (x) => JSON.parse(JSON.stringify(x));

const state = {
  tab: "timeline",
  activeDay: 1,
  user: null,
  mode: "local",
  data: { ...clone(officialSeed), team_notes: [] },
  map: null,
  subscriptions: [],
  editing: null,
  livePrices: null,
  livePriceError: null,
};

const tabs = [
  ["timeline","전체 일정"],["map","지도"],["airhotel","항공·숙박"],["budget","예산"],
  ["meetings","회의·방문기관"],["transport","교통·렌터카"],["restaurants","맛집"],
  ["verify","확정·검증"],["notes","팀 메모"],
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const fmt = (n) => new Intl.NumberFormat("ko-KR").format(Math.round(Number(n) || 0));
const money = (min,max) => {
  if(min == null && max == null)return "";
  if(min == null)return `₩${fmt(max)}`;
  if(max == null || Number(min)===Number(max))return `₩${fmt(min)}`;
  return `₩${fmt(min)}~${fmt(max)}`;
};
const showLoader = (v) => $("#loader").classList.toggle("open", v);
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove("show"),3200); }
function openModal(id){ const el=document.getElementById(id); el.classList.add("open"); el.setAttribute("aria-hidden","false"); }
function closeModal(id){ const el=document.getElementById(id); el.classList.remove("open"); el.setAttribute("aria-hidden","true"); }
function isEditable(){ return !!state.user && state.mode === "cloud"; }
function isReorderable(){ return isEditable() || state.mode === "local"; }

function restoreLocalEventOrder(){
  try{
    const saved=JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY)||"{}");
    for(const [dayId,ids] of Object.entries(saved)){
      const rank=new Map((ids||[]).map((id,index)=>[String(id),(index+1)*10]));
      state.data.events.filter(e=>String(e.day_id)===String(dayId)).forEach(e=>{
        if(rank.has(String(e.id)))e.sort_order=rank.get(String(e.id));
      });
    }
  }catch(err){console.warn("로컬 일정 순서를 복원하지 못했습니다.",err);}
}

function saveLocalEventOrder(rows){
  try{
    const saved=JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY)||"{}");
    saved[String(state.activeDay)]=rows.map(row=>String(row.id));
    localStorage.setItem(LOCAL_ORDER_KEY,JSON.stringify(saved));
  }catch(err){console.warn("로컬 일정 순서를 저장하지 못했습니다.",err);}
}

async function init(){
  bindStaticEvents();
  const pricePromise=loadLivePrices();
  let { data: { session } } = await supabase.auth.getSession();
  if(!session){
    const {data,error}=await supabase.auth.signInAnonymously();
    if(error) console.warn("Anonymous collaboration is not enabled:",error.message);
    session=data?.session||null;
  }
  state.user = session?.user ?? null;
  supabase.auth.onAuthStateChange((_event, session2) => {
    state.user = session2?.user ?? null;
    render();
  });
  await detectCloudVersion();
  await pricePromise;
  render();
  window.setInterval(async()=>{
    const changed=await loadLivePrices();
    if(changed){
      renderStats();
      if(["timeline","airhotel","budget","verify"].includes(state.tab))renderContent();
    }
  },300000);
}

async function loadLivePrices(){
  try{
    const res=await fetch(`./flight-prices.json?ts=${Date.now()}`,{cache:"no-store"});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const payload=await res.json();
    if(!payload?.fares || Number(payload.passengers)!==4)throw new Error("운임 파일 형식 오류");
    state.livePrices=payload;
    state.livePriceError=null;
    return true;
  }catch(err){
    state.livePriceError=err.message||String(err);
    console.warn("항공 운임 스냅샷을 불러오지 못했습니다.",err);
    return false;
  }
}

function koreaStamp(value){
  if(!value)return "미확인";
  return new Intl.DateTimeFormat("ko-KR",{
    timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",hour12:false,
  }).format(new Date(value));
}

function flightFareId(row){
  const origin=String(row?.origin||"").match(/[A-Z]{3}/)?.[0]||"";
  const destination=String(row?.destination||"").match(/[A-Z]{3}/)?.[0]||"";
  return ({
    "ICN-CPH":"f1",
    "AMS-OSL":"f2",
    "OSL-TPE":"f3",
    "RMQ-HKG":"f4",
    "HKG-ICN":"f5",
  })[`${origin}-${destination}`]||null;
}

function selectedFlightTotal(){
  const rows=state.data.flights||[], fares=state.livePrices?.fares||{};
  if(!rows.length)return null;
  let total=0;
  for(const row of rows){
    const fare=fares[flightFareId(row)];
    if(fare?.status!=="ok" || !fare?.selected?.total_krw || fare.date!==row.date)return null;
    total+=Number(fare.selected.total_krw);
  }
  return total;
}

function budgetRows(){
  const rows=clone(state.data.budget_items||[]);
  const flightTotal=selectedFlightTotal();
  const air=rows.find(r=>r.id==="b1" || r.category==="항공");
  if(air){
    air.min_krw=flightTotal;
    air.max_krw=flightTotal;
    air.notes=flightTotal==null
      ?"일정 날짜와 최신 운임 스냅샷이 일치하지 않아 자동 합계를 보류했습니다."
      :`Google Flights 일정 채택편 5개 구간·성인 4명 합계 · ${koreaStamp(state.livePrices?.generated_at)} 조회`;
  }
  return rows;
}

function budgetSummary(){
  const rows=budgetRows(), complete=rows.every(r=>r.min_krw!=null&&r.max_krw!=null);
  const subMin=rows.reduce((s,r)=>s+Number(r.min_krw||0),0);
  const subMax=rows.reduce((s,r)=>s+Number(r.max_krw||0),0);
  return {rows,complete,subMin,subMax,totalMin:subMin*1.1,totalMax:subMax*1.1};
}

async function detectCloudVersion(){
  try{
    const { data, error } = await supabase.from("team_notes").select("id,content").eq("content", MARKER).limit(1);
    if(error) throw error;
    if(data?.length){ await loadCloud(); }
    else { state.mode="local"; state.data={...clone(officialSeed),team_notes:[]}; restoreLocalEventOrder(); }
  }catch(err){
    console.warn(err);
    state.mode="local";
    state.data={...clone(officialSeed),team_notes:[]};
    restoreLocalEventOrder();
  }
}

async function loadCloud(){
  const ordered = {
    days:["id",true], events:["sort_order",true], flights:["sort_order",true], hotels:["sort_order",true],
    meetings:["sort_order",true], transport_options:["sort_order",true], restaurants:["sort_order",true],
    map_points:["day_id",true], budget_items:["sort_order",true], team_notes:["created_at",true],
  };
  const results = await Promise.all(TABLES.map(async table => {
    let q=supabase.from(table).select("*");
    const [col,asc]=ordered[table]; q=q.order(col,{ascending:asc});
    const {data,error}=await q; if(error) throw error; return [table,data||[]];
  }));
  state.data=Object.fromEntries(results);
  state.data.team_notes=state.data.team_notes.filter(n=>n.content!==MARKER);
  state.mode="cloud";
  subscribeRealtime();
}

function subscribeRealtime(){
  state.subscriptions.forEach(ch=>supabase.removeChannel(ch)); state.subscriptions=[];
  let timer;
  TABLES.forEach(table=>{
    const ch=supabase.channel(`trip-${table}-${Date.now()}`)
      .on("postgres_changes",{event:"*",schema:"public",table},()=>{
        clearTimeout(timer); timer=setTimeout(async()=>{ try{ await loadCloud(); render(); }catch(e){console.warn(e);} },350);
      }).subscribe();
    state.subscriptions.push(ch);
  });
}

function render(){
  document.title=tripMeta.title;
  $("#app-title").textContent=tripMeta.title;
  $("#app-route").textContent=tripMeta.route;
  $("#subtitle").textContent=tripMeta.subtitle;
  renderStats(); renderHeaderState(); renderTabs(); renderContent();
}

function renderStats(){
  const budget=budgetSummary();
  const totalMin=budget.complete?budget.totalMin:tripMeta.budgetMin;
  const totalMax=budget.complete?budget.totalMax:tripMeta.budgetMax;
  const items=[
    ["기간",tripMeta.dates,"11일 · 9/2 저녁 출국"],
    ["숙박",`호텔 ${tripMeta.hotelNights}박 + 기내 ${tripMeta.flightNights}박`,"홍콩 무숙박 당일관광"],
    ["대만 체류","9/8 06:15–9/11 10:25","약 3일 4시간"],
    ["4인 총예산",`${fmt(totalMin/10000)}만~${fmt(totalMax/10000)}만원`,"항공 최신 조회가·10% 예비비 포함"],
    ["1인 환산",`${fmt(totalMin/4/10000)}만~${fmt(totalMax/4/10000)}만원`,"항공은 성인 4명 조회 합계 반영"],
  ];
  $("#stat-grid").innerHTML=items.map(([l,v,s])=>`<div class="stat"><span>${esc(l)}</span><strong>${esc(v)}</strong><span>${esc(s)}</span></div>`).join("");
}

function renderHeaderState(){
  const banner=$("#status-banner"), sync=$("#cloud-sync-btn");
  if(state.mode==="cloud"){
    banner.className="status-banner cloud";
    banner.innerHTML=`공개 공동편집 모드 · 로그인 불필요 · 변경사항 실시간 반영 · 개인정보·담당자 연락처 입력 금지`;
  }else{
    banner.className="status-banner";
    banner.innerHTML=`검수된 GitHub 기준안을 표시 중입니다. 일정 카드 순서 이동은 로그인 없이 이 기기에 저장됩니다. 기준안 안전 적용 후에는 팀 공동 데이터로 반영됩니다.`;
  }
  sync.hidden=!state.user || state.mode==="cloud";
}

function renderTabs(){
  $("#tabs").innerHTML=tabs.map(([id,label])=>`<button class="tab ${state.tab===id?"active":""}" data-tab="${id}">${label}</button>`).join("");
  $$('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderTabs();renderContent();});
}

function renderContent(){
  const main=$("#main-content");
  if(state.tab!=="map" && state.map){state.map.remove();state.map=null;}
  const handlers={timeline:renderTimeline,map:renderMapTab,airhotel:renderAirHotel,budget:renderBudget,meetings:renderMeetings,transport:renderTransport,restaurants:renderRestaurants,verify:renderVerify,notes:renderNotes};
  main.innerHTML=handlers[state.tab]();
  bindDynamicEvents();
  if(state.tab==="map") setTimeout(drawMap,0);
}

function renderDayTabs(){
  return `<div class="day-tabs no-print">${state.data.days.map(d=>`<button class="day-tab ${state.activeDay===d.id?"active":""}" data-day="${d.id}"><b>Day ${d.id}</b><span>${esc(d.date)} ${esc(d.weekday)}</span><small>${esc(d.cities)}</small></button>`).join("")}</div>`;
}

function renderTimeline(){
  const d=state.data.days.find(x=>x.id===state.activeDay) || state.data.days[0];
  const evs=state.data.events.filter(x=>Number(x.day_id)===Number(d.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  return `${renderDayTabs()}
    <div class="day-summary"><div class="day-summary-title"><h2>Day ${d.id} · ${esc(d.date)} ${esc(d.weekday)}</h2>${isEditable()?`<label class="date-shifter">날짜 변경 <input type="date" id="active-day-date" value="${esc(d.date)}"><button class="btn small" id="shift-day-date">이 날짜부터 연쇄 이동</button></label>`:""}</div><p>${esc(d.cities)} · 숙박: ${esc(d.lodging)}</p><p>${esc(d.summary)}</p><p class="drag-hint">모바일은 ↕ 끌기 손잡이를 누른 채 이동하거나 ↑·↓ 버튼을 사용하세요. PC에서는 카드 자체를 끌 수 있습니다. ${isEditable()?"변경 순서는 공동 데이터에 즉시 반영됩니다.":"현재 순서는 이 기기에 저장되며, 기준안 안전 적용 후에는 팀에 공동 반영됩니다."}</p></div>
    <div class="section-head"><h2>상세 일정</h2>${isEditable()?`<button class="btn small primary" data-add="events">+ 일정 추가</button>`:""}</div>
    <div class="cards">${evs.length?evs.map(renderEventCard).join(""):`<div class="empty">일정이 없습니다.</div>`}</div>`;
}

function renderEventCard(e){
  const links=[e.booking_url&&["예약",e.booking_url],e.official_url&&["공식",e.official_url],e.map_url&&["지도",e.map_url]].filter(Boolean);
  return `<article class="event-card" draggable="${isReorderable()}" data-event-id="${esc(e.id)}">
    <div class="event-time">${esc(e.time_start||"")}${e.time_end?`\n~ ${esc(e.time_end)}`:""}</div>
    <div><div class="event-title">${e.category?`<span class="chip">${esc(e.category)}</span>`:""}<span>${esc(e.title)}</span></div>
      <div class="meta">${e.location?`<span>📍 ${esc(e.location)}</span>`:""}${e.transport?`<span>🚗 ${esc(e.transport)}</span>`:""}${e.duration?`<span>⏱ ${esc(e.duration)}</span>`:""}</div>
      ${eventFareInline(e)}
      ${(e.original_min!=null||e.min_cost_krw!=null)?`<div class="cost">${e.original_currency?`${esc(e.original_currency)} ${fmt(e.original_min)}~${fmt(e.original_max)}`:""} ${e.min_cost_krw!=null?`<b>${money(e.min_cost_krw,e.max_cost_krw)}</b>`:""} ${e.cost_basis?`<span>(${esc(e.cost_basis)})</span>`:""}</div>`:""}
      ${e.notes?`<div class="notes">${esc(e.notes)}</div>`:""}
      ${links.length?`<div class="link-row">${links.map(([l,u])=>`<a href="${esc(u)}" target="_blank" rel="noreferrer">${l} ↗</a>`).join("")}</div>`:""}
    </div>
    <div class="event-actions">${isReorderable()?`
      <button class="drag-handle" type="button" data-drag-handle="${esc(e.id)}" aria-label="${esc(e.title)} 일정 끌어서 이동">↕ <span>끌기</span></button>
      <button class="btn small move-btn" type="button" data-move-event="${esc(e.id)}" data-direction="-1" aria-label="${esc(e.title)} 위로 이동">↑</button>
      <button class="btn small move-btn" type="button" data-move-event="${esc(e.id)}" data-direction="1" aria-label="${esc(e.title)} 아래로 이동">↓</button>
      ${isEditable()?`<button class="btn small" data-edit-table="events" data-id="${esc(e.id)}">편집</button>`:""}`:""}</div>
  </article>`;
}

function renderMapTab(){
  return `${renderDayTabs()}<div class="section-head"><h2>${state.activeDay ? `Day ${state.activeDay} 경로` : "전체 경로"}</h2><button class="btn small" id="show-all-route">전체 경로</button></div>
    <div class="map-layout"><div class="map-box" id="map"></div><div class="route-list" id="route-list"></div></div>
    <div class="legend"><span>━ 자동차</span><span>┄ 항공</span><span class="warning">━ ━ THSR</span><span>·· 지하철·Airport Express</span></div>`;
}

async function drawMap(){
  const all=!state.activeDay;
  const pts=(all?state.data.map_points:state.data.map_points.filter(p=>Number(p.day_id)===Number(state.activeDay)))
    .slice().sort((a,b)=>Number(a.day_id)-Number(b.day_id)||Number(a.sort_order)-Number(b.sort_order));
  if(!pts.length)return;
  if(state.map)state.map.remove();
  state.map=L.map("map",{scrollWheelZoom:true});
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(state.map);
  const bounds=[];
  pts.forEach((p,i)=>{
    const ll=[Number(p.lat),Number(p.lng)];bounds.push(ll);
    L.marker(ll).bindPopup(`<b>Day ${p.day_id} · ${esc(p.name)}</b><br>${esc(p.popup||"")}${p.url?`<br><a href="${esc(p.url)}" target="_blank">링크</a>`:""}`).addTo(state.map);
    if(i && Number(pts[i-1].day_id)===Number(p.day_id)){const type=p.segment_type||"car";const style=type==="flight"?{color:"#008fc5",weight:2,dashArray:"7 7"}:type==="hsr"?{color:"#c73434",weight:4,dashArray:"13 5"}:type==="subway"?{color:"#7346b8",weight:3,dashArray:"2 5"}:{color:"#087a72",weight:3};L.polyline([[Number(pts[i-1].lat),Number(pts[i-1].lng)],ll],style).addTo(state.map);}
  });
  state.map.fitBounds(bounds,{padding:[28,28]});
  $("#route-list").innerHTML=pts.map((p,i)=>`<div class="route-stop"><div class="route-num">${i+1}</div><div><b>Day ${p.day_id} · ${esc(p.name)}</b><small>${esc(p.popup||"")} · ${esc(p.segment_type||"car")}</small></div></div>`).join("");
  for(let i=1;i<pts.length;i++){
    if(Number(pts[i-1].day_id)!==Number(pts[i].day_id) || (pts[i].segment_type||"car")!=="car")continue;
    try{
      const a=pts[i-1],b=pts[i];
      const url=`https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
      const res=await fetch(url),json=await res.json(),route=json.routes?.[0];
      if(route)L.geoJSON(route.geometry,{style:{color:"#087a72",weight:5,opacity:.82}}).bindTooltip(`${Math.round(route.distance/1000)}km · 약 ${Math.round(route.duration/60)}분`).addTo(state.map);
    }catch(err){console.warn("도로 상세경로 조회 실패",err);}
  }
}

const tableDefs={
  flights:{title:"항공",fields:["date","flight_no","origin","destination","depart_time","arrive_time","status","alternative","url","notes"],labels:{date:"날짜",flight_no:"편명",origin:"출발",destination:"도착",depart_time:"출발",arrive_time:"도착",status:"상태",alternative:"대안",url:"항공사",notes:"메모"}},
  hotels:{title:"숙박",fields:["name","city","check_in","check_out","nights","rooms","min_krw","max_krw","status","alternative","url","notes"],labels:{name:"호텔",city:"도시",check_in:"체크인",check_out:"체크아웃",nights:"박",rooms:"실",min_krw:"최소",max_krw:"최대",status:"상태",alternative:"대안",url:"링크",notes:"메모"}},
  meetings:{title:"회의·방문기관",fields:["day_id","organization","agenda","recommended_duration","status","photo_allowed","ppe_required","interpreter_needed","url","notes"],labels:{day_id:"Day",organization:"기관",agenda:"의제",recommended_duration:"권장시간",status:"상태",photo_allowed:"사진",ppe_required:"PPE",interpreter_needed:"통역",url:"링크",notes:"메모"}},
  transport_options:{title:"교통·렌터카",fields:["region","recommendation","reason","min_krw","max_krw","notes"],labels:{region:"지역",recommendation:"권고",reason:"사유",min_krw:"최소",max_krw:"최대",notes:"메모"}},
  restaurants:{title:"맛집",fields:["day_id","name","city","meal_type","price_per_person","url","notes"],labels:{day_id:"Day",name:"식당",city:"도시",meal_type:"구분",price_per_person:"1인 예산",url:"링크",notes:"메모"}},
  budget_items:{title:"예산 상세",fields:["category","label","min_krw","max_krw","notes"],labels:{category:"구분",label:"항목",min_krw:"최소(4인)",max_krw:"최대(4인)",notes:"메모"}},
};

function flightSearchUrl(r){
  const date=String(r.date||"").replaceAll("-","").slice(2);
  const from=encodeURIComponent((r.origin||"").match(/[A-Z]{3}/)?.[0]?.toLowerCase()||"");
  const to=encodeURIComponent((r.destination||"").match(/[A-Z]{3}/)?.[0]?.toLowerCase()||"");
  return `https://www.skyscanner.co.kr/transport/flights/${from}/${to}/${date}/?adultsv2=4&cabinclass=economy&rtn=0`;
}
function flightGoogleUrl(r){
  const query=`Flights from ${r.origin} to ${r.destination} on ${r.date} one way economy 4 adults`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}&curr=KRW&hl=ko`;
}
function hotelSearchUrl(r){
  return `https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(`${r.name} ${r.city}`)}&checkin=${r.check_in}&checkout=${r.check_out}&group_adults=4&no_rooms=${r.rooms||2}&group_children=0`;
}

function offerSchedule(offer){
  const legs=offer?.legs||[];
  if(!legs.length)return "운항시각 미확인";
  const first=legs[0],last=legs[legs.length-1];
  const next=last.arrival_date!==first.departure_date?` (${last.arrival_date})`:"";
  return `${first.departure_time} ${first.origin} → ${last.arrival_time}${next} ${last.destination} · ${offer.stops}회 경유`;
}

function offerAirlines(offer){
  return (offer?.airlines||[]).filter(Boolean).join(" + ") || offer?.carrier_code || "항공사 미확인";
}

function flightFareCard(row){
  const fare=state.livePrices?.fares?.[flightFareId(row)];
  if(!fare){
    return `<div class="live-fare error"><b>자동 운임 없음</b><small>${esc(state.livePriceError||"스냅샷을 불러오는 중입니다.")}</small>
      <div class="fare-actions"><a class="btn small primary" href="${esc(flightGoogleUrl(row))}" target="_blank" rel="noreferrer">Google Flights 현재가 ↗</a></div></div>`;
  }
  if(fare.date!==row.date){
    return `<div class="live-fare stale"><b>날짜 변경됨 · 자동가격 재조회 필요</b><small>스냅샷 ${esc(fare.date)} / 현재 일정 ${esc(row.date)}</small>
      <div class="fare-actions"><a class="btn small primary" href="${esc(flightGoogleUrl(row))}" target="_blank" rel="noreferrer">변경 날짜 현재가 ↗</a><a class="btn small" href="${esc(flightSearchUrl(row))}" target="_blank" rel="noreferrer">Skyscanner 비교 ↗</a></div></div>`;
  }
  if(!fare.lowest?.total_krw || !fare.selected?.total_krw){
    return `<div class="live-fare error"><b>가격 조회 실패</b><small>${esc(fare.error||"직전 성공값이 없습니다.")}</small>
      <div class="fare-actions"><a class="btn small primary" href="${esc(flightGoogleUrl(row))}" target="_blank" rel="noreferrer">Google Flights 직접 조회 ↗</a></div></div>`;
  }
  const lowest=fare.lowest, selected=fare.selected;
  const same=Number(lowest.total_krw)===Number(selected.total_krw)
    && offerSchedule(lowest)===offerSchedule(selected);
  const fresh=Date.now()<=Date.parse(state.livePrices?.fresh_until||0) && fare.status==="ok";
  const exactUrl=fare.query_url||flightGoogleUrl(row);
  return `<div class="live-fare ${fresh?"":"stale"}">
    <div class="fare-title"><span>노선 절대최저가 · 4인</span><strong>₩${fmt(lowest.total_krw)}</strong></div>
    <div class="fare-sub">1인 ₩${fmt(lowest.per_person_krw)} · ${esc(offerAirlines(lowest))}<br>${esc(offerSchedule(lowest))}</div>
    ${same?`<div class="fare-picked same">현재 최저가 = 일정 채택편</div>`:`<div class="fare-picked"><span>일정 채택가 · 4인</span><strong>₩${fmt(selected.total_krw)}</strong><small>1인 ₩${fmt(selected.per_person_krw)} · ${esc(fare.selected_reason||"시간표 기준")}<br>${esc(offerAirlines(selected))} · ${esc(offerSchedule(selected))}${fare.selected_fallback?" · 조건편 미발견으로 최저가 임시사용":""}</small></div>`}
    <div class="fare-updated">${fresh?"최신":"지연 가능"} · ${esc(koreaStamp(state.livePrices?.generated_at))} 조회 · 수하물·좌석료 별도 가능</div>
    <div class="fare-actions"><a class="btn small primary" href="${esc(exactUrl)}" target="_blank" rel="noreferrer">Google Flights 실제 결과 ↗</a><a class="btn small" href="${esc(flightSearchUrl(row))}" target="_blank" rel="noreferrer">Skyscanner 교차비교 ↗</a></div>
  </div>`;
}

function eventFareInline(event){
  const title=String(event.title||"");
  const fareId=title.includes("SK988")?"f1"
    :title.includes("AMS → OSL")?"f2"
    :title.includes("OSL → FRA")?"f3"
    :title.includes("RMQ → HKG")?"f4"
    :title.includes("HKG → ICN")?"f5":null;
  if(!fareId)return "";
  const row=(state.data.flights||[]).find(f=>flightFareId(f)===fareId);
  const fare=state.livePrices?.fares?.[fareId];
  if(!row || fare?.status!=="ok" || !fare?.selected?.total_krw || fare.date!==row.date){
    return `<div class="event-live-fare stale">자동 운임 재조회 필요${row?` · <a href="${esc(flightGoogleUrl(row))}" target="_blank" rel="noreferrer">현재가 열기 ↗</a>`:""}</div>`;
  }
  const lowest=fare.lowest,selected=fare.selected;
  const differs=Number(lowest?.total_krw)!==Number(selected.total_krw);
  return `<div class="event-live-fare"><b>${differs?"일정 채택가":"현재 최저가"} 4인 ₩${fmt(selected.total_krw)}</b> · 1인 ₩${fmt(selected.per_person_krw)}${differs?` · 노선 최저 4인 ₩${fmt(lowest.total_krw)}`:""} · <a href="${esc(fare.query_url||flightGoogleUrl(row))}" target="_blank" rel="noreferrer">실제 결과 ↗</a><small>${esc(koreaStamp(state.livePrices?.generated_at))} 조회 · 수하물·좌석료 별도 가능</small></div>`;
}

function renderAirHotel(){
  const p=state.livePrices;
  const fresh=p && Date.now()<=Date.parse(p.fresh_until||0);
  return `<div class="status-banner ${fresh?"cloud":"warning"} price-banner"><b>항공 최저가 자동조회</b> · Google Flights · 성인 4명·일반석·편도 · ${esc(koreaStamp(p?.generated_at))} 조회 · GitHub가 매시간 갱신합니다. ${state.livePriceError?`불러오기 오류: ${esc(state.livePriceError)}`:"예약 직전 실제 결과와 최종 결제액을 확인하십시오."} <button class="btn small" id="refresh-fares">최신 스냅샷 다시 읽기</button></div>${renderDataSection("flights")}<div style="height:22px"></div>${renderDataSection("hotels")}`;
}
function renderMeetings(){return renderDataSection("meetings");}
function renderTransport(){return `<div class="security-note" style="margin-bottom:12px">비용·시간 차이가 크지 않은 구간은 자동차를 우선했습니다. 국경간 편도반납 수수료가 과도하면 별도 렌트 또는 기사차량과 재비교하십시오.</div>${renderDataSection("transport_options")}`;}
function renderRestaurants(){return renderDataSection("restaurants");}

function renderDataSection(table){
  const def=tableDefs[table], rows=table==="budget_items"?budgetRows():(state.data[table]||[]);
  return `<div class="section-head"><h2>${def.title}</h2>${isEditable()?`<button class="btn small primary" data-add="${table}">+ 추가</button>`:""}</div>
  <div class="table-wrap"><table class="data-table"><thead><tr>${def.fields.map(f=>`<th>${def.labels[f]||f}</th>`).join("")}<th>가격·작업</th></tr></thead><tbody>
    ${rows.map(r=>`<tr>${def.fields.map(f=>`<td>${cellValue(r,f)}</td>`).join("")}<td>${table==="flights"?flightFareCard(r):table==="hotels"?`<a class="btn small primary" href="${hotelSearchUrl(r)}" target="_blank" rel="noreferrer">날짜·4인·2실 최저가 ↗</a>`:""}${isEditable()?` <button class="btn small" data-edit-table="${table}" data-id="${esc(r.id)}">편집</button>`:""}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function cellValue(r,f){
  const v=r[f];
  if(f==="url")return v?`<a href="${esc(v)}" target="_blank" rel="noreferrer">열기 ↗</a>`:"";
  if(f==="min_krw"||f==="max_krw")return v==null?"":`₩${fmt(v)}`;
  if(typeof v==="boolean")return v?"✓":"—";
  return esc(v);
}

function renderBudget(){
  const summary=budgetSummary(),{rows,subMin,subMax}=summary;const max=Math.max(...rows.map(r=>Number(r.max_krw)||0),1);
  const flightTotal=selectedFlightTotal();
  return `<div class="status-banner ${flightTotal==null?"warning":"cloud"} price-banner"><b>항공비 자동 반영</b> · ${flightTotal==null?"변경된 날짜 운임 재조회 중":`5개 항공 구간 일정 채택가 ₩${fmt(flightTotal)}`} · ${esc(koreaStamp(state.livePrices?.generated_at))} 조회. 숙박·교통·식비·행사비는 계획범위입니다.</div>
    <div class="budget-total"><div class="stat"><span>4인 소계</span><strong>${money(subMin,subMax)}</strong></div><div class="stat"><span>10% 예비비 포함</span><strong>${money(subMin*1.1,subMax*1.1)}</strong></div><div class="stat"><span>1인 환산</span><strong>${money(subMin*1.1/4,subMax*1.1/4)}</strong></div><div class="stat"><span>대만 체류</span><strong>약 3일 4시간</strong></div></div>
    <div class="budget-bars">${rows.map(r=>`<div class="budget-row"><div class="top"><b>${esc(r.category)} · ${esc(r.label)}</b><span>${money(r.min_krw,r.max_krw)}</span></div><div class="bar"><span style="width:${Math.max(3,Number(r.max_krw)/max*100)}%"></span></div><div class="notes">${esc(r.notes||"")}</div></div>`).join("")}</div><div style="height:20px"></div>${renderDataSection("budget_items")}`;
}

function renderNotes(){
  const notes=(state.data.team_notes||[]).slice().reverse();
  return `<div class="security-note">이 메모 테이블은 현재 기존 Supabase 정책상 익명 읽기가 허용될 수 있습니다. 개인정보·계약내용·기관 담당자 연락처 등 비공개 정보는 입력하지 마십시오.</div>
    ${isEditable()?`<div class="day-summary" style="margin-top:12px"><div class="form-grid"><div class="field"><label>연결 Day</label><select id="note-day"><option value="">전체</option>${state.data.days.map(d=>`<option value="${d.id}">Day ${d.id}</option>`).join("")}</select></div><div class="field full"><label>팀 메모</label><textarea id="note-content" rows="3"></textarea></div></div><button class="btn primary" id="add-note" style="margin-top:10px">메모 등록</button></div>`:"<div class='status-banner'>Supabase 익명 쓰기 권한이 연결되면 로그인 없이 메모를 작성할 수 있습니다.</div>"}
    <div class="cards" style="margin-top:12px">${notes.length?notes.map(n=>`<div class="event-card"><div class="event-time">${n.day_id?`Day ${n.day_id}`:"전체"}</div><div><div class="event-title">${esc(n.author_name||"팀원")}</div><div class="notes">${esc(n.content)}</div><div class="meta">${esc(new Date(n.created_at).toLocaleString("ko-KR"))}</div></div>${isEditable()?`<div><button class="btn small danger" data-delete-note="${n.id}">삭제</button></div>`:""}</div>`).join(""):`<div class="empty">등록된 메모가 없습니다.</div>`}</div>`;
}

function renderVerify(){
  const flights=state.data.flights||[], meetings=state.data.meetings||[];
  const flightPending=flights.filter(f=>!/확정|발권완료/.test(f.status||""));
  const meetingPending=meetings.filter(m=>m.status!=="확정");
  const mapMeetings=meetings.filter(m=>!String(m.organization||"").includes("AWTEC"));
  const checks=[
    ["업무장소 원칙",`공유 Google Maps 업무장소 ${mapMeetings.length}곳 + AWTEC만 유지`,"적용 완료"],
    ["삭제한 업무장소","Equinor Fornebu·Norwegian Offshore Wind·Ørsted Gentofte·Port Esbjerg·Port of Taichung","삭제 완료"],
    ["대만 체류","9/8 06:15–9/11 10:25, 약 3일 4시간","요청 반영"],
    ["항공",`${flights.length}개 구간 · 성인 4명 최저가 매시간 자동조회 · ${flightPending.length}개 발권 전`,flightPending.length?"발권 필요":"완료"],
    ["기관·행사",`${meetings.length}개 일정 중 ${meetingPending.length}개 미확정`,meetingPending.length?"회신·등록 필요":"완료"],
    ["데이터 보호","기준안 적용 전 JSON 자동 백업 · 팀 메모 보존","개선 완료"],
    ["최종 운임조회",koreaStamp(state.livePrices?.generated_at),Date.now()<=Date.parse(state.livePrices?.fresh_until||0)?"최신":"지연 가능"],
  ];
  const sourceLinks=[
    ["사용자 Google Maps 목록",tripMeta.sourceMap],
    ["AWTEC 2026","https://www.awtec2026.com/"],
    ["Google Flights","https://www.google.com/travel/flights"],
    ["SAS ICN–CPH","https://www.flysas.com/en/flight-routes/copenhagen/seoul"],
    ["HK Express RMQ–HKG","https://www.hkexpress.com/en-tw/flights-from-taichung-to-hong-kong"],
    ["Port of Rotterdam","https://www.portofrotterdam.com/en"],
    ["Taiwan HSR","https://en.thsrc.com.tw/"],
  ];
  return `<div class="section-head"><h2>업무장소·가격 검증 현황</h2><span class="version-chip">${esc(APP_VERSION)}</span></div>
    <div class="compare-grid">
      <section class="compare-card muted-card"><h3>제외된 업무일정</h3><p>공유 지도에 없는 노르웨이·덴마크 업무기관과 별도 항만회의는 모두 제거했습니다. 해당 지역은 관광·음식점 일정만 남겼습니다.</p></section>
      <section class="compare-card selected-card"><h3>현재 GitHub 기준본</h3><p>지도에 저장된 풍력 업무장소와 Kaohsiung Exhibition Center의 AWTEC만 유지했습니다. 대만은 약 3일, 나머지 빈 시간은 관광과 식사로 재구성했습니다.</p></section>
    </div>
    <div class="table-wrap"><table class="data-table verify-table"><thead><tr><th>검증항목</th><th>현재 상태</th><th>판정</th></tr></thead><tbody>
      ${checks.map(([a,b,c])=>`<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}
    </tbody></table></div>
    <div class="day-summary source-panel"><h2>주요 공식 링크</h2><div class="link-row">${sourceLinks.map(([label,url])=>`<a href="${url}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`).join("")}</div>
      <p>자동 금액은 Google Flights가 표시한 성인 4명 일반석 총액 스냅샷입니다. 위탁수하물·좌석·결제수수료와 재고 변동은 링크를 연 뒤 최종 결제 화면에서 확인하십시오.</p></div>`;
}

function bindStaticEvents(){
  $("#cloud-sync-btn").onclick=syncOfficialSeed;
  $("#print-btn").onclick=()=>window.print();
  $$('[data-close-modal]').forEach(b=>b.onclick=()=>closeModal(b.dataset.closeModal));
  $$('[data-export]').forEach(b=>b.onclick=()=>exportData(b.dataset.export));
  $("#save-btn").onclick=saveEdit; $("#delete-btn").onclick=deleteEdit;
}

function bindDynamicEvents(){
  $$('[data-day]').forEach(b=>b.onclick=()=>{state.activeDay=Number(b.dataset.day);renderContent();});
  const all=$("#show-all-route");if(all)all.onclick=()=>{state.activeDay=null;renderContent();};
  $$('[data-edit-table]').forEach(b=>b.onclick=()=>openEditor(b.dataset.editTable,b.dataset.id,false));
  $$('[data-add]').forEach(b=>b.onclick=()=>openEditor(b.dataset.add,null,true));
  const addNote=$("#add-note");if(addNote)addNote.onclick=addNoteHandler;
  $$('[data-delete-note]').forEach(b=>b.onclick=()=>deleteNote(b.dataset.deleteNote));
  const shift=$("#shift-day-date");if(shift)shift.onclick=shiftDates;
  const refresh=$("#refresh-fares");if(refresh)refresh.onclick=async()=>{
    showLoader(true);
    const ok=await loadLivePrices();
    showLoader(false);
    renderStats();renderContent();
    toast(ok?"최신 운임 스냅샷을 다시 읽었습니다.":"운임 파일을 불러오지 못했습니다.");
  };
  let dragged=null;
  const clearDragState=()=>{
    $$(".event-card.dragging,.event-card.drop-target").forEach(card=>card.classList.remove("dragging","drop-target"));
    dragged=null;
  };
  $$(".event-card[draggable='true']").forEach(card=>{
    card.ondragstart=()=>{dragged=card.dataset.eventId;card.classList.add("dragging");};
    card.ondragend=clearDragState;
    card.ondragover=e=>e.preventDefault();
    card.ondragenter=()=>{if(dragged&&dragged!==card.dataset.eventId)card.classList.add("drop-target");};
    card.ondragleave=()=>card.classList.remove("drop-target");
    card.ondrop=async e=>{
      e.preventDefault();
      const source=dragged,target=card.dataset.eventId;
      clearDragState();
      if(source&&target&&source!==target)await reorderEvents(source,target);
    };
  });
  $$("[data-move-event]").forEach(button=>{
    button.onclick=()=>moveEventBy(button.dataset.moveEvent,Number(button.dataset.direction));
  });

  let touchDrag=null;
  $$("[data-drag-handle]").forEach(handle=>{
    handle.onpointerdown=e=>{
      if(e.pointerType==="mouse" || e.button!==0)return;
      const card=handle.closest(".event-card");
      if(!card)return;
      e.preventDefault();
      touchDrag={pointerId:e.pointerId,sourceId:card.dataset.eventId,targetId:card.dataset.eventId};
      card.classList.add("dragging");
      try{handle.setPointerCapture(e.pointerId);}catch(_err){}
    };
    handle.onpointermove=e=>{
      if(!touchDrag || touchDrag.pointerId!==e.pointerId)return;
      e.preventDefault();
      const target=document.elementFromPoint(e.clientX,e.clientY)?.closest(".event-card");
      $$(".event-card.drop-target").forEach(card=>card.classList.remove("drop-target"));
      if(target && target.dataset.eventId!==touchDrag.sourceId){
        target.classList.add("drop-target");
        touchDrag.targetId=target.dataset.eventId;
      }
      const edge=72;
      if(e.clientY<edge)window.scrollBy({top:-14,behavior:"auto"});
      else if(e.clientY>window.innerHeight-edge)window.scrollBy({top:14,behavior:"auto"});
    };
    handle.onpointerup=async e=>{
      if(!touchDrag || touchDrag.pointerId!==e.pointerId)return;
      const {sourceId,targetId}=touchDrag;
      touchDrag=null;
      try{handle.releasePointerCapture(e.pointerId);}catch(_err){}
      clearDragState();
      if(sourceId&&targetId&&sourceId!==targetId)await reorderEvents(sourceId,targetId);
    };
    handle.onpointercancel=e=>{
      if(touchDrag?.pointerId!==e.pointerId)return;
      touchDrag=null;
      clearDragState();
    };
  });
}

async function moveEventBy(eventId,direction){
  const rows=state.data.events.filter(x=>Number(x.day_id)===Number(state.activeDay)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const index=rows.findIndex(x=>String(x.id)===String(eventId));
  const target=rows[index+direction];
  if(index<0 || !target)return toast(direction<0?"이미 첫 일정입니다.":"이미 마지막 일정입니다.");
  await reorderEvents(eventId,target.id);
}

async function reorderEvents(sourceId,targetId){
  const rows=state.data.events.filter(x=>Number(x.day_id)===Number(state.activeDay)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const from=rows.findIndex(x=>String(x.id)===String(sourceId)),to=rows.findIndex(x=>String(x.id)===String(targetId));if(from<0||to<0)return;
  const [moved]=rows.splice(from,1);rows.splice(to,0,moved);
  rows.forEach((row,index)=>{row.sort_order=(index+1)*10;});
  if(state.mode!=="cloud"){
    saveLocalEventOrder(rows);
    renderContent();
    return toast("일정 순서를 이 기기에 저장했습니다. 지도에서 같은 Day를 열면 갱신된 일정과 함께 확인할 수 있습니다.");
  }
  showLoader(true);
  try{for(let i=0;i<rows.length;i++){const{error}=await supabase.from("events").update({sort_order:(i+1)*10}).eq("id",rows[i].id);if(error)throw error;}await loadCloud();render();toast("일정 순서와 지도를 갱신했습니다.");}catch(err){toast(`순서 변경 실패: ${err.message}`);}finally{showLoader(false);}
}
async function shiftDates(){
  const current=state.data.days.find(d=>Number(d.id)===Number(state.activeDay)),value=$("#active-day-date").value;if(!current||!value)return;
  const delta=Math.round((new Date(value+"T00:00:00Z")-new Date(current.date+"T00:00:00Z"))/86400000);if(!delta)return toast("같은 날짜입니다.");
  if(!confirm(`Day ${current.id}부터 이후 일정을 ${delta>0?"+":""}${delta}일 이동하고 항공·숙박 검색 날짜도 함께 바꿀까요?`))return;
  const add=(s,n)=>{const d=new Date(s+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};showLoader(true);
  try{
    for(const d of state.data.days.filter(x=>Number(x.id)>=Number(current.id))){
      const old=d.date,next=add(old,delta);let q=await supabase.from("days").update({date:next}).eq("id",d.id);if(q.error)throw q.error;
      for(const f of state.data.flights.filter(x=>x.date===old)){q=await supabase.from("flights").update({date:next,status:"가격 재확인"}).eq("id",f.id);if(q.error)throw q.error;}
      for(const h of state.data.hotels.filter(x=>x.check_in===old||x.check_out===old)){q=await supabase.from("hotels").update({check_in:add(h.check_in,delta),check_out:add(h.check_out,delta),status:"가격 재확인"}).eq("id",h.id);if(q.error)throw q.error;}
    }
    await loadCloud();render();toast("일정·항공·숙박 날짜를 연쇄 변경했습니다.");
  }catch(err){toast(`날짜 변경 실패: ${err.message}`);}finally{showLoader(false);}
}

function cleanRows(table,rows){
  return rows.map((r,idx)=>{
    const x={...r},sourceId=x.id;delete x.id;delete x.updated_at;delete x.updated_by;delete x.created_at;
    if(table==="events"){
      x.booking_url=x.booking_url||x.official_url||x.map_url||null;
      const extra=[x.official_url&&`공식: ${x.official_url}`,x.map_url&&`지도: ${x.map_url}`].filter(Boolean).join(" | ");
      if(extra)x.notes=[x.notes,extra].filter(Boolean).join("\n");
      delete x.official_url;delete x.map_url;
    }
    if(table==="map_points")x.code=x.code||String(sourceId||`P${idx+1}`).toUpperCase();
    if(x.sort_order==null)x.sort_order=(idx+1)*10;
    return x;
  });
}

async function syncOfficialSeed(){
  if(!state.user)return toast("Supabase 익명 공동편집을 먼저 활성화해야 합니다.");
  if(!confirm("현재 클라우드 데이터를 JSON으로 자동 백업한 뒤 새 기준안으로 교체합니다. 팀 메모는 삭제하지 않습니다. 계속할까요?"))return;
  showLoader(true);
  try{
    const results=await Promise.all(TABLES.map(async table=>{
      const {data,error}=await supabase.from(table).select("*");
      if(error)throw error;
      return [table,data||[]];
    }));
    const snapshot=Object.fromEntries(results);
    const stamp=new Date().toISOString().slice(0,19).replaceAll(":","-");
    download(`offshore-wind-trip-backup-${stamp}.json`,JSON.stringify({version:`pre-${APP_VERSION}`,created_at:new Date().toISOString(),...snapshot},null,2),"application/json");

    const replaceTables=["events","flights","hotels","meetings","transport_options","restaurants","map_points","budget_items"];
    for(const table of replaceTables){const {error}=await supabase.from(table).delete().neq("id","00000000-0000-0000-0000-000000000000");if(error)throw error;}
    {const {error}=await supabase.from("days").delete().gte("id",1);if(error)throw error;}
    {const {error}=await supabase.from("days").insert(officialSeed.days.map(({id,date,weekday,cities,lodging,summary})=>({id,date,weekday,cities,lodging,summary})));if(error)throw error;}
    for(const table of replaceTables){
      const rows=cleanRows(table,officialSeed[table]);const {error}=await supabase.from(table).insert(rows);if(error)throw error;
    }
    for(const note of snapshot.team_notes.filter(n=>n.author_name!=="SYSTEM"&&n.day_id!=null)){
      const {error}=await supabase.from("team_notes").update({day_id:note.day_id}).eq("id",note.id);
      if(error)throw error;
    }
    {const {error}=await supabase.from("team_notes").delete().eq("author_name","SYSTEM").like("content","__EU_FIRST_%");if(error)throw error;}
    {const {error}=await supabase.from("team_notes").insert({content:MARKER,author_name:"SYSTEM"});if(error)throw error;}
    localStorage.removeItem(LOCAL_ORDER_KEY);
    await loadCloud();toast("기준안을 안전 적용했습니다. 기존 팀 메모는 보존됐습니다.");render();
  }catch(err){
    console.error(err);
    toast(`적용 중단: ${err.message||err}. 내려받은 백업 파일을 보관하십시오.`);
  }finally{showLoader(false);}
}

const fieldTypes={day_id:"number",min_krw:"number",max_krw:"number",original_min:"number",original_max:"number",nights:"number",rooms:"number",photo_allowed:"checkbox",ppe_required:"checkbox",interpreter_needed:"checkbox",notes:"textarea",agenda:"textarea",reason:"textarea"};
const eventFields=["day_id","time_start","time_end","title","category","location","transport","duration","original_currency","original_min","original_max","min_cost_krw","max_cost_krw","cost_basis","booking_url","notes","sort_order"];
function openEditor(table,id,isNew){
  if(!isEditable()){toast(state.user?"먼저 기준안을 클라우드에 안전 적용하십시오.":"익명 공동편집 연결이 필요합니다.");return;}
  const rows=state.data[table]||[];const def=table==="events"?{title:"일정",fields:eventFields,labels:{}}:tableDefs[table];
  const row=isNew?defaultRow(table):rows.find(r=>String(r.id)===String(id));if(!row)return;
  state.editing={table,row:{...row},isNew};$("#edit-title").textContent=`${def.title} ${isNew?"추가":"편집"}`;
  $("#delete-btn").hidden=isNew;
  $("#edit-form").innerHTML=def.fields.map(f=>fieldHtml(f,row[f],def.labels?.[f]||f)).join("");
  openModal("edit-modal");
}
function defaultRow(table){
  if(table==="events")return{day_id:state.activeDay,title:"",sort_order:99};
  if(table==="flights")return{day_id:state.activeDay,status:"미정",sort_order:99};
  if(table==="hotels")return{day_id:state.activeDay,name:"",rooms:2,status:"미정",sort_order:99};
  if(table==="meetings")return{day_id:state.activeDay,organization:"",status:"미정",photo_allowed:false,ppe_required:false,interpreter_needed:false,sort_order:99};
  if(table==="transport_options")return{region:"",recommendation:"미정",sort_order:99};
  if(table==="restaurants")return{day_id:state.activeDay,name:"",sort_order:99};
  if(table==="budget_items")return{category:"기타",label:"",min_krw:0,max_krw:0,sort_order:99};return{};
}
function fieldHtml(f,v,label){const type=fieldTypes[f]||"text";if(type==="checkbox")return`<div class="field"><label>${esc(label)}</label><input name="${f}" type="checkbox" ${v?"checked":""}></div>`;if(type==="textarea")return`<div class="field full"><label>${esc(label)}</label><textarea name="${f}" rows="3">${esc(v)}</textarea></div>`;return`<div class="field ${["title","location","booking_url","url","alternative"].includes(f)?"full":""}"><label>${esc(label)}</label><input name="${f}" type="${type}" value="${esc(v)}"></div>`;}

async function saveEdit(){
  const ed=state.editing;if(!ed)return;const form=new FormData($("#edit-form"));const patch={};
  [...$("#edit-form").elements].forEach(el=>{if(!el.name)return;const type=fieldTypes[el.name]||"text";patch[el.name]=type==="checkbox"?el.checked:type==="number"?(el.value===""?null:Number(el.value)):el.value||null;});
  showLoader(true);try{let q;if(ed.isNew)q=supabase.from(ed.table).insert(patch);else q=supabase.from(ed.table).update(patch).eq("id",ed.row.id);const{error}=await q;if(error)throw error;closeModal("edit-modal");await loadCloud();render();toast("저장했습니다.");}catch(err){toast(err.message);}finally{showLoader(false);}
}
async function deleteEdit(){const ed=state.editing;if(!ed||!confirm("이 항목을 삭제할까요?"))return;showLoader(true);const{error}=await supabase.from(ed.table).delete().eq("id",ed.row.id);showLoader(false);if(error)return toast(error.message);closeModal("edit-modal");await loadCloud();render();toast("삭제했습니다.");}
async function addNoteHandler(){const content=$("#note-content").value.trim();if(!content)return;const day=$("#note-day").value;const{error}=await supabase.from("team_notes").insert({content,day_id:day?Number(day):null,author_name:"익명 팀원"});if(error)return toast(error.message);await loadCloud();render();toast("메모를 등록했습니다.");}
async function deleteNote(id){if(!confirm("메모를 삭제할까요?"))return;const{error}=await supabase.from("team_notes").delete().eq("id",id);if(error)return toast(error.message);await loadCloud();render();}

function exportData(type){
  const data={version:APP_VERSION,meta:tripMeta,...state.data};
  if(type==="json")return download(`offshore-wind-trip-${APP_VERSION}.json`,JSON.stringify(data,null,2),"application/json");
  const rows=[];Object.entries(state.data).forEach(([table,items])=>(items||[]).forEach(item=>rows.push({table,...item})));
  const keys=[...new Set(rows.flatMap(Object.keys))];const csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replaceAll('"','""')}"`).join(","))].join("\n");download("offshore-wind-trip-all.csv","\ufeff"+csv,"text/csv;charset=utf-8");
}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

init();
