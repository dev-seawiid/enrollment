import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "@/lib/utils";

function Textarea({
  ref,
  className,
  error,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & {
  error?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}) {
  return (
    <textarea
      ref={ref}
      className={cn("input-base resize-none leading-relaxed", error && "error", className)}
      {...props}
    />
  );
}

export { Textarea };
