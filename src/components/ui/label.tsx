import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "@/lib/utils";

// React 19: ref is a regular prop, no forwardRef needed
function Label({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<"label"> & {
  ref?: Ref<HTMLLabelElement>;
}) {
  return (
    <label
      ref={ref}
      className={cn("text-warm-gray text-xs font-medium tracking-widest uppercase", className)}
      {...props}
    />
  );
}

export { Label };
