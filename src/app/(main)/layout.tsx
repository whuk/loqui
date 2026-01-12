"use client";

import { redirect } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { SystemSettingsButton } from "@/components/admin/SystemSettingsButton";
import { useAuthStore } from "@/stores/authStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-end items-center p-2 border-b border-[var(--border)]">
          <SystemSettingsButton />
        </header>
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
