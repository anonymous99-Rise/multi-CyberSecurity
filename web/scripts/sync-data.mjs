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

console.log("\n=== 同步完成 ===");
