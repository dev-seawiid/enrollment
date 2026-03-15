import "server-only";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

/**
 * JWT에서 accessToken을 읽습니다.
 * session callback에 포함하지 않으므로 클라이언트에 절대 노출되지 않습니다.
 * Server Action / Route Handler 등 서버 코드에서만 사용 가능합니다.
 */
export async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  // NextAuth v5 기본 쿠키 이름
  const tokenValue =
    cookieStore.get("authjs.session-token")?.value ??
    cookieStore.get("__Secure-authjs.session-token")?.value;

  if (!tokenValue) {
    throw new Error("인증이 필요합니다");
  }

  const decoded = await decode({
    token: tokenValue,
    salt: cookieStore.has("__Secure-authjs.session-token")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    secret,
  });

  const accessToken = decoded?.accessToken as string | undefined;

  if (!accessToken) {
    throw new Error("인증이 필요합니다");
  }

  return accessToken;
}
