import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";
import { buildReportMemo } from "./report-memo.js?v=LIVE_TRAVEL_V17";

const BUILD="LIVE_TRAVEL_V17",TRANSIT_URL="./transit-live.json";
const s={plan:DEFAULT_ITINERARY,transit:null,loaded:0,modalEvent:null};
const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const norm=v=>String(v||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9가-힣]+/g," ").trim();
const plan=()=>{const k=document.querySelector(".itinerary-tab.active")?.dataset.itinerary;if(k&&ITINERARIES[k])s.plan=k;return ITINERARIES[s.plan]||ITINERARIES[DEFAULT_ITINERARY];};
const liveSeed=()=>{const x=window.__tripDashboardLiveData?.();return x?.events&&x?.days?x:plan().officialSeed;};
const eventById=id=>(liveSeed().events||[]).find(e=>String(e.id)===String(id));
const dayById=id=>(liveSeed().days||[]).find(d=>Number(d.id)===Number(id));
const provider=id=>(s.transit?.providers||[]).find(p=>p.id===id);

function providerIds(e){
  const t=`${e?.title||""} ${e?.location||""} ${e?.transport||""} ${e?.category||""}`,ids=[];
  if(/THSR|high.?speed/i.test(t))ids.push("thsr");
  if(/Airport MRT|Taoyuan.*MRT|공항.*MRT/i.test(t))ids.push("taoyuan_mrt");
  if(/Rotterdam|Schiphol/i.test(t)&&/NS|Intercity|train|rail|철도|열차/i.test(t))ids.push("ns");
  if(/Rotterdam|Delfshaven|Erasmusbrug|Katendrecht|Wilhelminaplein/i.test(t)&&/metro|메트로|tram|트램|bus|버스/i.test(t))ids.push("ret");
  if(/Waterbus|WaterShuttle|Kinderdijk|킨더다이크/i.test(t))ids.push("waterbus");
  if(/Hamburg Hbf|Rotterdam.*Hamburg|DB\/|DB |Hamburg.*Esbjerg/i.test(t)&&/train|rail|철도|열차|DB/i.test(t))ids.push("db");
  if(/HVV|U-Bahn|S-Bahn|Landungsbr|HafenCity/i.test(t))ids.push("hvv");
  if(/DSB|Esbjerg St\.?|København H|Copenhagen Central/i.test(t)){ids.push("dsb","rejseplanen");}
  if(/Copenhagen|København|Ørestad|Esbjerg/i.test(t)&&/metro|subway|지하철|버스|bus|기차|train/i.test(t))ids.push("rejseplanen");
  return [...new Set(ids)];
}
const statusClass=p=>p?.status==="normal"?"normal":p?.status==="alert"?"alert":p?.status==="source_error"?"error":"live";
const statusLabel=p=>p?.status==="normal"?"정상":p?.status==="alert"?"운행공지":p?.status==="source_error"?"수집오류":"최신";
function stamp(p){try{return new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(p.fetched_at))+" KST";}catch{return p?.fetched_at||"미확인";}}
const scheduleStatusLabel=status=>status==="confirmed"?"확정":status==="provisional"?"재확인":status==="flexible"?"현장 선택":"시간표";
function scheduleLegs(e,compact=false){const legs=e?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||e.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}
function transitBox(e,compact=false){const rows=providerIds(e).map(provider).filter(Boolean);if(!rows.length)return"";return `<div class="transit-live-box ${compact?"compact":""}"><div class="transit-provider-summary">${rows.map(p=>`<span class="transit-summary-pill ${statusClass(p)}"><i></i>${esc(p.name)} · ${esc(statusLabel(p))}</span>`).join("")}</div><button type="button" class="btn small transit-inside-btn" data-v16-transit="${esc(e.id)}">🚌 대시보드에서 실시간 확인</button></div>`;}

function ensureModal(){let m=document.getElementById("dashboard-transit-modal");if(m)return m;m=document.createElement("div");m.id="dashboard-transit-modal";m.className="dashboard-transit-modal";m.hidden=true;m.innerHTML=`<div class="dashboard-transit-dialog" role="dialog" aria-modal="true"><div class="dashboard-transit-head"><div><b>대중교통 실시간 정보</b><small>공식 운영사 페이지 자동수집 최신값</small></div><button class="btn small" type="button" data-v16-close>닫기</button></div><div id="dashboard-transit-body"></div><div class="dashboard-transit-foot"><span>대시보드 안에서 확인하며 외부 링크 이동이 필요 없습니다.</span><button class="btn small primary" type="button" data-v16-refresh>실시간 다시 읽기</button></div></div>`;document.body.append(m);return m;}
function openTransit(e){const m=ensureModal(),rows=providerIds(e).map(provider).filter(Boolean);m.querySelector("#dashboard-transit-body").innerHTML=`<div class="transit-modal-event"><b>${esc(e.title)}</b><span>${esc(e.time_start)}~${esc(e.time_end)} · ${esc(e.transport)}</span>${scheduleLegs(e)}</div>${rows.map(p=>`<article class="transit-modal-card ${statusClass(p)}"><div class="transit-modal-card-head"><b>${esc(p.name)}</b><span>${esc(statusLabel(p))}</span></div><p>${esc(p.summary||"공식 운행정보 수집 중")}</p><small>최근 수집 ${esc(stamp(p))}</small></article>`).join("")||'<div class="empty">연결된 운영사가 없습니다.</div>'}`;m.hidden=false;document.body.classList.add("transit-modal-open");s.modalEvent=e.id;}
function closeModal(){const m=document.getElementById("dashboard-transit-modal");if(m)m.hidden=true;document.body.classList.remove("transit-modal-open");s.modalEvent=null;}

function hotelMatches(e){const seed=liveSeed(),d=dayById(e.day_id),t=norm(`${e.title} ${e.location}`),rows=seed.hotels||[];const exact=rows.filter(h=>t.includes(norm(h.name))||norm(h.name).includes(t));if(exact.length)return exact;if(!d||!/숙박|호텔|체크인|체크아웃|조식/i.test(`${e.category} ${e.title}`))return[];return rows.filter(h=>d.date>=h.check_in&&d.date<=h.check_out).slice(0,1);}
function restaurantMatches(e){const rows=(liveSeed().restaurants||[]).filter(r=>Number(r.day_id)===Number(e.day_id));const t=norm(`${e.title} ${e.location}`),exact=rows.filter(r=>t.includes(norm(r.name))||norm(r.name).includes(t));return exact.length?exact:(/식사|점심|저녁|조식|맛집/i.test(`${e.category} ${e.title}`)?rows:[]);}
const maps=q=>`https://www.google.com/maps/search/?${new URLSearchParams({api:"1",query:q}).toString()}`;
const hotels=h=>`https://www.google.com/travel/hotels?q=${encodeURIComponent(`${h.name} ${h.city||""} ${h.check_in||""} ${h.check_out||""}`)}&hl=ko&curr=KRW`;
function mapPlaces(e){const a=[];try{const u=new URL(e.map_url),p=u.searchParams;for(const k of ["origin","saddr","destination","daddr","query","q"]){const v=p.get(k);if(v)a.push(v);}for(const v of String(p.get("waypoints")||"").split("|"))if(v)a.push(v);}catch{}return a;}
const noise=/조식|체크아웃|체크인|짐\s*보관|회의|현장견학|이동|입국|출국|수속|내용\s*정리|일정\s*점검|환승$|귀국|산책$|휴식|중식|업무공간/;
function placeLinks(e,compact=false){const out=[],seen=[];const add=(label,url,kind="place")=>{label=String(label||"").replace(/\+/g," ").replace(/\s+/g," ").trim();const n=norm(label);if(!label||!n||seen.some(x=>x===n||x.includes(n)||n.includes(x)))return;seen.push(n);out.push({label,url,kind});};for(const h of hotelMatches(e))add(h.name,hotels(h),"hotel");for(const r of restaurantMatches(e))add(r.name,r.url||maps(`${r.name} ${r.city||""}`),"restaurant");for(const x of mapPlaces(e))add(x,maps(x));for(const x of String(e.location||"").split(/\s*→\s*/))if(x.trim())add(x,maps(x.trim()));for(let x of String(e.title||"").split("·")){x=x.replace(/\s*(?:점심|저녁|일몰|외부|산책)$/g,"").trim();if(x.length>2&&!noise.test(x)&&!x.includes("→"))add(x,maps(x));}if(!out.length&&e.location)add(e.location,maps(e.location));return out.length?`<div class="all-place-links ${compact?"compact":""}"><span class="all-place-links-label">📍 장소</span>${out.map(x=>`<a class="entity-name-link ${x.kind}" href="${esc(x.url)}" target="_blank" rel="noreferrer">${esc(x.label)} ↗</a>`).join("")}</div>`:"";}

const clock=v=>{const m=String(v||"").match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):null;};
function totalMinutes(e){const a=clock(e.time_start),b=clock(e.time_end);return a==null||b==null?0:(b<a?b+1440:b)-a;}
function at(e,n){const a=clock(e.time_start);if(a==null)return"";const v=(a+n)%1440;return `${String(Math.floor(v/60)).padStart(2,"0")}:${String(v%60).padStart(2,"0")}`;}
const leg=(e,a,b,label,kind)=>({start:at(e,a),end:at(e,b),minutes:b-a,label,kind});
function tpe(e){const t=totalMinutes(e)||140;return[leg(e,0,25,"택시 · 타이중 시내 → THSR Taichung","move"),leg(e,25,45,"THSR 승차 대기·탑승","wait"),leg(e,45,90,"THSR · Taichung → Taoyuan","move"),leg(e,90,102,"A18 환승·도보","wait"),leg(e,102,125,"Airport MRT · A18 → TPE","move"),leg(e,125,t,"터미널 이동·출국 준비 버퍼","wait")];}
function fixed(e){const t=totalMinutes(e);if(!t)return null;if(e.id==="d3-03")return tpe(e);if(e.id==="d3-01")return[leg(e,0,20,"택시 · 호텔 → National Taichung Theater","move"),leg(e,20,t,"극장·Calligraphy Greenway 관람·도보","stay")];if(e.id==="d3-02")return[leg(e,0,10,"택시 · 극장권 → Miyahara/구도심","move"),leg(e,10,t,"Miyahara·구도심 도보·점심","stay")];const z={
"d1-03":[[0,40,"입국심사·수하물","stay"],[40,85,"택시 · RMQ → 호텔","move"],[85,110,"호텔 짐 보관","stay"]],
"d1-07":[[0,15,"차량 · TIPC → Wuqi Fishing Harbor","move"],[15,45,"우치어항 체류","stay"],[45,65,"차량 · 우치어항 → Gaomei Wetlands","move"],[65,130,"가오메이 습지 체류·일몰","stay"]],
"d1-08":[[0,75,"차량 · Gaomei Wetlands → 호텔","move"],[75,100,"호텔 체크인","stay"]],
"d2-04":[[0,15,"기사차량 · VESTAS Base → Lukang Old Street","move"],[15,90,"루강 옛거리·용산사 도보 체류","stay"]],
"d4-03":[[0,10,"도보 · 메트로 승강장 이동","move"],[10,20,"RET 메트로 · Blaak 방면","move"],[20,-1,"Markthal·Cube Houses·Oude Haven 도보·식사","stay"]],
"d4-05":[[0,20,"RET 트램 · Delfshaven 방면","move"],[20,100,"Delfshaven·Erasmusbrug 도보 체류","stay"],[100,115,"트램/도보 · Bazar 이동","move"],[115,-1,"Restaurant Bazar 저녁","stay"]],
"d5-03":[[0,15,"도보 · Erasmusbrug 선착장","move"],[15,65,"Waterbus/WaterShuttle · Rotterdam → Kinderdijk","move"],[65,-1,"Kinderdijk 풍차군 도보 체류","stay"]],
"d5-04":[[0,15,"RET 메트로 · Katendrecht 방면","move"],[15,-1,"Fenix Food Factory·항만 저녁","stay"]],
"d6-04":[[0,35,"Wilhelminaplein 인근 점심","stay"],[35,55,"택시 · ROG 이동","move"]],
"d6-08":[[0,25,"택시 · TNO → PREMIER SUITES Weena 710","move"],[25,30,"수하물 회수","wait"],[30,35,"도보 · PREMIER SUITES → Rotterdam Centraal","move"]],
"d7-07":[[0,35,"Best Western St. Raphael → Elbphilharmonie · U-Bahn/도보","move"],[35,105,"Elbphilharmonie Plaza 체류","stay"],[105,125,"HVV · Landungsbrücken 이동","move"],[125,240,"Landungsbrücken 산책·저녁","stay"]],
"d8-01":[[0,55,"조식·체크아웃·호텔에 수하물 임시보관","stay"]],
"d8-011":[[0,15,"택시 · Best Western St. Raphael → DNV Brooktorkai 18","move"]],
"d8-012":[[0,70,"DNV Hamburg 기술미팅 · Digital Twin·인증·기술검증","stay"]],
"d8-013":[[0,15,"택시 · DNV → Best Western St. Raphael","move"],[15,25,"호텔 수하물 회수","wait"],[25,40,"호텔 → Hamburg Hbf","move"]],
"d8-03":[[0,12,"도보 · Esbjerg St. → CABINN Plus","move"],[12,50,"호텔 체크인·정비","stay"]],
"d8-04":[[0,25,"버스 · 도심 → Sædding Strand","move"],[25,180,"Men at Sea·박물관 외부 도보 체류","stay"]],
"d9-04":[[0,120,"전용차량 · Blue Water Shipping Esbjerg → Kolding → Vejle → Horsens → OWC Aarhus","move"]],
"d9-05":[[0,75,"Aarhus 도착·점심·15:00 OWC 미팅 준비","stay"]],
"d9-055":[[0,90,"OWC Denmark 기술미팅 · René Aagaard / Rune Nørgaard","stay"]],
"d9-06":[[0,10,"OWC 미팅 핵심내용 메모","stay"],[10,20,"도보 · Banegårdspladsen 4 → Aarhus H","move"],[20,35,"승차 준비","wait"]],
"d9-07":[[0,196,"DSB InterCityLyn 후보 · Aarhus H → Skanderborg → Horsens → Vejle → Fredericia → Odense → Ringsted → København H","move"]],
"d9-08":[[0,20,"København H → Ørestad 지역열차","move"],[20,30,"Ørestad → CABINN Metro 도보","move"],[30,84,"체크인·간단한 저녁","stay"]],
"d10-01":[[0,20,"호텔 체크아웃","stay"],[20,35,"도보 · CABINN Metro → Ørestad Station","move"],[35,50,"기차 · Ørestad → CPH","move"],[50,75,"터미널 이동·수속 버퍼","wait"]]};return z[e.id]?.map(([a,b,l,k])=>leg(e,a,b===-1?t:b,l,k))||null;}
function generic(e){const t=totalMinutes(e);if(!t)return[];const p=String(e.transport||"").split("+").map(x=>x.trim()).filter(Boolean);if(p.length>1){const activity=/관광|식사|업무|숙박|개인정비/.test(e.category||"")&&t>=60;if(activity){const m=Math.min(20,Math.max(8,Math.round(t*.12))),r=[];let a=0;for(const x of p){r.push(leg(e,a,Math.min(t,a+m),`${x} 이동`,`move`));a+=m;}if(a<t)r.push(leg(e,a,t,"목적지 체류","stay"));return r;}const n=Math.floor(t/p.length);return p.map((x,i)=>leg(e,i*n,i===p.length-1?t:(i+1)*n,`${x} 이동`,`move`));}const k=/교통|항공|출국·교통/.test(e.category||"")?"move":/환승/.test(e.category||"")?"wait":"stay";return[leg(e,0,t,k==="move"?"이동":k==="wait"?"대기·환승":"체류",k)];}
function breakdown(e){const r=fixed(e)||generic(e);if(!r.length)return"";const sum=k=>r.filter(x=>x.kind===k).reduce((a,x)=>a+x.minutes,0),m=sum("move"),w=sum("wait"),st=sum("stay");return `<div class="event-time-breakdown"><div class="event-time-breakdown-head"><b>시간 구분</b><span>${m?`이동 ${m}분`:""}${w?` · 대기/환승 ${w}분`:""}${st?` · 체류 ${st}분`:""}</span></div><div class="event-leg-list">${r.map(x=>`<div class="event-leg ${x.kind}"><span class="event-leg-time">${esc(x.start)}–${esc(x.end)}</span><span class="event-leg-kind">${x.kind==="move"?"이동":x.kind==="wait"?"대기·환승":"체류"}</span><b>${esc(x.label)}</b></div>`).join("")}</div></div>`;}

function mapButton(body,e){body.querySelectorAll(".link-row a").forEach(a=>{if(/^지도/.test(a.textContent.trim())||/google\..*\/maps|maps\.google/i.test(a.href)){const b=document.createElement("button");b.type="button";b.className="dashboard-map-link";b.dataset.v16Map=e.id;b.textContent="🗺 지도 메뉴에서 이 일정 보기";a.replaceWith(b);}});const u=body.querySelector("[data-map-event-id]");if(u){u.removeAttribute("data-map-event-id");u.dataset.v16Map=e.id;u.textContent="🗺 지도 메뉴에서 이 일정 보기";}if(!body.querySelector("[data-v16-map]")){let row=body.querySelector(".link-row");if(!row){row=document.createElement("div");row.className="link-row";body.append(row);}row.insertAdjacentHTML("beforeend",`<button type="button" class="dashboard-map-link" data-v16-map="${esc(e.id)}">🗺 지도 메뉴에서 이 일정 보기</button>`);}}
function openMap(id){const tab=document.querySelector('#tabs [data-tab="map"]');if(tab&&!tab.classList.contains("active"))tab.click();const go=()=>{const b=[...document.querySelectorAll("#route-list [data-stable-map-event]")].find(x=>String(x.dataset.stableMapEvent)===String(id));const ok=window.__tripMapFocus?.(id);if(b)b.scrollIntoView({behavior:"smooth",block:"center"});else if(ok)document.querySelector("#map")?.scrollIntoView({behavior:"smooth",block:"center"});};[80,180,360,700,1100].forEach(ms=>setTimeout(go,ms));}
window.__openDashboardMapEvent=openMap;

document.addEventListener("click",async ev=>{const b=ev.target.closest?.("[data-report-copy]");if(!b)return;ev.preventDefault();const e=eventById(b.dataset.reportCopy);if(!e)return;const text=buildReportMemo(e,dayById(e.day_id),liveSeed().meetings||[]);try{await navigator.clipboard.writeText(text);b.textContent="복사됨";setTimeout(()=>b.textContent="복사",1200);}catch{const ta=document.createElement("textarea");ta.value=text;document.body.append(ta);ta.select();document.execCommand("copy");ta.remove();b.textContent="복사됨";setTimeout(()=>b.textContent="복사",1200);}});
window.addEventListener("trip-data-changed",()=>setTimeout(decorate,0));

function decorateTimeline(){const seed=liveSeed(),ev=seed.events||[];document.querySelectorAll("#main-content .event-card[data-event-id]").forEach(card=>{const e=ev.find(x=>String(x.id)===String(card.dataset.eventId));if(!e)return;const body=card.querySelector(":scope > div:nth-child(2)");if(!body)return;body.querySelector(":scope > .all-place-links")?.remove();body.querySelector(":scope > .transit-live-box")?.remove();body.querySelector(":scope > .event-time-breakdown")?.remove();body.querySelector(":scope > .transport-schedule")?.remove();(body.querySelector(".meta")||body.querySelector(".event-title"))?.insertAdjacentHTML("afterend",`${breakdown(e)}${scheduleLegs(e)}`);const p=placeLinks(e);if(p)body.insertAdjacentHTML("beforeend",p);const t=transitBox(e);if(t)body.insertAdjacentHTML("beforeend",t);body.querySelector(":scope > .report-copy-memo")?.remove();const memo=buildReportMemo(e,dayById(e.day_id),seed.meetings||[]);if(memo)body.insertAdjacentHTML("beforeend",`<div class="report-copy-memo"><div class="report-copy-head"><b>📄 보고서용 메모</b><button type="button" class="btn small" data-report-copy="${esc(e.id)}">복사</button></div><pre>${esc(memo)}</pre><small>일정·장소·교통·회의 데이터에서 자동 생성 · 일정 수정 시 함께 갱신</small></div>`);mapButton(body,e);});}
function decorateMap(){document.querySelectorAll("#route-list [data-stable-map-event]").forEach(b=>{const e=eventById(b.dataset.stableMapEvent);if(!e)return;let x=b.nextElementSibling;if(!x||!x.classList.contains("map-sidebar-live-extras")){x=document.createElement("div");x.className="map-sidebar-live-extras";b.after(x);}x.innerHTML=`${scheduleLegs(e,true)}${placeLinks(e,true)}${transitBox(e,true)}`;x.hidden=!x.innerHTML.trim();});}
function decorate(){decorateTimeline();decorateMap();}
async function load(force=false){if(!force&&s.transit&&Date.now()-s.loaded<120000){decorate();return;}try{const r=await fetch(`${TRANSIT_URL}?ts=${Date.now()}`,{cache:"no-store"});if(!r.ok)throw Error(`HTTP ${r.status}`);s.transit=await r.json();s.loaded=Date.now();}catch(e){console.warn(`[${BUILD}] transit`,e);}decorate();}

const main=document.getElementById("main-content"),observer=main?new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(decorate,100);}):null;if(observer)observer.observe(main,{childList:true,subtree:false});
document.addEventListener("click",e=>{const m=e.target.closest("[data-v16-map]");if(m){e.preventDefault();e.stopPropagation();openMap(m.dataset.v16Map);return;}const t=e.target.closest("[data-v16-transit]");if(t){e.preventDefault();e.stopPropagation();const ev=eventById(t.dataset.v16Transit);if(ev)openTransit(ev);return;}if(e.target.closest("[data-v16-close]")){closeModal();return;}if(e.target.closest("[data-v16-refresh]")){const id=s.modalEvent;load(true).then(()=>{const ev=eventById(id);if(ev)openTransit(ev);});return;}if(e.target.id==="dashboard-transit-modal"){closeModal();return;}if(e.target.closest(".day-tab,.itinerary-tab,#tabs [data-tab],#show-all-route")){[100,220,450,850].forEach(ms=>setTimeout(decorate,ms));}},true);
window.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});window.addEventListener("load",()=>load(true));load(true);
