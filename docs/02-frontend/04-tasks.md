# Task List: 수강신청 Frontend

**Spec**: `02-specify.md` | **Plan**: `03-plan.md` | **Date**: 2026-03-14

> 각 Task는 하나의 커밋 단위에 대응한다.
> `[P]` 표시는 이전 태스크와 병렬 실행 가능을 의미한다.
> 각 Phase는 이전 Phase 완료를 전제로 한다.

---

## Phase 0 — Project Setup

> 개발 환경 초기화. 코드 품질 도구와 의존성을 확보한다.

- [ ] `P0-01` 프로젝트 초기화 (Next.js 16, TypeScript, App Router)
- [ ] `P0-02` 핵심 의존성 설치 (React Query, Zod, Ky, Framer Motion, NextAuth, MSW 등)
- [ ] `P0-03` Prettier + Tailwind CSS 플러그인 구성
- [ ] `P0-04` Husky + lint-staged로 pre-commit hook 설정 (ESLint, Prettier, tsc)
- [ ] `P0-05` `.env.example` 생성 및 `.gitignore` 업데이트

---

## Phase 1 — Foundation

> 모든 기능 구현의 기반이 되는 인프라.
> 이 Phase가 완료되어야 어떤 User Story든 시작할 수 있다.

### `P1-01` 디자인 시스템 및 글로벌 스타일

- [ ] CSS 변수 기반 다크 테마 팔레트 정의 (gold, ivory, steel, mint, danger 등)
- [ ] 웹폰트 로드 (본문: Noto Sans KR, 헤딩: Playfair Display)
- [ ] 모바일 기준 base 스타일 (max-width, safe-area-inset, 스크롤바)
- [ ] 기본 Next.js 보일러플레이트 에셋 제거

**Checkpoint**: globals.css에 테마 변수가 정의되고, 빈 페이지에서 폰트와 배경색이 올바르게 렌더링된다.

### `P1-02` 유틸리티 및 타입 기반

- [ ] `cn()` 유틸 (clsx + tailwind-merge) 구현
- [ ] NextAuth 타입 확장 — Session/JWT에 `role`, `phone`, `accessToken` 추가

**Checkpoint**: TypeScript에서 `session.user.role` 접근 시 타입 에러 없음.

### `P1-03` API 클라이언트 아키텍처

Plan의 AD-1 (이중 API 클라이언트)과 AD-3 (에러 분류)를 구현한다.

- [ ] Ky 기반 ApiClient 팩토리 구현 — Zod 스키마를 제네릭으로 받아 응답을 런타임 검증
- [ ] Client-side 인스턴스 생성 (`/api/proxy` prefix, 브라우저에서 사용)
- [ ] Server-side 인스턴스 생성 (`API_BASE_URL` prefix, 서버 컴포넌트/액션에서 사용)
- [ ] RecoverableError / UnrecoverableError 에러 클래스 정의
- [ ] `classifyError()` — HTTP 상태 코드 기반 에러 분류 유틸
- [ ] `showErrorDialog()` — 에러 분류 후 다이얼로그 또는 Error Boundary로 위임하는 유틸

**Checkpoint**: `apiClient.get(url, schema)` 호출 시 Zod parse 성공하면 타입 추론, 실패하면 UnrecoverableError throw.

### `P1-04` [P] Provider 인프라

Root Layout에 필요한 Context Provider 래퍼들을 구현한다.

- [ ] NextAuth SessionProvider 래퍼
- [ ] React Query Provider + QueryClient 설정 (staleTime, retry)
- [ ] overlay-kit OverlayProvider 래퍼
- [ ] Framer Motion LazyMotion Provider (domMax 지연 로딩)
- [ ] MSW 초기화 Provider (dev/test 환경 전용, 조건부 활성화)
- [ ] React Query DevTools (dev 전용, dynamic import)

**Checkpoint**: Provider를 중첩 조합한 트리가 에러 없이 렌더링된다.

### `P1-05` [P] Base UI 컴포넌트 라이브러리

도메인 컴포넌트에서 재사용할 원자 UI 컴포넌트를 구현한다. 모두 `forwardRef` 지원.

- [ ] Input — 기본 텍스트 입력. 에러 상태 시 빨간 테두리 + 포커스 시 금색 테두리
- [ ] Label — `htmlFor` 연결
- [ ] FormField — Label + Input + 에러 메시지를 조합하는 래퍼 (필수 표시, 배지 등)
- [ ] EmailInput — `@` 입력 시 도메인 자동완성 팝오버 (gmail, naver, kakao 등)
- [ ] PasswordInput — 표시/숨김 토글 버튼 포함
- [ ] MaskedInput — IMask 기반 입력 마스킹 (전화번호: `000-0000-0000`)
- [ ] NumberInput — IMask 숫자 포맷팅 (천 단위 콤마) + prefix/suffix 지원
- [ ] Textarea — 리사이즈 비활성화, 줄 간격 조정
- [ ] Dialog — Radix UI Dialog를 다크 테마에 맞게 래핑 (fade + zoom 애니메이션)
- [ ] Skeleton — 펄스 로딩 플레이스홀더
- [ ] AnimatedNumber — Framer Motion spring으로 숫자 전환 애니메이션
- [ ] LoadingDots — 3-dot 펄스 로딩 인디케이터
- [ ] BackButton — `router.back()` 연결된 뒤로가기 버튼

**Checkpoint**: 각 컴포넌트를 독립적으로 렌더링할 수 있고, 에러 상태/포커스 상태 전환이 동작한다.

### `P1-06` Root Layout 및 앱 진입점

- [ ] Root Layout에서 Provider 트리 조합 (P1-04의 모든 Provider 중첩)
- [ ] 홈 라우트(`/`)에서 `/courses`로 리다이렉트
- [ ] next.config에 React Compiler 활성화 + `/api/proxy` → 백엔드 rewrite 규칙 설정

**Checkpoint**: `pnpm dev` 실행 시 `/`에서 `/courses`로 리다이렉트되고, Provider 에러 없이 페이지 렌더링된다.

---

## Phase 2 — Authentication (US-1, US-2)

> 로그인/회원가입 기능. Phase 3(강의 관련)의 전제 조건.

### `P2-01` Auth 설정 및 미들웨어

Plan의 AD-2 (NextAuth Credentials + JWT)를 구현한다.

- [ ] NextAuth v5 Credentials Provider 설정 — 이메일/비밀번호로 백엔드 로그인 API 호출
- [ ] JWT 콜백 — 로그인 응답의 accessToken, role, phone을 JWT에 저장
- [ ] Session 콜백 — role, phone을 클라이언트 세션에 노출 (accessToken은 서버에만)
- [ ] RBAC 미들웨어 — 비로그인 → `/login` 리다이렉트, 수강생 → `/courses/new` 차단, 로그인 상태 → auth 페이지 → `/courses` 리다이렉트
- [ ] 서버 사이드 토큰 추출 유틸 — JWT 쿠키에서 accessToken을 꺼내는 헬퍼

**Checkpoint**: 비로그인 상태에서 `/courses` 접근 시 `/login`으로 리다이렉트된다. (FR-005)

### `P2-02` [P] Auth 폼 스키마 및 테스트

- [ ] 로그인 스키마 — 이메일 (RFC 5322 형식), 비밀번호 (필수)
- [ ] 회원가입 스키마 — 이름(필수), 이메일, 전화번호(10~11자리 → 하이픈 자동 삽입), 비밀번호(6~10자, 영문 소/대문자+숫자 중 2종 이상), 비밀번호 확인(일치 검증), 역할(STUDENT/INSTRUCTOR)
- [ ] 로그인 스키마 단위 테스트 작성
- [ ] 회원가입 스키마 단위 테스트 작성 — 비밀번호 복합 규칙의 경계값 집중 테스트

**Checkpoint**: `signupSchema.parse()`에서 비밀번호 `"abc123"`은 통과, `"abcdef"`(숫자 없음)는 실패. (FR-002)

### `P2-03` [P] Auth API 레이어

- [ ] 회원가입 API 함수 구현 — POST `/users/signup` 호출, Zod로 응답 검증

**Checkpoint**: signup 함수 호출 시 201 응답을 파싱하고, 409(중복 이메일) 시 RecoverableError를 던진다.

### `P2-04` Auth 페이지 및 폼 컴포넌트

P2-01, P2-02, P2-03 완료 후 시작.

- [ ] Auth 라우트 그룹 레이아웃 — 중앙 정렬 + 배경 앰비언트 글로우 효과
- [ ] 페이지 전환 애니메이션 (template.tsx 활용)
- [ ] 로그인 폼 — EmailInput + PasswordInput + react-hook-form + Zod resolver, 에러 시 토스트 알림
- [ ] 회원가입 폼 — MaskedInput(전화번호) + 역할 토글 애니메이션 + 가입 성공 시 자동 로그인 → `/courses`
- [ ] 로그인/회원가입 페이지 간 네비게이션 링크

**Checkpoint**: 회원가입 완료 시 자동 로그인되어 `/courses`로 이동한다. (US-1 Scenario 1)

---

## Phase 3 — Course Management (US-3, US-5)

> 강의 목록 조회 + 강의 개설. Phase 2 완료 후 시작.

### `P3-01` Course 스키마 및 API

- [ ] 강의 개설 폼 스키마 — 강의명(필수), 최대 수강 인원(≥1, 정수), 가격(≥0, 정수)
- [ ] 강의 목록/상세 API 응답 스키마 정의 (Zod) — courseSchema, coursePageSchema, courseDetailSchema
- [ ] 강의 목록 fetch 함수 — GET `/courses?page&size&sort` + 페이지네이션 응답 파싱
- [ ] 강의 상세 fetch 함수 — GET `/courses/:id`
- [ ] 스키마 + API 응답 파싱 단위 테스트 작성

**Checkpoint**: `fetchCourses({ page: 0, sort: "recent" })` 호출 시 CoursePage 타입이 반환된다. (FR-006, FR-007)

### `P3-02` Course 카드 컴포넌트

- [ ] 선택 가능한 카드 — 체크박스 + 선택 시 글로우 이펙트 + 클릭으로 토글
- [ ] 카드 정보 표시 — 강의명, 강사명, 수강 현황(N/M), 가격(포맷팅)
- [ ] 진행률 바 — 수강률에 따라 색상 변화 (mint → gold → amber → red)
- [ ] 상태 뱃지 — "마감"(정원 초과 시, 선택 비활성화), "신청완료"(이미 신청한 경우)
- [ ] 상세보기 버튼 — 카드 선택과 이벤트 분리 (stopPropagation)
- [ ] 카드 스켈레톤 — 로딩 중 표시할 플레이스홀더
- [ ] 컴포넌트 테스트 — 마감 시 선택 차단, 일반 카드 토글, 상세 버튼 이벤트 분리

**Checkpoint**: 마감된 강의 카드를 클릭해도 onToggle이 호출되지 않는다. (FR-009)

### `P3-03` Course 목록 및 헤더

- [ ] 헤더 컴포넌트 — 사용자명 + 역할 뱃지, 로그아웃 버튼, 정렬 탭 (최근 등록순/신청자 많은 순/신청률 높은 순)
- [ ] RBAC 적용 — 강사일 때만 "강의 개설" 버튼 노출, 비로그인 시 "로그인" 버튼 표시
- [ ] 목록 컴포넌트 — 카드 배열 렌더링 + 등장 애니메이션 (staggered)
- [ ] 목록 오케스트레이터 — 정렬 상태 + 무한 스크롤 쿼리 + 선택 상태를 관리하고 하위 컴포넌트에 전달
- [ ] 헤더 컴포넌트 테스트 — 역할별 버튼 노출/비노출, 정렬 탭 콜백

**Checkpoint**: 수강생 로그인 시 "강의 개설" 버튼이 보이지 않는다. (FR-010)

### `P3-04` Course 페이지 및 강의 개설 폼

P3-01 ~ P3-03 완료 후 시작.

- [ ] 강의 목록 페이지 — 서버 컴포넌트에서 초기 데이터 prefetch, 클라이언트에서 무한 스크롤
- [ ] 강의 개설 페이지 (INSTRUCTOR 전용) — 폼 입력 + 실시간 프리뷰 카드
- [ ] 강의 개설 폼 — NumberInput(가격, 인원), Textarea(설명), 등록 전 확인 다이얼로그
- [ ] 강의 개설 Server Action — 세션에서 role 검증 + accessToken으로 POST `/courses`
- [ ] 강의 확인 다이얼로그 — 입력 내용 요약 → "등록하기" 확인

**Checkpoint**: 강사로 로그인 후 강의 등록 시 확인 다이얼로그 → 등록 → `/courses` 리다이렉트. (US-5 Scenario 2)

---

## Phase 4 — Enrollment (US-4)

> 다중 선택 + 배치 수강 신청. Phase 3 완료 후 시작.

### `P4-01` Enrollment 로직 (훅 + Server Action)

Plan의 AD-4 (Set 기반 다중 선택 + 배치 신청)를 구현한다.

- [ ] 배치 수강 신청 Server Action — accessToken으로 POST `/enrollments/batch`, 부분 성공 응답 스키마 파싱
- [ ] `useCourseSelection` 훅 — Set\<number\> 기반 선택 상태 관리. 마감 강의 선택 차단. `selectedCount`, `totalPrice` 파생값 제공
- [ ] `useBatchEnroll` 훅 — useMutation 래핑. 성공 시 선택 초기화 + 캐시 무효화 + 결과 다이얼로그 표시, 실패 시 에러 다이얼로그
- [ ] `useInfiniteScroll` 훅 — Intersection Observer로 sentinel 요소 감지, rootMargin 200px로 프리페치

**Checkpoint**: 3개 강의 선택 → 수강 신청 → 2개 성공 / 1개 실패 시, 결과 다이얼로그에 구분 표시된다. (US-4 Scenario 3)

### `P4-02` 배치 신청 UI (바 + 다이얼로그)

- [ ] 배치 신청 바 — 하단 고정, 선택 시 슬라이드업 등장, 선택 개수 + 총 금액(AnimatedNumber) 표시
- [ ] 수강 신청 결과 다이얼로그 — 성공/실패 항목 구분 표시 + "확인" 버튼
- [ ] 수강 신청 에러 다이얼로그 — 실패 사유 표시 + 대안 강의 캐러셀 (Swiper) 제안
- [ ] 강의 상세 다이얼로그 — 카드의 상세보기(?) 버튼 클릭 시 강의 상세 API 호출하여 표시
- [ ] 범용 에러 다이얼로그 — RecoverableError를 사용자에게 안내하는 공통 컴포넌트

**Checkpoint**: 강의 선택 후 하단에 "N개 선택 · 총 ₩XX,000" 바가 표시되고, 수강 신청 결과를 확인할 수 있다. (US-4 Scenario 1, 2)

---

## Phase 5 — Polish & Infrastructure

### `P5-01` MSW Mock 환경 구성

백엔드 없이 전체 기능을 개발/테스트할 수 있는 목 환경을 구성한다.

- [ ] MSW 브라우저 워커 설정 (dev 환경 전용)
- [ ] MSW 테스트 서버 설정 (Vitest 통합)
- [ ] API 핸들러 구현 — 회원가입/로그인/강의 목록/상세/개설/배치 수강신청
- [ ] 목 데이터 생성 — 대량(~1000개) 강의 데이터 + 랜덤 수강률 + 마감 강의 포함
- [ ] Vitest 설정 및 테스트 셋업 (MSW 서버 lifecycle, 모킹)

**Checkpoint**: `NEXT_PUBLIC_MSW_ENABLED=true`로 실행 시 백엔드 없이 전체 플로우 동작.

### `P5-02` [P] 에러 바운더리 및 404

- [ ] 글로벌 Error Boundary — UnrecoverableError catch + 재시도 버튼
- [ ] 강의 페이지 전용 Error Boundary — 강의 관련 에러 격리
- [ ] 404 Not Found 페이지

**Checkpoint**: 존재하지 않는 경로 접근 시 404 페이지 표시. 서버 에러 시 Error Boundary가 동작.

### `P5-03` [P] PasswordInput 컴포넌트 테스트

- [ ] 초기 상태 type=password 확인
- [ ] 토글 클릭 시 password ↔ text 전환 확인
- [ ] 비밀번호 표시 상태에서 다시 숨김 전환 확인

**Checkpoint**: 3개 테스트 케이스 모두 통과.

---

## Execution Order & Dependencies

```text
Phase 0 (완료)
    │
    ▼
Phase 1: Foundation ─────────────────────────
    P1-01 → P1-02 → P1-03 ──→ P1-06
                      │
              P1-04 ──┤ (parallel)
              P1-05 ──┘
    │
    ▼
Phase 2: Authentication ─────────────────────
    P2-01 ──────────→ P2-04
    P2-02 ──┐ (parallel)
    P2-03 ──┘
    │
    ▼
Phase 3: Course Management ──────────────────
    P3-01 → P3-02 → P3-03 → P3-04
    │
    ▼
Phase 4: Enrollment ─────────────────────────
    P4-01 → P4-02
    │
    ▼
Phase 5: Polish ─────────────────────────────
    P5-01 ──┐
    P5-02 ──┤ (parallel)
    P5-03 ──┘
```

---

## Strategy

**권장: Incremental Delivery**

각 Phase 완료 시점에 동작하는 결과물이 있어야 한다:

| Phase 완료 시점 | 확인 가능한 결과                                |
| --------------- | ----------------------------------------------- |
| Phase 1         | 빈 앱이 에러 없이 렌더링, `/courses` 리다이렉트 |
| Phase 2         | 회원가입 → 자동 로그인 → 강의 목록 진입         |
| Phase 3         | 강의 목록 조회 + 정렬 + 강사의 강의 개설        |
| Phase 4         | 다중 선택 수강 신청 + 결과 확인                 |
| Phase 5         | 백엔드 없이 MSW로 전체 플로우 동작              |

---

## Summary

| Phase  | Tasks  | 커밋 수 | Story Coverage       |
| ------ | ------ | ------- | -------------------- |
| 0      | 5      | 5       | —                    |
| 1      | 6      | 6       | 공통 인프라          |
| 2      | 4      | 4       | US-1, US-2           |
| 3      | 4      | 4       | US-3, US-5           |
| 4      | 2      | 2       | US-4                 |
| 5      | 3      | 3       | 품질/인프라          |
| **계** | **24** | **24**  | **US-1 ~ US-5 전체** |
