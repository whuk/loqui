interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`py-4 ${
        isUser ? "bg-transparent" : "bg-message-assistant-light dark:bg-message-assistant-dark"
      }`}
    >
      <div className="flex gap-4 max-w-3xl mx-auto px-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-accent text-white"
              : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
          }`}
        >
          {isUser ? <UserIcon /> : <BotIcon />}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="font-medium text-sm">
            {isUser ? "You" : "Loqui"}
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
