import Link from "next/link";
import { BookOpen, Terminal, Crosshair, Unlock, Package, GitBranch, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  meta,
  platforms,
  submodules,
  externalSkills,
  standardGroups,
  getAttackCoverageStats,
  getNistCsfCoverage,
} from "@/lib/data";
import { CSF_LABELS } from "@/lib/severity";
import { fmt } from "@/lib/format";
import { Card, SectionCard } from "@/components/ui/Card";
import { StatPanel } from "@/components/ui/StatPanel";
import { BarList } from "@/components/ui/BarList";
import { Chip } from "@/components/ui/Chip";

// 配色纪律（全站统一）：主色 = 自有内容/交互；信息色 = 外部引用；warning/danger 仅用于严重度。
// 直接用主题变量而不是写死十六进制，浅色主题下才会跟着换成可读的深色。
const ACCENT = "var(--accent)";
const INFO = "var(--info)";

const FEATURE_CARDS = [
  { href: "/skills", icon: BookOpen, title: "技能库", code: "SKILLS" },
  { href: "/cli", icon: Terminal, title: "CLI 操作台", code: "CLI" },
  { href: "/attack", icon: Crosshair, title: "ATT&CK 矩阵", code: "MATRIX" },
  { href: "/jailbreak", icon: Unlock, title: "破限 Payload", code: "JAILBREAK" },
] as const;

export default function Home() {
  const atkStats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const featureDescriptions: Record<string, string> = {
    "/skills": `${meta.total_skills} 个自有技能 · ${meta.total_modules} 个分类`,
    "/cli": "审计 · 红队 · 破限命令生成",
    "/attack": `${atkStats.covered} 项技术覆盖 · 平均分 ${atkStats.avgScore}`,
    "/jailbreak": "L1-L4 分级 · 8 个平台适配",
  };

  const grouped = new Set(standardGroups.flatMap((g) => g.items));
  const restStandards = (meta.standards as string[]).filter((s) => !grouped.has(s));

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-5xl animate-fade-in">
      {/* Hero：标题 + 版本/规模速览 */}
      <div className="mb-8">
        <div className="label-tech text-accent/70 mb-2">// AI-Powered Cybersecurity Framework</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink font-mono tracking-tight">
          multi<span className="text-accent term-glow">-</span>CyberSecurity
        </h1>
        <div className="glow-line w-40 mt-4 mb-4" />
        <p className="text-sm text-ink-muted max-w-2xl leading-relaxed">{meta.description}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-[11px] font-mono">
          <span className="px-2 py-0.5 border border-accent/40 text-accent">v{meta.version}</span>
          <span className="text-ink-muted">
            <span className="text-ink metric-num">{meta.total_skills}</span> 自有技能
          </span>
          <span className="text-ink-faint">/</span>
          <span className="text-ink-muted">
            <span className="text-ink metric-num">{fmt(externalSkills.external_skill_md_total)}</span> 外部 SKILL.md
          </span>
          <span className="text-ink-faint">/</span>
          <span className="text-ink-muted">
            <span className="text-ink metric-num">{submodules.length}</span> 子仓库
          </span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink-muted">更新于 {meta.last_updated}</span>
        </div>
      </div>

      <StatPanel
        className="mb-4 animate-slide-up"
        items={[
          { label: "SKILLS", value: fmt(meta.total_skills), sub: "自有技能", color: ACCENT },
          { label: "MODULES", value: meta.total_modules, sub: "分类模块", color: ACCENT },
          { label: "ATT&CK", value: atkStats.covered, sub: "技术覆盖", color: ACCENT },
          { label: "PLATFORMS", value: platforms.length, sub: "适配平台", color: ACCENT },
          {
            label: "EXTERNAL",
            value: fmt(externalSkills.external_skill_md_total),
            sub: "外部 SKILL.md",
            color: INFO,
          },
        ]}
      />

      {/* 计数口径：自有技能与外部子仓库技能分开计数 */}
      <div className="note-strip px-3 py-2.5 mb-7">
        <p className="text-[11px] text-ink-muted leading-relaxed">
          <span className="text-accent/80 font-mono">统计口径</span> SKILLS / MODULES / ATT&amp;CK 为本仓库自有内容
          （{meta.total_modules} 个分类下的 <span className="font-mono text-ink-muted">NN-*/skills</span>）；external/ 的{" "}
          {externalSkills.repo_count} 个子仓库（{externalSkills.repo_with_skills} 个含 SKILL.md）以 git submodule 引用，
          单独计为{" "}
          <span className="font-mono text-info">EXTERNAL {externalSkills.external_skill_md_total}</span>（另含知识库类 markdown{" "}
          {fmt(externalSkills.external_md_total ?? 0)} 个），<span className="text-ink-muted">不并入</span>自有技能数。
          下方仓库右侧：<span className="font-mono text-accent/80">skill</span> = SKILL.md 数，
          <span className="font-mono text-ink-muted">md</span> = markdown 总数。
        </p>
      </div>

      {/* 主入口卡 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
        {FEATURE_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} className="animate-slide-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
              <Card primary className="p-5 group flex items-start gap-4 h-full">
                <span className="mt-0.5 shrink-0 w-8 h-8 border border-accent/30 flex items-center justify-center text-accent group-hover:border-accent/70 transition-colors">
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
                      {c.title}
                    </h2>
                    <span className="label-tech">{c.code}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-auto shrink-0 text-ink-faint opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all"
                    />
                  </span>
                  <span className="block text-xs text-ink-muted mt-1 truncate">{featureDescriptions[c.href]}</span>
                </span>
              </Card>
            </Link>
          );
        })}
      </div>

      <SectionCard
        label="PLATFORMS"
        icon={Zap}
        suffix={`· ${platforms.length} 个适配平台`}
        className="mb-3"
        bodyClassName="flex flex-wrap gap-1.5"
      >
        {platforms.map((p) => (
          <Chip key={p.id} dot title={`${p.name} · 配置目录 ${p.configPath}`}>
            {p.name}
          </Chip>
        ))}
      </SectionCard>

      {/* 仓库清单由 scripts/sync-data.mjs 解析根目录 .gitmodules 生成 */}
      <SectionCard
        label="REPOSITORIES"
        icon={GitBranch}
        iconClassName="text-info"
        suffix={`· ${String(submodules.length).padStart(2, "0")} 个外部引用`}
        className="mb-4"
        bodyClassName="grid grid-cols-1 xl:grid-cols-2 gap-x-6"
      >
        {submodules.map((s) => (
          <a
            key={s.path}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            title={`${s.path} — ${s.desc}`}
            className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs min-w-0 py-2 border-b border-bg-border/60 hover:bg-overlay transition-colors group"
          >
            <Package size={12} className="text-ink-faint shrink-0" />
            <span className="font-mono text-ink group-hover:text-accent transition-colors shrink-0 max-w-[9rem] sm:max-w-[12rem] truncate">
              {s.name}
            </span>
            {s.group !== "external" && (
              <span className="font-mono text-[10px] text-ink-faint shrink-0">{s.group}/</span>
            )}
            <span className="text-ink-faint shrink-0 hidden sm:inline">—</span>
            <span className="ml-auto sm:ml-0 w-16 sm:w-20 text-right metric-num text-[10px] text-accent shrink-0">
              {fmt((s.skill_md ?? 0) > 0 ? s.skill_md ?? 0 : s.md_total ?? 0)}
              <span className="text-ink-faint"> {s.skill_md ? "skill" : "md"}</span>
            </span>
            <span className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:min-w-0 text-ink-muted text-[11px] line-clamp-1 sm:truncate">
              {s.desc}
            </span>
          </a>
        ))}
      </SectionCard>

      <SectionCard label="// NIST CSF COVERAGE" className="mb-4">
        <BarList items={csfData.map((d) => ({ label: CSF_LABELS[d.func] || d.func, value: d.count }))} />
      </SectionCard>

      <SectionCard
        label="COMPLIANCE STANDARDS"
        icon={ShieldCheck}
        suffix={`· ${meta.standards.length} 项`}
        bodyClassName="space-y-3"
      >
        {standardGroups.map((g) => (
          <div key={g.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="label-tech shrink-0 sm:w-32">{g.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        ))}
        {restStandards.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="label-tech shrink-0 sm:w-32">其他</span>
            <div className="flex flex-wrap gap-1.5">
              {restStandards.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
