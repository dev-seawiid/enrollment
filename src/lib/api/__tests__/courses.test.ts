import { describe, it, expect } from "vitest";
import { coursePageSchema } from "../courses";

const VALID_PAGE = {
  content: [
    {
      id: 1,
      title: "React 기초",
      instructorName: "홍길동",
      maxStudents: 30,
      currentStudents: 10,
      availableSeats: 20,
      isFull: false,
      price: 50000,
      createdAt: "2025-01-01T00:00:00",
    },
  ],
  pageable: { pageNumber: 0, pageSize: 20 },
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

describe("coursePageSchema", () => {
  it("정상 응답을 파싱한다", () => {
    const result = coursePageSchema.safeParse(VALID_PAGE);
    expect(result.success).toBe(true);
  });

  it("빈 content 배열도 파싱한다", () => {
    const result = coursePageSchema.safeParse({
      ...VALID_PAGE,
      content: [],
      totalElements: 0,
      totalPages: 0,
    });
    expect(result.success).toBe(true);
  });

  it("content 필드가 누락되면 실패한다", () => {
    const { content: _, ...noContent } = VALID_PAGE;
    const result = coursePageSchema.safeParse(noContent);
    expect(result.success).toBe(false);
  });

  it("course 항목에 필수 필드가 누락되면 실패한다", () => {
    const result = coursePageSchema.safeParse({
      ...VALID_PAGE,
      content: [{ id: 1, title: "React 기초" }],
    });
    expect(result.success).toBe(false);
  });
});
