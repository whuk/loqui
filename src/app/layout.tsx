import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loqui - Chat",
  description: "AI Chat Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
