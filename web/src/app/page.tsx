import Link from "next/link";
import { Shield, BookOpen, Terminal, Crosshair, Unlock, Package, GitBranch, Zap } from "lucide-react";
import { meta, platforms, getAttackCoverageStats, getNistCsfCoverage } from "@/lib/data";

export default function Home() {
  const atkStats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const cards = [
    { href: "/skills", icon: BookOpen, title: "技能库浏览器", desc: `${meta.total_skills} 个安全技能，${meta.total_modules} 个分类`, color: "#4f9eff" },
    { href: "/cli", icon: Terminal, title: "CLI 可视化操作台", desc: "表单化发起审计/红队/破限命令", color: "#00ff88" },
    { href: "/attack", icon: Crosshair, title: "ATT&CK 可视化仪表盘", desc: `${atkStats.covered} 个 ATT&CK 技术覆盖`, color: "#ff9f40" },
    { href: "/jailbreak", icon: Unlock, title: "破限 Payload 浏览器", desc: "L1-L4 分级，8 平台 payload", color: "#ff3366" },
  ];

  const submodules = [
    { name: "CkSKILLS", desc: "SRC 挖洞技能体系", url: "zhaji2333/CkSKILLS" },
    { name: "dsh-pentest", desc: "DSH 渗透模式插件", url: "howmp/dsh-pentest" },
    { name: "dsh-infinite-gen-4", desc: "DSH 红队评测插件", url: "Minglink/dsh-infinite-gen-4" },
    { name: "CyberStrikeAI", desc: "AI 原生安全操作平台", url: "AIPentest/CyberStrikeAI" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={28} className="text-accent" />
          <h1 className="text-3xl font-bold text-accent font-mono">multi-CyberSecurity</h1>
        </div>
        <p className="text-gray-400">{meta.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm text-gray-600">v{meta.version}</span>
          <span className="text-sm text-gray-600">·</span>
          <span className="text-sm text-gray-600">最后更新 {meta.last_updated}</span>
        </div>
      </div>

      {/* 统计数字 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatBox value={meta.total_skills} label="安全技能" color="#4f9eff" />
        <StatBox value={meta.total_modules} label="分类模块" color="#00ff88" />
        <StatBox value={atkStats.covered} label="ATT&CK 覆盖" color="#ff9f40" />
        <StatBox value={platforms.length} label="平台适配" color="#a78bfa" />
      </div>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group border border-bg-border rounded-lg p-5 hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} style={{ color: c.color }} />
                <h2 className="text-lg font-semibold text-gray-200 group-hover:text-accent">
                  {c.title}
                </h2>
              </div>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* 平台支持 */}
      <div className="border border-bg-border rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Zap size={16} className="text-accent" /> 平台支持
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

      {/* 子仓库 */}
      <div className="border border-bg-border rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <GitBranch size={16} className="text-accent" /> 子仓库
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {submodules.map((s) => (
            <div key={s.name} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded">
              <Package size={14} className="text-gray-500" />
              <div>
                <p className="text-xs font-mono text-gray-300">{s.name}</p>
                <p className="text-[10px] text-gray-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NIST CSF */}
      <div className="border border-bg-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">NIST CSF 覆盖分布</h2>
        <div className="flex flex-wrap gap-3">
          {csfData.map((d) => (
            <div key={d.func} className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{d.func}</span>
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent/60 rounded-full"
                  style={{ width: `${(d.count / csfData[0].count) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-mono">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 遵循标准 */}
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

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="border border-bg-border rounded-lg p-4 text-center">
      <p className="text-3xl font-bold font-mono" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
