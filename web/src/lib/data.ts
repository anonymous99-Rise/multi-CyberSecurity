import indexData from "@/data/index.json";
import skillsIndexData from "@/data/skills_index.json";
import attackLayerData from "@/data/attack-navigator-layer.json";
import skillsContentData from "@/data/skills_content.json";
import jailbreakPayloadsData from "@/data/jailbreak_payloads.json";

export const skillsContent = skillsContentData as Record<string, string>;
export const jailbreakPayloads = jailbreakPayloadsData as Record<string, Record<string, string>>;

export interface MetaInfo {
  title: string;
  description: string;
  version: string;
  total_skills: number;
  total_modules: number;
  last_updated: string;
  standards: string[];
}

export interface SkillEntry {
  name: string;
  file: string;
  difficulty: string;
}

export interface ModuleEntry {
  id: number;
  name_cn: string;
  name_en: string;
  emoji: string;
  path: string;
  skill_count: number;
  skills: SkillEntry[];
}

export interface SkillIndexEntry {
  name: string;
  description: string;
  domain: string;
  subdomain: string;
  tags: string[];
  mitre_attack: string[];
  nist_csf: string[];
  version: string;
  author: string;
  license: string;
  category: string;
  file: string;
}

export interface AttackTechnique {
  techniqueID: string;
  score: number;
  metadata: { name: string; value: string }[];
  comment: string;
  enabled: boolean;
  color: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  configPath: string;
  color: string;
}

export const meta = (indexData as any).meta as MetaInfo;
export const modules = (indexData as any).modules as ModuleEntry[];
export const skillsIndex = skillsIndexData as SkillIndexEntry[];
export const attackTechniques = (attackLayerData as any).techniques as AttackTechnique[];

export const platforms: PlatformConfig[] = [
  { id: "trae", name: "Trae", configPath: ".trae", color: "#4f9eff" },
  { id: "cursor", name: "Cursor", configPath: ".cursor", color: "#a78bfa" },
  { id: "claude", name: "Claude Code", configPath: ".claude", color: "#ff9f40" },
  { id: "codex", name: "Codex", configPath: ".codex", color: "#00ff88" },
  { id: "openclaw", name: "OpenClaw", configPath: ".openclaw", color: "#ff3366" },
  { id: "hermes", name: "Hermes", configPath: ".hermes", color: "#ffaa00" },
  { id: "dsh", name: "DeepSeek Harness", configPath: ".dsh", color: "#00ddff" },
];

export const jailbreakLevels = [
  { id: "L1", name: "L1 Soft", desc: "软提示——上下文诱导", color: "#4ade80" },
  { id: "L2", name: "L2 Medium", desc: "中量级——编码/语言混合", color: "#facc15" },
  { id: "L3", name: "L3 Hard", desc: "硬量级——角色扮演/系统覆盖", color: "#fb923c" },
  { id: "L4", name: "L4 Deep", desc: "深度——多轮递进/记忆劫持", color: "#ef4444" },
];

export function searchSkills(query: string): SkillIndexEntry[] {
  if (!query.trim()) return skillsIndex;
  const q = query.toLowerCase();
  return skillsIndex.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.mitre_attack.some((t) => t.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q),
  );
}

export function getSkillsByModule(modulePath: string): SkillIndexEntry[] {
  return skillsIndex.filter((s) => s.category === modulePath);
}

export function getAttackCoverageStats() {
  const total = attackTechniques.length;
  const covered = attackTechniques.filter((t) => t.enabled && t.score > 0).length;
  const avgScore =
    total > 0
      ? (attackTechniques.reduce((sum, t) => sum + t.score, 0) / total).toFixed(1)
      : "0";
  return { total, covered, avgScore };
}

export function getNistCsfCoverage() {
  const csfMap = new Map<string, number>();
  skillsIndex.forEach((s) => {
    s.nist_csf.forEach((c) => {
      const func = c.split(".")[0];
      csfMap.set(func, (csfMap.get(func) || 0) + 1);
    });
  });
  return Array.from(csfMap.entries())
    .map(([func, count]) => ({ func, count }))
    .sort((a, b) => b.count - a.count);
}
