import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "수강생 또는 강사로 가입하고 다양한 강의를 만나보세요.",
};

export default function SignupPage() {
  return (
    <>
      {/* Header — static, no JS */}
      <header className="mb-8 text-center">
        <h1
          className="text-gold text-4xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          회원가입
        </h1>
        <p className="text-warm-gray mt-2 text-sm">배움에 투자하는 첫 걸음</p>
      </header>

      {/* Form — client island */}
      <SignupForm />
    </>
  );
}
