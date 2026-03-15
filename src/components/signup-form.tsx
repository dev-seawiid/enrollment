"use client";

import { EmailInput } from "@/components/ui/email-input";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { PasswordInput } from "@/components/ui/password-input";
import { signup } from "@/lib/api/auth";
import { showErrorDialog } from "@/lib/show-error-dialog";
import { signupSchema, type SignupForm } from "@/lib/schemas/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingDots } from "@/components/ui/loading-dots";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      role: "STUDENT",
    },
  });

  const handleRoleChange = (r: "STUDENT" | "INSTRUCTOR") => {
    setRole(r);
    setValue("role", r);
  };

  const onSubmit = async (data: SignupForm) => {
    try {
      const { passwordConfirm: _, ...body } = data;
      await signup(body);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      } else {
        toast.success("회원가입이 완료되었습니다");
        router.push("/courses");
        router.refresh();
      }
    } catch (err) {
      await showErrorDialog(err, "회원가입 실패");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <fieldset className="m-0 space-y-4 border-none p-0">
          <FormField label="이름" error={errors.name?.message}>
            <Input
              autoComplete="name"
              placeholder="홍길동"
              error={!!errors.name}
              {...register("name")}
            />
          </FormField>

          <FormField label="이메일" error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <EmailInput
                  placeholder="hong@example.com"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.email}
                />
              )}
            />
          </FormField>

          <FormField label="휴대폰 번호" error={errors.phone?.message}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  mask="000-0000-0000"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="010-1234-5678"
                  value={field.value}
                  onAccept={(unmasked) => field.onChange(unmasked)}
                  onBlur={field.onBlur}
                  error={!!errors.phone}
                />
              )}
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password?.message}>
            <PasswordInput
              autoComplete="new-password"
              placeholder="6~10자, 영문·숫자 중 2가지 이상"
              error={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <FormField label="비밀번호 확인" error={errors.passwordConfirm?.message}>
            <PasswordInput
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력해주세요"
              error={!!errors.passwordConfirm}
              {...register("passwordConfirm")}
            />
          </FormField>

          {/* Role toggle */}
          <div>
            <p className="text-warm-gray mb-2.5 text-xs font-medium tracking-widest uppercase">
              회원 유형
            </p>
            <div className="relative flex gap-1 rounded-xl p-1" style={{ background: "#121620" }}>
              <m.div
                layoutId="role-indicator"
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  width: "calc(50% - 4px)",
                  left: role === "STUDENT" ? 4 : "calc(50% + 0px)",
                  background: "rgba(194, 149, 79, 0.15)",
                  border: "1px solid rgba(194, 149, 79, 0.35)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              {(
                [
                  { value: "STUDENT", label: "수강생" },
                  { value: "INSTRUCTOR", label: "강사" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleChange(value)}
                  className="relative z-10 flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-colors duration-200"
                  style={{ color: role === value ? "#DDB978" : "#7A7684" }}
                  aria-pressed={role === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("role")} />
          </div>
        </fieldset>

        {/* Submit */}
        <div className="pt-4">
          <m.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            className="bg-gold relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl text-base font-semibold transition-opacity duration-200 disabled:opacity-60"
            style={{ color: "#08090E" }}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <m.span
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <LoadingDots />
                </m.span>
              ) : (
                <m.span
                  key={role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {role === "INSTRUCTOR" ? "강사로 가입하기" : "수강생으로 가입하기"}
                </m.span>
              )}
            </AnimatePresence>
          </m.button>
        </div>
      </form>

      <p className="text-warm-gray mt-8 mb-6 text-center text-sm">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-gold-light hover:text-gold font-medium transition-colors"
        >
          로그인
        </Link>
      </p>
    </>
  );
}
