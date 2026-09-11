"use client";
import { useState } from "react";
import { Terminal, Play, Loader2 } from "lucide-react";
import { platforms, meta } from "@/lib/data";
import { cn } from "@/lib/utils";

const operations = [
  { id: "audit", label: "安全审计 (8阶段)", cmd: "audit", needs: ["target"] },
  { id: "redteam", label: "红队操作", cmd: "redteam", needs: ["operation", "target", "platform"] },
  { id: "jailbreak", label: "破限 Payload", cmd: "jailbreak", needs: ["level", "platform"] },
  { id: "skill", label: "技能导出", cmd: "skill export", needs: ["platform"] },
];

export default function CliPage() {
  const [op, setOp] = useState("audit");
  const [target, setTarget] = useState("");
  const [operation, setOperation] = useState("recon");
  const [platform, setPlatform] = useState("universal");
  const [level, setLevel] = useState("L3");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const buildCommand = () => {
    const selected = operations.find((o) => o.id === op)!;
    let cmd = `python cli.py ${selected.cmd}`;
    if (selected.needs.includes("target") && target) cmd += ` --target ${target}`;
    if (selected.needs.includes("operation")) cmd += ` --operation ${operation}`;
    if (selected.needs.includes("platform")) cmd += ` --platform ${platform}`;
    if (selected.needs.includes("level")) cmd += ` --level ${level}`;
    return cmd;
  };

  const runCommand = () => {
    setRunning(true);
    setOutput("$ " + buildCommand() + "\n\n(前端静态展示模式 — 实际执行需后端 API 或本地 dev server)\n");
    setTimeout(() => {
      setOutput((prev) => prev + `[${new Date().toISOString()}] 命令已生成，复制到终端执行:\n${buildCommand()}`);
      setRunning(false);
    }, 500);
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-accent mb-6 font-mono">CLI 可视化操作台</h1>

      <div className="space-y-6">
        <div>
          <label className="text-xs text-gray-500 mb-2 block">操作类型</label>
          <div className="flex flex-wrap gap-2">
            {operations.map((o) => (
              <button
                key={o.id}
                onClick={() => setOp(o.id)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono border transition-all",
                  op === o.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-bg-border text-gray-400 hover:text-gray-200",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {op === "audit" && (
          <Input label="目标 (URL/IP)" value={target} onChange={setTarget} placeholder="https://example.com" />
        )}

        {op === "redteam" && (
          <div className="grid grid-cols-2 gap-4">
            <Select label="操作" value={operation} onChange={setOperation}
              options={[
                { v: "recon", l: "Recon 侦察" },
                { v: "exploit", l: "Exploit 利用" },
                { v: "scan", l: "Scan 扫描" },
                { v: "analyze", l: "Analyze 分析" },
              ]} />
            <Input label="目标" value={target} onChange={setTarget} placeholder="192.168.1.1" />
          </div>
        )}

        {(op === "redteam" || op === "jailbreak" || op === "skill") && (
          <div>
            <label className="text-xs text-gray-500 mb-2 block">平台</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-mono border transition-all",
                    platform === p.id
                      ? "text-white"
                      : "border-bg-border text-gray-400 hover:text-gray-200",
                  )}
                  style={platform === p.id ? { borderColor: p.color, backgroundColor: p.color + "20", color: p.color } : {}}
                >
                  {p.name}
                </button>
              ))}
              {op === "redteam" && (
                <button
                  onClick={() => setPlatform("universal")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-mono border",
                    platform === "universal" ? "border-accent bg-accent/10 text-accent" : "border-bg-border text-gray-400",
                  )}
                >
                  universal
                </button>
              )}
            </div>
          </div>
        )}

        {op === "jailbreak" && (
          <div>
            <label className="text-xs text-gray-500 mb-2 block">破限级别</label>
            <div className="flex gap-2">
              {["L1", "L2", "L3", "L4"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "px-4 py-1.5 rounded text-xs font-mono border",
                    level === l
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-bg-border text-gray-400 hover:text-gray-200",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-bg-secondary border border-bg-border rounded-lg">
        <code className="text-xs text-accent font-mono break-all">{buildCommand()}</code>
      </div>

      <button
        onClick={runCommand}
        disabled={running}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded text-accent text-sm hover:bg-accent/20 transition-colors disabled:opacity-50"
      >
        {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        生成命令
      </button>

      {output && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">输出</span>
          </div>
          <pre className="p-4 bg-black border border-bg-border rounded-lg text-xs font-mono text-gray-300 whitespace-pre-wrap min-h-[120px]">
            {output}
          </pre>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-600 border-t border-bg-border pt-4">
        <p>multi-CyberSecurity v{meta.version} · 授权 CTF/渗透测试实验室环境</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-bg-secondary border border-bg-border rounded text-sm text-gray-300 focus:border-accent/50 focus:outline-none font-mono"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-bg-secondary border border-bg-border rounded text-sm text-gray-300 focus:border-accent/50 focus:outline-none font-mono"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-bg-secondary">{o.l}</option>
        ))}
      </select>
    </div>
  );
}
