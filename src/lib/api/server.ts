import ky from "ky";
import { createApiClient } from "./create-api-client";

/**
 * Server-only API client.
 * Uses API_BASE_URL env var directly — never exposed to the browser.
 * Lazy-initialized to avoid build-time errors when env vars aren't available.
 */
export const serverApi = createApiClient(() => {
  const url = process.env.API_BASE_URL;
  if (!url) {
    throw new Error("API_BASE_URL environment variable is not set");
  }
  return ky.create({
    prefixUrl: url,
    headers: { "Content-Type": "application/json" },
  });
});
