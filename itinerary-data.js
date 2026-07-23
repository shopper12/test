export const APP_VERSION = "EU_FIRST_AWTEC_HKG_V3";

export const tripMeta = {
  title: "해상풍력 벤치마킹 출장 2026",
  subtitle: "유럽 선행 · AWTEC 핵심 일정 · 홍콩 당일 경유",
  dates: "2026.09.02–09.12",
  route: "인천 → 코펜하겐 → 오슬로 → 에스비에르 → 함부르크 → 로테르담 → 대만 → 홍콩 → 인천",
  travelers: 4,
  hotelNights: 9,
  flightNights: 2,
  noHotelStopovers: 1,
  budgetMin: 32000000,
  budgetMax: 48800000,
  budgetNote: "4인 기준, AWTEC late/on-site 등록과 10% 예비비 포함 계획 범위",
};

export const days = [
  { id: 1, date: "2026-09-02", weekday: "수요일", cities: "코펜하겐 → 오슬로/포르네부", lodging: "Scandic Fornebu", summary: "9월 1일 23:45 인천 출발 · SK988 직항 · 노르웨이 핵심기관 회의" },
  { id: 2, date: "2026-09-03", weekday: "목요일", cities: "오슬로 → 코펜하겐 → 에스비에르", lodging: "Boutique Hotel Britannia", summary: "Ørsted Gentofte · Blue Water Shipping · 7인승 렌터카" },
  { id: 3, date: "2026-09-04", weekday: "금요일", cities: "에스비에르 → 함부르크", lodging: "25hours Hotel HafenCity", summary: "Port Esbjerg · Skyborn Renewables · HafenCity" },
  { id: 4, date: "2026-09-05", weekday: "토요일", cities: "함부르크 → 로테르담·델프트", lodging: "Hotel New York Rotterdam", summary: "국경간 렌터카 · 로테르담항 외곽 · TNO 사진" },
  { id: 5, date: "2026-09-06", weekday: "일요일", cities: "로테르담", lodging: "Hotel New York Rotterdam", summary: "북해 항만 비교 워크숍 · 수상교통·항만도시 현장" },
  { id: 6, date: "2026-09-07", weekday: "월요일", cities: "로테르담 → 암스테르담 → 타이베이", lodging: "기내박", summary: "Port of Rotterdam 공식회의 · KL807 직항" },
  { id: 7, date: "2026-09-08", weekday: "화요일", cities: "타이베이 → 가오슝", lodging: "InterContinental Kaohsiung", summary: "14:55 대만 도착 · AWTEC Conference Banquet·네트워킹" },
  { id: 8, date: "2026-09-09", weekday: "수요일", cities: "가오슝 AWTEC", lodging: "InterContinental Kaohsiung", summary: "Plenary · 해상풍력 세션 · Ørsted Taiwan 네트워킹 · Closing" },
  { id: 9, date: "2026-09-10", weekday: "목요일", cities: "가오슝 → 타이중", lodging: "Taichung Harbor Hotel", summary: "AWTEC Technical Tour · 저녁 THSR 이동" },
  { id: 10, date: "2026-09-11", weekday: "금요일", cities: "타이중항 → 타오위안", lodging: "Hyatt Regency Taoyuan International Airport", summary: "타이중항 해상풍력 클러스터 집중 벤치마킹" },
  { id: 11, date: "2026-09-12", weekday: "토요일", cities: "타오위안 → 홍콩 당일관광 → 인천", lodging: "무숙박", summary: "BR891/CI601 · Central·Victoria Harbour · CX430 당일 귀국" },
];

const e = (id, day_id, time_start, time_end, title, category, location, transport, duration, extras = {}) => ({
  id, day_id, time_start, time_end, title, category, location, transport, duration,
  original_currency: null, original_min: null, original_max: null,
  min_cost_krw: null, max_cost_krw: null, cost_basis: null,
  booking_url: null, official_url: null, map_url: null, notes: null,
  sort_order: 0, updated_at: new Date().toISOString(), ...extras,
});

export const events = [
  e("d1-01",1,"9/1 23:45","9/2 06:05","SK988 인천(ICN) → 코펜하겐(CPH) 직항","항공","ICN → CPH","SAS A350","13시간 20분",{min_cost_krw:900000,max_cost_krw:1500000,cost_basis:"1인 계획범위",booking_url:"https://www.flysas.com/",notes:"9월 2일 업무시간을 확보하려고 9월 1일 밤 출발. CPH→OSL을 동일 PNR로 우선 조회."}),
  e("d1-02",1,"08:10","09:30","CPH → OSL 직항 연결","항공","CPH → OSL","SAS 또는 Norwegian","약 1시간 20분",{min_cost_krw:100000,max_cost_krw:250000,cost_basis:"1인",booking_url:"https://www.google.com/travel/flights",notes:"SK988 지연 대응을 위해 동일 PNR·2시간 이상 연결 권고. 정확한 편명은 발권 시 확정."}),
  e("d1-03",1,"10:15","11:15","오슬로공항 → 포르네부","교통","OSL → Fornebu","예약밴 또는 공항철도+택시","약 1시간",{min_cost_krw:120000,max_cost_krw:220000,cost_basis:"4인"}),
  e("d1-04",1,"12:30","14:00","Equinor Fornebu 회의","회의","Equinor Fornebu","택시/도보","90분",{official_url:"https://www.equinor.com/where-we-are/norway-how-to-find-us",notes:"부유식·고정식, Utsira Nord, EPC/O&M 인터페이스, 공급망·수익성 리스크."}),
  e("d1-05",1,"14:30","16:00","Norwegian Offshore Wind 라운드테이블","회의","Fornebu 또는 Oslo","택시","90분",{official_url:"https://www.norwegianoffshorewind.no/",notes:"회원사 3~5곳 동석 요청. 노르웨이 공급망과 법무·계약 구조."}),
  e("d1-06",1,"18:00","19:30","Sjøflyhavna Kro 업무만찬","식사","Fornebu","도보/택시","90분",{original_currency:"NOK",original_min:500,original_max:1000,min_cost_krw:75000,max_cost_krw:153000,cost_basis:"1인",booking_url:"https://www.sjoflyhavna.no/meny"}),

  e("d2-01",2,"07:00","08:00","호텔 → OSL 이동·체크인","교통","Fornebu → OSL","예약밴","1시간",{min_cost_krw:120000,max_cost_krw:220000,cost_basis:"4인"}),
  e("d2-02",2,"08:30","09:50","OSL → CPH 직항","항공","OSL → CPH","SAS/Norwegian","약 1시간 20분",{min_cost_krw:100000,max_cost_krw:250000,cost_basis:"1인",booking_url:"https://www.google.com/travel/flights",notes:"오전 10시 이전 도착편 선택."}),
  e("d2-03",2,"10:30","12:00","Ørsted Gentofte 본사 회의","회의","Gentofte, Denmark","예약밴","90분",{official_url:"https://orsted.com/",notes:"개발·운영, PPA, 프로젝트 파이낸싱, 공급망 현지화, 계약리스크."}),
  e("d2-04",2,"12:15","15:05","코펜하겐 → 에스비에르","교통","Gentofte/CPH → Esbjerg","7인승 렌터카","약 2시간 50분",{min_cost_krw:350000,max_cost_krw:550000,cost_basis:"3일 편도렌트 중 일부",notes:"4인+수하물 기준 자동차가 편리. 덴마크→독일→네덜란드 편도반납 허용 여부 필수 확인."}),
  e("d2-05",2,"15:30","17:00","Blue Water Shipping 회의","회의","Esbjerg","렌터카","90분",{official_url:"https://www.bws.net/",notes:"블레이드·나셀·타워 운송, 통관·보관, 설치지연비용, 비상조달."}),
  e("d2-06",2,"18:00","19:30","Esbjerg 업무저녁","식사","Britannia 인근","도보","90분",{original_currency:"DKK",original_min:300,original_max:500,min_cost_krw:68000,max_cost_krw:113000,cost_basis:"1인",booking_url:"https://www.britannia.dk/en"}),

  e("d3-01",3,"08:30","10:00","Port Esbjerg 공식회의·야드","회의","Port Esbjerg","렌터카","90분",{official_url:"https://portesbjerg.dk/en/",notes:"터빈 사전조립, 중량물, 설치선, 부두배정, 처리량·임대구조."}),
  e("d3-02",3,"10:15","13:10","에스비에르 → 함부르크","교통","Esbjerg → Hamburg","렌터카","약 2시간 55분",{cost_basis:"3일 편도렌트 포함",notes:"교대운전자 2명 권고."}),
  e("d3-03",3,"14:00","15:30","Skyborn Renewables 회의","회의","Hamburg","렌터카","90분",{official_url:"https://www.skybornrenewables.com/",notes:"개발사업 포트폴리오, 인허가·계통·수익성, 철수기준과 계약관리."}),
  e("d3-04",3,"16:00","17:30","함부르크 항만·HafenCity 현장","현장답사","Hamburg","렌터카+도보","90분",{min_cost_krw:30000,max_cost_krw:60000,cost_basis:"4인 주차·교통"}),
  e("d3-05",3,"19:00","20:30","Heimat Restaurant","식사","25hours HafenCity","도보","90분",{original_currency:"EUR",original_min:35,original_max:60,min_cost_krw:59000,max_cost_krw:102000,cost_basis:"1인",booking_url:"https://25hours-hotels.com/hamburg/hafencity/restaurants-and-bars/heimat-restaurant/"}),

  e("d4-01",4,"07:00","12:00","함부르크 → 로테르담","교통","Hamburg → Rotterdam","국경간 렌터카","약 5시간",{cost_basis:"3일 편도렌트 포함",notes:"교대운전자 2명. 도로 상황에 따라 휴게시간 포함 5시간 30분 확보."}),
  e("d4-02",4,"12:00","13:00","Hotel New York 점심","식사","Rotterdam","도보","1시간",{original_currency:"EUR",original_min:30,original_max:50,min_cost_krw:51000,max_cost_krw:85000,cost_basis:"1인",booking_url:"https://hotelnewyork.com/food-beverage/menu/"}),
  e("d4-03",4,"13:30","15:30","Port of Rotterdam 외곽·물류동선 사전답사","현장답사","Port of Rotterdam","렌터카","2시간",{min_cost_krw:50000,max_cost_krw:100000,cost_basis:"차량·주차",notes:"공식회의는 월요일. 토요일에는 공개 접근구역과 항만 물류동선 위주."}),
  e("d4-04",4,"16:00","16:20","TNO Delft 외관·표지 사진","사진","TNO Delft","렌터카","20분",{official_url:"https://www.tno.nl/en/about-tno/contact/locations/delft-molengraaffsingel-next/",notes:"업무회의 없음. 사진만 촬영."}),
  e("d4-05",4,"17:30","18:30","렌터카 반납·체크인","교통","Rotterdam","렌터카","1시간",{min_cost_krw:1100000,max_cost_krw:1800000,cost_basis:"CPH→Esbjerg→Hamburg→Rotterdam 3일 차량 총액",notes:"국경통과·편도반납·완전자차·유류 포함 계획범위."}),

  e("d5-01",5,"09:30","11:30","북해 항만 비교 워크숍","워크숍","Hotel New York 회의공간","도보","2시간",{notes:"Taichung·Esbjerg·Rotterdam의 전용부두, 임대, 중량물, 항만공기업 역할 비교."}),
  e("d5-02",5,"12:30","15:30","Maritime District·Water Taxi 현장","현장답사","Rotterdam","도보+Water Taxi","3시간",{original_currency:"EUR",original_min:20,original_max:40,min_cost_krw:34000,max_cost_krw:68000,cost_basis:"1인",notes:"주말을 항만도시·수상교통 벤치마킹에 사용."}),
  e("d5-03",5,"16:00","18:00","월요일 회의 질문지·AWTEC 준비","워크숍","호텔","도보","2시간"),

  e("d6-01",6,"09:00","10:30","Port of Rotterdam 공식회의","회의","Port of Rotterdam","예약밴","90분",{official_url:"https://www.portofrotterdam.com/en",notes:"해상풍력 물류, 수소연계, 중량물, 항만 탈탄소, 임대·투자·위험분담."}),
  e("d6-02",6,"10:45","12:00","항만 현장 브리핑·후속질의","현장답사","Rotterdam","예약밴","75분",{min_cost_krw:150000,max_cost_krw:250000,cost_basis:"4인 밴"}),
  e("d6-03",6,"13:00","14:00","Rotterdam → Schiphol","교통","Rotterdam → AMS","기차 우선·밴 대안","1시간",{min_cost_krw:80000,max_cost_krw:180000,cost_basis:"4인",notes:"시간차가 작으면 열차 우선. 수하물이 많으면 예약밴 재비교."}),
  e("d6-04",6,"20:15","9/8 14:55","KL807 암스테르담(AMS) → 타이베이(TPE) 직항","항공","AMS → TPE","KLM","약 12시간 40분",{original_currency:"EUR",original_min:600,original_max:1000,min_cost_krw:900000,max_cost_krw:1500000,cost_basis:"1인 계획범위",booking_url:"https://www.klm.com/",notes:"월요일 직항. CI74 등 대체 직항과 다구간 총액을 비교."}),

  e("d7-01",7,"14:55","16:15","TPE 입국·수하물","입국","Taoyuan Airport","도보","80분"),
  e("d7-02",7,"16:20","19:00","TPE → 가오슝","교통","TPE → Taoyuan HSR → Zuoying","Airport MRT+THSR+택시","약 2시간 40분",{original_currency:"TWD",original_min:1500,original_max:1900,min_cost_krw:68000,max_cost_krw:87000,cost_basis:"1인",booking_url:"https://en.thsrc.com.tw/"}),
  e("d7-03",7,"19:15","21:00","AWTEC Conference Banquet·네트워킹","컨퍼런스","Kaohsiung Exhibition Center","택시","항공 정시 도착 시",{booking_url:"https://www.awtec2026.com/",notes:"항공 지연 시 참석하지 못할 수 있어 핵심 회의는 9월 9일로 배치."}),

  e("d8-01",8,"08:30","09:30","AWTEC Plenary Speech","컨퍼런스","Kaohsiung Exhibition Center","도보/택시","1시간",{booking_url:"https://www.awtec2026.com/"}),
  e("d8-02",8,"09:30","12:00","해상풍력 O&M·공급망·금융 세션","컨퍼런스","AWTEC","도보","2시간 30분",{booking_url:"https://www.awtec2026.com/"}),
  e("d8-03",8,"12:00","13:30","Ørsted Taiwan·대만 관계자 네트워킹 오찬","회의","AWTEC 행사장","도보","90분",{official_url:"https://orsted.tw/",notes:"타이베이 사무소 왕복 대신 행사장에서 회의해 대만 체류를 단축."}),
  e("d8-04",8,"13:30","17:00","정책·환경·표준화 세션·Closing","컨퍼런스","AWTEC","도보","3시간 30분",{booking_url:"https://www.awtec2026.com/"}),

  e("d9-01",9,"08:30","17:00","AWTEC Technical Tour","기술견학","Kaohsiung/Taiwan","행사버스","종일",{original_currency:"USD",original_min:950,original_max:950,min_cost_krw:1400000,max_cost_krw:1400000,cost_basis:"1인 late/on-site 등록비 환산",booking_url:"https://www.awtec2026.com/",notes:"4인 등록비 약 560만원. 실제 결제 환율로 변경."}),
  e("d9-02",9,"18:30","20:30","가오슝 → 타이중항 호텔","교통","Zuoying → Taichung HSR → Wuqi","택시+THSR+택시","약 2시간",{original_currency:"TWD",original_min:1600,original_max:2200,min_cost_krw:73000,max_cost_krw:101000,cost_basis:"1인",booking_url:"https://en.thsrc.com.tw/"}),

  e("d10-01",10,"08:30","10:00","Port of Taichung 공식회의","회의","Taichung Port","7인승 렌터카/기사차량","90분",{official_url:"https://tc.twport.com.tw/en/",notes:"전용부두, 장기임대, 중량물, 항만투자, 대만 현지화."}),
  e("d10-02",10,"10:15","12:00","Ørsted O&M Hub + CFXD/ZN Base","회의","Taichung Port","렌터카","105분",{official_url:"https://orsted.tw/",notes:"통합관제, 예방정비, 예비품, CTV/SOV."}),
  e("d10-03",10,"13:00","14:30","VESTAS-P2-CIP Warehouse","회의","Taichung Port","렌터카","90분",{notes:"터빈부품 보관, 재고관리, 긴급조달."}),
  e("d10-04",10,"14:45","16:00","Taichung Port Station·항만 야드","현장답사","Taichung Port","렌터카","75분",{notes:"구글 저장목록 장소 포함."}),
  e("d10-05",10,"16:15","19:00","타이중 → 타오위안공항 호텔","교통","Taichung → Taoyuan HSR → TPE","렌터카 반납+THSR+MRT","약 2시간 45분",{original_currency:"TWD",original_min:1200,original_max:1800,min_cost_krw:55000,max_cost_krw:82000,cost_basis:"1인",booking_url:"https://en.thsrc.com.tw/",notes:"다음 날 홍콩 첫 비행 대응."}),

  e("d11-01",11,"07:00","08:50","BR891 타이베이(TPE) → 홍콩(HKG) 직항","항공","TPE → HKG","EVA Air","1시간 50분",{min_cost_krw:150000,max_cost_krw:250000,cost_basis:"1인",booking_url:"https://www.evaair.com/",notes:"CI601 07:20→09:15 대안. 9월 12일 실제 운항 재확인."}),
  e("d11-02",11,"09:30","10:10","HKG → Central","교통","Hong Kong Airport → Central","Airport Express","40분",{original_currency:"HKD",original_min:115,original_max:130,min_cost_krw:22000,max_cost_krw:25000,cost_basis:"1인",booking_url:"https://www.mtr.com.hk/en/customer/services/airport_express_index.html",notes:"수하물은 공항 보관."}),
  e("d11-03",11,"10:15","14:30","홍콩 당일관광","관광","Central·Peak/Star Ferry·Tsim Sha Tsui","MTR+택시+도보","약 4시간 15분",{original_currency:"HKD",original_min:250,original_max:500,min_cost_krw:47000,max_cost_krw:94000,cost_basis:"1인",notes:"날씨가 나쁘면 Central·PMQ·IFC 중심으로 축소. 9월 태풍 리스크 점검."}),
  e("d11-04",11,"12:00","13:00","Tim Ho Wan IFC 점심","식사","Hong Kong IFC","도보","1시간",{original_currency:"HKD",original_min:150,original_max:250,min_cost_krw:28000,max_cost_krw:47000,cost_basis:"1인",map_url:"https://www.google.com/maps/search/?api=1&query=Tim+Ho+Wan+IFC+Hong+Kong"}),
  e("d11-05",11,"14:30","15:15","Central → HKG·수하물 회수","교통","Central → HKG","Airport Express","45분",{original_currency:"HKD",original_min:115,original_max:130,min_cost_krw:22000,max_cost_krw:25000,cost_basis:"1인",booking_url:"https://www.mtr.com.hk/en/customer/services/airport_express_index.html"}),
  e("d11-06",11,"17:40","22:25","CX430 홍콩(HKG) → 인천(ICN) 직항","항공","HKG → ICN","Cathay Pacific","3시간 45분",{min_cost_krw:200000,max_cost_krw:400000,cost_basis:"1인",booking_url:"https://flights.cathaypacific.com/destinations/en_HK/flights-from-hong-kong-to-seoul",notes:"2차 항공 5시간 제한 충족. 더 늦게 출발하려면 CX426 19:45→00:25+1 대안."}),
];

export const flights = [
  { id:"f1",day_id:1,date:"2026-09-01",flight_no:"SK988",origin:"ICN",destination:"CPH",depart_time:"23:45",arrive_time:"06:05+1",min_krw:900000,max_krw:1500000,status:"직항 운항패턴 확인",alternative:"9/2 출발 시 유럽 업무일 감소",url:"https://www.flysas.com/",notes:"CPH→OSL 동일 PNR 우선",sort_order:10 },
  { id:"f2",day_id:1,date:"2026-09-02",flight_no:"발권 시 확정",origin:"CPH",destination:"OSL",depart_time:"08시대",arrive_time:"09시대",min_krw:100000,max_krw:250000,status:"직항 다수",alternative:"후속편 선택",url:"https://www.google.com/travel/flights",notes:"SK988 연결",sort_order:20 },
  { id:"f3",day_id:2,date:"2026-09-03",flight_no:"발권 시 확정",origin:"OSL",destination:"CPH",depart_time:"08시대",arrive_time:"09시대",min_krw:100000,max_krw:250000,status:"직항 다수",alternative:"더 이른 편 우선",url:"https://www.google.com/travel/flights",notes:null,sort_order:30 },
  { id:"f4",day_id:6,date:"2026-09-07",flight_no:"KL807",origin:"AMS",destination:"TPE",depart_time:"20:15",arrive_time:"14:55+1",min_krw:900000,max_krw:1500000,status:"월요일 직항",alternative:"CI74·다구간 총액 비교",url:"https://www.klm.com/",notes:"편도 계획범위",sort_order:40 },
  { id:"f5",day_id:11,date:"2026-09-12",flight_no:"BR891",origin:"TPE",destination:"HKG",depart_time:"07:00",arrive_time:"08:50",min_krw:150000,max_krw:250000,status:"재확인 필요",alternative:"CI601 07:20→09:15",url:"https://www.evaair.com/",notes:null,sort_order:50 },
  { id:"f6",day_id:11,date:"2026-09-12",flight_no:"CX430",origin:"HKG",destination:"ICN",depart_time:"17:40",arrive_time:"22:25",min_krw:200000,max_krw:400000,status:"매일 운항패턴",alternative:"CX426 19:45→00:25+1",url:"https://flights.cathaypacific.com/destinations/en_HK/flights-from-hong-kong-to-seoul",notes:"3시간45분",sort_order:60 },
];

export const hotels = [
  { id:"h1",day_id:1,name:"Scandic Fornebu",city:"Fornebu/Oslo",check_in:"2026-09-02",check_out:"2026-09-03",nights:1,rooms:2,min_krw:320000,max_krw:510000,status:"추천",alternative:"Radisson Blu Park Hotel",url:"https://www.scandichotels.com/hotels/norway/oslo/scandic-fornebu",notes:"Equinor 접근",sort_order:10 },
  { id:"h2",day_id:2,name:"Boutique Hotel Britannia",city:"Esbjerg",check_in:"2026-09-03",check_out:"2026-09-04",nights:1,rooms:2,min_krw:350000,max_krw:550000,status:"추천",alternative:"A Place To Hotel Esbjerg",url:"https://www.britannia.dk/en",notes:"Port 접근",sort_order:20 },
  { id:"h3",day_id:3,name:"25hours Hotel HafenCity",city:"Hamburg",check_in:"2026-09-04",check_out:"2026-09-05",nights:1,rooms:2,min_krw:470000,max_krw:680000,status:"추천",alternative:"PIERDREI Hotel HafenCity",url:"https://25hours-hotels.com/hamburg/hafencity/",notes:"Skyborn·항만 접근",sort_order:30 },
  { id:"h4",day_id:4,name:"Hotel New York",city:"Rotterdam",check_in:"2026-09-05",check_out:"2026-09-07",nights:2,rooms:2,min_krw:850000,max_krw:1300000,status:"추천",alternative:"nhow Rotterdam",url:"https://hotelnewyork.com/",notes:"항만 분위기·월요일 회의",sort_order:40 },
  { id:"h5",day_id:7,name:"InterContinental Kaohsiung",city:"Kaohsiung",check_in:"2026-09-08",check_out:"2026-09-10",nights:2,rooms:2,min_krw:1100000,max_krw:1450000,status:"추천",alternative:"Silks Club Kaohsiung",url:"https://ickaohsiung.com/",notes:"AWTEC 행사장 인접",sort_order:50 },
  { id:"h6",day_id:9,name:"Taichung Harbor Hotel",city:"Taichung Port",check_in:"2026-09-10",check_out:"2026-09-11",nights:1,rooms:2,min_krw:410000,max_krw:600000,status:"추천",alternative:"Taichung Harbor Stars Hotel",url:"https://tchhotel.com/",notes:"항만회의 접근",sort_order:60 },
  { id:"h7",day_id:10,name:"Hyatt Regency Taoyuan International Airport",city:"Taoyuan Airport",check_in:"2026-09-11",check_out:"2026-09-12",nights:1,rooms:2,min_krw:420000,max_krw:650000,status:"추천",alternative:"Holiday Inn Taoyuan Airport",url:"https://www.hyatt.com/hyatt-regency/en-US/tpehr-hyatt-regency-taoyuan-international-airport",notes:"07:00 홍콩편 대응",sort_order:70 },
];

export const meetings = [
  { id:"m1",day_id:1,organization:"Equinor Fornebu",agenda:"부유식/고정식, Utsira Nord, EPC·O&M, 공급망·수익성 리스크",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.equinor.com/where-we-are/norway-how-to-find-us",notes:"",sort_order:10 },
  { id:"m2",day_id:1,organization:"Norwegian Offshore Wind",agenda:"노르웨이 공급망·법무·계약, 회원사 라운드테이블",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.norwegianoffshorewind.no/",notes:"",sort_order:20 },
  { id:"m3",day_id:2,organization:"Ørsted Gentofte",agenda:"개발·운영, PPA/PF, 현지화, 계약·분쟁 관리",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://orsted.com/",notes:"",sort_order:30 },
  { id:"m4",day_id:2,organization:"Blue Water Shipping",agenda:"풍력부품, 통관·보관, 설치지연·비상조달",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:false,url:"https://www.bws.net/",notes:"",sort_order:40 },
  { id:"m5",day_id:3,organization:"Port Esbjerg",agenda:"사전조립·중량물·설치선·부두임대·처리량",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:false,url:"https://portesbjerg.dk/en/",notes:"",sort_order:50 },
  { id:"m6",day_id:3,organization:"Skyborn Renewables",agenda:"개발포트폴리오, 인허가·계통·수익성, 철수기준",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.skybornrenewables.com/",notes:"",sort_order:60 },
  { id:"m7",day_id:6,organization:"Port of Rotterdam",agenda:"해상풍력·수소·중량물·탈탄소·투자·위험분담",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:false,url:"https://www.portofrotterdam.com/en",notes:"",sort_order:70 },
  { id:"m8",day_id:8,organization:"Ørsted Taiwan / AWTEC 관계자",agenda:"대만 제도·O&M·현지화·계약 리스크",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:true,url:"https://orsted.tw/",notes:"AWTEC 행사장에서 개최",sort_order:80 },
  { id:"m9",day_id:10,organization:"Port of Taichung",agenda:"전용부두·임대·중량물·투자·현지화",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"https://tc.twport.com.tw/en/",notes:"",sort_order:90 },
  { id:"m10",day_id:10,organization:"Ørsted O&M Hub + CFXD/ZN Base",agenda:"관제·예방정비·예비품·CTV/SOV",recommended_duration:"105분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"https://orsted.tw/",notes:"",sort_order:100 },
  { id:"m11",day_id:10,organization:"VESTAS-P2-CIP Warehouse",agenda:"터빈부품·재고·긴급조달",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"",notes:"",sort_order:110 },
];

export const transportOptions = [
  { id:"t1",region:"CPH→Esbjerg→Hamburg→Rotterdam",recommendation:"렌터카 추천",reason:"4인+짐, 기관 간 이동, 열차환승 제거",min_krw:1100000,max_krw:1800000,notes:"국경통과·네덜란드 편도반납·완전자차·운전자2인 조건",sort_order:10 },
  { id:"t2",region:"오슬로/포르네부",recommendation:"예약밴 또는 택시",reason:"체류 1일, 공항·Fornebu만 이동",min_krw:250000,max_krw:450000,notes:"렌터카 인수·주차시간 절약",sort_order:20 },
  { id:"t3",region:"Rotterdam→Schiphol",recommendation:"열차 우선",reason:"시간차가 작고 편도차량 불필요",min_krw:80000,max_krw:180000,notes:"수하물이 많으면 밴 재비교",sort_order:30 },
  { id:"t4",region:"대만 가오슝→타이중→타오위안",recommendation:"THSR+타이중 단기렌트",reason:"도시간은 HSR, 항만 안에서는 차량",min_krw:700000,max_krw:1100000,notes:"가오슝 장기렌트 제거",sort_order:40 },
  { id:"t5",region:"홍콩 당일경유",recommendation:"Airport Express+MTR+택시",reason:"좌측통행·주차·렌트 인수시간 회피",min_krw:250000,max_krw:400000,notes:"4인 합계, 수하물보관 포함",sort_order:50 },
];

export const restaurants = [
  { id:"r1",day_id:1,name:"Sjøflyhavna Kro",city:"Fornebu",meal_type:"업무저녁",price_per_person:"NOK 500~1,000",url:"https://www.sjoflyhavna.no/meny",notes:"",sort_order:10 },
  { id:"r2",day_id:2,name:"Restaurant Mundheld / Britannia",city:"Esbjerg",meal_type:"저녁",price_per_person:"DKK 300~500",url:"https://www.britannia.dk/en",notes:"",sort_order:20 },
  { id:"r3",day_id:3,name:"Heimat Restaurant",city:"Hamburg",meal_type:"업무저녁",price_per_person:"EUR 35~60",url:"https://25hours-hotels.com/hamburg/hafencity/restaurants-and-bars/heimat-restaurant/",notes:"",sort_order:30 },
  { id:"r4",day_id:4,name:"Hotel New York",city:"Rotterdam",meal_type:"점심·저녁",price_per_person:"EUR 30~50",url:"https://hotelnewyork.com/food-beverage/menu/",notes:"",sort_order:40 },
  { id:"r5",day_id:7,name:"Hawker",city:"Kaohsiung",meal_type:"저녁",price_per_person:"TWD 900~1,500",url:"https://ickaohsiung.com/en/restaurant-en/hawker/",notes:"",sort_order:50 },
  { id:"r6",day_id:10,name:"Le Monde Buffet",city:"Taichung Port",meal_type:"저녁",price_per_person:"TWD 1,000~1,500",url:"https://tchhotel.com/service_detail/6?cid=1",notes:"",sort_order:60 },
  { id:"r7",day_id:11,name:"Tim Ho Wan IFC",city:"Hong Kong",meal_type:"점심",price_per_person:"HKD 150~250",url:"https://www.google.com/maps/search/?api=1&query=Tim+Ho+Wan+IFC+Hong+Kong",notes:"Airport Express Hong Kong Station 연결",sort_order:70 },
];

export const mapPoints = [
  {id:"p01",day_id:1,code:"ICN",name:"인천공항",lat:37.4602,lng:126.4407,sort_order:1,segment_type:"flight",popup:"9/1 23:45 SK988",url:"https://www.flysas.com/"},
  {id:"p02",day_id:1,code:"CPH",name:"코펜하겐공항",lat:55.6181,lng:12.6560,sort_order:2,segment_type:"flight",popup:"9/2 06:05",url:""},
  {id:"p03",day_id:1,code:"OSL",name:"오슬로공항",lat:60.1939,lng:11.1004,sort_order:3,segment_type:"flight",popup:"직항 연결",url:""},
  {id:"p04",day_id:1,code:"FORNEBU",name:"Fornebu",lat:59.8960,lng:10.6300,sort_order:4,segment_type:"car",popup:"Equinor·NOW",url:""},
  {id:"p05",day_id:2,code:"CPH2",name:"Copenhagen/Gentofte",lat:55.75,lng:12.55,sort_order:1,segment_type:"flight",popup:"Ørsted",url:"https://orsted.com/"},
  {id:"p06",day_id:2,code:"ESB",name:"Esbjerg",lat:55.4765,lng:8.4594,sort_order:2,segment_type:"car",popup:"Blue Water",url:""},
  {id:"p07",day_id:3,code:"ESB2",name:"Port Esbjerg",lat:55.4765,lng:8.4594,sort_order:1,segment_type:"car",popup:"Port 회의",url:"https://portesbjerg.dk/en/"},
  {id:"p08",day_id:3,code:"HAM",name:"Hamburg",lat:53.5511,lng:9.9937,sort_order:2,segment_type:"car",popup:"Skyborn",url:""},
  {id:"p09",day_id:4,code:"HAM2",name:"Hamburg",lat:53.5511,lng:9.9937,sort_order:1,segment_type:"car",popup:"출발",url:""},
  {id:"p10",day_id:4,code:"RTM",name:"Rotterdam",lat:51.9244,lng:4.4777,sort_order:2,segment_type:"car",popup:"항만",url:""},
  {id:"p11",day_id:4,code:"TNO",name:"TNO Delft",lat:51.99,lng:4.37,sort_order:3,segment_type:"car",popup:"외관 사진",url:"https://www.tno.nl/en/about-tno/contact/locations/delft-molengraaffsingel-next/"},
  {id:"p12",day_id:5,code:"RTM2",name:"Rotterdam Maritime District",lat:51.909,lng:4.487,sort_order:1,segment_type:"car",popup:"워크숍",url:""},
  {id:"p13",day_id:6,code:"PORT",name:"Port of Rotterdam",lat:51.9244,lng:4.4777,sort_order:1,segment_type:"car",popup:"공식회의",url:"https://www.portofrotterdam.com/en"},
  {id:"p14",day_id:6,code:"AMS",name:"Amsterdam Schiphol",lat:52.3105,lng:4.7683,sort_order:2,segment_type:"car",popup:"KL807",url:""},
  {id:"p15",day_id:7,code:"TPE",name:"Taiwan Taoyuan Airport",lat:25.0797,lng:121.2342,sort_order:1,segment_type:"flight",popup:"14:55 도착",url:""},
  {id:"p16",day_id:7,code:"KHH",name:"Kaohsiung",lat:22.6273,lng:120.3014,sort_order:2,segment_type:"hsr",popup:"AWTEC",url:""},
  {id:"p17",day_id:8,code:"AWTEC",name:"Kaohsiung Exhibition Center",lat:22.6107,lng:120.2991,sort_order:1,segment_type:"car",popup:"AWTEC",url:"https://www.awtec2026.com/"},
  {id:"p18",day_id:9,code:"KHH2",name:"Kaohsiung Technical Tour",lat:22.6273,lng:120.3014,sort_order:1,segment_type:"car",popup:"Technical Tour",url:""},
  {id:"p19",day_id:9,code:"TC",name:"Taichung",lat:24.1477,lng:120.6736,sort_order:2,segment_type:"hsr",popup:"저녁 이동",url:""},
  {id:"p20",day_id:10,code:"TCPORT",name:"Taichung Port",lat:24.256,lng:120.52,sort_order:1,segment_type:"car",popup:"항만 클러스터",url:""},
  {id:"p21",day_id:10,code:"TPE2",name:"Taoyuan Airport Hotel",lat:25.0797,lng:121.2342,sort_order:2,segment_type:"hsr",popup:"공항호텔",url:""},
  {id:"p22",day_id:11,code:"HKG",name:"Hong Kong Airport",lat:22.308,lng:113.9185,sort_order:1,segment_type:"flight",popup:"08:50 도착",url:""},
  {id:"p23",day_id:11,code:"CENTRAL",name:"Hong Kong Central",lat:22.2819,lng:114.1589,sort_order:2,segment_type:"subway",popup:"당일관광",url:""},
  {id:"p24",day_id:11,code:"TSIM",name:"Tsim Sha Tsui",lat:22.2988,lng:114.1722,sort_order:3,segment_type:"subway",popup:"Victoria Harbour",url:""},
  {id:"p25",day_id:11,code:"HKG2",name:"Hong Kong Airport",lat:22.308,lng:113.9185,sort_order:4,segment_type:"subway",popup:"17:40 CX430",url:""},
  {id:"p26",day_id:11,code:"ICNR",name:"인천공항 귀국",lat:37.4602,lng:126.4407,sort_order:5,segment_type:"flight",popup:"22:25 도착",url:""},
];

export const budgetItems = [
  { id:"b1",category:"항공",label:"장거리·유럽·대만→홍콩→인천 4인",min_krw:11000000,max_krw:19000000,notes:"다구간/편도 혼합 계획범위. 실시간 발권가로 교체.",sort_order:10 },
  { id:"b2",category:"숙박",label:"호텔 9박·2실",min_krw:4500000,max_krw:6800000,notes:"Fornebu 1, Esbjerg 1, Hamburg 1, Rotterdam 2, Kaohsiung 2, Taichung 1, Taoyuan 1",sort_order:20 },
  { id:"b3",category:"교통",label:"렌터카·밴·철도·택시 4인",min_krw:3500000,max_krw:5500000,notes:"국경간 편도렌트 포함",sort_order:30 },
  { id:"b4",category:"식비",label:"전 일정 4인",min_krw:3500000,max_krw:5500000,notes:"업무식 포함",sort_order:40 },
  { id:"b5",category:"행사",label:"AWTEC late/on-site 등록 4인",min_krw:5600000,max_krw:5600000,notes:"USD 950×4 계획환율 적용",sort_order:50 },
  { id:"b6",category:"기타",label:"보험·PPE·통역·선물·수하물",min_krw:1000000,max_krw:2000000,notes:"기관 요청에 따라 변동",sort_order:60 },
];

export const officialSeed = { days, events, flights, hotels, meetings, transport_options: transportOptions, restaurants, map_points: mapPoints, budget_items: budgetItems };
