// FINAL_0830_V1 route weather + pre-trip study guide
// Weather snapshot checked 2026-08-31 KST. Extended forecasts are planning guidance only;
// re-check the operating weather service the night before and morning of each movement.

export const WEATHER_CHECKED_AT = "2026-08-31";

export const WEATHER_BY_DAY = {
  1: {
    area: "타이중",
    weather: "24~28℃ · 고온다습 · 강한 비/폭우 가능",
    outfit: "반팔 + 통풍 좋은 긴바지 · 초경량 우비/접이식 우산 · 젖어도 빨리 마르는 운동화 · 냉방 대비 얇은 셔츠",
    source: "https://www.timeanddate.com/weather/taiwan/taichung/ext",
  },
  2: {
    area: "타이중·창화",
    weather: "24~31℃ · 덥고 습함 · 소나기/비 가능",
    outfit: "반팔 + 얇은 긴바지 · 우비/우산 · 빠른건조 신발 · 현장방문용 여벌 양말 · 실내 냉방용 얇은 겉옷",
    source: "https://www.timeanddate.com/weather/taiwan/taichung/ext",
  },
  3: {
    area: "타이중·타오위안",
    weather: "26~32℃ 안팎 · 대체로 흐림 · 여전히 무더움",
    outfit: "반팔 + 얇은 셔츠 · 긴바지 · 공항/기내에서 바로 걸칠 얇은 후디·가디건을 기내용 가방에",
    source: "https://www.timeanddate.com/weather/taiwan/taichung/ext",
  },
  4: {
    area: "암스테르담",
    weather: "15~18℃ · 흐림 · 약한 비/이슬비 가능",
    outfit: "긴팔 또는 셔츠 + 얇은 니트 · 긴바지 · 방수 바람막이 · 방수 운동화",
    source: "https://www.timeanddate.com/weather/netherlands/amsterdam/ext",
  },
  5: {
    area: "암스테르담",
    weather: "14~18℃ · 비/소나기 가능",
    outfit: "긴팔 + 얇은 니트/가디건 + 방수 셸 · 긴바지 · 작은 우산보다 후드 있는 방수재킷 우선",
    source: "https://www.timeanddate.com/weather/netherlands/amsterdam/ext",
  },
  6: {
    area: "암스테르담·덴헬더·함부르크",
    weather: "13~21℃ · 북해 연안 바람 · 이슬비/소나기 가능",
    outfit: "셔츠/긴팔 + 얇은 니트 또는 플리스 + 방풍·방수 셸 · 긴바지 · 방수 운동화. 덴헬더 해풍 때문에 체감온도 낮게 대비",
    source: "https://www.timeanddate.com/weather/netherlands/den-helder/ext",
  },
  7: {
    area: "함부르크",
    weather: "13~17℃ 안팎 · 흐림 · 이슬비 가능",
    outfit: "업무용 셔츠/블라우스 + 얇은 니트 또는 재킷 · 긴바지 · 트렌치/방수 바람막이",
    source: "https://www.timeanddate.com/weather/germany/hamburg/ext",
  },
  8: {
    area: "함부르크→에스비에르",
    weather: "10~17℃ · 흐림/소나기 가능 · 덴마크 도착 후 바람 증가",
    outfit: "얇은 니트 + 방풍·방수 재킷 · 긴바지 · 방수 운동화. 열차 안에서는 겉옷을 쉽게 벗는 레이어링",
    source: "https://www.timeanddate.com/weather/denmark/esbjerg/ext",
  },
  9: {
    area: "에스비에르·오르후스",
    weather: "11~19℃ · 바람 강함 · 늦은 소나기/천둥 가능",
    outfit: "긴팔 + 얇은 니트 · 후드형 방풍·방수 셸 필수 · 긴바지 · 우산보다 레인재킷 우선",
    source: "https://www.timeanddate.com/weather/denmark/esbjerg/ext",
  },
  10: {
    area: "에스비에르·애버딘",
    weather: "10~17℃ · 비 가능, 애버딘은 10~14℃ 안팎으로 더 서늘",
    outfit: "긴팔 + 니트/플리스 + 방수 셸 · 긴바지 · 방수 운동화 · 장거리 기내에서 쓸 얇은 보온 겉옷",
    source: "https://www.timeanddate.com/weather/uk/aberdeen/ext",
  },
  11: {
    area: "인천",
    weather: "22~28℃ 안팎 · 현재는 비교적 따뜻한 귀국일 예보",
    outfit: "유럽 레이어를 벗기 쉽게 입고 기내에서 반팔을 안쪽에 착용 · 한국 도착 후 겉옷은 가방에",
    source: "https://www.timeanddate.com/weather/south-korea/incheon/ext",
  },
};

export function weatherForDay(dayId) {
  return WEATHER_BY_DAY[Number(dayId)] || null;
}

const yt = (url, title, moments, note = "") => ({ url, title, moments, note });
const screen = (title, type, scene, timing, url, note = "") => ({ title, type, scene, timing, url, note });
const book = (title, author, genre, reason, url, priority = "추천") => ({ title, author, genre, reason, url, priority });

export const STUDY_PLACES = [
  {
    id: "taichung",
    days: "Day 1~3 · 9/2~9/4",
    place: "타이중 · 우치/타이중항 · 창화",
    routeMatch: "CHECK Inn Taichung LaiLai(三民路/Sanmin Rd) · TIPC/Port of Taichung · OEG Taichung · OEG Changhua",
    why: "대만 해상풍력의 항만·O&M 현장을 보는 구간. 숙소가 Sanmin Road에 있어 타이중 도심 영상의 Sanmin Road 구간이 실제 체감에 특히 유용합니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=LATfIIqLyqI&t=2055s",
        "Taichung, Taiwan - Walk through Downtown Taichung",
        ["00:00 Taichung Station", "13:11 Green River waterfront", "24:26 Taichung Shiyakusho", "34:15 Sanmin Road(숙소 도로)", "57:17 Liuchuan Riverside"],
        "숙소 주변 도심 감각을 익히기 가장 좋은 영상."
      ),
      yt(
        "https://www.youtube.com/watch?v=dSj8NIBBlk8",
        "A Day at the Port of Taichung · TIPC 공식",
        ["00:00부터 전편: 컨테이너·선박·대형 풍력터빈 부품 물류"],
        "TIPC가 제작한 항만 업무 영상이라 출장 목적과 직접 연결됩니다."
      ),
    ],
    screen: [
      screen(
        "The Pig, the Snake and the Pigeon / 周處除三害 (2023)",
        "범죄·스릴러 영화",
        "타이중 Green River와 Jingming 상권, Hongkie를 추적하는 미용실 세트 등에서 촬영.",
        "정확한 분 단위는 공개 로케이션 자료에 없어 미기재(판본별 검증 필요)",
        "https://filmtaichung.org.tw/en/crewsContent/199",
        "출장 전 분위기 공부용으로 대만 구간 최우선 추천."
      ),
      screen(
        "Inference Notes / 推理筆記",
        "추리 영화",
        "Taichung Shiyakusho와 옛 Taichung City Hall에서 촬영. 위 도보영상 24:26에 Shiyakusho가 나옵니다.",
        "영화 내 정확한 분 단위 공개자료 미확인",
        "https://www.taichung.gov.tw/media/433652/%E4%BE%86%E5%8E%BB%E6%8B%8D%E5%8F%B0%E4%B8%AD-%E7%AC%AC%E5%8D%81%E4%B8%80%E5%96%AE%E5%85%83%E8%87%B3%E9%99%84%E9%8C%84.pdf"
      ),
      screen(
        "It Takes Two to Tango / Ciong Zo / Packages from Daddy",
        "영화",
        "공식 Taichung 촬영지 자료가 Port of Taichung을 촬영지로 명시.",
        "개별 작품의 항만 장면 분 단위 공개자료 미확인",
        "https://www.taichung.gov.tw/media/433652/%E4%BE%86%E5%8E%BB%E6%8B%8D%E5%8F%B0%E4%B8%AD-%E7%AC%AC%E5%8D%81%E4%B8%80%E5%96%AE%E5%85%83%E8%87%B3%E9%99%84%E9%8C%84.pdf"
      ),
    ],
    books: [],
    gap: "타이중·창화를 직접 무대로 삼고 한국어/영어로 접근하기 쉬운 수사·추리소설은 이번 조사에서 신뢰도 높게 확인하지 못했습니다. 대신 《周處除三害》와 《推理筆記》를 우선 추천합니다. OEG 사무실·창화 facility는 업무시설이라 여행영상/영상물 로케이션 자료가 거의 없습니다.",
  },
  {
    id: "amsterdam",
    days: "Day 4~6 · 9/5~9/7",
    place: "암스테르담 · Sloterdijk",
    routeMatch: "Schiphol · Amsterdam Sloterdijk · Urban Lodge Hotel",
    why: "숙소는 관광 중심지보다 서쪽 Sloterdijk에 있지만, 출장 전 암스테르담의 운하·Centraal·Damrak 구조를 익혀두면 NS 이동과 도심 방향감각이 빨리 잡힙니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=WMgGVvzEMU0",
        "Amsterdam, Netherlands — Walking Tour 4K (2026)",
        ["00:00 Amsterdam Centraal", "01:30 Damrak", "06:15 Dam Square", "31:10 Amstel", "35:45 Magere Brug", "47:25 Anne Frank House"],
        "Centraal 도착 후 도심의 방향을 미리 익히기 좋습니다. Sloterdijk 자체는 이 영상에 나오지 않습니다."
      ),
    ],
    screen: [
      screen(
        "Amsterdamned (1988)",
        "수사·공포·스릴러 영화",
        "오프닝이 살인범 시점으로 Amsterdam 운하를 잠수하며 시작하고 Victoria Hotel/Damrak·Centraal 인근이 보임. 이후 유명한 운하 스피드보트 추격전.",
        "오프닝 직후(정확 분은 판본별 상이) · 스피드보트 추격 장면은 후반부이나 정확 분 공개자료 미확인",
        "https://www.reelstreets.com/films/amsterdamned/",
        "도시 자체를 범죄영화의 주인공처럼 보여줘 여행 전 감상작으로 강력 추천."
      ),
    ],
    books: [
      book(
        "Murder in Amsterdam",
        "A.C. Baantjer",
        "경찰추리·미스터리",
        "실제 암스테르담 경찰 출신 작가의 Inspector DeKok물. 홍등가·도심과 Warmoesstraat 경찰서 주변의 도시 감각을 익히기 좋음.",
        "https://www.publishersweekly.com/9781881164005",
        "최우선"
      ),
      book(
        "DeKok and the Kiss of Death",
        "A.C. Baantjer / Peter Römer",
        "경찰수사·범죄",
        "Amsterdam Detective 시리즈. Warmoes Street 경찰서를 축으로 돈세탁·암스테르담 범죄세계가 얽힘.",
        "https://www.uitgeverijdefontein.nl/boek/dekok-and-the-kiss-of-death/"
      ),
    ],
    gap: "Urban Lodge Hotel/Sloterdijk 자체가 유명 영화 로케이션인지는 신뢰도 높은 자료를 확인하지 못했습니다.",
  },
  {
    id: "den-helder",
    days: "Day 6 · 9/7",
    place: "Den Helder",
    routeMatch: "Den Helder Station · OEG Subsea BV, Koperslagersweg 2",
    why: "관광보다 OEG Subsea facility가 목적이지만, 북해 군항·해안도시의 규모와 바람 많은 분위기를 먼저 보면 현장 감각이 잡힙니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=JF3nBf2wBg4",
        "A Visit to Den Helder - Vanlife - 4K - Documentary",
        ["00:17 Den Helder 도착/도시", "02:16 Julianadorp·Callantsoog·Lange Jaap", "07:15 마무리"],
        "짧아서 출국 전 보기 좋습니다."
      ),
      yt(
        "https://www.youtube.com/watch?v=xsTs0TVUoww",
        "Den Helder 4K drone",
        ["전편: Den Helder·Texel·Water Tower·Lange Jaap·해안"],
        "챕터는 없지만 항공뷰로 지형 파악에 유용."
      ),
    ],
    screen: [
      screen(
        "Den Helder (2008)",
        "네덜란드 TV 영화 · 39분",
        "Den Helder에서 촬영. Café Danszing Skihut Odeklonje(당시 Koningstraat 15/17)의 디스코텍 장면이 로케이션으로 확인됨.",
        "디스코텍 장면 정확 분 공개자료 미확인",
        "https://www.imdb.com/title/tt1292215/"
      ),
    ],
    books: [],
    gap: "OEG Subsea BV를 직접 다룬 여행 유튜브나 Den Helder를 대표하는 영어권 수사소설은 이번 조사에서 신뢰도 높게 확인하지 못했습니다.",
  },
  {
    id: "hamburg",
    days: "Day 6~8 · 9/7~9/9",
    place: "함부르크 · St. Georg · Altstadt · HafenCity/Speicherstadt",
    routeMatch: "Hamburg Airport · Hamburg Hbf · Best Western St. Raphael · OWC Alter Wall · DNV Brooktorkai · Skyborn Ericusspitze",
    why: "이번 출장에서 여행공부 효율이 가장 높은 도시. 실제 업무 주소가 영화·소설의 함부르크 범죄 동선과 겹칩니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=weMsGP-bBgE",
        "HAMBURG, Germany - 4K HDR walking tour with captions",
        ["01:00 Hamburg Hauptbahnhof(숙소 도보권)", "13:37 Rathausmarkt", "23:51 Alsterarkaden", "43:42 Deichstraße", "47:11 Kehrwiedersteg/Speicherstadt", "51:33 Am Kaiserkai", "54:39 Am Sandtorkai", "1:09:31 Landungsbrücken"],
        "OWC(Alter Wall), DNV(Brooktorkai), Skyborn(HafenCity), Hbf/숙소 권역을 한 영상에서 가장 잘 연결합니다."
      ),
      yt(
        "https://www.youtube.com/watch?v=4s2HmU9DWlI",
        "Hamburg, Germany Walking Tour 4K - With Captions",
        ["00:36 Hamburg Train Station", "17:48 Hamburg City Hall", "1:20:27 Historic Warehouse District", "1:25:08 HafenCity", "1:37:36 Elbphilharmonie"],
        "첫 영상보다 긴 버전."
      ),
    ],
    screen: [
      screen(
        "A Most Wanted Man (2014)",
        "첩보·스릴러 영화",
        "Hamburg Hbf, Steindamm/St. Georg, Landungsbrücken, Brook/Speicherstadt, Brooktorkai, HafenCity 등에서 촬영. Brooktorkai는 Karpov의 은신처 장면으로 알려져 있고, 숙소가 있는 St. Georg도 촬영지.",
        "작품 전체에 Hamburg가 지속 등장 · 개별 장면의 정확 분 단위는 판본별 공개자료 미확인",
        "https://moviemaps.org/movies/1u3",
        "출장 동선과 가장 많이 겹치는 영화."
      ),
    ],
    books: [
      book(
        "A Most Wanted Man",
        "John le Carré",
        "첩보·스릴러",
        "함부르크를 무대로 불법입국자, 정보기관, 은행가·변호사가 얽히는 스파이 스릴러. 영화 촬영지도 실제 출장권역과 겹쳐 ‘검은 선’처럼 여행 전 분위기를 만드는 책으로 가장 적합.",
        "https://www.filmtourismus.de/a-most-wanted-man/",
        "최우선"
      ),
      book(
        "Blood Eagle",
        "Craig Russell",
        "연쇄살인·경찰수사·스릴러",
        "Hamburg 형사 Jan Fabel 시리즈 1권. 의식살인·조직범죄·도시의 항만/이민자/역사적 그림자를 깊게 사용함.",
        "https://www.penguin.co.uk/books/352194/blood-eagle-by-craig-russell/9780099472582",
        "최우선"
      ),
    ],
    gap: "회사 사무실 내부 자체가 작품에 나온 것은 아니며, 같은 거리·권역이 겹치는 경우만 표시했습니다.",
  },
  {
    id: "esbjerg",
    days: "Day 8~10 · 9/9~9/11",
    place: "에스비에르 · Port of Esbjerg",
    routeMatch: "Esbjerg Station · Hotel Britannia · Blue Water Shipping · Port Tour · Esbjerg Airport",
    why: "해상풍력 물류도시 자체가 출장 목적이므로 일반 관광영상보다 항만·풍력터빈 물류 자료가 우선입니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=WCAKM2bivqo",
        "Port of Esbjerg - Presentation",
        ["00:00부터 전편: Port of Esbjerg 소개"],
        "항만 벤치마킹 전 필수."
      ),
      yt(
        "https://www.youtube.com/watch?v=zy7vUppYPC8&t=711s",
        "DW Documentary · renewables / Esbjerg wind hub",
        ["약 11:51 Esbjerg의 유럽 풍력터빈 해상운송 허브 설명"],
        "풍력 물류 맥락을 짧게 복습하기 좋음."
      ),
    ],
    screen: [
      screen(
        "Special Unit - The First Murder / Rejseholdet: Det første mord (2025)",
        "경찰수사·살인미스터리 영화",
        "1927년, Esbjerg의 불탄 여름별장에서 시신이 발견되며 신설 특별수사대가 지역 엘리트의 권력·부패를 파헤침.",
        "사건의 출발점이 Esbjerg · 정확 분 단위 공개자료 미확인",
        "https://www.dfi.dk/en/viden-om-film/filmdatabasen/film/128229",
        "에스비에르 구간의 분위기 공부용으로 가장 직접적인 범죄물."
      ),
    ],
    books: [],
    gap: "Esbjerg를 중심으로 한 접근성 좋은 대표 영어권 추리소설은 이번 조사에서 확실하게 확인하지 못했습니다. 대신 위 2025년 수사영화를 추천합니다.",
  },
  {
    id: "aarhus",
    days: "Day 9 · 9/10",
    place: "오르후스 · Aarhus H",
    routeMatch: "Aarhus H · Banegårdspladsen 4(OWC Denmark) · 역 주변",
    why: "OWC 사무실이 Aarhus H 바로 앞이라 역·Bruuns Galleri·Ryesgade·Åboulevarden을 미리 보면 15:00 미팅 전 동선과 도시감이 바로 잡힙니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=TvKq2_aGo2U&t=2745s",
        "Aarhus Denmark walking tour",
        ["45:45 Bruuns Galleri(Aarhus H 인접)", "50:42 Ryesgade", "57:34 Salling", "1:05:30 Åboulevarden", "1:09:09 Salling Rooftop"],
        "OWC Banegårdspladsen 4의 주변 도시동선을 보기 좋음."
      ),
    ],
    screen: [
      screen(
        "Dicte / Dicte: Crime Reporter",
        "범죄·수사 TV 시리즈",
        "Aarhus 현지 촬영. S1E1에서 임신한 여성이 Aarhus Harbour의 Mellemarmen/Kornpier에서 살해된 채 발견됨. 같은 S1E1에서 Rose가 Mølleparken에서 남자친구의 전 여자친구를 만나는 장면도 촬영.",
        "S1E1 초반부(시신 발견) / S1E1 Mølleparken 장면 · 스트리밍 판본별 정확 분은 공개자료 미확인",
        "https://www.visitaarhus.com/aarhus/see-and-do/dictes-aarhus/walking-dictes-footsteps",
        "출장 전 Aarhus 범죄물로 최우선."
      ),
    ],
    books: [
      book(
        "Personal Damage / Personskade (Dicte series)",
        "Elsebeth Egholm",
        "범죄·수사·미스터리",
        "TV 《Dicte》의 출발점이 된 범죄소설. Aarhus Harbour 살인사건과 도시를 연결해서 읽을 수 있어 현지 체감이 가장 좋음.",
        "https://www.visitaarhus.com/aarhus/see-and-do/dictes-aarhus/walking-dictes-footsteps",
        "최우선"
      ),
    ],
    gap: "OWC 사무실 자체가 드라마 로케이션인 것은 아니고, Aarhus H/도심권과 범죄물의 주요 로케이션이 매우 가깝습니다.",
  },
  {
    id: "aberdeen",
    days: "Day 10 · 9/11 환승",
    place: "애버딘",
    routeMatch: "Aberdeen Airport(ABZ) 환승",
    why: "실제 일정은 공항 환승이라 시내관광은 없지만, 북해 석유·가스·해상산업 도시의 분위기를 미리 보는 보너스 학습 구간입니다.",
    youtube: [
      yt(
        "https://www.youtube.com/watch?v=-tT0oBS7_BY&t=2582s",
        "ABERDEEN | 4K Narrated Walking Tour",
        ["06:01 Marischal College", "08:25 Provost Skene's House", "40:13 Aberdeen Railway Station", "43:02 Aberdeen Harbour", "45:10 Maritime Museum"],
        "환승 중 시내를 나갈 일정은 없으므로 영상으로 분위기만 익히는 용도."
      ),
    ],
    screen: [
      screen(
        "Granite Harbour",
        "BBC 경찰수사 드라마",
        "Aberdeen을 배경으로 한 police procedural. Castlegate, Marischal Square/Provost Skene's House, Globe Inn 등 실제 도심 로케이션이 시리즈 전반에 반복 등장.",
        "여러 에피소드에 반복 등장 · 각 장면 정확 분은 BBC 판본별 공개자료 미확인",
        "https://visitabdn.com/blog/discover-the-filming-locations-of-granite-harbour",
        "애버딘을 범죄도시 배경으로 이해하기 좋음."
      ),
    ],
    books: [
      book(
        "Cold Granite",
        "Stuart MacBride",
        "Tartan Noir · 경찰수사·연쇄살인",
        "DS Logan McRae 시리즈 1권. Aberdeen Harbour·경찰·Marischal Street 등 실제 Granite City를 배경으로 연쇄살인 수사를 전개.",
        "https://stuartmacbride.com/cold-granite/",
        "최우선"
      ),
    ],
    gap: "ABZ 공항 자체가 작품의 핵심 로케이션이라는 근거는 확인하지 못했습니다. 시내는 일정에 포함하지 않습니다.",
  },
];

export const STUDY_NOTE = "영상 타임스탬프는 업로더가 제공한 챕터 또는 검색으로 확인 가능한 시각을 사용했습니다. 영화·드라마의 분 단위는 배급/스트리밍 판본마다 달라질 수 있어 신뢰도 높은 공개자료가 없으면 임의로 숫자를 만들지 않고 장면·회차까지만 표기했습니다.";
