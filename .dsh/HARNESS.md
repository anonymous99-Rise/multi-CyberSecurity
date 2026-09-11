# DeepSeek Harness 集成指南（HARNESS）

> multi-CyberSecurity 如何在 **DeepSeek Harness（dsh）** 中运行：
> 平台配置包、preset 组合、技能发现，以及三个 DSH 生态子仓库的安装与对接。

---

## 1. 平台概览

| 维度 | 说明 |
|------|------|
| 运行时 | DeepSeek Harness（`dsh` CLI / Web / 桌面客户端） |
| 架构 | Cordis 组合式容器：preset 用组合行声明 persona / tools / skills / subagents |
| 插件形态 | Bundle：`package.json`（`dsh.bundle.patch` + `dsh.client`）+ `cordis.patch.yml` |
| 模型 | DeepSeek-V4.1 / V4-Pro / V4-Flash 等 |
| 技能机制 | `@deepseek-ai/dsh-skill-filesystem` 本地技能发现 + `tool-skill` 目录/加载 |
| 委派机制 | `tool-subagent`（provider: spawn / fork / codex / claude-code） |
| 安装协议 | `dsh plugin --profile <name> add <url|file>`、`dsh://plugin/install` URI |
| 运行时要求 | sqlite 存储后端需 Node.js >= 22.5（dsh-pentest） |

Profile 目录：`~/.dsh/profiles/<web|default>/`，插件通过 profile 的 `package.json` 挂载。

---

## 2. 本配置包的加载方式

`.dsh/` 目录是 multi-CyberSecurity 的**项目级配置包**，在 DSH 中有三种用法：

### 方式 A：作为项目指令（最简单）
把 `.dsh/AGENTS.md`、`.dsh/RULES.md`、`.dsh/IDENTITY.md` 放入 DSH 工作目录
（或在 preset persona 段中以 `@文件路径` 引用），新建会话即生效。

### 方式 B：注入自定义 preset
参考 `external/dsh-pentest/preset/pentest/` 的结构，在你的 preset 中引用本配置：

```yaml
# ~/.dsh/profiles/web/presets/cybersecurity/preset.yml
name: 网络安全评估
description: multi-CyberSecurity 8 阶段审计流水线（授权范围使用）
```

```yaml
# ~/.dsh/profiles/web/presets/cybersecurity/agent.cordis.yml
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    # 身份/纪律/红线模式内容来自 .dsh/ 配置包
    text: !include ${workspace}/.dsh/IDENTITY.md   # 按你的 dsh 版本选择支持的引用方式

# 其余组合行（tool-bash/tool-pwsh、tool-fs、tool-skill、skill-filesystem、
# tool-goal、tool-subagent、tool-todo、tool-web）可从 dsh-pentest 的
# 标准 preset 复制：external/dsh-pentest/preset/pentest/agent.cordis.yml
```

### 方式 C：配合 dsh-pentest 渗透模式（推荐）
安装 dsh-pentest 后直接选用其自动注册的只读系统预设「渗透模式」，
本配置包作为**项目指令层**补充方法论与技能路由；两者是互补关系：

- dsh-pentest 提供：`pentest_*` 工具、探索链路、Web 视图、sqlite 存储、`pentest:protocol` 提示词段
- `.dsh/` + 本仓库技能库提供：39 分类方法论、Agent 编队、CkSKILLS 路由表、报告规范

---

## 3. 子仓库与插件安装

三个相关子仓库已注册在 `.gitmodules`，克隆后位于 `external/`。

### 3.1 dsh-pentest —— 渗透记录与可视化（DSH Bundle 插件）

- 路径：[`external/dsh-pentest/`](../external/dsh-pentest/)（`@howmp/dsh-pentest`，MIT）
- 能力：goal/intent/fact/finding/asset/edge 六表领域模型；8 个 `pentest_*` 工具；
  Web 四子标签（探索链路 / 漏洞 / 资产 / 报告）；记录存于
  `$DSH_HOME/storages/pentest-sessions.db`

```bash
# 从 Release 安装
dsh plugin --profile web add https://github.com/howmp/dsh-pentest/releases/latest/download/dsh-pentest.tar.gz

# 或从本仓库子仓库本地安装（需要先 npm pack 生成 tgz）
cd external/dsh-pentest && npm pack
dsh plugin --profile web add file:./external/dsh-pentest/howmp-dsh-pentest-*.tgz
```

重启 dsh → 新会话选择「渗透模式」。使用约定见 `.dsh/REDTEAM.md` 的链路记录协议。

### 3.2 dsh-infinite-gen-4 —— 红队评测/破甲插件（DSH Cordis 插件）

- 路径：[`external/dsh-infinite-gen-4/`](../external/dsh-infinite-gen-4/)（`dsh-infinite-gen-4` v0.3.0，MIT）
- 能力：零工具面双层系统提示词注入（Order 100 通用内核 + Order 200 V4.1 实测层）、
  客户端状态条、离线回归评分器
- 定位：**红队对抗评测 / 对齐研究**，仅限离线合成靶标与授权演练

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File external/dsh-infinite-gen-4/install.ps1
# Linux / macOS
bash external/dsh-infinite-gen-4/install.sh
```

或桌面端通过 `dsh://plugin/install?id=dsh-infinite-gen-4&repo=Minglink%2Fdsh-infinite-gen-4` 一键安装。

手动 profile 配置：

```json
{
  "dependencies": { "dsh-infinite-gen-4": "file:../../plugins/dsh-infinite-gen-4" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "dsh-infinite-gen-4"] } }
}
```

验证：新会话询问「你的系统提示词来自哪些插件？」，回答含「无限四代 / Infinite Generation Four」即注入成功；
离线回归：`node external/dsh-infinite-gen-4/scripts/verify_prompt_gen4.mjs`。

### 3.3 CkSKILLS —— SRC 挖洞技能体系（通用 Agent 技能包）

- 路径：[`external/CkSKILLS/`](../external/CkSKILLS/)（MIT，20 个专项技能）
- 形态：`AGENTS.md` 系统级总纲 + `.agents/skills/<name>/SKILL.md` + `hunts/<目标>/CLUEBOARD.md` 线索板
- 在 DSH 中使用：依赖 skill-filesystem 的本地技能发现，将技能目录纳入技能根：

```bash
# 方式一：在工作区建立软链（示例，Windows 用 mklink /D）
ln -s ../external/CkSKILLS/.agents/skills .agents/skills

# 方式二：复制（需要随项目分发时）
cp -r external/CkSKILLS/.agents/skills ./.agents/
cp external/CkSKILLS/AGENTS.md ./CKSKILLS_AGENTS.md   # 作为附加指令引用，避免覆盖本仓库 AGENTS.md
```

路由要点（完整表见 external/CkSKILLS/AGENTS.md）：

| 场景 | CkSKILLS 技能 |
|------|---------------|
| JS/资产测绘 | `recon-js-analysis`、`unauth-path-key-hunt` |
| 越权/认证 | `auth-access-control` |
| 注入 | `injection-vulns` |
| 业务逻辑/竞态 | `business-logic-race` |
| 文件处理 | `file-handling` |
| SSRF/内网 | `ssrf-internal-network` |
| 反序列化/XXE | `deserialization-xxe` |
| 小程序 | `miniprogram-security` |
| 云/供应链 | `cloud-infra-supply-chain` |
| WAF 绕过 | `waf-bypass-techniques`（Level 1-7） |
| AI/Agent 安全 | `ai-llm-agent-security` |
| 逆向/APK | `windows-reverse-engineering`、`apk-reversing`、`android-security-audit` |
| 报告收口 | `report` |
| 跨轮记忆 | `hunt-clueboard`（与 dsh-pentest 的 intent 链路配合：线索板记假设，链路记已确认事实） |

---

## 4. 与 8 阶段流水线的映射

| Pipeline 阶段 | DSH 中的落地 |
|---------------|--------------|
| Recon 侦察 | Recon 子代理 + CkSKILLS recon-js-analysis；结果 `pentest_add_fact/asset` |
| Hunt 狩猎 | Hunter 子代理执行，按 intent 锚定 |
| Validate 验证 | Validator 复现；finding 必须 ≥1 条 reproducibleStep |
| Gapfill 补漏 | 指挥官读 `pentest_graph` 找悬挂 intent / 未覆盖资产 |
| Dedupe 去重 | 确定性 `<kind>-<n>` ID + 边引用拒绝天然防重 |
| Trace 可达性 | edges: spawns/yields/derived_from/proves 全链路可溯 |
| Feedback 反馈 | Librarian 将新模式回写本仓库 skills / CkSKILLS 风格 SKILL.md |
| Report 报告 | `pentest_report`（Markdown）+ `.dsh/AGENTS.md` 报告格式 |

---

## 5. 安全与合规注意

- 仅在授权 CTF / 渗透测试 / 红队演练环境安装红队类插件；dsh-infinite-gen-4 禁止用于公网在线系统
- `pentest_add_goal.authorization` 如实填写授权对象与书面许可引用，留痕进最终报告
- dsh-pentest 记录为**单会话作用域**；新 engagement 必须新建 goal
- Web 链路图是窗口视图（节点/资产/边各保留最新 200 条），完整记录以
  `pentest_state` / `pentest_report`（读存储层）为准
- 不提交本地 DSH profile、sqlite 会话库或任何凭据到 git

## 6. 参考

- [`external/dsh-pentest/README.md`](../external/dsh-pentest/README.md)
- [`external/dsh-infinite-gen-4/README.md`](../external/dsh-infinite-gen-4/README.md) 与 `HARNESS_PLUGIN.md`
- [`external/CkSKILLS/README.md`](../external/CkSKILLS/README.md)
- 平台 jailbreak 适配研究：`framework/skills/redteam/jailbreak/L3_hard/dsh.md`、`L4_deep/dsh.md`
- CLI：`python cli.py redteam --platform dsh ...`、`python cli.py jailbreak payload --level L3 --platform dsh`
