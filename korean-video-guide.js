// Korean-language travel study sources for FINAL_0830_V4.
// Checked 2026-08-31 KST. Direct links are used only when verified; otherwise official VOD/search is labeled explicitly.

export const KOREAN_VIDEO_CHECKED_AT = "2026-08-31";
export const KOREAN_VIDEO_NOTE = "세계테마기행(EBS)·걸어서 세계속으로(KBS)을 최우선으로 정리했습니다. 공식 YouTube 직링크를 확인한 영상은 직접 연결하고, 회차는 확인되지만 YouTube 직링크를 확인하지 못한 경우 공식 VOD 또는 공식채널 검색 링크라고 명시했습니다.";

const v=(source,type,title,url,moments=[],note="")=>({source,type,title,url,moments,note});

const TAIWAN = [
  v("EBS 세계테마기행","공식 YouTube · 합본","남녀노소 대만족하는 대만 기행?! | 대만 여행, 대만족입니다","https://www.youtube.com/watch?v=5_iIhRsywhU",["28:12~57:33 뜨겁게 달콤하게, 타이중","타이중역·구도심·대만 중부 생활문화"],"이번 출장에서 타이중을 직접 다루는 한국어 방송영상 중 최우선. 2026년 EBS 공식 업로드."),
  v("KBS 걸어서 세계속으로","공식 KBS 회차/VOD","941회 3색 3미 타이완 맛 기행 · 2026-06-27","https://mylovekbs.kbs.co.kr/index.html?contents_id=70000000403727&sname=mylovekbs&source=mylovekbs&stype=magazine",["타이중 제2시장","창화 해안 전통 어업","난터우"],"최종 출장동선의 타이중·창화를 모두 포함하는 최신 KBS 회차. 공식 YouTube 직링크는 이번 확인에서 찾지 못해 KBS 공식 페이지로 연결."),
  v("KBS 걸어서 세계속으로","공식 VOD 목록","걸어서 세계속으로 공식 VOD · 941회 확인용","https://vod.kbs.co.kr/m/index.html?broadcast_complete_yn=N&local_station_code=00&program_code=T2005-0731&program_id=PS-2023229654-01-000&section_code=05&section_sub_code=04&sname=vod&source=episode&stype=vod",[],"KBS 공식 VOD에서 941회와 대만 관련 회차를 확인하는 링크."),
  v("KBS 걸어서 세계속으로","YouTube 전체 검색","KBS 걸어서 세계속으로 · 대만/타이중 관련 공식 영상 전체 검색","https://www.youtube.com/results?search_query=KBS+%EA%B1%B8%EC%96%B4%EC%84%9C+%EC%84%B8%EA%B3%84%EC%86%8D%EC%9C%BC%EB%A1%9C+%EB%8C%80%EB%A7%8C+%ED%83%80%EC%9D%B4%EC%A4%91",[],"직링크 누락 방지를 위한 검색 링크. 검색 결과에서 KBS여행/걸어서세계속으로 공식 채널을 우선."),
  v("EBS 세계테마기행","YouTube 전체 검색","EBS 세계테마기행 · 대만/타이중 관련 공식 영상 전체 검색","https://www.youtube.com/results?search_query=EBS+%EC%84%B8%EA%B3%84%ED%85%8C%EB%A7%88%EA%B8%B0%ED%96%89+%EB%8C%80%EB%A7%8C+%ED%83%80%EC%9D%B4%EC%A4%91",[],"EBS Documentary 공식 업로드의 대만·타이중 관련 영상 전체 탐색용.")
];

const NETHERLANDS = [
  v("KBS 걸어서 세계속으로","공식 YouTube · 2회 합본","네덜란드 여행 · 걸세나라모음zip","https://www.youtube.com/watch?v=d9XuuBd9-yc",["00:00:00 349회 전통이 살아 숨 쉬는 운하의 나라 - 네덜란드","00:48:30 297회 신이 만든 바다, 사람이 만든 땅, 네덜란드"],"운하·간척·도시·생활을 한 번에 보기 좋은 KBS 공식 합본."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 최신 전체편","네덜란드 여행 [걸어서세계속으로] KBS 251223 방송","https://www.youtube.com/watch?v=SA-xxybVNk8",[],"최근 제작된 네덜란드 전체편."),
  v("KBS 걸어서 세계속으로","공식 YouTube 재생목록","349회 네덜란드 공식 클립 전체 재생목록","https://www.youtube.com/playlist?list=PLrYSKNtvf1YHALmUaZfceW_2KwjHyrOnp",["운하 크루즈","Prinsengracht","Museumplein·Rijksmuseum 등"],"349회에서 분리된 공식 클립들을 한 번에 보는 재생목록."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","암스테르담 담 광장","https://www.youtube.com/watch?v=6OkXLNM4K9U",[],"Day 4 도심 산책과 직접 겹치는 KBS 클립."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","암스테르담 암스텔 강","https://www.youtube.com/watch?v=QUwJJRI8qJw",[],"운하도시 구조를 미리 이해하기 좋은 KBS 클립."),
  v("EBS 세계테마기행","공식 YouTube · 암스테르담","이래 봬도 합법 주택! 네덜란드 암스테르담 수상가옥","https://www.youtube.com/watch?v=A2nYvQDuHaI",[],"암스테르담의 물·운하 중심 도시생활을 설명하는 EBS 공식 영상."),
  v("EBS 세계테마기행","공식 YouTube · 네덜란드","국경이 집 안을 가르는 네덜란드 바를러","https://www.youtube.com/watch?v=Oz41oGmsmhA",[],"출장지와 직접 겹치지는 않지만 네덜란드의 국경·지역문화 이해용."),
  v("KBS 걸어서 세계속으로","YouTube 전체 검색","KBS 걸어서 세계속으로 · 네덜란드/암스테르담 공식 영상 전체 검색","https://www.youtube.com/results?search_query=KBS+%EA%B1%B8%EC%96%B4%EC%84%9C+%EC%84%B8%EA%B3%84%EC%86%8D%EC%9C%BC%EB%A1%9C+%EB%84%A4%EB%8D%9C%EB%9E%80%EB%93%9C+%EC%95%94%EC%8A%A4%ED%85%8C%EB%A5%B4%EB%8B%B4",[],"KBS 공식 채널에서 추가 클립을 빠짐없이 찾기 위한 검색 링크."),
  v("EBS 세계테마기행","YouTube 전체 검색","EBS 세계테마기행 · 네덜란드/암스테르담 공식 영상 전체 검색","https://www.youtube.com/results?search_query=EBS+%EC%84%B8%EA%B3%84%ED%85%8C%EB%A7%88%EA%B8%B0%ED%96%89+%EB%84%A4%EB%8D%9C%EB%9E%80%EB%93%9C+%EC%95%94%EC%8A%A4%ED%85%8C%EB%A5%B4%EB%8B%B4",[],"EBS Documentary 공식 업로드 추가 탐색용.")
];

const HAMBURG = [
  v("KBS 걸어서 세계속으로","공식 YouTube 재생목록","226회 함부르크 공식 클립 전체 재생목록","https://www.youtube.com/playlist?list=PLrYSKNtvf1YEXyVV1v05gs_RABEojZWo4",["함부르크항","Speicherstadt","피시마켓","구 엘베터널","시청","브람스","성 미카엘 교회 등 13개 클립"],"출장 업무동선인 항만·Speicherstadt·HafenCity를 포함해 함부르크 관련 KBS 클립을 가장 폭넓게 묶은 링크."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","유람선 타고 구경하는 함부르크 항","https://www.youtube.com/watch?v=UUc9b5W3Yrg",[],"항만도시 구조와 물류도시 이미지를 미리 보기 좋음."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","함부르크 슈파이허슈타트 Speicherstadt","https://www.youtube.com/watch?v=RiX_nl9BfD0",[],"DNV Brooktorkai와 바로 이어지는 권역."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","함부르크 구 엘베터널","https://www.youtube.com/watch?v=yc3z3G6WzUE",[],"항만과 도심 연결의 역사적 인프라 이해용."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","함부르크 시청 Rathaus","https://www.youtube.com/watch?v=9uGIoWRyjQo",[],"OWC Alter Wall 인근 도심권과 직접 겹침."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","브람스 박물관과 Peterstraße","https://www.youtube.com/watch?v=upBP43p1O8E",[],"업무 후 구도심 이해용."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 전체편","독일 여행 [걸어서세계속으로] KBS 251101 방송","https://www.youtube.com/watch?v=PxRNJ3Lg7SY",[],"최신 독일 여행 전체편 중 하나."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 전체편","독일 여행 [걸어서 세계속으로] KBS 241204 방송","https://www.youtube.com/watch?v=AOpAHFr4vNI",[],"독일의 지역문화·도시 이해용."),
  v("EBS 세계테마기행","공식 YouTube · 함부르크/북해","흔치 않은 독일 항구 도시 근처 섬 둘러보기 · 함부르크와 북해","https://www.youtube.com/watch?v=P64Fftq4Msw",["함부르크 한자동맹 항구도시","Speicherstadt","Altona Fischmarkt","북해 섬"],"함부르크와 북해 해양문화가 같이 나와 이번 출장 주제와 특히 잘 맞음."),
  v("KBS 걸어서 세계속으로","YouTube 전체 검색","KBS 걸어서 세계속으로 · 함부르크/독일 공식 영상 전체 검색","https://www.youtube.com/results?search_query=KBS+%EA%B1%B8%EC%96%B4%EC%84%9C+%EC%84%B8%EA%B3%84%EC%86%8D%EC%9C%BC%EB%A1%9C+%ED%95%A8%EB%B6%80%EB%A5%B4%ED%81%AC+%EB%8F%85%EC%9D%BC",[],"KBS 공식 추가 클립 누락 방지용."),
  v("EBS 세계테마기행","YouTube 전체 검색","EBS 세계테마기행 · 함부르크/독일 공식 영상 전체 검색","https://www.youtube.com/results?search_query=EBS+%EC%84%B8%EA%B3%84%ED%85%8C%EB%A7%88%EA%B8%B0%ED%96%89+%ED%95%A8%EB%B6%80%EB%A5%B4%ED%81%AC+%EB%8F%85%EC%9D%BC",[],"EBS Documentary 공식 추가 영상 탐색용.")
];

const DENMARK = [
  v("KBS 걸어서 세계속으로","공식 YouTube 재생목록","41회 덴마크 코펜하겐 공식 클립 전체 재생목록","https://www.youtube.com/playlist?list=PLrYSKNtvf1YE5Xi7s0BNxbgov0tROKDvM",["코펜하겐 시청","아말리엔보르","크리스티안보르","프레데릭스보르","크론보르","안데르센·인어공주","오덴세","스카겐","레고랜드","로스킬레","디자인뮤지엄 등"],"Esbjerg/Aarhus 직접편은 아니지만 덴마크의 역사·디자인·왕실·해양문화 클립을 한 재생목록에서 전부 볼 수 있음."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","아말리엔보르 궁전 근위병 교대식","https://www.youtube.com/watch?v=EbZ8j65T6kk",[],"덴마크 왕실·국가문화 이해용."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","안데르센과 인어공주","https://www.youtube.com/watch?v=emLzAkd-pEY",[],"덴마크 문화 배경을 짧게 보기 좋음."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 클립","덴마크 디자인뮤지엄·아르네 야콥센","https://www.youtube.com/watch?v=aVtZ2OTyXnQ",[],"덴마크의 기능주의·산업디자인 사고를 비즈니스 문화와 함께 이해하기 좋음."),
  v("EBS 세계테마기행","공식 YouTube · 덴마크","고생한 나를 위해 랜선 여행, 도착지는 덴마크","https://www.youtube.com/watch?v=zVwkglFGgrE",["페로 제도 중심"],"출장 동선과 직접 겹치진 않지만 북해권 덴마크 자연·해양 정체성 이해용."),
  v("KBS 걸어서 세계속으로","YouTube 전체 검색","KBS 걸어서 세계속으로 · 덴마크/에스비에르/오르후스 공식 영상 전체 검색","https://www.youtube.com/results?search_query=KBS+%EA%B1%B8%EC%96%B4%EC%84%9C+%EC%84%B8%EA%B3%84%EC%86%8D%EC%9C%BC%EB%A1%9C+%EB%8D%B4%EB%A7%88%ED%81%AC+%EC%97%90%EC%8A%A4%EB%B9%84%EC%97%90%EB%A5%B4+%EC%98%A4%EB%A5%B4%ED%9B%84%EC%8A%A4",[],"도시명이 직접 들어간 추가 공식 클립 탐색용."),
  v("EBS 세계테마기행","YouTube 전체 검색","EBS 세계테마기행 · 덴마크 공식 영상 전체 검색","https://www.youtube.com/results?search_query=EBS+%EC%84%B8%EA%B3%84%ED%85%8C%EB%A7%88%EA%B8%B0%ED%96%89+%EB%8D%B4%EB%A7%88%ED%81%AC",[],"세계테마기행 덴마크 관련 공식 업로드 전체 탐색용.")
];

const SCOTLAND = [
  v("KBS 걸어서 세계속으로","공식 YouTube · 최신 전체편","스코틀랜드 여행 [걸어서세계속으로] KBS 260217 방송","https://www.youtube.com/watch?v=5nzLvlKiibM",[],"애버딘은 환승만 하지만 스코틀랜드의 도시·역사·풍경을 한국어로 이해하기 좋은 최신편."),
  v("KBS 걸어서 세계속으로","공식 YouTube · 전체편","357회 자유를 꿈꾸는 바람의 나라 - 스코틀랜드","https://www.youtube.com/watch?v=brUzO0PGNkA",[],"스코틀랜드 정체성과 역사적 배경을 한 편으로 익히기 좋음."),
  v("EBS 세계테마기행","공식 YouTube · 스코틀랜드","판타스틱 유럽 - 매혹의 하일랜드를 걷다, 스코틀랜드 #003","https://www.youtube.com/watch?v=gXSIWcopjgg",["하일랜드","Loch Lomond","위스키","오크니"],"북해·스코틀랜드 자연 및 지역문화 이해용."),
  v("KBS 걸어서 세계속으로","YouTube 전체 검색","KBS 걸어서 세계속으로 · 스코틀랜드/애버딘 공식 영상 전체 검색","https://www.youtube.com/results?search_query=KBS+%EA%B1%B8%EC%96%B4%EC%84%9C+%EC%84%B8%EA%B3%84%EC%86%8D%EC%9C%BC%EB%A1%9C+%EC%8A%A4%EC%BD%94%ED%8B%80%EB%9E%9C%EB%93%9C+%EC%95%A0%EB%B2%84%EB%94%98",[],"애버딘 관련 추가 공식 클립 탐색용."),
  v("EBS 세계테마기행","YouTube 전체 검색","EBS 세계테마기행 · 스코틀랜드 공식 영상 전체 검색","https://www.youtube.com/results?search_query=EBS+%EC%84%B8%EA%B3%84%ED%85%8C%EB%A7%88%EA%B8%B0%ED%96%89+%EC%8A%A4%EC%BD%94%ED%8B%80%EB%9E%9C%EB%93%9C",[],"세계테마기행 스코틀랜드 관련 공식 업로드 전체 탐색용.")
];

export const KOREAN_VIDEO_BY_PLACE = {
  taichung: TAIWAN,
  amsterdam: NETHERLANDS,
  "den-helder": NETHERLANDS,
  hamburg: HAMBURG,
  esbjerg: DENMARK,
  aarhus: DENMARK,
  aberdeen: SCOTLAND,
};
