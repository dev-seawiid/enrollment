"use client";

import { PreviewCourseCard } from "@/components/course-card";
import { LoadingDots } from "@/components/ui/loading-dots";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CourseConfirmDialogProps {
  title: string;
  instructorName: string;
  maxStudents: number | null;
  price: number | null;
  isConfirming: boolean;
  isOpen: boolean;
  close: (confirmed: boolean) => void;
  unmount: () => void;
}

export function CourseConfirmDialog({
  title,
  instructorName,
  maxStudents,
  price,
  isConfirming,
  isOpen,
  close,
  unmount,
}: CourseConfirmDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close(false);
          setTimeout(unmount, 200);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>강의를 등록하시겠습니까?</DialogTitle>
          <DialogDescription>아래 내용으로 강의가 개설됩니다.</DialogDescription>
        </DialogHeader>

        <PreviewCourseCard
          title={title}
          instructorName={instructorName}
          maxStudents={maxStudents}
          price={price}
        />

        <DialogFooter>
          <button
            type="button"
            onClick={() => {
              close(false);
              setTimeout(unmount, 200);
            }}
            className="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            style={{ borderColor: "rgba(234,229,220,0.12)", color: "#7A7684" }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => close(true)}
            disabled={isConfirming}
            className="bg-gold flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{ color: "#08090E" }}
          >
            {isConfirming ? <LoadingDots /> : "확인"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
