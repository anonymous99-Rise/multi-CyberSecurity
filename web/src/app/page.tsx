import Link from "next/link";
import { Shield, BookOpen, Terminal, Crosshair, Unlock, Package } from "lucide-react";
import { meta, platforms, getAttackCoverageStats } from "@/lib/data";

export default function Home() {
  const atkStats = getAttackCoverageStats();

  const cards = [
    { href: "/skills", icon: BookOpen, title: "技能库浏览器", desc: `${meta.total_skills} 个安全技能，${meta.total_modules} 个分类` },
    { href: "/cli", icon: Terminal, title: "CLI 可视化操作台", desc: "表单化发起审计/红队/破限命令" },
    { href: "/attack", icon: Crosshair, title: "ATT&CK 可视化仪表盘", desc: `${atkStats.covered} 个 ATT&CK 技术覆盖` },
    { href: "/jailbreak", icon: Unlock, title: "破限 Payload 浏览器", desc: "L1-L4 分级，8 平台 payload" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-accent mb-2 font-mono">
          multi-CyberSecurity
        </h1>
        <p className="text-gray-400">{meta.description}</p>
        <p className="text-sm text-gray-600 mt-2">
          v{meta.version} · 最后更新 {meta.last_updated}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group border border-bg-border rounded-lg p-5 hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} className="text-accent" />
                <h2 className="text-lg font-semibold text-gray-200 group-hover:text-accent">
                  {c.title}
                </h2>
              </div>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      <div className="border border-bg-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Package size={16} className="text-accent" /> 平台支持
        </h2>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <span
              key={p.id}
              className="px-3 py-1 rounded text-xs font-mono border"
              style={{ borderColor: p.color + "40", color: p.color }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <div className="border border-bg-border rounded-lg p-5 mt-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">遵循标准</h2>
        <div className="flex flex-wrap gap-2">
          {meta.standards.map((s) => (
            <span key={s} className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
