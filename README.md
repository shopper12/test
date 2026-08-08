# 공무 국외출장 일정·비용 대시보드 2026

첨부 `260729_공무 국외출장 계획서(초안)`의 방문 순서와 업무장소를 유지하면서, 항공·철도·숙박비를 다시 비교한 협업 대시보드입니다.

- 빌드: `LIVE_TRAVEL_V17`
- 일정: 2026-09-02 ~ 2026-09-12
- 경로: 인천 → 타이중·루강 → 네덜란드 → 함부르크 → 에스비에르 → 코펜하겐 → 인천
- 업무장소: 계획서의 TIPC, Vestas O&M Base, Port of Rotterdam, ROG, TNO, Skyborn, Blue Water Shipping 등 7곳
- 비용 최적안: TPE→AMS 직항 + CPH→CDG→ICN Air France 1회 경유
- 귀국시간 우선안: TPE→AMS 직항 + CPH→IST→ICN Turkish Airlines 1회 경유
- 직항 비교: CPH→ICN SAS 직항을 자동운임 비교표에 유지
- 지도: 장소와 이동경로를 분리하며, 이동경로를 누르면 대시보드 내부 지도에 출발·도착 경로를 표시
- 항공가격: GitHub Actions가 Google Flights를 성인 4명·일반석 조건으로 매시간 자동조회

## 대시보드

- 배포 주소: https://shopper12.github.io/test/
- 저장소: https://github.com/shopper12/test

상단의 `추천안 · 비용 최적`과 `비교안 · 귀국시간 우선` 탭을 전환하면 일정·지도·항공·숙박·교통·예산이 함께 바뀝니다.

- 일정 카드는 PC에서 끌기, 모바일에서 길게 끌기 또는 위·아래 버튼으로 이동합니다.
- Day 날짜를 옮기면 이후 일정과 항공·숙박 검색 날짜가 연쇄 변경됩니다.
- 항공은 노선 절대최저가와 일정에 맞춘 채택편을 4인 총액·1인 금액으로 나눠 표시합니다.
- 귀국편은 CPH→ICN에 대해 비용 최저 1회 경유, 도착시간 우선 1회 경유, SAS 직항을 함께 비교합니다.
- Google Flights 버튼은 자동조회에 사용한 날짜·공항·성인 4명 조건의 실제 결과로 연결합니다.
- 숙박은 Booking.com에 체크인·체크아웃·성인 4명·객실 2실·낮은 가격순 조건을 넣어 엽니다.
- 철도·호텔 공식 링크와 저가 대안은 각 행에서 바로 확인할 수 있습니다.

자동 운임은 `flight-prices.json`에 조회시각과 유효시각을 기록합니다. 위탁수하물·좌석·결제수수료와 재고 변동은 최종 예약화면이 기준입니다.

## 항공가격 자동갱신

`.github/workflows/update-flight-prices.yml`이 매시간 `scripts/update_flight_prices.py`를 실행합니다. 현재 7개 검색조건을 성인 4명 기준으로 조회하며, 귀국에는 다음 3개 선택지가 포함됩니다.

- 비용 최적: CPH→CDG→ICN
- 귀국시간 우선: CPH→IST→ICN
- 직항 비교: CPH→ICN SAS

`lowest`는 해당 날짜·노선·환승조건의 절대최저가, `selected`는 대시보드 일정에 맞춘 채택편 가격입니다. 개별 검색이 실패하면 마지막 성공값을 `stale`로 유지하며 최신 가격으로 표시하지 않습니다.

## 저장소 통합

이 프로젝트의 유일한 정본 저장소는 `shopper12/test`입니다. 과거 Lovable/TanStack 기반 `shopper12/wind-tour-tracker`에서 재사용 가치가 있는 로그인·Supabase realtime·지도 코드는 `archive/wind-tour-tracker/`에 보존했습니다. 과거 일정 seed는 현재 V17보다 오래되어 병합하지 않았고, `.env`는 보안상 공개 저장소에 복사하지 않았습니다.

## 배포

GitHub Actions의 `Deploy GitHub Pages` 워크플로로 자동 배포합니다.

## 보안

공개 저장소와 공개 대시보드에는 여권번호, 전화번호, 기관 담당자 개인정보, 계약자료 등 비공개 정보를 입력하지 마십시오.
