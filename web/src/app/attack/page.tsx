"use client";
import { useState, useMemo } from "react";
import { Search, X, Crosshair } from "lucide-react";
import { attackTechniques, getAttackCoverageStats, getNistCsfCoverage, skillsIndex } from "@/lib/data";
import { cn } from "@/lib/utils";

// 分数 → 严重度色阶（4 档）。颜色在这里表达"分数高低"这一信息，属于数据编码，
// 但去掉了原先刺眼的纯黄 #fff700，并把 4 档拆成 背景透明度 + 边框 两个维度。
const RAMP = [
  { max: 2, color: "#00ff88", label: "0-2", bg: 0.08, border: 0.35 },
  { max: 4, color: "#ffd000", label: "3-4", bg: 0.2, border: 0.6 },
  { max: 7, color: "#ff7a00", label: "5-7", bg: 0.38, border: 0.85 },
  { max: Infinity, color: "#ff0040", label: "8+", bg: 0.58, border: 1 },
];
const step = (score: number) => RAMP.find((r) => score <= r.max)!;

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

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

  const bucketCounts = useMemo(() => {
    const counts = RAMP.map(() => 0);
    for (const t of attackTechniques) {
      const idx = RAMP.findIndex((r) => t.score <= r.max);
      if (idx >= 0) counts[idx] += 1;
    }
    return counts;
  }, []);

  const csfLabels: Record<string, string> = {
    ID: "IDENTIFY", PR: "PROTECT", DE: "DETECT", RS: "RESPOND", RC: "RECOVER",
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="label-tech text-accent/70 mb-1">// THREAT INTELLIGENCE MATRIX</div>
        <h1 className="text-2xl font-bold text-gray-100 font-mono">ATT&amp;CK 仪表盘</h1>
        <p className="text-xs text-gray-400 mt-2">
          共 {stats.total} 项技术、{stats.covered} 项已覆盖，平均分 {stats.avgScore}；色阶表示该技术关联的自有技能数量。
        </p>
      </div>

      {/* Stats：统一主色，不再一卡一色 */}
      <div className="tac-card mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-bg-border">
          {[
            { v: String(stats.total).padStart(3, "0"), l: "TECHNIQUES", sub: "矩阵技术总数" },
            { v: String(stats.covered).padStart(3, "0"), l: "COVERED", sub: "已有技能覆盖" },
            { v: stats.avgScore, l: "AVG SCORE", sub: "平均覆盖分" },
            { v: String(skillsIndex.length), l: "SKILLS", sub: "自有技能" },
          ].map((s) => (
            <div key={s.l} className="p-4">
              <div className="label-tech mb-1.5">{s.l}</div>
              <div className="text-2xl font-bold text-gray-100 metric-num">{s.v}</div>
              <div className="text-[10px] text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NIST CSF bars */}
      <div className="tac-card p-5 mb-6">
        <div className="label-tech mb-4">// NIST CSF DISTRIBUTION</div>
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

      {/* ATT&CK matrix grid */}
      <div className="tac-card p-5">
        {/* Toolbar：筛选与图例都收在矩阵上方，避免沉到页底 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="label-tech flex items-center gap-2">
            <Crosshair size={12} className="text-accent" /> TECHNIQUE MATRIX
          </div>
          <div className="relative ml-auto">
            <Search size={12} className="absolute left-2 top-2.5 text-gray-500" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="筛选技术编号 / 名称，如 T1059"
              aria-label="筛选 ATT&CK 技术"
              className="pl-7 pr-7 py-1.5 bg-bg border border-bg-border text-[12px] text-gray-200 placeholder-gray-500 font-mono w-56 sm:w-64"
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                aria-label="清除筛选"
                className="absolute right-1.5 top-1.5 text-gray-500 hover:text-accent transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <span className="text-[11px] font-mono text-gray-400 metric-num">
            {filtered.length} / {attackTechniques.length}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 mb-4">
          {filtered.map((t) => {
            const s = step(t.score);
            return (
              <div
                key={t.techniqueID}
                className="group relative aspect-square flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.12] hover:z-10"
                style={{ backgroundColor: hexA(s.color, s.bg), border: `1px solid ${hexA(s.color, s.border)}` }}
                title={`${t.techniqueID} [score: ${t.score}]\n${t.metadata[0]?.value || ""}`}
              >
                <span className="text-[9px] font-mono metric-num" style={{ color: s.color }}>
                  {t.techniqueID}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 text-xs font-mono">
              // 无匹配技术
            </div>
          )}
        </div>

        {/* Legend：色阶 + 各档数量，图上直接能读层级；色块加大、拉开明度差 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-bg-border">
          <span className="label-tech">SCORE</span>
          {RAMP.map((r, i) => (
            <span key={r.label} className="flex items-center gap-2 font-mono">
              <span
                className="w-4 h-4"
                style={{ backgroundColor: hexA(r.color, r.bg), border: `1px solid ${hexA(r.color, r.border)}` }}
              />
              <span className="text-[12px] metric-num" style={{ color: r.color }}>{r.label}</span>
              <span className="text-[12px] text-gray-400 metric-num">×{bucketCounts[i]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
