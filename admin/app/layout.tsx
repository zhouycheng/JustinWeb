import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "JustinView Admin",
  description: "JustinView 本地内容管理工作台",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
