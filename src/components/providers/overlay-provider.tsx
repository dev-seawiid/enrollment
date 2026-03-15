"use client";

import { OverlayProvider as OverlayKitProvider } from "overlay-kit";

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  return <OverlayKitProvider>{children}</OverlayKitProvider>;
}
