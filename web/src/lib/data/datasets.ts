/**
 * 数据集：静态导出用到的 JSON 在这里统一引入 + 定型。
 *
 * 数据文件由 `scripts/sync-data.mjs` 在构建时从仓库根目录同步到 `src/data/`，
 * 前端只读不写；类型见 `./types`。
 */
import indexData from "@/data/index.json";
import skillsIndexData from "@/data/skills_index.json";
import attackLayerData from "@/data/attack-navigator-layer.json";
import skillsContentData from "@/data/skills_content.json";
import jailbreakPayloadsData from "@/data/jailbreak_payloads.json";
import submodulesData from "@/data/submodules.json";
import externalSkillsData from "@/data/external-skills.json";

import type {
  AttackTechnique,
  ExternalSkillsManifest,
  MetaInfo,
  ModuleEntry,
  SkillIndexEntry,
  SubmoduleEntry,
} from "./types";

export const meta = (indexData as any).meta as MetaInfo;
export const modules = (indexData as any).modules as ModuleEntry[];
export const skillsIndex = skillsIndexData as SkillIndexEntry[];
export const attackTechniques = (attackLayerData as any).techniques as AttackTechnique[];

/** 技能名 → 正文（预渲染，仅收录磁盘上真实存在的技能文件） */
export const skillsContent = skillsContentData as Record<string, string>;
/** 破限等级 → 平台 → payload 正文 */
export const jailbreakPayloads = jailbreakPayloadsData as Record<string, Record<string, string>>;

/** 子仓库清单：由 scripts/sync-data.mjs 解析根目录 .gitmodules 生成 */
export const submodules = submodulesData as SubmoduleEntry[];
/** 外部子仓库技能计数（单独维度，不计入 meta.total_skills） */
export const externalSkills = externalSkillsData as ExternalSkillsManifest;
