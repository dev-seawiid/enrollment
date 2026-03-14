# TODO

## API 추가 필요

- [ ] **내 수강 목록 조회 API** — 현재 백엔드에 로그인한 사용자의 수강 신청 내역을 조회하는 엔드포인트가 없음
  - API 추가 시 강의 목록에서 신청완료 강의에 "신청완료" 뱃지 표시 + 선택 비활성화 처리
  - `SelectableCourseCard`와 `CourseCardContent`에 `isEnrolled` prop이 이미 준비되어 있음 (`src/components/course-card.tsx`)
  - `src/app/courses/page.tsx`에 TODO 주석 참고

## E2E 테스트 작성 필요

- [ ] **Playwright E2E 테스트** — 라우트 보호 및 핵심 흐름 검증
  - 비로그인 → `/courses` → `/login` 리다이렉트
  - 수강생 → `/courses/new` URL 직접 접근 → `/courses` 리다이렉트
  - 로그인 상태 → `/login` 접근 → `/courses` 리다이렉트
  - 회원가입 → 자동 로그인 → 강의 목록 리다이렉트
  - 다중 선택 → 수강 신청 → 결과 다이얼로그
