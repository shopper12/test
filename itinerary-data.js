export const APP_VERSION = "FINAL_0830_V1";
export const DEFAULT_ITINERARY = "final_0830";

const SOURCE_PLAN = "2026_해외_해상풍력_벤치마킹_통합일정표_0830_교통편반영.docx";

const e=(id,day_id,time_start,time_end,title,category,location,transport,duration,extras={})=>({
  id,day_id,time_start,time_end,title,category,location,transport,duration,
  original_currency:null,original_min:null,original_max:null,min_cost_krw:null,max_cost_krw:null,cost_basis:null,
  booking_url:null,official_url:null,map_url:null,notes:null,
  sort_order:(Number(String(id).split("-").pop())||0)*10,updated_at:new Date().toISOString(),...extras,
});

const meta={
  title:"2026 해외 해상풍력 선진사례 벤치마킹 통합 일정표",
  dates:"2026.09.02–09.12",
  route:"인천 → 타이중·창화 → 타오위안 → 암스테르담·덴헬더 → 함부르크 → 에스비에르·오르후스 → 애버딘 → 암스테르담 → 인천",
  travelers:3,hotelNights:8,flightNights:2,noHotelStopovers:0,durationText:"11일",lodgingNote:"호텔 8박·기내 2박",
  budgetNote:"최종 일정표에는 예산 미기재",lastVerified:"2026-08-30-final",sourcePlan:SOURCE_PLAN,includesAwtec:false,flightCount:6,
  businessLocationRule:"0830 최종 일정표의 방문기관·장소를 기준으로 함",
  tabLabel:"최종본 · 0830 교통편 반영",tabNote:"대만 → 네덜란드 → 독일 → 덴마크 · 3명",
  subtitle:"2026. 9. 2.(수) ~ 9. 12.(토) · 0830 최종 일정표 기준 · 발권/숙소/기관방문 상태 반영",
  taiwanWindow:"9/2 09:40–9/4 23:10",taiwanDuration:"약 2일 13시간",
  budgetMin:null,budgetMax:null,recommendation:"0830 최종 일정표를 그대로 기준안으로 사용",
};

const days=[
{id:1,date:"2026-09-02",weekday:"수요일",cities:"인천 → 타이중",lodging:"CHECK Inn Taichung LaiLai",summary:"07:55 LJ0735 출국 · 호텔 짐 보관 · 오후 TIPC 미팅/항만 견학 · 16:00 이후 체크인"},
{id:2,date:"2026-09-03",weekday:"목요일",cities:"타이중 · 창화",lodging:"CHECK Inn Taichung LaiLai",summary:"OEG Taichung Office 방문 · OEG Changhua facility 현장실사 · OEG Taiwan 석식 간담회"},
{id:3,date:"2026-09-04",weekday:"금요일",cities:"타이중 → 타오위안 → 암스테르담",lodging:"기내박",summary:"~11:00 체크아웃 · 16:00 전후 공항 이동 · 23:10 CI0073 TPE→AMS 발권 완료"},
{id:4,date:"2026-09-05",weekday:"토요일",cities:"암스테르담",lodging:"Urban Lodge Hotel",summary:"07:40 AMS 도착 · Sloterdijk 경유 Urban Lodge Hotel 이동/짐 보관 · 14:00 이후 체크인"},
{id:5,date:"2026-09-06",weekday:"일요일",cities:"암스테르담",lodging:"Urban Lodge Hotel",summary:"OEG Subsea 미팅 준비 · Den Helder 이동 및 OVpay/NS 동선 사전확인"},
{id:6,date:"2026-09-07",weekday:"월요일",cities:"암스테르담 · 덴헬더 → 함부르크",lodging:"Best Western Plus Hotel St. Raphael",summary:"이른 오전 Den Helder 이동 · 09:00~12:30 OEG Subsea BV · 20:50 KL1759 AMS→HAM · 호텔 체크인"},
{id:7,date:"2026-09-08",weekday:"화요일",cities:"함부르크",lodging:"Best Western Plus Hotel St. Raphael",summary:"10:00 OWC Hamburg 미팅 · 오후 DNV Hamburg 미팅 추진"},
{id:8,date:"2026-09-09",weekday:"수요일",cities:"함부르크 → 에스비에르",lodging:"Hotel Britannia",summary:"08:30~10:00 Skyborn 미팅 가정/조율 중 · 11시대 Hamburg Hbf 출발 · Kolding 환승 · 17:00 전후 Hotel Britannia"},
{id:9,date:"2026-09-10",weekday:"목요일",cities:"에스비에르 → 오르후스 → 에스비에르",lodging:"Hotel Britannia",summary:"오전 BWS 미팅/Port Tour · DSB로 Aarhus 이동 · 15:00 OWC Denmark 확정 미팅 · 미팅 후 Esbjerg 복귀"},
{id:10,date:"2026-09-11",weekday:"금요일",cities:"에스비에르 → 애버딘 → 암스테르담 → 인천",lodging:"기내박",summary:"~11:00 Hotel Britannia 체크아웃 · EBJ→ABZ→AMS→ICN 연결편 발권 완료"},
{id:11,date:"2026-09-12",weekday:"토요일",cities:"인천",lodging:"귀가",summary:"16:25 인천공항 ICN T2 도착 · 귀국 완료"},
];

const events=[
e("f1-01",1,"07:55","09:40","인천(ICN) → 타이중(RMQ)","항공","Incheon International Airport → Taichung International Airport","Jin Air LJ0735","1시간 45분",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"Jin Air LJ0735",from:"ICN",depart:"07:55",to:"RMQ",arrive:"09:40",source_label:"0830 최종 일정표 · 발권 완료"}]}),
e("f1-02",1,"09:40","13:00","입국수속·호텔 이동·짐 보관·중식","입국·교통·숙박","Taichung International Airport → CHECK Inn Taichung LaiLai, No.125 Sec.3 Sanmin Rd., North District, Taichung","택시","약 3시간 20분",{notes:"공항→호텔 택시 약 30~40분. 체크인은 16:00 이후이므로 우선 짐 보관."}),
e("f1-03",1,"오후","","LX 동행 TIPC 미팅 및 타이중항 견학","업무·현장견학","CHECK Inn Taichung LaiLai → Port of Taichung / Taiwan International Ports Corporation, No.2 Sec.10 Taiwan Blvd., Wuqi Dist., Taichung","LX 차량/택시","시간 협의",{meeting_status:"시간 가능 / 아젠다·시간 최종확정 필요",notes:"해상풍력 항만 인프라·물류·O&M 지원체계 중심. 호텔→TIPC 약 40~50분 예상. 담당자 상세 연락처는 공개 저장소에 게시하지 않고 원본 최종 일정표 참조."}),
e("f1-04",1,"16:00 이후","","호텔 체크인·석식·일정 정리","숙박·식사","CHECK Inn Taichung LaiLai","도보/택시","저녁",{meeting_status:"확정",notes:"예약 안내상 16:00 이후 체크인."}),

e("f2-01",2,"오전","","TIPC 회의내용 정리 및 OEG 현장실사 준비","업무준비","CHECK Inn Taichung LaiLai","도보","오전"),
e("f2-02",2,"13:30","14:30","OEG Taichung Office 방문","업무·기관방문","OEG Taichung Office, No.100 Zhugang Road, Wuqi District, Taichung","OEG/전용차량","1시간",{meeting_status:"확정",notes:"MCC 및 Operations Team 방문."}),
e("f2-03",2,"14:30","15:10","OEG Changhua facility 이동","교통","OEG Taichung Office → OEG Changhua facility","OEG/전용차량","약 40분",{meeting_status:"확정",notes:"Changhua facility 세부 주소 미정."}),
e("f2-04",2,"15:20","17:30","OEG Changhua facility 현장실사","업무·현장견학","OEG Changhua facility, Changhua (세부 주소 미정)","도보/현장차량","2시간 10분",{meeting_status:"확정 / 주소 미정",notes:"ECFE, Diving Tools 및 관련 장비·시설 견학."}),
e("f2-05",2,"17:30","18:30","Changhua → Taichung 시내 이동","교통","Changhua → Taichung","OEG/전용차량","약 50~60분",{meeting_status:"확정"}),
e("f2-06",2,"18:30~","","OEG Taiwan 석식 간담회","업무·식사","Taichung · 장소 TBC","OEG/전용차량","저녁",{meeting_status:"미정"}),

e("f3-01",3,"~11:00","","호텔 체크아웃·대만 일정 종합정리","숙박·업무정리","CHECK Inn Taichung LaiLai","도보","오전",{meeting_status:"확정",notes:"9/4 11:00 이전 체크아웃."}),
e("f3-02",3,"16:00","20:30","타오위안 국제공항 이동 및 출국수속","출국·교통","CHECK Inn Taichung LaiLai → Taiwan Taoyuan International Airport","전용차/택시 권장 · 대안 THSR+Airport MRT","약 4시간 30분",{meeting_status:"예정",notes:"전용차/택시 약 2시간 권장. 대안은 택시→THSR Taichung→Taoyuan→Airport MRT."}),
e("f3-03",3,"23:10","9/5 07:40","타오위안(TPE) → 암스테르담(AMS)","항공","Taiwan Taoyuan International Airport → Amsterdam Airport Schiphol","China Airlines CI0073","기내박",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"China Airlines CI0073",from:"TPE",depart:"23:10",to:"AMS",arrive:"9/5 07:40",source_label:"0830 최종 일정표 · 발권 완료"}]}),

e("f4-01",4,"07:40 이후","","암스테르담 도착·Urban Lodge Hotel 이동·짐 보관","입국·교통·숙박","Amsterdam Airport Schiphol → Amsterdam Sloterdijk → Urban Lodge Hotel, Arlandaweg 10, 1043 EW Amsterdam","NS 철도+도보","약 20~30분 + 수속",{meeting_status:"숙소 확정",notes:"Schiphol→Amsterdam Sloterdijk NS 약 10~15분, Sloterdijk역→호텔 도보 약 5~10분."}),
e("f4-02",4,"14:00 이후","","Urban Lodge Hotel 체크인","숙박","Urban Lodge Hotel, Arlandaweg 10, 1043 EW Amsterdam","도보","",{meeting_status:"숙소 확정"}),

e("f5-01",5,"오전~오후","","OEG Subsea 미팅 준비·출장자료 정리","업무준비","Urban Lodge Hotel","도보","주간"),
e("f5-02",5,"오후·저녁","","9/7 Den Helder 이동 대비","업무준비·교통","Urban Lodge Hotel → Amsterdam Sloterdijk → Den Helder","NS 철도 사전확인","",{meeting_status:"세부 이동시간 미정",notes:"NS 직통열차 시간·플랫폼 확인, OVpay용 컨택리스 카드/휴대폰 준비, 호텔 조기 체크아웃·짐 보관 가능 여부 확인."}),

e("f6-01",6,"이른 오전","","Urban Lodge Hotel → Den Helder 이동","교통","Urban Lodge Hotel → Amsterdam Sloterdijk → Den Helder Station → OEG Subsea BV","NS 직통열차+택시","약 1시간 25분+",{meeting_status:"NS 철도 권장 / 출발시간 최종확인",notes:"06:40~07:00대 출발 권장. Sloterdijk→Den Helder 직통 약 1시간 10분, Den Helder역→OEG Subsea 택시 약 10분. 전날 NS 앱 재확인."}),
e("f6-02",6,"09:00","12:30","OEG Subsea BV 방문","업무·기관방문·현장견학","OEG Subsea BV, Koperslagersweg 2, 1786 RA Den Helder","도보/현장","3시간 30분",{meeting_status:"확정",notes:"09:00 등록·Welcome Refreshments / 09:30 OEG Group 및 Offshore Wind 역량 소개 / 10:15 Facility Tour(ROV·Dive·Rope Access·Subsea) / 11:15 Discussion / 11:45 Lunch & Closing."}),
e("f6-03",6,"12:30 이후","","Den Helder → Schiphol 이동·함부르크행 탑승 준비","교통·출국","OEG Subsea BV → Den Helder Station → Amsterdam Sloterdijk → Urban Lodge Hotel(짐 픽업) → Amsterdam Airport Schiphol","택시+NS 철도","오후",{meeting_status:"예정",notes:"Den Helder→Sloterdijk 약 1시간 10분, 호텔 짐 픽업 후 Sloterdijk→Schiphol NS 약 10~15분."}),
e("f6-04",6,"20:50","21:55","암스테르담(AMS) → 함부르크(HAM)","항공","Amsterdam Airport Schiphol → Hamburg Airport","KLM KL1759","1시간 5분",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"KLM KL1759",from:"AMS",depart:"20:50",to:"HAM",arrive:"21:55",source_label:"0830 최종 일정표 · 발권 완료"}]}),
e("f6-05",6,"22:00 이후","","Hamburg Airport → 호텔 이동 및 체크인","교통·숙박","Hamburg Airport → Hamburg Hbf → Best Western Plus Hotel St. Raphael, Adenauerallee 41, 20097 Hamburg","S1+도보 / 택시 대안","약 35~45분",{meeting_status:"숙소 확정",notes:"S1 공항→Hamburg Hbf 약 25분, Hbf→호텔 도보 약 5~10분. 피로·짐 많으면 택시 이용 가능."}),

e("f7-01",7,"10:00","약 11:30","OWC Hamburg 미팅","업무·기관방문","OWC Hamburg, Alter Wall 69, 20457 Hamburg (공식 사무실 주소 · 미팅 장소 최종확인)","택시/hvv","약 90분",{meeting_status:"시간 확정 / 장소 최종확인",attendees:["Christian Apeah · Global Head of Independent Engineering"],notes:"Owner’s Engineering / Technical Advisory, 설계·기술검토, 리스크 및 LCoE 절감. 호텔→미팅장 택시 약 10~15분 또는 hvv 이용."}),
e("f7-02",7,"오후","","DNV Hamburg 미팅 추진","업무·기관방문","DNV Hamburg, Brooktorkai 18, 20457 Hamburg","택시/hvv","시간 미정",{meeting_status:"미정",notes:"Digital Twin, 해상풍력 인증·검증, 기술리스크 관리. OWC/호텔에서 이동하며 미팅 확정 후 최종경로 확인."}),

e("f8-01",8,"08:30","10:00","Skyborn Renewables 미팅 (가정)","업무·기관방문","Skyborn Renewables GmbH, Ericusspitze 2-4, 20457 Hamburg","택시","1시간 30분",{meeting_status:"조율 중",notes:"사업개발·인허가, PF/PPA·개발 리스크, 향후 협력 가능성. 호텔→Skyborn 택시 약 10~15분 권장."}),
e("f8-02",8,"10:00 이후","","미팅 종료·호텔 짐 픽업·Hamburg Hbf 이동","교통·숙박","Skyborn Renewables → Best Western Plus Hotel St. Raphael → Hamburg Hauptbahnhof","택시+도보","약 30~45분",{meeting_status:"예정",notes:"Skyborn→호텔/Hbf 택시 약 10~15분, 호텔은 Hbf 도보권."}),
e("f8-03",8,"11시대","16:50 전후","Hamburg Hbf → Kolding 환승 → Esbjerg 이동","교통","Hamburg Hauptbahnhof → Kolding Station → Esbjerg Station","DB/DSB 국제열차","약 5시간",{meeting_status:"열차 최종확인 필요",notes:"환승 1회·좌석예약 권장. 출발 전날 DB Navigator·DSB 앱 운행상태 재확인."}),
e("f8-04",8,"17:00 전후","","Hotel Britannia 체크인","숙박","Hotel Britannia, Torvegade 24, 6700 Esbjerg","도보/택시","",{meeting_status:"숙소 확정"}),

e("f9-01",9,"오전","10:30~10:45경","Blue Water Shipping 미팅 및 Esbjerg Port Tour","업무·기관방문·현장견학","Blue Water Shipping Esbjerg, Trafikhavnskaj 9, 6700 Esbjerg","BWS 차량/택시","오전",{meeting_status:"미팅·Port Tour 확정",notes:"BWS 한국 법인장 현장 가이드. 해상풍력 설치항·터빈/기자재 물류, 항만 운영·공급망 벤치마킹. Aarhus행 철도 고려 10:30~10:45경 종료 권장."}),
e("f9-02",9,"11:00 전후","13:30 전후","Esbjerg → Aarhus H 이동","교통","Esbjerg Station → Aarhus H","DSB 철도","약 2시간 20분",{meeting_status:"DSB 철도 이동",notes:"11시대 열차 이용 권장. 정확한 편명은 전날 확인. Aarhus H 도착 후 중식·미팅 준비."}),
e("f9-03",9,"15:00~","","OWC Denmark 미팅","업무·기관방문","OWC Denmark, Banegardspladsen 4, 2 sal. th., 8000 Aarhus C, Denmark","도보","시간 협의",{meeting_status:"시간·장소·참석자 확정",attendees:["Rene Aagaard · Country Manager","Rune Norgaard · Deputy Country Manager"],notes:"OE/Technical Advisory, 설계 최적화·CAPEX/LCoE, Asset Management·BoP O&M. Aarhus H→OWC 도보 약 2~5분."}),
e("f9-04",9,"미팅 후","","Aarhus H → Esbjerg 복귀","교통","OWC Denmark → Aarhus H → Esbjerg Station → Hotel Britannia","도보+DSB 철도","약 2시간 20분+",{meeting_status:"예정",notes:"최종 일정표에 명시된 OWC 미팅 후 DSB Esbjerg 복귀 동선."}),

e("f10-01",10,"~11:00","","Hotel Britannia 체크아웃·출장결과 정리","숙박·업무정리","Hotel Britannia, Torvegade 24, 6700 Esbjerg","도보","오전",{meeting_status:"확정"}),
e("f10-02",10,"11:00 전후","","Esbjerg Airport 이동 및 출국수속","출국·교통","Hotel Britannia → Esbjerg Airport","BWS 차량 지원 예정 / 택시 대안","약 1시간+",{meeting_status:"BWS 지원 예정 / 일정 공유 필요",notes:"지원 불가 시 택시 이용. 덴마크 전체 일정 공유 후 출발시간 최종 확정."}),
e("f10-03",10,"13:15","13:45","Esbjerg → Aberdeen","항공","Esbjerg Airport → Aberdeen Airport","Loganair LM058","30분",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"Loganair LM058",from:"EBJ",depart:"13:15",to:"ABZ",arrive:"13:45",source_label:"0830 최종 일정표 · 발권 완료"}]}),
e("f10-04",10,"13:45","17:20","Aberdeen Airport 환승","환승","Aberdeen Airport","공항 내 이동","3시간 35분",{notes:"영국 ETA 필요 여부는 동국관광 확인 결과에 따라 처리."}),
e("f10-05",10,"17:20","19:50","Aberdeen → Amsterdam","항공","Aberdeen Airport → Amsterdam Airport Schiphol","KLM KL0918","1시간 30분",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"KLM KL0918",from:"ABZ",depart:"17:20",to:"AMS",arrive:"19:50",source_label:"0830 최종 일정표 · 발권 완료"}]}),
e("f10-06",10,"19:50","21:35","Amsterdam Airport Schiphol 환승","환승","Amsterdam Airport Schiphol","공항 내 이동","1시간 45분"),
e("f10-07",10,"21:35","9/12 16:25","Amsterdam → Incheon","항공","Amsterdam Airport Schiphol → Incheon International Airport","KLM KL0855","기내박",{meeting_status:"발권 완료",schedule_legs:[{status:"confirmed",service:"KLM KL0855",from:"AMS",depart:"21:35",to:"ICN",arrive:"9/12 16:25",source_label:"0830 최종 일정표 · 발권 완료"}]}),

e("f11-01",11,"16:25","","인천공항(ICN T2) 도착·귀국 완료","귀국","Incheon International Airport Terminal 2","도보","",{meeting_status:"발권 완료"}),
];

const flights=[
{id:"air1",day_id:1,date:"2026-09-02",flight_no:"LJ0735",origin:"ICN",destination:"RMQ",depart_time:"07:55",arrive_time:"09:40",status:"발권 완료",alternative:"",url:"https://www.jinair.com/",notes:"0830 최종 일정표",sort_order:10},
{id:"air2",day_id:3,date:"2026-09-04",flight_no:"CI0073",origin:"TPE",destination:"AMS",depart_time:"23:10",arrive_time:"07:40+1",status:"발권 완료",alternative:"",url:"https://www.china-airlines.com/",notes:"0830 최종 일정표",sort_order:20},
{id:"air3",day_id:6,date:"2026-09-07",flight_no:"KL1759",origin:"AMS",destination:"HAM",depart_time:"20:50",arrive_time:"21:55",status:"발권 완료",alternative:"",url:"https://www.klm.com/",notes:"0830 최종 일정표",sort_order:30},
{id:"air4",day_id:10,date:"2026-09-11",flight_no:"LM058",origin:"EBJ",destination:"ABZ",depart_time:"13:15",arrive_time:"13:45",status:"발권 완료",alternative:"",url:"https://www.loganair.co.uk/",notes:"0830 최종 일정표",sort_order:40},
{id:"air5",day_id:10,date:"2026-09-11",flight_no:"KL0918",origin:"ABZ",destination:"AMS",depart_time:"17:20",arrive_time:"19:50",status:"발권 완료",alternative:"",url:"https://www.klm.com/",notes:"0830 최종 일정표",sort_order:50},
{id:"air6",day_id:10,date:"2026-09-11",flight_no:"KL0855",origin:"AMS",destination:"ICN",depart_time:"21:35",arrive_time:"16:25+1",status:"발권 완료",alternative:"",url:"https://www.klm.com/",notes:"2026-09-12 16:25 ICN T2 도착",sort_order:60},
];

const hotels=[
{id:"h1",day_id:1,name:"CHECK Inn Taichung LaiLai",city:"Taichung",check_in:"2026-09-02",check_out:"2026-09-04",nights:2,rooms:null,min_krw:null,max_krw:null,status:"숙소 확정",alternative:"",url:"https://www.checkinn.com.tw/",notes:"No.125, Sec.3, Sanmin Rd., North District, Taichung · 체크인 16:00 이후 · 체크아웃 9/4 11:00 이전",sort_order:10},
{id:"h2",day_id:4,name:"Urban Lodge Hotel",city:"Amsterdam",check_in:"2026-09-05",check_out:"2026-09-07",nights:2,rooms:null,min_krw:null,max_krw:null,status:"숙소 확정",alternative:"",url:"https://www.urbanlodgehotel.com/",notes:"Arlandaweg 10, 1043 EW Amsterdam",sort_order:20},
{id:"h3",day_id:6,name:"Best Western Plus Hotel St. Raphael",city:"Hamburg",check_in:"2026-09-07",check_out:"2026-09-09",nights:2,rooms:3,min_krw:null,max_krw:null,status:"숙소 확정",alternative:"",url:"https://www.booking.com/hotel/de/straphaelbestwesternhh.html",notes:"Adenauerallee 41, 20097 Hamburg",sort_order:30},
{id:"h4",day_id:8,name:"Hotel Britannia",city:"Esbjerg",check_in:"2026-09-09",check_out:"2026-09-11",nights:2,rooms:null,min_krw:null,max_krw:null,status:"숙소 확정",alternative:"",url:"https://www.britannia.dk/",notes:"Torvegade 24, 6700 Esbjerg",sort_order:40},
];

const meetings=[
{id:"m1",day_id:1,organization:"TIPC · Port of Taichung",agenda:"해상풍력 항만 인프라·물류·O&M 지원체계",recommended_duration:"오후 · 시간 협의",contact:"담당자 상세 연락처는 원본 최종 일정표 참조",status:"시간 가능 / 아젠다·시간 최종확정 필요",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://tc.twport.com.tw/en",notes:"No.2, Sec.10, Taiwan Blvd., Wuqi Dist., Taichung",sort_order:10},
{id:"m2",day_id:2,organization:"OEG Taichung Office",agenda:"MCC 및 Operations Team 방문 · OEG Taiwan 운영체계 확인",recommended_duration:"13:30~14:30",contact:"",status:"확정",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.oeg.group/",notes:"No.100, Zhugang Road, Wuqi District, Taichung",sort_order:20},
{id:"m3",day_id:2,organization:"OEG Changhua facility",agenda:"ECFE, Diving Tools 및 관련 장비·시설 현장실사",recommended_duration:"15:20~17:30",contact:"",status:"확정 / 주소 미정",photo_allowed:false,ppe_required:true,interpreter_needed:false,url:"https://www.oeg.group/",notes:"세부 주소 미정",sort_order:30},
{id:"m4",day_id:6,organization:"OEG Subsea BV",agenda:"OEG Group 및 Offshore Wind 역량 · ROV·Dive·Rope Access·Subsea facility tour · Discussion",recommended_duration:"09:00~12:30",contact:"",status:"확정",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.oeg.group/",notes:"Koperslagersweg 2, 1786 RA Den Helder",sort_order:40},
{id:"m5",day_id:7,organization:"OWC Hamburg",agenda:"Owner’s Engineering / Technical Advisory · 설계·기술검토 · 기술리스크 · LCoE 절감",recommended_duration:"10:00~약 11:30",contact:"Christian Apeah · Global Head of Independent Engineering",status:"시간 확정 / 장소 최종확인",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://owcltd.com/",notes:"Alter Wall 69, 20457 Hamburg는 공식 사무실 주소이며 미팅 장소는 최종확인",sort_order:50},
{id:"m6",day_id:7,organization:"DNV Hamburg",agenda:"Digital Twin · 해상풍력 인증·검증 · 기술리스크 관리",recommended_duration:"9/8 오후 · 시간 미정",contact:"",status:"미정",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.dnv.com/",notes:"Brooktorkai 18, 20457 Hamburg",sort_order:60},
{id:"m7",day_id:8,organization:"Skyborn Renewables GmbH",agenda:"사업개발·인허가 · PF/PPA·개발 리스크 · 향후 협력 가능성",recommended_duration:"08:30~10:00 가정",contact:"",status:"조율 중",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://www.skybornrenewables.com/",notes:"Ericusspitze 2-4, 20457 Hamburg",sort_order:70},
{id:"m8",day_id:9,organization:"Blue Water Shipping Esbjerg",agenda:"해상풍력 설치항·터빈/기자재 물류 · 항만 운영·공급망 · Esbjerg Port Tour",recommended_duration:"오전 · 10:30~10:45경 종료 권장",contact:"BWS 한국 법인장 현장 가이드",status:"미팅·Port Tour 확정",photo_allowed:false,ppe_required:true,interpreter_needed:false,url:"https://www.bws.net/contact/denmark/esbjerg",notes:"Trafikhavnskaj 9, 6700 Esbjerg",sort_order:80},
{id:"m9",day_id:9,organization:"OWC Denmark · Aarhus",agenda:"OE/Technical Advisory · 설계 최적화·CAPEX/LCoE · Asset Management·BoP O&M",recommended_duration:"15:00 시작",contact:"Rene Aagaard · Country Manager / Rune Norgaard · Deputy Country Manager",status:"시간·장소·참석자 확정",photo_allowed:false,ppe_required:false,interpreter_needed:false,url:"https://owcltd.com/",notes:"Banegardspladsen 4, 2 sal. th., 8000 Aarhus C",sort_order:90},
];

const transport_options=[
{id:"t1",region:"대만",recommendation:"택시·Uber / LX·OEG 차량 · 타오위안 이동은 전용차 또는 THSR",reason:"항만·O&M 현장 중심이라 대중교통보다 차량이 효율적",min_krw:null,max_krw:null,notes:"Google Maps·Uber·THSR T Express. EasyCard는 선택.",sort_order:10},
{id:"t2",region:"네덜란드",recommendation:"NS 철도 + 필요 시 택시",reason:"Sloterdijk↔Den Helder 직통열차 활용",min_krw:null,max_krw:null,notes:"NS 앱 / OVpay. 1인 1카드·동일 카드로 IN/OUT. OV-chipkaart 불필요.",sort_order:20},
{id:"t3",region:"독일",recommendation:"S-Bahn·hvv + 택시 / 장거리 DB",reason:"공항→Hbf는 S1, 회사 미팅 이동은 택시 병행이 편리",min_krw:null,max_krw:null,notes:"hvv switch · DB Navigator",sort_order:30},
{id:"t4",region:"덴마크",recommendation:"DSB 철도 + BWS 차량·택시",reason:"Hamburg→Esbjerg 철도, Esbjerg→Aarhus 철도 약 2시간 20분",min_krw:null,max_krw:null,notes:"DSB 앱 · Rejseplanen",sort_order:40},
{id:"t5",region:"영국",recommendation:"Aberdeen Airport 공항 내 환승",reason:"발권된 연결편 기준",min_krw:null,max_krw:null,notes:"KLM / Loganair 앱·예약정보. ETA 필요 여부는 동국관광 확인 결과에 따라 처리.",sort_order:50},
];

const restaurants=[];
const budget_items=[];

const map_points=[
{id:"p1",day_id:1,name:"Incheon International Airport",lat:37.4602,lng:126.4407,sort_order:1,segment_type:"flight",popup:"07:55 LJ0735 출발",url:""},
{id:"p2",day_id:1,name:"Taichung International Airport",lat:24.2647,lng:120.6206,sort_order:2,segment_type:"flight",popup:"09:40 도착",url:""},
{id:"p3",day_id:1,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:3,segment_type:"car",popup:"짐 보관·16:00 이후 체크인",url:""},
{id:"p4",day_id:1,name:"Port of Taichung / TIPC",lat:24.2550,lng:120.5170,sort_order:4,segment_type:"car",popup:"오후 미팅·항만 견학",url:"https://tc.twport.com.tw/en"},
{id:"p5",day_id:1,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:5,segment_type:"car",popup:"숙박",url:""},
{id:"p6",day_id:2,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:1,segment_type:"car",popup:"출발",url:""},
{id:"p7",day_id:2,name:"OEG Taichung Office · Zhugang Road 100",lat:24.2570,lng:120.5200,sort_order:2,segment_type:"car",popup:"13:30 방문",url:""},
{id:"p8",day_id:2,name:"OEG Changhua facility · 세부 주소 미정",lat:24.0756,lng:120.5440,sort_order:3,segment_type:"car",popup:"15:20 현장실사 · 광역 임시핀",url:""},
{id:"p9",day_id:2,name:"Taichung",lat:24.1477,lng:120.6736,sort_order:4,segment_type:"car",popup:"18:30 석식 장소 TBC",url:""},
{id:"p10",day_id:3,name:"CHECK Inn Taichung LaiLai",lat:24.1406,lng:120.6841,sort_order:1,segment_type:"car",popup:"~11:00 체크아웃",url:""},
{id:"p11",day_id:3,name:"Taiwan Taoyuan International Airport",lat:25.0797,lng:121.2342,sort_order:2,segment_type:"car",popup:"23:10 CI0073 출발",url:""},
{id:"p12",day_id:3,name:"Amsterdam Airport Schiphol",lat:52.3105,lng:4.7683,sort_order:3,segment_type:"flight",popup:"9/5 07:40 도착",url:""},
{id:"p13",day_id:4,name:"Amsterdam Airport Schiphol",lat:52.3105,lng:4.7683,sort_order:1,segment_type:"rail",popup:"07:40 도착",url:""},
{id:"p14",day_id:4,name:"Amsterdam Sloterdijk",lat:52.3889,lng:4.8389,sort_order:2,segment_type:"rail",popup:"NS 환승/하차",url:""},
{id:"p15",day_id:4,name:"Urban Lodge Hotel",lat:52.3897,lng:4.8356,sort_order:3,segment_type:"walk",popup:"짐 보관·14:00 이후 체크인",url:""},
{id:"p16",day_id:5,name:"Urban Lodge Hotel",lat:52.3897,lng:4.8356,sort_order:1,segment_type:"walk",popup:"미팅 준비",url:""},
{id:"p17",day_id:5,name:"Den Helder",lat:52.9563,lng:4.7608,sort_order:2,segment_type:"rail",popup:"9/7 이동 사전확인",url:""},
{id:"p18",day_id:6,name:"Urban Lodge Hotel",lat:52.3897,lng:4.8356,sort_order:1,segment_type:"walk",popup:"이른 오전 출발",url:""},
{id:"p19",day_id:6,name:"Amsterdam Sloterdijk",lat:52.3889,lng:4.8389,sort_order:2,segment_type:"rail",popup:"NS 직통",url:""},
{id:"p20",day_id:6,name:"Den Helder Station",lat:52.9563,lng:4.7608,sort_order:3,segment_type:"rail",popup:"OEG Subsea 택시 연계",url:""},
{id:"p21",day_id:6,name:"OEG Subsea BV · Koperslagersweg 2",lat:52.9348,lng:4.7802,sort_order:4,segment_type:"car",popup:"09:00~12:30",url:""},
{id:"p22",day_id:6,name:"Amsterdam Airport Schiphol",lat:52.3105,lng:4.7683,sort_order:5,segment_type:"rail",popup:"20:50 KL1759",url:""},
{id:"p23",day_id:6,name:"Hamburg Airport",lat:53.6304,lng:9.9882,sort_order:6,segment_type:"flight",popup:"21:55 도착",url:""},
{id:"p24",day_id:6,name:"Hamburg Hbf",lat:53.5527,lng:10.0067,sort_order:7,segment_type:"rail",popup:"S1",url:""},
{id:"p25",day_id:6,name:"Best Western Plus Hotel St. Raphael",lat:53.55293,lng:10.01636,sort_order:8,segment_type:"walk",popup:"숙박",url:""},
{id:"p26",day_id:7,name:"Best Western Plus Hotel St. Raphael",lat:53.55293,lng:10.01636,sort_order:1,segment_type:"car",popup:"출발",url:""},
{id:"p27",day_id:7,name:"OWC Hamburg · Alter Wall 69",lat:53.5490,lng:9.9910,sort_order:2,segment_type:"car",popup:"10:00 · 장소 최종확인",url:""},
{id:"p28",day_id:7,name:"DNV Hamburg · Brooktorkai 18",lat:53.5430,lng:10.0030,sort_order:3,segment_type:"car",popup:"오후 추진 · 미정",url:""},
{id:"p29",day_id:8,name:"Best Western Plus Hotel St. Raphael",lat:53.55293,lng:10.01636,sort_order:1,segment_type:"car",popup:"짐 픽업",url:""},
{id:"p30",day_id:8,name:"Skyborn Renewables · Ericusspitze 2-4",lat:53.5454,lng:10.0032,sort_order:2,segment_type:"car",popup:"08:30~10:00 가정",url:""},
{id:"p31",day_id:8,name:"Hamburg Hbf",lat:53.5527,lng:10.0067,sort_order:3,segment_type:"car",popup:"11시대 출발",url:""},
{id:"p32",day_id:8,name:"Kolding Station",lat:55.4904,lng:9.4723,sort_order:4,segment_type:"rail",popup:"환승",url:""},
{id:"p33",day_id:8,name:"Esbjerg Station",lat:55.4667,lng:8.4578,sort_order:5,segment_type:"rail",popup:"16:50 전후",url:""},
{id:"p34",day_id:8,name:"Hotel Britannia",lat:55.4674,lng:8.4528,sort_order:6,segment_type:"walk",popup:"17:00 전후 체크인",url:""},
{id:"p35",day_id:9,name:"Hotel Britannia",lat:55.4674,lng:8.4528,sort_order:1,segment_type:"car",popup:"출발",url:""},
{id:"p36",day_id:9,name:"Blue Water Shipping · Trafikhavnskaj 9",lat:55.4650,lng:8.4430,sort_order:2,segment_type:"car",popup:"오전 미팅·Port Tour",url:""},
{id:"p37",day_id:9,name:"Esbjerg Station",lat:55.4667,lng:8.4578,sort_order:3,segment_type:"car",popup:"11시대 DSB",url:""},
{id:"p38",day_id:9,name:"Aarhus H",lat:56.1500,lng:10.2048,sort_order:4,segment_type:"rail",popup:"13:30 전후",url:""},
{id:"p39",day_id:9,name:"OWC Denmark · Banegardspladsen 4",lat:56.1504,lng:10.2043,sort_order:5,segment_type:"walk",popup:"15:00 확정",url:""},
{id:"p40",day_id:9,name:"Aarhus H",lat:56.1500,lng:10.2048,sort_order:6,segment_type:"walk",popup:"미팅 후 복귀",url:""},
{id:"p41",day_id:9,name:"Esbjerg Station",lat:55.4667,lng:8.4578,sort_order:7,segment_type:"rail",popup:"복귀",url:""},
{id:"p42",day_id:9,name:"Hotel Britannia",lat:55.4674,lng:8.4528,sort_order:8,segment_type:"walk",popup:"숙박",url:""},
{id:"p43",day_id:10,name:"Hotel Britannia",lat:55.4674,lng:8.4528,sort_order:1,segment_type:"car",popup:"~11:00 체크아웃",url:""},
{id:"p44",day_id:10,name:"Esbjerg Airport",lat:55.5259,lng:8.5534,sort_order:2,segment_type:"car",popup:"13:15 LM058",url:""},
{id:"p45",day_id:10,name:"Aberdeen Airport",lat:57.2019,lng:-2.1978,sort_order:3,segment_type:"flight",popup:"13:45 도착 · 17:20 출발",url:""},
{id:"p46",day_id:10,name:"Amsterdam Airport Schiphol",lat:52.3105,lng:4.7683,sort_order:4,segment_type:"flight",popup:"19:50 도착 · 21:35 출발",url:""},
{id:"p47",day_id:10,name:"Incheon International Airport",lat:37.4602,lng:126.4407,sort_order:5,segment_type:"flight",popup:"9/12 16:25 도착",url:""},
{id:"p48",day_id:11,name:"Incheon International Airport Terminal 2",lat:37.4602,lng:126.4407,sort_order:1,segment_type:"walk",popup:"16:25 귀국 완료",url:""},
];

const officialSeed={days,events,flights,hotels,meetings,transport_options,restaurants,map_points,budget_items};
export const ITINERARIES={final_0830:{meta,officialSeed}};
