import type { Metadata } from "next";
import { CoursesView } from "@/components/courses/courses-view";

export const metadata: Metadata = {
  title: "강의 목록",
  description: "최신 강의를 탐색하고, 원하는 강의를 선택하여 수강 신청하세요.",
};

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090E]">
      <CoursesView />
    </div>
  );
}
