"use client";

import { redirect } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
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
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
