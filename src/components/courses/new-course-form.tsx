"use client";

import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { NumberInput } from "@/components/ui/number-input";
import { CourseConfirmDialog } from "@/components/dialogs/course-confirm-dialog";
import { createCourseAction } from "@/lib/actions/course";
import { courseSchema, type CourseFormData } from "@/lib/schemas/course";
import { showErrorDialog } from "@/lib/show-error-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { m } from "framer-motion";
import { overlay } from "overlay-kit";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function NewCourseForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      maxStudents: undefined,
      price: undefined,
    },
  });

  const onValidSubmit = (data: CourseFormData) => {
    const instructorName = session?.user.name;
    if (!instructorName) {
      toast.error("로그인이 필요합니다");
      return;
    }

    overlay.open(({ isOpen, close, unmount }) => (
      <CourseConfirmDialog
        title={data.title}
        instructorName={instructorName}
        maxStudents={data.maxStudents}
        price={data.price}
        isConfirming={isConfirming}
        isOpen={isOpen}
        close={async (confirmed) => {
          if (!confirmed) {
            close();
            setTimeout(unmount, 200);
            return;
          }

          setIsConfirming(true);
          try {
            await createCourseAction({ ...data, instructorName });
            toast.success("강의가 등록되었습니다");
            close();
            setTimeout(unmount, 200);
            router.push("/courses");
          } catch (err) {
            await showErrorDialog(err, "강의 등록 실패");
          } finally {
            setIsConfirming(false);
          }
        }}
        unmount={unmount}
      />
    ));
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
      className="flex flex-1 flex-col px-5 pt-2"
    >
      <div className="flex-1 space-y-1">
        <FormField label="강의명" error={errors.title?.message} required>
          <Textarea
            placeholder="예) 너나위의 내집마련 기초반"
            rows={2}
            style={{ minHeight: "68px" }}
            error={!!errors.title}
            {...register("title")}
          />
        </FormField>

        <FormField label="강의 소개" error={errors.description?.message} badge="선택">
          <Textarea
            placeholder="강의에 대한 간단한 소개를 입력해주세요"
            rows={3}
            error={!!errors.description}
            {...register("description")}
          />
        </FormField>

        <FormField label="최대 수강 인원" error={errors.maxStudents?.message} required>
          <Controller
            name="maxStudents"
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="30"
                min={1}
                addonAfter="명"
                value={field.value}
                onAccept={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.maxStudents}
              />
            )}
          />
        </FormField>

        <FormField label="수강료" error={errors.price?.message} required>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="100,000"
                min={0}
                addonBefore="₩"
                value={field.value}
                onAccept={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.price}
              />
            )}
          />
        </FormField>
      </div>

      {/* Sticky bottom button */}
      <div
        className="sticky bottom-0 pt-4 pb-6"
        style={{
          background: "linear-gradient(to top, #08090E 70%, transparent)",
          paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <m.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="bg-gold flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-base font-semibold transition-opacity duration-200"
          style={{ color: "#08090E" }}
        >
          등록하기
        </m.button>
      </div>
    </form>
  );
}
