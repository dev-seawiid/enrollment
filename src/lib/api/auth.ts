import { z } from "zod";
import { api } from "./client";

export type { ApiErrorBody } from "./errors";

// ── Request Types ──

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
}

// ── Response Schemas (runtime validation) ──

export const signupResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
  message: z.string(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;

// ── API Functions ──

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return api.post("users/signup", signupResponseSchema, { json: data });
}
