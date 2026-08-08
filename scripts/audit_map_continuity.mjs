import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { auditFullRouteContinuity } from '../map-routing.mjs';

const dataPath=process.argv[2]||'./itinerary-data.js';
const source=fs.readFileSync(dataPath,'utf8');
const temp='/tmp/itinerary-continuity.mjs';
fs.writeFileSync(temp,source);
const mod=await import(`${pathToFileURL(temp).href}?t=${Date.now()}`);
const {ITINERARIES}=mod;
let failures=0,total=0,boundaries=0;
for(const [key,plan] of Object.entries(ITINERARIES)){
  const rows=auditFullRouteContinuity(plan.officialSeed.events||[],plan.officialSeed.days||[]);
  const bad=rows.filter(r=>!r.connected),dayBoundary=rows.filter(r=>r.day_boundary);
  failures+=bad.length;total+=rows.length;boundaries+=dayBoundary.length;
  for(const r of bad)console.error(`${key}\tDay ${r.from_day}->${r.day_id}\t${r.from_id} -> ${r.to_id}\tGAP\t${r.from} != ${r.to}\t${r.source}`);
  console.log(`${key}: checked ${rows.length} itinerary joins (${dayBoundary.length} day-boundary), gaps ${bad.length}`);
}
if(failures){console.error(`TOTAL: ${total} joins / ${boundaries} day-boundary / GAPS ${failures}`);process.exit(1);}
console.log(`TOTAL: ${total} joins / ${boundaries} day-boundary / GAPS 0`);
