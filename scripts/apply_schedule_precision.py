from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'missing target in {path}: {old[:100]!r}')
    if text.count(old) != 1:
        raise SystemExit(f'non-unique target in {path}: {old[:100]!r} count={text.count(old)}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')


def append_once(path, marker, block):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if marker in text:
        return
    p.write_text(text.rstrip() + '\n' + block.strip() + '\n', encoding='utf-8')

# --- itinerary-data.js: precise published transport legs ---
replace_once('itinerary-data.js', '''          {
            booking_url: "https://en.thsrc.com.tw/",
            min_cost_krw: 110_000,
            max_cost_krw: 180_000,
            cost_basis: "4인",
          },''', '''          {
            booking_url: "https://en.thsrc.com.tw/",
            min_cost_krw: 110_000,
            max_cost_krw: 180_000,
            cost_basis: "4인",
            notes: "THSR는 9/4(금) 공식 게시 시간표 확정. Airport MRT는 공식 사이트가 현재 8/31까지만 게시하여 9/4 편은 3일 전 재확인.",
            schedule_legs: [
              { status: "confirmed", service: "THSR 0826", from: "THSR Taichung", depart: "13:36", to: "THSR Taoyuan", arrive: "14:20", source_label: "THSR 공식 2026 시간표", source_url: "https://en.thsrc.com.tw/" },
              { status: "provisional", service: "Taoyuan Airport MRT", from: "A18 Taoyuan HSR", depart: "14:32 후보", to: "A12 Airport T1", arrive: "약 14:50", source_label: "Taoyuan Metro · 9/4 시간표 미공개", source_url: "https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A18" },
            ],
          },''')

replace_once('itinerary-data.js', '''          {
            booking_url: "https://www.google.com/travel/flights",
            notes:
              "비용 최적안보다 4인 약 190만원 높지만 환승과 약 8시간의 추가 이동을 제거.",
          },''', '''          {
            booking_url: "https://www.google.com/travel/flights",
            notes:
              "비용 최적안보다 4인 약 190만원 높지만 환승과 약 8시간의 추가 이동을 제거.",
            schedule_legs: [
              { status: "confirmed", service: "China Airlines CI73", from: "TPE", depart: "23:10", to: "AMS", arrive: "9/5 07:40", source_label: "Google Flights 현재 판매편" },
            ],
          },''')

replace_once('itinerary-data.js', '''      {
        booking_url: "https://www.google.com/travel/flights",
        notes: "계획서 원안과 동일. Google Flights 4인 최저가 자동조회.",
      },''', '''      {
        booking_url: "https://www.google.com/travel/flights",
        notes: "계획서 원안과 동일. Google Flights 4인 최저가 자동조회.",
        schedule_legs: [
          { status: "confirmed", service: "Jin Air LJ737", from: "ICN", depart: "07:55", to: "RMQ", arrive: "09:40", source_label: "Google Flights 현재 판매편" },
        ],
      },''')

replace_once('itinerary-data.js', '''      {
        booking_url: "https://www.nsinternational.com/en",
        notes: "열차 약 26분 간격. 공항 도착시간에 맞춰 현장 구매 가능.",
      },''', '''      {
        booking_url: "https://www.nsinternational.com/en",
        notes: "Schiphol→Rotterdam 직통은 약 26~27분. 항공 도착·입국심사 변동 때문에 특정 편을 선결제하지 않고 입국 후 첫 가능한 NS 직통편을 탑승.",
        schedule_legs: [
          { status: "flexible", service: "NS Intercity Direct", from: "Schiphol Airport", depart: "입국 후 첫 가능편", to: "Rotterdam Centraal", arrive: "출발 + 약 26~27분", source_label: "NS Journey Planner" },
        ],
      },''')

replace_once('itinerary-data.js', '''      "Waterbus·킨더다이크 풍차군",
      "관광",
      "Rotterdam Erasmusbrug → Kinderdijk",
      "Waterbus+도보",
      "5시간",
      {
        booking_url: "https://www.waterbus.nl/en/",
        official_url: "https://kinderdijk.com/",
        notes: "무료 외부 산책 기준. 박물관 풍차 입장은 선택.",
      },''', '''      "WaterShuttle·킨더다이크 풍차군",
      "관광",
      "Rotterdam Erasmusbrug → Kinderdijk Molenkade",
      "WaterShuttle+도보",
      "5시간",
      {
        booking_url: "https://www.waterbus.nl/en/",
        official_url: "https://kinderdijk.com/",
        notes: "2026 여름 공식 시간표(3/23~10/5) 기준. 무료 외부 산책, 박물관 풍차 입장은 선택.",
        schedule_legs: [
          { status: "confirmed", service: "WaterShuttle", from: "Rotterdam Erasmusbrug", depart: "12:40", to: "Kinderdijk Molenkade", arrive: "13:10", source_label: "WaterShuttle 2026 summer timetable" },
          { status: "confirmed", service: "WaterShuttle", from: "Kinderdijk Molenkade", depart: "16:45", to: "Rotterdam Erasmusbrug", arrive: "17:15", source_label: "WaterShuttle 2026 summer timetable" },
        ],
      },''')

replace_once('itinerary-data.js', '''      "16:30",
      "17:40",
      "TNO → 로테르담 중앙역·짐 회수",
      "교통",
      "Rijswijk → Rotterdam Centraal",
      "택시+도보",
      "70분",''', '''      "16:30",
      "17:05",
      "TNO → 로테르담 중앙역·짐 회수",
      "교통",
      "Rijswijk → Rotterdam Centraal",
      "택시+도보",
      "35분",''')

replace_once('itinerary-data.js', '''      "18:00",
      "9/8 00:05",
      "로테르담 → 함부르크",
      "교통",
      "Rotterdam Centraal → Hamburg Hbf",
      "NS/DB 국제열차",
      "약 6시간 5분",
      {
        booking_url:
          "https://www.nsinternational.com/en/germany/train-hamburg",
        official_url: "https://int.bahn.de/en",
        original_currency: "EUR",
        original_min: 33,
        original_max: 80,
        min_cost_krw: 210_000,
        max_cost_krw: 500_000,
        cost_basis: "4인·조기예약",
        notes:
          "계획서의 AMS→HAM 항공을 대체. NS 표준 소요시간은 약 6시간 4분이며 실제 출발시각은 발권 시 확정. 공항 이동·보안검색을 빼면 문전시간 차이가 작고 현재 KLM 4인 운임보다 크게 저렴.",
      },''', '''      "17:20",
      "23:16",
      "로테르담 → 함부르크",
      "교통",
      "Rotterdam Centraal → Hamburg Hbf",
      "NS/DB 국제열차",
      "약 5시간 56분",
      {
        booking_url:
          "https://www.nsinternational.com/en/germany/train-hamburg",
        official_url: "https://int.bahn.de/en",
        original_currency: "EUR",
        original_min: 33,
        original_max: 80,
        min_cost_krw: 210_000,
        max_cost_krw: 500_000,
        cost_basis: "4인·조기예약",
        notes:
          "2026 현행 DB/NS 시간표 패턴의 저녁 연결편. 9/7 공사·편성 변경 가능성이 있어 발권 화면에서 최종 재확인해야 하며, 확정 전까지는 '시간표 후보'로 표시.",
        schedule_legs: [
          { status: "provisional", service: "IC 2863 · IC 1765 · ICE 243 · ICE 104", from: "Rotterdam Centraal", depart: "17:20 후보", to: "Hamburg Hbf", arrive: "23:16 후보", source_label: "2026 DB/NS 현행 시간표 패턴 · 9/7 재확인" },
        ],
      },''')

replace_once('itinerary-data.js', '''      "09:53",
      "14:20",
      "함부르크 → 에스비에르",
      "교통",
      "Hamburg Hbf → Kolding → Esbjerg",
      "DB/DSB 열차",
      "약 4시간 30분",
      {
        booking_url: "https://int.bahn.de/en",
        original_currency: "EUR",
        original_min: 35,
        original_max: 70,
        min_cost_krw: 220_000,
        max_cost_krw: 450_000,
        cost_basis: "4인·조기예약",
        notes:
          "계획서의 3시간 38분 Kolding 대기편 대신 빠른 연결편 우선. 실제 시각은 DB 예약화면에서 확정.",
      },''', '''      "10:53",
      "14:54",
      "함부르크 → 에스비에르",
      "교통",
      "Hamburg Hbf → Kolding → Esbjerg",
      "DB/DSB 열차",
      "4시간 1분",
      {
        booking_url: "https://int.bahn.de/en",
        original_currency: "EUR",
        original_min: 35,
        original_max: 70,
        min_cost_krw: 220_000,
        max_cost_krw: 450_000,
        cost_basis: "4인·조기예약",
        notes:
          "Rejseplanen/DSB가 2026년 9월 운행기간을 게시한 연결편 기준. Kolding 환승 22분.",
        schedule_legs: [
          { status: "confirmed", service: "ECE 396", from: "Hamburg Hbf", depart: "10:53", to: "Kolding St.", arrive: "13:44", source_label: "Rejseplanen/DSB 2026 게시 시간표" },
          { status: "confirmed", service: "IC 2340", from: "Kolding St.", depart: "14:06", to: "Esbjerg St.", arrive: "14:54", source_label: "Rejseplanen/DSB 2026 게시 시간표" },
        ],
      },''')

replace_once('itinerary-data.js', '''      "14:20",
      "15:10",
      "호텔 이동·체크인",''', '''      "14:54",
      "15:30",
      "호텔 이동·체크인",''')
replace_once('itinerary-data.js', '''      "15:30",
      "18:30",
      "Men at Sea·Fisheries and Maritime Museum 외부",''', '''      "15:45",
      "18:30",
      "Men at Sea·Fisheries and Maritime Museum 외부",''')

replace_once('itinerary-data.js', '''      "13:00",
      "15:30",
      "독일·덴마크 방문내용 정리",''', '''      "13:00",
      "15:10",
      "독일·덴마크 방문내용 정리",''')

replace_once('itinerary-data.js', '''      "16:00",
      "19:05",
      "에스비에르 → 코펜하겐",
      "교통",
      "Esbjerg St. → København H",
      "DSB InterCity",
      "약 3시간",
      {
        booking_url: "https://www.dsb.dk/en/",
        min_cost_krw: 320_000,
        max_cost_krw: 600_000,
        cost_basis: "4인·Orange/일반 운임",
        notes:
          "다음 날 CPH 출국을 위해 전날 이동. EBJ→ABZ 항공·영국 환승을 제거.",
      },''', '''      "15:32",
      "18:28",
      "에스비에르 → 코펜하겐",
      "교통",
      "Esbjerg St. → København H",
      "DSB InterCity",
      "2시간 56분",
      {
        booking_url: "https://www.dsb.dk/en/",
        min_cost_krw: 320_000,
        max_cost_krw: 600_000,
        cost_basis: "4인·Orange/일반 운임",
        notes:
          "Rejseplanen 게시 시간표상 IC 850 직통. Kolding 16:11 도착·16:13 출발 후 같은 열차로 København H까지 이동.",
        schedule_legs: [
          { status: "confirmed", service: "DSB IC 850", from: "Esbjerg St.", depart: "15:32", to: "København H", arrive: "18:28", source_label: "Rejseplanen/DSB · 17 Aug–21 Oct 2026 유효" },
        ],
      },''')

replace_once('itinerary-data.js', '''      "19:05",
      "20:00",
      "코펜하겐 중앙역 → CABINN Metro",''', '''      "18:28",
      "19:20",
      "코펜하겐 중앙역 → CABINN Metro",''')
replace_once('itinerary-data.js', '''      "20:00",
      "21:00",
      "Field's Food Court 저녁",''', '''      "19:30",
      "20:45",
      "Field's Food Court 저녁",''')

replace_once('itinerary-data.js', '''          e("d10c-02",10,"10:10","12:10","CPH → CDG","항공","Copenhagen → Paris CDG","Air France","2시간",{booking_url:"https://www.google.com/travel/flights",notes:"현재 4인 Google Flights 자동운임 기준 귀국 최저가 경로."}),''', '''          e("d10c-02",10,"10:10","12:10","CPH → CDG","항공","Copenhagen → Paris CDG","Air France","2시간",{booking_url:"https://www.google.com/travel/flights",notes:"현재 4인 Google Flights 자동운임 기준 귀국 최저가 경로.",schedule_legs:[{status:"confirmed",service:"Air France",from:"CPH",depart:"10:10",to:"CDG",arrive:"12:10",source_label:"Google Flights 현재 판매편"}]}),''')
replace_once('itinerary-data.js', '''          e("d10c-04",10,"14:40","9/12 09:35","CDG → ICN","항공","Paris CDG → Incheon","Air France","11시간 55분",{booking_url:"https://www.google.com/travel/flights",notes:"CPH→CDG→ICN 연결발권. 4인 약 500만원으로 SAS 직항 약 1,790만원 대비 약 1,291만원 절감."}),''', '''          e("d10c-04",10,"14:40","9/12 09:35","CDG → ICN","항공","Paris CDG → Incheon","Air France","11시간 55분",{booking_url:"https://www.google.com/travel/flights",notes:"CPH→CDG→ICN 연결발권. 4인 약 500만원으로 SAS 직항 약 1,790만원 대비 약 1,291만원 절감.",schedule_legs:[{status:"confirmed",service:"Air France",from:"CDG",depart:"14:40",to:"ICN",arrive:"9/12 09:35",source_label:"Google Flights 현재 판매편"}]}),''')
replace_once('itinerary-data.js', '''          e("d10-02",10,"10:25","14:45","CPH → IST","항공","Copenhagen → Istanbul","Turkish Airlines","3시간 20분",{booking_url:"https://www.google.com/travel/flights"}),''', '''          e("d10-02",10,"10:25","14:45","CPH → IST","항공","Copenhagen → Istanbul","Turkish Airlines","3시간 20분",{booking_url:"https://www.google.com/travel/flights",schedule_legs:[{status:"confirmed",service:"Turkish Airlines TK1784",from:"CPH",depart:"10:25",to:"IST",arrive:"14:45",source_label:"Google Flights 현재 판매편"}]}),''')
replace_once('itinerary-data.js', '''          e("d10-04",10,"17:00","9/12 08:35","IST → ICN","항공","Istanbul → Incheon","Turkish Airlines","9시간 35분",{booking_url:"https://www.google.com/travel/flights",notes:"비용안보다 약 102만원(4인) 비싸지만 인천 도착은 약 1시간 빠름."}),''', '''          e("d10-04",10,"17:00","9/12 08:35","IST → ICN","항공","Istanbul → Incheon","Turkish Airlines","9시간 35분",{booking_url:"https://www.google.com/travel/flights",notes:"비용안보다 약 102만원(4인) 비싸지만 인천 도착은 약 1시간 빠름.",schedule_legs:[{status:"confirmed",service:"Turkish Airlines TK90",from:"IST",depart:"17:00",to:"ICN",arrive:"9/12 08:35",source_label:"Google Flights 현재 판매편"}]}),''')

# --- stable-tools.js: show precise legs in map chronology ---
replace_once('stable-tools.js', '''function mapSidebarItem(event){
  const view=viewFor(event),label=mappingLabel(view),active=String(state.selectedEvent)===String(event.id),allDays=selectedDayId()==null;
  return `<button type="button" class="map-schedule-sidebar-item ${active?"active":""} ${view.kind}" data-stable-map-event="${esc(event.id)}" data-map-kind="${esc(view.kind)}"><span class="map-sidebar-time">${esc(event.time_start||"")}${event.time_end?`<small>~ ${esc(event.time_end)}</small>`:""}</span><span class="map-sidebar-body"><b>${allDays?`Day ${esc(event.day_id)} · `:""}${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small></span><span class="map-sidebar-kind ${view.kind}">${view.kind==="route"?"이동 경로":"장소·체류"}</span></button>`;
}''', '''function scheduleStatusLabel(status){return status==="confirmed"?"확정":status==="provisional"?"재확인":status==="flexible"?"현장 선택":"시간표";}
function scheduleLegsHtml(event,compact=false){const legs=event?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||event.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}
function mapSidebarItem(event){
  const view=viewFor(event),label=mappingLabel(view),active=String(state.selectedEvent)===String(event.id),allDays=selectedDayId()==null;
  return `<button type="button" class="map-schedule-sidebar-item ${active?"active":""} ${view.kind}" data-stable-map-event="${esc(event.id)}" data-map-kind="${esc(view.kind)}"><span class="map-sidebar-time">${esc(event.time_start||"")}${event.time_end?`<small>~ ${esc(event.time_end)}</small>`:""}</span><span class="map-sidebar-body"><b>${allDays?`Day ${esc(event.day_id)} · `:""}${esc(event.title||"")}</b><small>${view.kind==="route"?`🧭 ${esc(view.origin)} → ${esc(view.destination)}`:`📍 ${esc(view.query)}`}</small>${scheduleLegsHtml(event,true)}</span><span class="map-sidebar-kind ${view.kind}">${view.kind==="route"?"이동 경로":"장소·체류"}</span></button>`;
}''')

# --- timeline-runtime-v17.js: show same exact legs on itinerary cards and transit modal ---
replace_once('timeline-runtime-v17.js', '''function stamp(p){try{return new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(p.fetched_at))+" KST";}catch{return p?.fetched_at||"미확인";}}
function transitBox(e,compact=false){''', '''function stamp(p){try{return new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(p.fetched_at))+" KST";}catch{return p?.fetched_at||"미확인";}}
const scheduleStatusLabel=status=>status==="confirmed"?"확정":status==="provisional"?"재확인":status==="flexible"?"현장 선택":"시간표";
function scheduleLegs(e,compact=false){const legs=e?.schedule_legs||[];if(!legs.length)return"";return `<div class="transport-schedule ${compact?"compact":""}">${legs.map(leg=>`<div class="transport-schedule-leg ${esc(leg.status||"published")}"><span class="transport-schedule-status">${esc(scheduleStatusLabel(leg.status))}</span><b>${esc(leg.service||e.transport||"")}</b><span class="transport-schedule-route"><strong>${esc(leg.depart||"")}</strong> ${esc(leg.from||"")} <i>→</i> <strong>${esc(leg.arrive||"")}</strong> ${esc(leg.to||"")}</span>${leg.source_label?`<small>${esc(leg.source_label)}</small>`:""}</div>`).join("")}</div>`;}
function transitBox(e,compact=false){''')

replace_once('timeline-runtime-v17.js', '''function openTransit(e){const m=ensureModal(),rows=providerIds(e).map(provider).filter(Boolean);m.querySelector("#dashboard-transit-body").innerHTML=`<div class="transit-modal-event"><b>${esc(e.title)}</b><span>${esc(e.time_start)}~${esc(e.time_end)} · ${esc(e.transport)}</span></div>${rows.map(p=>''', '''function openTransit(e){const m=ensureModal(),rows=providerIds(e).map(provider).filter(Boolean);m.querySelector("#dashboard-transit-body").innerHTML=`<div class="transit-modal-event"><b>${esc(e.title)}</b><span>${esc(e.time_start)}~${esc(e.time_end)} · ${esc(e.transport)}</span>${scheduleLegs(e)}</div>${rows.map(p=>''')

replace_once('timeline-runtime-v17.js', '''body.querySelector(":scope > .event-time-breakdown")?.remove();(body.querySelector(".meta")||body.querySelector(".event-title"))?.insertAdjacentHTML("afterend",breakdown(e));const p=placeLinks(e);''', '''body.querySelector(":scope > .event-time-breakdown")?.remove();body.querySelector(":scope > .transport-schedule")?.remove();(body.querySelector(".meta")||body.querySelector(".event-title"))?.insertAdjacentHTML("afterend",`${breakdown(e)}${scheduleLegs(e)}`);const p=placeLinks(e);''')

replace_once('timeline-runtime-v17.js', '''x.innerHTML=`${placeLinks(e,true)}${transitBox(e,true)}`;''', '''x.innerHTML=`${scheduleLegs(e,true)}${placeLinks(e,true)}${transitBox(e,true)}`;''')

# --- CSS ---
append_once('map-sidebar.css', '/* PRECISE_TRANSPORT_SCHEDULE */', '''
/* PRECISE_TRANSPORT_SCHEDULE */
.transport-schedule{display:grid;gap:6px;margin-top:7px}.transport-schedule.compact{gap:4px;margin-top:5px}.transport-schedule-leg{display:grid;grid-template-columns:auto auto minmax(0,1fr);align-items:center;gap:5px 7px;padding:6px 7px;border:1px solid #d9e4e8;border-radius:8px;background:#fbfdfe;font-size:.64rem;line-height:1.3}.transport-schedule-leg.confirmed{border-color:#b9dfca;background:#f5fbf7}.transport-schedule-leg.provisional{border-color:#ead8a4;background:#fffaf0}.transport-schedule-leg.flexible{border-color:#cfd8df;background:#f7f9fa}.transport-schedule-status{font-size:.57rem;font-weight:900;padding:2px 5px;border-radius:999px;background:#e9f6ef;color:#17603d;white-space:nowrap}.transport-schedule-leg.provisional .transport-schedule-status{background:#fff0c2;color:#7a5700}.transport-schedule-leg.flexible .transport-schedule-status{background:#e9eef2;color:#51616a}.transport-schedule-route{min-width:0;white-space:normal;color:#394b54}.transport-schedule-route strong{font:900 .67rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#173e55}.transport-schedule-route i{font-style:normal;color:#7a8b94;margin:0 2px}.transport-schedule-leg small{grid-column:2/4;color:#718087;font-size:.57rem}.map-schedule-sidebar-item:has(.transport-schedule){align-items:start}.map-sidebar-body .transport-schedule{white-space:normal}.map-sidebar-body .transport-schedule-leg{grid-template-columns:auto minmax(0,1fr)}.map-sidebar-body .transport-schedule-route{grid-column:1/3}.map-sidebar-body .transport-schedule-leg small{grid-column:1/3}
''')
append_once('live-transit-links.css', '/* PRECISE_TRANSPORT_SCHEDULE */', '''
/* PRECISE_TRANSPORT_SCHEDULE */
.event-card .transport-schedule,.dashboard-transit-dialog .transport-schedule{display:grid;gap:6px;margin:8px 0}.event-card .transport-schedule-leg,.dashboard-transit-dialog .transport-schedule-leg{display:grid;grid-template-columns:auto auto minmax(0,1fr);align-items:center;gap:5px 8px;padding:7px 8px;border:1px solid #d9e4e8;border-radius:9px;background:#fbfdfe;font-size:.72rem}.event-card .transport-schedule-leg.confirmed,.dashboard-transit-dialog .transport-schedule-leg.confirmed{border-color:#b9dfca;background:#f5fbf7}.event-card .transport-schedule-leg.provisional,.dashboard-transit-dialog .transport-schedule-leg.provisional{border-color:#ead8a4;background:#fffaf0}.event-card .transport-schedule-status,.dashboard-transit-dialog .transport-schedule-status{font-size:.62rem;font-weight:900;padding:3px 6px;border-radius:999px;background:#e9f6ef;color:#17603d}.event-card .transport-schedule-leg.provisional .transport-schedule-status,.dashboard-transit-dialog .transport-schedule-leg.provisional .transport-schedule-status{background:#fff0c2;color:#7a5700}.event-card .transport-schedule-route strong,.dashboard-transit-dialog .transport-schedule-route strong{font:900 .75rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#173e55}.event-card .transport-schedule-leg small,.dashboard-transit-dialog .transport-schedule-leg small{grid-column:2/4;color:#718087;font-size:.62rem}
''')

# Sanity checks
for path in ['itinerary-data.js','stable-tools.js','timeline-runtime-v17.js']:
    text = Path(path).read_text(encoding='utf-8')
    if 'schedule_legs' not in text and path == 'itinerary-data.js':
        raise SystemExit('schedule_legs missing')
print('schedule precision patch applied')
