"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ErrorDialogProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ErrorDialog({
  title = "오류가 발생했습니다",
  message,
  isOpen,
  onClose,
}: ErrorDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[340px] text-center">
        <div className="flex flex-col items-center gap-3 pt-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(207,80,80,0.12)" }}
          >
            <span className="text-lg" style={{ color: "#CF5050" }}>
              !
            </span>
          </div>
          <DialogHeader className="mb-0">
            <DialogTitle className="text-center">{title}</DialogTitle>
          </DialogHeader>
          <p className="text-warm-gray text-sm leading-relaxed">{message}</p>
        </div>

        <DialogFooter className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gold flex-1 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ color: "#08090E" }}
          >
            확인
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
