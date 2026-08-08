const AIRPORT_ALIASES = new Map([
  ["ICN", "Incheon International Airport"],
  ["RMQ", "Taichung International Airport"],
  ["TPE", "Taoyuan International Airport"],
  ["CAN", "Guangzhou Baiyun International Airport"],
  ["AMS", "Amsterdam Airport Schiphol"],
  ["CPH", "Copenhagen Airport"],
  ["IST", "Istanbul Airport"],
]);
const FLIGHT_CITY_ALIASES = new Map([
  ["incheon", "Incheon International Airport"],
  ["인천", "Incheon International Airport"],
  ["taichung", "Taichung International Airport"],
  ["타이중", "Taichung International Airport"],
  ["taipei", "Taoyuan International Airport"],
  ["타이베이", "Taoyuan International Airport"],
  ["guangzhou", "Guangzhou Baiyun International Airport"],
  ["광저우", "Guangzhou Baiyun International Airport"],
  ["amsterdam", "Amsterdam Airport Schiphol"],
  ["암스테르담", "Amsterdam Airport Schiphol"],
  ["copenhagen", "Copenhagen Airport"],
  ["코펜하겐", "Copenhagen Airport"],
  ["istanbul", "Istanbul Airport"],
  ["이스탄불", "Istanbul Airport"],
]);

const GENERIC_HOTEL = /^(?:호텔|호텔[·\s-]*체크인|호텔\s*(?:회의공간\/공용공간|공용공간))$/i;
const AMBIGUOUS = /호텔\s*(?:회의공간|공용공간)|라운지\/도심\s*업무공간|호텔[·\s-]*체크인/i;

export function modeForEvent(event){
  const t=`${event?.category||""} ${event?.transport||""}`.toLowerCase();
  if(/항공|flight|airline/.test(t))return "driving";
  if(/thsr|mrt|metro|subway|rail|train|기차|철도|열차|버스|bus|u-bahn|s-bahn|dsb|db\/|ns\//.test(t))return "transit";
  if(/도보|walk/.test(t))return "walking";
  return "driving";
}

export function normalizePlace(raw, day={}){
  let text=String(raw||"").trim();
  if(!text)return "";
  if(GENERIC_HOTEL.test(text) && day?.lodging && !/기내박|귀가/.test(day.lodging))return String(day.lodging).trim();
  if(/CABINN\s*Plus\s*라운지\/도심\s*업무공간/i.test(text))return "CABINN Plus Esbjerg, Torvegade 27, Esbjerg";
  if(/^가오메이$/i.test(text))return "Gaomei Wetlands";
  if(/^코펜하겐\s*중앙역$/i.test(text))return "København H, Copenhagen";
  if(/^함부르크\s*중앙역$/i.test(text))return "Hamburg Hbf";
  if(/^타오위안공항$/i.test(text))return "Taoyuan International Airport";
  if(/^타이중공항$/i.test(text))return "Taichung International Airport";
  if(/^인천공항$/i.test(text))return "Incheon International Airport";
  if(AIRPORT_ALIASES.has(text.toUpperCase()))return AIRPORT_ALIASES.get(text.toUpperCase());
  return text;
}

function normalizeEndpoint(raw,day={},event={}){
  const place=normalizePlace(raw,day);
  const isFlight=/항공|flight|china southern|china airlines|turkish/i.test(`${event?.category||""} ${event?.transport||""}`);
  if(isFlight){
    const alias=FLIGHT_CITY_ALIASES.get(place.toLowerCase());
    if(alias)return alias;
  }
  return place;
}

function canonicalPlace(raw){
  let text=String(raw||"").toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  text=text.replace(/terminal\s*[12]|\bt[12]\b/g,'').replace(/international airport/g,'airport').replace(/airport schiphol/g,'schiphol airport');
  text=text.replace(/motel one hamburg fleetinsel/g,'motel one fleetinsel').replace(/cabin[n]? plus esbjerg.*$/g,'cabinn plus esbjerg');
  text=text.replace(/københavn/g,'kobenhavn').replace(/[^a-z0-9가-힣]+/g,' ').trim();
  return text;
}
export function samePlace(a,b){
  const x=canonicalPlace(a),y=canonicalPlace(b);if(!x||!y)return false;
  return x===y||x.includes(y)||y.includes(x);
}

export function parseMapUrl(href, day={}, event={}){
  if(!href)return null;
  try{
    const u=new URL(href,"https://dashboard.local/"),p=u.searchParams;
    const origin=p.get("origin")||p.get("saddr"),destination=p.get("destination")||p.get("daddr");
    if(origin&&destination)return{
      kind:"route",origin:normalizeEndpoint(origin,day,event),destination:normalizeEndpoint(destination,day,event),
      waypoints:String(p.get("waypoints")||"").split("|").map(x=>normalizeEndpoint(x,day,event)).filter(Boolean).join("|"),
      mode:p.get("travelmode")||"",source:"map_url_route"
    };
    const q=p.get("query")||p.get("q");
    if(q)return{kind:"place",query:normalizeEndpoint(q,day,event),source:"map_url_place"};
  }catch{}
  return null;
}

export function routeFromText(event, day={}){
  for(const raw of [event?.location,event?.title]){
    const parts=String(raw||"").split(/\s*(?:→|->|⇒)\s*/).map(x=>normalizeEndpoint(x,day,event)).filter(Boolean);
    if(parts.length>=2)return{
      kind:"route",origin:parts[0],destination:parts.at(-1),waypoints:parts.slice(1,-1).join("|"),
      mode:modeForEvent(event),source:"text_route"
    };
  }
  return null;
}

export function placeForEvent(event, day={}){return normalizeEndpoint(event?.location||event?.title||"",day,event);}

export function endpointForEvent(event, day={}){
  const explicit=parseMapUrl(event?.map_url,day,event);
  if(explicit?.kind==="route")return explicit.destination;
  if(explicit?.kind==="place")return explicit.query;
  const text=routeFromText(event,day);
  if(text?.kind==="route")return text.destination;
  return placeForEvent(event,day);
}

function continuityRoute(prevEnd,route,mode){
  if(!prevEnd||samePlace(prevEnd,route.origin))return route;
  const points=[route.origin,...String(route.waypoints||"").split("|")].filter(Boolean);
  const unique=[];for(const p of points)if(!samePlace(p,prevEnd)&&!unique.some(x=>samePlace(x,p)))unique.push(p);
  return{...route,origin:prevEnd,waypoints:unique.join("|"),mode:route.mode||mode,source:`continuity_${route.source||"route"}`,continuityFixed:true};
}

export function eventMapView(dayEvents,event,day={}){
  const events=(dayEvents||[]).slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const idx=events.findIndex(x=>String(x.id)===String(event?.id));
  const prevEnd=idx>0?endpointForEvent(events[idx-1],day):"";
  const mode=modeForEvent(event);
  const explicit=parseMapUrl(event?.map_url,day,event);
  if(explicit?.kind==="route")return continuityRoute(prevEnd,{...explicit,mode:explicit.mode||mode},mode);
  if(explicit?.kind==="place"){
    if(prevEnd&&!samePlace(prevEnd,explicit.query))return{kind:"route",origin:prevEnd,destination:explicit.query,waypoints:"",mode,source:"derived_from_map_place",derived:true};
    return explicit;
  }
  const textRoute=routeFromText(event,day);
  if(textRoute)return continuityRoute(prevEnd,textRoute,mode);
  const destination=placeForEvent(event,day);
  if(idx>0&&destination&&prevEnd&&!samePlace(prevEnd,destination))return{kind:"route",origin:prevEnd,destination,waypoints:"",mode,source:"derived_route",derived:true};
  return{kind:"place",query:destination,source:prevEnd&&samePlace(prevEnd,destination)?"same_place":"place"};
}

export function googleMapsEmbedUrl(view){
  if(!view)return "";
  if(view.kind==="place")return `https://maps.google.com/maps?${new URLSearchParams({q:view.query||"",z:"17",output:"embed"}).toString()}`;
  const destination=view.waypoints?`${String(view.waypoints).replaceAll("|"," to:")} to:${view.destination}`:view.destination;
  const p=new URLSearchParams({output:"embed",saddr:view.origin||"",daddr:destination||""});
  if(view.mode==="walking")p.set("dirflg","w");else if(view.mode==="transit")p.set("dirflg","r");else p.set("dirflg","d");
  return `https://maps.google.com/maps?${p.toString()}`;
}

export function googleMapsOpenUrl(view){
  if(!view)return "https://www.google.com/maps";
  if(view.kind==="place")return `https://www.google.com/maps/search/?${new URLSearchParams({api:"1",query:view.query||""}).toString()}`;
  const p=new URLSearchParams({api:"1",origin:view.origin||"",destination:view.destination||"",travelmode:view.mode||"driving"});
  if(view.waypoints)p.set("waypoints",view.waypoints);
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

export function mappingLabel(view){
  if(view?.continuityFixed)return "연속경로";
  if(view?.kind==="route")return view.derived?"직전 일정→경로":"경로";
  return view?.source==="same_place"?"같은 장소":"위치";
}

export function auditEventMappings(events,days){
  const dayMap=new Map((days||[]).map(d=>[Number(d.id),d]));
  const grouped=new Map();for(const e of events||[]){const id=Number(e.day_id);if(!grouped.has(id))grouped.set(id,[]);grouped.get(id).push(e);}
  const rows=[];
  for(const [dayId,dayEvents] of [...grouped.entries()].sort((a,b)=>a[0]-b[0])){
    const day=dayMap.get(dayId)||{},sorted=dayEvents.slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    for(const event of sorted){
      const view=eventMapView(sorted,event,day),target=view?.kind==="route"?`${view.origin} → ${view.destination}`:view?.query||"";
      const mapped=Boolean(view&&(view.kind==="route"?view.origin&&view.destination:view.query));
      rows.push({day_id:dayId,id:event.id,title:event.title,mapped,kind:view?.kind||"none",source:view?.source||"none",target,ambiguous:AMBIGUOUS.test(target),continuityFixed:Boolean(view?.continuityFixed)});
    }
  }
  return rows;
}

export function auditRouteContinuity(events,days){
  const dayMap=new Map((days||[]).map(d=>[Number(d.id),d])),grouped=new Map();
  for(const e of events||[]){const id=Number(e.day_id);if(!grouped.has(id))grouped.set(id,[]);grouped.get(id).push(e);}
  const rows=[];
  for(const [dayId,dayEvents] of [...grouped.entries()].sort((a,b)=>a[0]-b[0])){
    const day=dayMap.get(dayId)||{},sorted=dayEvents.slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    for(let i=1;i<sorted.length;i++){
      const prev=sorted[i-1],event=sorted[i],prevEnd=endpointForEvent(prev,day),view=eventMapView(sorted,event,day);
      const start=view?.kind==="route"?view.origin:view?.query||"";
      rows.push({day_id:dayId,from_id:prev.id,to_id:event.id,from:prevEnd,to:start,connected:Boolean(prevEnd&&start&&samePlace(prevEnd,start)),kind:view?.kind||"none",source:view?.source||"none"});
    }
  }
  return rows;
}
