/**
 * 纯函数层：不依赖任何 JSON 数据文件，输入即参数 —— 便于单元测试。
 * `selectors.ts` 用真实数据集把它们绑定成页面直接可用的 API。
 */
import type { AttackTechnique, ModuleEntry, SkillIndexEntry } from "./types";

/** 按关键词搜索技能（名称 / 描述 / 标签 / ATT&CK 编号 / 分类） */
export function searchSkillsIn(query: string, all: SkillIndexEntry[]): SkillIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.mitre_attack.some((t) => t.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q),
  );
}

/** ATT&CK 覆盖统计：技术总数 / 已覆盖数（enabled 且 score>0）/ 平均分 */
export function attackCoverageOf(techniques: AttackTechnique[]) {
  const total = techniques.length;
  const covered = techniques.filter((t) => t.enabled && t.score > 0).length;
  const avgScore = total > 0 ? (techniques.reduce((sum, t) => sum + t.score, 0) / total).toFixed(1) : "0";
  return { total, covered, avgScore };
}

/** NIST CSF 五大功能各自的技能覆盖数（降序） */
export function csfCoverageOf(skills: SkillIndexEntry[]): { func: string; count: number }[] {
  const csfMap = new Map<string, number>();
  skills.forEach((s) => {
    s.nist_csf.forEach((c) => {
      const func = c.split(".")[0];
      csfMap.set(func, (csfMap.get(func) || 0) + 1);
    });
  });
  return Array.from(csfMap.entries())
    .map(([func, count]) => ({ func, count }))
    .sort((a, b) => b.count - a.count);
}

/** 技能数最多的前 N 个分类（不改动传入数组） */
export function topModulesOf(mods: ModuleEntry[], limit = 6): ModuleEntry[] {
  return [...mods].sort((a, b) => b.skill_count - a.skill_count).slice(0, limit);
}

/** 已映射到 MITRE ATT&CK 的技能数 */
export function attackMappedCountOf(skills: SkillIndexEntry[]): number {
  return skills.filter((s) => s.mitre_attack.length > 0).length;
}
