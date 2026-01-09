"use client";

import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Empty state */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-accent">Loqui</h1>
          <p className="text-[var(--text-secondary)]">무엇을 도와드릴까요?</p>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[var(--border)]">
        <ChatInput />
      </div>
    </div>
  );
}
