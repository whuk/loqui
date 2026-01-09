"use client";

import { use } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";

// 임시 더미 데이터
const dummyMessages = [
  { id: "1", role: "user" as const, content: "안녕하세요!" },
  {
    id: "2",
    role: "assistant" as const,
    content: "안녕하세요! 무엇을 도와드릴까요?",
  },
];

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-4 px-4">
          {dummyMessages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[var(--border)]">
        <ChatInput conversationId={id} />
      </div>
    </div>
  );
}
