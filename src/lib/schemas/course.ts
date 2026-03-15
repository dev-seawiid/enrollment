import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "강의명을 입력해주세요"),
  description: z.string().optional(),
  maxStudents: z
    .number({ message: "최대 수강 인원을 입력해주세요" })
    .int("최대 수강 인원은 정수를 입력해주세요")
    .min(1, "최소 1명 이상이어야 합니다"),
  price: z
    .number({ message: "수강료를 입력해주세요" })
    .int("수강료는 정수를 입력해주세요")
    .min(0, "0원 이상이어야 합니다"),
});

export type CourseFormData = z.infer<typeof courseSchema>;
