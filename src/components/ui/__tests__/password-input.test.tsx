import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "../password-input";

describe("PasswordInput", () => {
  it("초기 상태에서 type이 password이다", () => {
    render(<PasswordInput placeholder="비밀번호" />);
    expect(screen.getByPlaceholderText("비밀번호")).toHaveAttribute("type", "password");
  });

  it("토글 버튼 클릭 시 type이 text로 변경된다", async () => {
    render(<PasswordInput placeholder="비밀번호" />);
    await userEvent.click(screen.getByLabelText("비밀번호 보기"));
    expect(screen.getByPlaceholderText("비밀번호")).toHaveAttribute("type", "text");
  });

  it("다시 토글하면 type이 password로 돌아온다", async () => {
    render(<PasswordInput placeholder="비밀번호" />);
    await userEvent.click(screen.getByLabelText("비밀번호 보기"));
    await userEvent.click(screen.getByLabelText("비밀번호 숨기기"));
    expect(screen.getByPlaceholderText("비밀번호")).toHaveAttribute("type", "password");
  });
});
