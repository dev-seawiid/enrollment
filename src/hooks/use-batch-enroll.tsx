"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { overlay } from "overlay-kit";
import type { Course } from "@/lib/api/courses";
import { batchEnrollAction } from "@/lib/actions/enroll";
import { EnrollResultDialog } from "@/components/dialogs/enroll-result-dialog";
import { EnrollErrorDialog } from "@/components/dialogs/enroll-error-dialog";
import { showErrorDialog } from "@/lib/show-error-dialog";

interface UseBatchEnrollOptions {
  courses: Course[];
  clearSelection: () => void;
}

export function useBatchEnroll({ courses, clearSelection }: UseBatchEnrollOptions) {
  const queryClient = useQueryClient();
  const courseTitleMap = new Map(courses.map((c) => [c.id, c.title]));

  const mutation = useMutation({
    mutationFn: (courseIds: number[]) => batchEnrollAction(courseIds),
    onSuccess: (result) => {
      const selectedIds = [
        ...result.success.map((s) => s.courseId),
        ...result.failed.map((f) => f.courseId),
      ];
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      // 전부 실패 → 실패 사유 + 다른 강좌 추천
      if (result.success.length === 0) {
        const suggestions = courses.filter((c) => !c.isFull && !selectedIds.includes(c.id));

        overlay.open(({ isOpen, close, unmount }) => (
          <EnrollErrorDialog
            failedItems={result.failed.map((f) => ({
              title: courseTitleMap.get(f.courseId) ?? `강의 #${f.courseId}`,
              reason: f.reason,
            }))}
            suggestions={suggestions.slice(0, 6)}
            isOpen={isOpen}
            onClose={() => {
              close();
              setTimeout(unmount, 200);
            }}
            onEnroll={(ids) => {
              close();
              setTimeout(unmount, 200);
              mutation.mutate(ids);
            }}
          />
        ));
        return;
      }

      // 전부 성공 또는 부분 성공 → 결과 요약
      overlay.open(({ isOpen, close, unmount }) => (
        <EnrollResultDialog
          result={result}
          courseTitleMap={courseTitleMap}
          isOpen={isOpen}
          onClose={() => {
            close();
            setTimeout(unmount, 200);
          }}
        />
      ));
    },
    onError: async (err) => {
      await showErrorDialog(err, "수강 신청 실패");
    },
  });

  const handleBatchEnroll = (courseIds: number[]) => {
    if (courseIds.length === 0) return;
    mutation.mutate(courseIds);
  };

  return {
    handleBatchEnroll,
    isPending: mutation.isPending,
  };
}
