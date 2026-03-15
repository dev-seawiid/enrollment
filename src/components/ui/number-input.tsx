"use client";

import { type ReactNode, useEffect, useMemo, useCallback } from "react";
import { useIMask } from "react-imask";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  /** Controlled numeric value — use with react-hook-form Controller */
  value?: number;
  /** Fires with the numeric value on accept */
  onAccept?: (value: number | undefined) => void;
  onBlur?: () => void;
  error?: boolean;
  placeholder?: string;
  min?: number;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
}

export function NumberInput({
  value,
  onAccept,
  onBlur,
  error,
  placeholder,
  min = 0,
  addonBefore,
  addonAfter,
}: NumberInputProps) {
  const maskOpts = useMemo(
    () => ({
      mask: Number,
      thousandsSeparator: ",",
      radix: ".",
      scale: 0,
      min,
      max: 999_999_999,
    }),
    [min],
  );

  const handleAccept = useCallback(
    (_masked: string, maskRef: { unmaskedValue: string }) => {
      const raw = maskRef.unmaskedValue;
      onAccept?.(raw === "" ? undefined : Number(raw));
    },
    [onAccept],
  );

  const imaskCallbacks = useMemo(() => ({ onAccept: handleAccept }), [handleAccept]);
  const { ref, setValue } = useIMask(maskOpts, imaskCallbacks);

  useEffect(() => {
    if (value !== undefined && !isNaN(value)) {
      setValue(String(value));
    }
  }, [value, setValue]);

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-xl border transition-all duration-200",
        "focus-within:border-[rgba(194,149,79,0.55)] focus-within:shadow-[0_0_0_3px_rgba(194,149,79,0.08)]",
        error ? "border-[rgba(207,80,80,0.5)]" : "border-[rgba(234,229,220,0.1)]",
      )}
      style={{ background: "#121620" }}
    >
      {addonBefore ? (
        <span className="text-warm-gray flex-shrink-0 pl-3.5 text-sm select-none">
          {addonBefore}
        </span>
      ) : null}
      <input
        ref={ref as React.RefObject<HTMLInputElement | null>}
        inputMode="numeric"
        placeholder={placeholder}
        onBlur={onBlur}
        className={cn(
          "w-full bg-transparent px-3 py-3.5 text-[0.9375rem] text-[#EAE5DC] outline-none",
          "placeholder:text-[#4A4858]",
          !addonBefore && "pl-4",
          !addonAfter && "pr-4",
        )}
      />
      {addonAfter ? (
        <span className="text-warm-gray flex-shrink-0 pr-3.5 text-sm select-none">
          {addonAfter}
        </span>
      ) : null}
    </div>
  );
}
