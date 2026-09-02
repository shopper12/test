// Concrete meal places for the deployed travel dashboard.
// Public-safe: no personal contacts. Rechecked against current public/official sources on 2026-09-02.

export const RESTAURANT_GUIDE_CHECKED_AT = "2026-09-02";

export const RESTAURANT_GUIDE = [
  {
    id:"food-d1-lunch",day:1,meal:"중식",time:"11:30~12:30",city:"타이중·북구",
    name:"春水堂 中友店 · Chun Shui Tang Chungyo",
    address:"中友百貨 C棟 B2, No. 161, Sec. 3, Sanmin Rd, North Dist., Taichung 404, Taiwan",
    cuisine:"대만식·중화요리·차관",menu:"버블티·공푸면·딤섬·대만식 면/밥류",price:"TWD 200~400/인",
    fit:"CHECK Inn LaiLai(No.125)와 같은 Sanmin Rd. 호텔 짐 보관 뒤 첫 중식으로 가장 단순한 동선.",
    hours:"평일 11:00~22:00 · 주말 10:30~22:00",reserve:"점심 피크 대기 가능",
    url:"https://www.chunshuitang.com.tw/en/location-detail/chungyo_store/",
    map:"https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+Chungyo+Branch+Taichung",
    lat:24.15184,lng:120.68469,status:"추천"
  },
  {
    id:"food-d1-dinner",day:1,meal:"석식",time:"18:30~20:30",city:"타이중·북구",
    name:"Yizhong Street Night Market · 一中街夜市",
    address:"Yizhong St, North Dist., Taichung 404, Taiwan",
    cuisine:"대만 야시장·중화권 길거리음식",menu:"지파이·루웨이·면류·취두부·디저트",price:"TWD 100~350/인",
    fit:"호텔·중우백화점 인근에서 첫날 저녁을 가볍게 해결하는 선택.",
    hours:"점포별 상이 · 대체로 늦은 저녁까지",reserve:"예약 불필요",
    url:"https://travel.taichung.gov.tw/en/attractions/intro/1551",
    map:"https://www.google.com/maps/search/?api=1&query=Yizhong+Street+Night+Market+Taichung",
    lat:24.1498,lng:120.6848,status:"추천"
  },
  {
    id:"food-d2-lunch",day:2,meal:"중식",time:"11:00~11:45",city:"타이중·북구",
    name:"春水堂 中友店 · Chun Shui Tang Chungyo",
    address:"中友百貨 C棟 B2, No. 161, Sec. 3, Sanmin Rd, North Dist., Taichung 404, Taiwan",
    cuisine:"대만식·중화요리·차관",menu:"공푸면·딤섬·대만식 식사·차",price:"TWD 200~400/인",
    fit:"12:30 호텔 출발 전 가까운 곳에서 먹는 이른 중식. 오후 OEG 현장일정 때문에 장거리 식당은 배제.",
    hours:"평일 11:00~22:00",reserve:"오픈 직후 이용 권장",
    url:"https://www.chunshuitang.com.tw/en/location-detail/chungyo_store/",
    map:"https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+Chungyo+Branch+Taichung",
    lat:24.15184,lng:120.68469,status:"추천"
  },
  {
    id:"food-d3-breakfast",day:3,meal:"조식",time:"07:30~08:30",city:"타이중·중구",
    name:"Taichung Second Market · 臺中第二市場",
    address:"No. 87, Sec. 2, Sanmin Rd, Central Dist., Taichung 400, Taiwan",
    cuisine:"대만 전통시장",menu:"루러우판·수프·면류·홍차·시장 아침식사",price:"TWD 80~250/인",
    fit:"출국일 오전 구도심 동선에 붙이는 전통식 아침.",
    hours:"점포별 상이 · 아침 영업 점포 중심",reserve:"예약 불필요",
    url:"https://travel.taichung.gov.tw/en/Attractions/Intro/1366",
    map:"https://www.google.com/maps/search/?api=1&query=Taichung+Second+Market",
    lat:24.14231,lng:120.6787,status:"추천"
  },
  {
    id:"food-d3-lunch",day:3,meal:"중식",time:"11:20~12:40",city:"타이중·서구",
    name:"春水堂 創始店 · Chun Shui Tang Original Store",
    address:"No. 30, Siwei St, West Dist., Taichung 403, Taiwan",
    cuisine:"대만식·중화요리·차관",menu:"Pearl Milk Tea·공푸면·딤섬·대만식 식사",price:"TWD 250~500/인",
    fit:"Miyahara 이후 출국 전 중식. 버블티 원조점 자체가 방문 목적도 됨.",
    hours:"매일 08:30~22:00",reserve:"3명 점심 대기 가능성 감안",
    url:"https://www.chunshuitang.com.tw/en/location-detail/original_store/",
    map:"https://www.google.com/maps/search/?api=1&query=Chun+Shui+Tang+Original+Store+Taichung",
    lat:24.1375684,lng:120.6756327,status:"추천"
  },
  {
    id:"food-d4-lunch",day:4,meal:"중식",time:"12:15~13:30",city:"암스테르담·Centrum",
    name:"The Pantry",
    address:"Leidsekruisstraat 21, 1017 RE Amsterdam, Netherlands",
    cuisine:"네덜란드 전통식",menu:"stamppot·hachee·smoked sausage·bitterballen",price:"EUR 20~35/인",
    fit:"Centraal/Dam 산책 뒤 전통 네덜란드식 중식으로 배치.",
    hours:"매일 10:30~22:30",reserve:"온라인 예약 권장",
    url:"https://www.thepantry.nl/en/",
    map:"https://www.google.com/maps/search/?api=1&query=The+Pantry+Leidsekruisstraat+21+Amsterdam",
    lat:52.3634594,lng:4.8849564,status:"추천"
  },
  {
    id:"food-d4-dinner",day:4,meal:"석식",time:"18:00~20:00",city:"암스테르담·Jordaan",
    name:"Moeders",
    address:"Rozengracht 251, 1016 SX Amsterdam, Netherlands",
    cuisine:"Dutch comfort food",menu:"stamppot·hachee·전통 네덜란드 가정식",price:"EUR 25~45/인",
    fit:"운하 일정 뒤 현지 가정식 저녁 후보.",
    hours:"매일 17:00~24:00 · 주방 22:00까지",reserve:"예약 권장",
    url:"https://moeders.com/en",
    map:"https://www.google.com/maps/search/?api=1&query=Moeders+Rozengracht+251+Amsterdam",
    lat:52.3717761,lng:4.8750219,status:"추천"
  },
  {
    id:"food-d5-lunch",day:5,meal:"중식",time:"12:20~13:10",city:"암스테르담·Oosterdok",
    name:"Hannekes Boom",
    address:"Dijksgracht 4, 1019 BS Amsterdam, Netherlands",
    cuisine:"네덜란드·유럽식 캐주얼",menu:"점심식사·샌드위치·스낵·채식 옵션",price:"EUR 15~30/인",
    fit:"Het Scheepvaartmuseum/Marineterrein에서 Centraal 방향으로 이어지는 수변 중식 후보.",
    hours:"일요일 11:00~01:00 · 평일도 11:00 오픈",reserve:"소규모는 현장 이용 중심",
    url:"https://hannekesboom.nl/en/contact/",
    map:"https://www.google.com/maps/search/?api=1&query=Hannekes+Boom+Dijksgracht+4+Amsterdam",
    lat:52.3762528,lng:4.9118444,status:"추천"
  },
  {
    id:"food-d6-lunch",day:6,meal:"중식·기관제공",time:"11:45~12:30",city:"덴헬더",
    name:"OEG Subsea BV · Lunch & Closing",
    address:"Koperslagersweg 2, 1786 RA Den Helder, Netherlands",
    cuisine:"기관 제공 오찬",menu:"OEG 일정상 Lunch & Closing · 메뉴 현장 확인",price:"기관 제공",
    fit:"외부 식당을 임의 지정하지 않고 확정 방문 장소 자체를 중식 위치로 표시.",
    hours:"9/7 방문 일정 11:45 Lunch & Closing",reserve:"기관 일정에 포함",
    url:"https://www.oeg.group/",
    map:"https://www.google.com/maps/search/?api=1&query=OEG+Subsea+BV+Koperslagersweg+2+Den+Helder",
    lat:52.9348,lng:4.7802,status:"확정일정"
  },
  {
    id:"food-d7-lunch",day:7,meal:"중식",time:"12:00~13:00",city:"함부르크·Rathaus",
    name:"Restaurant Parlament",
    address:"Rathausmarkt 1, 20095 Hamburg, Germany",
    cuisine:"북독일·독일식",menu:"생선·육류·지역식 점심 메뉴",price:"EUR 20~40/인",
    fit:"OWC Alter Wall 미팅 뒤 도보권. 12:00 오픈에 맞춰 배치.",
    hours:"화~토 12:00~16:00 · 화/수는 점심 영업",reserve:"사전예약 권장",
    url:"https://www.parlament-hamburg.de/?lang=en",
    map:"https://www.google.com/maps/search/?api=1&query=Restaurant+Parlament+Rathausmarkt+1+Hamburg",
    lat:53.55017,lng:9.99309,status:"추천"
  },
  {
    id:"food-d7-dinner",day:7,meal:"석식",time:"18:00~20:00",city:"함부르크·Altstadt",
    name:"Deichgraf",
    address:"Deichstr. 23, 20459 Hamburg, Germany",
    cuisine:"북독일·해산물·독일식",menu:"지역 생선·육류·계절 메뉴",price:"EUR 25~45/인",
    fit:"Speicherstadt/HafenCity 답사 뒤 붙이기 쉬운 저녁 후보.",
    hours:"화요일 저녁 영업 · 당일 영업시간 재확인",reserve:"예약 권장",
    url:"https://www.deichgraf-hamburg.de/",
    map:"https://www.google.com/maps/search/?api=1&query=Deichgraf+Deichstrasse+23+Hamburg",
    lat:53.546136,lng:9.987466,status:"추천"
  },
  {
    id:"food-d8-lunch",day:8,meal:"중식·열차전",time:"10:40~11:10",city:"함부르크·Hauptbahnhof",
    name:"Schweinske Wandelhalle",
    address:"Glockengießerwall 8-10, Wandelhalle, 20095 Hamburg, Germany",
    cuisine:"독일식 캐주얼·역내 식사",menu:"schnitzel·burger·currywurst·salad·bowl",price:"EUR 12~25/인",
    fit:"11시대 국제열차 탑승 직전 역 안에서 먹거나 포장할 수 있는 구체 중식 장소.",
    hours:"매일 06:00~24:00",reserve:"시간 촉박하면 포장",
    url:"https://www.schweinske.de/",
    map:"https://www.google.com/maps/search/?api=1&query=Schweinske+Wandelhalle+Hamburg+Hauptbahnhof",
    lat:53.5527,lng:10.0067,status:"추천"
  },
  {
    id:"food-d8-dinner",day:8,meal:"석식",time:"19:00~21:00",city:"에스비에르·Torvet",
    name:"Dronning Louise",
    address:"Torvet 19, 6700 Esbjerg, Denmark",
    cuisine:"덴마크·스칸디나비아·펍",menu:"덴마크식 식사·그릴·펍 메뉴",price:"DKK 180~350/인",
    fit:"Hotel Britannia와 같은 Torvet 권역. 체크인 뒤 이동 부담이 작음.",
    hours:"수요일 10:00~23:00",reserve:"테이블 예약 가능",
    url:"https://dr-louise.dk/",
    map:"https://www.google.com/maps/search/?api=1&query=Dronning+Louise+Torvet+19+Esbjerg",
    lat:55.46647,lng:8.45259,status:"추천"
  },
  {
    id:"food-d8-alt",day:8,meal:"중식·석식 대안",time:"11:30~15:00 / 17:00~23:00",city:"에스비에르",
    name:"Restaurant Plates",
    address:"Grådybet 73A, 17th floor, 6700 Esbjerg, Denmark",
    cuisine:"현대 유럽식·전망 레스토랑",menu:"생선·버거·시즌 코스",price:"DKK 235~450/인",
    fit:"에스비에르에서 여유시간이 생길 때의 식사 대안. 열차 이동 중식과는 별도 후보.",
    hours:"월~토 점심·저녁 영업",reserve:"온라인 예약 권장",
    url:"https://restaurantplates.dk/index.php/en/",
    map:"https://www.google.com/maps/search/?api=1&query=Restaurant+Plates+Gradybet+73A+Esbjerg",
    lat:55.47904,lng:8.43545,status:"대안"
  },
  {
    id:"food-d9-lunch",day:9,meal:"중식",time:"13:15~14:15",city:"오르후스·도심",
    name:"Raadhuus Kafeen",
    address:"Sønder Allé 3, 8000 Aarhus C, Denmark",
    cuisine:"덴마크 전통식",menu:"smørrebrød·plaice·덴마크식 점심",price:"DKK 160~300/인",
    fit:"Aarhus H 도착 뒤 OWC Denmark 미팅 전 도보 동선에 맞는 중식.",
    hours:"월~토 11:30~23:00 · 주방 21:30까지",reserve:"13:15 3명 예약 권장",
    url:"https://raadhuus-kafeen.dk/",
    map:"https://www.google.com/maps/search/?api=1&query=Raadhuus+Kafeen+Sonder+Alle+3+Aarhus",
    lat:56.15323,lng:10.2043,status:"추천"
  },
  {
    id:"food-d9-dinner",day:9,meal:"석식",time:"20:05~21:30",city:"에스비에르·Torvet",
    name:"Dronning Louise",
    address:"Torvet 19, 6700 Esbjerg, Denmark",
    cuisine:"덴마크·스칸디나비아·펍",menu:"저녁 식사·그릴·펍 메뉴",price:"DKK 180~350/인",
    fit:"Aarhus에서 Esbjerg로 복귀한 뒤 Hotel Britannia 인근에서 늦은 저녁.",
    hours:"목요일 10:00~24:00",reserve:"열차 지연 고려해 유연하게 이용",
    url:"https://dr-louise.dk/",
    map:"https://www.google.com/maps/search/?api=1&query=Dronning+Louise+Torvet+19+Esbjerg",
    lat:55.46647,lng:8.45259,status:"추천"
  },
  {
    id:"food-d9-alt",day:9,meal:"중식 대안",time:"11:00~16:00",city:"에스비에르",
    name:"Café Danmark",
    address:"Vesterhavsgade 37, 6700 Esbjerg, Denmark",
    cuisine:"덴마크 전통식",menu:"smørrebrød·stjerneskud·plaice",price:"DKK 150~300/인",
    fit:"BWS 일정이 바뀌어 Esbjerg에서 점심을 먹게 될 때의 대안. 현재 Aarhus행 확정 동선에서는 사용하지 않음.",
    hours:"평일 점심 영업 · 당일 재확인",reserve:"예약 권장",
    url:"https://cafe-danmark.dk/",
    map:"https://www.google.com/maps/search/?api=1&query=Cafe+Danmark+Vesterhavsgade+37+Esbjerg",
    lat:55.46873,lng:8.43743,status:"대안"
  },
  {
    id:"food-d10-lunch",day:10,meal:"중식",time:"11:30~12:15",city:"에스비에르공항",
    name:"Esbjerg Airport Café",
    address:"John Tranums Vej 20, 6705 Esbjerg, Denmark",
    cuisine:"공항 카페·덴마크식",menu:"오늘의 요리·샐러드·따뜻한 샌드위치·버거",price:"공항 현장가",
    fit:"13:15 LM058 탑승 전 공항 안에서 해결하는 가장 안전한 중식. 도심 식당 우회 불필요.",
    hours:"월~금 06:00~15:00 (2026-06-16부터 적용 안내)",reserve:"예약 불필요",
    url:"https://esbjergairport.dk/en/the-airport/food-and-drinks/",
    map:"https://www.google.com/maps/search/?api=1&query=Esbjerg+Airport+John+Tranums+Vej+20",
    lat:55.5259,lng:8.5534,status:"추천"
  },
  {
    id:"food-d10-transfer",day:10,meal:"환승 간식 대안",time:"14:00~16:00",city:"애버딘공항",
    name:"The Distilling House · Aberdeen Airport",
    address:"Airside, Aberdeen International Airport, Dyce, Aberdeen AB21 7DU, United Kingdom",
    cuisine:"스코틀랜드·영국식 공항 레스토랑",menu:"fish supper·pizza·burger·all-day breakfast",price:"GBP 공항 현장가",
    fit:"ABZ 환승시간에 허기질 때만 이용. 공식 안내상 보안검색 후 매장.",
    hours:"첫 항공편~마지막 항공편",reserve:"환승시간 우선",
    url:"https://www.aberdeenairport.com/shopping-and-eating/restaurants-and-bars/the-distilling-house/",
    map:"https://www.google.com/maps/search/?api=1&query=The+Distilling+House+Aberdeen+Airport",
    lat:57.20083,lng:-2.20376,status:"대안"
  }
];

export function restaurantsForDay(day){
  const value=Number(day);
  return Number.isFinite(value)&&value>0 ? RESTAURANT_GUIDE.filter(item=>item.day===value) : RESTAURANT_GUIDE.slice();
}

export function restaurantMapUrl(item){
  if(item?.map)return item.map;
  const query=encodeURIComponent(`${item?.name||""} ${item?.address||""}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
