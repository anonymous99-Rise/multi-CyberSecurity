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
    <div className="p-8 max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[9px] text-accent/50 font-mono tracking-widest uppercase mb-1">
          // JAILBREAK PAYLOAD ARSENAL
        </div>
        <h1 className="text-xl font-bold text-gray-100 font-mono">破限 Payload 浏览器</h1>
      </div>

      {/* Level selector */}
      <div className="mb-6">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-2">// LEVEL</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {jailbreakLevels.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              disabled={l.id === "L4"}
              className={cn(
                "p-3 border text-left transition-all disabled:opacity-20 disabled:cursor-not-allowed",
                level === l.id ? "border-2" : "border-bg-border hover:border-gray-700",
              )}
              style={level === l.id ? { borderColor: l.color, backgroundColor: l.color + "08" } : {}}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono font-bold" style={{ color: l.color }}>{l.name}</span>
                <span className="text-[8px] text-gray-700 font-mono">{l.id}</span>
              </div>
              <p className="text-[9px] text-gray-600">{l.desc}</p>
            </button>
          ))}
        </div>
        {level === "L4" && (
          <p className="text-[10px] text-warning mt-2 font-mono">// WARNING: L4 requires CTF mode (deep_jailbreak marker)</p>
        )}
      </div>

      {/* Platform selector */}
      <div className="mb-6">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-2">// PLATFORM</div>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(availablePlatforms).map((p) => {
            const plat = platforms.find((pl) => pl.id === p) || { name: p, color: "#888" };
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn("px-2.5 py-1 text-[10px] font-mono border transition-all", platform === p ? "text-white" : "border-bg-border text-gray-500")}
                style={platform === p ? { borderColor: plat.color, backgroundColor: plat.color + "15", color: plat.color } : {}}
              >
                {plat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* CLI command */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">// CLI COMMAND</span>
          <button onClick={copyCmd} className="flex items-center gap-1 text-[10px] text-accent hover:text-accent/80 transition-colors">
            {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? "COPIED" : "COPY"}
          </button>
        </div>
        <div className="p-3 bg-black border border-bg-border">
          <code className="text-xs text-accent font-mono break-all term-glow">{cliCmd}</code>
        </div>
      </div>

      {/* Payload content */}
      {payloadContent && (
        <div className="tac-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-bg-border bg-bg-tertiary flex items-center justify-between">
            <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">// PAYLOAD CONTENT</div>
            <span className="text-[9px] font-mono px-2 py-0.5 border" style={{ borderColor: levelData.color + "40", color: levelData.color }}>
              {levelData.name} · {platform}
            </span>
          </div>
          <div className="p-4 bg-black/40 max-h-[500px] overflow-y-auto">
            <pre className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
              {payloadContent}
            </pre>
          </div>
        </div>
      )}

      {/* Coverage matrix */}
      <div className="tac-card p-5">
        <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-3">
          // COVERAGE MATRIX
        </div>
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="border-b border-bg-border">
              <th className="text-left py-2 px-2 text-gray-600">LEVEL</th>
              <th className="text-center py-2 px-2 text-gray-600">UNIVERSAL</th>
              {platforms.map((p) => (
                <th key={p.id} className="text-center py-2 px-2 text-gray-600">{p.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jailbreakLevels.map((l) => {
              const levelPayloads = jailbreakPayloads[l.id] || {};
              return (
                <tr key={l.id} className="border-b border-bg-border/30">
                  <td className="py-2 px-2" style={{ color: l.color }}>{l.name}</td>
                  <td className="text-center py-2 px-2">
                    {levelPayloads.universal ? <span className="text-accent">✓</span> : <span className="text-gray-800">—</span>}
                  </td>
                  {platforms.map((p) => (
                    <td key={p.id} className="text-center py-2 px-2">
                      {levelPayloads[p.id] ? <span className="text-accent">✓</span> : <span className="text-gray-800">—</span>}
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
