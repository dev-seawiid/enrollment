"use client";

import { m } from "framer-motion";

// ── Types ──

export interface CourseCardData {
  title: string;
  instructorName: string;
  maxStudents: number;
  currentStudents: number;
  price: number;
  isFull: boolean;
}

// ── Hoisted static styles ──

const SELECTION_GLOW_STYLE = {
  background: "radial-gradient(ellipse at top-right, rgba(194,149,79,0.1) 0%, transparent 60%)",
} as const;

const PROGRESS_BAR_BG_STYLE = {
  background: "rgba(234,229,220,0.08)",
} as const;

// ── Shared inner content ──

function CourseCardContent({
  title,
  instructorName,
  currentStudents,
  maxStudents,
  price,
  isFull,
}: CourseCardData) {
  const rate = maxStudents > 0 ? currentStudents / maxStudents : 0;
  const barColor = isFull
    ? "#CF5050"
    : rate >= 0.9
      ? "#D4943A"
      : rate >= 0.7
        ? "#C2954F"
        : "#38BEA3";

  return (
    <>
      <h2 className="text-ivory text-sm leading-snug font-semibold">{title}</h2>

      <p className="text-warm-gray mt-1 text-xs">강사: {instructorName}</p>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px]" style={{ color: barColor }}>
            {currentStudents}/{maxStudents}명
          </span>
          <span className="text-warm-gray text-[11px]">{Math.round(rate * 100)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full" style={PROGRESS_BAR_BG_STYLE}>
          <m.div
            className="h-full rounded-full"
            style={{ background: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${rate * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <p className="text-gold-light mt-3 text-sm font-semibold tabular-nums">
        ₩{price.toLocaleString()}
      </p>
    </>
  );
}

// ── Selectable card (courses list) ──

interface SelectableCourseCardProps {
  course: CourseCardData & { id: number };
  isSelected: boolean;
  isEnrolled?: boolean;
  onToggle: (id: number, isFull: boolean) => void;
  onDetail?: (id: number) => void;
}

export function SelectableCourseCard({
  course,
  isSelected,
  isEnrolled = false,
  onToggle,
  onDetail,
}: SelectableCourseCardProps) {
  const disabled = course.isFull || isEnrolled;

  return (
    <m.article
      whileTap={disabled ? {} : { scale: 0.985 }}
      onClick={() => {
        if (!disabled) onToggle(course.id, course.isFull);
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-colors duration-200"
      style={{
        background: isSelected ? "rgba(194,149,79,0.07)" : "#121620",
        borderColor: isSelected
          ? "rgba(194,149,79,0.4)"
          : disabled
            ? "rgba(234,229,220,0.05)"
            : "rgba(234,229,220,0.09)",
        opacity: disabled ? 0.55 : 1,
      }}
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      {isSelected ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0"
          style={SELECTION_GLOW_STYLE}
        />
      ) : null}

      <div className="relative flex items-start gap-3">
        {/* Checkbox */}
        <div className="mt-0.5 flex-shrink-0">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200"
            style={{
              borderColor: isSelected ? "#C2954F" : "rgba(234,229,220,0.2)",
              background: isSelected ? "#C2954F" : "transparent",
            }}
            aria-hidden
          >
            {isSelected ? (
              <m.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#08090E"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </m.svg>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <CourseCardContent {...course} />
        </div>

        {/* Status badge + Info button */}
        <div className="mt-0.5 flex flex-shrink-0 items-center gap-1.5">
          {isEnrolled ? (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(72,117,191,0.15)", color: "#4875BF" }}
            >
              신청완료
            </span>
          ) : course.isFull ? (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(207,80,80,0.15)", color: "#CF5050" }}
            >
              마감
            </span>
          ) : null}
          {onDetail ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDetail(course.id);
              }}
              className="text-warm-gray hover:text-ivory flex-shrink-0 rounded-full p-1 transition-colors"
              aria-label="강의 상세보기"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </m.article>
  );
}

// ── Preview card (course creation) ──

interface PreviewCourseCardProps {
  title: string;
  instructorName: string;
  maxStudents: number | null;
  price: number | null;
}

export function PreviewCourseCard({
  title,
  instructorName,
  maxStudents,
  price,
}: PreviewCourseCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-4"
      style={{
        background: "#121620",
        borderColor: "rgba(194,149,79,0.15)",
      }}
    >
      <div className="relative">
        <CourseCardContent
          title={title || "강의명 미입력"}
          instructorName={instructorName || "—"}
          maxStudents={maxStudents ?? 0}
          currentStudents={0}
          price={price ?? 0}
          isFull={false}
        />
      </div>
    </div>
  );
}
