"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, Terminal, Crosshair, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/data";

const navItems = [
  { href: "/", label: "概览", icon: Shield },
  { href: "/skills", label: "技能库", icon: BookOpen },
  { href: "/cli", label: "CLI 操作台", icon: Terminal },
  { href: "/attack", label: "ATT&CK 仪表盘", icon: Crosshair },
  { href: "/jailbreak", label: "破限 Payload", icon: Unlock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-bg-border bg-bg-secondary flex flex-col">
      <div className="p-4 border-b border-bg-border">
        <h1 className="text-sm font-bold text-accent font-mono">multi-CyberSecurity</h1>
        <p className="text-xs text-gray-500 mt-1">v{meta.version}</p>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent/10 text-accent border-r-2 border-accent"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-bg-border text-xs text-gray-600">
        {meta.total_skills} skills · {meta.total_modules} modules
      </div>
    </aside>
  );
}
