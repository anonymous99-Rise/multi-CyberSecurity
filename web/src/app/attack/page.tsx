"use client";
import { useState, useMemo } from "react";
import { Search, X, Crosshair } from "lucide-react";
import { attackTechniques, getAttackCoverageStats, getNistCsfCoverage, skillsIndex } from "@/lib/data";
import { SEVERITY_RAMP, CSF_LABELS, severityBuckets, severityStep } from "@/lib/severity";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatPanel } from "@/components/ui/StatPanel";
import { SectionCard } from "@/components/ui/Card";
import { BarList } from "@/components/ui/BarList";

export default function AttackPage() {
  const [filter, setFilter] = useState("");
  const stats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const filtered = useMemo(() => {
    if (!filter.trim()) return attackTechniques;
    const q = filter.toLowerCase();
    return attackTechniques.filter(
      (t) => t.techniqueID.toLowerCase().includes(q) || t.metadata[0]?.value.toLowerCase().includes(q),
    );
  }, [filter]);

  const buckets = useMemo(() => severityBuckets(attackTechniques.map((t) => t.score)), []);

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-5xl animate-fade-in">
      <PageHeader
        eyebrow="// THREAT INTELLIGENCE MATRIX"
        title="ATT&CK 仪表盘"
        description={`共 ${stats.total} 项技术、${stats.covered} 项已覆盖，平均分 ${stats.avgScore}；色阶表示该技术关联的自有技能数量。`}
      />

      <StatPanel
        className="mb-6"
        columns={4}
        items={[
          { label: "TECHNIQUES", value: String(stats.total).padStart(3, "0"), sub: "矩阵技术总数" },
          { label: "COVERED", value: String(stats.covered).padStart(3, "0"), sub: "已有技能覆盖" },
          { label: "AVG SCORE", value: stats.avgScore, sub: "平均覆盖分" },
          { label: "SKILLS", value: String(skillsIndex.length), sub: "自有技能" },
        ]}
      />

      <SectionCard label="// NIST CSF DISTRIBUTION" className="mb-6">
        <BarList
          items={csfData.map((d) => ({ label: CSF_LABELS[d.func] || d.func, value: d.count }))}
        />
      </SectionCard>

      <SectionCard
        label="TECHNIQUE MATRIX"
        icon={Crosshair}
        suffix={
          <span className="ml-auto flex items-center gap-2">
            <span className="relative">
              <Search size={12} className="absolute left-2 top-2.5 text-ink-faint" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="筛选技术编号 / 名称，如 T1059"
                aria-label="筛选 ATT&CK 技术"
                className="pl-7 pr-7 py-1.5 bg-bg border border-bg-border text-[12px] text-ink placeholder-gray-500 font-mono w-52 sm:w-64 normal-case tracking-normal"
              />
              {filter && (
                <button
                  onClick={() => setFilter("")}
                  aria-label="清除筛选"
                  className="absolute right-1.5 top-1.5 text-ink-faint hover:text-accent transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </span>
            <span className="text-[11px] font-mono text-ink-muted metric-num">
              {filtered.length}/{attackTechniques.length}
            </span>
          </span>
        }
      >
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 mb-4">
          {filtered.map((t) => {
            const s = severityStep(t.score);
            return (
              <div
                key={t.techniqueID}
                className="group relative aspect-square flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.12] hover:z-10"
                style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                title={`${t.techniqueID} [score: ${t.score}]\n${t.metadata[0]?.value || ""}`}
              >
                <span className="text-[10px] font-mono metric-num" style={{ color: s.color }}>
                  {t.techniqueID}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-ink-faint text-xs font-mono">// 无匹配技术</div>
          )}
        </div>

        {/* 图例：色阶 + 各档数量，图上直接能读层级 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-bg-border">
          <span className="label-tech">SCORE</span>
          {SEVERITY_RAMP.map((r, i) => (
            <span key={r.label} className="flex items-center gap-2 font-mono">
              <span
                className="w-4 h-4"
                style={{ backgroundColor: r.bg, border: `1px solid ${r.border}` }}
              />
              <span className="text-[12px] metric-num" style={{ color: r.color }}>{r.label}</span>
              <span className="text-[12px] text-ink-muted metric-num">×{buckets[i]}</span>
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
