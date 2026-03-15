import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#08090E] px-6">
      <div className="text-center">
        <p className="text-gold text-6xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          404
        </p>

        <h2 className="text-ivory mt-4 text-lg font-semibold">페이지를 찾을 수 없습니다</h2>

        <p className="text-warm-gray mt-2 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다
        </p>

        <Link
          href="/courses"
          className="bg-gold mt-6 inline-block rounded-xl px-6 py-3 text-sm font-semibold"
          style={{ color: "#08090E" }}
        >
          강의 목록으로 이동
        </Link>
      </div>
    </div>
  );
}
