import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { auditFullRouteContinuity, manifestCoverage } from '../map-routing.mjs';

const dataPath=process.argv[2]||'./itinerary-data.js';
const source=fs.readFileSync(dataPath,'utf8'),temp='/tmp/itinerary-route-audit.mjs';fs.writeFileSync(temp,source);
const {ITINERARIES}=await import(`${pathToFileURL(temp).href}?t=${Date.now()}`);
let failures=0,total=0;
for(const [key,plan] of Object.entries(ITINERARIES)){
  const events=plan.officialSeed.events||[],coverage=manifestCoverage(events),routes=auditFullRouteContinuity(events),bad=routes.filter(r=>!r.connected||!r.verified);
  failures+=bad.length+(coverage.total-coverage.covered);total+=routes.length;
  for(const r of bad)console.error(`${key}\t${r.from_id}\tBROKEN\t${r.from} -> ${r.to}`);
  console.log(`${key}: verified movement routes ${routes.length-bad.length}/${routes.length}; manifest ${coverage.covered}/${coverage.total}`);
}
if(failures){console.error(`TOTAL: ${total} movement routes / failures ${failures}`);process.exit(1);}
console.log(`TOTAL: ${total}/${total} movement routes internally complete`);
