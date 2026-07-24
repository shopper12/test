export const APP_VERSION = "SEP2_EVENING_MOBILE_REORDER_V7";

export const tripMeta = {
  title: "해상풍력 업무·북유럽 여행 대시보드 2026",
  subtitle: "9월 2일 저녁 직항 출국 · Google Maps 업무장소만 방문 · 대만 약 3일 · AWTEC 2026",
  dates: "2026.09.02–09.12",
  route: "인천 → 코펜하겐 → 빌룬·에스비에르 → 함부르크 → 델프트·헤이그·로테르담 → 오슬로 → 타이베이·가오슝·타이중 → 홍콩 → 인천",
  travelers: 4,
  hotelNights: 7,
  flightNights: 2,
  noHotelStopovers: 1,
  budgetMin: 43000000,
  budgetMax: 51000000,
  budgetNote: "4인 기준. 항공은 Google Flights 자동조회 총액, 나머지는 계획범위, 10% 예비비 포함",
  lastVerified: "2026-07-23",
  sourceMap: "https://www.google.com/maps/placelists/list/MLw1ApIZ9AXefo8PbD2m1uUsxIq2zQ",
};

export const days = [
  { id:1, date:"2026-09-02", weekday:"수요일", cities:"인천 → 코펜하겐", lodging:"기내박", summary:"23:45 SK988 인천 출발 · 사용자가 지정한 9월 2일 저녁 직항 출국" },
  { id:2, date:"2026-09-03", weekday:"목요일", cities:"코펜하겐 → 빌룬 → 에스비에르", lodging:"Boutique Hotel Britannia", summary:"06:05 코펜하겐 도착 · 지도 저장장소 Blue Water Shipping 방문 · LEGO House와 북해 해변 관광" },
  { id:3, date:"2026-09-04", weekday:"금요일", cities:"에스비에르 → 함부르크 → 로테르담", lodging:"Hotel New York Rotterdam", summary:"지도 저장장소 Skyborn Renewables 방문 · 함부르크 관광·Restaurant Leuchtturm 점심 · 렌터카로 로테르담 이동" },
  { id:4, date:"2026-09-05", weekday:"토요일", cities:"헤이그 → 델프트 → 로테르담", lodging:"Hotel New York Rotterdam", summary:"지도 저장장소 TNO·Stieltjesweg·로테르담항 방문 · 미술관·구시가지·건축 관광" },
  { id:5, date:"2026-09-06", weekday:"일요일", cities:"로테르담 → 암스테르담 → 오슬로", lodging:"Clarion Hotel The Hub", summary:"KLM 직항으로 오슬로 이동 · 오페라하우스·MUNCH·Sørenga 관광 · 노르웨이 업무일정 없음" },
  { id:6, date:"2026-09-07", weekday:"월요일", cities:"오슬로 → 프랑크푸르트 → 타이베이", lodging:"기내박", summary:"OSL–FRA–TPE 1회 환승 · 현재 최단 실용 조합 · 대만 업무 전 이동일" },
  { id:7, date:"2026-09-08", weekday:"화요일", cities:"타이베이 → 가오슝", lodging:"InterContinental Kaohsiung", summary:"06:15 도착 · 지도 저장장소 Ørsted Taiwan 타이베이 사무소 · AWTEC 오후 세션과 Banquet" },
  { id:8, date:"2026-09-09", weekday:"수요일", cities:"가오슝", lodging:"InterContinental Kaohsiung", summary:"AWTEC Plenary·세션·Closing 종일 참가 · 저녁 Pier-2와 야시장 관광" },
  { id:9, date:"2026-09-10", weekday:"목요일", cities:"가오슝 → 루강 → 타이중항", lodging:"Taichung Harbor Hotel", summary:"지도 저장장소 CFXD & ZN·Ørsted O&M Hub·VESTAS-P2-CIP만 업무 방문 · 가오메이 습지 관광" },
  { id:10, date:"2026-09-11", weekday:"금요일", cities:"타이중 → 홍콩 당일관광 → 인천", lodging:"무숙박", summary:"RMQ–HKG 오전 직항 · Central·Tai Kwun·Star Ferry·침사추이 · HKG 21:00 출발" },
  { id:11, date:"2026-09-12", weekday:"토요일", cities:"인천", lodging:"귀가", summary:"01:40 인천 도착 예정 · 홍콩→인천 비행시간 3시간 40분" },
];

const e = (id, day_id, time_start, time_end, title, category, location, transport, duration, extras={}) => ({
  id, day_id, time_start, time_end, title, category, location, transport, duration,
  original_currency:null, original_min:null, original_max:null,
  min_cost_krw:null, max_cost_krw:null, cost_basis:null,
  booking_url:null, official_url:null, map_url:null, notes:null,
  sort_order:(Number(String(id).split("-").pop()) || 0) * 10, updated_at:new Date().toISOString(), ...extras,
});

export const events = [
  e("d1-01",1,"23:45","9/3 06:05","SK988 인천(ICN) → 코펜하겐(CPH) 직항","항공","ICN → CPH","SAS","13시간 20분",{booking_url:"https://www.google.com/travel/flights",notes:"9월 2일 수요일 저녁 출발. 실시간 총액과 실제 출발시각은 항공·숙박 탭에서 자동 갱신."}),
  e("d1-02",2,"06:05","06:50","입국·수하물·7인승 렌터카 인수","입국·교통","Copenhagen Airport","도보+렌터카","45분",{notes:"4인+수하물. 덴마크→독일→네덜란드 편도반납·국경통과·완전자차를 반드시 포함."}),
  e("d1-03",2,"06:50","09:35","코펜하겐공항 → Blue Water Shipping","교통","CPH → Billund","렌터카","약 2시간 45분"),
  e("d1-04",2,"10:00","11:30","Blue Water Shipping 방문","업무","지도 저장 좌표 55.7358995, 9.1513797","렌터카","90분",{official_url:"https://www.bws.net/",map_url:"https://www.google.com/maps/search/?api=1&query=55.7358995,9.1513797",notes:"공유 Google Maps에 있는 지점. 풍력부품 운송·보관·통관·설치지연 대응만 질의."}),
  e("d1-05",2,"11:40","14:20","LEGO House 관람·Mini Chef 점심","관광·식사","Billund","렌터카+도보","2시간 40분",{booking_url:"https://legohouse.com/en-gb/"}),
  e("d1-06",2,"14:20","15:30","빌룬 → 에스비에르","교통","Billund → Esbjerg","렌터카","약 1시간 10분"),
  e("d1-07",2,"16:00","17:30","Men at Sea·Sædding 해변 산책","관광","Esbjerg","렌터카+도보","90분",{map_url:"https://www.google.com/maps/search/?api=1&query=Men+at+Sea+Esbjerg"}),
  e("d1-08",2,"19:00","20:30","Restaurant Mundheld 저녁","식사","Hotel Britannia, Esbjerg","도보","90분",{booking_url:"https://www.britannia.dk/en"}),

  e("d2-01",3,"06:45","09:40","에스비에르 → 함부르크","교통","Esbjerg → Hamburg","렌터카","약 2시간 55분"),
  e("d2-02",3,"10:00","11:30","Skyborn Renewables 방문","업무","Ericusspitze 2, Hamburg","렌터카","90분",{official_url:"https://www.skybornrenewables.com/",map_url:"https://www.google.com/maps/search/?api=1&query=Skyborn+Renewables+Ericusspitze+2",notes:"공유 Google Maps에 있는 지점. 개발·인허가·계통·수익성·계약관리 질의."}),
  e("d2-03",3,"11:35","12:15","Speicherstadt·Elbphilharmonie 외관","관광","Hamburg HafenCity","도보","40분",{map_url:"https://www.google.com/maps/search/?api=1&query=Elbphilharmonie+Hamburg"}),
  e("d2-04",3,"12:30","13:30","Restaurant Leuchtturm 점심","식사","Außenmühlendamm 2, Hamburg-Harburg","렌터카","60분",{booking_url:"https://www.leuchtturm-harburg.de/",notes:"공유 Google Maps 저장 식당. 월–토 12:30부터 영업 확인."}),
  e("d2-05",3,"13:30","19:00","함부르크 → 로테르담","교통","Hamburg-Harburg → Rotterdam","렌터카","약 5시간 30분",{notes:"교대운전자 2명·휴게 1회. 항공은 4인 기준 당일 조회가 렌터카보다 현저히 비싸 렌터카 유지."}),
  e("d2-06",3,"19:30","21:00","Fenix·Katendrecht 산책과 저녁","관광·식사","Rotterdam","도보","90분",{booking_url:"https://fenix.nl/en/food-at-fenix/"}),

  e("d3-01",4,"08:30","10:00","TNO 방문","업무","Oude Waalsdorperweg 63, Den Haag","렌터카","90분",{official_url:"https://www.tno.nl/en/about-tno/contact/",map_url:"https://www.google.com/maps/search/?api=1&query=TNO+Oude+Waalsdorperweg+63",notes:"공유 Google Maps에 있는 TNO 지점만 방문. 토요일 면담 가능 여부 사전 확정 필요."}),
  e("d3-02",4,"10:10","11:10","Mauritshuis·Hofvijver","관광","Den Haag","렌터카+도보","60분",{booking_url:"https://www.mauritshuis.nl/en/"}),
  e("d3-03",4,"11:35","12:05","Stieltjesweg 1 저장장소 확인","업무","Stieltjesweg 1, Delft","렌터카","30분",{map_url:"https://www.google.com/maps/search/?api=1&query=Stieltjesweg+1+Delft",notes:"공유 Google Maps에 저장된 정확한 주소. 기관명·토요일 면담 여부는 사전 확인 후 확정."}),
  e("d3-04",4,"12:15","13:40","Delft Markt·Stads-Koffyhuis 점심","관광·식사","Delft","도보","85분",{booking_url:"https://www.stads-koffyhuis.nl/"}),
  e("d3-05",4,"14:30","16:00","로테르담항 방문","업무","지도 저장 좌표 51.9496008, 4.145263","렌터카","90분",{official_url:"https://www.portofrotterdam.com/en",map_url:"https://www.google.com/maps/search/?api=1&query=51.9496008,4.145263",notes:"공유 Google Maps의 로테르담항 지점. 토요일 공식 면담 불가 시 현장·항만 동선 답사로 전환."}),
  e("d3-06",4,"16:30","19:00","Markthal·Cube Houses·Oude Haven","관광","Rotterdam Centrum","도보","2시간 30분",{map_url:"https://www.google.com/maps/search/?api=1&query=Markthal+Rotterdam"}),
  e("d3-07",4,"19:00","20:30","Old Scuola Rotterdam 저녁","식사","Rotterdam","도보/택시","90분",{booking_url:"https://oldscuola.nl/"}),

  e("d4-01",5,"06:50","07:45","로테르담 → 스키폴·렌터카 반납","교통","Rotterdam → AMS","렌터카","55분"),
  e("d4-02",5,"09:20","11:05","AMS → OSL 직항","항공","Amsterdam → Oslo","KLM","1시간 45분",{booking_url:"https://www.google.com/travel/flights",notes:"최저가 편은 오후일 수 있으나 오슬로 관광시간을 위해 오전편 권고. 양쪽 가격을 항공 탭에 표시."}),
  e("d4-03",5,"12:00","13:00","공항철도 → Oslo S·호텔 짐보관","교통","OSL → Oslo S","Flytoget","약 1시간",{booking_url:"https://flytoget.no/en/"}),
  e("d4-04",5,"13:30","17:30","오슬로 오페라하우스·MUNCH·Sørenga","관광","Bjørvika, Oslo","도보","4시간",{booking_url:"https://www.munch.no/en/",notes:"노르웨이에는 업무 방문을 배치하지 않음."}),
  e("d4-05",5,"18:00","19:30","Fiskeriet Youngstorget 저녁","식사","Oslo","도보","90분",{booking_url:"https://fiskeriet.com/"}),

  e("d6-01",6,"04:45","05:25","호텔 → OSL","교통","Oslo S → OSL","Flytoget","40분"),
  e("d6-02",6,"06:45","08:55","OSL → FRA","항공","Oslo → Frankfurt","Lufthansa","2시간 10분",{booking_url:"https://www.google.com/travel/flights"}),
  e("d6-03",6,"11:15","9/8 06:15","FRA → TPE 직항","항공","Frankfurt → Taipei","China Airlines","13시간",{booking_url:"https://www.google.com/travel/flights",notes:"OSL–TPE 전체를 1회 환승으로 검색한 현재 최저 실용 조합. 4인 총액 자동 갱신."}),

  e("d7-01",7,"06:15","08:20","TPE 입국·수하물·Airport MRT","입국·교통","Taoyuan Airport → Taipei","Airport MRT","2시간 5분"),
  e("d7-02",7,"09:00","10:30","Ørsted 沃旭能源 방문","업무","No. 1 Songzhi Rd, 19F, Taipei","MRT+도보","90분",{official_url:"https://orsted.tw/",map_url:"https://www.google.com/maps/search/?api=1&query=25.0387588,121.5662595",notes:"공유 Google Maps에 저장된 타이베이 사무소."}),
  e("d7-03",7,"10:30","11:20","Taipei 101·Xinyi 산책","관광","Xinyi, Taipei","도보","50분",{booking_url:"https://www.taipei-101.com.tw/en/"}),
  e("d7-04",7,"11:30","14:10","타이베이 → 가오슝","교통","Taipei Main → Zuoying → KEC","MRT+THSR+택시","2시간 40분",{booking_url:"https://en.thsrc.com.tw/"}),
  e("d7-05",7,"14:30","17:30","AWTEC Day 3 기술세션","컨퍼런스","Kaohsiung Exhibition Center","도보","3시간",{booking_url:"https://awtec2026.com/"}),
  e("d7-06",7,"19:00","21:30","AWTEC Conference Banquet & Award","컨퍼런스·식사","Kaohsiung Exhibition Center","도보","2시간 30분",{booking_url:"https://awtec2026.com/"}),

  e("d8-01",8,"08:30","12:00","AWTEC Plenary·기술세션","컨퍼런스","Kaohsiung Exhibition Center","도보","3시간 30분",{booking_url:"https://awtec2026.com/"}),
  e("d8-02",8,"13:00","17:00","AWTEC 기술세션·Closing Event","컨퍼런스","Kaohsiung Exhibition Center","도보","4시간",{booking_url:"https://awtec2026.com/"}),
  e("d8-03",8,"17:30","19:00","Pier-2 Art Center·항만 산책","관광","Kaohsiung","LRT+도보","90분",{booking_url:"https://pier2.org/"}),
  e("d8-04",8,"19:15","20:45","Liuhe Night Market 저녁","식사","Kaohsiung","MRT+도보","90분",{map_url:"https://www.google.com/maps/search/?api=1&query=Liuhe+Night+Market"}),

  e("d9-01",9,"06:30","09:10","가오슝 → 루강","교통","Kaohsiung → Lukang","기사 포함 밴","2시간 40분"),
  e("d9-02",9,"09:15","10:15","CFXD & ZN offshore windfarm O&M base 방문","업무","No.45 Lugong Rd, Lukang","밴","60분",{map_url:"https://www.google.com/maps/search/?api=1&query=24.0765986,120.3773545",notes:"공유 Google Maps 저장장소."}),
  e("d9-03",9,"11:00","12:00","Ørsted Taiwan Offshore Wind Farms O&M Hub 방문","업무","No.16 Beiheng 12th Rd, Taichung Port","밴","60분",{official_url:"https://orsted.tw/",map_url:"https://www.google.com/maps/search/?api=1&query=24.2888743,120.5164645",notes:"공유 Google Maps 저장장소."}),
  e("d9-04",9,"12:05","13:05","VESTAS-P2-CIP 방문","업무","No.8 Beiheng 12th Rd, Taichung Port","도보+밴","60분",{map_url:"https://www.google.com/maps/search/?api=1&query=24.2893533,120.5182355",notes:"공유 Google Maps 저장장소. Ørsted Hub와 인접."}),
  e("d9-05",9,"13:20","14:30","Wuqi 해산물 점심","식사","Wuqi Fishing Harbor","밴","70분",{map_url:"https://www.google.com/maps/search/?api=1&query=Wuqi+Fishing+Harbor"}),
  e("d9-06",9,"14:40","15:00","Taichung Port Station 저장장소","이동·사진","No.2 Jianan Rd, Qingshui","밴","20분",{map_url:"https://www.google.com/maps/search/?api=1&query=24.304388,120.602303",notes:"업무회의가 아닌 공유 지도 저장장소 확인."}),
  e("d9-07",9,"15:30","17:30","Gaomei Wetlands 일몰 산책","관광","Qingshui, Taichung","밴+도보","2시간",{map_url:"https://www.google.com/maps/search/?api=1&query=Gaomei+Wetlands"}),
  e("d9-08",9,"18:30","20:00","Le Monde Buffet 저녁","식사","Taichung Harbor Hotel","도보","90분",{booking_url:"https://tchhotel.com/service_detail/6?cid=1"}),

  e("d10-01",10,"07:30","08:10","호텔 → 타이중공항","교통","Wuqi → RMQ","택시/밴","40분"),
  e("d10-02",10,"10:25","12:10","RMQ → HKG 직항","항공","Taichung → Hong Kong","HK Express","1시간 45분",{booking_url:"https://www.google.com/travel/flights",notes:"노선 최저가는 오후편일 수 있으나 홍콩 관광을 위해 오전편 권고. 두 가격을 대시보드에 함께 표시."}),
  e("d10-03",10,"12:55","13:30","HKG → Central","교통","Hong Kong Airport → Hong Kong Station","Airport Express","35분",{booking_url:"https://www.mtr.com.hk/en/customer/services/airport_express_index.html"}),
  e("d10-04",10,"13:35","14:25","Tim Ho Wan IFC 점심","식사","IFC, Central","도보","50분",{map_url:"https://www.google.com/maps/search/?api=1&query=Tim+Ho+Wan+IFC+Hong+Kong"}),
  e("d10-05",10,"14:30","15:35","Tai Kwun·SoHo 산책","관광","Central","도보","65분",{booking_url:"https://www.taikwun.hk/en/"}),
  e("d10-06",10,"15:45","17:30","Star Ferry·침사추이 Promenade","관광","Central → Tsim Sha Tsui","페리+도보","1시간 45분",{booking_url:"https://www.starferry.com.hk/en/home"}),
  e("d10-07",10,"17:30","18:10","Mak's Noodle 이른 저녁","식사","Tsim Sha Tsui","도보","40분",{map_url:"https://www.google.com/maps/search/?api=1&query=Maks+Noodle+Tsim+Sha+Tsui"}),
  e("d10-08",10,"18:15","19:00","Kowloon → HKG","교통","Kowloon Station → Airport","Airport Express","45분"),
  e("d10-09",10,"21:00","9/12 01:40","HKG → ICN 직항","항공","Hong Kong → Incheon","HK Express","3시간 40분",{booking_url:"https://www.google.com/travel/flights",notes:"당일 노선 절대최저가보다 관광시간이 긴 야간편 권고. 위탁수하물 포함 최종결제액 재확인."}),

  e("d11-01",11,"01:40","02:40","인천 도착·입국","귀국","Incheon International Airport","도보","60분"),
];

export const flights = [
  { id:"f1",day_id:1,date:"2026-09-02",flight_no:"SK988",origin:"ICN",destination:"CPH",depart_time:"23:45",arrive_time:"06:05+1",min_krw:null,max_krw:null,status:"9/2 저녁 직항·자동가격",alternative:"없음",url:"https://www.flysas.com/",notes:"4인 일반석·직항 최저가 자동조회. 실제 시각은 최신 운임 카드 우선.",sort_order:10 },
  { id:"f2",day_id:5,date:"2026-09-06",flight_no:"KLM 직항",origin:"AMS",destination:"OSL",depart_time:"09:20 권고",arrive_time:"11:05",min_krw:null,max_krw:null,status:"오전편 권고",alternative:"노선 최저가는 오후편 가능",url:"https://www.klm.com/",notes:"최저가와 일정 채택가를 분리 표시",sort_order:20 },
  { id:"f3",day_id:6,date:"2026-09-07",flight_no:"LH + CI",origin:"OSL",destination:"TPE",depart_time:"06:45",arrive_time:"06:15+1",min_krw:null,max_krw:null,status:"FRA 1회 환승",alternative:"AMS 1회 환승은 늦은 도착",url:"https://www.google.com/travel/flights",notes:"1회 이하 환승 최저가 자동조회",sort_order:30 },
  { id:"f4",day_id:10,date:"2026-09-11",flight_no:"HK Express 직항",origin:"RMQ",destination:"HKG",depart_time:"10:25 권고",arrive_time:"12:10",min_krw:null,max_krw:null,status:"오전편 권고",alternative:"노선 최저가는 오후편 가능",url:"https://www.hkexpress.com/en-tw/flights-from-taichung-to-hong-kong",notes:"홍콩 관광시간 확보",sort_order:40 },
  { id:"f5",day_id:10,date:"2026-09-11",flight_no:"HK Express 직항",origin:"HKG",destination:"ICN",depart_time:"21:00 권고",arrive_time:"01:40+1",min_krw:null,max_krw:null,status:"야간편 권고",alternative:"절대최저가는 16:55편 가능",url:"https://www.hkexpress.com/",notes:"3시간 40분·9/12 귀국",sort_order:50 },
];

export const hotels = [
  { id:"h1",day_id:2,name:"Boutique Hotel Britannia",city:"Esbjerg",check_in:"2026-09-03",check_out:"2026-09-04",nights:1,rooms:2,min_krw:350000,max_krw:550000,status:"추천",alternative:"A Place To Hotel Esbjerg",url:"https://www.britannia.dk/en",notes:"식당·도심 접근",sort_order:10 },
  { id:"h2",day_id:3,name:"Hotel New York Rotterdam",city:"Rotterdam",check_in:"2026-09-04",check_out:"2026-09-06",nights:2,rooms:2,min_krw:850000,max_krw:1300000,status:"추천",alternative:"Room Mate Bruno",url:"https://hotelnewyork.com/",notes:"Katendrecht·항만 분위기",sort_order:20 },
  { id:"h3",day_id:5,name:"Clarion Hotel The Hub",city:"Oslo",check_in:"2026-09-06",check_out:"2026-09-07",nights:1,rooms:2,min_krw:400000,max_krw:600000,status:"추천",alternative:"Thon Hotel Opera",url:"https://www.strawberryhotels.com/hotels/norway/oslo/clarion-hotel-the-hub/",notes:"Oslo S·공항철도 접근",sort_order:30 },
  { id:"h4",day_id:7,name:"InterContinental Kaohsiung",city:"Kaohsiung",check_in:"2026-09-08",check_out:"2026-09-10",nights:2,rooms:2,min_krw:1100000,max_krw:1450000,status:"추천",alternative:"Silks Club Kaohsiung",url:"https://ickaohsiung.com/",notes:"AWTEC 행사장 도보권",sort_order:40 },
  { id:"h5",day_id:9,name:"Taichung Harbor Hotel",city:"Taichung Port",check_in:"2026-09-10",check_out:"2026-09-11",nights:1,rooms:2,min_krw:410000,max_krw:600000,status:"추천",alternative:"Taichung Harbor Stars Hotel",url:"https://tchhotel.com/",notes:"RMQ 30~40분",sort_order:50 },
];

export const meetings = [
  { id:"m1",day_id:2,organization:"Blue Water Shipping",agenda:"풍력부품 운송·보관·통관·설치지연 대응",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.bws.net/",notes:"Google Maps 저장 좌표 지점",sort_order:10 },
  { id:"m2",day_id:3,organization:"Skyborn Renewables",agenda:"개발·인허가·계통·수익성·계약관리",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.skybornrenewables.com/",notes:"Google Maps 저장 지점",sort_order:20 },
  { id:"m3",day_id:4,organization:"TNO",agenda:"해상풍력 시험·연구·인증 협력",recommended_duration:"90분",contact:"",status:"토요일 사전확정",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.tno.nl/en/about-tno/contact/",notes:"Oude Waalsdorperweg 63",sort_order:30 },
  { id:"m4",day_id:4,organization:"Stieltjesweg 1 저장장소",agenda:"기관명·토요일 면담 가능 여부 사전 확인",recommended_duration:"30분",contact:"",status:"확인 필요",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.google.com/maps/search/?api=1&query=Stieltjesweg+1+Delft",notes:"지도에는 주소명으로만 저장됨",sort_order:40 },
  { id:"m5",day_id:4,organization:"로테르담항",agenda:"중량물·항만임대·탈탄소·투자·위험분담",recommended_duration:"90분",contact:"",status:"토요일 사전확정",photo_allowed:true,ppe_required:true,interpreter_needed:false,url:"https://www.portofrotterdam.com/en",notes:"면담 불가 시 현장·항만 동선 답사",sort_order:50 },
  { id:"m6",day_id:7,organization:"Ørsted 沃旭能源",agenda:"대만 제도·현지화·O&M·계약 리스크",recommended_duration:"90분",contact:"",status:"요청",photo_allowed:false,ppe_required:false,interpreter_needed:true,url:"https://orsted.tw/",notes:"No.1 Songzhi Rd 19F",sort_order:60 },
  { id:"m7",day_id:7,organization:"AWTEC 2026 Day 3",agenda:"기술세션·Banquet",recommended_duration:"오후·저녁",contact:"",status:"등록 필요",photo_allowed:true,ppe_required:false,interpreter_needed:false,url:"https://awtec2026.com/",notes:"사용자 요청으로 유일하게 지도 외 추가한 업무행사",sort_order:70 },
  { id:"m8",day_id:8,organization:"AWTEC 2026 Day 4",agenda:"Plenary·기술세션·Closing",recommended_duration:"종일",contact:"",status:"등록 필요",photo_allowed:true,ppe_required:false,interpreter_needed:false,url:"https://awtec2026.com/",notes:"Kaohsiung Exhibition Center",sort_order:80 },
  { id:"m9",day_id:9,organization:"CFXD & ZN offshore windfarm O&M base",agenda:"O&M 운영·예비품·CTV/SOV",recommended_duration:"60분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"https://www.google.com/maps/search/?api=1&query=24.0765986,120.3773545",notes:"Google Maps 저장 지점",sort_order:90 },
  { id:"m10",day_id:9,organization:"Ørsted Taiwan Offshore Wind Farms O&M Hub",agenda:"통합관제·예방정비·예비품",recommended_duration:"60분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"https://orsted.tw/",notes:"Google Maps 저장 지점",sort_order:100 },
  { id:"m11",day_id:9,organization:"VESTAS-P2-CIP",agenda:"터빈부품·재고·긴급조달",recommended_duration:"60분",contact:"",status:"요청",photo_allowed:true,ppe_required:true,interpreter_needed:true,url:"https://www.google.com/maps/search/?api=1&query=24.2893533,120.5182355",notes:"Google Maps 저장 지점",sort_order:110 },
];

export const transportOptions = [
  { id:"t1",region:"CPH→Billund→Esbjerg→Hamburg→Rotterdam",recommendation:"7인승 편도 렌터카",reason:"4인+짐·업무장소 분산·HAM→AMS 항공료가 현재 4인 약 340만원 이상",min_krw:1200000,max_krw:2000000,notes:"국경통과·네덜란드 반납·완전자차·운전자 2인",sort_order:10 },
  { id:"t2",region:"Rotterdam→AMS",recommendation:"렌터카 반납 후 이동",reason:"새벽 교통과 수하물 고려",min_krw:100000,max_krw:200000,notes:"공항 반납 수수료 비교",sort_order:20 },
  { id:"t3",region:"오슬로",recommendation:"Flytoget+대중교통",reason:"업무장소 없음·도심 주차 불필요",min_krw:250000,max_krw:400000,notes:"4인 1일",sort_order:30 },
  { id:"t4",region:"대만",recommendation:"THSR+9/10 기사밴",reason:"타이베이·가오슝 도시간 HSR, 중앙서부 업무장소는 차량",min_krw:900000,max_krw:1400000,notes:"9/10 가오슝→루강→타이중항 편도",sort_order:40 },
  { id:"t5",region:"홍콩 당일경유",recommendation:"Airport Express+MTR+도보",reason:"관광시간 최대화·주차 회피",min_krw:250000,max_krw:400000,notes:"4인 합계·수하물 공항 보관",sort_order:50 },
];

export const restaurants = [
  { id:"r1",day_id:2,name:"Mini Chef at LEGO House",city:"Billund",meal_type:"점심",price_per_person:"DKK 199~299",url:"https://legohouse.com/en-gb/explore/eateries/mini-chef/",notes:"체험형·예약 권고",sort_order:10 },
  { id:"r2",day_id:2,name:"Restaurant Mundheld",city:"Esbjerg",meal_type:"저녁",price_per_person:"DKK 400~700",url:"https://www.britannia.dk/en",notes:"호텔 내",sort_order:20 },
  { id:"r3",day_id:3,name:"Restaurant Leuchtturm",city:"Hamburg-Harburg",meal_type:"점심",price_per_person:"EUR 30~60",url:"https://www.leuchtturm-harburg.de/",notes:"공유 Google Maps 저장 식당",sort_order:30 },
  { id:"r4",day_id:3,name:"O Anatolian Café at Fenix",city:"Rotterdam",meal_type:"저녁",price_per_person:"EUR 20~35",url:"https://fenix.nl/en/food-at-fenix/",notes:"Katendrecht",sort_order:40 },
  { id:"r5",day_id:4,name:"Stads-Koffyhuis",city:"Delft",meal_type:"점심",price_per_person:"EUR 18~30",url:"https://www.stads-koffyhuis.nl/",notes:"구시가지",sort_order:50 },
  { id:"r6",day_id:5,name:"Fiskeriet Youngstorget",city:"Oslo",meal_type:"저녁",price_per_person:"NOK 300~550",url:"https://fiskeriet.com/",notes:"해산물",sort_order:60 },
  { id:"r7",day_id:5,name:"Lofoten Fiskerestaurant",city:"Oslo",meal_type:"저녁 대안",price_per_person:"NOK 550~950",url:"https://lofoten-fiskerestaurant.no/",notes:"Aker Brygge",sort_order:70 },
  { id:"r8",day_id:8,name:"Liuhe Night Market",city:"Kaohsiung",meal_type:"저녁",price_per_person:"TWD 300~700",url:"https://www.google.com/maps/search/?api=1&query=Liuhe+Night+Market",notes:"해산물죽·파파야밀크",sort_order:80 },
  { id:"r9",day_id:9,name:"Le Monde Buffet",city:"Taichung Port",meal_type:"저녁",price_per_person:"TWD 1,000~1,500",url:"https://tchhotel.com/service_detail/6?cid=1",notes:"호텔 내",sort_order:90 },
  { id:"r10",day_id:10,name:"Tim Ho Wan IFC",city:"Hong Kong",meal_type:"점심",price_per_person:"HKD 120~220",url:"https://www.google.com/maps/search/?api=1&query=Tim+Ho+Wan+IFC+Hong+Kong",notes:"Airport Express 연결",sort_order:100 },
];

export const mapPoints = [
  {id:"p01",day_id:1,name:"인천공항",lat:37.458666,lng:126.4419679,sort_order:1,segment_type:"flight",popup:"9/2 23:45 SK988 출발",url:""},
  {id:"p02",day_id:1,name:"코펜하겐공항",lat:55.6181,lng:12.6560,sort_order:2,segment_type:"flight",popup:"9/3 06:05 도착",url:""},

  {id:"p02b",day_id:2,name:"코펜하겐공항",lat:55.6181,lng:12.6560,sort_order:1,segment_type:"car",popup:"06:05 도착·렌터카 인수",url:""},
  {id:"p03",day_id:2,name:"Blue Water Shipping",lat:55.7358995,lng:9.1513797,sort_order:2,segment_type:"car",popup:"지도 허용 업무장소",url:"https://www.bws.net/"},
  {id:"p04",day_id:2,name:"LEGO House",lat:55.7308,lng:9.1153,sort_order:3,segment_type:"car",popup:"관광·점심",url:"https://legohouse.com/"},
  {id:"p05",day_id:2,name:"Men at Sea",lat:55.4894,lng:8.4123,sort_order:4,segment_type:"car",popup:"관광",url:""},
  {id:"p06",day_id:2,name:"Hotel Britannia",lat:55.4672,lng:8.4511,sort_order:5,segment_type:"car",popup:"숙박·저녁",url:"https://www.britannia.dk/en"},

  {id:"p07",day_id:3,name:"Esbjerg 출발",lat:55.4672,lng:8.4511,sort_order:1,segment_type:"car",popup:"06:45 출발",url:""},
  {id:"p08",day_id:3,name:"Skyborn Renewables",lat:53.5454495,lng:10.0032102,sort_order:2,segment_type:"car",popup:"지도 허용 업무장소",url:"https://www.skybornrenewables.com/"},
  {id:"p09",day_id:3,name:"Speicherstadt",lat:53.5439,lng:9.9950,sort_order:3,segment_type:"car",popup:"관광",url:""},
  {id:"p10",day_id:3,name:"Restaurant Leuchtturm",lat:53.450779,lng:9.9810776,sort_order:4,segment_type:"car",popup:"지도 저장 식당",url:"https://www.leuchtturm-harburg.de/"},
  {id:"p11",day_id:3,name:"Hotel New York Rotterdam",lat:51.9048,lng:4.4844,sort_order:5,segment_type:"car",popup:"숙박·Fenix",url:"https://hotelnewyork.com/"},

  {id:"p12",day_id:4,name:"Hotel New York 출발",lat:51.9048,lng:4.4844,sort_order:1,segment_type:"car",popup:"출발",url:""},
  {id:"p13",day_id:4,name:"TNO Den Haag",lat:52.109418,lng:4.3273737,sort_order:2,segment_type:"car",popup:"지도 허용 업무장소",url:"https://www.tno.nl/en/"},
  {id:"p14",day_id:4,name:"Mauritshuis",lat:52.0800,lng:4.3143,sort_order:3,segment_type:"car",popup:"관광",url:"https://www.mauritshuis.nl/en/"},
  {id:"p15",day_id:4,name:"Stieltjesweg 1",lat:52.0007524,lng:4.3767328,sort_order:4,segment_type:"car",popup:"지도 허용 주소",url:""},
  {id:"p16",day_id:4,name:"Delft Markt",lat:52.0116,lng:4.3571,sort_order:5,segment_type:"car",popup:"관광·점심",url:""},
  {id:"p17",day_id:4,name:"로테르담항",lat:51.9496008,lng:4.145263,sort_order:6,segment_type:"car",popup:"지도 허용 업무장소",url:"https://www.portofrotterdam.com/en"},
  {id:"p18",day_id:4,name:"Markthal Rotterdam",lat:51.9201,lng:4.4869,sort_order:7,segment_type:"car",popup:"관광·저녁",url:""},

  {id:"p19",day_id:5,name:"Rotterdam",lat:51.9244,lng:4.4695,sort_order:1,segment_type:"car",popup:"출발",url:""},
  {id:"p20",day_id:5,name:"Schiphol Airport",lat:52.3127866,lng:4.7401699,sort_order:2,segment_type:"car",popup:"9/6 09:20 출발",url:""},
  {id:"p21",day_id:5,name:"Oslo Airport",lat:60.1939,lng:11.1004,sort_order:3,segment_type:"flight",popup:"11:05 도착",url:""},
  {id:"p22",day_id:5,name:"Oslo Opera House",lat:59.9075,lng:10.7530,sort_order:4,segment_type:"subway",popup:"관광",url:""},
  {id:"p23",day_id:5,name:"MUNCH",lat:59.9064,lng:10.7550,sort_order:5,segment_type:"subway",popup:"관광",url:"https://www.munch.no/en/"},
  {id:"p24",day_id:5,name:"Clarion Hotel The Hub",lat:59.9128,lng:10.7502,sort_order:6,segment_type:"subway",popup:"숙박",url:""},

  {id:"p29",day_id:6,name:"Oslo Airport",lat:60.1939,lng:11.1004,sort_order:1,segment_type:"subway",popup:"06:45 출발",url:""},
  {id:"p30",day_id:6,name:"Frankfurt Airport",lat:50.0379,lng:8.5622,sort_order:2,segment_type:"flight",popup:"2시간 20분 환승",url:""},
  {id:"p31",day_id:6,name:"Taiwan Taoyuan Airport",lat:25.0797,lng:121.2342,sort_order:3,segment_type:"flight",popup:"9/8 06:15 도착",url:""},

  {id:"p32",day_id:7,name:"Taoyuan Airport",lat:25.0797,lng:121.2342,sort_order:1,segment_type:"subway",popup:"입국",url:""},
  {id:"p33",day_id:7,name:"Ørsted 沃旭能源",lat:25.0387588,lng:121.5662595,sort_order:2,segment_type:"subway",popup:"지도 허용 업무장소",url:"https://orsted.tw/"},
  {id:"p34",day_id:7,name:"Taipei 101",lat:25.0340,lng:121.5645,sort_order:3,segment_type:"subway",popup:"관광",url:"https://www.taipei-101.com.tw/en/"},
  {id:"p35",day_id:7,name:"Taipei Main Station",lat:25.0478,lng:121.5170,sort_order:4,segment_type:"subway",popup:"THSR 출발",url:""},
  {id:"p36",day_id:7,name:"Zuoying HSR",lat:22.6877,lng:120.3095,sort_order:5,segment_type:"hsr",popup:"가오슝 도착",url:""},
  {id:"p37",day_id:7,name:"Kaohsiung Exhibition Center",lat:22.607874,lng:120.2983319,sort_order:6,segment_type:"car",popup:"AWTEC Day 3",url:"https://awtec2026.com/"},

  {id:"p38",day_id:8,name:"InterContinental Kaohsiung",lat:22.6068,lng:120.3007,sort_order:1,segment_type:"subway",popup:"출발",url:""},
  {id:"p39",day_id:8,name:"Kaohsiung Exhibition Center",lat:22.607874,lng:120.2983319,sort_order:2,segment_type:"subway",popup:"AWTEC Day 4",url:"https://awtec2026.com/"},
  {id:"p40",day_id:8,name:"Pier-2 Art Center",lat:22.6208,lng:120.2814,sort_order:3,segment_type:"subway",popup:"관광",url:"https://pier2.org/"},
  {id:"p41",day_id:8,name:"Liuhe Night Market",lat:22.6321,lng:120.3017,sort_order:4,segment_type:"subway",popup:"저녁",url:""},

  {id:"p42",day_id:9,name:"Kaohsiung 출발",lat:22.6068,lng:120.3007,sort_order:1,segment_type:"car",popup:"06:30 출발",url:""},
  {id:"p43",day_id:9,name:"CFXD & ZN O&M base",lat:24.0765986,lng:120.3773545,sort_order:2,segment_type:"car",popup:"지도 허용 업무장소",url:""},
  {id:"p44",day_id:9,name:"Ørsted O&M Hub",lat:24.2888743,lng:120.5164645,sort_order:3,segment_type:"car",popup:"지도 허용 업무장소",url:"https://orsted.tw/"},
  {id:"p45",day_id:9,name:"VESTAS-P2-CIP",lat:24.2893533,lng:120.5182355,sort_order:4,segment_type:"car",popup:"지도 허용 업무장소",url:""},
  {id:"p46",day_id:9,name:"Taichung Port Station",lat:24.304388,lng:120.602303,sort_order:5,segment_type:"car",popup:"지도 저장장소",url:""},
  {id:"p47",day_id:9,name:"Gaomei Wetlands",lat:24.3124,lng:120.5496,sort_order:6,segment_type:"car",popup:"관광",url:""},
  {id:"p48",day_id:9,name:"Taichung Harbor Hotel",lat:24.2537,lng:120.5302,sort_order:7,segment_type:"car",popup:"숙박",url:"https://tchhotel.com/"},

  {id:"p49",day_id:10,name:"Taichung Harbor Hotel",lat:24.2537,lng:120.5302,sort_order:1,segment_type:"car",popup:"07:30 출발",url:""},
  {id:"p50",day_id:10,name:"Taichung Airport",lat:24.2620608,lng:120.6244181,sort_order:2,segment_type:"car",popup:"10:25 출발",url:""},
  {id:"p51",day_id:10,name:"Hong Kong Airport",lat:22.3080,lng:113.9185,sort_order:3,segment_type:"flight",popup:"12:10 도착",url:""},
  {id:"p52",day_id:10,name:"Hong Kong Central",lat:22.2819,lng:114.1589,sort_order:4,segment_type:"subway",popup:"점심·관광",url:""},
  {id:"p53",day_id:10,name:"Tai Kwun",lat:22.2814,lng:114.1547,sort_order:5,segment_type:"subway",popup:"관광",url:"https://www.taikwun.hk/en/"},
  {id:"p54",day_id:10,name:"Tsim Sha Tsui Promenade",lat:22.2949,lng:114.1696,sort_order:6,segment_type:"subway",popup:"Star Ferry·관광",url:""},
  {id:"p55",day_id:10,name:"Hong Kong Airport 출발",lat:22.3080,lng:113.9185,sort_order:7,segment_type:"subway",popup:"21:00 출발",url:""},
  {id:"p56",day_id:10,name:"인천공항",lat:37.458666,lng:126.4419679,sort_order:8,segment_type:"flight",popup:"9/12 01:40 도착",url:""},
  {id:"p57",day_id:11,name:"인천공항 도착",lat:37.458666,lng:126.4419679,sort_order:1,segment_type:"car",popup:"입국·귀가",url:""},
];

export const budgetItems = [
  { id:"b1",category:"항공",label:"5개 항공 구간·4인 자동조회",min_krw:0,max_krw:0,notes:"flight-prices.json의 일정 채택가 합계로 화면에서 자동 대체",sort_order:10 },
  { id:"b2",category:"숙박",label:"호텔 7박·2실",min_krw:3600000,max_krw:5500000,notes:"Esbjerg 1, Rotterdam 2, Oslo 1, Kaohsiung 2, Taichung 1",sort_order:20 },
  { id:"b3",category:"교통",label:"렌터카·밴·철도·택시 4인",min_krw:3500000,max_krw:5500000,notes:"덴마크→네덜란드 편도렌트·대만 기사밴 포함",sort_order:30 },
  { id:"b4",category:"식비·관광",label:"식사·입장권·크루즈 4인",min_krw:3500000,max_krw:5500000,notes:"업무 외 시간은 관광·식당으로 구성",sort_order:40 },
  { id:"b5",category:"행사",label:"AWTEC late/on-site 등록 4인",min_krw:5600000,max_krw:5600000,notes:"USD 950×4 계획환율 기준",sort_order:50 },
  { id:"b6",category:"기타",label:"보험·PPE·통역·수하물",min_krw:1000000,max_krw:2000000,notes:"기관 요청·LCC 위탁수하물에 따라 변동",sort_order:60 },
];

export const officialSeed = {
  days, events, flights, hotels, meetings,
  transport_options:transportOptions,
  restaurants, map_points:mapPoints, budget_items:budgetItems,
};
