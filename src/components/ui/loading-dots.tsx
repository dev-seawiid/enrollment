"use client";

import { m } from "framer-motion";

export function LoadingDots({ color = "#08090E" }: { color?: string }) {
  return (
    <span className="flex items-center gap-1" aria-label="처리 중">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
