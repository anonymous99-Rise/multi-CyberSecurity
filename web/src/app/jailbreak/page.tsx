"use client";
import { useState, useMemo } from "react";
import { jailbreakLevels, platforms, jailbreakPayloads } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export default function JailbreakPage() {
  const [level, setLevel] = useState("L3");
  const [platform, setPlatform] = useState("dsh");
  const [copied, setCopied] = useState(false);

  const levelData = useMemo(() => jailbreakLevels.find((l) => l.id === level)!, [level]);

  const availablePlatforms = jailbreakPayloads[level] || {};
  const payloadContent = availablePlatforms[platform] || "";

  const cliCmd = `python cli.py jailbreak payload --level ${level} --platform ${platform}`;

  const copyCmd = () => {
    navigator.clipboard.writeText(cliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                level === l.id ? "border-2" : "border-bg-border hover:border-gray-600",
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

      {/* CLI 命令 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">CLI 命令</label>
          <button
            onClick={copyCmd}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
        <div className="p-3 bg-black border border-bg-border rounded-lg">
          <code className="text-xs text-accent font-mono break-all">{cliCmd}</code>
        </div>
      </div>

      {/* Payload 内容 */}
      {payloadContent && (
        <div className="border border-bg-border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-bg-border bg-bg-secondary flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">Payload 内容</h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: levelData.color + "20", color: levelData.color }}>
              {levelData.name} · {platform}
            </span>
          </div>
          <div className="p-4 bg-black/50 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
              {payloadContent}
            </pre>
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
            {jailbreakLevels.map((l) => {
              const levelPayloads = jailbreakPayloads[l.id] || {};
              return (
                <tr key={l.id} className="border-b border-bg-border/50">
                  <td className="py-2 px-2 font-mono" style={{ color: l.color }}>{l.name}</td>
                  <td className="text-center py-2 px-2">
                    {levelPayloads.universal ? <span className="text-accent">✓</span> : <span className="text-gray-700">—</span>}
                  </td>
                  {platforms.map((p) => (
                    <td key={p.id} className="text-center py-2 px-2">
                      {levelPayloads[p.id] ? <span className="text-accent">✓</span> : <span className="text-gray-700">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
