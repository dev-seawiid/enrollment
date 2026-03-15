import ky from "ky";
import { createApiClient } from "./create-api-client";

/**
 * Client-side API client.
 * Routes through Next.js rewrite proxy (/api/proxy/*) — backend URL is never
 * visible in the browser's network requests or JS bundle.
 */
const instance = ky.create({
  prefixUrl: "/api/proxy",
  headers: { "Content-Type": "application/json" },
});

export const api = createApiClient(() => instance);
