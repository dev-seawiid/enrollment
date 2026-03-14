# Enrollment Frontend Constitution

## Core Principles

### I. Mobile-First, Component-Driven

모바일 웹(max-width 430px)을 기준으로 설계한다. 모든 UI 컴포넌트는 독립적으로 테스트 가능하고 재사용 가능한 단위로 분리한다. 컴포넌트 계층은 `ui/` (원자) → 도메인 컴포넌트 → 페이지 컴포넌트 순으로 조합한다.

### II. Type-Safe Boundaries

시스템 경계(사용자 입력, API 응답)에서 Zod 스키마로 런타임 검증을 강제한다. 폼 입력은 `react-hook-form` + Zod resolver로 검증하고, API 응답은 `ApiClient`의 제네릭 타입 파라미터로 컴파일 타임 + 런타임 안전성을 동시에 확보한다.

### III. Error Classification

에러를 두 종류로 분류한다:

- **RecoverableError** (4xx): 사용자가 조치 가능한 에러. 토스트 또는 다이얼로그로 안내한다.
- **UnrecoverableError** (5xx, 네트워크, 스키마 불일치): 시스템 수준 에러. Error Boundary로 위임한다.

이 분류는 `classifyError()` 유틸리티에서 일관되게 적용한다.

### IV. Server/Client Separation

- **Server**: Server Components, Server Actions에서 `serverApi`로 백엔드 직접 호출. 토큰은 JWT 쿠키에서 추출.
- **Client**: Client Components에서 `apiClient`로 `/api/proxy` 경유 호출. 백엔드 URL이 브라우저에 노출되지 않는다.

인증 토큰은 클라이언트 세션에 노출하지 않고, 서버 사이드에서만 접근한다.

### V. Progressive Enhancement

핵심 기능(인증, 목록 조회, 수강 신청)이 먼저 동작해야 한다. 애니메이션(Framer Motion), 개발 도구(MSW, React Query Devtools)는 지연 로딩한다. 성능 최적화(가상화 등)는 측정 후 필요할 때만 도입한다.

### VI. Testability First

- 스키마 검증은 Unit Test로 커버한다 (Vitest).
- RBAC, 인터랙션은 Component Test로 커버한다 (Testing Library).
- 핵심 사용자 흐름은 E2E Test로 커버한다 (Playwright).
- MSW로 네트워크 계층을 모킹하여 테스트 독립성을 보장한다.

---

## Technical Constraints

| 항목          | 선택                                          |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 16 (App Router)                       |
| Language      | TypeScript (strict)                           |
| Runtime       | React 19 + React Compiler                     |
| Auth          | NextAuth v5 (Credentials + JWT)               |
| Data Fetching | TanStack React Query (client), fetch (server) |
| Styling       | Tailwind CSS v4 + CSS Variables               |
| Validation    | Zod                                           |
| HTTP Client   | Ky                                            |
| Testing       | Vitest + Testing Library + Playwright         |
| Mocking       | MSW (Mock Service Worker)                     |
| Linting       | ESLint + Prettier + Husky + lint-staged       |

---

## Governance

- 이 Constitution은 모든 구현 결정의 기준이 된다.
- Constitution 변경 시 문서 갱신 + 관련 코드 마이그레이션이 동반되어야 한다.
- 복잡도 추가는 측정 가능한 근거가 있을 때만 허용한다 (YAGNI).

**Version**: 1.0.0 | **Ratified**: 2026-03-14
