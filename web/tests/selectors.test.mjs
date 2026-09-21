import test from "node:test";
import assert from "node:assert/strict";
import {
  attackCoverageOf,
  attackMappedCountOf,
  csfCoverageOf,
  searchSkillsIn,
  topModulesOf,
} from "../src/lib/data/pure.ts";

/** 构造最小技能对象（只填选择器真正读的字段） */
const skill = (over = {}) => ({
  name: "示例-skill",
  description: "描述",
  domain: "cybersecurity",
  subdomain: "recon",
  tags: [],
  mitre_attack: [],
  nist_csf: [],
  version: "1.0.0",
  author: "multi-cybersecurity",
  license: "Apache-2.0",
  category: "01-信息搜集-Reconnaissance",
  file: "01-信息搜集-Reconnaissance/skills/x.md",
  ...over,
});

test("searchSkillsIn 空查询返回全部（且不复制数组）", () => {
  const all = [skill(), skill({ name: "b" })];
  assert.equal(searchSkillsIn("", all), all);
  assert.equal(searchSkillsIn("   ", all), all);
});

test("searchSkillsIn 命中 名称/描述/标签/T-ID/分类 五个维度", () => {
  const all = [
    skill({ name: "子域名探测-subdomain-discovery" }),
    skill({ name: "other", description: "关键词在描述里" }),
    skill({ name: "other2", tags: ["aws"] }),
    skill({ name: "other3", mitre_attack: ["T1059"] }),
    skill({ name: "other4", category: "16-大模型安全-LLMSecurity" }),
  ];
  assert.equal(searchSkillsIn("subdomain", all).length, 1);
  assert.equal(searchSkillsIn("描述里", all).length, 1);
  assert.equal(searchSkillsIn("AWS", all).length, 1); // 大小写不敏感
  assert.equal(searchSkillsIn("t1059", all).length, 1);
  assert.equal(searchSkillsIn("llmsecurity", all).length, 1);
  assert.equal(searchSkillsIn("不存在的词", all).length, 0);
});

test("  attackCoverageOf 只统计 enabled 且 score>0", () => {
  const techniques = [
    { techniqueID: "T1", score: 3, enabled: true, metadata: [], comment: "", color: "" },
    { techniqueID: "T2", score: 0, enabled: true, metadata: [], comment: "", color: "" },
    { techniqueID: "T3", score: 5, enabled: false, metadata: [], comment: "", color: "" },
    { techniqueID: "T4", score: 2, enabled: true, metadata: [], comment: "", color: "" },
  ];
  const stats = attackCoverageOf(techniques);
  assert.equal(stats.total, 4);
  assert.equal(stats.covered, 2);
  assert.equal(stats.avgScore, "2.5"); // (3+0+5+2)/4
});

test("attackCoverageOf 空输入不除零", () => {
  const stats = attackCoverageOf([]);
  assert.deepEqual(stats, { total: 0, covered: 0, avgScore: "0" });
});

test("csfCoverageOf 按功能聚合且降序", () => {
  const skills = [
    skill({ nist_csf: ["PR.AC-01", "DE.CM-01"] }),
    skill({ nist_csf: ["PR.AC-01", "ID.AM-01"] }),
    skill({ nist_csf: [] }),
  ];
  const cov = csfCoverageOf(skills);
  assert.equal(cov[0].func, "PR");
  assert.equal(cov[0].count, 2);
  assert.deepEqual(
    cov.map((c) => c.func).sort(),
    ["DE", "ID", "PR"],
  );
});

test("topModulesOf 返回前 N 且不改动入参数组", () => {
  const mods = [
    { id: 1, skill_count: 3 },
    { id: 2, skill_count: 9 },
    { id: 3, skill_count: 5 },
  ];
  const before = mods.map((m) => m.id);
  const top = topModulesOf(mods, 2);
  assert.deepEqual(top.map((m) => m.id), [2, 3]);
  assert.deepEqual(mods.map((m) => m.id), before); // 入参顺序未被就地排序
  assert.equal(topModulesOf([], 6).length, 0);
});

test("attackMappedCountOf 统计有映射的技能数", () => {
  const skills = [skill({ mitre_attack: ["T1"] }), skill({ mitre_attack: [] }), skill({ mitre_attack: ["T2"] })];
  assert.equal(attackMappedCountOf(skills), 2);
  assert.equal(attackMappedCountOf([]), 0);
});
