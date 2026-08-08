import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { eventMapView, endpointForEvent, samePlace } from '../map-routing.mjs';

const dataPath=process.argv[2]||'./itinerary-data.js';
const source=fs.readFileSync(dataPath,'utf8');
const temp='/tmp/itinerary-continuity.mjs';
fs.writeFileSync(temp,source);
const mod=await import(`${pathToFileURL(temp).href}?t=${Date.now()}`);
const {ITINERARIES}=mod;
let failures=0;
for(const [key,plan] of Object.entries(ITINERARIES)){
  const days=new Map(plan.officialSeed.days.map(d=>[Number(d.id),d]));
  const grouped=new Map();
  for(const e of plan.officialSeed.events){const id=Number(e.day_id);if(!grouped.has(id))grouped.set(id,[]);grouped.get(id).push(e);}
  let checked=0;
  for(const [dayId,events] of [...grouped.entries()].sort((a,b)=>a[0]-b[0])){
    const day=days.get(dayId)||{};
    const rows=events.slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    for(let i=1;i<rows.length;i++){
      const prev=rows[i-1],cur=rows[i];
      const prevEnd=endpointForEvent(prev,day);
      const view=eventMapView(rows,cur,day);
      const start=view?.kind==='route'?view.origin:view?.query||'';
      const connected=Boolean(prevEnd&&start&&samePlace(prevEnd,start));
      checked++;
      if(!connected){
        failures++;
        console.error(`${key}\tDay ${dayId}\t${prev.id} -> ${cur.id}\tGAP\t${prevEnd} != ${start}\t${cur.title}`);
      }
    }
  }
  console.log(`${key}: checked ${checked} same-day joins`);
}
if(failures){console.error(`TOTAL GAPS: ${failures}`);process.exit(1);}else console.log('TOTAL GAPS: 0');
