"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#08090E] px-6">
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(207,80,80,0.12)" }}
        >
          <span className="text-danger text-xl">!</span>
        </div>

        <h2
          className="text-ivory text-xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          문제가 발생했습니다
        </h2>

        <p className="text-warm-gray mt-2 text-sm">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        <button
          onClick={reset}
          className="bg-gold mt-6 rounded-xl px-6 py-3 text-sm font-semibold"
          style={{ color: "#08090E" }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
