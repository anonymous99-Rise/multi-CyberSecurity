/**
 * sync-data.mjs — 将项目根目录的数据文件同步到 web/src/data/
 * 并预渲染技能 MD 正文和破限 payload 内容为 JSON
 *
 * 用法: node scripts/sync-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DATA_DIR = resolve(__dirname, "..", "src", "data");

// 1. 同步 JSON 数据文件
const jsonFiles = [
  ["index.json", "index.json"],
  ["skills_index.json", "skills_index.json"],
  ["mappings/attack-navigator-layer.json", "attack-navigator-layer.json"],
  // 外部子仓库技能计数（由 tools/external_skills_manifest.py 生成，单独维度、不计入自有技能数）
  ["external-skills.json", "external-skills.json"],
];

console.log("=== 同步 JSON 数据 ===");
for (const [src, dst] of jsonFiles) {
  const srcPath = join(ROOT, src);
  const dstPath = join(DATA_DIR, dst);
  if (!existsSync(srcPath)) {
    console.warn(`  SKIP: ${src} (不存在)`);
    continue;
  }
  const content = readFileSync(srcPath, "utf-8");
  writeFileSync(dstPath, content);
  console.log(`  OK: ${src} -> ${dst}`);
}

// 2. 预渲染技能 MD 正文
console.log("\n=== 预渲染技能 MD 正文 ===");
const skillsIndex = JSON.parse(readFileSync(join(DATA_DIR, "skills_index.json"), "utf-8"));
const skillsContent = {};

for (const skill of skillsIndex) {
  const mdPath = join(ROOT, skill.file);
  if (!existsSync(mdPath)) continue;
  const content = readFileSync(mdPath, "utf-8");
  // 去掉 frontmatter，取正文
  const body = content.replace(/^---[\s\S]*?---\n/, "").trim();
  // 截取前 5000 字符避免过大
  skillsContent[skill.name] = body.slice(0, 5000);
}

writeFileSync(join(DATA_DIR, "skills_content.json"), JSON.stringify(skillsContent));
console.log(`  OK: ${Object.keys(skillsContent).length} 个技能正文已渲染`);

// 3. 预渲染破限 payload 内容
console.log("\n=== 预渲染破限 Payload ===");
const jailbreakDir = join(ROOT, "framework", "skills", "redteam", "jailbreak");
const jailbreakPayloads = {};

const levelDirs = {
  L1: "L1_soft",
  L2: "L2_medium",
  L3: "L3_hard",
  L4: "L4_deep",
};

for (const [level, dir] of Object.entries(levelDirs)) {
  const levelPath = join(jailbreakDir, dir);
  if (!existsSync(levelPath)) continue;
  const files = readdirSync(levelPath).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const platform = file.replace(".md", "");
    const content = readFileSync(join(levelPath, file), "utf-8");
    const body = content.replace(/^---[\s\S]*?---\n/, "").trim();
    if (!jailbreakPayloads[level]) jailbreakPayloads[level] = {};
    jailbreakPayloads[level][platform] = body.slice(0, 8000);
  }
  console.log(`  ${level}: ${Object.keys(jailbreakPayloads[level] || {}).length} 个平台`);
}

writeFileSync(join(DATA_DIR, "jailbreak_payloads.json"), JSON.stringify(jailbreakPayloads));
console.log(`  OK: 破限 payload 已渲染`);

// 4. 同步子仓库清单（解析根目录 .gitmodules，免手工维护）
console.log("\n=== 同步子仓库清单 ===");
// 子仓库中文简介；新增子仓库时在此登记，未登记则回退为 owner/repo
const SUBMODULE_DESC = {
  "external/Claude-BugHunter": "Bug Hunting / Red Team 技能包（71+）",
  "external/Claude-Red": "Claude 攻击性安全技能库（79 SKILL.md / 23 类）",
  "external/Anthropic-Cybersecurity-Skills": "全面安全评估技能（817+ / 29 领域）",
  "external/reverse-skill": "逆向 / CTF / 渗透技能路由包",
  "external/AboutSecurity": "安全工具集合",
  "external/CkSKILLS": "SRC 挖洞技能体系 + hunts 线索板",
  "external/cnvd-skill": "CNVD 通用型未授权漏洞广扫便携包",
  "external/Desinter_scan": "AI 自动化信息收集流水线（22 collector + Claude 评分）",
  "external/CyberStrikeAI": "AI 原生安全操作平台（Eino + MCP + RAG）",
  "external/cve_monitor": "CVE 监控与推送",
  "external/Vulnerability-Wiki-PoC": "漏洞 PoC 库",
  "external/agency-agents": "Agent 编排框架",
  "external/agency-agents-zh": "Agent 编排框架（中文）",
  "external/dsh-pentest": "DSH 渗透模式插件（pentest_* 工具链）",
  "external/dsh-infinite-gen-4": "DSH 红队评测破甲插件",
  "external/dsh-redteam-model": "DSH 红队模型研究",
  "vendor/burp-mcp": "Burp Suite MCP Server",
  "vendor/redteam-mcp": "红队 Agent MCP",
  "vendor/codegraph": "代码分析工具（MCP 集成）",
  "standards/owasp-top10": "OWASP Top 10 标准",
};

const gitmodulesPath = join(ROOT, ".gitmodules");
const submodulesJsonPath = join(DATA_DIR, "submodules.json");
// 分组展示顺序
const GROUP_ORDER = { external: 0, standards: 1, vendor: 2 };

if (existsSync(gitmodulesPath)) {
  const items = [];
  let current = null;
  for (const rawLine of readFileSync(gitmodulesPath, "utf-8").split(/\r?\n/)) {
    const header = rawLine.match(/^\[submodule\s+"(.+?)"\]/);
    if (header) {
      if (current && current.path && current.url) items.push(current);
      current = { path: "", url: "" };
      continue;
    }
    const kv = rawLine.match(/^\s*(path|url)\s*=\s*(\S+)\s*$/);
    if (kv && current) current[kv[1]] = kv[2];
  }
  if (current && current.path && current.url) items.push(current);

  const submodules = items
    .map(({ path, url }) => ({
      name: path.split("/").pop(),
      path,
      url,
      group: path.split("/")[0],
      desc:
        SUBMODULE_DESC[path] ||
        url.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, ""),
    }))
    // 展示顺序：external -> standards -> vendor，同组内按名称（便于页面扫读）
    .sort((a, b) => {
      const g = (GROUP_ORDER[a.group] ?? 9) - (GROUP_ORDER[b.group] ?? 9);
      return g !== 0 ? g : a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

  writeFileSync(submodulesJsonPath, JSON.stringify(submodules, null, 2) + "\n");
  console.log(`  OK: ${submodules.length} 个子仓库 -> submodules.json`);

  const missing = submodules.filter((s) => !SUBMODULE_DESC[s.path]).map((s) => s.path);
  if (missing.length > 0) {
    console.warn(`  WARN: 未登记简介，已回退 owner/repo: ${missing.join(", ")}`);
  }
} else if (!existsSync(submodulesJsonPath)) {
  writeFileSync(submodulesJsonPath, "[]\n");
  console.warn("  SKIP: .gitmodules 缺失，已写入空清单");
}

console.log("\n=== 同步完成 ===");
