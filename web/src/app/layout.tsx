import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "multi-CyberSecurity",
  description: "AI驱动的网络安全技能框架 — 渗透测试全流程技能体系（MITRE ATT&CK + NIST CSF）",
  applicationName: "multi-CyberSecurity",
  keywords: ["cybersecurity", "渗透测试", "MITRE ATT&CK", "NIST CSF", "安全技能库"],
  openGraph: {
    title: "multi-CyberSecurity",
    description: "AI驱动的网络安全技能框架 — 199 个技能 · 39 个分类 · 97 项 ATT&CK 技术覆盖",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`dark ${jetbrains.variable} ${plex.variable}`}>
      <body className="font-sans">
        <div className="flex min-h-screen relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
