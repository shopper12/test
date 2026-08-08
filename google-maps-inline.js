import { DEFAULT_ITINERARY, ITINERARIES } from "./itinerary-data.js?v=LIVE_TRAVEL_V17";

const STORAGE_KEY = "offshore-trip-google-maps-embed-key";
const state = {
  itinerary: DEFAULT_ITINERARY,
  boundHost: null,
  selectedSegment: null,
  modeOverride: null,
  customView: null,
  activeDay: null,
};

const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const norm = value => String(value||"").toLowerCase().replace(/[^a-z0-9가-힣]+/g," ").trim();

function activePlan(){
  const key=document.querySelector(".itinerary-tab.active")?.dataset?.itinerary;
  if(key && ITINERARIES[key]) state.itinerary=key;
  return ITINERARIES[state.itinerary] || ITINERARIES[DEFAULT_ITINERARY];
}

function activeDayId(){
  const active=document.querySelector(".day-tab.active");
  return active ? Number(active.dataset.day) : null;
}

function resetForDayChange(){
  const day=activeDayId();
  if(state.activeDay===day)return;
  state.activeDay=day;
  state.selectedSegment=null;
  state.modeOverride=null;
  state.customView=null;
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
  state.customView=null;
}

function modeForSegment(type){
  if(type==="car") return "driving";
  if(["subway","rail","hsr"].includes(type)) return "transit";
  if(type==="flight") return "flying";
  return "walking";
}

function modeForEvent(event){
  const text=`${event?.category||""} ${event?.transport||""}`.toLowerCase();
  if(/항공|flight|airline|turkish|jin air|jinair/.test(text))return "flying";
  if(/thsr|mrt|metro|subway|rail|train|기차|철도|열차|버스|bus|u-bahn|s-bahn|dsb|db\/|ns\//.test(text))return "transit";
  if(/택시|taxi|car|자동차|기사차량|렌터카/.test(text))return "driving";
  if(/도보|walk/.test(text))return "walking";
  return "driving";
}

function modeLabel(mode){
  return ({driving:"자동차",transit:"대중교통",walking:"도보",bicycling:"자전거",flying:"항공"})[mode] || mode;
}

function coord(point){ return `${Number(point.lat)},${Number(point.lng)}`; }

function embedDirectionsUrl(key,a,b,mode,waypoints=[]){
  const params=new URLSearchParams({key,origin:coord(a),destination:coord(b),mode,units:"metric",language:"ko",region:"kr"});
  if(waypoints.length) params.set("waypoints",waypoints.map(coord).join("|"));
  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

function embedDirectionsTextUrl(key,origin,destination,mode="driving",waypoints=""){
  const params=new URLSearchParams({key,origin,destination,mode,units:"metric",language:"ko",region:"kr"});
  if(waypoints)params.set("waypoints",waypoints);
  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

function embedPlaceUrl(key,point){
  const params=new URLSearchParams({key,q:coord(point),zoom:"17",language:"ko",region:"kr"});
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

function embedPlaceQueryUrl(key,query){
  const params=new URLSearchParams({key,q:String(query||""),zoom:"17",language:"ko",region:"kr"});
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
  return `<iframe class="google-map-frame" title="${esc(title)}" src="${esc(src)}" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}

function noKeyHtml(){
  return `<div class="google-map-key-setup">
    <div class="google-map-logo">Google Maps</div>
    <h3>대시보드 내부 Google Maps 경로 연동</h3>
    <p>Maps Embed API 키를 아래에 한 번 저장하면 외부 지도 탭을 열지 않고 자동차·대중교통·도보 경로와 일정별 위치를 이 화면에서 바로 확인합니다.</p>
    <div class="google-map-key-row"><input id="google-maps-embed-key" type="password" autocomplete="off" placeholder="Google Maps Embed API key"><button type="button" class="btn primary" id="save-google-maps-key">저장 후 Google 지도 열기</button></div>
    <small>권장 제한: Maps Embed API만 허용 + HTTP referrer <b>https://shopper12.github.io/test/*</b>. 키는 이 브라우저 localStorage에만 저장됩니다.</small>
  </div>`;
}

function controlsHtml(segment){
  if(!segment) return "";
  const modes=["driving","transit","walking"];
  return `<div class="google-map-controls">
    <div><b>${esc(segment.a.name)} → ${esc(segment.b.name)}</b><small>Google Maps 실제 경로 · 아래 일정 카드를 누르면 이 경로가 자동 변경됩니다.</small></div>
    <div class="google-map-mode-buttons">${modes.map(mode=>`<button type="button" data-google-map-mode="${mode}" class="${(state.modeOverride||segment.mode)===mode?"active":""}">${mode==="driving"?"🚗":mode==="transit"?"🚇":"🚶"} ${modeLabel(mode)}</button>`).join("")}</div>
  </div>`;
}

function mapShell(){return document.querySelector("#map > .google-map-shell");}

function pulseMap(){
  const shell=mapShell();if(!shell)return;
  shell.classList.remove("map-focused");
  void shell.offsetWidth;
  shell.classList.add("map-focused");
  setTimeout(()=>shell.classList.remove("map-focused"),900);
  document.querySelector("#map")?.scrollIntoView({behavior:"smooth",block:"center"});
}

function ensureKeyOrSetup(){
  const host=document.querySelector("#map");if(!host)return false;
  let shell=mapShell();
  if(!shell){shell=document.createElement("div");shell.className="google-map-shell";host.append(shell);}
  if(apiKey())return true;
  shell.innerHTML=noKeyHtml();
  shell.querySelector("#save-google-maps-key")?.addEventListener("click",()=>{
    const input=shell.querySelector("#google-maps-embed-key");if(!input?.value.trim())return;
    saveApiKey(input.value);renderGoogleMap();bindRouteList(true);
  });
  return false;
}

function renderCustomView(shell,key){
  const view=state.customView;if(!view)return false;
  if(view.kind==="place"){
    shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(view.title||view.query)}</b><small>선택 일정 위치 · Google Maps 17단계 확대</small></div></div>${iframeHtml(embedPlaceQueryUrl(key,view.query),view.title||view.query)}<button type="button" class="google-map-key-reset" id="reset-google-maps-key">Google Maps API 키 변경</button>`;
  }else{
    const modes=view.mode==="flying"?["flying"]:["driving","transit","walking"];
    shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(view.title||`${view.origin} → ${view.destination}`)}</b><small>선택 일정의 실제 출발지·도착지${view.waypoints?" · 경유지 포함":""} · Google Maps 자동 경로맞춤</small></div><div class="google-map-mode-buttons">${modes.map(m=>`<button type="button" data-custom-route-mode="${m}" class="${view.mode===m?"active":""}">${m==="driving"?"🚗":m==="transit"?"🚇":m==="walking"?"🚶":"✈"} ${modeLabel(m)}</button>`).join("")}</div></div>${iframeHtml(embedDirectionsTextUrl(key,view.origin,view.destination,view.mode,view.waypoints||""),view.title||`${view.origin} → ${view.destination}`)}<button type="button" class="google-map-key-reset" id="reset-google-maps-key">Google Maps API 키 변경</button>`;
    shell.querySelectorAll("[data-custom-route-mode]").forEach(button=>button.addEventListener("click",()=>{
      state.customView={...state.customView,mode:button.dataset.customRouteMode};
      renderGoogleMap();pulseMap();
    }));
  }
  shell.querySelector("#reset-google-maps-key")?.addEventListener("click",()=>{saveApiKey("");renderGoogleMap();});
  return true;
}

function showPlaceQuery(query,title=query){
  if(!query)return;
  state.selectedSegment=null;
  state.modeOverride=null;
  state.customView={kind:"place",query:String(query),title:String(title||query)};
  renderGoogleMap();
  pulseMap();
}

function showTextDirections(origin,destination,mode="driving",waypoints="",title=""){
  if(!origin||!destination)return;
  state.selectedSegment=null;
  state.modeOverride=null;
  state.customView={kind:"directions",origin:String(origin),destination:String(destination),mode,waypoints:String(waypoints||""),title:String(title||`${origin} → ${destination}`)};
  renderGoogleMap();
  pulseMap();
}

function renderGoogleMap(){
  resetForDayChange();
  const host=document.querySelector("#map");
  if(!host || !host.querySelector(".leaflet-map-pane")) return;
  const key=apiKey(), points=routePoints();
  if(!points.length) return;

  let shell=host.querySelector(":scope > .google-map-shell");
  if(!shell){shell=document.createElement("div");shell.className="google-map-shell";host.append(shell);}
  state.boundHost=host;

  if(!key){
    shell.innerHTML=noKeyHtml();
    shell.querySelector("#save-google-maps-key")?.addEventListener("click",()=>{
      const input=shell.querySelector("#google-maps-embed-key");
      if(!input?.value.trim()) return;
      saveApiKey(input.value);renderGoogleMap();bindRouteList(true);
    });
    return;
  }

  if(renderCustomView(shell,key))return;

  const segment=initialSegment(points);
  if(!segment){
    shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(points[0].name)}</b><small>Google Maps 장소 보기</small></div><button type="button" id="reset-google-maps-key">API 키 변경</button></div>${iframeHtml(embedPlaceUrl(key,points[0]),points[0].name)}`;
    return;
  }

  const mode=state.modeOverride || segment.mode;
  const src=embedDirectionsUrl(key,segment.a,segment.b,mode);
  shell.innerHTML=`${controlsHtml(segment)}${iframeHtml(src,`${segment.a.name}에서 ${segment.b.name}까지 Google Maps 경로`)}<button type="button" class="google-map-key-reset" id="reset-google-maps-key">Google Maps API 키 변경</button>`;
  shell.querySelectorAll("[data-google-map-mode]").forEach(button=>button.addEventListener("click",()=>{state.modeOverride=button.dataset.googleMapMode;renderGoogleMap();pulseMap();}));
  shell.querySelector("#reset-google-maps-key")?.addEventListener("click",()=>{saveApiKey("");renderGoogleMap();});
}

function selectSegment(index){
  state.customView=null;
  state.selectedSegment=Number(index);
  state.modeOverride=null;
  renderGoogleMap();
  document.querySelectorAll("#route-list .route-stop").forEach((stop,i)=>stop.classList.toggle("route-selected",i===Number(index)));
  pulseMap();
}

function parseDirectionsFromMapUrl(href){
  try{
    const url=new URL(href,location.href),p=url.searchParams;
    const origin=p.get("origin"),destination=p.get("destination");
    if(origin&&destination)return{origin,destination,waypoints:p.get("waypoints")||"",mode:["driving","walking","bicycling","transit"].includes(p.get("travelmode"))?p.get("travelmode"):"driving"};
  }catch{}
  return null;
}

function parsePlaceFromMapUrl(href){
  try{
    const url=new URL(href,location.href),p=url.searchParams;
    return p.get("query")||p.get("q")||"";
  }catch{return "";}
}

function routeTextParts(event){
  const candidates=[event?.location,event?.title].filter(Boolean);
  for(const raw of candidates){
    const parts=String(raw).split(/\s*(?:→|->|⇒)\s*/).map(x=>x.trim()).filter(Boolean);
    if(parts.length>=2){
      return {origin:parts[0],destination:parts[parts.length-1],waypoints:parts.slice(1,-1).join("|")};
    }
  }
  return null;
}

function scorePoint(event,point){
  const target=norm(`${event.title||""} ${event.location||""}`),candidate=norm(`${point.name||""} ${point.popup||""}`);
  if(!target||!candidate)return 0;
  if(target.includes(norm(point.name))||candidate.includes(norm(event.location)))return 100;
  let score=0;for(const token of target.split(" "))if(token.length>3&&candidate.includes(token))score+=6;return score;
}

function showEvent(event){
  if(!event)return;
  const explicit=parseDirectionsFromMapUrl(event.map_url||"");
  if(explicit){showTextDirections(explicit.origin,explicit.destination,explicit.mode,explicit.waypoints,event.title);return;}

  const textRoute=routeTextParts(event);
  if(textRoute){
    showTextDirections(textRoute.origin,textRoute.destination,modeForEvent(event),textRoute.waypoints,event.title);
    return;
  }

  const query=parsePlaceFromMapUrl(event.map_url||"");
  if(query){showPlaceQuery(query,event.title||query);return;}

  const points=routePoints();let bestIndex=-1,bestScore=0;
  points.forEach((point,index)=>{const score=scorePoint(event,point);if(score>bestScore){bestScore=score;bestIndex=index;}});
  if(bestIndex>0&&bestScore>=20){selectSegment(bestIndex);return;}
  if(bestIndex===0&&bestScore>=20){showPlaceQuery(`${points[0].lat},${points[0].lng}`,event.title||points[0].name);return;}
  showPlaceQuery(event.location||event.title,event.title||event.location);
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
      if(button){event.preventDefault();event.stopImmediatePropagation();selectSegment(button.dataset.googleSegment);return;}
      const stop=event.target.closest(".route-stop");
      if(!stop || event.target.closest("a,button")) return;
      const index=stops.indexOf(stop);
      if(index>0 && Number(points[index-1].day_id)===Number(points[index].day_id)){
        event.preventDefault();event.stopImmediatePropagation();selectSegment(index);
      } else if(index===0 && apiKey()) showPlaceQuery(`${points[0].lat},${points[0].lng}`,points[0].name);
    },true);
  }

  list.classList.toggle("google-maps-ready",Boolean(apiKey()));
  list.querySelectorAll(".live-route-actions").forEach(row=>row.hidden=Boolean(apiKey()));
}

function enhance(){
  if(!document.querySelector("#map")) return;
  renderGoogleMap();bindRouteList();
  const note=document.querySelector("#route-list .map-live-note");
  if(note && apiKey()) note.innerHTML="<b>Google Maps가 이 대시보드 안에 직접 연동되어 있습니다.</b> 위 경로목록이나 아래 전체 일정 카드를 누르면 선택한 일정이 유지되며 실제 출발지·도착지·경유지에 맞춰 지도가 다시 맞춰집니다.";
}

document.addEventListener("trip:map-event",event=>showEvent(event.detail?.event));
document.addEventListener("trip:map-place",event=>{if(event.detail?.query)showPlaceQuery(event.detail.query,event.detail.query);});

const observer=new MutationObserver(()=>{clearTimeout(observer._timer);observer._timer=setTimeout(enhance,140);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",enhance);
