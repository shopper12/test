# wind-tour-tracker legacy snapshot

이 폴더는 2026-08-09 저장소 통합 시 `shopper12/wind-tour-tracker`에서 재사용 가치가 있는 코드만 보존한 아카이브입니다.

- 원본 저장소: `shopper12/wind-tour-tracker`
- 원본 main commit: `3dbe673f52f36762621795206db626d2efb75816`
- 현재 정본/실서비스: `shopper12/test` 루트의 LIVE_TRAVEL_V17

## 보존한 것
- Lovable/TanStack 앱 의존성 정의 (`package.json`)
- Leaflet 지도 컴포넌트 (`src/components/TripMap.tsx`)
- 팀 로그인 화면 (`src/routes/auth.tsx`)
- TanStack root shell (`src/routes/__root.tsx`)
- Supabase client/type 정의
- `schedule_items` 테이블, RLS, realtime migration
- 환경변수 이름만 담은 `.env.example`

## 의도적으로 제외한 것
- `.env`: 비밀값/환경값이므로 공개 저장소인 `shopper12/test`로 복사하지 않음
- 옛 `trip-data.ts`와 전체 일정 UI seed: 2026-07-23 기준으로 현재 V17보다 오래됐고 노르웨이·일본 등 폐기된 동선이 포함되어 있어 정본 데이터를 오염시킬 수 있으므로 미병합
- shadcn/ui 자동생성 컴포넌트 및 Lovable 보일러플레이트: package 정의로 재생성 가능하며 현재 정적 Pages 런타임에 필요하지 않음

## 협업 기능 참고
옛 앱은 Supabase `schedule_items`를 읽고, 인증 사용자가 INSERT/UPDATE/DELETE하며 `postgres_changes` realtime 구독으로 갱신하는 구조였습니다. 현재 앱에 협업 기능을 다시 붙일 때 이 폴더의 migration/client/auth 코드를 참조합니다.

이 아카이브는 현재 GitHub Pages 빌드의 실행 경로 밖에 있으므로 실서비스에는 영향을 주지 않습니다.
