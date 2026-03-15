import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "이메일과 비밀번호로 로그인하여 강의를 탐색하고 수강 신청하세요.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col justify-between">
      {/* Brand header — static, no JS needed */}
      <header className="pt-10 text-center">
        <p className="text-warm-gray mb-4 font-sans text-xs tracking-[0.3em] uppercase">
          INVEST IN LEARNING
        </p>
        <h1
          className="text-gold text-5xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          수강신청
        </h1>
        <p className="text-warm-gray mt-3 text-sm">배움에 투자하는 가장 스마트한 방법</p>
        <div className="mx-auto mt-6 flex items-center gap-3">
          <div className="bg-gold-dim/40 h-px flex-1" />
          <div className="bg-gold-dim h-1.5 w-1.5 rounded-full" />
          <div className="bg-gold-dim/40 h-px flex-1" />
        </div>
      </header>

      <LoginForm />

      <div aria-hidden />
    </div>
  );
}
