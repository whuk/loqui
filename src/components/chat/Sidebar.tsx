"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

// 임시 더미 데이터
const dummyConversations = [
  { id: "1", title: "React 컴포넌트 설계" },
  { id: "2", title: "TypeScript 타입 질문" },
  { id: "3", title: "Next.js 라우팅" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 h-full bg-sidebar-light dark:bg-sidebar-dark flex flex-col border-r border-[var(--border)]">
      {/* New chat button */}
      <div className="p-3">
        <Link
          href="/chat"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
        >
          <PlusIcon />
          <span>새 대화</span>
        </Link>
      </div>

      {/* Conversation list */}
      <nav className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {dummyConversations.map((conv) => {
            const isActive = pathname === `/chat/${conv.id}`;
            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--bg-tertiary)] border-l-2 border-accent"
                    : "hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <ChatIcon />
                <span className="truncate">{conv.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <SettingsIcon />
          <span>설정</span>
        </Link>
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-left"
        >
          <LogoutIcon />
          <span>로그아웃</span>
        </button>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-lg max-w-sm w-full mx-4">
            <p className="text-center mb-4">로그아웃 하시겠습니까?</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChatIcon() {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
