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

  const accessToken = await getAccessToken();

  return serverApi.post("courses", courseSchema, {
    json: data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
