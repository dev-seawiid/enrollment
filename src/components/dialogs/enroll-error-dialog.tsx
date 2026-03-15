"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Course } from "@/lib/api/courses";
import { m } from "framer-motion";
import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

interface FailedItem {
  title: string;
  reason: string;
}

interface EnrollErrorDialogProps {
  failedItems: FailedItem[];
  suggestions: Course[];
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseIds: number[]) => void;
}

export function EnrollErrorDialog({
  failedItems,
  suggestions,
  isOpen,
  onClose,
  onEnroll,
}: EnrollErrorDialogProps) {
  const [picked, setPicked] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalPrice = useMemo(
    () => suggestions.filter((c) => picked.has(c.id)).reduce((sum, c) => sum + c.price, 0),
    [picked, suggestions],
  );

  const hasPicked = picked.size > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>수강 신청에 실패했습니다</DialogTitle>
          <DialogDescription>{failedItems.length}개 강의를 신청할 수 없습니다</DialogDescription>
        </DialogHeader>

        {/* 실패 사유 */}
        <div className="max-h-32 space-y-1.5 overflow-y-auto">
          {failedItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-2 rounded-lg px-3 py-2"
              style={{ background: "rgba(207,80,80,0.08)" }}
            >
              <span className="text-danger mt-0.5 text-sm">✕</span>
              <div className="flex-1">
                <span className="text-ivory text-sm">{item.title}</span>
                <p className="text-warm-gray mt-0.5 text-xs">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 다른 강좌 추천 */}
        {suggestions.length > 0 ? (
          <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(234,229,220,0.08)" }}>
            <p className="text-ivory mb-3 text-sm font-medium">다른 강좌는 어떠세요?</p>

            <Swiper spaceBetween={8} slidesPerView={1.2} className="overflow-hidden">
              {suggestions.map((course) => {
                const isSelected = picked.has(course.id);
                const rate =
                  course.maxStudents > 0 ? course.currentStudents / course.maxStudents : 0;

                return (
                  <SwiperSlide key={course.id}>
                    <m.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggle(course.id)}
                      className="w-full rounded-xl border p-3 text-left transition-colors"
                      style={{
                        background: isSelected ? "rgba(194,149,79,0.07)" : "#0D1018",
                        borderColor: isSelected ? "rgba(194,149,79,0.4)" : "rgba(234,229,220,0.1)",
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-ivory text-sm leading-snug font-semibold">
                          {course.title}
                        </span>
                        <div
                          className="flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-all"
                          style={{
                            borderColor: isSelected ? "#C2954F" : "rgba(234,229,220,0.2)",
                            background: isSelected ? "#C2954F" : "transparent",
                          }}
                        >
                          {isSelected ? (
                            <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="#08090E"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </div>
                      </div>

                      <p className="text-warm-gray text-xs">강사: {course.instructorName}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-mint text-[11px]">
                          {course.currentStudents}/{course.maxStudents}명 ({Math.round(rate * 100)}
                          %)
                        </span>
                        <span className="text-gold-light text-xs font-semibold tabular-nums">
                          ₩{course.price.toLocaleString()}
                        </span>
                      </div>
                    </m.button>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* 합계 — 선택 시에만 표시 */}
            <m.div
              animate={{ height: hasPicked ? 24 : 0, opacity: hasPicked ? 1 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between px-1 pt-2">
                <span className="text-warm-gray text-xs">{picked.size}개 선택</span>
                <span className="text-gold-light text-sm font-bold tabular-nums">
                  ₩{totalPrice.toLocaleString()}
                </span>
              </div>
            </m.div>
          </div>
        ) : null}

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-3 text-sm font-medium"
            style={{ borderColor: "rgba(234,229,220,0.12)", color: "#7A7684" }}
          >
            닫기
          </button>
          <button
            type="button"
            onClick={() => onEnroll([...picked])}
            disabled={!hasPicked}
            className="bg-gold flex-1 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ color: "#08090E" }}
          >
            {picked.size}개 신청하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
