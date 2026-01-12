"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  conversationId?: string;
  onSend?: (message: string) => void;
}

export function ChatInput({ conversationId, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSend?.(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
      <div className="relative flex items-end bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={1}
          className="flex-1 px-4 py-3 bg-transparent resize-none focus:outline-none max-h-[200px]"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          aria-label="Send message"
          className="p-2 m-2 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon />
        </button>
      </div>
      <p className="text-xs text-center text-[var(--text-secondary)] mt-2">
        Loqui는 실수를 할 수 있습니다. 중요한 정보는 확인하세요.
      </p>
    </form>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
