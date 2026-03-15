"use client";

import { LazyMotion } from "framer-motion";

// domMax features are loaded asynchronously — not included in the main bundle.
// This reduces the initial JS payload by deferring framer-motion's animation engine.
const loadFeatures = () => import("framer-motion").then((mod) => mod.domMax);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
