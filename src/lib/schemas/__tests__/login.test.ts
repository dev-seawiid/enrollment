import { describe, it, expect } from "vitest";
import { loginSchema } from "../login";

describe("loginSchema", () => {
  it("유효한 입력을 통과시킨다", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "pass123",
    });
    expect(result.success).toBe(true);
  });

  it("이메일 형식이 아니면 실패한다", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "pass123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === "email");
      expect(emailError?.message).toBe("올바른 이메일 형식이 아닙니다");
    }
  });

  it("비밀번호가 빈 문자열이면 실패한다", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pwError = result.error.issues.find((i) => i.path[0] === "password");
      expect(pwError?.message).toBe("비밀번호를 입력해주세요");
    }
  });
});
