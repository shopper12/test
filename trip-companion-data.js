// FINAL_0830 practical companion data. Public-safe: no personal contacts or confidential meeting details.
// Web rechecked 2026-08-31 KST. Suggested times are planning defaults, not meeting confirmations.

export const GUIDE_CHECKED_AT = "2026-08-31";

export const PRACTICAL_DAYS = [
  {
    day:1, date:"9/2", city:"타이중",
    plan:[
      ["09:40~10:40","RMQ 입국수속·수하물","공항 도착 후 바로 택시 호출"],
      ["10:40~11:20","RMQ → CHECK Inn LaiLai","택시 약 30~40분 · 호텔 짐 보관"],
      ["11:30~12:30","호텔 인근 중식·정비","Yizhong 상권 가벼운 식사 권장"],
      ["13:10~14:00","호텔 → TIPC/Port of Taichung","LX 차량/택시 · 약 40~50분"],
      ["14:00~16:00","TIPC 미팅·항만 견학 가안","실제 확정시간 수신 시 이 블록만 이동"],
      ["16:00~16:50","TIPC → 호텔","차량"],
      ["17:00~18:00","체크인·샤워·보고 메모 1차 정리","호텔"],
      ["18:30~20:30","Yizhong Night Market","도보권 · 예약 불필요"]
    ]
  },
  {
    day:2, date:"9/3", city:"타이중·창화",
    plan:[
      ["08:30~10:30","TIPC 회의 메모 정리·OEG 질문 정리","호텔"],
      ["10:40~11:40","이른 점심","오후 현장 일정 때문에 과식 피하기"],
      ["12:30~13:20","호텔 → OEG Taichung","OEG/전용차량 · Wuqi 이동"],
      ["13:30~14:30","OEG Taichung Office","확정"],
      ["14:30~15:10","OEG Taichung → Changhua facility","전용차량 약 40분"],
      ["15:20~17:30","OEG Changhua facility","확정"],
      ["17:30~18:30","Changhua → Taichung","전용차량"],
      ["18:30~20:30","OEG Taiwan 석식 간담회","장소 TBC · 미확정"]
    ]
  },
  {
    day:3, date:"9/4", city:"타이중 → 타오위안",
    plan:[
      ["07:30~08:30","Taichung Second Market 아침","호텔과 같은 Sanmin Rd 축 · 전통식 아침"],
      ["08:40~09:20","Liuchuan·구도심 짧은 산책","비 오면 호텔 카페/짐정리로 대체"],
      ["09:30~10:00","호텔 짐 정리·체크아웃","11:00 이전 체크아웃, 짐은 프런트 보관"],
      ["10:20~11:00","Miyahara","10:00 오픈 이후 방문 · 기념품/아이스크림"],
      ["11:20~12:40","Chun Shui Tang Original Store","버블티 원조점 · 점심 겸 이용"],
      ["13:00~15:10","호텔 복귀·짐 픽업·출장 메모 정리","출국 전 완충시간"],
      ["15:30~17:45","호텔 → TPE","전용차/택시 권장 · 교통정체 완충 포함"],
      ["17:45~20:30","출국수속·저녁","CI0073 23:10 출발 대비"],
      ["23:10","CI0073 TPE → AMS","발권 완료"]
    ]
  },
  {
    day:4, date:"9/5", city:"암스테르담",
    plan:[
      ["07:40~09:10","AMS 입국·수하물","Schiphol"],
      ["09:10~09:40","Schiphol → Sloterdijk → 호텔","NS 약 10~15분 + 도보"],
      ["10:30~12:00","Centraal·Damrak·Dam Square 워킹","Sloterdijk→Centraal NS"],
      ["12:15~13:30","The Pantry 점심","전통 네덜란드식 · 예약 권장"],
      ["14:00~15:00","호텔 체크인·휴식","피로 누적 시 이후 일정 생략 가능"],
      ["16:00~17:15","운하 크루즈","1시간 이상 · I amsterdam 티켓"],
      ["18:00~20:00","Moeders 또는 도심 저녁","Dutch comfort food"]
    ]
  },
  {
    day:5, date:"9/6", city:"암스테르담",
    plan:[
      ["09:15~10:00","호텔 → Maritime Museum","NS/트램 또는 택시"],
      ["10:00~12:15","Het Scheepvaartmuseum","해양·항만 역사라 출장 테마와 가장 잘 맞는 관광"],
      ["12:20~13:10","박물관 카페/Marineterrein 인근 점심","일요일 영업 불확실 업장은 일정에서 제외"],
      ["13:20~14:40","Oosterdok·Centraal 방향 산책","우천 시 박물관 체류 연장 또는 Rijksmuseum 대안"],
      ["15:00~16:30","호텔 복귀·OEG Subsea 자료 정리","다음날 조기출발 준비"],
      ["16:30~17:15","NS 앱에서 Den Helder 편·플랫폼 재확인","좌석예약 불필요 · OVpay/NS e-ticket"],
      ["17:30 이후","이른 저녁·휴식","다음날 06:25 체크아웃 권장"]
    ]
  },
  {
    day:6, date:"9/7", city:"덴헬더 → 함부르크",
    plan:[
      ["06:25~06:40","체크아웃·짐 정리","Urban Lodge"],
      ["06:40~07:00","Sloterdijk 출발편 탑승","NS 직통 Den Helder · 전날 정확편 확인"],
      ["08:10 전후","Den Helder 도착 → OEG","택시 약 10분 · 08:30대 현장 도착 목표"],
      ["09:00~12:30","OEG Subsea BV","확정 · 중식 포함"],
      ["12:40~14:10","OEG → Den Helder → Sloterdijk","택시+NS"],
      ["14:10~14:40","호텔 짐 픽업","Sloterdijk"],
      ["14:40~15:10","Sloterdijk → Schiphol","NS 약 10~15분"],
      ["15:10~19:45","공항 대기·업무정리","20:50 KLM"],
      ["20:50~21:55","KL1759 AMS → HAM","발권 완료"],
      ["22:10~22:50","HAM → Hamburg Hbf → 호텔","S1 약 25분 + 도보"]
    ]
  },
  {
    day:7, date:"9/8", city:"함부르크",
    plan:[
      ["09:30~09:50","호텔 → OWC Hamburg","택시/hvv"],
      ["10:00~11:30","OWC Hamburg","시간 확정"],
      ["11:40~13:00","Restaurant Parlament 점심","Rathausmarkt · OWC와 도보권 · 12:00 오픈"],
      ["13:15~13:45","Rathaus → DNV Brooktorkai","도보/택시"],
      ["14:00~15:30","DNV Hamburg 미팅 가안","미확정 · 확정시간 수신 시 이동"],
      ["15:40~16:40","Speicherstadt·Brooktorkai 답사","DNV 바로 주변"],
      ["16:50~17:40","Elbphilharmonie Plaza/외관","HafenCity 동선"],
      ["18:00~20:00","Deichgraf 또는 현지 북독일식 저녁","Deichstraße · 예약 권장"]
    ]
  },
  {
    day:8, date:"9/9", city:"함부르크 → 에스비에르",
    plan:[
      ["07:45~08:15","호텔 → Skyborn","택시"],
      ["08:30~10:00","Skyborn Renewables 가안","조율 중"],
      ["10:00~10:40","호텔 짐 픽업 → Hamburg Hbf","택시+도보"],
      ["10:40~11:10","역 도착·간단식 구매","국제열차 좌석예약 권장"],
      ["11시대~16:50 전후","Hamburg Hbf → Kolding → Esbjerg","DB/DSB · 실제 편은 DB Navigator에서 최종 확인"],
      ["17:00~17:30","Hotel Britannia 체크인","Esbjerg St. 도보권"],
      ["18:00~18:45","Men at Sea 선택 관광","택시 약 10분 · 강풍/비 시 생략"],
      ["19:00~21:00","Dronning Louise 저녁","호텔 바로 인근 Torvet · 예약 가능"]
    ]
  },
  {
    day:9, date:"9/10", city:"에스비에르 → 오르후스 → 에스비에르",
    plan:[
      ["08:00~08:20","호텔 → Blue Water Shipping","BWS 차량/택시"],
      ["08:30~10:30","BWS 미팅·Port Tour 가안","미팅/투어 확정 · 종료시각은 열차에 맞춘 권장안"],
      ["10:30~10:50","BWS → Esbjerg St.","차량"],
      ["11:03~13:08","IC 2337 Esbjerg → Aarhus H","현재 시간표 기준 · Fredericia에서 열차번호가 이어짐 · 좌석예약 권장"],
      ["13:15~14:15","Raadhuus Kafeen 점심","Aarhus H 약 300m · smørrebrød/plaice 추천 · 예약 권장"],
      ["14:20~14:45","OWC Denmark 이동·미팅 준비","Banegårdspladsen · 도보"],
      ["15:00~16:30","OWC Denmark 미팅 가안","15:00 확정 · 종료 16:30 기준으로 계획"],
      ["16:30~17:30","Aarhus H 주변 짧은 산책·역 이동","시간 남으면 ARoS 외관/시청 주변"],
      ["17:50~19:54","IC 460 Aarhus H → Esbjerg","현재 시간표 기준 · Fredericia 이후 IC 2360으로 이어짐"],
      ["20:05~21:30","Esbjerg 저녁","Dronning Louise 간단식 또는 Hotel Britannia"]
    ]
  },
  {
    day:10, date:"9/11", city:"에스비에르 → 애버딘 → 암스테르담 → 인천",
    plan:[
      ["07:30~09:00","호텔 조식·출장결과 메모 정리","최종 사진/명함/질문 정리"],
      ["09:00~10:30","체크아웃 준비·짐 정리","11:00 전"],
      ["10:45~11:10","Hotel Britannia → Esbjerg Airport","BWS 차량 지원 우선 · 택시 대안"],
      ["11:10~12:30","EBJ 체크인·보안","공항은 도심에서 차량으로 수분~십여분"],
      ["13:15~13:45","LM058 EBJ → ABZ","발권 완료"],
      ["13:45~16:20","Aberdeen Airport 환승","도심 관광 금지 · 입국/재보안 변수 때문에 공항 내 유지"],
      ["17:20~19:50","KL0918 ABZ → AMS","발권 완료"],
      ["21:35","KL0855 AMS → ICN","발권 완료"]
    ]
  }
];

export const TRANSPORT_GUIDE = [
  {day:"1",route:"RMQ → CHECK Inn LaiLai",mode:"택시",time:"30~40분",booking:"https://www.uber.com/global/en/r/cities/taichung-tw/",live:"https://www.google.com/maps/dir/?api=1&origin=Taichung+International+Airport&destination=CHECK+Inn+Taichung+LaiLai",note:"3명+수하물이므로 공항택시/대형 Uber 우선."},
  {day:"1",route:"호텔 → Port of Taichung/TIPC",mode:"LX 차량/택시",time:"40~50분",booking:"https://www.google.com/maps/dir/?api=1&origin=CHECK+Inn+Taichung+LaiLai&destination=Port+of+Taichung",live:"https://www.google.com/maps/dir/?api=1&origin=CHECK+Inn+Taichung+LaiLai&destination=Taiwan+International+Ports+Corporation+Taichung",note:"미팅 시작 50분 전 출발."},
  {day:"3",route:"Taichung → TPE",mode:"전용차/택시 우선 · THSR 대안",time:"차량 약 2시간+",booking:"https://en.thsrc.com.tw/",live:"https://www.tymetro.com.tw/tymetro-new/en/",note:"THSR 대안: 택시→THSR Taichung→Taoyuan(A18)→Airport MRT A13(T2). 수하물 3인이라 전용차가 단순."},
  {day:"4·6",route:"Schiphol ↔ Sloterdijk",mode:"NS Sprinter",time:"약 10~15분",booking:"https://www.ns.nl/en/featured/purchase-a-train-ticket-online/mobile-tickets.html",live:"https://www.ns.nl/en/travel-information",note:"OVpay 컨택리스 카드/휴대폰으로 check-in/out 가능. NS e-ticket도 가능."},
  {day:"6",route:"Sloterdijk → Den Helder",mode:"NS 직통열차",time:"약 1시간 10분",booking:"https://www.ns.nl/en/travel-information",live:"https://www.ns.nl/en/travel-information",note:"06:40~07:00대 출발편 선택. 네덜란드 국내 NS는 좌석예약 불필요."},
  {day:"6",route:"HAM → Hamburg Hbf",mode:"hvv S1",time:"약 25분",booking:"https://www.hvv.de/en",live:"https://www.hvv.de/en",note:"공항역에서 S1. 늦은 도착이라 수하물 많으면 택시 대안."},
  {day:"7",route:"Hotel St. Raphael ↔ Alter Wall/Brooktorkai",mode:"택시 또는 hvv",time:"10~20분",booking:"https://www.hvv.de/en",live:"https://www.hvv.de/en",note:"OWC→DNV는 도심/HafenCity라 도보+택시 혼합이 효율적."},
  {day:"8",route:"Hamburg Hbf → Kolding → Esbjerg",mode:"DB/DSB 국제열차",time:"약 5시간",booking:"https://int.bahn.de/en",live:"https://int.bahn.de/en",note:"3명 좌석예약 권장. 9/9 당일 DB Navigator에서 공사·플랫폼 재확인."},
  {day:"9",route:"Esbjerg → Aarhus H",mode:"DSB IC 2337",time:"11:03→13:08 (현재 시간표)",booking:"https://www.dsb.dk/en/tickets-and-services/dsb-app/",live:"https://www.rejseplanen.dk/webapp/?language=en_EN",note:"Fredericia에서 편명이 이어지지만 동일 연결. 좌석예약 권장."},
  {day:"9",route:"Aarhus H → Esbjerg",mode:"DSB IC 460 → IC 2360",time:"17:50→19:54 (현재 시간표)",booking:"https://www.dsb.dk/en/tickets-and-services/Seat-Reservation/",live:"https://www.rejseplanen.dk/webapp/?language=en_EN",note:"OWC 16:30 종료 가안이면 충분한 버퍼."},
  {day:"10",route:"Hotel Britannia → Esbjerg Airport",mode:"BWS 차량 / Esbjerg Taxa",time:"약 10~20분",booking:"https://esbjergairport.dk/en/the-airport/to-and-from/",live:"https://www.rejseplanen.dk/webapp/?language=en_EN",note:"공항 공식 안내상 택시·버스 이용 가능. BWS 지원 미확정 시 택시."}
];

export const RESTAURANTS = [
  {day:"1",city:"타이중",name:"Yizhong Night Market",fit:"숙소 바로 인근, 첫날 체력 부담 적음",menu:"지파이·반월형 간식·루웨이·취두부·Fengren Ice",hours:"대체로 10:00~24:00, 점포별 상이",reserve:"예약 불필요",url:"https://travel.taichung.gov.tw/en/tourist/tour/1037",map:"https://www.google.com/maps/search/?api=1&query=Yizhong+Street+Taichung"},
  {day:"3",city:"타이중",name:"Taichung Second Market",fit:"100년 전통시장, 아침 일정에 바로 맞음",menu:"루러우판·버섯/고기 수프·홍차·면류",hours:"통상 07:30~15:30, 점포별 상이",reserve:"예약 불필요",url:"https://travel.taichung.gov.tw/en/Attractions/Intro/1366",map:"https://www.google.com/maps/search/?api=1&query=Taichung+Second+Market"},
  {day:"3",city:"타이중",name:"Chun Shui Tang Original Store",fit:"버블티 원조점, 출국 전 점심에 적합",menu:"Pearl Milk Tea + 대만식 면/딤섬류",hours:"08:30~22:00",reserve:"3명은 대기 가능성 감안",url:"https://www.chunshuitang.com.tw/en/location-detail/original_store/",map:"https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+Original+Store+Taichung"},
  {day:"4",city:"암스테르담",name:"The Pantry",fit:"전통 네덜란드 요리를 한 번에 먹기 좋음",menu:"hutspot·kale/sauerkraut stamppot·smoked sausage·hachee·bitterballen",hours:"매일 10:30~22:30",reserve:"온라인 예약 권장",url:"https://www.thepantry.nl/en/booking/",map:"https://www.google.com/maps/search/?api=1&query=The+Pantry+Amsterdam"},
  {day:"4",city:"암스테르담",name:"Moeders",fit:"저녁용 Dutch comfort food",menu:"전통 네덜란드 가정식",hours:"매일 17:00~23:30/24:00 · 주방 마감 전 확인",reserve:"온라인 예약 권장",url:"https://moeders.com/en/reservations",map:"https://www.google.com/maps/search/?api=1&query=Moeders+Amsterdam"},
  {day:"7",city:"함부르크",name:"Restaurant Parlament",fit:"OWC Alter Wall과 매우 가까운 Rathaus 지하 · 점심용",menu:"북독일식 육류·생선, Hamburg식 메뉴",hours:"화~토 12:00~16:00 · 주방 마감시간 재확인",reserve:"온라인/전화 예약 권장",url:"https://www.parlament-hamburg.de/contact/?lang=en",map:"https://www.google.com/maps/search/?api=1&query=Restaurant+Parlament+Hamburg"},
  {day:"7",city:"함부르크",name:"Deichgraf",fit:"Speicherstadt/HafenCity 답사 후 저녁에 붙이기 좋음",menu:"지역 생선·육류·계절 북독일식",hours:"화~토 12:00~15:00, 17:30~21:00 주방",reserve:"전화/이메일 예약",url:"https://www.deichgraf-hamburg.de/",map:"https://www.google.com/maps/search/?api=1&query=Deichgraf+Hamburg"},
  {day:"8·9",city:"에스비에르",name:"Dronning Louise",fit:"Hotel Britannia에서 거의 바로 앞 Torvet",menu:"2026 늦여름 메뉴 · 펍/덴마크식 식사",hours:"주방 매일 10:00~21:00",reserve:"BOOK BORD 가능",url:"https://dr-louise.dk/menukort/menukort/",map:"https://www.google.com/maps/search/?api=1&query=Dronning+Louise+Esbjerg"},
  {day:"8",city:"에스비에르",name:"Restaurant Plates",fit:"17층 전망 + 비즈니스 저녁 후보",menu:"버터구이 haddock 295 DKK·beef burger 235·3코스 summer menu 395",hours:"월~토 점심 11:30~15:00 · 저녁 17:00~23:00",reserve:"온라인 예약 권장",url:"https://restaurantplates.dk/index.php/en/",map:"https://www.google.com/maps/search/?api=1&query=Restaurant+Plates+Esbjerg"},
  {day:"8·9",city:"에스비에르",name:"Café Danmark",fit:"전통 덴마크식 스뫼레브뢰드·생선 메뉴 대안",menu:"smørrebrød·stjerneskud·plaice 등",hours:"공식 사이트 당일 재확인",reserve:"사전예약 권장",url:"https://cafedanmark.dk/",map:"https://www.google.com/maps/search/?api=1&query=Cafe+Danmark+Esbjerg"},
  {day:"9",city:"오르후스",name:"Raadhuus Kafeen",fit:"Aarhus H·OWC 사이 1시간 점심에 적합",menu:"smørrebrød·plaice with shrimp 162 DKK·3 open sandwiches 198 DKK",hours:"월~토 11:30~23:00",reserve:"13:15 3명 사전예약 권장",url:"https://raadhuus-kafeen.dk/bestil-bord/",map:"https://www.google.com/maps/search/?api=1&query=Raadhuus+Kafeen+Aarhus"}
];

export const ATTRACTIONS = [
  {day:"1",city:"타이중",name:"Yizhong Shopping District",slot:"18:30~20:30",why:"호텔 도보권·첫날 저녁 최적",hours:"상점별 상이",ticket:"무료",url:"https://travel.taichung.gov.tw/en/attractions/intro/1551",map:"https://www.google.com/maps/search/?api=1&query=Yizhong+Shopping+District+Taichung"},
  {day:"3",city:"타이중",name:"Taichung Second Market",slot:"07:30~08:30",why:"Sanmin Road 축·100년 시장·아침식사",hours:"통상 07:30~15:30",ticket:"무료",url:"https://travel.taichung.gov.tw/en/Attractions/Intro/1366",map:"https://www.google.com/maps/search/?api=1&query=Taichung+Second+Market"},
  {day:"3",city:"타이중",name:"Liuchuan Riverside Walk",slot:"08:40~09:20",why:"출국일 아침에 짧게 가능한 구도심 산책",hours:"옥외",ticket:"무료",url:"https://travel.taichung.gov.tw/en/",map:"https://www.google.com/maps/search/?api=1&query=Liuchuan+Riverside+Walk+Taichung"},
  {day:"3",city:"타이중",name:"Miyahara",slot:"10:20~11:00",why:"10:00 오픈 이후 구도심 건축·디저트·기념품",hours:"10:00~21:00",ticket:"무료",url:"https://travel.taichung.gov.tw/en/attractions/intro/1239",map:"https://www.google.com/maps/search/?api=1&query=Miyahara+Taichung"},
  {day:"4",city:"암스테르담",name:"Amsterdam Canal Cruise",slot:"16:00~17:15",why:"짧은 시간에 운하·도심 구조 파악",hours:"운영사별",ticket:"I amsterdam 온라인 구매",url:"https://www.iamsterdam.com/en/tickets/canal-cruise-ticket",map:"https://www.google.com/maps/search/?api=1&query=Amsterdam+Canal+Cruise+Centraal"},
  {day:"5",city:"암스테르담",name:"Het Scheepvaartmuseum",slot:"10:00~12:15",why:"해상풍력 출장과 가장 직접 연결되는 해양·항만 역사",hours:"10:00~17:00",ticket:"온라인 사전구매 권장",url:"https://www.hetscheepvaartmuseum.com/",map:"https://www.google.com/maps/search/?api=1&query=Het+Scheepvaartmuseum+Amsterdam"},
  {day:"5",city:"암스테르담",name:"Rijksmuseum (우천/취향 대안)",slot:"09:00~11:00 대안",why:"시간예약 필수 · 1시간 압축관람도 가능",hours:"매일 09:00~17:00",ticket:"시작시간 예약 필수",url:"https://www.rijksmuseum.nl/en/visit/practical-info/opening-hours-and-prices",map:"https://www.google.com/maps/search/?api=1&query=Rijksmuseum+Amsterdam"},
  {day:"7",city:"함부르크",name:"Speicherstadt",slot:"15:40~16:40",why:"DNV Brooktorkai와 바로 이어져 추가 이동 거의 없음",hours:"옥외 상시",ticket:"무료",url:"https://www.hamburg-travel.com/discover-hamburg/areas/speicherstadt-hafencity/",map:"https://www.google.com/maps/search/?api=1&query=Speicherstadt+Hamburg"},
  {day:"7",city:"함부르크",name:"Elbphilharmonie Plaza",slot:"16:50~17:40",why:"HafenCity·항만 조망",hours:"공식 사이트 시간 확인",ticket:"Plaza 티켓 사전확보 권장",url:"https://www.elbphilharmonie.de/en/plaza",map:"https://www.google.com/maps/search/?api=1&query=Elbphilharmonie+Hamburg"},
  {day:"8",city:"에스비에르",name:"Men at Sea",slot:"18:00~18:45 선택",why:"북해·항만도시 정체성을 짧게 체감",hours:"옥외 상시",ticket:"무료",url:"https://www.visitvesterhavet.com/northsea/north-sea-vacation/men-sea-gdk610805",map:"https://www.google.com/maps/search/?api=1&query=Men+at+Sea+Esbjerg"},
  {day:"9",city:"오르후스",name:"ARoS 외관/도심",slot:"16:30~17:20 여유 시",why:"OWC와 Aarhus H 가까운 짧은 선택지",hours:"9/10 목요일 09:00~20:00",ticket:"성인 200 DKK · 내부관람은 시간 부족",url:"https://www.aros.dk/en/visit/",map:"https://www.google.com/maps/search/?api=1&query=ARoS+Aarhus"}
];

export const REPORT_MEMOS = [
  {day:1,org:"TIPC / Port of Taichung",theme:"해상풍력 항만 인프라·공공항만 운영",points:["풍력부품 적치장 면적·야드 운영방식","부두 하중·수심·대형 설치선/지원선 접안 조건","터빈/블레이드/타워 반출입 동선과 병목","항만공사-개발사-O&M사의 역할 분담","장기 임대·전용부두·공유 인프라 운영모델"],evidence:["부두/야드 사진 촬영 가능범위 확인","현장 배치도·공개 브로슈어 확보","한국 항만과 비교할 수치 3개 이상 기록"]},
  {day:2,org:"OEG Taichung Office",theme:"MCC·현지 O&M 조직",points:["MCC 기능과 24/7 대응체계","현장 인력·선박·장비 dispatch 방식","대만 local content와 인력양성","예방정비/고장정비 KPI와 SLA"],evidence:["조직도 또는 역할구조 메모","고장→출동→복구 리드타임 사례","한국에서 내재화/외주화할 기능 구분"]},
  {day:2,org:"OEG Changhua facility",theme:"ECFE·Diving Tools·현장지원 장비",points:["장비 보관·정비·검사 주기","잠수/해저작업 안전·permit 체계","동시 프로젝트 대응을 위한 재고/예비품","창고-항만-선박 mobilization 시간"],evidence:["장비 종류별 사진/명칭","정비·교정 기록체계 질문","국내 O&M base에 필요한 최소 설비 목록"]},
  {day:6,org:"OEG Subsea BV · Den Helder",theme:"ROV·Dive·Rope Access·Subsea 통합서비스",points:["ROV/잠수/rope access를 한 회사가 통합 제공하는 장점","facility layout과 mobilization 동선","offshore 작업 전 준비·검사·toolbox 체계","해저케이블/구조물 점검 데이터 관리","인력 자격·훈련·비상대응"],evidence:["ROV/다이빙 장비별 용도 메모","facility tour에서 국내 적용 아이디어 5개","서비스 패키지/계약구조 질문"]},
  {day:7,org:"OWC Hamburg",theme:"Owner’s Engineering·Technical Advisory",points:["개발단계별 OE 업무범위","설계검토에서 CAPEX/LCoE를 줄이는 의사결정","기술실사와 lender/투자자 요구사항","리스크 register와 stage-gate 운영"],evidence:["실제 프로젝트 deliverable 예시 명칭","발주자가 내부에 보유해야 할 역량","한국 프로젝트에서 바로 적용할 체크리스트"]},
  {day:7,org:"DNV Hamburg",theme:"인증·검증·Digital Twin·기술리스크",points:["설계인증/프로젝트인증 범위와 비용·기간 영향","Digital Twin 실제 운영 데이터 입력·활용","고장예측·수명연장 의사결정","독립검증이 금융조달/보험에 미치는 효과"],evidence:["적용 사례 1~2개","인증 단계도/공개자료","국내 규정·인증체계와 차이점"]},
  {day:8,org:"Skyborn Renewables",theme:"개발·인허가·PF/PPA·사업리스크",points:["site selection→permit→FID 단계의 핵심 리스크","정부/지자체/어민·지역사회 협의","PPA·금융조달과 기술조건의 연결","공급망·항만·계통 제약을 개발초기에 반영하는 방법"],evidence:["개발 milestone 구조","실패/지연 원인 사례","한국 제도에서 병목이 될 부분 비교"]},
  {day:9,org:"Blue Water Shipping / Port of Esbjerg",theme:"설치항·중량물·공급망 물류",points:["터빈 대형화에 따른 야드/크레인/부두 변화","pre-assembly와 marshalling 방식","heavy lift·SPMT·선박 loading 순서","항만 체류시간을 줄이는 planning","BWS와 항만·OEM·설치사의 역할 경계"],evidence:["Port Tour 사진 위치별 메모","부두/야드 사용률·처리능력 수치 질문","타이중항과 Esbjerg항 비교표용 공통항목"]},
  {day:9,org:"OWC Denmark",theme:"OE·Asset Management·BoP O&M",points:["개발단계 OE와 운영단계 Asset Management 연결","BoP O&M 범위와 KPI","CAPEX 절감이 OPEX/availability에 미치는 trade-off","운영 데이터가 다음 프로젝트 설계에 환류되는 방식"],evidence:["Hamburg OWC와 덴마크 조직 역할 차이","운영 KPI 예시","한국 발전공기업이 내재화할 역량 3개"]}
];

export const REPORT_OUTLINE = [
  "1. 출장 목적·방문기관·동선",
  "2. 대만: 항만 인프라와 현장 O&M 체계",
  "3. 네덜란드: Subsea 통합서비스와 안전·mobilization",
  "4. 독일: OE·인증·개발 리스크 관리",
  "5. 덴마크: 설치항 물류·Asset Management·BoP O&M",
  "6. 국가/기관별 비교표: 항만·O&M·인증·개발·물류",
  "7. 국내 적용과제: 즉시 도입 / 제도개선 필요 / 추가검토",
  "8. 후속조치: 자료요청·협력창구·추가 벤치마킹"
];
