import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "multi-CyberSecurity",
  description: "AI驱动的网络安全技能框架",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-bg text-gray-200 font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
