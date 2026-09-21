/**
 * 派生数据（选择器）：把纯函数（`./pure`）绑定到真实数据集，
 * 页面只调用这些函数、不自己算，保证同一指标在各页面数值一致。
 */
import { attackTechniques, modules, skillsIndex } from "./datasets";
import {
  attackCoverageOf,
  attackMappedCountOf,
  csfCoverageOf,
  searchSkillsIn,
  topModulesOf,
} from "./pure";
import type { ModuleEntry, SkillIndexEntry } from "./types";

export const searchSkills = (query: string): SkillIndexEntry[] => searchSkillsIn(query, skillsIndex);

export const getSkillsByModule = (modulePath: string): SkillIndexEntry[] =>
  skillsIndex.filter((s) => s.category === modulePath);

export const getAttackCoverageStats = () => attackCoverageOf(attackTechniques);

export const getNistCsfCoverage = () => csfCoverageOf(skillsIndex);

export const getTopModules = (limit = 6): ModuleEntry[] => topModulesOf(modules, limit);

export const getAttackMappedCount = (): number => attackMappedCountOf(skillsIndex);
