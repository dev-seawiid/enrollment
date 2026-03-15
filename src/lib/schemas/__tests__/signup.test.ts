import { describe, it, expect } from "vitest";
import { signupSchema } from "../signup";

const VALID_INPUT = {
  name: "홍길동",
  email: "hong@example.com",
  phone: "01012345678",
  password: "Test1234",
  passwordConfirm: "Test1234",
  role: "STUDENT" as const,
};

describe("signupSchema", () => {
  it("유효한 입력을 통과시킨다", () => {
    const result = signupSchema.safeParse(VALID_INPUT);
    expect(result.success).toBe(true);
  });

  // ── name ──
  describe("name", () => {
    it("빈 문자열이면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path[0] === "name");
        expect(nameError?.message).toBe("이름을 입력해주세요");
      }
    });
  });

  // ── email ──
  describe("email", () => {
    it("이메일 형식이 아니면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, email: "not-email" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path[0] === "email");
        expect(emailError?.message).toBe("올바른 이메일 형식이 아닙니다");
      }
    });
  });

  // ── phone ──
  describe("phone", () => {
    it("빈 문자열이면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "" });
      expect(result.success).toBe(false);
    });

    it("숫자만 입력해도 하이픈 형식으로 변환한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "01012345678" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe("010-1234-5678");
      }
    });

    it("하이픈 포함 형식도 통과한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "010-1234-5678" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe("010-1234-5678");
      }
    });

    it("10자리 번호도 통과한다 (구형 번호)", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "0101234567" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe("010-123-4567");
      }
    });

    it("자릿수가 부족하면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "0101234" });
      expect(result.success).toBe(false);
    });

    it("문자가 포함되면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, phone: "010abcd5678" });
      expect(result.success).toBe(false);
    });
  });

  // ── password ──
  describe("password", () => {
    // 길이 경계값
    describe("길이 검증", () => {
      it("5자이면 실패한다 (하한 미달)", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "Ab1cd",
          passwordConfirm: "Ab1cd",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const pwError = result.error.issues.find((i) => i.path[0] === "password");
          expect(pwError?.message).toBe("최소 6자 이상이어야 합니다");
        }
      });

      it("정확히 6자이면 통과한다 (하한)", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abc123",
          passwordConfirm: "abc123",
        });
        expect(result.success).toBe(true);
      });

      it("정확히 10자이면 통과한다 (상한)", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abcDEF1234",
          passwordConfirm: "abcDEF1234",
        });
        expect(result.success).toBe(true);
      });

      it("11자이면 실패한다 (상한 초과)", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abcDEF12345",
          passwordConfirm: "abcDEF12345",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const pwError = result.error.issues.find((i) => i.path[0] === "password");
          expect(pwError?.message).toBe("최대 10자 이하여야 합니다");
        }
      });
    });

    // 1가지 유형만 사용 → 실패
    describe("1가지 유형만 사용하면 실패한다", () => {
      it("소문자만", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abcdef",
          passwordConfirm: "abcdef",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const pwError = result.error.issues.find(
            (i) => i.path[0] === "password" && i.message.includes("2가지"),
          );
          expect(pwError).toBeDefined();
        }
      });

      it("대문자만", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "ABCDEF",
          passwordConfirm: "ABCDEF",
        });
        expect(result.success).toBe(false);
      });

      it("숫자만", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "123456",
          passwordConfirm: "123456",
        });
        expect(result.success).toBe(false);
      });
    });

    // 2가지 유형 조합 → 통과
    describe("2가지 유형 조합은 통과한다", () => {
      it("소문자 + 숫자", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abc123",
          passwordConfirm: "abc123",
        });
        expect(result.success).toBe(true);
      });

      it("대문자 + 숫자", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "ABC123",
          passwordConfirm: "ABC123",
        });
        expect(result.success).toBe(true);
      });

      it("소문자 + 대문자", () => {
        const result = signupSchema.safeParse({
          ...VALID_INPUT,
          password: "abcDEF",
          passwordConfirm: "abcDEF",
        });
        expect(result.success).toBe(true);
      });
    });

    // 3가지 유형 조합 → 통과
    it("3가지 유형 조합(소문자 + 대문자 + 숫자)은 통과한다", () => {
      const result = signupSchema.safeParse({
        ...VALID_INPUT,
        password: "abcDE1",
        passwordConfirm: "abcDE1",
      });
      expect(result.success).toBe(true);
    });

    // 특수문자는 유형에 포함되지 않음
    it("특수문자만으로는 실패한다 (유형 0가지)", () => {
      const result = signupSchema.safeParse({
        ...VALID_INPUT,
        password: "!@#$%^",
        passwordConfirm: "!@#$%^",
      });
      expect(result.success).toBe(false);
    });

    it("특수문자 + 소문자 1가지 유형은 실패한다", () => {
      const result = signupSchema.safeParse({
        ...VALID_INPUT,
        password: "abc!@#",
        passwordConfirm: "abc!@#",
      });
      expect(result.success).toBe(false);
    });

    it("특수문자가 포함되어도 2가지 유형 충족 시 통과한다", () => {
      const result = signupSchema.safeParse({
        ...VALID_INPUT,
        password: "ab1!@#",
        passwordConfirm: "ab1!@#",
      });
      expect(result.success).toBe(true);
    });
  });

  // ── passwordConfirm ──
  describe("passwordConfirm", () => {
    it("비밀번호와 불일치하면 실패한다", () => {
      const result = signupSchema.safeParse({
        ...VALID_INPUT,
        passwordConfirm: "Different1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path[0] === "passwordConfirm");
        expect(confirmError?.message).toBe("비밀번호가 일치하지 않습니다");
      }
    });
  });

  // ── role ──
  describe("role", () => {
    it("STUDENT를 허용한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, role: "STUDENT" });
      expect(result.success).toBe(true);
    });

    it("INSTRUCTOR를 허용한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, role: "INSTRUCTOR" });
      expect(result.success).toBe(true);
    });

    it("잘못된 역할이면 실패한다", () => {
      const result = signupSchema.safeParse({ ...VALID_INPUT, role: "ADMIN" });
      expect(result.success).toBe(false);
    });
  });
});
