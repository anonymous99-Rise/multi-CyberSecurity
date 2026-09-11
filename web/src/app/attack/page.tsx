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
      (t) => t.techniqueID.toLowerCase().includes(q) || t.metadata[0]?.value.toLowerCase().includes(q),
    );
  }, [filter]);

  const scoreColor = (score: number) => {
    if (score >= 8) return "#ff0040";
    if (score >= 5) return "#ffb000";
    if (score >= 3) return "#fff700";
    if (score > 0) return "#00ff88";
    return "#1a1f24";
  };

  const csfLabels: Record<string, string> = {
    ID: "IDENTIFY", PR: "PROTECT", DE: "DETECT", RS: "RESPOND", RC: "RECOVER",
  };

  return (
    <div className="p-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[9px] text-accent/50 font-mono tracking-widest uppercase mb-1">
          // THREAT INTELLIGENCE MATRIX
        </div>
        <h1 className="text-xl font-bold text-gray-100 font-mono">ATT&CK 仪表盘</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { v: String(stats.total).padStart(3, "0"), l: "TECHNIQUES", c: "#00e5ff" },
          { v: String(stats.covered).padStart(3, "0"), l: "COVERED", c: "#00ff88" },
          { v: stats.avgScore, l: "AVG SCORE", c: "#ffb000" },
          { v: String(skillsIndex.length).padStart(3, "0"), l: "SKILLS", c: "#b066ff" },
        ].map((s, i) => (
          <div key={s.l} className="tac-card p-4 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-[8px] text-gray-600 font-mono tracking-widest mb-1">{s.l}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* NIST CSF bars */}
      <div className="tac-card p-5 mb-6">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-4">
          // NIST CSF DISTRIBUTION
        </div>
        <div className="space-y-3">
          {csfData.map((d, i) => {
            const max = csfData[0].count;
            return (
              <div key={d.func} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 60 + 200}ms` }}>
                <span className="text-[10px] font-mono text-gray-500 w-20 tracking-wider">
                  {csfLabels[d.func] || d.func}
                </span>
                <div className="flex-1 h-4 bg-bg-tertiary relative overflow-hidden border border-bg-border">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(d.count / max) * 100}%`,
                      background: "linear-gradient(90deg, var(--accent-dim), var(--accent))",
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-accent/60 w-8 text-right">{d.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATT&CK matrix grid */}
      <div className="tac-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
            // ATT&CK TECHNIQUE MATRIX
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="filter ID..."
            className="px-2 py-1 bg-bg border border-bg-border text-[10px] text-gray-300 font-mono placeholder-gray-700 w-32"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-1 mb-4">
          {filtered.map((t) => (
            <div
              key={t.techniqueID}
              className="group relative aspect-square flex items-center justify-center cursor-pointer transition-transform hover:scale-125 hover:z-10"
              style={{
                backgroundColor: scoreColor(t.score) + "15",
                border: `1px solid ${scoreColor(t.score)}40`,
              }}
              title={`${t.techniqueID} [score: ${t.score}]\n${t.metadata[0]?.value || ""}`}
            >
              <span className="text-[7px] font-mono" style={{ color: scoreColor(t.score) }}>
                {t.techniqueID}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[9px] font-mono text-gray-600 pt-3 border-t border-bg-border">
          {[
            { c: "#00ff88", l: "0-2" },
            { c: "#fff700", l: "3-4" },
            { c: "#ffb000", l: "5-7" },
            { c: "#ff0040", l: "8+" },
          ].map((x) => (
            <span key={x.l} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border" style={{ borderColor: x.c, backgroundColor: x.c + "15" }} />
              {x.l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
