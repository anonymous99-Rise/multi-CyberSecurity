import Link from "next/link";
import { Shield, BookOpen, Terminal, Crosshair, Unlock, Package, GitBranch, Zap } from "lucide-react";
import { meta, platforms, getAttackCoverageStats, getNistCsfCoverage } from "@/lib/data";

export default function Home() {
  const atkStats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const cards = [
    { href: "/skills", icon: BookOpen, title: "技能库", code: "SKILLS", desc: `${meta.total_skills} skills · ${meta.total_modules} modules`, color: "#00e5ff" },
    { href: "/cli", icon: Terminal, title: "CLI 操作台", code: "CLI", desc: "审计 · 红队 · 破限", color: "#00ff88" },
    { href: "/attack", icon: Crosshair, title: "ATT&CK", code: "MATRIX", desc: `${atkStats.covered} techniques covered`, color: "#ffb000" },
    { href: "/jailbreak", icon: Unlock, title: "破限 Payload", code: "JAILBREAK", desc: "L1-L4 · 8 platforms", color: "#ff0040" },
  ];

  const submodules = [
    { name: "CkSKILLS", desc: "SRC 挖洞技能体系" },
    { name: "dsh-pentest", desc: "DSH 渗透模式插件" },
    { name: "dsh-infinite-gen-4", desc: "DSH 红队评测插件" },
    { name: "CyberStrikeAI", desc: "AI 原生安全操作平台" },
  ];

  const csfLabels: Record<string, string> = {
    ID: "IDENTIFY", PR: "PROTECT", DE: "DETECT", RS: "RESPOND", RC: "RECOVER",
  };

  return (
    <div className="p-8 max-w-5xl animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="text-[10px] text-accent/60 font-mono tracking-widest uppercase mb-2">
          // AI-Powered Cybersecurity Framework
        </div>
        <h1 className="text-4xl font-bold text-gray-100 font-mono tracking-tight">
          multi<span className="text-accent term-glow">-</span>CyberSecurity
        </h1>
        <div className="glow-line w-32 mt-3 mb-4" />
        <p className="text-sm text-gray-500 max-w-xl">{meta.description}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { v: meta.total_skills, l: "SKILLS", c: "#00e5ff" },
          { v: meta.total_modules, l: "MODULES", c: "#00ff88" },
          { v: atkStats.covered, l: "ATT&CK", c: "#ffb000" },
          { v: platforms.length, l: "PLATFORMS", c: "#b066ff" },
        ].map((s, i) => (
          <div
            key={s.l}
            className="tac-card p-4 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="text-[9px] text-gray-600 font-mono tracking-widest mb-1">{s.l}</div>
            <div className="text-3xl font-bold font-mono" style={{ color: s.c }}>
              {String(s.v).padStart(3, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="tac-card p-5 group animate-slide-up"
              style={{ animationDelay: `${i * 100 + 320}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={18} style={{ color: c.color }} />
                <span className="text-[9px] font-mono text-gray-700 tracking-widest">{c.code}</span>
              </div>
              <h2 className="text-base font-semibold text-gray-200 group-hover:text-accent transition-colors mb-1">
                {c.title}
              </h2>
              <p className="text-xs text-gray-600 font-mono">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Two column: platforms + submodules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Platforms */}
        <div className="tac-card p-5">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
            <Zap size={12} className="text-accent" /> PLATFORMS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <span
                key={p.id}
                className="px-2 py-0.5 text-[10px] font-mono border tracking-wider"
                style={{ borderColor: p.color + "30", color: p.color, background: p.color + "08" }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* Submodules */}
        <div className="tac-card p-5">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
            <GitBranch size={12} className="text-accent" /> REPOSITORIES
          </div>
          <div className="space-y-1.5">
            {submodules.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <Package size={11} className="text-gray-600" />
                <span className="font-mono text-gray-300">{s.name}</span>
                <span className="text-gray-700">—</span>
                <span className="text-gray-600 text-[11px]">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NIST CSF */}
      <div className="tac-card p-5 mb-4">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-4">
          // NIST CSF COVERAGE
        </div>
        <div className="space-y-2.5">
          {csfData.map((d) => {
            const max = csfData[0].count;
            return (
              <div key={d.func} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-500 w-16 tracking-wider">
                  {csfLabels[d.func] || d.func}
                </span>
                <div className="flex-1 h-3 bg-bg-tertiary relative overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(d.count / max) * 100}%`,
                      background: `linear-gradient(90deg, var(--accent-dim), var(--accent))`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-accent/60 w-8 text-right">{d.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards */}
      <div className="tac-card p-5">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-3">
          // COMPLIANCE STANDARDS
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meta.standards.map((s) => (
            <span
              key={s}
              className="text-[10px] text-gray-500 px-2 py-0.5 bg-bg-tertiary border border-bg-border font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
