import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "STUDENT" | "INSTRUCTOR";
    accessToken?: string;
    phone?: string;
  }

  interface Session {
    user: {
      role: "STUDENT" | "INSTRUCTOR";
      phone: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "STUDENT" | "INSTRUCTOR";
    accessToken?: string;
    phone?: string;
  }
}
