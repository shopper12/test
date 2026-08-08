import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V6";

const STORAGE_KEY = "offshore-trip-google-maps-embed-key";
const state = { itinerary: DEFAULT_ITINERARY, boundHost: null, selectedSegment: null, modeOverride: null };

const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary;
  if(key && ITINERARIES[key]) state.itinerary=key;
  return ITINERARIES[state.itinerary] || ITINERARIES[DEFAULT_ITINERARY];
}

function activeDayId(){
  const active=document.querySelector(".day-tab.active");
  return active ? Number(active.dataset.day) : null;
}

function routePoints(){
  const plan=activePlan(), day=activeDayId();
  return (plan.officialSeed.map_points || [])
    .filter(point => !day || Number(point.day_id)===day)
    .slice()
    .sort((a,b)=>Number(a.day_id)-Number(b.day_id)||Number(a.sort_order)-Number(b.sort_order));
}

function apiKey(){
  return String(window.GOOGLE_MAPS_EMBED_KEY || localStorage.getItem(STORAGE_KEY) || "").trim();
}

function saveApiKey(value){
  const key=String(value||"").trim();
  if(key) localStorage.setItem(STORAGE_KEY,key);
  else localStorage.removeItem(STORAGE_KEY);
  state.selectedSegment=null;
  state.modeOverride=null;
}

function modeForSegment(type){
  if(type==="car") return "driving";
  if(["subway","rail","hsr"].includes(type)) return "transit";
  if(type==="flight") return "flying";
  return "walking";
}

function modeLabel(mode){
  return ({driving:"자동차",transit:"대중교통",walking:"도보",bicycling:"자전거",flying:"항공"})[mode] || mode;
}

function coord(point){ return `${Number(point.lat)},${Number(point.lng)}`; }

function embedDirectionsUrl(key,a,b,mode,waypoints=[]){
  const params=new URLSearchParams({
    key,
    origin:coord(a),
    destination:coord(b),
    mode,
    units:"metric",
    language:"ko",
    region:"kr",
  });
  if(waypoints.length) params.set("waypoints",waypoints.map(coord).join("|"));
  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

function embedPlaceUrl(key,point){
  const params=new URLSearchParams({key,q:coord(point),zoom:"15",language:"ko",region:"kr"});
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

function contiguousSegments(points){
  const rows=[];
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i];
    if(Number(a.day_id)!==Number(b.day_id)) continue;
    rows.push({index:i,a,b,mode:modeForSegment(b.segment_type),type:b.segment_type||"car"});
  }
  return rows;
}

function initialSegment(points){
  const segments=contiguousSegments(points);
  if(!segments.length) return null;
  if(state.selectedSegment!=null){
    const exact=segments.find(s=>s.index===state.selectedSegment);
    if(exact) return exact;
  }
  return segments[0];
}

function iframeHtml(src,title){
  return `<iframe class="google-map-frame" title="${esc(title)}" src="${esc(src)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}

function noKeyHtml(){
  return `<div class="google-map-key-setup">
    <div class="google-map-logo">Google Maps</div>
    <h3>대시보드 내부 Google Maps 경로 연동</h3>
    <p>Google 공식 Maps Embed API는 무료·무제한이지만 API 키가 필수입니다. 키를 아래에 한 번 저장하면 이 브라우저에서는 외부 지도 탭을 열지 않고 자동차·대중교통·도보 경로를 이 화면에서 바로 확인합니다.</p>
    <div class="google-map-key-row"><input id="google-maps-embed-key" type="password" autocomplete="off" placeholder="Google Maps Embed API key"><button type="button" class="btn primary" id="save-google-maps-key">저장 후 Google 지도 열기</button></div>
    <small>권장 제한: Maps Embed API만 허용 + HTTP referrer <b>https://shopper12.github.io/test/*</b>. 키는 이 브라우저 localStorage에만 저장됩니다.</small>
  </div>`;
}

function controlsHtml(segment){
  if(!segment) return "";
  const modes=["driving","transit","walking"];
  return `<div class="google-map-controls">
    <div><b>${esc(segment.a.name)} → ${esc(segment.b.name)}</b><small>Google Maps 실제 경로 · 지도 안에서 직접 조작</small></div>
    <div class="google-map-mode-buttons">${modes.map(mode=>`<button type="button" data-google-map-mode="${mode}" class="${(state.modeOverride||segment.mode)===mode?"active":""}">${mode==="driving"?"🚗":mode==="transit"?"🚇":"🚶"} ${modeLabel(mode)}</button>`).join("")}</div>
  </div>`;
}

function renderGoogleMap(){
  const host=document.querySelector("#map");
  if(!host || !host.querySelector(".leaflet-map-pane")) return;
  const key=apiKey(), points=routePoints();
  if(!points.length) return;

  let shell=host.querySelector(":scope > .google-map-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="google-map-shell";
    host.append(shell);
  }
  state.boundHost=host;

  if(!key){
    shell.innerHTML=noKeyHtml();
    shell.querySelector("#save-google-maps-key")?.addEventListener("click",()=>{
      const input=shell.querySelector("#google-maps-embed-key");
      if(!input?.value.trim()) return;
      saveApiKey(input.value);
      renderGoogleMap();
      bindRouteList(true);
    });
    return;
  }

  const segment=initialSegment(points);
  if(!segment){
    shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(points[0].name)}</b><small>Google Maps 장소 보기</small></div><button type="button" id="reset-google-maps-key">API 키 변경</button></div>${iframeHtml(embedPlaceUrl(key,points[0]),points[0].name)}`;
    return;
  }

  const mode=state.modeOverride || segment.mode;
  const src=embedDirectionsUrl(key,segment.a,segment.b,mode);
  shell.innerHTML=`${controlsHtml(segment)}${iframeHtml(src,`${segment.a.name}에서 ${segment.b.name}까지 Google Maps 경로`)}<button type="button" class="google-map-key-reset" id="reset-google-maps-key">Google Maps API 키 변경</button>`;
  shell.querySelectorAll("[data-google-map-mode]").forEach(button=>button.addEventListener("click",()=>{
    state.modeOverride=button.dataset.googleMapMode;
    renderGoogleMap();
  }));
  shell.querySelector("#reset-google-maps-key")?.addEventListener("click",()=>{
    saveApiKey("");
    renderGoogleMap();
  });
}

function selectSegment(index){
  state.selectedSegment=Number(index);
  state.modeOverride=null;
  renderGoogleMap();
  document.querySelectorAll("#route-list .route-stop").forEach((stop,i)=>stop.classList.toggle("route-selected",i===Number(index)));
}

function bindRouteList(force=false){
  const list=document.querySelector("#route-list"), points=routePoints();
  if(!list || points.length<1) return;
  const stops=[...list.querySelectorAll(".route-stop")];
  if(stops.length!==points.length) return;

  stops.forEach((stop,i)=>{
    if(i===0){
      if(!stop.querySelector(".google-inline-label")) stop.querySelector("div:last-child")?.insertAdjacentHTML("beforeend",`<span class="google-inline-label">Google Maps 시작점</span>`);
      return;
    }
    if(Number(points[i-1].day_id)!==Number(points[i].day_id)) return;
    if(!stop.querySelector(".google-inline-segment")){
      const type=points[i].segment_type||"car", mode=modeForSegment(type);
      stop.querySelector("div:last-child")?.insertAdjacentHTML("beforeend",`<button type="button" class="google-inline-segment" data-google-segment="${i}">Google Maps · ${modeLabel(mode)} 경로</button>`);
    }
  });

  if(force || list.dataset.googleInlineBound!=="1"){
    list.dataset.googleInlineBound="1";
    list.addEventListener("click",event=>{
      const button=event.target.closest("[data-google-segment]");
      if(button){
        event.preventDefault();
        event.stopImmediatePropagation();
        selectSegment(button.dataset.googleSegment);
        return;
      }
      const stop=event.target.closest(".route-stop");
      if(!stop || event.target.closest("a,button")) return;
      const index=stops.indexOf(stop);
      if(index>0 && Number(points[index-1].day_id)===Number(points[index].day_id)){
        event.preventDefault();
        event.stopImmediatePropagation();
        selectSegment(index);
      } else if(index===0 && apiKey()){
        const key=apiKey(),host=document.querySelector("#map"),shell=host?.querySelector(":scope > .google-map-shell");
        if(shell) shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(points[0].name)}</b><small>Google Maps 장소 보기</small></div></div>${iframeHtml(embedPlaceUrl(key,points[0]),points[0].name)}`;
      }
    },true);
  }

  list.classList.toggle("google-maps-ready",Boolean(apiKey()));
  list.querySelectorAll(".live-route-actions").forEach(row=>row.hidden=Boolean(apiKey()));
}

function enhance(){
  if(!document.querySelector("#map")) return;
  renderGoogleMap();
  bindRouteList();
  const note=document.querySelector("#route-list .map-live-note");
  if(note && apiKey()) note.innerHTML="<b>Google Maps가 이 대시보드 안에 직접 연동되어 있습니다.</b> 장소나 ‘Google Maps · 경로’ 버튼을 누르면 외부 탭 없이 이 지도에서 자동차·대중교통·도보 실제 경로와 예상시간을 확인할 수 있습니다. Leaflet/OSRM은 Google Maps를 불러오지 못할 때의 내부 보조지도입니다.";
}

const observer=new MutationObserver(()=>{
  clearTimeout(observer._timer);
  observer._timer=setTimeout(enhance,140);
});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",enhance);
