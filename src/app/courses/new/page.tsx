import type { Metadata } from "next";
import { BackButton } from "@/components/ui/back-button";
import { NewCourseForm } from "@/components/courses/new-course-form";

export const metadata: Metadata = {
  title: "새 강의 개설",
  description: "새로운 강의를 등록하고 수강생을 모집하세요.",
};

export default function NewCoursePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090E]">
      {/* Header — static shell + client BackButton leaf */}
      <header
        className="sticky top-0 z-40 flex h-14 items-center gap-4 px-5"
        style={{ background: "linear-gradient(to bottom, #08090E 70%, transparent)" }}
      >
        <BackButton />

        <h1
          className="text-gold text-xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          새 강의 개설
        </h1>
      </header>

      {/* Form — client island */}
      <NewCourseForm />
    </div>
  );
}
