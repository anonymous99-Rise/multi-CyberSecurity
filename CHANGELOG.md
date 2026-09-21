# Changelog

## [Unreleased]

### 🐛 修复

#### 数据完整性：模块 24 丢失的 6 个 skill 已恢复

- `95c5bd3` 把 `24-红蓝对抗-RedBlueTeam/` 当作"重复目录"删除（保留 `24-红蓝对抗-RedTeam/`），但保留目录里并没有 `skills/` —— 于是 `index.json`、`skills_index.json`、`framework/skill_graph.json`、`framework/skills/index.md` 与前端共有 6 条索引指向不存在的文件（网站技能详情页空白，索引 199 vs 磁盘 193）
- 现从历史恢复这 6 个 skill 到 `24-红蓝对抗-RedTeam/skills/`（`红队评估方法论`、`蓝队防御与检测`、`紫队协作评估`、`BAS攻击模拟平台`、`闭环防御改进`、`Agent黑客技能集`），并把全部引用统一到该目录；技能数与索引重新对齐（199 = 199）

#### 工具与 CI 修复

- `tools/validate_skills.py`、`tools/gen_index.py`、`tools/transform_skills.py`：基准路径硬编码为 `/tmp/our`（任何机器上必崩，README 却让用户执行），改为默认仓库根目录并支持传入路径参数；`validate_skills.py` 校验失败时返回非 0
- `.github/workflows/submodule-health-check.yml`：原 bash 解析器对 19 个子仓库命中 **0**（`.gitmodules` 的 tab 缩进 + CRLF 使 `[[ "$key" == "path" ]]` 恒假），每天误报"全部正常"；改为 python3 解析 + 带 token 的 GitHub API 检查，并修复报告生成与 Issue 逻辑（原 `github.rest.issues.listForRepo` 未 await，真出现异常时必然崩溃）
- `.github/workflows/version-sync.yml`：`COMMIT_MSG` 环境变量从未注入 —— `feat:` 永远只升 patch、"防重复 bump"守卫失效；补齐 env，bump 判定改为只看提交标题（`feat(scope):` → minor、`type!:` → major，正文出现 `feat:` 不再误升 minor），显式声明 `permissions: contents: write`，并把 `web/package.json` + `web/package-lock.json` 的根版本纳入自动同步（此前长期停留在 v4.3.1，且一旦漂移便不再同步）
- `web`：补 favicon（`web/src/app/icon.svg`，此前 `/favicon.ico` 请求 404）与 openGraph 元数据

### 🛡️ 防回归

- `.github/workflows/validate.yml` 新增第 4 项检查：`skills_index.json` ↔ 磁盘 `NN-*/skills/*.md` ↔ `index.json` 模块数量三方一致（本次漂移能潜伏 4 个月，正是因为 CI 只扫磁盘、从不与索引交叉校验）

### ✨ 新增（web）

- **深浅双主题**：颜色全部改为 CSS 变量（`globals.css` 的 `:root` / `html.light`），侧栏新增主题切换、结果写入 `localStorage`，首访跟随系统偏好；`layout` 内联脚本在首次绘制前应用主题以免闪色。用 CDP 实测两种主题的对比度（正文/标题/标签深色 12.6/16.8/5.4，浅色 11.2/17.4/5.5，均 ≥ WCAG AA 4.5）；代码/终端表面在浅色下依旧保持深底
- **技能库深链**：`#q=` / `#module=` / `#skill=` 可直接分享与前进后退（选择用 `pushState`、输入用 `replaceState`）；技能详情新增"复制链接"。规避了静态导出下 `useSearchParams` 必须包 Suspense 的限制

### 🧪 测试（web）

- **数据层单元测试**：选择器拆为 `lib/data/pure.ts`（纯函数）+ `selectors.ts`（绑定数据集），测试不依赖 JSON 与路径别名；`npm test` 覆盖千分位、ATT&CK 分档边界/计数、五维搜索、覆盖率空输入、入参不可变等；已接入 `validate.yml`
- 测试首跑即抓到真问题：被截断的百分号编码（`#skill=%E5%AD`）会让 `decodeURIComponent` 抛错打断渲染，已改为容错解码

### 🏗️ 重构（web）

- **数据层拆分**：原 `web/src/lib/data.ts`（174 行，类型 + JSON 引入 + 配置 + 选择器混在一起）拆成 `lib/data/{types,datasets,config,selectors,index}.ts`，页面导入路径不变（仍是 `@/lib/data`），拆分后零页面改动即通过类型检查
- **共享 UI 组件**：新增 `components/ui/`（`Card`/`SectionCard`/`StatPanel`/`BarList`/`Chip`/`PageHeader`/`CopyButton`），首页、ATT&CK、技能库、CLI、破限五个页面改用同一套原语；删掉了重复实现（`fmt` 3 份、`csfLabels` 2 份、复制按钮逻辑 2 份、条形图 3 份）
- **共享工具**：`lib/format.ts`（`fmt`/`hexA`）与 `lib/severity.ts`（ATT&CK 分数分档 + 分档计数 + NIST CSF 标签），矩阵格子与图例从此共用同一分档定义
- **新增 CI 样式闸门** `tools/check_web_style.py`：扫描 `web/src` 拦截三类已踩过的坑 —— 不在 Tailwind 刻度内因而**不会生成 CSS** 的透明度简写、<10px 的字号、超出允许色板的内联颜色；已接入 `validate.yml`（上线首扫即抓出 6 处遗留：5 处 9px 标签 + 1 处 `#888`）

### 🚀 优化

- 前端首页 REPOSITORIES 卡片改为解析 `.gitmodules` 自动生成（`web/scripts/sync-data.mjs` + `web/src/data/submodules.json`），`deploy-web.yml` 触发路径加入 `.gitmodules`
- **前端视觉整改（可读性优先）**：首页配色从 12 种收敛到「主色 + 信息色」2 种（5 张统计卡合并为一个面板 + 发丝分隔线，平台芯片改中性色，移除装饰性 purple token）；语义标签字号 8-9px → 10px、颜色 #4a5258 → #6e7882 提升对比度；网格/扫描线叠加降到几乎不可见；主入口卡加主色左条与 hover 箭头；ATT&CK 矩阵格子放大、T-ID 升到 9px、四档色阶拉开明度并在图例标出各档数量、筛选与图例上移到矩阵顶部；技能库行高与字号上调、右栏空态换成 OVERVIEW 摘要、窄屏详情改整屏浮层；仓库列表在窄屏把描述换到第二行（实测 390px 下被截断元素 13 → 2，且 1440/430/390 三档均无横向溢出）
- `web/src/data/*` 刷新到当前数据（此前索引副本停留在 v4.3.5、仅 193 个技能正文）
- `SUBMODULE_STRATEGY.md` 移除 3 个不存在的脚本与 `SUBMODULE_REPORT.md` 引用，改为与实际工作流一致

---

## [v4.3.2 ~ v4.3.11] - 2026-09-11 ~ 2026-09-21

> 说明：自 v4.3.2 起版本号由 `.github/workflows/version-sync.yml` 在每次 push 时自动递增，
> 该工作流不写 CHANGELOG，因此这里按提交记录补记这一段的实际变更。

### 🚀 新增功能

- **Next.js 前端 + GitHub Pages 自动部署**：`web/` 目录，4 个页面（技能库 / CLI 操作台 / ATT&CK 矩阵 / 破限 Payload），Tactical Terminal 视觉，`basePath=/multi-CyberSecurity` + `.nojekyll`（`c449445`、`370416f`、`2e71d88`、`140ef40`、`a0205fb`）
- **子仓库扩充**：`dsh-redteam-model`（`05a086e`）、`Claude-Red`（`485d3c5`）、`cnvd-skill`（`5c903ae`）
- **子仓库批量同步**：`chore: sync submodules to latest`（`a5ad936`）

### 🔧 优化与修复

- 框架核心 bug 修复（review 驱动，`ee8d7cb`）
- `version_manager` 优化、`generate_batch` 参数透传、版本同步至 v4.3.1（`41a2010`）

---

## [v4.3.1] - 2026-09-11

### 🔧 优化与修复

- `version_manager.py`：`CHECK_ONLY_FILES` 从不存在的 `CHANGELOG_v4.md` 改为 `CHANGELOG.md`，使 `check` 子命令能正确纳入 CHANGELOG 一致性校验
- `index.json`：`last_updated` 从 `2026-05-29` 更新为 `2026-09-11`
- `framework/core/oracle/generators.py`：`PayloadGenerator.generate_batch()` 新增 `target`/`context` 参数并透传给 `generate()`，修复子类依赖参数时批量生成出错的隐患
- 全局版本号同步至 v4.3.1（README / cli.py / index.json / framework/skills/index.md）

---

## [v4.3.0] - 2026-09-11

### 🚀 新增功能

#### DeepSeek Harness (DSH) 平台支持

新增与 `.hermes/`、`.openclaw/` 同级的 `.dsh/` 平台配置包（6 个文件）：

| 文件 | 内容 |
|------|------|
| `.dsh/README.md` | DSH/Cordis 架构说明（preset、bundle、`dsh plugin add`、`dsh://` 协议） |
| `.dsh/AGENTS.md` | commander 决策 agent + spawn/fork 执行子代理编队、委派协议（真实 intentId、禁占位符） |
| `.dsh/RULES.md` | 4 层安全规则 + DSH 运行时规则（preset 边界、证据门 reproducibleSteps≥1、会话作用域） |
| `.dsh/IDENTITY.md` | DSH 指挥官身份与沟通风格 |
| `.dsh/REDTEAM.md` | 红队模式：pentest 链路记录协议、子代理纪律 |
| `.dsh/HARNESS.md` | 完整集成指南：profile 路径、3 种加载方式、插件安装命令、8 阶段流水线映射 |

- 新增 DSH 平台 jailbreak payload：`framework/skills/redteam/jailbreak/L3_hard/dsh.md`（Cordis 组合层/工具记录层/委派层 3 个 payload）与 `L4_deep/dsh.md`（双层 prompt 段 order 100/200 + 5 大技术）
- `cli.py`：`redteam --platform`、`jailbreak --platform` 枚举新增 `dsh`；`skill export --platform` 新增 `dsh`/`hermes`/`openclaw`；banner/帮助示例同步更新至 v4.3.0
- `scripts/platform_exporter.py`：新增 `--platform` 参数与 `generate_dsh_manifests()`，导出 `templates/dsh/`（AGENTS.md / RULES.md / preset.yml）；同时补齐 hermes 导出器
- `framework/core/jailbreak_engine.py`：平台文档字符串补充 dsh（payload 文件仍由 glob 自动发现，无需注册）

#### DSH 生态子仓库集成（3 个）

| 子仓库 | 路径 | 内容 |
|--------|------|------|
| [zhaji2333/CkSKILLS](https://github.com/zhaji2333/CkSKILLS) | `external/CkSKILLS` | SRC 挖洞技能体系：`.agents/skills/` 20 个技能（JS 分析、认证鉴权、注入、WAF 绕过、小程序、APK 逆向等）+ `hunts/` 线索板 |
| [howmp/dsh-pentest](https://github.com/howmp/dsh-pentest) | `external/dsh-pentest` | `@howmp/dsh-pentest` Cordis bundle：8 个 `pentest_*` 工具、sqlite 会话存储、Web 四子标签、pentest preset |
| [Minglink/dsh-infinite-gen-4](https://github.com/Minglink/dsh-infinite-gen-4) | `external/dsh-infinite-gen-4` | 红队评测破甲插件：零工具面 + 双层系统提示词注入（order 100/200）+ client 状态条 |

### 🐛 问题修复

- 修复 `framework/core/oracle/__init__.py` 导入名与 `generators.py` 类名不一致（`CmdInjectionGenerator` vs `CmdInjectionPayloadGenerator`）导致整个 `framework.core` 包及 `cli.py` 无法启动的既有问题；保留旧名作为兼容别名，并补齐 `PathTraversalGenerator`/`XXEGenerator`/`SSTIGenerator`/`get_generator` 的再导出

### 📚 文档更新

- README：新增「多平台适配」小节、目录结构补充各平台配置包与 3 个新子仓库
- SUBMODULE_STRATEGY.md / EXTERNAL_SKILLS_ROUTING.md：子仓库清单与路由表补充 DSH 三子仓库
- docs/guide/README.md：AI 平台列表补充 Hermes、DeepSeek Harness
- docs/reference/CLI_REFERENCE.md：skill export 平台列表补充 dsh/hermes/openclaw

---

## [v4.2.25] - 2026-09-08

### 🚀 新增功能

#### CyberStrikeAI Skills 技能包集成 (Skills20260809)

新增 `Skills20260809/` 目录 — 集成 CyberStrikeAI v3.0 深度攻防专家技能包（By Tas9er），共 **31个技能包**，兼容 [agentskills.io 规范](https://agentskills.io/specification.md)，支持 Eino ADK 框架的 `skill("name")` 按需加载。

**核心漏洞测试技能（24个 v3.0 深度优化）**：

| 技能 | 版本 | 亮点 |
|------|------|------|
| SQL注入测试 | 3.0.0 | 15章，全数据库指纹 + WAF分层绕过 + CVE-2025-1094 + AI函数注入面 |
| XSS测试 | 3.0.0 | 15章，全类型 + DOMPurify绕过 + DOM Clobbering + CSP绕过 |
| SSRF测试 | 3.0.0 | 16章，全协议payload + IMDSv2八种绕过 + Gopher RCE链 |
| 命令注入测试 | 3.0.0 | 16章，全连接符 + 无字母RCE + 容器云逃逸 |
| XXE注入测试 | 3.0.0 | 16章，8大解析器 + OOB Blind XXE + 2025-2026 CVE速查 |
| 文件上传测试 | 3.0.0 | 14+种WAF绕过 + Godzilla免杀WebShell + 云存储 |
| CSRF测试 | 3.0.0 | 16章，SameSite绕过 + OAuth CSRF + CORS+CSRF链 |
| IDOR测试 | 3.0.0 | BOLA/BFLA + GraphQL IDOR + 多租户IDOR |
| API安全测试 | 3.0.0 | OWASP API Top 10 2023 + JWT混淆 + MCP攻击面 |
| 业务逻辑漏洞 | 3.0.0 | OWASP BLA Top 10 2025 + 竞态条件 + LLM逻辑漏洞 |
| LDAP注入测试 | 3.0.0 | 14章，认证绕过 + RBCD联动 + JNDI RCE |
| XPath注入测试 | 3.0.0 | 16章，XSLT RCE + XQuery + SAML XSW |
| 反序列化漏洞 | 3.0.0 | 16章，Java全链 + JEP 290绕过(CVE-2026-47065) + AI框架面 |
| Fastjson利用 | 3.0.0 | 全版本AutoType绕过 + JNDI/BCEL + 不出网利用 |
| Shiro利用 | 3.0.0 | 15章，CBC/GCM双模式 + CVE-2026-56091 + 内存马 |
| Spring利用 | 3.0.0 | 16章，Spring4Shell + Actuator RCE + CVE-2026-22738 |
| Log4Shell利用 | 3.0.0 | 16章，全变体家族 + JDK21对抗 + 不出网利用 |
| 网络渗透测试 | 3.0.0 | 16章，红队攻击链 + BloodHound CE + AD域渗透 |

**新增专项技能**：

| 技能 | 版本 | 描述 |
|------|------|------|
| 内网渗透测试 | 1.0.0 | 内网全链路 + AI大模型内网攻击面 + AI辅助红队 |
| CI/CD攻击测试 | 1.0.0 | DevOps供应链攻击链 + Jenkins/GitLab/ArgoCD CVE + 依赖混淆 |

**基础设施技能（11个 v3.0）**：信息收集、漏洞评估、云安全审计、容器安全测试、移动应用测试、安全代码审查、应急响应、安全自动化、安全意识培训

**示例技能**：`cyberstrike-eino-demo/` — 满配示例（SKILL.md + scripts/ + references/ + assets/）

#### 技能包结构规范

```
Skills20260809/
├── skill-name/
│   ├── SKILL.md          # 必需：YAML Front Matter (name/description/version) + Markdown正文
│   ├── scripts/          # 可选：可执行脚本/payload/工具
│   ├── references/       # 可选：参考文档
│   ├── assets/           # 可选：静态资源
│   ├── FORMS.md          # 可选：检查清单表格
│   └── REFERENCE.md     # 可选：API参考
```

#### v3.0 优化亮点

- **结构升级**：每技能 13-18 章 + 注意事项，统一"概述→分章节→工具链→检查清单→修复建议→注意事项"范式
- **最新漏洞情报**：融入 2025-2026 高危 CVE（CVE-2025-1094、CVE-2025-66516、CVE-2026-22738、CVE-2026-47065、CVE-2026-56091、CVE-2026-54121 等）
- **AI大模型维度**：AI攻击面（LLM/Agent/MCP/向量库/RAG）、AI辅助攻防、AI安全
- **EDR对抗深化**：LOTL/无文件/内存执行、免杀C2、检测规避矩阵

### 📁 新增文件

```
Skills20260809/
├── README.md
├── api-security-testing/
├── business-logic-testing/
├── ci-cd-attack-testing/
├── cloud-security-audit/
├── command-injection-testing/
├── container-security-testing/
├── csrf-testing/
├── cyberstrike-eino-demo/
├── deserialization-testing/
├── fastjson-exploitation/
├── file-upload-testing/
├── idor-testing/
├── incident-response/
├── information-gathering/
├── intranet-penetration-testing/
├── ldap-injection-testing/
├── log4shell-exploitation/
├── mobile-app-security-testing/
├── network-penetration-testing/
├── secure-code-review/
├── security-automation/
├── security-awareness-training/
├── shiro-exploitation/
├── spring-exploitation/
├── sql-injection-testing/
├── ssrf-testing/
├── vulnerability-assessment/
├── xpath-injection-testing/
├── xss-testing/
├── xxe-injection-testing/
external/CyberStrikeAI/   # 子仓库: AIPentest/CyberStrikeAI (v1.7.18)
```

#### 子仓库集成：CyberStrikeAI

新增 `external/CyberStrikeAI` 子仓库 — [AIPentest/CyberStrikeAI](https://github.com/AIPentest/CyberStrikeAI) (v1.7.18)。

**项目简介**：AI 原生网络安全操作平台，将意图转化为受治理的执行、证据转化为操作记忆。基于 Go 构建，集成 Eino 驱动的 Agent、MCP 原生工具、RAG 知识库、可视化工作流和攻击链建模分析，用于授权安全操作。

**与主仓库的协同关系**：
- `Skills20260809/` 的 31 个技能包是为 CyberStrikeAI 框架设计的 Eino ADK 技能
- CyberStrikeAI 提供运行时（HTTP API on :8888），Skills20260809 提供技能内容
- 两者协同形成完整的 AI 渗透测试工作流

**更新文件**：
- `.gitmodules` — 新增 `external/CyberStrikeAI` 条目
- `submodule-paths.txt` — 新增路径
- `submodule-status.txt` — 新增状态记录
- `SUBMODULE_STRATEGY.md` — 目录结构与集成子仓库表更新

---

## [v4.2.12] - 2026-07-10

### 🚀 新增功能

#### 子仓库扩展
- 添加 `external/Claude-BugHunter` (71 skills, Bug Hunting & Red Team)
- 添加 `external/Anthropic-Cybersecurity-Skills` (817 skills, 29 安全领域)
- 更新 `ACKNOWLEDGEMENTS.md` 鸣谢文档

#### 子仓库管理体系
新增 3 个 GitHub Actions 工作流：

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| `submodule-health-check.yml` | 每天 06:00 | 检测 404/403 异常 |
| `submodule-sync.yml` | 每周一 08:00 | 自动同步 + PR合并 |
| `submodule-report.yml` | 每周一/四 10:00 | 生成状态报告 |

#### Agents 外部技能集成
- 新增 `EXTERNAL_SKILLS_ROUTING.md` — 900+ 技能路由指南
- 更新 `exploit_agent.md` — Bug Hunting / Red Team 技能引用
- 更新 `recon_agent.md` — Recon / OSINT 技能引用

### 🔧 修复

- `submodule-sync.yml` — 添加 PR/push 触发，自动合并逻辑
- `update-submodules.yml` — 统一工作流风格
- `submodule-report.yml` — 修复 YAML 语法问题

### 📁 新增文件

```
.github/workflows/submodule-health-check.yml
.github/workflows/submodule-sync.yml
.github/workflows/submodule-report.yml
EXTERNAL_SKILLS_ROUTING.md
ACKNOWLEDGEMENTS.md
external/Claude-BugHunter/
external/Anthropic-Cybersecurity-Skills/
```

---

## [v4.2.1] - 2026-05-29

### 🚀 新增功能

#### reverse-skill 子仓库集成
- 添加 `external/reverse-skill` (40 CTF场景, 20+ 专项技能)
- 包含 Burp MCP 扩展、工具链路由矩阵

#### CodeGraph 集成
- 添加 `vendor/codegraph` 子仓库
- ~35% 成本节省, ~70% 工具调用减少

#### 多层破限策略
- 新增 `.ctf/UNRESTRICTION_PROTOCOL.md`
- Layer 1-6 完整策略文档

### 📁 新增文件

```
.ctf/UNRESTRICTION_PROTOCOL.md
vendor/codegraph/
```

---

## [v4.2.0] - 2026-05-29

### 🚀 新增功能

#### RedTeam 模式与破限框架

**CTF/Sandbox 破限指令** — 多平台支持：

| 平台 | 破限文件 |
|------|----------|
| Codex | `.codex/instruction.md` |
| Claude Code | `.claude/REDTEAM.md` |
| Cursor | `.cursor/rules/redteam-mode.mdc` |
| Hermes | `.hermes/redteam-mode.md` |
| Trae | `.trae/REDTEAM_MODE.md` |
| OpenClaw | `.openclaw/REDTEAM.md` |

#### RedTeam 工具集
- 新增 `24-红蓝对抗-RedTeam/` 目录
- 15+ 红队工具自动安装脚本

#### CTF 模式指令集
- `.ctf/CTF_MODE.md` — CTF 模式核心指令
- `.ctf/REDTEAM.md` — RedTeam 执行指南
- `.ctf/AD_ATTACK.md` — AD 攻击链路

---

## [v4.1.0] - 2026-05-29

### 🚀 新增功能

#### Cursor IDE 支持
- `.cursor/AGENTS.md`
- `.cursor/rules/security-rules.mdc`
- `.cursor/rules/code-audit.mdc`
- `.cursor/mcp.json`

#### Claude Code 支持
- `CLAUDE.md` — 项目级指令
- `.claude/rules/framework-dev.md`
- `.claude/agents/security-auditor.md`

#### OpenAI Codex CLI 支持
- `AGENTS.md` — 项目级 Agent 指令
- `.codex/config.toml`

---

## [v4.0.0] - 2026-05-29

### 🚀 Major Features

#### 8-Stage Security Audit Pipeline
- Recon → Hunt → Validate → Gapfill → Dedupe → Trace → Feedback → Report
- SQLite 状态管理
- 预算控制 (`--max-cost-usd`)

#### MCP Service Integration
- `wxmini-server`: 微信小程序分析 (port 43827)
- `java-server`: Java 代码审计 (port 8082)
- `burp-bridge`: Burp Suite 集成 (port 8090)
- `kali-bridge`: Kali Linux 工具 (port 8081)

#### Specialized Audit Agents

**微信小程序审计** — 7-Agent 架构
- Decompiler, SecretScanner, EndpointMiner
- CryptoAnalyzer, VulnAnalyzer, Reporter

**Java 代码审计** — 5-stage 管道
- Info Gathering → Cross Analysis → Route Tracing
- Deep Analysis → Quality Check

#### Multi-Platform IDE 支持
- Trae, Hermes, OpenClaw, Cursor, Claude, Codex

---

## [v3.0.0] - 2026-05-20

### 初始发布

- 7 核心 Agent
- 39 安全模块
- Mission Control dashboard
- MCP 集成 Burp/Kali

---

*本文件已收录 v3.0.0 起的全部版本历史；逐版本快照与更早历史见 git tag（v4.2.26 ~ v4.3.11）及提交记录。*
