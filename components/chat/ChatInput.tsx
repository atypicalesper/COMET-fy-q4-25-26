"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
    setValue(el.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2.5 px-5 py-4 bg-[#12121a] border-t border-[#2a2a3a]"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your documents..."
        disabled={disabled}
        aria-label="Message input"
        className="flex-1 px-4 py-3 bg-[#0a0a0f] text-[#e8e8f0] border border-[#2a2a3a] rounded-lg text-sm resize-none outline-none min-h-[44px] max-h-[120px] leading-relaxed placeholder:text-[#555570] focus:border-[#6c5ce7] transition-colors disabled:opacity-40"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="px-5 bg-[#6c5ce7] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#7c6ff7] hover:shadow-[0_0_20px_rgba(108,92,231,0.3)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
      >
        Send
      </button>
    </form>
  );
}
