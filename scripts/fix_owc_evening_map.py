from pathlib import Path
p=Path('itinerary-data.js')
s=p.read_text(encoding='utf-8')
old='https://www.google.com/maps/dir/?api=1&origin=Skyborn+Renewables+Hamburg&destination=Landungsbrucken&waypoints=Elbphilharmonie'
new='https://www.google.com/maps/dir/?api=1&origin=OWC+Alter+Wall+69+Hamburg&destination=Landungsbrucken&waypoints=Elbphilharmonie'
if old not in s:
    raise SystemExit('old OWC evening map link not found')
p.write_text(s.replace(old,new,1),encoding='utf-8')
print('fixed OWC evening map link')
