"use client";

import type { BatchEnrollResult } from "@/lib/api/courses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EnrollResultDialogProps {
  result: BatchEnrollResult;
  courseTitleMap: Map<number, string>;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollResultDialog({
  result,
  courseTitleMap,
  isOpen,
  onClose,
}: EnrollResultDialogProps) {
  const title =
    result.failed.length === 0
      ? "수강 신청 완료"
      : result.success.length === 0
        ? "수강 신청 실패"
        : "수강 신청 결과";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {result.success.length > 0 ? `${result.success.length}개 강의 신청 완료` : ""}
            {result.success.length > 0 && result.failed.length > 0 ? ", " : ""}
            {result.failed.length > 0 ? `${result.failed.length}개 강의 신청 불가` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-60 space-y-1.5 overflow-y-auto pt-2">
          {/* 성공 목록 */}
          {result.success.length > 0 ? (
            <p className="text-warm-gray mb-1 text-[11px] font-medium tracking-wider uppercase">
              신청 완료
            </p>
          ) : null}
          {result.success.map((s) => (
            <div
              key={s.courseId}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
              style={{ background: "rgba(56,190,163,0.08)" }}
            >
              <span className="text-mint text-sm">✓</span>
              <span className="text-ivory text-sm">{s.courseTitle}</span>
            </div>
          ))}

          {/* 실패 목록 */}
          {result.failed.length > 0 ? (
            <p className="text-warm-gray mt-3 mb-1 text-[11px] font-medium tracking-wider uppercase">
              신청 불가
            </p>
          ) : null}
          {result.failed.map((f) => {
            const courseTitle = courseTitleMap.get(f.courseId) ?? `강의 #${f.courseId}`;
            return (
              <div
                key={f.courseId}
                className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                style={{ background: "rgba(207,80,80,0.08)" }}
              >
                <span className="text-danger mt-0.5 text-sm">✕</span>
                <div className="flex-1">
                  <span className="text-ivory text-sm">{courseTitle}</span>
                  <p className="text-warm-gray mt-0.5 text-xs">{f.reason}</p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="bg-gold flex-1 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ color: "#08090E" }}
          >
            확인
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
