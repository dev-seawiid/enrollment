import { overlay } from "overlay-kit";
import { createElement } from "react";
import { ErrorDialog } from "@/components/dialogs/error-dialog";
import { classifyError, RecoverableError } from "@/lib/api/errors";

/**
 * 에러를 분류하고 다이얼로그로 표시합니다.
 * - 복구 가능: 서버 메시지를 다이얼로그로 안내
 * - 복구 불가능: throw하여 Error Boundary로 전파
 */
export async function showErrorDialog(err: unknown, title?: string): Promise<void> {
  const classified = await classifyError(err);

  if (classified instanceof RecoverableError) {
    overlay.open(({ isOpen, close, unmount }) =>
      createElement(ErrorDialog, {
        title: title ?? "요청에 실패했습니다",
        message: classified.message,
        isOpen,
        onClose: () => {
          close();
          setTimeout(unmount, 200);
        },
      }),
    );
    return;
  }

  // 복구 불가능 → Error Boundary로 전파
  throw classified;
}
