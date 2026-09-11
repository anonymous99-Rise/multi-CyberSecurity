"use client";
import { useState, useMemo } from "react";
import { jailbreakLevels, platforms } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function JailbreakPage() {
  const [level, setLevel] = useState("L3");
  const [platform, setPlatform] = useState("dsh");

  const levelData = useMemo(() => jailbreakLevels.find((l) => l.id === level)!, [level]);

  const platformPayloads: Record<string, Record<string, string[]>> = {
    L1: { universal: ["universal.md"] },
    L2: { universal: ["universal.md"] },
    L3: {
      universal: ["universal.md"], claude: ["claude.md"], codex: ["codex.md"],
      cursor: ["cursor.md"], trae: ["trae.md"], openclaw: ["openclaw.md"],
      hermes: ["hermes.md"], dsh: ["dsh.md"],
    },
    L4: {
      universal: ["universal.md"], claude: ["claude.md"], codex: ["codex.md"],
      cursor: ["cursor.md"], trae: ["trae.md"], openclaw: ["openclaw.md"],
      hermes: ["hermes.md"], dsh: ["dsh.md"],
    },
  };

  const availablePlatforms = platformPayloads[level] || {};
  const filePath = availablePlatforms[platform]?.[0];
  const fullPath = filePath
    ? `framework/skills/redteam/jailbreak/L${level === "L1" ? "1_soft" : level === "L2" ? "2_medium" : level === "L3" ? "3_hard" : "4_deep"}/${filePath}`
    : null;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-accent mb-6 font-mono">破限 Payload 浏览器</h1>

      {/* 级别选择 */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 mb-2 block">破限级别</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {jailbreakLevels.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              disabled={l.id === "L4"}
              className={cn(
                "p-3 rounded-lg border text-left transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                level === l.id
                  ? "border-2"
                  : "border-bg-border hover:border-gray-600",
              )}
              style={level === l.id ? { borderColor: l.color, backgroundColor: l.color + "10" } : {}}
            >
              <p className="text-sm font-mono font-bold" style={{ color: l.color }}>{l.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{l.desc}</p>
            </button>
          ))}
        </div>
        {level === "L4" && (
          <p className="text-xs text-warning mt-2">⚠ L4 需 CTF 模式解锁（.ctf/CTF_MODE.md 含 deep_jailbreak 标记）</p>
        )}
      </div>

      {/* 平台选择 */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 mb-2 block">目标平台</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(availablePlatforms).map((p) => {
            const plat = platforms.find((pl) => pl.id === p) || { name: p, color: "#888" };
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono border transition-all",
                  platform === p ? "text-white" : "border-bg-border text-gray-400",
                )}
                style={platform === p ? { borderColor: plat.color, backgroundColor: plat.color + "20", color: plat.color } : {}}
              >
                {plat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payload 路径 */}
      {fullPath && (
        <div className="border border-bg-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300">Payload 文件</h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: levelData.color + "20", color: levelData.color }}>
              {levelData.name}
            </span>
          </div>
          <div className="p-3 bg-black border border-bg-border rounded font-mono text-xs text-accent break-all">
            {fullPath}
          </div>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>▸ CLI 获取: <code className="text-accent/70">python cli.py jailbreak payload --level {level} --platform {platform}</code></p>
            <p>▸ 引擎自动发现: <code className="text-accent/70">framework/skills/redteam/jailbreak/</code> 下 glob *.md</p>
            <p>▸ 回退策略: 找不到平台时回退 <code className="text-accent/70">universal</code></p>
          </div>
        </div>
      )}

      {/* 平台对比表 */}
      <div className="mt-6 border border-bg-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">平台 Payload 覆盖矩阵</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-bg-border">
              <th className="text-left py-2 px-2 text-gray-500">级别</th>
              <th className="text-center py-2 px-2 text-gray-500">universal</th>
              {platforms.map((p) => (
                <th key={p.id} className="text-center py-2 px-2 text-gray-500">{p.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jailbreakLevels.map((l) => (
              <tr key={l.id} className="border-b border-bg-border/50">
                <td className="py-2 px-2 font-mono" style={{ color: l.color }}>{l.name}</td>
                <td className="text-center py-2 px-2">
                  {platformPayloads[l.id]?.universal ? <span className="text-accent">✓</span> : <span className="text-gray-700">—</span>}
                </td>
                {platforms.map((p) => (
                  <td key={p.id} className="text-center py-2 px-2">
                    {platformPayloads[l.id]?.[p.id] ? <span className="text-accent">✓</span> : <span className="text-gray-700">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
