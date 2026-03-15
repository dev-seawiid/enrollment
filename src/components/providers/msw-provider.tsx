"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enableMSW = process.env.NEXT_PUBLIC_MSW_ENABLED === "true";

    if (enableMSW) {
      import("@/mocks/browser")
        .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
        .then(() => setReady(true))
        .catch((err) => {
          console.error("[MSW] Failed to start:", err);
          setReady(true);
        });
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
