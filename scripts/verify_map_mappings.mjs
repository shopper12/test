import { pathToFileURL } from "node:url";
import { auditEventMappings } from "../map-routing.mjs";

const source=process.argv[2];
if(!source)throw new Error("usage: node scripts/verify_map_mappings.mjs /tmp/itinerary-data.mjs");
const {ITINERARIES}=await import(pathToFileURL(source).href+`?t=${Date.now()}`);
let total=0;
const failures=[];
for(const [key,plan] of Object.entries(ITINERARIES)){
  const rows=auditEventMappings(plan.officialSeed.events||[],plan.officialSeed.days||[]);
  total+=rows.length;
  for(const row of rows){
    console.log(`${key}\tDay ${row.day_id}\t${row.id}\t${row.kind}\t${row.source}\t${row.target}`);
    if(!row.mapped||row.ambiguous)failures.push({plan:key,...row});
  }
  console.log(`${key}: ${rows.filter(r=>r.mapped&&!r.ambiguous).length}/${rows.length} mapped`);
}
console.log(`TOTAL: ${total-failures.length}/${total} mapped without ambiguous fallback`);
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
