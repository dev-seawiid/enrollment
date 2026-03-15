<div align="center">

# 수강신청 (Enrollment)

**모바일 웹 기반 강의 수강신청 서비스**

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

[데모](#-데모) · [시작하기](#-시작하기) · [기능](#-기능) · [기술 스택](#-기술-스택) · [프로젝트 구조](#-프로젝트-구조) · [테스트](#-테스트) · [문서](#-문서)

</div>

---

## 🌐 데모

**https://enrollment-three.vercel.app/**

MSW로 API를 모킹한 데모 환경입니다. 백엔드 서버 없이 동작하므로 **아무 이메일과 비밀번호를 입력하면 로그인**할 수 있습니다. 회원가입, 강의 목록, 수강 신청, 강의 개설 등 기본 기능과 UI 구성을 자유롭게 확인해볼 수 있습니다.

---

## 📋 개요

수강생과 강사가 사용하는 강의 수강신청 플랫폼입니다. 회원가입, 로그인, 강의 목록 탐색, 다중 수강 신청, 강사 전용 강의 개설 기능을 제공합니다.

> **모바일 웹 기준**(max-width 430px)으로 설계되었습니다. 데스크톱에서도 모바일 뷰포트로 렌더링됩니다.

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.18 이상
- **pnpm** (패키지 매니저)
- **Docker Desktop** (백엔드 API 서버 실행 시)

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/your-repo/enrollment.git
cd enrollment

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp .env.example .env
```

### 환경 변수

| 변수                      | 설명                                                 | 기본값                      |
| ------------------------- | ---------------------------------------------------- | --------------------------- |
| `AUTH_SECRET`             | NextAuth 쿠키 암호화 키 (`npx auth secret`으로 생성) | —                           |
| `AUTH_TRUST_HOST`         | 배포 환경 호스트 신뢰 설정                           | `true`                      |
| `AUTH_URL`                | 프로젝트 절대 경로                                   | `http://localhost:3000`     |
| `API_BASE_URL`            | 백엔드 API 서버 주소 (서버 전용, 브라우저 미노출)    | `http://localhost:8080/api` |
| `NEXT_PUBLIC_MSW_ENABLED` | MSW 목 서비스 활성화 여부                            | `true`                      |

### 실행

#### 방법 1: MSW 목 모드 (백엔드 없이)

```bash
# .env에서 NEXT_PUBLIC_MSW_ENABLED=true 확인 후
pnpm dev
```

> MSW가 브라우저에서 API를 모킹하여 백엔드 없이 전체 기능을 사용할 수 있습니다.
> 1000개의 랜덤 강의 데이터가 자동 생성됩니다.

#### 방법 2: 백엔드 API 서버 연동

```bash
# 1. 백엔드 서버 실행 (별도 터미널)
docker load -i backend_mock.tar
docker run --rm -p 8080:8080 backend_mock_for_assignment-api:latest

# 2. .env에서 NEXT_PUBLIC_MSW_ENABLED=false 설정 후
pnpm dev
```

앱이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

---

## ✨ 기능

### 기본 기능 (요구사항)

| 기능          | 설명                                                             | 관련 문서                              |
| ------------- | ---------------------------------------------------------------- | -------------------------------------- |
| **회원가입**  | 이름, 이메일, 전화번호, 비밀번호, 역할(수강생/강사) 입력 후 가입 | [US-1](docs/02-frontend/02-specify.md) |
| **로그인**    | 이메일 + 비밀번호 인증, JWT 세션 유지                            | [US-2](docs/02-frontend/02-specify.md) |
| **강의 목록** | 무한 스크롤, 3종 정렬(최근등록순/신청자많은순/신청률높은순)      | [US-3](docs/02-frontend/02-specify.md) |
| **수강 신청** | 다중 선택 → 배치 신청, 부분 성공 지원, 결과 다이얼로그           | [US-4](docs/02-frontend/02-specify.md) |
| **강의 개설** | 강사 전용, 강의명/인원/가격 입력 후 등록                         | [US-5](docs/02-frontend/02-specify.md) |

### 추가 구현 사항

요구사항과 [체크리스트](docs/00-product/02-checklist.md)에 명시되지 않았지만 사용성과 품질을 위해 추가 구현한 항목들입니다.

#### 보안 및 인증

- **이중 API 클라이언트 아키텍처** — 클라이언트는 `/api/proxy` 경유, 서버는 직접 호출. 백엔드 URL이 브라우저에 노출되지 않음
- **RBAC 미들웨어** — Edge Runtime에서 역할 기반 라우트 보호 (수강생 → `/courses/new` 차단)
- **Access Token 서버 격리** — JWT의 accessToken은 클라이언트 세션에 노출하지 않고 서버에서만 추출

#### UX 개선

- **이메일 도메인 자동완성** — `@` 입력 시 gmail, naver, kakao 등 팝오버 표시 (키보드 내비게이션 지원)
- **전화번호 자동 포맷팅** — `01012345678` → `010-1234-5678` (IMask 실시간 변환)
- **가격/인원 천 단위 콤마** — `200000` → `200,000` (IMask 숫자 포맷팅)
- **비밀번호 표시/숨김 토글** — 눈 아이콘으로 비밀번호 확인
- **회원가입 후 자동 로그인** — 가입 완료 시 추가 로그인 없이 강의 목록으로 이동
- **수강률 기반 진행률 바** — 수강률에 따라 색상 변화 (mint → gold → amber → red)

#### 애니메이션

- **페이지 전환 애니메이션** — 인증 페이지 간 부드러운 전환 (Framer Motion + template.tsx)
- **카드 등장 애니메이션** — 강의 카드 staggered entrance
- **배치 신청 바 슬라이드** — 강의 선택 시 하단 바 슬라이드업 등장
- **총 금액 스프링 애니메이션** — 선택 변경 시 금액이 자연스럽게 전환 (AnimatedNumber)
- **역할 토글 애니메이션** — 수강생 ↔ 강사 선택 시 부드러운 전환

#### 에러 처리

- **에러 이분 분류 체계** — RecoverableError(4xx, 사용자 안내) vs UnrecoverableError(5xx, Error Boundary)
- **부분 성공 결과 표시** — 배치 신청 시 성공/실패 항목을 구분하여 다이얼로그로 안내
- **실패 시 대안 강의 추천** — 전체 실패 시 대안 강의 캐러셀(Swiper) 제안
- **강의 상세 다이얼로그** — 카드의 (?) 버튼으로 API 기반 상세 정보 확인
- **글로벌 + 페이지별 Error Boundary** — 에러 격리로 전체 앱 크래시 방지

#### 개발 환경

- **MSW 기반 오프라인 개발** — 1000개 목 데이터로 백엔드 없이 전체 플로우 개발/테스트
- **React Compiler 활성화** — 자동 메모이제이션으로 불필요한 리렌더 최소화
- **Framer Motion 지연 로딩** — LazyMotion으로 번들 사이즈 최적화
- **Pre-commit Hook** — ESLint + Prettier + TypeScript 타입 체크 자동 실행

#### 타입 안전성

- **Zod 런타임 검증** — 모든 폼 입력과 API 응답을 스키마로 검증
- **ApiClient 제네릭** — 컴파일 타임 타입 추론 + 런타임 파싱을 동시에 보장
- **NextAuth 타입 확장** — Session/JWT에 role, phone, accessToken 타입 안전하게 추가

---

## 기술 스택

| 분류              | 기술                                    |
| ----------------- | --------------------------------------- |
| **Framework**     | Next.js 16 (App Router, React Compiler) |
| **Language**      | TypeScript (strict mode)                |
| **Runtime**       | React 19                                |
| **Auth**          | NextAuth v5 (Credentials + JWT)         |
| **Data Fetching** | TanStack React Query v5, Server Actions |
| **HTTP Client**   | Ky + Zod schema validation              |
| **Styling**       | Tailwind CSS v4 + CSS Variables         |
| **Validation**    | Zod + react-hook-form                   |
| **Animation**     | Framer Motion (LazyMotion)              |
| **Dialog**        | Radix UI + overlay-kit                  |
| **Input Masking** | IMask                                   |
| **Testing**       | Vitest + Testing Library + Playwright   |
| **Mocking**       | MSW (Mock Service Worker)               |
| **Code Quality**  | ESLint + Prettier + Husky + lint-staged |

---

## 프로젝트 구조

```
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

> 자세한 아키텍처 결정 배경과 의존성 그래프는 [Implementation Plan](docs/02-frontend/03-plan.md)을 참고하세요.

---

## 테스트

```bash
# 전체 테스트 실행
pnpm test

# 워치 모드
pnpm test:watch

# 타입 체크
pnpm type-check
```

### 테스트 현황

| 유형          | 도구                     | 케이스 | 상태         |
| ------------- | ------------------------ | ------ | ------------ |
| **Unit**      | Vitest                   | 40     | ✅ 작성 완료 |
| **Component** | Vitest + Testing Library | 10     | ✅ 작성 완료 |
| **E2E**       | Playwright               | 5      | ⬜ 미작성    |

**Unit** — 스키마 유효성 검증 (signup 27개, login 3개, course 6개) + API 응답 파싱 (4개)

**Component** — RBAC 버튼 노출 (3개), 정렬 탭 콜백 (2개), 카드 인터랙션 (3개), 비밀번호 토글 (2개)

> 자세한 테스트 목록은 [테스트 계획](docs/02-frontend/05-test.md)을 참고하세요.

---

## 문서

이 프로젝트는 [spec-kit](https://github.com/github/spec-kit) 기반의 문서 체계를 따릅니다.

| 문서                                                | 설명                                      |
| --------------------------------------------------- | ----------------------------------------- |
| [Requirements](docs/00-product/01-requirements.md)  | 서비스 요구사항 정의                      |
| [Checklist](docs/00-product/02-checklist.md)        | 구현 항목 체크리스트                      |
| [Backend API](docs/01-backend/api.md)               | 백엔드 API 명세 (7개 엔드포인트)          |
| [Constitution](docs/02-frontend/01-constitution.md) | 프로젝트 핵심 원칙 (6개 원칙 + 기술 제약) |
| [Specification](docs/02-frontend/02-specify.md)     | 기능 명세 (5개 User Story + 11개 FR)      |
| [Plan](docs/02-frontend/03-plan.md)                 | 구현 계획 (아키텍처 결정 + 프로젝트 구조) |
| [Tasks](docs/02-frontend/04-tasks.md)               | 태스크 분해 (24개 커밋 단위)              |
| [Test Plan](docs/02-frontend/05-test.md)            | 테스트 계획 및 현황                       |
| [TODO](docs/02-frontend/06-todo.md)                 | 향후 개선 사항                            |

---

## 스크립트

| 명령어            | 설명                        |
| ----------------- | --------------------------- |
| `pnpm dev`        | 개발 서버 실행              |
| `pnpm build`      | 프로덕션 빌드               |
| `pnpm start`      | 프로덕션 서버 실행          |
| `pnpm lint`       | ESLint + Prettier 자동 수정 |
| `pnpm type-check` | TypeScript 타입 검사        |
| `pnpm test`       | 테스트 실행 (1회)           |
| `pnpm test:watch` | 테스트 워치 모드            |

---

## 트러블슈팅

### `Error: no matching decryption secret`

**증상**: Server Action 호출 시 500 에러와 함께 `no matching decryption secret` 메시지 출력

**원인**: 브라우저에 저장된 JWT 세션 쿠키가 현재 `AUTH_SECRET`과 다른 secret으로 암호화되어 복호화 실패

주로 다음 상황에서 발생합니다:

- `AUTH_SECRET` 값을 변경하거나 `npx auth secret`을 재실행한 경우
- `.env` 파일 없이 서버를 시작하여 NextAuth가 임시 secret을 자동 생성한 경우 (재시작마다 값이 달라짐)

**해결 방법**:

1. 브라우저 개발자 도구(F12) → Application → Cookies → `authjs.session-token` 쿠키 삭제
2. 다시 로그인

> **팁**: 시크릿 탭(Incognito)에서 테스트하면 쿠키 충돌 없이 빠르게 확인할 수 있습니다.

> **예방**: `AUTH_SECRET`은 한 번 설정한 후 변경하지 않는 것이 좋습니다. `npx auth secret`을 반복 실행하면 기존 세션이 모두 무효화됩니다.
