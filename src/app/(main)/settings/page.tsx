"use client";

import { useRouter } from "next/navigation";
import { useThemeStore, Theme } from "@/stores/themeStore";
import { CustomInstructionsForm } from "@/components/settings/CustomInstructionsForm";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, applyTheme } = useThemeStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // Use getState() to get applyTheme with updated state
    useThemeStore.getState().applyTheme();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative h-full">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
        aria-label="뒤로 가기"
      >
        <BackIcon />
        <span>뒤로</span>
      </button>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-8">설정</h1>

      {/* Theme settings */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">테마</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              className="w-4 h-4"
              checked={theme === 'light'}
              onChange={() => handleThemeChange('light')}
            />
            <span>라이트</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              className="w-4 h-4"
              checked={theme === 'dark'}
              onChange={() => handleThemeChange('dark')}
            />
            <span>다크</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="system"
              className="w-4 h-4"
              checked={theme === 'system'}
              onChange={() => handleThemeChange('system')}
            />
            <span>시스템</span>
          </label>
        </div>
      </section>

      {/* Profile settings */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">프로필</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              value="user@example.com"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Custom Instructions */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">맞춤형 지침</h2>
        <CustomInstructionsForm />
        <div className="mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

function BackIcon() {
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
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
