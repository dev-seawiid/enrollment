"use client";

import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import {
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";

const EMAIL_DOMAINS = [
  "gmail.com",
  "naver.com",
  "kakao.com",
  "daum.net",
  "hanmail.net",
  "nate.com",
  "outlook.com",
  "icloud.com",
];

interface EmailInputProps extends Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
}

export function EmailInput({
  value = "",
  onChange,
  onBlur,
  error,
  className,
  ...props
}: EmailInputProps) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive suggestions from current value
  const atIdx = value.indexOf("@");
  const localPart = atIdx >= 0 ? value.slice(0, atIdx) : value;
  const domainPart = atIdx >= 0 ? value.slice(atIdx + 1) : "";

  const suggestions =
    atIdx >= 0 && localPart.length > 0
      ? EMAIL_DOMAINS.filter((d) => d.toLowerCase().startsWith(domainPart.toLowerCase())).map(
          (d) => `${localPart}@${d}`,
        )
      : [];

  const showSuggestions = open && suggestions.length > 0;

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      onChange?.(suggestion);
      setOpen(false);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange?.(v);
    setOpen(v.includes("@"));
    setHighlightIdx(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        selectSuggestion(suggestions[highlightIdx]);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        if (suggestions[highlightIdx]) {
          e.preventDefault();
          selectSuggestion(suggestions[highlightIdx]);
        }
        break;
    }
  };

  return (
    <Popover.Root open={showSuggestions} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          onFocus={() => value.includes("@") && setOpen(true)}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="email-suggestions"
          autoComplete="off"
          className={cn("input-base", error && "error", className)}
          {...props}
        />
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          id="email-suggestions"
          role="listbox"
          side="bottom"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-xl border py-1"
          style={{
            background: "#121620",
            borderColor: "rgba(234,229,220,0.12)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          {suggestions.map((suggestion, idx) => {
            const domain = suggestion.split("@")[1];
            const active = idx === highlightIdx;
            return (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightIdx(idx)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors"
                style={{
                  background: active ? "rgba(194,149,79,0.1)" : "transparent",
                  color: active ? "#DDB978" : "#EAE5DC",
                }}
              >
                <span className="truncate">
                  <span style={{ color: "#7A7684" }}>{localPart}@</span>
                  <span className="font-medium">{domain}</span>
                </span>
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
