import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoursesHeader } from "../courses/courses-header";

// ── Mocks ──

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("framer-motion", () => {
  const handler: ProxyHandler<object> = {
    get: (_target, tag: string) => {
      return ({ children, ...props }: Record<string, unknown>) => {
        const { _whileTap, _layoutId, _initial, _animate, _transition, ...rest } = props;
        const Element = tag as keyof HTMLElementTagNameMap;
        return <Element {...(rest as object)}>{children as React.ReactNode}</Element>;
      };
    },
  };
  return { m: new Proxy({}, handler) };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

import { useSession } from "next-auth/react";

// ── Helpers ──

function mockSession(data: unknown, status = "authenticated") {
  vi.mocked(useSession).mockReturnValue({
    data,
    status,
    update: vi.fn(),
  } as ReturnType<typeof useSession>);
}

// ── RBAC Tests ──

describe("CoursesHeader — RBAC", () => {
  const noop = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('강사 로그인 시 "강의 개설" 버튼이 노출된다', () => {
    mockSession({ user: { name: "김강사", role: "INSTRUCTOR" } });
    render(<CoursesHeader sort="recent" onSortChange={noop} />);
    expect(screen.getByText("강의 개설")).toBeInTheDocument();
  });

  it('수강생 로그인 시 "강의 개설" 버튼이 노출되지 않는다', () => {
    mockSession({ user: { name: "이학생", role: "STUDENT" } });
    render(<CoursesHeader sort="recent" onSortChange={noop} />);
    expect(screen.queryByText("강의 개설")).not.toBeInTheDocument();
  });

  it('비로그인 시 "로그인" 버튼 노출 + "강의 개설" 비노출', () => {
    mockSession(null, "unauthenticated");
    render(<CoursesHeader sort="recent" onSortChange={noop} />);
    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.queryByText("강의 개설")).not.toBeInTheDocument();
  });
});

// ── Sort Tab Tests ──

describe("CoursesHeader — 정렬 탭", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSession({ user: { name: "테스트", role: "STUDENT" } });
  });

  it('"신청자 많은 순" 클릭 → onSortChange("popular") 호출', async () => {
    const onSortChange = vi.fn();
    render(<CoursesHeader sort="recent" onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText("신청자 많은 순"));
    expect(onSortChange).toHaveBeenCalledWith("popular");
  });

  it('"신청률 높은 순" 클릭 → onSortChange("rate") 호출', async () => {
    const onSortChange = vi.fn();
    render(<CoursesHeader sort="recent" onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText("신청률 높은 순"));
    expect(onSortChange).toHaveBeenCalledWith("rate");
  });
});
