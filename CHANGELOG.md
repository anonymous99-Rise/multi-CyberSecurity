# Changelog

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

*旧版本历史见 [CHANGELOG_v3.md](CHANGELOG_v3.md), [CHANGELOG_v4.md](CHANGELOG_v4.md)*
