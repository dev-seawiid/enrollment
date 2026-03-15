"use server";

import { auth } from "@/auth";
import { getAccessToken } from "@/lib/auth-token";
import { courseSchema, type Course, type CreateCourseRequest } from "@/lib/api/courses";
import { serverApi } from "@/lib/api/server";

export async function createCourseAction(data: CreateCourseRequest): Promise<Course> {
  const session = await auth();

  if (session?.user.role !== "INSTRUCTOR") {
    throw new Error("강사만 강의를 등록할 수 있습니다");
  }

  // MSW 모드: 서버 없이 mock 응답 — 등록 성공
  if (process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
    return {
      id: Date.now(),
      title: data.title,
      instructorName: data.instructorName,
      maxStudents: data.maxStudents,
      currentStudents: 0,
      availableSeats: data.maxStudents,
      isFull: false,
      price: data.price,
      createdAt: new Date().toISOString(),
    };
  }

  const accessToken = await getAccessToken();

  return serverApi.post("courses", courseSchema, {
    json: data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
