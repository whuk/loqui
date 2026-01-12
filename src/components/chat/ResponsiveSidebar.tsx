"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function ResponsiveSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="메뉴"
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
      >
        <MenuIcon />
      </button>

      {/* Desktop sidebar */}
      <div data-testid="sidebar-container" className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div data-testid="sidebar-overlay" className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            data-testid="sidebar-backdrop"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="absolute left-0 top-0 h-full w-64 bg-[var(--bg-primary)]">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
              className="absolute top-3 right-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
            >
              <CloseIcon />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
