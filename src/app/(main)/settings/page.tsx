"use client";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-8">설정</h1>

      {/* Theme settings */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">테마</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="theme" value="light" className="w-4 h-4" />
            <span>라이트</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="theme" value="dark" className="w-4 h-4" />
            <span>다크</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="theme" value="system" className="w-4 h-4" defaultChecked />
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

      {/* Password change */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">비밀번호 변경</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">새 비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors">
            저장
          </button>
        </div>
      </section>
    </div>
  );
}
