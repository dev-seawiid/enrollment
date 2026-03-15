"use client";

import { AnimatePresence, m } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { LoadingDots } from "@/components/ui/loading-dots";

interface BatchEnrollBarProps {
  selectedCount: number;
  totalPrice: number;
  isPending: boolean;
  onEnroll: () => void;
}

export function BatchEnrollBar({
  selectedCount,
  totalPrice,
  isPending,
  onEnroll,
}: BatchEnrollBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-3 pt-3 pb-5"
          style={{
            background: "linear-gradient(to top, #08090E 60%, transparent)",
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div
            className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3"
            style={{ background: "#0D1018", borderColor: "rgba(194,149,79,0.2)" }}
          >
            <div className="min-w-0">
              <p className="text-warm-gray text-[11px]">{selectedCount}개 선택됨</p>
              <AnimatedNumber
                value={totalPrice}
                prefix="₩"
                className="text-gold-light text-base font-bold tabular-nums"
              />
            </div>
            <m.button
              whileTap={{ scale: 0.97 }}
              onClick={onEnroll}
              disabled={isPending}
              className="bg-gold flex h-10 flex-shrink-0 items-center justify-center rounded-lg px-4 text-[13px] font-semibold transition-opacity disabled:opacity-60"
              style={{ color: "#08090E" }}
            >
              {isPending ? <LoadingDots /> : "수강 신청하기"}
            </m.button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
