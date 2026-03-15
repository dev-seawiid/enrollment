import { useState, useCallback, useMemo } from "react";
import type { Course } from "@/lib/api/courses";

export function useCourseSelection(courses: Course[]) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = useCallback((id: number, isFull: boolean) => {
    if (isFull) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectedCount = selected.size;

  const totalPrice = useMemo(
    () => courses.filter((c) => selected.has(c.id)).reduce((sum, c) => sum + c.price, 0),
    [courses, selected],
  );

  return {
    selected,
    selectedCount,
    totalPrice,
    toggleSelect,
    clearSelection,
  };
}
