import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config — used by proxy (middleware).
 * jwt/session 콜백에서 role을 전달해야 authorized에서 RBAC 체크 가능.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as "STUDENT" | "INSTRUCTOR";
      session.user.phone = token.phone as string;
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;

      // 인증 페이지: 로그인 상태면 /courses로 리다이렉트
      if (isLoggedIn && (path === "/login" || path === "/signup")) {
        return Response.redirect(new URL("/courses", request.nextUrl));
      }

      // 인증 페이지와 정적 리소스 외 모든 경로: 로그인 필수
      if (!isLoggedIn && path !== "/login" && path !== "/signup") {
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      // 강의 개설: INSTRUCTOR만 접근 가능
      if (path.startsWith("/courses/new") && auth?.user?.role !== "INSTRUCTOR") {
        return Response.redirect(new URL("/courses", request.nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
