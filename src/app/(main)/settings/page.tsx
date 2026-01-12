"use client";

import { useThemeStore, Theme } from "@/stores/themeStore";

export default function SettingsPage() {
  const { theme, setTheme, applyTheme } = useThemeStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // Use getState() to get applyTheme with updated state
    useThemeStore.getState().applyTheme();
  };

  return (
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

    </div>
  );
}
