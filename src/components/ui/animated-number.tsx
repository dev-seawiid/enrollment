"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, m } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
}

export function AnimatedNumber({ value, className, prefix }: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 120, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix ?? ""}${Math.round(v).toLocaleString()}`);
  const prevValue = useRef(0);

  useEffect(() => {
    // 0 → 값: 애니메이션, 값 → 0: 즉시 리셋
    if (value === 0) {
      spring.jump(0);
    } else {
      spring.set(value);
    }
    prevValue.current = value;
  }, [value, spring]);

  return <m.span className={className}>{display}</m.span>;
}
