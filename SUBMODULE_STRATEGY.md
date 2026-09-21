# 🔌 子仓库集成策略

> **核心理念**: 独立维护 + 按需协同 + 欢迎贡献 = 生态整合

## 设计原则

### 1. 独立性优先
- 子仓库拥有**独立的版本历史**、**独立维护者**
- 我们只引用（reference），不合并（merge）
- 子仓库可以自由演进，无需与我们同步

### 2. 协同但不耦合
- 通过**标准接口**调用子仓库能力
- 不修改子仓库源码（在 `external/` 内）
- 子仓库故障不影响主仓库核心功能

### 3. 欢迎贡献
- 开放的姿态欢迎优质安全工具/技能库
- 制定清晰的接入标准
- 持续贡献者可以申请成为维护者

---

## 目录结构规范

```
external/                    # 外部引用的独立项目
├── reverse-skill/           # 逆向/渗透技能路由包
├── agency-agents-zh/        # Agent 编排框架
├── AboutSecurity/           # 安全工具集合
├── CyberStrikeAI/           # AI原生安全操作平台 (Eino+MCP+RAG)
├── CkSKILLS/                # SRC 挖洞技能体系 (.agents/skills + hunts)
├── dsh-pentest/             # DeepSeek Harness 渗透模式插件 (pentest_*)
├── dsh-infinite-gen-4/      # DSH 红队评测破甲插件
├── dsh-redteam-model/       # DSH 红队模型研究（SeaOf0/dsh-redteam-model）
├── Claude-Red/              # Claude Skills 攻击性安全技能库（SnailSploit/Claude-Red）
└── cnvd-skill/              # CNVD 通用型未授权漏洞广扫便携包（sywinksvg/cnvd-skill）

vendor/                      # 内部使用的工具/库 (可修改)
├── codegraph/               # 代码分析工具
└── ...

scripts/                     # 仓库维护脚本 (我们维护)
├── build_graph.py           # 生成 framework/skill_graph.json
├── update_index.json.py     # 索引补丁脚本
├── version_manager.py       # 版本号管理
└── ...

.github/workflows/           # 子仓库自动化（以工作流承载，无独立 py 脚本）
├── submodule-sync.yml         # 每周同步子仓库到最新并自动开 PR
├── submodule-health-check.yml # 每日检查全部子仓库可达性（直接解析 .gitmodules）
├── submodule-report.yml       # 生成子仓库状态报告
└── update-submodules.yml      # 手动触发子仓库更新
```

---

## 新增子仓库标准

### ✅ 适合作为子仓库的场景

| 类型 | 示例 | 理由 |
|------|------|------|
| **独立的安全工具** | reverse-skill, Burp-extensions | 独立项目，有自己的社区 |
| **技能路由包** | CTF-Orchestrator | 提供方法论而非代码 |
| **工具链集合** | AboutSecurity | 聚合而非开发工具 |
| **研究项目** | 漏洞 PoC 库 | 保持更新但不需要合并 |

### ❌ 不适合作为子仓库的场景

| 类型 | 替代方案 |
|------|----------|
| 小工具/脚本 (< 100行) | 直接放入 `scripts/` |
| 临时性 POC | 放入 `exploits/` 目录 |
| 与我们深度耦合的代码 | 直接合并到主仓库 |
| 二进制文件/大型文件 | 使用 Git LFS 或外部存储 |

---

## 接入流程

### 提名阶段
1. 在 [Issues](https://github.com/anonymous99-Rise/multi-CyberSecurity/issues/new?template=submodule-nomination.md) 提交提名
2. 说明：
   - 项目名称和 URL
   - 与我们的协同场景
   - 维护状态和活跃度

### 评估标准
```
┌──────────────────────────────────────────────────┐
│  评估维度                                         │
├──────────────────────────────────────────────────┤
│  □ 授权协议兼容 (MIT/Apache/GPL 优先)            │
│  □ 维护活跃度 (最近 6 个月有提交)                │
│  □ 与现有能力的互补性                            │
│  □ API/接口的稳定性                             │
│  □ 社区认可度 (stars/watchers)                  │
└──────────────────────────────────────────────────┘
```

### 集成阶段
1. 创建 PR 添加 `.gitmodules` 条目：`git submodule add <url> external/<name>`
2. 放置到合适的目录 (`external/` 或 `vendor/`)
3. 更新文档清单：`EXTERNAL_SKILLS_ROUTING.md`（子仓库速查表）、`SUBMODULE_STRATEGY.md`（目录树 + 已集成表）、`submodule-paths.txt`、`submodule-status.txt`
4. 不需要登记检测列表 —— `submodule-health-check.yml` 直接解析 `.gitmodules`，每天自动覆盖全部子仓库
5. 前端首页 REPOSITORIES 卡片由 `web/scripts/sync-data.mjs` 解析 `.gitmodules` 自动生成；新子仓库的中文简介登记在该脚本的 `SUBMODULE_DESC`，未登记会回退显示 `owner/repo` 并在构建日志给出 WARN

---

## 协同调用模式

### 模式 1: 工具链引用 (Toolchain Reference)
```
我们的 CLI → 调用 external/<tool>/scripts/*.py
```
适用于：独立的安全工具，有自己的 CLI

### 模式 2: 技能路由 (Skill Routing)
```
用户任务 → skills/routing.md → external/reverse-skill/skills/routing.md
```
适用于：提供方法论和决策树的技能包

### 模式 3: 知识库集成 (Knowledge Integration)
```
Agent → 查询 external/<kb>/README.md → 获取知识
```
适用于：文档化的经验库、最佳实践

---

## 已集成子仓库

| 子仓库 | 类型 | 调用方式 | 状态 |
|--------|------|----------|------|
| reverse-skill | 技能路由包 | 路由矩阵引用 | ✅ 活跃 |
| agency-agents-zh | Agent 框架 | 协作参考 | ✅ 活跃 |
| AboutSecurity | 工具集合 | 工具索引 | ✅ 活跃 |
| CyberStrikeAI | AI安全操作平台 | Eino ADK + Skills20260809 技能包 | ✅ 活跃 |
| codegraph | 代码分析 | MCP 集成 | ✅ 活跃 |
| Claude-Red | Claude Skills 技能库 | `Skills/` 下 SKILL.md 按需加载 | ✅ 活跃 |
| cnvd-skill | 挖洞工作流工具包 | `skills/cnvd/SKILL.md` 手册 + `tools/scripts/` 脚本链 | ✅ 活跃 |

---

## 维护者职责

### 主仓库维护者
- 定期运行 `submodule-sync.yml` 同步更新（每周一 08:00 自动）
- 监控 `submodule-health-check.yml` 健康状态（每日 06:00 自动；异常时自动创建/更新带 `submodule-health` 标签的 Issue）
- 审核新的子仓库提名
- 查看 `submodule-sync-report.md` 与 `submodule-status.txt` 了解状态（由工作流刷新）

### 欢迎贡献者
- 发现新的优质安全工具 → 提交 Issue 提名
- 发现子仓库 404/403 → 提交 Issue 报告
- 有协同场景建议 → 提交 Discussion

---

## 相关文件

- [`.gitmodules`](.gitmodules) - 子仓库配置（19 个子仓库）
- [`submodule-sync-report.md`](submodule-sync-report.md) - 同步报告
- [`submodule-status.txt`](submodule-status.txt) / [`submodule-paths.txt`](submodule-paths.txt) - 状态与路径清单
- [`.github/workflows/`](.github/workflows/) - 子仓库管理工作流（sync / health-check / report / update）
- 健康检查报告为 CI Artifact：`submodule-health-report`（保留 30 天；异常时同步到 Issue）
