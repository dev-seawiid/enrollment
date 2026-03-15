import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect specific routes; skip static assets & API routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|mockServiceWorker\\.js|api/auth|api/proxy).*)",
  ],
};
