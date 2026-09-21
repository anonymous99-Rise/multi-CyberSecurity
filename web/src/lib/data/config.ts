/**
 * 静态配置（非 JSON 数据源）：平台清单与破限等级。
 *
 * 配色说明：`platforms[].color` / `jailbreakLevels[].color` 目前**只作为数据保留**，
 * 界面统一用主色 + 信息色（见 globals.css 的配色纪律），避免再次出现"彩虹芯片"。
 * 破限等级是唯一例外：L1→L4 用绿→黄→橙→红表达风险递进，属于语义用色。
 */
import type { JailbreakLevel, PlatformConfig } from "./types";

export const platforms: PlatformConfig[] = [
  { id: "trae", name: "Trae", configPath: ".trae", color: "#4f9eff" },
  { id: "cursor", name: "Cursor", configPath: ".cursor", color: "#a78bfa" },
  { id: "claude", name: "Claude Code", configPath: ".claude", color: "#ff9f40" },
  { id: "codex", name: "Codex", configPath: ".codex", color: "#00ff88" },
  { id: "openclaw", name: "OpenClaw", configPath: ".openclaw", color: "#ff3366" },
  { id: "hermes", name: "Hermes", configPath: ".hermes", color: "#ffaa00" },
  { id: "dsh", name: "DeepSeek Harness", configPath: ".dsh", color: "#00ddff" },
];

export const jailbreakLevels: JailbreakLevel[] = [
  { id: "L1", name: "L1 Soft", desc: "软提示——上下文诱导", color: "#4ade80" },
  { id: "L2", name: "L2 Medium", desc: "中量级——编码/语言混合", color: "#facc15" },
  { id: "L3", name: "L3 Hard", desc: "硬量级——角色扮演/系统覆盖", color: "#fb923c" },
  { id: "L4", name: "L4 Deep", desc: "深度——多轮递进/记忆劫持", color: "#ef4444" },
];

/** 站点上的合规标准分组（按框架族归类展示，主推框架排前） */
export const standardGroups: { label: string; items: string[] }[] = [
  { label: "方法论 / 渗透", items: ["PTES (Penetration Testing Execution Standard)", "OWASP Testing Guide v4.2"] },
  { label: "NIST / 美国", items: ["NIST SP 800-115", "NIST SP 800-61 Rev 2", "CIS Benchmarks"] },
  { label: "ATT&CK / OWASP", items: ["MITRE ATT&CK v15", "MITRE ATLAS™", "OWASP Top 10 for LLM Applications"] },
  { label: "中国 / 国际认证", items: ["ISO 27001", "等级保护2.0"] },
];
