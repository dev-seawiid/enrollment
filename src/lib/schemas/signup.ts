import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    phone: z
      .string()
      .min(1, "휴대폰 번호를 입력해주세요")
      .transform((v) => v.replace(/-/g, ""))
      .pipe(
        z
          .string()
          .regex(/^\d{10,11}$/, "올바른 휴대폰 번호를 입력해주세요")
          .transform((v) => v.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")),
      ),
    password: z
      .string()
      .min(6, "최소 6자 이상이어야 합니다")
      .max(10, "최대 10자 이하여야 합니다")
      .refine((val) => {
        const types = [/[a-z]/, /[A-Z]/, /[0-9]/].filter((r) => r.test(val)).length;
        return types >= 2;
      }, "영문 소문자, 대문자, 숫자 중 2가지 이상 포함해야 합니다"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type SignupForm = z.infer<typeof signupSchema>;
