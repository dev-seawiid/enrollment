"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { SortType } from "@/lib/api/courses";
import { m } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SORT_OPTIONS: { key: SortType; label: string }[] = [
  { key: "recent", label: "최근 등록순" },
  { key: "popular", label: "신청자 많은 순" },
  { key: "rate", label: "신청률 높은 순" },
];

interface CoursesHeaderProps {
  sort: SortType;
  onSortChange: (sort: SortType) => void;
}

export function CoursesHeader({ sort, onSortChange }: CoursesHeaderProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("로그아웃 되었습니다");
    router.push("/login");
    router.refresh();
  };

  return (
    <header
      className="fixed top-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-3 backdrop-blur-xl"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(8, 9, 14, 0.1)",
        borderBottom: "1px solid rgba(234, 229, 220, 0.06)",
      }}
    >
      <div className="flex h-12 items-center justify-between gap-2">
        <h1
          className="text-gold flex-shrink-0 text-xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          수강신청
        </h1>

        <div className="flex min-w-0 items-center gap-1.5">
          {status === "loading" ? (
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-8 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-lg" />
            </div>
          ) : user ? (
            <>
              <span className="text-ivory truncate text-[11px] font-medium">{user.name}</span>
              <span
                className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  background:
                    user.role === "INSTRUCTOR" ? "rgba(72,117,191,0.15)" : "rgba(56,190,163,0.15)",
                  color: user.role === "INSTRUCTOR" ? "#4875BF" : "#38BEA3",
                }}
              >
                {user.role === "INSTRUCTOR" ? "강사" : "수강생"}
              </span>

              <m.button
                onClick={handleLogout}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors"
                style={{ borderColor: "rgba(234,229,220,0.12)", color: "#7A7684" }}
              >
                로그아웃
              </m.button>

              {user.role === "INSTRUCTOR" ? (
                <Link href="/courses/new">
                  <m.div
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-shrink-0 items-center gap-0.5 rounded-md border px-2 py-1 text-[11px] font-semibold"
                    style={{
                      background: "rgba(194,149,79,0.08)",
                      borderColor: "rgba(194,149,79,0.3)",
                      color: "#DDB978",
                    }}
                  >
                    <span>+</span>
                    <span>개설</span>
                  </m.div>
                </Link>
              ) : null}
            </>
          ) : (
            <Link href="/login">
              <m.div
                whileTap={{ scale: 0.95 }}
                className="rounded-md border px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: "rgba(194,149,79,0.08)",
                  borderColor: "rgba(194,149,79,0.3)",
                  color: "#DDB978",
                }}
              >
                로그인
              </m.div>
            </Link>
          )}
        </div>
      </div>

      {/* Sort tabs */}
      <div
        className="-mx-3 flex gap-0.5 overflow-x-auto px-3 pt-0.5 pb-2.5"
        role="tablist"
        aria-label="정렬 기준"
      >
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={sort === key}
            onClick={() => onSortChange(key)}
            className="relative flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-200"
            style={{ color: sort === key ? "#DDB978" : "#7A7684" }}
          >
            {sort === key && (
              <m.div
                layoutId="sort-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(194,149,79,0.12)",
                  border: "1px solid rgba(194,149,79,0.25)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
