import { pathToFileURL } from "node:url";
import { auditEventMappings, auditFullRouteContinuity, manifestCoverage } from "../map-routing.mjs";

const source=process.argv[2];
if(!source)throw new Error("usage: node scripts/verify_map_mappings.mjs /tmp/itinerary-data.mjs");
const {ITINERARIES}=await import(pathToFileURL(source).href+`?t=${Date.now()}`);
let total=0,failures=[];
for(const [key,plan] of Object.entries(ITINERARIES)){
  const events=plan.officialSeed.events||[],rows=auditEventMappings(events),coverage=manifestCoverage(events),routes=auditFullRouteContinuity(events);
  total+=rows.length;
  for(const row of rows){
    console.log(`${key}\tDay ${row.day_id}\t${row.id}\t${row.kind}\t${row.source}\t${row.target}`);
    if(!row.mapped||row.ambiguous||!row.verified)failures.push({plan:key,...row});
  }
  if(coverage.covered!==coverage.total)failures.push({plan:key,missing:coverage.missing});
  if(routes.some(r=>!r.connected||!r.verified))failures.push({plan:key,bad_routes:routes.filter(r=>!r.connected||!r.verified)});
  console.log(`${key}: ${rows.filter(r=>r.mapped&&!r.ambiguous&&r.verified).length}/${rows.length} verified · route ${routes.length} · place ${rows.filter(r=>r.kind==="place").length}`);
}
console.log(`TOTAL: ${total-failures.length}/${total} verified manifest mappings`);
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
