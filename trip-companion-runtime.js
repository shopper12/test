import { WEATHER_CHECKED_AT, STUDY_PLACES, weatherForDay } from "./travel-study.js?v=FINAL_0830_V2";
import { GUIDE_CHECKED_AT, PRACTICAL_DAYS, TRANSPORT_GUIDE, RESTAURANTS, ATTRACTIONS, REPORT_MEMOS, REPORT_OUTLINE } from "./trip-companion-data.js?v=FINAL_0830_V3";

let companionMode=null;
let practicalDay=0;
let decorating=false;
const esc=(v)=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const noteKey=(org)=>`wind-trip-report-note-${org}`;

function activeDay(){
  const text=document.querySelector(".day-tab.active b")?.textContent||"";
  return Number((text.match(/Day\s*(\d+)/i)||[])[1])||1;
}

function weatherHtml(dayId){
  const w=weatherForDay(dayId); if(!w)return "";
  return `<a class="weather-inline" href="${esc(w.source)}" target="_blank" rel="noreferrer" title="${WEATHER_CHECKED_AT} 확인 예보 · 출발 전 재확인">🌦 ${esc(w.weather)} · 👕 ${esc(w.outfit)} <span>예보↗</span></a>`;
}

function ensureTabs(){
  const host=document.querySelector("#tabs"); if(!host)return;
  const defs=[["practical","🧭 현지가이드"],["report","📝 보고서 메모"],["study","🎬 여행공부"]];
  for(const [mode,label] of defs){
    if(host.querySelector(`[data-companion="${mode}"]`))continue;
    const btn=document.createElement("button");
    btn.className="tab companion-tab"; btn.dataset.companion=mode; btn.textContent=label;
    btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();companionMode=mode;host.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderCompanion();};
    host.append(btn);
  }
}

function decorateWeather(){
  if(decorating)return; decorating=true;
  try{
    const data=window.__tripDashboardLiveData?.(); if(!data)return;
    document.querySelectorAll(".event-card[data-event-id]").forEach(card=>{
      const event=(data.events||[]).find(x=>String(x.id)===String(card.dataset.eventId));
      const meta=card.querySelector(".meta"); if(!event||!meta||meta.querySelector(".weather-inline"))return;
      const loc=[...meta.querySelectorAll("span")].find(s=>s.textContent.trim().startsWith("📍")); if(!loc)return;
      loc.classList.add("location-with-weather"); loc.insertAdjacentHTML("beforeend",weatherHtml(event.day_id));
    });
    document.querySelectorAll(".route-stop").forEach(stop=>{
      if(stop.querySelector(".weather-inline"))return; const b=stop.querySelector("b"); if(!b)return;
      const day=Number((b.textContent.match(/Day\s*(\d+)/i)||[])[1]); if(day)b.insertAdjacentHTML("beforeend",weatherHtml(day));
    });
  }finally{decorating=false;}
}

function planRows(plan){
  return `<div class="guide-plan">${plan.map(([t,title,note])=>`<div class="guide-plan-row"><time>${esc(t)}</time><b>${esc(title)}</b><small>${esc(note)}</small></div>`).join("")}</div>`;
}

function injectSuggestedTimeline(){
  if(companionMode)return;
  const cards=document.querySelector("#main-content .cards"); if(!cards||document.querySelector(".timeline-suggested"))return;
  const d=PRACTICAL_DAYS.find(x=>x.day===activeDay()); if(!d)return;
  cards.insertAdjacentHTML("afterend",`<section class="timeline-suggested"><h3>🧭 Day ${d.day} 추천 보완 일정</h3><p class="suggested-note">미확정 시간은 이동시간·영업시간을 기준으로 잡은 가안입니다. 기관 확정시간이 오면 해당 블록만 이동하세요.</p>${planRows(d.plan)}</section>`);
}

function matchDay(value,day){return !day||String(value).split(/[^0-9]+/).filter(Boolean).map(Number).includes(day);}
function linkRow(item){
  return `<div class="guide-links">${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noreferrer">공식/예약 ↗</a>`:""}${item.booking?`<a href="${esc(item.booking)}" target="_blank" rel="noreferrer">예약 ↗</a>`:""}${item.live?`<a href="${esc(item.live)}" target="_blank" rel="noreferrer">실시간 ↗</a>`:""}${item.map?`<a href="${esc(item.map)}" target="_blank" rel="noreferrer">지도 ↗</a>`:""}</div>`;
}

function renderPractical(){
  const main=document.querySelector("#main-content"); if(!main)return;
  const days=practicalDay?[PRACTICAL_DAYS.find(x=>x.day===practicalDay)].filter(Boolean):PRACTICAL_DAYS;
  const dayBtns=[`<button class="${practicalDay===0?"active":""}" data-guide-day="0">전체</button>`,...PRACTICAL_DAYS.map(d=>`<button class="${practicalDay===d.day?"active":""}" data-guide-day="${d.day}">D${d.day} ${esc(d.city)}</button>`)].join("");
  const trans=TRANSPORT_GUIDE.filter(x=>matchDay(x.day,practicalDay));
  const food=RESTAURANTS.filter(x=>matchDay(x.day,practicalDay));
  const sights=ATTRACTIONS.filter(x=>matchDay(x.day,practicalDay));
  main.innerHTML=`<section class="companion-hero"><span class="companion-eyebrow">${esc(GUIDE_CHECKED_AT)} 재조사</span><h2>현지에서 그대로 쓰는 일정·교통·식당·관광</h2><p>0830 최종 출장동선을 기준으로 다시 조사했습니다. 발권편과 확정 미팅은 건드리지 않고, 비어 있거나 미정인 시간만 현실적인 가안으로 채웠습니다.</p><div class="companion-toolbar">${dayBtns}</div></section>
  ${days.map(d=>`<section class="guide-day"><header><h3>Day ${d.day} · ${esc(d.date)} · ${esc(d.city)}</h3></header>${planRows(d.plan)}</section>`).join("")}
  <h2 class="practical-section-title">🚆 교통·예약</h2><div class="guide-grid">${trans.map(x=>`<article class="guide-card"><div class="kicker">Day ${esc(x.day)} · ${esc(x.mode)}</div><h4>${esc(x.route)}</h4><p><b>${esc(x.time)}</b></p><p>${esc(x.note)}</p>${linkRow(x)}</article>`).join("")}</div>
  <h2 class="practical-section-title">🍽 식당·추천 메뉴</h2><div class="guide-grid">${food.map(x=>`<article class="guide-card"><div class="kicker">Day ${esc(x.day)} · ${esc(x.city)}</div><h4>${esc(x.name)}</h4><p>${esc(x.fit)}</p><p><b>먹을 것</b> ${esc(x.menu)}</p><p><b>영업</b> ${esc(x.hours)}</p><p><b>예약</b> ${esc(x.reserve)}</p>${linkRow(x)}</article>`).join("")}</div>
  <h2 class="practical-section-title">📍 관광·짧은 자유시간</h2><div class="guide-grid">${sights.map(x=>`<article class="guide-card"><div class="kicker">Day ${esc(x.day)} · ${esc(x.city)} · ${esc(x.slot)}</div><h4>${esc(x.name)}</h4><p>${esc(x.why)}</p><p><b>시간</b> ${esc(x.hours)}</p><p><b>입장</b> ${esc(x.ticket)}</p>${linkRow(x)}</article>`).join("")}</div>
  <p class="source-note">열차·항공·기관 일정은 출발 전날 각 운영사 앱에서 다시 확인하세요. 특히 국제열차와 북해권 날씨는 변동 가능성이 큽니다.</p>`;
  main.querySelectorAll("[data-guide-day]").forEach(b=>b.onclick=()=>{practicalDay=Number(b.dataset.guideDay);renderPractical();});
}

function renderReport(){
  const main=document.querySelector("#main-content"); if(!main)return;
  main.innerHTML=`<section class="companion-hero"><span class="companion-eyebrow">출장보고서 전용</span><h2>📝 보고서 메모</h2><p>여행영상·책·맛집과 분리했습니다. 현장에서 바로 적고, 브라우저에 자동 저장한 뒤 전체 메모를 한 번에 복사할 수 있습니다.</p><div class="report-actions"><button id="copy-all-report">전체 보고서 메모 복사</button><button id="clear-report">저장 메모 전체 삭제</button><span class="report-status" id="report-status"></span></div></section>
  <h2>권장 보고서 목차</h2><div class="report-outline">${REPORT_OUTLINE.map(x=>`<div>${esc(x)}</div>`).join("")}</div>
  ${REPORT_MEMOS.map((r,i)=>`<section class="report-org" data-report-index="${i}"><h3>Day ${r.day} · ${esc(r.org)}</h3><div class="report-theme">${esc(r.theme)}</div><div class="report-cols"><div><b>현장에서 반드시 볼 것</b><ul>${r.points.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div><b>확보할 증빙·후속자료</b><ul>${r.evidence.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div><textarea class="report-notes" data-report-org="${esc(r.org)}" placeholder="관찰 사실 / 숫자 / 사진번호 / 담당자 답변 / 한국 적용 아이디어를 여기에 적으세요."></textarea><div class="report-actions"><button data-copy-report="${i}">이 기관 메모 복사</button><span class="report-status"></span></div></section>`).join("")}`;
  main.querySelectorAll(".report-notes").forEach(t=>{t.value=localStorage.getItem(noteKey(t.dataset.reportOrg))||"";t.addEventListener("input",()=>{localStorage.setItem(noteKey(t.dataset.reportOrg),t.value);const s=t.closest(".report-org").querySelector(".report-status");s.textContent="저장됨";clearTimeout(t._st);t._st=setTimeout(()=>s.textContent="",1400);});});
  main.querySelectorAll("[data-copy-report]").forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.copyReport),r=REPORT_MEMOS[i],text=reportText(r);await navigator.clipboard.writeText(text);b.nextElementSibling.textContent="복사됨";});
  document.querySelector("#copy-all-report").onclick=async()=>{await navigator.clipboard.writeText(REPORT_MEMOS.map(reportText).join("\n\n"));document.querySelector("#report-status").textContent="전체 복사됨";};
  document.querySelector("#clear-report").onclick=()=>{if(!confirm("브라우저에 저장된 출장보고서 메모를 모두 삭제할까요?"))return;REPORT_MEMOS.forEach(r=>localStorage.removeItem(noteKey(r.org)));renderReport();};
}

function reportText(r){
  const note=localStorage.getItem(noteKey(r.org))||"";
  return `Day ${r.day} · ${r.org}\n주제: ${r.theme}\n관찰 포인트:\n- ${r.points.join("\n- ")}\n확보자료:\n- ${r.evidence.join("\n- ")}\n현장메모:\n${note}`;
}

function videoCard(v){return `<article class="media-card"><div class="companion-eyebrow">YouTube</div><h4>${esc(v.title)}</h4><div class="media-moments">${(v.moments||[]).map(m=>`<span>⏱ ${esc(m)}</span>`).join("")}</div>${v.note?`<p>${esc(v.note)}</p>`:""}<a href="${esc(v.url)}" target="_blank" rel="noreferrer">영상 보기 ↗</a></article>`;}
function screenCard(v){return `<article class="media-card"><div class="companion-eyebrow">${esc(v.type)}</div><h4>${esc(v.title)}</h4><p><b>장면</b> ${esc(v.scene)}</p><p><b>회차·시간</b> ${esc(v.timing)}</p>${v.note?`<p>${esc(v.note)}</p>`:""}<a href="${esc(v.url)}" target="_blank" rel="noreferrer">로케이션 근거 ↗</a></article>`;}
function bookCard(v){return `<article class="media-card"><div class="companion-eyebrow">📚 ${esc(v.genre)} · ${esc(v.priority)}</div><h4>${esc(v.title)}</h4><p>${esc(v.author)}</p><p>${esc(v.reason)}</p><a href="${esc(v.url)}" target="_blank" rel="noreferrer">작품 정보 ↗</a></article>`;}

function renderStudy(){
  const main=document.querySelector("#main-content"); if(!main)return;
  main.innerHTML=`<section class="companion-hero"><span class="companion-eyebrow">출장 전 예습</span><h2>🎬 유튜브·여행영상·영화/드라마·책</h2><p>보고서 메모와 현지 실용정보는 다른 메뉴로 분리했습니다. 이 메뉴는 장소를 미리 익히는 콘텐츠만 모았습니다.</p></section>${STUDY_PLACES.map(p=>`<section class="media-place"><header><span class="companion-eyebrow">${esc(p.days)}</span><h3>${esc(p.place)}</h3><p>${esc(p.routeMatch)}</p></header><div class="media-columns"><div><h4>▶ YouTube</h4>${p.youtube.length?p.youtube.map(videoCard).join(""):`<div class="media-card">직접 대응 영상 미확인</div>`}</div><div><h4>🎞 영화·드라마</h4>${p.screen.length?p.screen.map(screenCard).join(""):`<div class="media-card">검증된 로케이션 작품 미확인</div>`}</div><div><h4>📚 추리·수사·스릴러</h4>${p.books.length?p.books.map(bookCard).join(""):`<div class="media-card">직접 배경 작품 미확인</div>`}</div></div>${p.gap?`<p class="source-note">확인 한계 · ${esc(p.gap)}</p>`:""}</section>`).join("")}`;
}

function renderCompanion(){if(companionMode==="practical")renderPractical();else if(companionMode==="report")renderReport();else if(companionMode==="study")renderStudy();}

function sync(){ensureTabs();if(companionMode){const btn=document.querySelector(`[data-companion="${companionMode}"]`);document.querySelectorAll("#tabs .tab").forEach(x=>x.classList.toggle("active",x===btn));return;}decorateWeather();injectSuggestedTimeline();}

document.addEventListener("click",e=>{const tab=e.target.closest?.("#tabs .tab");if(tab&&!tab.dataset.companion)companionMode=null;},true);
window.addEventListener("trip-data-changed",()=>queueMicrotask(sync));
const observer=new MutationObserver(()=>queueMicrotask(sync));observer.observe(document.documentElement,{subtree:true,childList:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
