from pathlib import Path

p = Path('itinerary-data.js')
s = p.read_text(encoding='utf-8')

def rep(old, new):
    global s
    count = s.count(old)
    if count != 1:
        raise SystemExit(f'expected one match, got {count}: {old[:120]!r}')
    s = s.replace(old, new, 1)

# Hamburg arrival is 23:16 on the same day; remove the obsolete 00:05 hotel transfer.
rep('''      "d6-10",
      6,
      "00:05",
      "00:30",
      "함부르크 중앙역 → 호텔",
      "교통·숙박",
      "Motel One Hamburg-Fleetinsel",
      "택시",
      "25분",''', '''      "d6-10",
      6,
      "23:16",
      "23:40",
      "함부르크 중앙역 → 호텔",
      "교통·숙박",
      "Motel One Hamburg-Fleetinsel",
      "택시",
      "24분",''')

# Keep durations internally consistent with the exact clock times.
rep('''      "14:54",
      "15:30",
      "호텔 이동·체크인",
      "숙박",
      "CABINN Plus Esbjerg, Torvegade 27",
      "도보",
      "50분",''', '''      "14:54",
      "15:30",
      "호텔 이동·체크인",
      "숙박",
      "CABINN Plus Esbjerg, Torvegade 27",
      "도보",
      "36분",''')
rep('''      "15:45",
      "18:30",
      "Men at Sea·Fisheries and Maritime Museum 외부",
      "관광",
      "Sædding Strand, Esbjerg",
      "버스+도보",
      "3시간",''', '''      "15:45",
      "18:30",
      "Men at Sea·Fisheries and Maritime Museum 외부",
      "관광",
      "Sædding Strand, Esbjerg",
      "버스+도보",
      "2시간 45분",''')
rep('''      "13:00",
      "15:10",
      "독일·덴마크 방문내용 정리",
      "업무정리",
      "CABINN Plus 라운지/도심 업무공간",
      "도보",
      "2시간 30분",''', '''      "13:00",
      "15:10",
      "독일·덴마크 방문내용 정리",
      "업무정리",
      "CABINN Plus 라운지/도심 업무공간",
      "도보",
      "2시간 10분",''')

# IC850 arrives 18:28. Use the next workable regional-train pattern rather than a 1-minute transfer.
rep('''      "d9-07",
      9,
      "18:28",
      "19:20",
      "코펜하겐 중앙역 → CABINN Metro",
      "교통·숙박",
      "Arne Jacobsens Allé 2, Copenhagen",
      "기차+도보",
      "55분",
      {
        booking_url: "https://en.cabinn.com/hotel/cabinn-metro",
      },''', '''      "d9-07",
      9,
      "18:28",
      "19:10",
      "코펜하겐 중앙역 → CABINN Metro",
      "교통·숙박",
      "København H → Ørestad St. → CABINN Metro",
      "지역열차+도보",
      "42분",
      {
        booking_url: "https://en.cabinn.com/hotel/cabinn-metro",
        notes: "IC850 18:28 도착 후 13분 환승 여유. Rejseplanen은 9/7~9/12 선로공사로 일부 열차 변경 가능성을 공지하므로 3일 전 재확인.",
        schedule_legs: [
          { status: "provisional", service: "Regional train Re 1116 후보", from: "København H", depart: "18:41 후보", to: "Ørestad St.", arrive: "18:51 후보", source_label: "Rejseplanen 현행 패턴 · 9/10 선로공사 재확인" },
        ],
      },''')
rep('''      "19:30",
      "20:45",
      "Field's Food Court 저녁",
      "식사",
      "Ørestad, Copenhagen",
      "도보",
      "60분",''', '''      "19:30",
      "20:45",
      "Field's Food Court 저녁",
      "식사",
      "Ørestad, Copenhagen",
      "도보",
      "75분",''')

# Airport access: exact planned train pattern, but explicitly provisional because Rejseplanen flags track work Sep 7-12.
rep('''          e("d10c-01",10,"06:45","08:00","체크아웃·코펜하겐공항 이동","출국·교통","CABINN Metro → CPH","기차","75분"),''', '''          e("d10c-01",10,"07:10","07:50","체크아웃·코펜하겐공항 이동","출국·교통","CABINN Metro → Ørestad St. → CPH","도보+지역열차","40분",{notes:"Rejseplanen은 9/7~9/12 선로공사로 일부 열차 변경 가능성을 공지. 3일 전 재확인하고 변경 시 택시로 대체.",schedule_legs:[{status:"provisional",service:"Regional train Re 1026 후보",from:"Ørestad St.",depart:"07:37 후보",to:"CPH Lufthavn",arrive:"07:44 후보",source_label:"Rejseplanen 현행 패턴 · 9/11 선로공사 재확인"}]}),''')
rep('''          e("d10-01",10,"06:45","08:00","체크아웃·코펜하겐공항 이동","출국·교통","CABINN Metro → CPH","기차","75분"),''', '''          e("d10-01",10,"07:10","07:50","체크아웃·코펜하겐공항 이동","출국·교통","CABINN Metro → Ørestad St. → CPH","도보+지역열차","40분",{notes:"Rejseplanen은 9/7~9/12 선로공사로 일부 열차 변경 가능성을 공지. 3일 전 재확인하고 변경 시 택시로 대체.",schedule_legs:[{status:"provisional",service:"Regional train Re 1026 후보",from:"Ørestad St.",depart:"07:37 후보",to:"CPH Lufthavn",arrive:"07:44 후보",source_label:"Rejseplanen 현행 패턴 · 9/11 선로공사 재확인"}]}),''')

# Exact published flight numbers for the Air France cost-optimized return.
s = s.replace('service:"Air France",from:"CPH",depart:"10:10"', 'service:"Air France AF1751",from:"CPH",depart:"10:10"', 1)
s = s.replace('service:"Air France",from:"CDG",depart:"14:40"', 'service:"Air France AF264",from:"CDG",depart:"14:40"', 1)
rep('flight_no: "AF · CDG 1회 환승"', 'flight_no: "AF1751 + AF264"')

p.write_text(s, encoding='utf-8')
print('final transport timing consistency fixes applied')
