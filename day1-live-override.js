// 2026-09-02 actual-day override.
// The 0830 source itinerary is intentionally preserved; this layer reflects the user's
// confirmed same-day cancellation of the Taichung business program and replaces only Day 1
// in the live UI/state. It also survives a Supabase reload by reapplying after trip-data-changed.

const VERSION = "DAY1_ACTUAL_20260902_V1";
const DAY_ID = 1;
const clone = value => JSON.parse(JSON.stringify(value));

const DAY1_SUMMARY = "9/2 TIPC 등 당일 기관 일정 전부 취소 · 자유일정 전환 · 국립대만미술관(최우선) → 심계신촌 → 타이중 국가가극원 → 펑지아 야시장 · 21시대 호텔 체크인";

const DAY1_EVENTS = [
  {
    id:"live-d1-01",day_id:1,time_start:"07:55",time_end:"09:40",
    title:"인천(ICN) → 타이중(RMQ)",category:"항공 · 완료",
    location:"Incheon International Airport → Taichung International Airport",
    transport:"Jin Air LJ0735",duration:"1시간 45분",sort_order:10,
    meeting_status:"발권 완료",
    notes:"기존 발권 일정 유지. 도착 이후 기관 일정만 취소됨."
  },
  {
    id:"live-d1-02",day_id:1,time_start:"09:40",time_end:"12:20",
    title:"입국수속 · CHECK Inn LaiLai 이동 · 짐 보관",category:"입국·숙박",
    location:"Taichung International Airport → CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., North District, Taichung",
    transport:"택시",duration:"완료/현지상황 기준",sort_order:20,
    map_url:"https://www.google.com/maps/dir/?api=1&origin=Taichung+International+Airport&destination=CHECK+Inn+Taichung+LaiLai",
    notes:"호텔 체크인은 16:00 이후. 오후 관광 중에는 짐만 프런트에 보관."
  },
  {
    id:"live-d1-03",day_id:1,time_start:"12:20",time_end:"12:35",
    title:"호텔 → 국립대만미술관 이동",category:"교통 · 자유일정",
    location:"CHECK Inn Taichung LaiLai → National Taiwan Museum of Fine Arts, No.2 Sec.1 Wuquan W Rd, West District, Taichung",
    transport:"택시/Uber",duration:"약 10~20분",sort_order:30,
    map_url:"https://www.google.com/maps/dir/?api=1&origin=CHECK+Inn+Taichung+LaiLai&destination=National+Taiwan+Museum+of+Fine+Arts+Taichung",
    notes:"오늘 기관 일정 전부 취소 반영. 미술관 희망 멤버 요청을 최우선으로 배치."
  },
  {
    id:"live-d1-04",day_id:1,time_start:"12:35",time_end:"13:25",
    title:"春水堂 國美店 중식",category:"중식 · 대만식",
    location:"Chun Shui Tang National Museum Store, B1, No.2 Sec.1 Wuquan W Rd, West District, Taichung",
    transport:"미술관 B1",duration:"약 50분",sort_order:40,
    official_url:"https://www.chunshuitang.com.tw/en/location-detail/national_museum_store/",
    map_url:"https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+National+Museum+Store+Taichung",
    notes:"평일 11:00~22:00. 버블티·공푸면·딤섬·대만식 식사. 미술관과 같은 건물이라 이동 손실이 없음."
  },
  {
    id:"live-d1-05",day_id:1,time_start:"13:25",time_end:"15:35",
    title:"국립대만미술관 National Taiwan Museum of Fine Arts",category:"미술관 · 최우선",
    location:"No.2, Sec.1, Wuquan W. Rd., West Dist., Taichung City 403414, Taiwan",
    transport:"도보",duration:"약 2시간 10분",sort_order:50,
    official_url:"https://www.ntmofa.gov.tw/en/",
    map_url:"https://www.google.com/maps/search/?api=1&query=National+Taiwan+Museum+of+Fine+Arts+Taichung",
    notes:"수요일 09:00~17:00 · 무료. 일반 정규 안내는 14:30에도 운영되므로 시간 맞으면 참여. 미술관 희망 멤버 기준 오늘 핵심 일정."
  },
  {
    id:"live-d1-06",day_id:1,time_start:"15:50",time_end:"16:40",
    title:"심계신촌 Shen Ji New Village",category:"관광 · 문화창작",
    location:"Ln.368, Minsheng Rd., West Dist., Taichung City, Taiwan",
    transport:"도보/택시",duration:"약 50분",sort_order:60,
    official_url:"https://travel.taichung.gov.tw/en/Attractions/Intro/1222",
    map_url:"https://www.google.com/maps/search/?api=1&query=Shen+Ji+New+Village+Taichung",
    notes:"국립대만미술관과 같은 서구 문화권역. 옛 관사촌을 리노베이션한 창작 상점·스튜디오 구역."
  },
  {
    id:"live-d1-07",day_id:1,time_start:"17:10",time_end:"18:30",
    title:"타이중 국가가극원 National Taichung Theater",category:"관광 · 건축·예술",
    location:"No.101, Sec.2, Huilai Rd., Xitun Dist., Taichung City 407025, Taiwan",
    transport:"택시/Uber",duration:"약 1시간 20분",sort_order:70,
    official_url:"https://www.npac-ntt.org/en",
    map_url:"https://www.google.com/maps/search/?api=1&query=National+Taichung+Theater",
    notes:"수요일 11:30~21:00. 이토 도요 설계의 타이중 대표 건축·예술 명소. 공연 관람이 아니라 건축·공용공간 중심 자유관람."
  },
  {
    id:"live-d1-08",day_id:1,time_start:"18:45",time_end:"20:45",
    title:"펑지아 야시장 Fengchia Night Market",category:"석식 · 야시장·쇼핑",
    location:"Wenhua Rd. / Fengjia Rd. / Fuxing Rd., Xitun Dist., Taichung City, Taiwan",
    transport:"택시/Uber",duration:"약 2시간",sort_order:80,
    official_url:"https://travel.taichung.gov.tw/en/Attractions/Intro/850",
    map_url:"https://www.google.com/maps/search/?api=1&query=Fengchia+Night+Market+Taichung",
    notes:"타이중 관광청 대표 인기 명소. 12:00~02:00 안내. 저녁은 야시장 먹거리로 해결하고 쇼핑까지 한 번에 진행."
  },
  {
    id:"live-d1-09",day_id:1,time_start:"20:45",time_end:"21:20",
    title:"펑지아 → 호텔 복귀 · 체크인",category:"숙박",
    location:"Fengchia Night Market → CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., North District, Taichung",
    transport:"택시/Uber",duration:"약 20~35분",sort_order:90,
    map_url:"https://www.google.com/maps/dir/?api=1&origin=Fengchia+Night+Market+Taichung&destination=CHECK+Inn+Taichung+LaiLai",
    notes:"숙소 예약은 취소 대상이 아니므로 그대로 유지. 늦은 체크인 전 프런트에 짐 보관 여부 재확인."
  }
];

const DAY1_MAP_POINTS = [
  {id:"live-p1",day_id:1,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:1,segment_type:"car",popup:"12:20 자유일정 출발 · 짐 보관",url:"https://www.google.com/maps/search/?api=1&query=CHECK+Inn+Taichung+LaiLai"},
  {id:"live-p2",day_id:1,name:"春水堂 國美店 · 중식",lat:24.141186,lng:120.66331,sort_order:2,segment_type:"car",popup:"12:35~13:25 · 미술관 B1 · 평일 11:00~22:00",url:"https://www.chunshuitang.com.tw/en/location-detail/national_museum_store/"},
  {id:"live-p3",day_id:1,name:"국립대만미술관",lat:24.141186,lng:120.66331,sort_order:3,segment_type:"walk",popup:"13:25~15:35 · 오늘 핵심 · 무료 · 17:00 폐관",url:"https://www.ntmofa.gov.tw/en/"},
  {id:"live-p4",day_id:1,name:"심계신촌 Shen Ji New Village",lat:24.144694,lng:120.662639,sort_order:4,segment_type:"walk",popup:"15:50~16:40 · 문화창작 관사촌",url:"https://travel.taichung.gov.tw/en/Attractions/Intro/1222"},
  {id:"live-p5",day_id:1,name:"타이중 국가가극원",lat:24.162649,lng:120.64030,sort_order:5,segment_type:"car",popup:"17:10~18:30 · 건축·예술 · 21:00까지",url:"https://www.npac-ntt.org/en"},
  {id:"live-p6",day_id:1,name:"펑지아 야시장",lat:24.175923,lng:120.64549,sort_order:6,segment_type:"car",popup:"18:45~20:45 · 석식·쇼핑 · 02:00까지",url:"https://travel.taichung.gov.tw/en/Attractions/Intro/850"},
  {id:"live-p7",day_id:1,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:7,segment_type:"car",popup:"21:20 전후 호텔 체크인",url:"https://www.google.com/maps/search/?api=1&query=CHECK+Inn+Taichung+LaiLai"}
];

const DAY1_RESTAURANTS = [
  {
    id:"live-food-d1-lunch",day_id:1,name:"春水堂 國美店 · Chun Shui Tang National Museum Store",city:"Taichung · West District",
    meal_type:"중식 12:35~13:25 · 대만식/중화요리",price_per_person:"TWD 200~400",
    url:"https://www.chunshuitang.com.tw/en/location-detail/national_museum_store/",
    notes:"B1, No.2 Sec.1 Wuquan W Rd · 국립대만미술관 내부 · 평일 11:00~22:00 · 버블티·공푸면·딤섬. Google 지도: https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+National+Museum+Store+Taichung",
    sort_order:10
  },
  {
    id:"live-food-d1-dinner",day_id:1,name:"Fengchia Night Market · 逢甲夜市",city:"Taichung · Xitun District",
    meal_type:"석식 18:45~20:45 · 야시장",price_per_person:"TWD 150~500",
    url:"https://travel.taichung.gov.tw/en/Attractions/Intro/850",
    notes:"Wenhua Rd. 일대 · 12:00~02:00 안내 · 타이중 대표 야시장. Google 지도: https://www.google.com/maps/search/?api=1&query=Fengchia+Night+Market+Taichung",
    sort_order:20
  }
];

const ACTUAL_PLAN_ROWS = [
  ["12:20~12:35","호텔 → 국립대만미술관","택시/Uber · 오늘 기관 일정 전부 취소 반영"],
  ["12:35~13:25","春水堂 國美店 중식","미술관 B1 · 대만식/중화요리 · 평일 11:00~22:00"],
  ["13:25~15:35","국립대만미술관","무료 · 수요일 09:00~17:00 · 14:30 정규 안내 가능"],
  ["15:50~16:40","심계신촌 Shen Ji New Village","미술관 인근 문화창작·사진·소규모 상점"],
  ["17:10~18:30","타이중 국가가극원","이토 도요 건축 · 수요일 21:00까지"],
  ["18:45~20:45","펑지아 야시장","타이중 대표 유명 야시장 · 석식·쇼핑"],
  ["20:45~21:20","호텔 복귀·체크인","CHECK Inn LaiLai · 숙소 예약 유지"]
];

const EXTRA_PLACES = [
  {
    kind:"고정",time:"13:25~15:35",name:"국립대만미술관",desc:"멤버가 미술관을 원해서 오늘 1순위. 대만 현대·근현대 미술 중심 국립 미술관.",
    detail:"무료 · 화~금 09:00~17:00 · No.2 Sec.1 Wuquan W Rd",
    official:"https://www.ntmofa.gov.tw/en/",map:"https://www.google.com/maps/search/?api=1&query=National+Taiwan+Museum+of+Fine+Arts+Taichung"
  },
  {
    kind:"고정",time:"15:50~16:40",name:"심계신촌",desc:"관사촌 재생형 문화창작 공간. 미술관과 가까워 이동 효율이 좋음.",
    detail:"Ln.368 Minsheng Rd, West District",
    official:"https://travel.taichung.gov.tw/en/Attractions/Intro/1222",map:"https://www.google.com/maps/search/?api=1&query=Shen+Ji+New+Village+Taichung"
  },
  {
    kind:"고정",time:"17:10~18:30",name:"타이중 국가가극원",desc:"타이중 대표 현대건축·예술 명소. 공연 없이 건축과 공용공간만 봐도 가치가 큼.",
    detail:"No.101 Sec.2 Huilai Rd · 수요일 11:30~21:00",
    official:"https://www.npac-ntt.org/en",map:"https://www.google.com/maps/search/?api=1&query=National+Taichung+Theater"
  },
  {
    kind:"고정",time:"18:45~20:45",name:"펑지아 야시장",desc:"타이중 관광청 인기 최상위권의 대표 야시장. 저녁과 쇼핑을 한 번에 해결.",
    detail:"Wenhua Rd 일대 · 12:00~02:00",
    official:"https://travel.taichung.gov.tw/en/Attractions/Intro/850",map:"https://www.google.com/maps/search/?api=1&query=Fengchia+Night+Market+Taichung"
  },
  {
    kind:"대안",time:"미술관 대체/연장",name:"국립자연과학박물관",desc:"미술보다 과학·자연사 쪽을 원하는 멤버가 있으면 실내 대안으로 좋음.",
    detail:"No.1 Guanqian Rd · 오늘 09:00~17:00",
    official:"https://www.nmns.edu.tw/en/",map:"https://www.google.com/maps/search/?api=1&query=National+Museum+of+Natural+Science+Taichung"
  },
  {
    kind:"대안",time:"심계신촌 뒤 여유 시",name:"Park Lane by CMP",desc:"심계신촌 인근 쇼핑·카페·도심 산책 대안. 시간 남을 때만 추가.",
    detail:"No.68 Gongyi Rd · 수요일 11:00~21:30",
    official:"",map:"https://www.google.com/maps/search/?api=1&query=Park+Lane+by+CMP+Taichung"
  }
];

function replaceDayRows(rows, replacement, field="day_id"){
  return [...(rows||[]).filter(row=>Number(row?.[field])!==DAY_ID), ...clone(replacement)];
}

function applyStateOverride(){
  const data=window.__tripDashboardLiveData?.();
  if(!data || data.__day1ActualOverrideVersion===VERSION)return false;

  const day=(data.days||[]).find(row=>Number(row.id)===DAY_ID);
  if(day)day.summary=DAY1_SUMMARY;
  data.events=replaceDayRows(data.events,DAY1_EVENTS);
  data.map_points=replaceDayRows(data.map_points,DAY1_MAP_POINTS);
  data.restaurants=replaceDayRows(data.restaurants,DAY1_RESTAURANTS);
  data.meetings=(data.meetings||[]).map(row=>Number(row.day_id)===DAY_ID
    ? {...row,status:"9/2 당일 취소",notes:`9/2 기관 일정 전체 취소 확정 · 실제 방문 없음. ${row.notes||""}`.trim()}
    : row);
  Object.defineProperty(data,"__day1ActualOverrideVersion",{value:VERSION,enumerable:false,configurable:true});
  return true;
}

function rerenderStandardTab(){
  const active=document.querySelector("#tabs .tab.active:not([data-companion])");
  if(active)active.click();
}

function planRowsHtml(){
  return ACTUAL_PLAN_ROWS.map(([t,title,note])=>`<div class="guide-plan-row"><time>${t}</time><b>${title}</b><small>${note}</small></div>`).join("");
}

function placeCardsHtml(){
  return EXTRA_PLACES.map(item=>`<article class="guide-card"><div class="kicker">9/2 실제 ${item.kind} · ${item.time}</div><h4>${item.name}</h4><p>${item.desc}</p><p><b>위치·시간</b> ${item.detail}</p><div class="guide-links">${item.official?`<a href="${item.official}" target="_blank" rel="noreferrer">공식 ↗</a>`:""}<a href="${item.map}" target="_blank" rel="noreferrer">지도 ↗</a></div></article>`).join("");
}

function decorateStandardUi(){
  const data=window.__tripDashboardLiveData?.();
  if(!data)return;
  const activeDay=Number(document.querySelector(".day-tab.active")?.dataset?.day||0);
  const main=document.querySelector("#main-content");
  if(!main)return;

  const banner=main.querySelector(".actual-day-override-banner");
  if(activeDay===DAY_ID && !main.querySelector(".companion-hero")){
    if(!banner){
      const anchor=main.querySelector(".day-summary,.map-layout,.table-wrap");
      if(anchor){
        const next=document.createElement("div");
        next.className="status-banner warning actual-day-override-banner";
        next.innerHTML="<b>9/2 실제 변경</b> · TIPC 등 오늘 기관 일정은 전부 취소되었습니다. 0830 원본보다 이 자유일정이 우선합니다. 미술관 요청을 반영해 국립대만미술관 → 심계신촌 → 타이중 국가가극원 → 펑지아 야시장 순으로 운영합니다.";
        anchor.before(next);
      }
    }
  }else if(banner){
    banner.remove();
  }

  main.querySelectorAll('[data-event-id^="live-d1-"]').forEach(card=>{
    if(card.getAttribute("draggable")!=="false")card.setAttribute("draggable","false");
    card.querySelector(".event-actions")?.remove();
  });

  const restaurantNames=new Set(DAY1_RESTAURANTS.map(row=>row.name));
  main.querySelectorAll("table.data-table tbody tr").forEach(tr=>{
    const text=tr.textContent||"";
    if([...restaurantNames].some(name=>text.includes(name)))tr.querySelector('[data-edit-table="restaurants"]')?.remove();
  });
}

function decoratePracticalGuide(){
  const main=document.querySelector("#main-content");
  const hero=main?.querySelector(".companion-hero");
  if(!hero || !/현지에서 그대로 쓰는/.test(hero.textContent||""))return;

  const selected=Number(main.querySelector("[data-guide-day].active")?.dataset?.guideDay||0);
  const shouldShow=selected===0 || selected===DAY_ID;
  const existing=main.querySelector("#day1-actual-guide");

  const day1=[...main.querySelectorAll(".guide-day")].find(section=>/^Day 1\b/.test(section.querySelector("h3")?.textContent||""));
  if(day1){
    const plan=day1.querySelector(".guide-plan");
    if(plan && plan.dataset.actualDay1Override!==VERSION){
      plan.innerHTML=planRowsHtml();
      plan.dataset.actualDay1Override=VERSION;
    }
    const header=day1.querySelector("header");
    if(header && !header.querySelector(".actual-guide-note"))header.insertAdjacentHTML("beforeend",'<p class="actual-guide-note"><b>당일 변경:</b> TIPC 등 기관 일정 전부 취소 · 미술관 중심 자유일정으로 대체</p>');
  }

  if(!shouldShow){
    existing?.remove();
    return;
  }
  if(existing)return;

  const section=document.createElement("section");
  section.id="day1-actual-guide";
  section.className="guide-day";
  section.innerHTML=`<header><h3>Day 1 · 9/2 실제 자유일정 장소</h3><p><b>멤버 미술관 요청 최우선.</b> Google 지도에서 바로 열 수 있는 구체 장소만 넣었습니다. 고정 4곳 + 시간 남을 때 대안 2곳입니다.</p></header><div class="guide-grid">${placeCardsHtml()}</div>`;
  hero.insertAdjacentElement("afterend",section);
}

function decorate(){
  decorateStandardUi();
  decoratePracticalGuide();
}

function synchronize(){
  const changed=applyStateOverride();
  if(changed){
    queueMicrotask(rerenderStandardTab);
    setTimeout(decorate,0);
  }else{
    decorate();
  }
}

window.__DAY1_ACTUAL_OVERRIDE__={version:VERSION,events:clone(DAY1_EVENTS),mapPoints:clone(DAY1_MAP_POINTS),restaurants:clone(DAY1_RESTAURANTS)};
window.addEventListener("trip-data-changed",()=>queueMicrotask(synchronize));
document.addEventListener("click",event=>{
  if(event.target.closest?.("[data-tab],[data-day],[data-guide-day],[data-companion]"))setTimeout(synchronize,0);
},true);

const observer=new MutationObserver(()=>{
  clearTimeout(observer._timer);
  observer._timer=setTimeout(synchronize,80);
});
observer.observe(document.documentElement,{childList:true,subtree:true});

let attempts=0;
const timer=setInterval(()=>{
  attempts+=1;
  if(window.__tripDashboardLiveData && document.querySelector("#tabs")){
    clearInterval(timer);
    synchronize();
  }else if(attempts>100){
    clearInterval(timer);
    console.warn(`[${VERSION}] dashboard live data not found`);
  }
},100);
