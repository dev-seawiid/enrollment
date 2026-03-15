"use client";

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  badge?: string;
  children: ReactNode;
}

export function FormField({ label, error, hint, required, badge, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <Label>
          {label}
          {required ? (
            <span className="ml-1" style={{ color: "#C2954F" }}>
              *
            </span>
          ) : null}
        </Label>
        {badge ? (
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px]"
            style={{ background: "rgba(234,229,220,0.06)", color: "#7A7684" }}
          >
            {badge}
          </span>
        ) : null}
        {hint && !error ? <span className="text-charcoal ml-auto text-xs">{hint}</span> : null}
      </div>
      {children}
      {/* Fixed-height slot: prevents layout shift when error appears */}
      <div className="mt-1.5 h-4">
        <m.p
          animate={{ opacity: error ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-danger text-xs"
          aria-live="polite"
        >
          {error ?? "\u00A0"}
        </m.p>
      </div>
    </div>
  );
}
