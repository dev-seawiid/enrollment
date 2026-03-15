"use server";

import { getAccessToken } from "@/lib/auth-token";
import { batchEnrollResultSchema, type BatchEnrollResult } from "@/lib/api/courses";
import { serverApi } from "@/lib/api/server";

export async function batchEnrollAction(courseIds: number[]): Promise<BatchEnrollResult> {
  const accessToken = await getAccessToken();

  return serverApi.post("enrollments/batch", batchEnrollResultSchema, {
    json: { courseIds },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
