"use client";

import { useEffect, useState } from "react";
import { fetchCourseDetail, type CourseDetail } from "@/lib/api/courses";
import { showErrorDialog } from "@/lib/show-error-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

interface CourseDetailDialogProps {
  courseId: number;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
}

export function CourseDetailDialog({ courseId, isOpen, close, unmount }: CourseDetailDialogProps) {
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCourseDetail(courseId);
        if (!cancelled) setDetail(data);
      } catch (err) {
        await showErrorDialog(err, "강의 상세 조회 실패");
        close();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, close]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
          setTimeout(unmount, 200);
        }
      }}
    >
      <DialogContent>
        {isLoading ? (
          <>
            <DialogTitle className="sr-only">강의 상세 로딩 중</DialogTitle>
            <div className="flex items-center justify-center py-10">
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(194,149,79,0.3)", borderTopColor: "transparent" }}
              />
            </div>
          </>
        ) : detail ? (
          <>
            <DialogHeader>
              <DialogTitle>{detail.title}</DialogTitle>
              {detail.description ? (
                <DialogDescription>{detail.description}</DialogDescription>
              ) : null}
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-warm-gray text-xs">강사</span>
                <span className="text-ivory text-sm">{detail.instructorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warm-gray text-xs">수강 인원</span>
                <span className="text-sm" style={{ color: detail.isFull ? "#CF5050" : "#38BEA3" }}>
                  {detail.currentStudents}/{detail.maxStudents}명
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warm-gray text-xs">수강료</span>
                <span className="text-gold-light text-sm font-semibold">
                  ₩{detail.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warm-gray text-xs">등록일</span>
                <span className="text-warm-gray text-sm">
                  {new Date(detail.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="button"
                  className="bg-gold flex-1 rounded-xl px-4 py-3 text-sm font-semibold"
                  style={{ color: "#08090E" }}
                >
                  닫기
                </button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
