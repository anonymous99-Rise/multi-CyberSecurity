/**
 * 派生数据（选择器）：所有由数据集计算出来的统计/筛选函数集中在这里，
 * 页面只调用、不自己算，保证同一指标在各页面数值一致。
 */
import { attackTechniques, modules, skillsIndex } from "./datasets";
import type { ModuleEntry, SkillIndexEntry } from "./types";

/** 按关键词搜索技能（名称 / 描述 / 标签 / ATT&CK 编号 / 分类） */
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

/** 取某个分类模块下的全部技能 */
export function getSkillsByModule(modulePath: string): SkillIndexEntry[] {
  return skillsIndex.filter((s) => s.category === modulePath);
}

/** ATT&CK 覆盖统计：技术总数 / 已覆盖数 / 平均分 */
export function getAttackCoverageStats() {
  const total = attackTechniques.length;
  const covered = attackTechniques.filter((t) => t.enabled && t.score > 0).length;
  const avgScore =
    total > 0
      ? (attackTechniques.reduce((sum, t) => sum + t.score, 0) / total).toFixed(1)
      : "0";
  return { total, covered, avgScore };
}

/** NIST CSF 五大功能各自的技能覆盖数（降序） */
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

/** 技能数最多的前 N 个分类 */
export function getTopModules(limit = 6): ModuleEntry[] {
  return [...modules].sort((a, b) => b.skill_count - a.skill_count).slice(0, limit);
}

/** 已映射到 MITRE ATT&CK 的技能数 */
export function getAttackMappedCount(): number {
  return skillsIndex.filter((s) => s.mitre_attack.length > 0).length;
}
