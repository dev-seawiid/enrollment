"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex h-9 w-9 items-center justify-center rounded-full border transition-opacity active:opacity-70"
      style={{ borderColor: "rgba(234,229,220,0.12)", color: "#EAE5DC" }}
      aria-label="뒤로 가기"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
