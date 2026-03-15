import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { classifyError, LOGIN_ERROR_CODE, RecoverableError } from "./lib/api/errors";
import { serverApi } from "./lib/api/server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phone: z.string(),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
  }),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // MSW 모드: 서버 없이 mock 유저로 인증
        if (process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
          return {
            id: String(Date.now()),
            name: "테스트유저",
            email: parsed.data.email,
            phone: "010-1234-5678",
            role: "INSTRUCTOR",
            accessToken: "mock-jwt-token",
          };
        }

        try {
          const data = await serverApi.post("users/login", loginResponseSchema, {
            json: parsed.data,
          });

          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            accessToken: data.accessToken,
          };
        } catch (err) {
          const classified = await classifyError(err);
          const isRecoverable = classified instanceof RecoverableError;

          console.error(
            `[auth] 로그인 실패 (${isRecoverable ? "인증 실패" : "서버 연결 불가"})`,
            err,
          );

          const error = new CredentialsSignin();
          error.code = isRecoverable
            ? LOGIN_ERROR_CODE.INVALID_CREDENTIALS
            : LOGIN_ERROR_CODE.SERVER_UNREACHABLE;
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
  session: { strategy: "jwt" },
});
