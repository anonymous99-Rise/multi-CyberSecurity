import Link from "next/link";
import { BookOpen, Terminal, Crosshair, Unlock, Package, GitBranch, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";
import { meta, platforms, submodules, externalSkills, getAttackCoverageStats, getNistCsfCoverage } from "@/lib/data";

// 千分位格式化：用固定实现而不是 toLocaleString()，避免构建端与浏览器端 locale 不一致导致 hydration 警告
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 配色规则（全站统一）：
//   主色 #00ff88 = 自有内容 / 交互；信息色 #00e5ff = 外部引用；#ffb000 / #ff0040 只用于告警语义。
//   不再用紫色等装饰色 —— 之前首页一屏出现 12 种颜色是"廉价感"的主要来源。
const ACCENT = "#00ff88";
const INFO = "#00e5ff";

export default function Home() {
  const atkStats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const cards = [
    { href: "/skills", icon: BookOpen, title: "技能库", code: "SKILLS", desc: `${meta.total_skills} 个自有技能 · ${meta.total_modules} 个分类` },
    { href: "/cli", icon: Terminal, title: "CLI 操作台", code: "CLI", desc: "审计 · 红队 · 破限命令生成" },
    { href: "/attack", icon: Crosshair, title: "ATT&CK 矩阵", code: "MATRIX", desc: `${atkStats.covered} 项技术覆盖 · 平均分 ${atkStats.avgScore}` },
    { href: "/jailbreak", icon: Unlock, title: "破限 Payload", code: "JAILBREAK", desc: "L1-L4 分级 · 8 个平台适配" },
  ];

  const stats = [
    { v: fmt(meta.total_skills), l: "SKILLS", sub: "自有技能", color: ACCENT },
    { v: String(meta.total_modules), l: "MODULES", sub: "分类模块", color: ACCENT },
    { v: String(atkStats.covered), l: "ATT&CK", sub: "技术覆盖", color: ACCENT },
    { v: String(platforms.length), l: "PLATFORMS", sub: "适配平台", color: ACCENT },
    { v: fmt(externalSkills.external_skill_md_total), l: "EXTERNAL", sub: "外部 SKILL.md", color: INFO },
  ];
  const csfLabels: Record<string, string> = {
    ID: "IDENTIFY", PR: "PROTECT", DE: "DETECT", RS: "RESPOND", RC: "RECOVER",
  };

  // 合规标准分组展示（原先 10 枚同款芯片平铺，看不出主次）
  const standardGroups: { label: string; items: string[] }[] = [
    { label: "方法论 / 渗透", items: ["PTES (Penetration Testing Execution Standard)", "OWASP Testing Guide v4.2"] },
    { label: "NIST / 美国", items: ["NIST SP 800-115", "NIST SP 800-61 Rev 2", "CIS Benchmarks"] },
    { label: "ATT&CK / OWASP", items: ["MITRE ATT&CK v15", "MITRE ATLAS™", "OWASP Top 10 for LLM Applications"] },
    { label: "中国 / 国际认证", items: ["ISO 27001", "等级保护2.0"] },
  ];
  const grouped = new Set(standardGroups.flatMap((g) => g.items));
  const rest = (meta.standards as string[]).filter((s) => !grouped.has(s));

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-5xl animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="label-tech text-accent/70 mb-2">// AI-Powered Cybersecurity Framework</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 font-mono tracking-tight">
          multi<span className="text-accent term-glow">-</span>CyberSecurity
        </h1>
        <div className="glow-line w-40 mt-4 mb-4" />
        <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">{meta.description}</p>

        {/* Hero 指标条：一眼交代规模与版本，替代原先散落各处的数字 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-[11px] font-mono">
          <span className="px-2 py-0.5 border border-accent/40 text-accent">v{meta.version}</span>
          <span className="text-gray-500">
            <span className="text-gray-300 metric-num">{meta.total_skills}</span> 自有技能
          </span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-500">
            <span className="text-gray-300 metric-num">{fmt(externalSkills.external_skill_md_total)}</span> 外部 SKILL.md
          </span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-500">
            <span className="text-gray-300 metric-num">{submodules.length}</span> 子仓库
          </span>
          <span className="text-gray-700">·</span>
          <span className="text-gray-600">更新于 {meta.last_updated}</span>
        </div>
      </div>

      {/* Stats：一个面板 + 发丝分隔线，而非 5 个各带颜色的盒子（减少装饰噪音，突出数字） */}
      <div className="tac-card mb-4 animate-slide-up">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-bg-border">
          {stats.map((s) => (
            <div key={s.l} className="p-4 min-w-0">
              {/* 颜色标记做成短横条：比 1.5px 小方块明显，又不会让人误以为整卡可点 */}
              <span className="block h-[2px] w-8 mb-2.5" style={{ background: s.color }} />
              <div className="label-tech mb-1.5 truncate">{s.l}</div>
              {/* 五个数字等权重（白色），颜色只留在标记与说明文字上 */}
              <div className="text-2xl sm:text-3xl font-bold metric-num truncate text-gray-100">{s.v}</div>
              <div
                className="text-[10px] mt-1 truncate"
                style={{ color: s.color === INFO ? "var(--info)" : "var(--text-3)" }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 计数口径：自有技能与外部子仓库技能分开计数，避免读者误以为总数应随子仓库增长 */}
      <div className="note-strip px-3 py-2.5 mb-7">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <span className="text-accent/80 font-mono">统计口径</span>
          {" "}SKILLS / MODULES / ATT&amp;CK 为本仓库自有内容（{meta.total_modules} 个分类下的 <span className="font-mono text-gray-300">NN-*/skills</span>）；
          external/ 的 {externalSkills.repo_count} 个子仓库（{externalSkills.repo_with_skills} 个含 SKILL.md）以 git submodule 引用，
          单独计为 <span className="font-mono text-info">EXTERNAL {externalSkills.external_skill_md_total}</span>
          （另含知识库类 markdown {fmt(externalSkills.external_md_total ?? 0)} 个），<span className="text-gray-300">不并入</span>自有技能数。
          下方仓库右侧：<span className="font-mono text-accent/80">skill</span> = SKILL.md 数，<span className="font-mono text-gray-400">md</span> = markdown 总数。
        </p>
      </div>

      {/* Feature cards：主入口统一主色 + 左侧色条，hover 出现箭头 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="tac-card tac-card-primary p-5 group animate-slide-up flex items-start gap-4"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <span className="mt-0.5 shrink-0 w-8 h-8 border border-accent/30 flex items-center justify-center text-accent group-hover:border-accent/70 transition-colors">
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-gray-100 group-hover:text-accent transition-colors">
                    {c.title}
                  </h2>
                  <span className="label-tech">{c.code}</span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all"
                  />
                </span>
                <span className="block text-xs text-gray-400 mt-1 truncate">{c.desc}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Platforms */}
      <div className="tac-card p-5 mb-3">
        <div className="label-tech mb-3 flex flex-wrap items-center gap-2">
          <Zap size={12} className="text-accent" /> PLATFORMS
          <span className="text-gray-500 normal-case tracking-normal">· {platforms.length} 个适配平台</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {platforms.map((p) => (
            <span
              key={p.id}
              className="px-2 py-1 text-[11px] font-mono border border-bg-border text-gray-400 hover:border-accent/40 hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-accent/60" />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Submodules — 清单由 scripts/sync-data.mjs 解析根目录 .gitmodules 生成 */}
      <div className="tac-card p-5 mb-4">
        <div className="label-tech mb-3 flex flex-wrap items-center gap-2">
          <GitBranch size={12} className="text-info" /> REPOSITORIES
          <span className="text-gray-500 normal-case tracking-normal">
            · {String(submodules.length).padStart(2, "0")} 个外部引用
          </span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6">
          {submodules.map((s) => (
            <a
              key={s.path}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              title={`${s.path} — ${s.desc}`}
              className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs min-w-0 py-2 border-b border-bg-border/60 hover:bg-white/5 transition-colors group"
            >
              <Package size={12} className="text-gray-500 shrink-0" />
              <span className="font-mono text-gray-200 group-hover:text-accent transition-colors shrink-0 max-w-[9rem] sm:max-w-[12rem] truncate">
                {s.name}
              </span>
              {s.group !== "external" && (
                <span className="font-mono text-[10px] text-gray-500 shrink-0">{s.group}/</span>
              )}
              <span className="text-gray-600 shrink-0 hidden sm:inline">—</span>
              <span className="ml-auto sm:ml-0 w-16 sm:w-20 text-right metric-num text-[10px] text-accent shrink-0">
                {(s.skill_md ?? 0) > 0 ? fmt(s.skill_md ?? 0) : fmt(s.md_total ?? 0)}
                <span className="text-gray-500"> {s.skill_md ? "skill" : "md"}</span>
              </span>
              {/* 窄屏：描述整行换到第二行；桌面：与名称同行并占满剩余宽度 */}
              <span className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:min-w-0 text-gray-400 text-[11px] line-clamp-1 sm:truncate">
                {s.desc}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* NIST CSF */}
      <div className="tac-card p-5 mb-4">
        <div className="label-tech mb-4">// NIST CSF COVERAGE</div>
        <div className="space-y-2.5">
          {csfData.map((d) => {
            const max = csfData[0].count;
            return (
              <div key={d.func} className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-gray-400 w-20 tracking-wider shrink-0">
                  {csfLabels[d.func] || d.func}
                </span>
                <div className="flex-1 h-3 bg-bg-tertiary border border-bg-border relative overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(d.count / max) * 100}%`,
                      background: "linear-gradient(90deg, var(--accent-dim), var(--accent))",
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono text-accent w-9 text-right metric-num shrink-0">{d.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards：按框架族分组，主推框架加主色描边 */}
      <div className="tac-card p-5">
        <div className="label-tech mb-3 flex items-center gap-2">
          <ShieldCheck size={12} className="text-accent" /> COMPLIANCE STANDARDS
          <span className="text-gray-600 normal-case tracking-normal">· {meta.standards.length} 项</span>
        </div>
        <div className="space-y-3">
          {standardGroups.map((g) => (
            <div key={g.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="label-tech shrink-0 sm:w-32">{g.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] text-gray-300 px-2 py-1 bg-bg-tertiary border border-bg-border font-mono hover:border-accent/40 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {rest.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="label-tech shrink-0 sm:w-32">其他</span>
              <div className="flex flex-wrap gap-1.5">
                {rest.map((s) => (
                  <span key={s} className="text-[11px] text-gray-300 px-2 py-1 bg-bg-tertiary border border-bg-border font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
