# Implementation Plan: 수강신청 Frontend

**Branch**: `temp` | **Date**: 2026-03-14 | **Spec**: `docs/02-frontend/02-specify.md`

---

## Summary

모바일 웹 기반 수강신청 서비스의 프론트엔드를 구현한다. Next.js 16 App Router + React 19 환경에서 인증(NextAuth v5), 강의 CRUD, 배치 수강 신청 기능을 제공한다. Server/Client 분리 아키텍처로 보안을 확보하고, Zod 스키마 검증으로 타입 안전성을 보장한다.

---

## Technical Context

| 항목             | 값                                               |
| ---------------- | ------------------------------------------------ |
| Language/Version | TypeScript 5.x (strict)                          |
| Framework        | Next.js 16.1.6 (App Router, React Compiler)      |
| Runtime          | React 19.2.3                                     |
| Auth             | NextAuth v5 (beta) — Credentials + JWT strategy  |
| Data Fetching    | TanStack React Query v5 (client), Server Actions |
| HTTP Client      | Ky (Zod 스키마 연동 ApiClient 래퍼)              |
| Styling          | Tailwind CSS v4 + CSS Variables (다크 테마)      |
| Validation       | Zod + react-hook-form                            |
| Animation        | Framer Motion (LazyMotion 지연 로딩)             |
| Dialog           | Radix UI + overlay-kit                           |
| Input Masking    | IMask (전화번호, 가격 포맷팅)                    |
| Testing          | Vitest + @testing-library/react + Playwright     |
| Mocking          | MSW (Mock Service Worker)                        |
| Target Platform  | 모바일 웹 (max-width: 430px)                     |

---

## Constitution Check

| 원칙                       | 충족 여부 | 비고                                          |
| -------------------------- | --------- | --------------------------------------------- |
| I. Mobile-First            | ✅        | max-w-md 컨테이너, safe-area-inset 대응       |
| II. Type-Safe Boundaries   | ✅        | Zod 폼/응답 스키마, ApiClient 제네릭          |
| III. Error Classification  | ✅        | classifyError() → Recoverable / Unrecoverable |
| IV. Server/Client 분리     | ✅        | serverApi (direct) / apiClient (/api/proxy)   |
| V. Progressive Enhancement | ✅        | LazyMotion, dynamic import, 측정 후 최적화    |
| VI. Testability            | ✅        | Unit 40 + Component 10 + E2E 계획 수립        |

---

## Architecture Decisions

### AD-1: 이중 API 클라이언트 (Client/Server 분리)

```
Browser ──→ apiClient ──→ /api/proxy/* (Next.js rewrite) ──→ Backend
Server  ──→ serverApi ──→ API_BASE_URL/* (직접 호출)     ──→ Backend
```

**Why**: 백엔드 URL을 브라우저에 노출하지 않기 위함. Next.js의 `rewrites`로 프록시하여 CORS 문제도 해결.

### AD-2: NextAuth Credentials + JWT

- Credentials Provider로 이메일/비밀번호 인증
- JWT 전략으로 accessToken을 쿠키에 저장
- `auth.config.ts`에서 RBAC 로직 분리 (Edge-safe)

**Why**: 백엔드가 자체 JWT를 발급하므로 OAuth 불필요. Edge middleware에서 라우트 보호 가능.

### AD-3: Error Boundary + overlay-kit 이중 에러 처리

```
API 에러 → classifyError()
  ├─ RecoverableError → overlay.open(ErrorDialog) 또는 toast
  └─ UnrecoverableError → throw → Error Boundary (error.tsx)
```

**Why**: 사용자 조치 가능 에러와 시스템 에러를 UX 수준에서 분리.

### AD-4: Set 기반 다중 선택 + 배치 신청

- `useCourseSelection`: `Set<number>`로 선택 상태 관리
- `useBatchEnroll`: mutation + 결과/에러 다이얼로그 통합
- 부분 성공(partial success) 지원: 성공/실패를 분리하여 표시

**Why**: 요구사항의 "여러 개를 선택하여 한 번에 신청" + 백엔드의 부분 성공 응답 대응.

### AD-5: 가상화 미적용 (측정 기반 결정)

- MSW로 1000개 카드 테스트 → 프레임 드랍 없음
- react-virtuoso 설치했으나 사용하지 않음
- 스크롤 복원, Ctrl+F, 접근성 이슈가 가상화의 이점보다 큼

**Why**: Constitution V (Progressive Enhancement) — 측정 후 필요할 때만 도입.

---

## Project Structure

```text
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 라우트 그룹
│   │   ├── layout.tsx            # 인증 페이지 공통 레이아웃
│   │   ├── template.tsx          # 페이지 전환 애니메이션
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── courses/
│   │   ├── page.tsx              # 강의 목록 (SSR + Client)
│   │   ├── new/page.tsx          # 강의 개설 (INSTRUCTOR only)
│   │   └── error.tsx             # 코스 에러 바운더리
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx                # Root 레이아웃 (프로바이더 트리)
│   ├── page.tsx                  # / → /courses 리다이렉트
│   ├── error.tsx                 # 글로벌 에러 바운더리
│   ├── not-found.tsx
│   └── globals.css               # 테마 변수 + 베이스 스타일
│
├── auth.ts                       # NextAuth 설정 (Credentials Provider)
├── auth.config.ts                # RBAC + JWT/Session 콜백 (Edge-safe)
├── proxy.ts                      # Auth Middleware (라우트 보호)
│
├── components/
│   ├── ui/                       # 원자 UI 컴포넌트
│   ├── courses/                  # 강의 도메인 컴포넌트
│   ├── dialogs/                  # 다이얼로그 컴포넌트
│   ├── providers/                # Context Provider 래퍼
│   ├── login-form.tsx
│   └── signup-form.tsx
│
├── hooks/                        # 커스텀 훅 (상태/사이드이펙트)
│
├── lib/
│   ├── api/                      # HTTP 클라이언트 + 응답 스키마
│   ├── actions/                  # Server Actions
│   ├── schemas/                  # 폼 유효성 검증 스키마
│   └── (utils)                   # 유틸리티 함수
│
├── mocks/                        # MSW 핸들러 + 설정
└── types/                        # TypeScript 타입 확장
```

---

## Dependency Graph

```text
Root Layout
├── SessionProvider (NextAuth)
├── MSWProvider (dev only, lazy)
├── QueryProvider (React Query)
├── OverlayProvider (overlay-kit)
└── MotionProvider (Framer Motion, lazy)

/login, /signup
└── LoginForm / SignupForm
    ├── UI Components (EmailInput, PasswordInput, MaskedInput)
    └── api/auth.ts → signup()

/courses
└── CoursesView
    ├── CoursesHeader (RBAC + 정렬)
    ├── CourseList (무한 스크롤)
    │   └── SelectableCourseCard
    ├── BatchEnrollBar (선택 요약)
    └── useBatchEnroll → batchEnrollAction (Server Action)

/courses/new
└── NewCourseForm
    └── createCourseAction (Server Action)
```
