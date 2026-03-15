import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "#121620", borderColor: "rgba(234,229,220,0.09)" }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Skeleton className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-md" />

        <div className="min-w-0 flex-1 space-y-3">
          {/* Title */}
          <Skeleton className="h-4 w-3/4" />

          {/* Instructor */}
          <Skeleton className="h-3 w-1/3" />

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>

          {/* Price */}
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
