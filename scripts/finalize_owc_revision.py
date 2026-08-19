from pathlib import Path


def rep(s,a,b,label):
    if a not in s: raise SystemExit('missing '+label)
    return s.replace(a,b,1)

p=Path('itinerary-data.js'); s=p.read_text(encoding='utf-8')
s=rep(s,'"DNV Hamburg 오전 미팅 · Skyborn Renewables 오후 미팅 · OWC Germany 기술미팅 · HafenCity",','"DNV Hamburg 오전 미팅 · Skyborn Renewables 오후 미팅 · OWC Germany는 Christian Apeah 참석 확정·시간/장소 조율중",','day7 summary')
old='''    e(
      "d7-055",
      7,
      "14:30",
      "14:50",
      "Skyborn Renewables → OWC Hamburg 이동",
      "교통",
      "Ericusspitze 2-4 → Alter Wall 69, Hamburg",
      "도보/택시",
      "20분",
      {
        sort_order: 55,
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Skyborn+Renewables+Ericusspitze+2-4+Hamburg&destination=OWC+Alter+Wall+69+Hamburg",
        notes: "Skyborn 미팅 종료 후 OWC Germany 미팅 장소로 이동. 같은 Hamburg 20457 권역.",
      },
    ),
    e(
      "d7-06",
      7,
      "15:00",
      "16:30",
      "OWC Germany 해상풍력 기술미팅 (요청 중)",
      "업무",
      "OWC Hamburg, Alter Wall 69, 20457 Hamburg",
      "도보",
      "90분",
      {
        official_url: "https://owcltd.com/offices/hamburg/",
        map_url: "https://www.google.com/maps/search/?api=1&query=OWC+Alter+Wall+69+20457+Hamburg",
        meeting_status: "OWC Germany 회신·참석자 확인 대기",
        notes: "9/8 또는 9/9 오후 요청 중. 독일 프로젝트 중심 Owner’s Engineering·Technical Advisory, 초기 Technical Risk, WTG·Foundation·Cable·Offshore Substation 기술검토, 설계 최적화·LCoE 절감 사례를 중점 청취.",
      },
    ),
    e(
      "d7-07",
      7,
      "16:30",
      "20:30",
      "OWC 미팅 정리·Elbphilharmonie·Landungsbrücken·저녁",
      "업무정리·관광·식사",
      "OWC Hamburg → Elbphilharmonie → Landungsbrücken",
      "도보+U-Bahn",
      "4시간",
      {
        booking_url: "https://www.elbphilharmonie.de/en/plaza-tickets",
        map_url: "https://www.google.com/maps/dir/?api=1&origin=OWC+Alter+Wall+69+Hamburg&destination=Landungsbrucken&waypoints=Elbphilharmonie",
        notes: "3개 기관 미팅 핵심내용을 우선 메모한 뒤 저녁 일정 진행.",
      },
    ),'''
new='''    e(
      "d7-055",
      7,
      "14:30",
      "15:00",
      "Skyborn 미팅 정리·OWC 이동버퍼 (가예약)",
      "업무정리·교통",
      "Skyborn Renewables, Ericusspitze 2-4 → Hamburg OWC 지정 장소(조율중)",
      "도보/택시",
      "30분 가예약",
      {
        sort_order: 55,
        map_url: "https://www.google.com/maps/search/?api=1&query=Hamburg+20457+Germany",
        notes: "Christian Apeah 참석은 확정됐으나 그 주 사무실 이전으로 날짜·시간·장소가 조율 중. 이 이동시간은 9/8 오후 배치 가능성을 보기 위한 버퍼이며 장소 확정 즉시 자동 재산정 대상.",
      },
    ),
    e(
      "d7-06",
      7,
      "15:00",
      "16:30",
      "OWC Germany 기술미팅 (가예약·참석자 확정)",
      "업무",
      "Hamburg · OWC 지정 미팅 장소(조율중)",
      "미정",
      "90분 가예약",
      {
        official_url: "https://owcltd.com/our-people/",
        map_url: "https://www.google.com/maps/search/?api=1&query=Hamburg+Germany",
        meeting_status: "Christian Apeah 참석 확정 / 날짜·시간·장소 조율 중",
        attendees: ["Christian Apeah · Global Head of Independent Engineering · 기술실사/Lender’s Technical Advisory 부문장"],
        notes: "9/8 15:00~16:30은 전체 동선 검토용 가예약 블록. 실제 일시·장소는 OWC 회신 후 변경. 독일 프로젝트 Independent Engineering, 기술실사, Lender’s Technical Advisory, Owner’s Engineering 및 주요 Technical Risk 사례를 중점 청취.",
      },
    ),
    e(
      "d7-07",
      7,
      "16:30",
      "20:30",
      "OWC 일정 종료 후 내용 정리·Elbphilharmonie·Landungsbrücken",
      "업무정리·관광·식사",
      "Hamburg OWC 미팅장소(미정) → Elbphilharmonie → Landungsbrücken",
      "도보+U-Bahn/택시",
      "4시간 가변",
      {
        booking_url: "https://www.elbphilharmonie.de/en/plaza-tickets",
        map_url: "https://www.google.com/maps/dir/?api=1&origin=Hamburg+Germany&destination=Landungsbrucken+Hamburg&waypoints=Elbphilharmonie+Hamburg",
        notes: "OWC 실제 시간·장소가 확정되면 저녁 동선도 함께 재계산. 현재는 함부르크 중심권 기준 가예약.",
      },
    ),'''
s=rep(s,old,new,'day7 OWC provisional')
p.write_text(s,encoding='utf-8')

p=Path('map-routing.mjs'); s=p.read_text(encoding='utf-8')
s=rep(s,'  "d7-055": {kind:"route",origin:"Skyborn Renewables, Ericusspitze 2-4, Hamburg",destination:"OWC, Alter Wall 69, 20457 Hamburg",mode:"walking"},\n  "d7-06": {kind:"place",query:"OWC, Alter Wall 69, 20457 Hamburg"},\n  "d7-07": {kind:"route",origin:"OWC, Alter Wall 69, 20457 Hamburg",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},','  "d7-055": {kind:"place",query:"Hamburg 20457, Germany"},\n  "d7-06": {kind:"place",query:"Hamburg, Germany"},\n  "d7-07": {kind:"route",origin:"Hamburg, Germany",waypoints:"Elbphilharmonie Hamburg",destination:"Landungsbrücken Hamburg",mode:"transit"},','map day7')
p.write_text(s,encoding='utf-8')

p=Path('app.js'); s=p.read_text(encoding='utf-8')
s=rep(s,'let MARKER = `__OFFSHORE_PLAN_${APP_VERSION}_${DEFAULT_ITINERARY}__`;','let MARKER = `__OFFSHORE_PLAN_${APP_VERSION}_${DEFAULT_ITINERARY}_${tripMeta.lastVerified}__`;','marker init')
s=rep(s,'MARKER=`__OFFSHORE_PLAN_${APP_VERSION}_${key}__`;','MARKER=`__OFFSHORE_PLAN_${APP_VERSION}_${key}_${tripMeta.lastVerified}__`;','marker switch')
p.write_text(s,encoding='utf-8')
print('OWC revision finalized')
