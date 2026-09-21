"use client";
import { useState } from "react";
import { Terminal, Play, Loader2 } from "lucide-react";
import { platforms, meta } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { PageHeader } from "@/components/ui/PageHeader";

const operations = [
  { id: "audit", label: "安全审计", cmd: "audit", needs: ["target"] },
  { id: "redteam", label: "红队操作", cmd: "redteam", needs: ["operation", "target", "platform"] },
  { id: "jailbreak", label: "破限 Payload", cmd: "jailbreak payload", needs: ["level", "platform"] },
  { id: "skill", label: "技能导出", cmd: "skill export", needs: ["platform"] },
];

const opTypes = [
  { v: "recon", l: "RECON" },
  { v: "exploit", l: "EXPLOIT" },
  { v: "scan", l: "SCAN" },
  { v: "analyze", l: "ANALYZE" },
  { v: "generate_poc", l: "GEN_POC" },
];

export default function CliPage() {
  const [op, setOp] = useState("audit");
  const [target, setTarget] = useState("");
  const [operation, setOperation] = useState("recon");
  const [platform, setPlatform] = useState("universal");
  const [level, setLevel] = useState("L3");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const selected = operations.find((o) => o.id === op)!;

  function buildCommand() {
    let c = `python cli.py ${selected.cmd}`;
    if (selected.needs.includes("target") && target) c += ` --target ${target}`;
    if (selected.needs.includes("operation")) c += ` --operation ${operation}`;
    if (selected.needs.includes("platform")) c += ` --platform ${platform}`;
    if (selected.needs.includes("level")) c += ` --level ${level}`;
    return c;
  }

  const cmd = buildCommand();

  const runCommand = () => {
    setRunning(true);
    setOutput("");
    const lines = [
      `$ ${cmd}`,
      "",
      selected.id === "audit" ? "[*] Starting 8-stage security audit..." : "",
      selected.id === "redteam" ? "[*] Initializing red team operation..." : "",
      selected.id === "jailbreak" ? "[*] Loading jailbreak engine..." : "",
      selected.id === "skill" ? "[*] Exporting skill manifests..." : "",
    ].filter(Boolean);

    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setOutput((prev) => prev + lines[i] + "\n");
        i++;
      } else {
        clearInterval(interval);
        setOutput((prev) => prev + `\n[✓] Command generated. Copy to terminal to execute.\n\n${cmd}`);
        setRunning(false);
      }
    }, 300);
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-3xl animate-fade-in">
      <PageHeader eyebrow="// COMMAND CONSOLE" title="CLI 操作台" />

      {/* Operation type */}
      <div className="mb-6">
        <div className="label-tech mb-2">// OPERATION</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {operations.map((o) => (
            <button
              key={o.id}
              onClick={() => setOp(o.id)}
              className={cn(
                "p-2.5 border text-center transition-all",
                op === o.id
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-bg-border text-ink-faint hover:text-ink-muted hover:border-gray-700",
              )}
            >
              <span className="text-[11px] font-mono font-medium">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic params */}
      {op === "audit" && (
        <ParamInput label="TARGET" value={target} onChange={setTarget} placeholder="https://example.com" />
      )}

      {op === "redteam" && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <div className="label-tech mb-1.5">OP TYPE</div>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary border border-bg-border text-xs text-ink-muted font-mono"
            >
              {opTypes.map((o) => (
                <option key={o.v} value={o.v} className="bg-bg-secondary">{o.l}</option>
              ))}
            </select>
          </div>
          <ParamInput label="TARGET" value={target} onChange={setTarget} placeholder="192.168.1.1" />
        </div>
      )}

      {(op === "redteam" || op === "jailbreak" || op === "skill") && (
        <div className="mb-6">
          <div className="label-tech mb-2">// PLATFORM</div>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn("px-2.5 py-1 text-[10px] font-mono border transition-all", platform === p.id ? "text-white" : "border-bg-border text-ink-faint")}
                style={platform === p.id ? { borderColor: p.color, backgroundColor: p.color + "15", color: p.color } : {}}
              >
                {p.name}
              </button>
            ))}
            {op === "redteam" && (
              <button
                onClick={() => setPlatform("universal")}
                className={cn("px-2.5 py-1 text-[10px] font-mono border", platform === "universal" ? "border-accent bg-accent/5 text-accent" : "border-bg-border text-ink-faint")}
              >
                UNIVERSAL
              </button>
            )}
          </div>
        </div>
      )}

      {op === "jailbreak" && (
        <div className="mb-6">
          <div className="label-tech mb-2">// LEVEL</div>
          <div className="flex gap-2">
            {["L1", "L2", "L3", "L4"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                disabled={l === "L4"}
                className={cn("px-4 py-1.5 text-xs font-mono border transition-all disabled:opacity-20", level === l ? "border-accent bg-accent/5 text-accent" : "border-bg-border text-ink-faint")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Command preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="label-tech">// COMMAND</span>
          <CopyButton text={cmd} />
        </div>
        <div className="p-3 bg-code border border-bg-border">
          <code className="text-xs text-code-accent font-mono break-all term-glow">{cmd}</code>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={runCommand}
        disabled={running}
        className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-xs font-mono hover:bg-accent/20 transition-colors disabled:opacity-30 mb-4"
      >
        {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        {running ? "RUNNING..." : "EXECUTE"}
      </button>

      {/* Terminal output */}
      {output && (
        <div className="animate-fade-in">
          <div className="label-tech mb-2 flex items-center gap-2">
            <Terminal size={11} /> // OUTPUT
          </div>
          <div className="p-4 bg-code border border-bg-border max-h-[300px] overflow-y-auto">
            <pre className="text-[11px] font-mono text-ink-muted whitespace-pre-wrap">
              {output}
              {running && <span className="inline-block w-2 h-3 bg-accent animate-blink ml-0.5" />}
            </pre>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-bg-border label-tech">
        mCS v{meta.version} · AUTHORIZED CTF / PENTEST LAB
      </div>
    </div>
  );
}

function ParamInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-6">
      <div className="label-tech mb-1.5">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-bg-secondary border border-bg-border text-xs text-ink-muted font-mono placeholder-gray-700"
      />
    </div>
  );
}
