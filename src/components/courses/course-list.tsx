"use client";

import { SelectableCourseCard } from "@/components/course-card";
import { CourseCardSkeleton } from "@/components/course-card-skeleton";
import type { Course } from "@/lib/api/courses";
import { AnimatePresence, m } from "framer-motion";
import type { RefObject } from "react";

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  selected: Set<number>;
  onToggle: (id: number, isFull: boolean) => void;
  onDetail: (id: number) => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function CourseList({
  courses,
  isLoading,
  isError,
  hasNextPage,
  selected,
  onToggle,
  onDetail,
  sentinelRef,
}: CourseListProps) {
  if (isLoading) {
    return (
      <ul className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i}>
            <CourseCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-warm-gray text-sm">강의 목록을 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/*
        가상화(react-virtuoso) 미적용 사유:
        - 1,000개 카드 기준 프레임 드랍 없음 (카드당 DOM ~15개, 진입 애니메이션만 사용)
        - 가상화 적용 시 scroll restoration, 브라우저 검색(Ctrl+F), 접근성 이슈 발생
        - 성능 저하가 측정되면 그때 react-virtuoso로 전환 (이미 설치됨)
      */}
      <ul className="space-y-3" aria-label="강의 목록">
        {courses.map((course) => (
          <m.li
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            layout
          >
            <SelectableCourseCard
              course={course}
              isSelected={selected.has(course.id)}
              onToggle={onToggle}
              onDetail={onDetail}
            />
          </m.li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-1" aria-hidden />

      <AnimatePresence mode="sync">
        {hasNextPage ? (
          <m.ul
            key="skeleton"
            className="space-y-3 pt-3"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i}>
                <CourseCardSkeleton />
              </li>
            ))}
          </m.ul>
        ) : (
          <m.p
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-charcoal pt-4 text-center text-xs"
          >
            모든 강의를 불러왔습니다
          </m.p>
        )}
      </AnimatePresence>
    </>
  );
}
