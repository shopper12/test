from pathlib import Path
import re

p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')

# Keep the hotel table's official property name clean while map-point labels may include the street cue.
s=re.sub(r'(id: "h1",\n\s+day_id: 1,\n\s+name: )"CHECK Inn Taichung LaiLai · Sanmin Rd\. 125"', r'\1"CHECK Inn Taichung LaiLai"', s, count=1)

# d3-03 now spans 12:15~15:20 because it starts at the hotel after baggage pickup.
pat=r'("d3-03",\n\s+3,\n\s+"12:15",\n\s+"15:20",\n\s+"CHECK Inn LaiLai → 타오위안공항",.*?\n\s+)"2시간 20분"'
s,n=re.subn(pat, r'\1"3시간 5분"', s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('d3-03 duration block not found')

p.write_text(s,encoding='utf-8')
