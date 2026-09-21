/** 数据模型定义（纯类型，无运行时代码） */

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

export interface JailbreakLevel {
  id: string;
  name: string;
  desc: string;
  color: string;
}

export interface SubmoduleEntry {
  name: string;
  path: string;
  url: string;
  group: string;
  desc: string;
  /** 该子仓库的 SKILL.md 数（null = 清单未覆盖/未统计） */
  skill_md?: number | null;
  /** 该子仓库的 .md 总数（知识库类仓库用它体现体量） */
  md_total?: number | null;
  /** skills | knowledge | tool */
  kind?: string | null;
}

export interface ExternalSkillRepo {
  name: string;
  path: string;
  url: string;
  repo: string;
  commit: string | null;
  skill_md: number | null;
  md_total?: number | null;
  count_source: string;
  kind: string;
}

export interface ExternalSkillsManifest {
  generated_at: string;
  generated_by: string;
  note: string;
  metric: string;
  repo_count: number;
  repo_with_skills: number;
  repo_with_knowledge?: number;
  external_skill_md_total: number;
  external_md_total?: number;
  repos: ExternalSkillRepo[];
}
