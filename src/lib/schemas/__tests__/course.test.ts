import { describe, it, expect } from "vitest";
import { courseSchema } from "../course";

const VALID_INPUT = {
  title: "React 기초",
  description: "리액트를 배워봅시다",
  maxStudents: 30,
  price: 50000,
};

describe("courseSchema", () => {
  it("유효한 입력을 통과시킨다", () => {
    const result = courseSchema.safeParse(VALID_INPUT);
    expect(result.success).toBe(true);
  });

  it("강의명이 빈 문자열이면 실패한다", () => {
    const result = courseSchema.safeParse({ ...VALID_INPUT, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path[0] === "title");
      expect(error?.message).toBe("강의명을 입력해주세요");
    }
  });

  it("수강 인원이 0이면 실패한다", () => {
    const result = courseSchema.safeParse({ ...VALID_INPUT, maxStudents: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path[0] === "maxStudents");
      expect(error?.message).toBe("최소 1명 이상이어야 합니다");
    }
  });

  it("수강 인원이 1이면 통과한다", () => {
    const result = courseSchema.safeParse({ ...VALID_INPUT, maxStudents: 1 });
    expect(result.success).toBe(true);
  });

  it("가격이 음수이면 실패한다", () => {
    const result = courseSchema.safeParse({ ...VALID_INPUT, price: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path[0] === "price");
      expect(error?.message).toBe("0원 이상이어야 합니다");
    }
  });

  it("소수점 가격은 실패한다", () => {
    const result = courseSchema.safeParse({ ...VALID_INPUT, price: 100.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path[0] === "price");
      expect(error?.message).toBe("수강료는 정수를 입력해주세요");
    }
  });
});
