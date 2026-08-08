import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";

const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const fmt=v=>new Intl.NumberFormat("ko-KR").format(Math.round(Number(v)||0));

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary||DEFAULT_ITINERARY;
  return ITINERARIES[key]||ITINERARIES[DEFAULT_ITINERARY];
}

function bookingUrl(h){
  const p=new URLSearchParams({
    ss:`${h.name} ${h.city}`,
    checkin:h.check_in,
    checkout:h.check_out,
    group_adults:"4",
    no_rooms:String(h.rooms||2),
    group_children:"0",
    selected_currency:"KRW",
    order:"price",
  });
  return `https://www.booking.com/searchresults.ko.html?${p.toString()}`;
}

function hotelCard(h){
  return `<article class="all-hotel-card">
    <div class="all-hotel-main">
      <span class="ops-kicker">🏨 ${esc(h.city)}</span>
      <b>${esc(h.name)}</b>
      <small>${esc(h.check_in)} → ${esc(h.check_out)} · ${esc(h.nights)}박 · ${esc(h.rooms||2)}실 · 성인 4명</small>
      <strong>${h.min_krw!=null?`계획범위 4인 ₩${fmt(h.min_krw)}~₩${fmt(h.max_krw)}`:"실시간 객실가 확인"}</strong>
    </div>
    <div class="all-hotel-actions">
      <a class="btn small primary" href="${esc(bookingUrl(h))}" target="_blank" rel="noreferrer">Booking 실제 객실·예약/결제 ↗</a>
      <a class="btn small" href="${esc(h.url)}" target="_blank" rel="noreferrer">호텔 공식 사이트 ↗</a>
    </div>
  </article>`;
}

function render(){
  const timeline=document.querySelector('#tabs [data-tab="timeline"]');
  if(!timeline?.classList.contains("active"))return;
  const main=document.querySelector("#main-content"),dayTabs=main?.querySelector(".day-tabs");
  if(!main||!dayTabs)return;
  const hotels=activePlan().officialSeed.hotels||[];
  let panel=main.querySelector(".all-hotel-booking-panel");
  if(!panel){panel=document.createElement("section");panel.className="all-hotel-booking-panel";dayTabs.after(panel);}
  const key=`${document.querySelector(".itinerary-tab.active")?.dataset?.itinerary||DEFAULT_ITINERARY}:${hotels.map(h=>`${h.id}:${h.check_in}:${h.check_out}`).join("|")}`;
  if(panel.dataset.key===key)return;
  panel.dataset.key=key;
  panel.innerHTML=`<div class="section-head"><h2>🏨 전체 숙박 예약</h2><span>Day를 바꿔도 모든 호텔 예약 링크를 항상 표시</span></div><div class="all-hotel-grid">${hotels.map(hotelCard).join("")}</div>`;
}

const observer=new MutationObserver(()=>{clearTimeout(observer._h);observer._h=setTimeout(render,90);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",render);
