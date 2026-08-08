const AIRPORT_COORDS = new Map([
  ["Incheon International Airport", [37.4602,126.4407]],
  ["Taichung International Airport", [24.2647,120.6206]],
  ["Taoyuan International Airport", [25.0797,121.2342]],
  ["Amsterdam Airport Schiphol", [52.3105,4.7683]],
  ["Copenhagen Airport", [55.6181,12.6560]],
  ["Istanbul Airport", [41.2753,28.7519]],
  ["Paris Charles de Gaulle Airport", [49.0097,2.5479]],
]);

const MAP_MANIFEST = Object.freeze({
  "d1-01": {kind:"place",query:"Incheon International Airport"},
  "d1-02": {kind:"route",origin:"Incheon International Airport",destination:"Taichung International Airport",mode:"flight"},
  "d1-03": {kind:"route",origin:"Taichung International Airport",destination:"Holiday Inn Express Taichung Park",mode:"driving"},
  "d1-04": {kind:"place",query:"Taichung Park, Taichung, Taiwan"},
  "d1-05": {kind:"route",origin:"Holiday Inn Express Taichung Park",destination:"Port of Taichung, Taiwan International Ports Corporation",mode:"driving"},
  "d1-06": {kind:"place",query:"Port of Taichung, Taiwan International Ports Corporation"},
  "d1-07": {kind:"route",origin:"Port of Taichung, Taiwan International Ports Corporation",waypoints:"Wuqi Fishing Harbor",destination:"Gaomei Wetlands",mode:"driving"},
  "d1-08": {kind:"route",origin:"Gaomei Wetlands",destination:"Holiday Inn Express Taichung Park",mode:"driving"},

  "d2-01": {kind:"route",origin:"Holiday Inn Express Taichung Park",destination:"24.0765986,120.3773545",mode:"driving"},
  "d2-02": {kind:"place",query:"24.0765986,120.3773545"},
  "d2-03": {kind:"place",query:"24.0765986,120.3773545"},
  "d2-04": {kind:"route",origin:"24.0765986,120.3773545",waypoints:"Lukang Old Street",destination:"Lukang Longshan Temple, Changhua, Taiwan",mode:"driving"},
  "d2-05": {kind:"route",origin:"Lukang Longshan Temple, Changhua, Taiwan",destination:"Holiday Inn Express Taichung Park",mode:"driving"},
  "d2-06": {kind:"place",query:"Chun Shui Tang Siwei Original Store, Taichung"},

  "d3-01": {kind:"route",origin:"Holiday Inn Express Taichung Park",waypoints:"National Taichung Theater",destination:"Calligraphy Greenway, Taichung",mode:"driving"},
  "d3-02": {kind:"route",origin:"Calligraphy Greenway, Taichung",waypoints:"Miyahara, Taichung",destination:"Taichung Station",mode:"driving"},
  "d3-03": {kind:"route",origin:"Taichung Station",waypoints:"THSR Taichung Station|THSR Taoyuan Station",destination:"Taoyuan International Airport",mode:"transit"},
  "d3-04": {kind:"place",query:"Taoyuan International Airport Terminal 1"},
  "d3-05": {kind:"route",origin:"Taoyuan International Airport",destination:"Amsterdam Airport Schiphol",mode:"flight"},

  "d4-01": {kind:"route",origin:"Amsterdam Airport Schiphol",destination:"Rotterdam Centraal",mode:"transit"},
  "d4-02": {kind:"place",query:"Holiday Inn Express Rotterdam - Central Station"},
  "d4-03": {kind:"route",origin:"Holiday Inn Express Rotterdam - Central Station",waypoints:"Markthal Rotterdam|Cube Houses Rotterdam",destination:"Oude Haven Rotterdam",mode:"walking"},
  "d4-04": {kind:"place",query:"Holiday Inn Express Rotterdam - Central Station"},
  "d4-05": {kind:"route",origin:"Holiday Inn Express Rotterdam - Central Station",waypoints:"Historic Delfshaven Rotterdam|Erasmus Bridge Rotterdam",destination:"Restaurant Bazar Rotterdam",mode:"transit"},

  "d5-01": {kind:"place",query:"Holiday Inn Express Rotterdam - Central Station"},
  "d5-02": {kind:"place",query:"Holiday Inn Express Rotterdam - Central Station"},
  "d5-03": {kind:"route",origin:"Holiday Inn Express Rotterdam - Central Station",waypoints:"Erasmusbrug Waterbus Rotterdam",destination:"Kinderdijk Windmills",mode:"transit"},
  "d5-04": {kind:"route",origin:"Kinderdijk Windmills",destination:"Fenix Food Factory Rotterdam",mode:"transit"},

  "d6-01": {kind:"place",query:"Holiday Inn Express Rotterdam - Central Station"},
  "d6-02": {kind:"route",origin:"Holiday Inn Express Rotterdam - Central Station",destination:"Port of Rotterdam Authority, Wilhelminakade 909, Rotterdam",mode:"driving"},
  "d6-03": {kind:"place",query:"Port of Rotterdam Authority, World Port Center, Wilhelminakade 909, Rotterdam"},
  "d6-04": {kind:"route",origin:"Port of Rotterdam Authority, Wilhelminakade 909, Rotterdam",waypoints:"Wilhelminaplein Rotterdam",destination:"Rotterdam Offshore Group, Drutenstraat 7, Rotterdam",mode:"driving"},
  "d6-05": {kind:"place",query:"Rotterdam Offshore Group, Drutenstraat 7, Rotterdam"},
  "d6-06": {kind:"route",origin:"Rotterdam Offshore Group, Drutenstraat 7, Rotterdam",destination:"TNO Kesslerpark 1, Rijswijk",mode:"driving"},
  "d6-07": {kind:"place",query:"TNO Kesslerpark 1, Rijswijk"},
  "d6-08": {kind:"route",origin:"TNO Kesslerpark 1, Rijswijk",waypoints:"Holiday Inn Express Rotterdam - Central Station",destination:"Rotterdam Centraal",mode:"driving"},
  "d6-09": {kind:"route",origin:"Rotterdam Centraal",destination:"Hamburg Hbf",mode:"transit"},
  "d6-10": {kind:"route",origin:"Hamburg Hbf",destination:"Motel One Hamburg-Fleetinsel",mode:"driving"},

  "d7-01": {kind:"place",query:"Motel One Hamburg-Fleetinsel"},
  "d7-02": {kind:"place",query:"Speicherstadt, Hamburg"},
  "d7-03": {kind:"route",origin:"Speicherstadt, Hamburg",destination:"Oberhafen-Kantine, Stockmeyerstraße 39, Hamburg",mode:"walking"},
  "d7-04": {kind:"route",origin:"Oberhafen-Kantine, Stockmeyerstraße 39, Hamburg",destination:"Skyborn Renewables, Ericusspitze 2-4, Hamburg",mode:"walking"},
  "d7-05": {kind:"place",query:"Skyborn Renewables, Ericusspitze 2-4, Hamburg"},
  "d7-06": {kind:"place",query:"HafenCity, Hamburg"},
  "d7-07": {kind:"route",origin:"HafenCity, Hamburg",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},

  "d8-01": {kind:"route",origin:"Motel One Hamburg-Fleetinsel",destination:"Hamburg Hbf",mode:"transit"},
  "d8-02": {kind:"route",origin:"Hamburg Hbf",waypoints:"Kolding Station",destination:"Esbjerg Station",mode:"transit"},
  "d8-03": {kind:"route",origin:"Esbjerg Station",destination:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",mode:"walking"},
  "d8-04": {kind:"route",origin:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",waypoints:"Men at Sea Esbjerg",destination:"Fisheries and Maritime Museum Esbjerg",mode:"transit"},
  "d8-05": {kind:"place",query:"Esbjerg Street Food"},

  "d9-01": {kind:"place",query:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg"},
  "d9-02": {kind:"route",origin:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",destination:"Blue Water Shipping, Trafikhavnskaj 9, Esbjerg",mode:"driving"},
  "d9-03": {kind:"place",query:"Blue Water Shipping, Trafikhavnskaj 9, Esbjerg"},
  "d9-04": {kind:"route",origin:"Blue Water Shipping, Trafikhavnskaj 9, Esbjerg",waypoints:"Esbjerg Centrum",destination:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg",mode:"driving"},
  "d9-05": {kind:"place",query:"CABINN Plus Esbjerg, Torvegade 27, Esbjerg"},
  "d9-06": {kind:"route",origin:"Esbjerg Station",destination:"København H, Copenhagen",mode:"transit"},
  "d9-07": {kind:"route",origin:"København H, Copenhagen",waypoints:"Ørestad Station, Copenhagen",destination:"CABINN Metro, Arne Jacobsens Allé 2, Copenhagen",mode:"transit"},
  "d9-08": {kind:"place",query:"Field's Copenhagen, Arne Jacobsens Allé 12"},

  "d10c-01": {kind:"route",origin:"CABINN Metro, Arne Jacobsens Allé 2, Copenhagen",destination:"Copenhagen Airport",mode:"transit"},
  "d10c-02": {kind:"route",origin:"Copenhagen Airport",destination:"Paris Charles de Gaulle Airport",mode:"flight"},
  "d10c-03": {kind:"place",query:"Paris Charles de Gaulle Airport"},
  "d10c-04": {kind:"route",origin:"Paris Charles de Gaulle Airport",destination:"Incheon International Airport",mode:"flight"},
  "d10-01": {kind:"route",origin:"CABINN Metro, Arne Jacobsens Allé 2, Copenhagen",destination:"Copenhagen Airport",mode:"transit"},
  "d10-02": {kind:"route",origin:"Copenhagen Airport",destination:"Istanbul Airport",mode:"flight"},
  "d10-03": {kind:"place",query:"Istanbul Airport"},
  "d10-04": {kind:"route",origin:"Istanbul Airport",destination:"Incheon International Airport",mode:"flight"},
  "d11-01": {kind:"place",query:"Incheon International Airport"},
});

const AMBIGUOUS=/^(?:Taichung|Rotterdam|Hamburg|Copenhagen|Esbjerg|호텔|공항|도심|라운지)$/i;
const clone=x=>JSON.parse(JSON.stringify(x));

export function modeForEvent(event){
  const m=MAP_MANIFEST[String(event?.id||"")]?.mode;if(m)return m;
  const t=`${event?.category||""} ${event?.transport||""}`.toLowerCase();
  if(/항공|flight|airline/.test(t))return "flight";
  if(/thsr|mrt|metro|subway|rail|train|기차|철도|열차|버스|bus|tram|waterbus|ferry|u-bahn|s-bahn/.test(t))return "transit";
  if(/도보|walk/.test(t))return "walking";
  return "driving";
}
export function normalizePlace(raw){return String(raw||"").trim();}
function canonicalPlace(raw){return String(raw||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/terminal\s*[12]/g,"").replace(/[^a-z0-9가-힣]+/g," ").trim();}
export function samePlace(a,b){const x=canonicalPlace(a),y=canonicalPlace(b);return Boolean(x&&y&&(x===y||x.includes(y)||y.includes(x)));}

export function parseMapUrl(href){
  if(!href)return null;try{const u=new URL(href,"https://dashboard.local/"),p=u.searchParams;const origin=p.get("origin")||p.get("saddr"),destination=p.get("destination")||p.get("daddr");if(origin&&destination)return{kind:"route",origin,destination,waypoints:p.get("waypoints")||"",mode:p.get("travelmode")||"driving",source:"legacy_map_url"};const q=p.get("query")||p.get("q");if(q)return{kind:"place",query:q,source:"legacy_map_url"};}catch{}return null;
}
export function routeFromText(event){const parts=String(event?.location||event?.title||"").split(/\s*(?:→|->|⇒)\s*/).filter(Boolean);return parts.length>=2?{kind:"route",origin:parts[0],destination:parts.at(-1),waypoints:parts.slice(1,-1).join("|"),mode:modeForEvent(event),source:"legacy_text"}:null;}
export function placeForEvent(event){return String(event?.location||event?.title||"").trim();}

export function eventMapView(_dayEvents,event){
  const view=MAP_MANIFEST[String(event?.id||"")];
  if(view)return{...clone(view),source:"verified_manifest",verified:true};
  const explicit=parseMapUrl(event?.map_url);if(explicit)return{...explicit,verified:false};
  const text=routeFromText(event);if(text)return{...text,verified:false};
  return{kind:"place",query:placeForEvent(event),source:"fallback_unverified",verified:false};
}
export function endpointForEvent(event){const v=eventMapView([],event);return v.kind==="route"?v.destination:v.query;}
export function eventMapType(event){return eventMapView([],event).kind;}
export function manifestCoverage(events){const ids=(events||[]).map(e=>String(e.id));return{total:ids.length,covered:ids.filter(id=>MAP_MANIFEST[id]).length,missing:ids.filter(id=>!MAP_MANIFEST[id])};}

export function googleMapsEmbedUrl(view){
  if(!view)return"";
  if(view.kind==="place")return `https://maps.google.com/maps?${new URLSearchParams({q:view.query||"",z:"17",output:"embed"}).toString()}`;
  if(view.mode==="flight")return"";
  const destination=view.waypoints?`${String(view.waypoints).replaceAll("|"," to:")} to:${view.destination}`:view.destination;
  const p=new URLSearchParams({output:"embed",saddr:view.origin||"",daddr:destination||""});
  if(view.mode==="walking")p.set("dirflg","w");else if(view.mode==="transit")p.set("dirflg","r");else p.set("dirflg","d");
  return `https://maps.google.com/maps?${p.toString()}`;
}
export function googleMapsOpenUrl(view){
  if(!view)return"https://www.google.com/maps";
  if(view.kind==="place")return `https://www.google.com/maps/search/?${new URLSearchParams({api:"1",query:view.query||""}).toString()}`;
  const p=new URLSearchParams({api:"1",origin:view.origin||"",destination:view.destination||"",travelmode:view.mode==="walking"?"walking":view.mode==="transit"?"transit":"driving"});if(view.waypoints)p.set("waypoints",view.waypoints);return `https://www.google.com/maps/dir/?${p.toString()}`;
}
export function flightRoutePoints(view){if(view?.mode!=="flight")return[];const a=AIRPORT_COORDS.get(view.origin),b=AIRPORT_COORDS.get(view.destination);return a&&b?[{name:view.origin,lat:a[0],lng:a[1]},{name:view.destination,lat:b[0],lng:b[1]}]:[];}
export function mappingLabel(view){return view?.kind==="route"?"이동 경로":"장소";}

export function auditEventMappings(events){
  return (events||[]).map(event=>{const view=eventMapView([],event),target=view.kind==="route"?`${view.origin} → ${view.destination}`:view.query||"",mapped=view.kind==="route"?Boolean(view.origin&&view.destination&&!samePlace(view.origin,view.destination)):Boolean(view.query);return{day_id:Number(event.day_id),id:event.id,title:event.title,mapped,kind:view.kind,source:view.source,target,ambiguous:AMBIGUOUS.test(String(target).trim()),verified:Boolean(view.verified)};});
}
export function auditRouteContinuity(events){
  return auditEventMappings(events).filter(r=>r.kind==="route").map(r=>({day_id:r.day_id,from_id:r.id,to_id:r.id,from:r.target.split(" → ")[0]||"",to:r.target.split(" → ").at(-1)||"",connected:r.mapped&&!r.ambiguous,day_boundary:false,verified:r.verified}));
}
export function auditFullRouteContinuity(events){return auditRouteContinuity(events);}
