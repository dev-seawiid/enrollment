"use client";

import { type ComponentPropsWithoutRef, useEffect, useMemo, useCallback } from "react";
import { useIMask } from "react-imask";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "ref"
> {
  /** IMask pattern string (e.g. "000-0000-0000") */
  mask: string;
  /** Controlled value (unmasked) — use with react-hook-form Controller */
  value?: string;
  /** Fires with the *unmasked* value on accept */
  onAccept?: (value: string) => void;
  /** Fires on blur */
  onBlur?: () => void;
  error?: boolean;
  definitions?: Record<string, RegExp>;
}

export function MaskedInput({
  mask,
  value,
  onAccept,
  onBlur,
  error,
  definitions,
  className,
  ...props
}: MaskedInputProps) {
  // Stabilize object references to prevent useIMask from re-initializing
  const maskOpts = useMemo(() => ({ mask, definitions }), [mask, definitions]);
  const handleAccept = useCallback(
    (_masked: string, maskRef: { unmaskedValue: string }) => {
      onAccept?.(maskRef.unmaskedValue);
    },
    [onAccept],
  );
  const imaskCallbacks = useMemo(() => ({ onAccept: handleAccept }), [handleAccept]);

  const { ref, setValue } = useIMask(maskOpts, imaskCallbacks);

  // Sync external value → IMask (e.g. form reset)
  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [value, setValue]);

  return (
    <input
      ref={ref as React.RefObject<HTMLInputElement | null>}
      onBlur={onBlur}
      className={cn("input-base", error && "error", className)}
      {...props}
    />
  );
}
