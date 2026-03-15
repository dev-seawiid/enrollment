import { z } from "zod";
import { api } from "./client";

// ── Response Schemas (runtime validation) ──

export const courseSchema = z.object({
  id: z.number(),
  title: z.string(),
  instructorName: z.string(),
  maxStudents: z.number(),
  currentStudents: z.number(),
  availableSeats: z.number(),
  isFull: z.boolean(),
  price: z.number(),
  createdAt: z.string(),
});

export const courseDetailSchema = courseSchema.extend({
  description: z.string(),
});

export const coursePageSchema = z.object({
  content: z.array(courseSchema),
  pageable: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
  }),
  totalElements: z.number(),
  totalPages: z.number(),
  first: z.boolean(),
  last: z.boolean(),
});

export const batchEnrollResultSchema = z.object({
  success: z.array(
    z.object({
      enrollmentId: z.number(),
      courseId: z.number(),
      courseTitle: z.string(),
    }),
  ),
  failed: z.array(
    z.object({
      courseId: z.number(),
      reason: z.string(),
    }),
  ),
});

// ── Inferred Types ──

export type Course = z.infer<typeof courseSchema>;
export type CourseDetail = z.infer<typeof courseDetailSchema>;
export type CoursePage = z.infer<typeof coursePageSchema>;
export type BatchEnrollResult = z.infer<typeof batchEnrollResultSchema>;
export type SortType = "recent" | "popular" | "rate";

export interface CreateCourseRequest {
  title: string;
  description?: string;
  instructorName: string;
  maxStudents: number;
  price: number;
}

// ── API Functions ──
// Schema is required — compiler enforces validation at every call site.

export async function fetchCourses(
  page: number,
  size: number,
  sort: SortType,
): Promise<CoursePage> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  return api.get(`courses?${params}`, coursePageSchema);
}

export async function fetchCourseDetail(courseId: number): Promise<CourseDetail> {
  return api.get(`courses/${courseId}`, courseDetailSchema);
}
