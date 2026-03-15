"use client";

import { EmailInput } from "@/components/ui/email-input";
import { FormField } from "@/components/ui/form-field";
import { LoadingDots } from "@/components/ui/loading-dots";
import { PasswordInput } from "@/components/ui/password-input";
import { LOGIN_ERROR_CODE, LOGIN_ERROR_MESSAGES, type LoginErrorCode } from "@/lib/api/errors";
import { loginSchema } from "@/lib/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { LoginForm as LoginFormValues } from "@/lib/schemas/login";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      const code = (result.code ?? LOGIN_ERROR_CODE.UNKNOWN) as LoginErrorCode;
      const message = LOGIN_ERROR_MESSAGES[code] ?? LOGIN_ERROR_MESSAGES[LOGIN_ERROR_CODE.UNKNOWN];
      toast.error(message);
      return;
    }

    router.push("/courses");
    router.refresh();
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="m-0 space-y-4 border-none p-0" disabled={isSubmitting}>
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

          <FormField label="비밀번호" error={errors.password?.message}>
            <PasswordInput
              autoComplete="current-password"
              placeholder="••••••"
              error={!!errors.password}
              {...register("password")}
            />
          </FormField>
        </fieldset>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gold flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-base font-semibold transition-opacity duration-200 disabled:opacity-60"
            style={{ color: "#08090E" }}
          >
            {isSubmitting ? <LoadingDots /> : "로그인"}
          </button>
        </div>
      </form>

      <p className="text-warm-gray mt-8 text-center text-sm">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="text-gold-light hover:text-gold font-medium transition-colors"
        >
          회원가입
        </Link>
      </p>
    </main>
  );
}
