import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectableCourseCard } from "../course-card";

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

const BASE_COURSE = {
  id: 1,
  title: "React 기초",
  instructorName: "홍길동",
  maxStudents: 30,
  currentStudents: 10,
  price: 50000,
  isFull: false,
};

const FULL_COURSE = { ...BASE_COURSE, id: 2, isFull: true, currentStudents: 30 };

describe("SelectableCourseCard", () => {
  it('마감 강좌는 "마감" 뱃지를 표시하고 클릭 시 onToggle을 호출하지 않는다', async () => {
    const onToggle = vi.fn();
    render(<SelectableCourseCard course={FULL_COURSE} isSelected={false} onToggle={onToggle} />);
    expect(screen.getByText("마감")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("article"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("일반 강좌 클릭 시 onToggle을 호출한다", async () => {
    const onToggle = vi.fn();
    render(<SelectableCourseCard course={BASE_COURSE} isSelected={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("article"));
    expect(onToggle).toHaveBeenCalledWith(BASE_COURSE.id, false);
  });

  it("info 버튼 클릭 시 onDetail만 호출하고 onToggle은 호출하지 않는다", async () => {
    const onToggle = vi.fn();
    const onDetail = vi.fn();
    render(
      <SelectableCourseCard
        course={BASE_COURSE}
        isSelected={false}
        onToggle={onToggle}
        onDetail={onDetail}
      />,
    );
    await userEvent.click(screen.getByLabelText("강의 상세보기"));
    expect(onDetail).toHaveBeenCalledWith(BASE_COURSE.id);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
