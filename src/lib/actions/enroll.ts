"use server";

import { getAccessToken } from "@/lib/auth-token";
import { batchEnrollResultSchema, type BatchEnrollResult } from "@/lib/api/courses";
import { serverApi } from "@/lib/api/server";

export async function batchEnrollAction(courseIds: number[]): Promise<BatchEnrollResult> {
  // MSW 모드: 서버 없이 mock 응답 — 모든 강의를 "이미 신청" 처리
  if (process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
    return {
      success: [],
      failed: courseIds.map((courseId) => ({
        courseId,
        reason: "이미 수강 신청한 강의입니다",
      })),
    };
  }

  const accessToken = await getAccessToken();

  return serverApi.post("enrollments/batch", batchEnrollResultSchema, {
    json: { courseIds },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
