import { STUDY_PLACES } from "./travel-study.js?v=FINAL_0830_V2";
import { KOREAN_VIDEO_CHECKED_AT, KOREAN_VIDEO_NOTE, KOREAN_VIDEO_BY_PLACE } from "./korean-video-guide.js?v=FINAL_0830_V4";
import { REPORT_CONTEXT_CHECKED_AT, COUNTRY_REPORT_CONTEXT, COMPANY_BACKGROUND } from "./report-context.js?v=FINAL_0830_V4";

let applying=false;
const esc=(v)=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function activeMode(){return document.querySelector("#tabs .companion-tab.active")?.dataset?.companion||null;}
function linksHtml(links=[]){return `<div class="guide-links">${links.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`).join("")}</div>`;}

function broadcastCard(v){
  const searchLike=/검색/.test(v.type||"");
  return `<article class="media-card korean-broadcast-card">
    <div class="companion-eyebrow">🇰🇷 ${esc(v.source)} · ${esc(v.type)}</div>
    <h4>${esc(v.title)}</h4>
    ${(v.moments||[]).length?`<div class="media-moments">${v.moments.map(m=>`<span>⏱ ${esc(m)}</span>`).join("")}</div>`:""}
    ${v.note?`<p>${esc(v.note)}</p>`:""}
    <a href="${esc(v.url)}" target="_blank" rel="noreferrer">${searchLike?"공식영상 검색 열기":"영상·공식페이지 열기"} ↗</a>
  </article>`;
}

function injectKoreanStudy(){
  if(activeMode()!=="study")return;
  const main=document.querySelector("#main-content"); if(!main)return;
  const hero=main.querySelector(".companion-hero");
  if(hero){
    const h2=hero.querySelector("h2"); if(h2)h2.textContent="🎬 한국어 여행방송·영화/드라마·책";
    const p=hero.querySelector("p"); if(p)p.textContent="여행영상은 한국어 자료를 우선하며, 세계테마기행(EBS)과 걸어서 세계속으로(KBS)의 확인 가능한 공식 영상·재생목록·VOD를 국가별로 모았습니다.";
    if(!hero.querySelector(".korean-video-note"))hero.insertAdjacentHTML("beforeend",`<p class="source-note korean-video-note"><b>${esc(KOREAN_VIDEO_CHECKED_AT)} 확인</b> · ${esc(KOREAN_VIDEO_NOTE)}</p>`);
  }
  const sections=[...main.querySelectorAll(".media-place")];
  sections.forEach((section,index)=>{
    const place=STUDY_PLACES[index]; if(!place)return;
    const first=section.querySelector(".media-columns > div:first-child"); if(!first)return;
    const items=KOREAN_VIDEO_BY_PLACE[place.id]||[];
    first.innerHTML=`<h4>🇰🇷 한국어 여행영상 · EBS/KBS</h4>${items.length?items.map(broadcastCard).join(""):`<div class="media-card">한국어 공식 방송영상 직접 대응자료 미확인</div>`}`;
  });
}

function countryCard(c){
  return `<article class="guide-card report-context-card">
    <div class="kicker">🌍 ${esc(c.country)} · ${esc(c.days)} · ${esc(c.cities)}</div>
    <h3>${esc(c.country)} 출장 배경</h3>
    <p><b>한눈에</b> ${esc(c.overview)}</p>
    <p><b>역사</b> ${esc(c.history)}</p>
    <p><b>해상풍력·에너지</b> ${esc(c.offshoreWind)}</p>
    <p><b>비즈니스 미팅 포인트</b> ${esc(c.business)}</p>
    ${linksHtml(c.sources)}
  </article>`;
}

function companyCard(c){
  return `<article class="guide-card report-context-card">
    <div class="kicker">🏢 ${esc(c.country)} · ${esc(c.days)}</div>
    <h3>${esc(c.org)}</h3>
    <p><b>회사·기관</b> ${esc(c.profile)}</p>
    <p><b>해상풍력에서의 역할</b> ${esc(c.wind)}</p>
    <p><b>이번 미팅에서 볼 것</b> ${esc(c.meeting)}</p>
    <div class="guide-links"><a href="${esc(c.source)}" target="_blank" rel="noreferrer">공식자료 ↗</a></div>
  </article>`;
}

function reportContextText(){
  const countries=COUNTRY_REPORT_CONTEXT.map(c=>`${c.country} (${c.days})\n한눈에: ${c.overview}\n역사: ${c.history}\n해상풍력·에너지: ${c.offshoreWind}\n비즈니스: ${c.business}`).join("\n\n");
  const companies=COMPANY_BACKGROUND.map(c=>`${c.org} (${c.days})\n회사·기관: ${c.profile}\n해상풍력 역할: ${c.wind}\n미팅 포인트: ${c.meeting}`).join("\n\n");
  return `[국가·역사·해상풍력 배경]\n${countries}\n\n[방문기관·기업 배경]\n${companies}`;
}

function injectReportContext(){
  if(activeMode()!=="report")return;
  const main=document.querySelector("#main-content"); if(!main||main.querySelector("#report-context-v4"))return;
  const hero=main.querySelector(".companion-hero"); if(!hero)return;
  hero.insertAdjacentHTML("afterend",`
    <section id="report-context-v4" class="report-context-wrap">
      <div class="section-head"><h2>🌍 국가·역사·해상풍력 배경</h2><span>${esc(REPORT_CONTEXT_CHECKED_AT)} 기준</span></div>
      <p class="source-note">보고서 서론과 국가별 비교에 바로 쓸 수 있도록 역사·산업·해상풍력 정책과 일반적인 비즈니스 미팅 포인트를 압축했습니다. 비즈니스 문화는 개인·회사별 차이가 있으므로 절대적 규칙이 아니라 준비 참고사항입니다.</p>
      <div class="guide-grid report-context-grid">${COUNTRY_REPORT_CONTEXT.map(countryCard).join("")}</div>
      <div class="section-head"><h2>🏢 방문기관·기업·풍력발전 배경</h2><button class="btn small" id="copy-report-context" type="button">배경설명 전체 복사</button></div>
      <div class="guide-grid report-context-grid">${COMPANY_BACKGROUND.map(companyCard).join("")}</div>
    </section>`);
  const copy=main.querySelector("#copy-report-context");
  if(copy)copy.onclick=async()=>{
    try{await navigator.clipboard.writeText(reportContextText());copy.textContent="복사됨";setTimeout(()=>copy.textContent="배경설명 전체 복사",1500);}catch(err){console.warn("report context copy failed",err);}
  };
}

function apply(){
  if(applying)return; applying=true;
  try{injectKoreanStudy();injectReportContext();}finally{applying=false;}
}

document.addEventListener("click",event=>{
  if(event.target.closest?.("#tabs .companion-tab"))queueMicrotask(apply);
});

const main=document.querySelector("#main-content");
if(main)new MutationObserver(()=>queueMicrotask(apply)).observe(main,{childList:true,subtree:false});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>queueMicrotask(apply),{once:true});
else queueMicrotask(apply);
