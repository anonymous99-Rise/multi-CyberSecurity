"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, Terminal, Crosshair, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/data";

const navItems = [
  { href: "/", label: "概览", code: "00", icon: Shield },
  { href: "/skills", label: "技能库", code: "01", icon: BookOpen },
  { href: "/cli", label: "CLI 操作台", code: "02", icon: Terminal },
  { href: "/attack", label: "ATT&CK", code: "03", icon: Crosshair },
  { href: "/jailbreak", label: "破限 Payload", code: "04", icon: Unlock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-bg-border bg-bg-secondary/80 backdrop-blur-sm flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-bg-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-accent/50 flex items-center justify-center">
            <Shield size={12} className="text-accent" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold text-accent font-mono tracking-wider uppercase">
              mCS
            </h1>
          </div>
        </div>
        <p className="text-[9px] text-gray-600 mt-2 font-mono tracking-widest">
          v{meta.version} · {meta.last_updated}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        <div className="px-4 mb-2 text-[9px] text-gray-700 font-mono tracking-widest uppercase">
          // Navigation
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-2 text-[13px] transition-all relative",
                active
                  ? "text-accent bg-accent/5"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/2"
              )}
            >
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
              )}
              <span className="text-[9px] font-mono text-gray-700 group-hover:text-accent/50 transition-colors">
                {item.code}
              </span>
              <Icon size={14} className={active ? "text-accent" : ""} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-bg-border">
        <div className="text-[9px] text-gray-700 font-mono tracking-widest uppercase mb-2">
          // Status
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-gray-600">SKILLS</span>
            <span className="text-accent/80">{meta.total_skills}</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-gray-600">MODULES</span>
            <span className="text-accent/80">{meta.total_modules}</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-gray-600">STATUS</span>
            <span className="text-accent flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
