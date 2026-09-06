const AIRPORT_COORDS = new Map([
  ["Incheon International Airport", [37.4602,126.4407]],
  ["Taichung International Airport", [24.2647,120.6206]],
  ["Taoyuan International Airport", [25.0797,121.2342]],
  ["Amsterdam Airport Schiphol", [52.3105,4.7683]],
  ["Hamburg Airport", [53.6304,9.9882]],
  ["Esbjerg Airport", [55.5259,8.5534]],
  ["Aberdeen Airport", [57.2019,-2.1978]],
]);

const MAP_MANIFEST = Object.freeze({
  "f1-01": {kind:"route",origin:"Incheon International Airport",destination:"Taichung International Airport",mode:"flight"},
  "f1-02": {kind:"route",origin:"Taichung International Airport",destination:"CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., North District, Taichung",mode:"driving"},
  "f1-03": {kind:"route",origin:"CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., North District, Taichung",destination:"Port of Taichung / Taiwan International Ports Corporation, No.2 Sec.10 Taiwan Blvd., Wuqi Dist., Taichung",mode:"driving"},
  "f1-04": {kind:"route",origin:"Port of Taichung / Taiwan International Ports Corporation",destination:"CHECK Inn Taichung LaiLai",mode:"driving"},
  "f2-01": {kind:"place",query:"CHECK Inn Taichung LaiLai"},
  "f2-02": {kind:"place",query:"No.100 Zhugang Road, Wuqi District, Taichung"},
  "f2-03": {kind:"route",origin:"No.100 Zhugang Road, Wuqi District, Taichung",destination:"Changhua County, Taiwan",mode:"driving"},
  "f2-04": {kind:"place",query:"Changhua County, Taiwan"},
  "f2-05": {kind:"route",origin:"Changhua County, Taiwan",destination:"Taichung, Taiwan",mode:"driving"},
  "f2-06": {kind:"place",query:"Taichung, Taiwan"},
  "f3-01": {kind:"place",query:"CHECK Inn Taichung LaiLai"},
  "f3-02": {kind:"route",origin:"CHECK Inn Taichung LaiLai",destination:"Taiwan Taoyuan International Airport",mode:"driving"},
  "f3-03": {kind:"route",origin:"Taoyuan International Airport",destination:"Amsterdam Airport Schiphol",mode:"flight"},
  "f4-01": {kind:"route",origin:"Amsterdam Airport Schiphol",waypoints:"Amsterdam Sloterdijk",destination:"Urban Lodge Hotel, Arlandaweg 10, Amsterdam",mode:"transit"},
  "f4-02": {kind:"route",origin:"Urban Lodge Hotel, Amsterdam",destination:"Museum Rembrandthuis, Jodenbreestraat 4, Amsterdam",mode:"transit"},
  "f4-03": {kind:"place",query:"Museum Rembrandthuis, Jodenbreestraat 4, Amsterdam"},
  "f4-04": {kind:"place",query:"Black Gold, Korte Koningsstraat 13 H, Amsterdam"},
  "f4-05": {kind:"route",origin:"Black Gold, Korte Koningsstraat 13 H, Amsterdam",waypoints:"Zuiderkerk, Amsterdam|Rembrandtplein, Amsterdam",destination:"Proeflokaal A. van Wees, Herengracht 319, Amsterdam",mode:"walking"},
  "f4-06": {kind:"place",query:"Proeflokaal A. van Wees, Herengracht 319, Amsterdam"},
  "f4-07": {kind:"place",query:"Evening Canal Cruise Amsterdam Centrum"},
  "f4-08": {kind:"route",origin:"Jordaan, Amsterdam",waypoints:"Dam Square, Amsterdam",destination:"Amsterdam Centraal",mode:"walking"},
  "f4-09": {kind:"route",origin:"Amsterdam Centraal",waypoints:"Amsterdam Sloterdijk",destination:"Urban Lodge Hotel, Arlandaweg 10, Amsterdam",mode:"transit"},
  "f5-01": {kind:"place",query:"Urban Lodge Hotel, Arlandaweg 10, Amsterdam"},
  "f5-02": {kind:"route",origin:"Urban Lodge Hotel, Arlandaweg 10, Amsterdam",waypoints:"Amsterdam Sloterdijk",destination:"Den Helder Station",mode:"transit"},
  "f6-01": {kind:"route",origin:"Urban Lodge Hotel, Arlandaweg 10, Amsterdam",waypoints:"Amsterdam Sloterdijk|Den Helder Station",destination:"OEG Subsea BV, Koperslagersweg 2, 1786 RA Den Helder",mode:"transit"},
  "f6-02": {kind:"place",query:"OEG Subsea BV, Koperslagersweg 2, 1786 RA Den Helder"},
  "f6-03": {kind:"route",origin:"OEG Subsea BV, Koperslagersweg 2, 1786 RA Den Helder",waypoints:"Den Helder Station|Urban Lodge Hotel, Arlandaweg 10, Amsterdam|Amsterdam Sloterdijk",destination:"Amsterdam Airport Schiphol",mode:"transit"},
  "f6-04": {kind:"route",origin:"Amsterdam Airport Schiphol",destination:"Hamburg Airport",mode:"flight"},
  "f6-05": {kind:"route",origin:"Hamburg Airport",waypoints:"Hamburg Hbf",destination:"Best Western Plus Hotel St. Raphael, Adenauerallee 41, Hamburg",mode:"transit"},
  "f7-01": {kind:"place",query:"OWC Hamburg, Alter Wall 69, 20457 Hamburg"},
  "f7-02": {kind:"place",query:"DNV Hamburg, Brooktorkai 18, 20457 Hamburg"},
  "f8-01": {kind:"place",query:"Skyborn Renewables GmbH, Ericusspitze 2-4, 20457 Hamburg"},
  "f8-02": {kind:"route",origin:"Skyborn Renewables GmbH, Ericusspitze 2-4, Hamburg",waypoints:"Best Western Plus Hotel St. Raphael, Adenauerallee 41, Hamburg",destination:"Hamburg Hbf",mode:"driving"},
  "f8-03": {kind:"route",origin:"Hamburg Hbf",waypoints:"Kolding Station",destination:"Esbjerg Station",mode:"transit"},
  "f8-04": {kind:"route",origin:"Esbjerg Station",destination:"Hotel Britannia, Torvegade 24, 6700 Esbjerg",mode:"walking"},
  "f9-01": {kind:"place",query:"Blue Water Shipping, Trafikhavnskaj 9, 6700 Esbjerg"},
  "f9-02": {kind:"route",origin:"Esbjerg Station",destination:"Aarhus H",mode:"transit"},
  "f9-03": {kind:"place",query:"OWC Denmark, Banegardspladsen 4, 8000 Aarhus C"},
  "f9-04": {kind:"route",origin:"OWC Denmark, Banegardspladsen 4, Aarhus",waypoints:"Aarhus H|Esbjerg Station",destination:"Hotel Britannia, Torvegade 24, Esbjerg",mode:"transit"},
  "f10-01": {kind:"place",query:"Hotel Britannia, Torvegade 24, 6700 Esbjerg"},
  "f10-02": {kind:"route",origin:"Hotel Britannia, Torvegade 24, Esbjerg",destination:"Esbjerg Airport",mode:"driving"},
  "f10-03": {kind:"route",origin:"Esbjerg Airport",destination:"Aberdeen Airport",mode:"flight"},
  "f10-04": {kind:"place",query:"Aberdeen Airport"},
  "f10-05": {kind:"route",origin:"Aberdeen Airport",destination:"Amsterdam Airport Schiphol",mode:"flight"},
  "f10-06": {kind:"place",query:"Amsterdam Airport Schiphol"},
  "f10-07": {kind:"route",origin:"Amsterdam Airport Schiphol",destination:"Incheon International Airport",mode:"flight"},
  "f11-01": {kind:"place",query:"Incheon International Airport Terminal 2"},
});

const AMBIGUOUS=/^(?:Taichung|Amsterdam|Den Helder|Hamburg|Esbjerg|Aarhus|호텔|공항|도심|라운지)$/i;
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
