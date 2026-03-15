import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg", className)}
      style={{ background: "rgba(234,229,220,0.12)" }}
      {...props}
    />
  );
}

export { Skeleton };
