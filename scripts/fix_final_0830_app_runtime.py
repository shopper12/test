from pathlib import Path
p=Path(__file__).resolve().parents[1]/'app.js'
s=p.read_text(encoding='utf-8')
needle='function renderTransport(){return `<div class="security-note" style="margin-bottom:12px">0830 최종 일정표의 국가별 교통 이용 가이드를 표시합니다. 철도 시간·플랫폼은 전날/당일 공식 앱에서 재확인하십시오.</div>${renderDataSection("transport_options")}`;}\n\nfunction cellValue(r,f){'
insert='''function renderTransport(){return `<div class="security-note" style="margin-bottom:12px">0830 최종 일정표의 국가별 교통 이용 가이드를 표시합니다. 철도 시간·플랫폼은 전날/당일 공식 앱에서 재확인하십시오.</div>${renderDataSection("transport_options")}`;}
function renderRestaurants(){return renderDataSection("restaurants");}
function renderDataSection(table){
  const def=tableDefs[table], rows=state.data[table]||[];
  return `<div class="section-head"><h2>${def.title}</h2>${isEditable()?`<button class="btn small primary" data-add="${table}">+ 추가</button>`:""}</div><div class="table-wrap"><table class="data-table"><thead><tr>${def.fields.map(f=>`<th>${def.labels[f]||f}</th>`).join("")}<th>링크·작업</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${def.fields.map(f=>`<td>${cellValue(r,f)}</td>`).join("")}<td>${table==="flights"?flightFareCard(r):table==="hotels"?hotelActionLinks(r):""}${isEditable()?` <button class="btn small" data-edit-table="${table}" data-id="${esc(r.id)}">편집</button>`:""}</td></tr>`).join(""):`<tr><td colspan="${def.fields.length+1}">최종 일정표에 별도 항목이 없습니다.</td></tr>`}</tbody></table></div>`;
}

function cellValue(r,f){'''
if needle not in s: raise SystemExit('runtime insertion point not found')
s=s.replace(needle,insert,1)
s=s.replace('return value==null ? "자동 운임 재조회 중" : `4인 ₩${fmt(value)} · 1인 ₩${fmt(value/4)}`;','return value==null ? "운임 미표시" : `${tripMeta.travelers}인 ₩${fmt(value)} · 1인 ₩${fmt(value/tripMeta.travelers)}`;')
p.write_text(s,encoding='utf-8')
print('app runtime fixed')
