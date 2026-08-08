const STORAGE_KEY="offshore-trip-google-maps-embed-key";
const PENDING_KEY="offshore-trip-inline-google-map-request";

const esc=value=>String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
function apiKey(){return String(window.GOOGLE_MAPS_EMBED_KEY||localStorage.getItem(STORAGE_KEY)||"").trim();}
function isGoogleMapsUrl(href=""){return /https?:\/\/(www\.)?(google\.[^/]+\/maps|maps\.google\.[^/]+|maps\.app\.goo\.gl)/i.test(href);}

function parseGoogleMapsRequest(href){
  try{
    const url=new URL(href,location.href),p=url.searchParams;
    const origin=p.get("origin"),destination=p.get("destination"),waypoints=p.get("waypoints"),travelmode=p.get("travelmode")||"driving";
    if(origin&&destination)return{type:"directions",origin,destination,waypoints,mode:["driving","walking","bicycling","transit","flying"].includes(travelmode)?travelmode:"driving"};
    const q=p.get("query")||p.get("q")||decodeURIComponent(url.pathname.split("/search/")[1]||"").replaceAll("+"," ");
    if(q)return{type:"place",q};
    return null;
  }catch{return null;}
}

function embedUrl(request,key){
  if(!request||!key)return null;
  if(request.type==="directions"){
    const p=new URLSearchParams({key,origin:request.origin,destination:request.destination,mode:request.mode||"driving",units:"metric",language:"ko"});
    if(request.waypoints)p.set("waypoints",request.waypoints);
    return `https://www.google.com/maps/embed/v1/directions?${p.toString()}`;
  }
  const p=new URLSearchParams({key,q:request.q,language:"ko"});
  return `https://www.google.com/maps/embed/v1/place?${p.toString()}`;
}

function applyPending(){
  const key=apiKey();if(!key)return false;
  let request=null;try{request=JSON.parse(sessionStorage.getItem(PENDING_KEY)||"null");}catch{}
  if(!request)return false;
  const shell=document.querySelector("#map > .google-map-shell");if(!shell)return false;
  const src=embedUrl(request,key);if(!src)return false;
  const title=request.type==="directions"?`${request.origin} → ${request.destination}`:request.q;
  shell.innerHTML=`<div class="google-map-controls"><div><b>${esc(title||"Google Maps")}</b><small>외부 탭 없이 대시보드 안에서 Google Maps 표시</small></div></div><iframe class="google-map-frame" title="Google Maps" src="${esc(src)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  sessionStorage.removeItem(PENDING_KEY);
  return true;
}

function openInsideDashboard(href,fallbackText=""){
  const request=parseGoogleMapsRequest(href)||{type:"place",q:String(fallbackText||"현재 일정 장소").trim()};
  sessionStorage.setItem(PENDING_KEY,JSON.stringify(request));
  const mapTab=document.querySelector('#tabs [data-tab="map"]');
  if(mapTab&&!mapTab.classList.contains("active"))mapTab.click();
  setTimeout(applyPending,260);
  return true;
}

function rewriteLinks(){
  document.querySelectorAll("a[href]").forEach(a=>{
    const href=a.href||"";if(!isGoogleMapsUrl(href))return;
    a.removeAttribute("target");a.removeAttribute("rel");a.dataset.inlineGoogleMap="1";
    if(/지도|map/i.test(a.textContent||""))a.textContent=(a.textContent||"지도").replace(/\s*↗\s*$/,"").replace(/지도$/,"대시보드 지도에서 보기");
  });
}

document.addEventListener("click",event=>{
  const a=event.target.closest('a[data-inline-google-map="1"]');if(!a)return;
  const card=a.closest(".event-card,.ops-card,tr,.return-stopover-panel");
  const fallback=card?.querySelector(".event-title,b,td:nth-child(2)")?.textContent||a.textContent||"현재 일정 장소";
  if(openInsideDashboard(a.href,fallback)){event.preventDefault();event.stopImmediatePropagation();}
},true);

const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(()=>{rewriteLinks();applyPending();},100);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",()=>{rewriteLinks();applyPending();});
