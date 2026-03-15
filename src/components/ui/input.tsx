import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "@/lib/utils";

// React 19: ref is a regular prop, no forwardRef needed
function Input({
  ref,
  className,
  error,
  type = "text",
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  error?: boolean;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn("input-base", error && "error", className)}
      {...props}
    />
  );
}

export { Input };
