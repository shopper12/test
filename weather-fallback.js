const OUTLOOKS=[
  {
    key:"taichung",aliases:["taichung","타이중","wuqi","우치","lukang","루강","vestas","port of taichung"],
    label:"타이중",highC:32,lowC:23,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/tw/xitun-district/2515493/september-weather/2515493?year=2026",
    officialLabel:"대만 CWA 1개월 장기전망",officialUrl:"https://www.cwa.gov.tw/Data/fcst_pdf/FW14.pdf"
  },
  {
    key:"taoyuan",aliases:["taoyuan","타오위안","tpe","dayuan","타이완 타오위안"],
    label:"타오위안",highC:30,lowC:23,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/tw/taiwan-taoyuan-international-airport/5298_poi/september-weather/5298_poi?year=2026",
    officialLabel:"대만 CWA 1개월 장기전망",officialUrl:"https://www.cwa.gov.tw/Data/fcst_pdf/FW14.pdf"
  },
  {
    key:"rotterdam",aliases:["rotterdam","로테르담","rijswijk","라이스베이크","amsterdam","암스테르담","schiphol","ams"],
    label:"로테르담권",highC:19,lowC:12,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/nl/rotterdam-noord/3509201/september-weather/3509201?year=2026",
    officialLabel:"KNMI 15일 앙상블·기후플룸",officialUrl:"https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/weer-en-klimaatpluim/"
  },
  {
    key:"hamburg",aliases:["hamburg","함부르크","hafencity","skyborn","speicherstadt"],
    label:"함부르크",highC:19,lowC:10,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/de/hamburg-altstadt/20095/september-weather/3352352?year=2026",
    officialLabel:"DWD 수주·계절 기후예측",officialUrl:"https://www.dwd.de/EN/ourservices/kvhs_en/1_basic/start_node.html"
  },
  {
    key:"esbjerg",aliases:["esbjerg","에스비에르","blue water","bws"],
    label:"에스비에르",highC:17,lowC:10,basis:"AccuWeather 9월 초 평년값(월간 페이지)",
    sourceUrl:"https://www.accuweather.com/en/dk/esbjerg/126311/september-weather/126311?year=2026",
    officialLabel:"DMI 7일 예보",officialUrl:"https://www.dmi.dk/"
  },
  {
    key:"copenhagen",aliases:["copenhagen","코펜하겐","københavn","kastrup","cph","field's"],
    label:"코펜하겐",highC:18,lowC:11,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/dk/copenhagen-kastrup-airport/2076_poi/september-weather/2076_poi?year=2026",
    officialLabel:"DMI 7일 예보",officialUrl:"https://www.dmi.dk/"
  },
  {
    key:"istanbul",aliases:["istanbul","이스탄불","ist airport"," ist "],
    label:"이스탄불",highC:24,lowC:17,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/tr/istanbul-ataturk-airport/5248_poi/september-weather/5248_poi?year=2026"
  },
  {
    key:"incheon",aliases:["incheon","인천","icn"],
    label:"인천",highC:26,lowC:17,basis:"AccuWeather 2026년 9월 월간전망 평균",
    sourceUrl:"https://www.accuweather.com/en/kr/seoun-dong/2331917/september-weather/2331917?year=2026",
    officialLabel:"KMA 1개월 전망",officialUrl:"https://www.weather.go.kr/neng/forecast/long-range-forecast/1-month-outlook.do"
  }
];

const norm=v=>` ${String(v||"").toLowerCase().replace(/[^a-z0-9가-힣øäöüß]+/g," ").replace(/\s+/g," ").trim()} `;

export function longRangeWeather(text){
  const t=norm(text);
  return OUTLOOKS.find(x=>x.aliases.some(a=>t.includes(norm(a).trim())))||null;
}

export function allLongRangeWeather(){return OUTLOOKS.slice();}
