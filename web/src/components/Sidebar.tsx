"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, Terminal, Crosshair, Unlock, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { meta, externalSkills } from "@/lib/data";

const navItems = [
  { href: "/", label: "概览", code: "00", icon: Shield },
  { href: "/skills", label: "技能库", code: "01", icon: BookOpen },
  { href: "/cli", label: "CLI 操作台", code: "02", icon: Terminal },
  { href: "/attack", label: "ATT&CK", code: "03", icon: Crosshair },
  { href: "/jailbreak", label: "破限 Payload", code: "04", icon: Unlock },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-bg-secondary border border-bg-border text-gray-400 hover:text-accent hover:border-accent/40 transition-colors"
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-[1px] z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-56 shrink-0 border-r border-bg-border bg-bg-secondary/80 backdrop-blur-sm flex flex-col z-40 transition-transform duration-300",
          "fixed lg:sticky top-0 h-screen",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="px-4 py-4 border-b border-bg-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-accent/40 flex items-center justify-center shrink-0">
              <Shield size={13} className="text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-accent font-mono tracking-wider uppercase leading-none">
                mCS
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                multi-CyberSecurity
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-mono tracking-wide metric-num">
            v{meta.version} · {meta.last_updated}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <div className="px-4 mb-2 label-tech">// Navigation</div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors relative",
                  active
                    ? "text-accent bg-accent/5"
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                )}
              >
                {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />}
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-accent/60 transition-colors metric-num">
                  {item.code}
                </span>
                <Icon size={14} className={active ? "text-accent" : "text-gray-500 group-hover:text-gray-300"} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer stats */}
        <div className="px-4 py-3 border-t border-bg-border">
          <div className="label-tech mb-2">// Status</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-500">SKILLS</span>
              <span className="text-accent metric-num">{meta.total_skills}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-500">MODULES</span>
              <span className="text-accent metric-num">{meta.total_modules}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-500" title="external/ 子仓库的 SKILL.md 数（不并入自有技能）">
                EXTERNAL
              </span>
              <span className="text-info metric-num">{fmt(externalSkills.external_skill_md_total)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-500">STATUS</span>
              <span className="text-accent flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
