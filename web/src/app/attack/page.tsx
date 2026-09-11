"use client";
import { useState, useMemo } from "react";
import { attackTechniques, getAttackCoverageStats, getNistCsfCoverage, skillsIndex } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function AttackPage() {
  const [filter, setFilter] = useState("");
  const stats = getAttackCoverageStats();
  const csfData = getNistCsfCoverage();

  const filtered = useMemo(() => {
    if (!filter.trim()) return attackTechniques;
    const q = filter.toLowerCase();
    return attackTechniques.filter(
      (t) =>
        t.techniqueID.toLowerCase().includes(q) ||
        t.metadata[0]?.value.toLowerCase().includes(q),
    );
  }, [filter]);

  const scoreColor = (score: number) => {
    if (score >= 8) return "#ef4444";
    if (score >= 5) return "#fb923c";
    if (score >= 3) return "#facc15";
    if (score > 0) return "#4ade80";
    return "#333";
  };

  const csfLabels: Record<string, string> = {
    ID: "识别 (ID)",
    PR: "保护 (PR)",
    DE: "检测 (DE)",
    RS: "响应 (RS)",
    RC: "恢复 (RC)",
  };

  const maxCsf = Math.max(...csfData.map((d) => d.count));

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-bold text-accent mb-6 font-mono">ATT&CK 可视化仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="ATT&CK 技术总数" value={stats.total} color="#4f9eff" />
        <StatCard label="已覆盖" value={stats.covered} color="#4ade80" />
        <StatCard label="平均分" value={stats.avgScore} color="#facc15" />
        <StatCard label="技能总数" value={skillsIndex.length} color="#a78bfa" />
      </div>

      {/* NIST CSF 覆盖 */}
      <div className="border border-bg-border rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">NIST CSF 覆盖</h2>
        <div className="space-y-3">
          {csfData.map((d) => (
            <div key={d.func} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-28">{csfLabels[d.func] || d.func}</span>
              <div className="flex-1 h-5 bg-bg-secondary rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${(d.count / maxCsf) * 100}%`,
                    backgroundColor: "#00ff88",
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right font-mono">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ATT&CK 技术列表 */}
      <div className="border border-bg-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">ATT&CK 技术覆盖矩阵</h2>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="搜索技术 ID..."
            className="px-3 py-1.5 bg-bg-secondary border border-bg-border rounded text-xs text-gray-300 focus:border-accent/50 focus:outline-none font-mono w-48"
          />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
          {filtered.map((t) => (
            <div
              key={t.techniqueID}
              className="group relative aspect-square rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: scoreColor(t.score) + "30", border: `1px solid ${scoreColor(t.score)}` }}
              title={`${t.techniqueID} (score: ${t.score})\n${t.metadata[0]?.value || ""}`}
            >
              <span className="text-[8px] font-mono" style={{ color: scoreColor(t.score) }}>
                {t.techniqueID}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/30 border border-green-500" />0-2</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500" />3-4</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500" />5-7</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/30 border border-red-500" />8+</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="border border-bg-border rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
    </div>
  );
}
