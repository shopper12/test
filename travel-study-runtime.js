import { WEATHER_BY_DAY, WEATHER_CHECKED_AT, STUDY_PLACES, STUDY_NOTE, weatherForDay } from "./travel-study.js?v=FINAL_0830_V2";

let studyMode = false;
let decorating = false;

const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function weatherHtml(dayId, compact=false){
  const w=weatherForDay(dayId);
  if(!w) return "";
  const text=compact
    ? `🌦 ${w.weather} · 👕 ${w.outfit}`
    : `🌦 ${w.area} ${w.weather} · 👕 ${w.outfit}`;
  return `<a class="weather-inline" href="${esc(w.source)}" target="_blank" rel="noreferrer" title="${WEATHER_CHECKED_AT} 확인 예보 · 출발 전 재확인">${esc(text)} <span>예보↗</span></a>`;
}

function ensureStudyTab(){
  const host=document.querySelector("#tabs");
  if(!host || host.querySelector("#travel-study-tab")) return;
  const btn=document.createElement("button");
  btn.id="travel-study-tab";
  btn.className=`tab study-tab ${studyMode?"active":""}`;
  btn.textContent="🎬 여행공부";
  btn.onclick=(event)=>{
    event.preventDefault();
    event.stopPropagation();
    studyMode=true;
    host.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    renderStudy();
  };
  host.append(btn);
}

function decorateWeather(){
  if(decorating) return;
  decorating=true;
  try{
    const data=window.__tripDashboardLiveData?.();
    if(!data) return;

    document.querySelectorAll(".event-card[data-event-id]").forEach(card=>{
      const id=card.dataset.eventId;
      const event=(data.events||[]).find(x=>String(x.id)===String(id));
      if(!event) return;
      const meta=card.querySelector(".meta");
      if(!meta || meta.querySelector(".weather-inline")) return;
      const loc=[...meta.querySelectorAll("span")].find(s=>s.textContent.trim().startsWith("📍"));
      if(!loc) return;
      loc.classList.add("location-with-weather");
      loc.insertAdjacentHTML("beforeend",weatherHtml(event.day_id,true));
    });

    document.querySelectorAll(".route-stop").forEach(stop=>{
      if(stop.querySelector(".weather-inline")) return;
      const b=stop.querySelector("b");
      if(!b) return;
      const day=Number((b.textContent.match(/Day\s*(\d+)/i)||[])[1]);
      if(!day) return;
      b.classList.add("route-place-weather");
      b.insertAdjacentHTML("beforeend",weatherHtml(day,true));
    });

    document.querySelectorAll(".day-tab").forEach(tab=>{
      if(tab.querySelector(".day-weather-mini")) return;
      const day=Number((tab.querySelector("b")?.textContent.match(/Day\s*(\d+)/i)||[])[1]);
      const w=weatherForDay(day);
      if(!w) return;
      const small=tab.querySelector("small");
      if(!small) return;
      small.insertAdjacentHTML("beforeend",`<em class="day-weather-mini">🌦 ${esc(w.weather.split("·").slice(0,2).join("·"))}</em>`);
    });
  }finally{
    decorating=false;
  }
}

function videoCard(v){
  return `<article class="study-item youtube-study"><div class="study-kicker">YouTube</div><h4>${esc(v.title)}</h4>
    <div class="study-moments">${(v.moments||[]).map(m=>`<span>⏱ ${esc(m)}</span>`).join("")}</div>
    ${v.note?`<p>${esc(v.note)}</p>`:""}
    <a class="study-link" href="${esc(v.url)}" target="_blank" rel="noreferrer">▶ 해당 시점부터 YouTube 보기 ↗</a></article>`;
}

function screenCard(v){
  return `<article class="study-item screen-study"><div class="study-kicker">${esc(v.type)}</div><h4>${esc(v.title)}</h4>
    <p><b>장면/장소</b> ${esc(v.scene)}</p><p><b>회차·시간</b> ${esc(v.timing)}</p>
    ${v.note?`<p class="study-emphasis">${esc(v.note)}</p>`:""}
    <a class="study-link" href="${esc(v.url)}" target="_blank" rel="noreferrer">로케이션 근거 ↗</a></article>`;
}

function bookCard(v){
  return `<article class="study-item book-study"><div class="study-kicker">📚 ${esc(v.genre)} · ${esc(v.priority)}</div><h4>${esc(v.title)}</h4>
    <p class="study-author">${esc(v.author)}</p><p>${esc(v.reason)}</p>
    <a class="study-link" href="${esc(v.url)}" target="_blank" rel="noreferrer">책/작품 정보 ↗</a></article>`;
}

function renderStudy(){
  const main=document.querySelector("#main-content");
  if(!main) return;
  const anchors=STUDY_PLACES.map(p=>`<a href="#study-${esc(p.id)}">${esc(p.place)}</a>`).join("");
  main.innerHTML=`
    <section class="study-hero">
      <div><span class="study-eyebrow">출장 전 예습</span><h2>장소를 알고 가면 출장 자체가 더 재밌어지는 자료</h2></div>
      <p>실제 최종 동선에 겹치는 YouTube 시점, 영화·드라마 로케이션, 수사·스릴러·추리책을 우선했습니다. 회사 시설처럼 공개 여행자료가 없는 곳은 주변 도시 자료로 대체하고 그 사실을 명시했습니다.</p>
      <div class="study-anchor-row">${anchors}</div>
    </section>
    <section class="weather-overview">
      <div class="section-head"><h2>🧥 날짜별 날씨·옷차림</h2><span>${esc(WEATHER_CHECKED_AT)} 예보 스냅샷</span></div>
      <p class="study-warning">9월 초 북해권 예보는 아직 변동폭이 큽니다. 아래는 짐 싸기 기준이고, 각 날 장소명 옆의 ‘예보↗’에서 전날 다시 확인하세요.</p>
      <div class="weather-grid">${Object.entries(WEATHER_BY_DAY).map(([day,w])=>`<article><b>Day ${day} · ${esc(w.area)}</b><span>🌦 ${esc(w.weather)}</span><span>👕 ${esc(w.outfit)}</span><a href="${esc(w.source)}" target="_blank" rel="noreferrer">최신 예보 ↗</a></article>`).join("")}</div>
    </section>
    ${STUDY_PLACES.map(p=>`<section class="study-place" id="study-${esc(p.id)}">
      <header><div><span>${esc(p.days)}</span><h3>${esc(p.place)}</h3></div><p><b>실제 동선</b> ${esc(p.routeMatch)}</p></header>
      <p class="study-why">${esc(p.why)}</p>
      <div class="study-columns">
        <div><h3>▶ 먼저 볼 YouTube</h3>${p.youtube.length?p.youtube.map(videoCard).join(""):`<div class="study-empty">직접 대응하는 여행영상 확인 못함</div>`}</div>
        <div><h3>🎞 영화·드라마 속 장소</h3>${p.screen.length?p.screen.map(screenCard).join(""):`<div class="study-empty">검증된 로케이션 작품 확인 못함</div>`}</div>
        <div><h3>📚 이 장소를 느끼는 수사·스릴러 책</h3>${p.books.length?p.books.map(bookCard).join(""):`<div class="study-empty">신뢰도 높게 추천할 직접 배경 추리·스릴러 책 확인 못함</div>`}</div>
      </div>
      ${p.gap?`<div class="study-gap">확인 한계 · ${esc(p.gap)}</div>`:""}
    </section>`).join("")}
    <div class="study-footnote">${esc(STUDY_NOTE)}</div>`;
  window.scrollTo({top:0,behavior:"smooth"});
}

function sync(){
  ensureStudyTab();
  if(studyMode){
    const btn=document.querySelector("#travel-study-tab");
    document.querySelectorAll("#tabs .tab").forEach(x=>x.classList.toggle("active",x===btn));
  }else{
    decorateWeather();
  }
}

document.addEventListener("click",event=>{
  const tab=event.target.closest?.("#tabs .tab");
  if(tab && tab.id!=="travel-study-tab") studyMode=false;
},true);

window.addEventListener("trip-data-changed",()=>queueMicrotask(sync));

const observer=new MutationObserver(()=>queueMicrotask(sync));
observer.observe(document.documentElement,{subtree:true,childList:true});

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",sync,{once:true});
else sync();
