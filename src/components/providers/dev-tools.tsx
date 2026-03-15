"use client";

import dynamic from "next/dynamic";

// Dev-only: Agentation loads only in development, excluded from production bundle
const Agentation = dynamic(() => import("agentation").then((mod) => mod.Agentation), {
  ssr: false,
});

export function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}
