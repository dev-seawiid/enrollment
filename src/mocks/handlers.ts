import { http, HttpResponse } from "msw";

const API_BASE = "/api/proxy";

// ── Random Course Generator ──

const TITLES = [
  "부동산 투자 기초",
  "주식 투자 입문",
  "재테크 마스터 클래스",
  "부동산 경매 실전",
  "ETF 투자 전략",
  "가치투자 완전정복",
  "월급쟁이 재테크",
  "내집마련 로드맵",
  "소액 부동산 투자",
  "배당주 투자 전략",
  "암호화폐 기초",
  "연금 설계 가이드",
  "절세 전략 마스터",
  "갭투자 실전 노하우",
  "상가 투자 입문",
  "토지 투자 기초",
  "리츠(REITs) 투자",
  "해외주식 투자 가이드",
  "금융 상품 비교 분석",
  "경제 흐름 읽기",
  "P2P 투자 전략",
  "창업 투자론",
  "벤처 투자 기초",
  "부동산 세금 완전정복",
  "아파트 분양권 투자",
  "재건축 투자 전략",
  "임대사업자 가이드",
  "주식 차트 분석",
  "선물옵션 기초",
  "부동산 개발 입문",
];

const INSTRUCTORS = [
  "김투자",
  "이주식",
  "박재테크",
  "최경매",
  "정ETF",
  "한부동산",
  "오재무",
  "강자산",
  "유배당",
  "신월급",
  "임소액",
  "송절세",
];

const DESCRIPTIONS = [
  "기본 개념부터 실전 전략까지 체계적으로 배웁니다.",
  "초보자도 쉽게 이해할 수 있는 입문 강의입니다.",
  "실제 사례를 중심으로 핵심 노하우를 전달합니다.",
  "단계별 학습으로 전문가 수준의 역량을 키웁니다.",
  "최신 트렌드를 반영한 실전 위주의 강의입니다.",
  "현직 전문가가 직접 알려주는 실무 강의입니다.",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCourses(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const maxStudents = rand(5, 50);
    const currentStudents = rand(0, maxStudents);
    const isFull = currentStudents >= maxStudents;
    const price = rand(5, 40) * 10000;
    const daysAgo = rand(0, 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id,
      title: `${pick(TITLES)} ${id > TITLES.length ? `(${id})` : ""}`.trim(),
      description: pick(DESCRIPTIONS),
      instructorName: pick(INSTRUCTORS),
      maxStudents,
      currentStudents,
      availableSeats: maxStudents - currentStudents,
      isFull,
      price,
      createdAt: date.toISOString(),
    };
  });
}

const MOCK_COURSES = generateCourses(1000).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

const enrolled = new Set<string>();

// ── Handlers ──

export const handlers = [
  // 회원가입
  http.post(`${API_BASE}/users/signup`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json(
      {
        id: Date.now(),
        email: body.email,
        name: body.name,
        phone: body.phone,
        role: body.role,
        message: "회원가입이 완료되었습니다",
      },
      { status: 201 },
    );
  }),

  // 로그인
  http.post(`${API_BASE}/users/login`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json({
      accessToken: "mock-jwt-token",
      tokenType: "Bearer",
      user: {
        id: 1,
        email: body.email,
        name: "테스트유저",
        phone: "010-1234-5678",
        role: "INSTRUCTOR",
      },
    });
  }),

  // 강의 목록 조회
  http.get(`${API_BASE}/courses`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const sort = url.searchParams.get("sort") ?? "recent";

    // 첫 페이지는 빠르게, 추가 로드는 800~1500ms 지연
    if (page > 0) {
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    }

    const sorted = [...MOCK_COURSES];
    if (sort === "popular") {
      sorted.sort((a, b) => b.currentStudents - a.currentStudents);
    } else if (sort === "rate") {
      sorted.sort((a, b) => b.currentStudents / b.maxStudents - a.currentStudents / a.maxStudents);
    }

    const start = page * size;
    const content = sorted.slice(start, start + size);

    return HttpResponse.json({
      content,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: sorted.length,
      totalPages: Math.ceil(sorted.length / size),
      first: page === 0,
      last: start + size >= sorted.length,
    });
  }),

  // 강의 상세 조회
  http.get(`${API_BASE}/courses/:courseId`, ({ params }) => {
    const course = MOCK_COURSES.find((c) => c.id === Number(params.courseId));
    if (!course) {
      return HttpResponse.json(
        { code: "C001", message: "강의를 찾을 수 없습니다" },
        { status: 404 },
      );
    }
    return HttpResponse.json(course);
  }),

  // 강의 등록
  http.post(`${API_BASE}/courses`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newCourse = {
      id: MOCK_COURSES.length + 1,
      ...body,
      currentStudents: 0,
      availableSeats: body.maxStudents as number,
      isFull: false,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newCourse, { status: 201 });
  }),

  // 배치 수강 신청
  http.post(`${API_BASE}/enrollments/batch`, async ({ request }) => {
    const body = (await request.json()) as { courseIds: number[] };
    const success: { enrollmentId: number; courseId: number; courseTitle: string }[] = [];
    const failed: { courseId: number; reason: string }[] = [];

    for (const courseId of body.courseIds) {
      const course = MOCK_COURSES.find((c) => c.id === courseId);
      if (!course) {
        failed.push({ courseId, reason: "강의를 찾을 수 없습니다" });
      } else if (course.isFull) {
        failed.push({ courseId, reason: "수강 정원이 초과되었습니다" });
      } else if (enrolled.has(`1-${courseId}`)) {
        failed.push({ courseId, reason: "이미 수강 신청한 강의입니다" });
      } else {
        enrolled.add(`1-${courseId}`);
        success.push({ enrollmentId: Date.now() + courseId, courseId, courseTitle: course.title });
      }
    }

    return HttpResponse.json({ success, failed });
  }),
];
