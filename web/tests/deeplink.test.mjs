import test from "node:test";
import assert from "node:assert/strict";
import { buildSkillsHash, isEmptySkillsLink, parseSkillsHash } from "../src/lib/deeplink.ts";

test("parseSkillsHash：空输入", () => {
  assert.deepEqual(parseSkillsHash(""), {});
  assert.deepEqual(parseSkillsHash("#"), {});
  assert.deepEqual(parseSkillsHash("#   "), {});
  assert.deepEqual(parseSkillsHash(undefined), {});
});

test("parseSkillsHash：三种键都能解析（含中文与点号）", () => {
  assert.deepEqual(parseSkillsHash("#q=T1059"), { q: "T1059" });
  assert.deepEqual(parseSkillsHash("#module=01-信息搜集-Reconnaissance"), {
    module: "01-信息搜集-Reconnaissance",
  });
  assert.deepEqual(parseSkillsHash("#skill=子域名探测-subdomain-discovery"), {
    skill: "子域名探测-subdomain-discovery",
  });
});

test("parseSkillsHash：多键 / 未知键 / 空值 / 无等号 都安全", () => {
  assert.deepEqual(parseSkillsHash("#q=abc&module=m1&skill=s1"), { q: "abc", module: "m1", skill: "s1" });
  assert.deepEqual(parseSkillsHash("#evil=1&q=ok"), { q: "ok" }); // 未知键忽略
  assert.deepEqual(parseSkillsHash("#q=&module="), {}); // 空值忽略
  assert.deepEqual(parseSkillsHash("#justtext"), {}); // 无等号忽略
  assert.deepEqual(parseSkillsHash("#=v"), {}); // 空键忽略
});

test("parseSkillsHash：重复键取首个", () => {
  assert.deepEqual(parseSkillsHash("#q=first&q=second"), { q: "first" });
});

test("parseSkillsHash：百分号编码可还原", () => {
  assert.deepEqual(parseSkillsHash("#q=%E5%AD%90%E5%9F%9F%E5%90%8D"), { q: "子域名" });
  // 编码错误的片段不应抛出异常
  assert.doesNotThrow(() => parseSkillsHash("#q=%E5%AD"));
});

test("buildSkillsHash：固定键顺序、省略空值", () => {
  assert.equal(buildSkillsHash({}), "");
  assert.equal(buildSkillsHash({ q: "T1059" }), "#q=T1059");
  assert.equal(buildSkillsHash({ skill: "s1", module: "m1", q: "abc" }), "#q=abc&module=m1&skill=s1");
  assert.equal(buildSkillsHash({ q: "", module: "m1" }), "#module=m1");
});

test("buildSkillsHash：中文与特殊字符被编码", () => {
  const hash = buildSkillsHash({ skill: "红队评估方法论-red-team-assessment" });
  assert.ok(hash.startsWith("#skill="));
  assert.ok(!hash.includes("红队")); // 已编码
  assert.deepEqual(parseSkillsHash(hash), { skill: "红队评估方法论-red-team-assessment" }); // 往返一致
});

test("往返一致性（随机若干真实形态的值）", () => {
  const samples = [
    { q: "T1059" },
    { module: "24-红蓝对抗-RedTeam" },
    { skill: "紫队协作评估-purple-team-exercise" },
    { q: "sql 注入", module: "03-漏洞利用-Exploitation", skill: "x" },
  ];
  for (const s of samples) {
    assert.deepEqual(parseSkillsHash(buildSkillsHash(s)), s);
  }
});

test("isEmptySkillsLink", () => {
  assert.equal(isEmptySkillsLink({}), true);
  assert.equal(isEmptySkillsLink({ q: "" }), true);
  assert.equal(isEmptySkillsLink({ q: "a" }), false);
});
