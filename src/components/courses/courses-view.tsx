"use client";

import { BatchEnrollBar } from "@/components/courses/batch-enroll-bar";
import { CourseList } from "@/components/courses/course-list";
import { CoursesHeader } from "@/components/courses/courses-header";
import { CourseDetailDialog } from "@/components/dialogs/course-detail-dialog";
import { useBatchEnroll } from "@/hooks/use-batch-enroll";
import { useCourseSelection } from "@/hooks/use-course-selection";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { fetchCourses, type SortType } from "@/lib/api/courses";
import { useInfiniteQuery } from "@tanstack/react-query";
import { overlay } from "overlay-kit";
import { useCallback, useState } from "react";

const PAGE_SIZE = 10;

export function CoursesView() {
  const [sort, setSort] = useState<SortType>("recent");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["courses", sort],
      queryFn: ({ pageParam }) => fetchCourses(pageParam, PAGE_SIZE, sort),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    });

  const courses = data?.pages.flatMap((page) => page.content) ?? [];

  const { selected, selectedCount, totalPrice, toggleSelect, clearSelection } =
    useCourseSelection(courses);

  const sentinelRef = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { handleBatchEnroll, isPending } = useBatchEnroll({
    courses,
    clearSelection,
  });

  const handleSortChange = useCallback(
    (newSort: SortType) => {
      setSort(newSort);
      clearSelection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [clearSelection],
  );

  const handleDetail = useCallback((id: number) => {
    overlay.open(({ isOpen, close, unmount }) => (
      <CourseDetailDialog courseId={id} isOpen={isOpen} close={close} unmount={unmount} />
    ));
  }, []);

  return (
    <>
      <CoursesHeader sort={sort} onSortChange={handleSortChange} />

      <main className="flex-1 px-3 pt-[100px] pb-28">
        <CourseList
          courses={courses}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage ?? false}
          selected={selected}
          onToggle={toggleSelect}
          onDetail={handleDetail}
          sentinelRef={sentinelRef}
        />
      </main>

      <BatchEnrollBar
        selectedCount={selectedCount}
        totalPrice={totalPrice}
        isPending={isPending}
        onEnroll={() => handleBatchEnroll([...selected])}
      />
    </>
  );
}
