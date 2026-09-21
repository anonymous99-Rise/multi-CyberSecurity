# 🔌 外部技能路由 (External Skills Routing)

> 本文档定义如何按需调用 `external/` 子仓库中的技能模块。

> ⚠️ **口径说明**：本页的技能数量均为**子仓库上游口径**，**不计入** `index.json` / 站点的 199 个自有技能。
> `external/` 下的仓库以 git submodule 引用（只固定 commit，不复制内容、不并入 `skills_index.json`）；
> 需要新增自有技能请放到 `NN-*/skills/` 并重新生成索引。

---

## 路由总览

```
用户任务 → 路由判断 → 外部子仓库 → 技能模块 → 执行
```

---

## 子仓库速查表

> 下表的**数量为按 `.gitmodules` 固定 commit 实测**：`SKILL.md` 数（技能库形态）与 `.md` 总数（知识库形态），
> 权威来源 [`external-skills.json`](external-skills.json)
> （由 [`tools/external_skills_manifest.py`](tools/external_skills_manifest.py) 生成；站点每次部署与每周子仓库报告 PR 都会刷新）。
> 合计：**21 个子仓库 / 11 个含 SKILL.md / 1,427 个外部 SKILL.md / 9,000+ 个 markdown** —— 全部**不计入**自有技能的 199。

| 子仓库 | 路径 | SKILL.md / .md | 主要用途 |
|--------|------|----------------|----------|
| **Anthropic-Cybersecurity-Skills** | `external/Anthropic-Cybersecurity-Skills/` | 820 / 2,588 | 全面安全评估, 29个领域 |
| **AboutSecurity** | `external/AboutSecurity/` | 249 / 1,353 | 安全工具集合（含大量 SKILL.md 形态的工具条目） |
| **reverse-skill** | `external/reverse-skill/` | 89 / 445 | 逆向工程, CTF, 渗透测试 |
| **Claude-BugHunter** | `external/Claude-BugHunter/` | 83 / 187 | Bug Hunting, Red Team, 漏洞挖掘 |
| **Claude-Red** | `external/Claude-Red/` | 79 / 84 | Claude Skills 攻击性安全技能库（23 大类：SQLi/AD/EDR 规避/exploit-dev/云/容器/取证等；`Skills/` 按需加载 + `claude-skills.json` 索引） |
| **dsh-redteam-model** | `external/dsh-redteam-model/` | 58 / 1,085 | DSH 红队模型研究：提示词工程 + 防御规避 + 场景构建 |
| **CyberStrikeAI** | `external/CyberStrikeAI/` | 24 / 141 | AI 原生安全操作平台（Eino + MCP + RAG） |
| **CkSKILLS** | `external/CkSKILLS/` | 21 / 36 | SRC 挖洞技能体系（JS 分析/认证鉴权/注入/WAF 绕过/小程序/APK 逆向）+ `hunts/` 线索板 |
| **codegraph** | `vendor/codegraph/` | 2 / 93 | 代码分析工具（MCP 集成） |
| **redteam-mcp** | `vendor/redteam-mcp/` | 1 / 12 | 红队 Agent MCP |
| **cnvd-skill** | `external/cnvd-skill/` | 1 / 11（+ 9 脚本） | CNVD 通用型未授权漏洞广扫便携包：`skills/cnvd/SKILL.md` 全流程手册 + `tools/scripts/` 测绘→只读验证→查重抽验（零依赖，含 28 条端点字典） |
| **Des-CTF-Knowledge** | `external/Des-CTF-Knowledge/` | 0 / 1,209 | CTF 知识库：12 大 Web 漏洞深度文 + 历年大赛 WP 集合 + Payload 速查 + AI/RAG 离线知识库 |
| **Vulnerability-Wiki-PoC** | `external/Vulnerability-Wiki-PoC/` | 0 / 896 | 漏洞 PoC 与知识条目 |
| **owasp-top10** | `standards/owasp-top10/` | 0 / 711 | OWASP Top 10 标准（含多语言译本） |
| **agency-agents / agency-agents-zh** | `external/agency-agents*/` | 0 / 325、327 | Agent 编排框架（agent 定义 Markdown，非 SKILL.md 形态） |
| **Desinter_scan** | `external/Desinter_scan/` | 0 / 3（22 collector） | AI 自动化信息收集：22 个并发 collector（subfinder/nuclei/httpx/nmap/gau/waybackurls…）+ Claude 6 维度评分排序 |
| **dsh-pentest** | `external/dsh-pentest/` | 0 / 10（8 工具） | DSH 渗透模式插件：`pentest_*` 工具链 + sqlite 会话 + Web UI |
| **dsh-infinite-gen-4** | `external/dsh-infinite-gen-4/` | 0 / 6（插件） | DSH 红队评测破甲插件：零工具面 + 双层系统提示词注入 |
| **cve_monitor / burp-mcp** | `external/cve_monitor/`、`vendor/burp-mcp/` | 0 / 6、1 | CVE 监控 / Burp MCP，均非 SKILL.md 形态 |

---

## 按任务类型路由

### 🎯 Bug Hunting / 漏洞挖掘

**路由到**: `external/Claude-BugHunter/skills/`

```
漏洞类型 → hunt-<type> 技能
```

| 漏洞类型 | 技能路径 | 说明 |
|----------|----------|------|
| API 错误配置 | `hunt-api-misconfig/` | API 安全挖掘 |
| 认证绕过 | `hunt-auth-bypass/` | 认证漏洞挖掘 |
| 暴力破解 | `hunt-brute-force/` | 暴力攻击挖掘 |
| 业务逻辑 | `hunt-business-logic/` | 业务逻辑漏洞 |
| CORS 配置错误 | `hunt-cors/` | CORS 漏洞挖掘 |
| 序列化漏洞 | `hunt-deserialization/` | 反序列化漏洞 |
| SSRF | `hunt-ssrf/` | SSRF 漏洞挖掘 |
| SSTI | `hunt-ssti/` | 模板注入挖掘 |
| SQL注入 | `hunt-sql-injection/` | SQL注入挖掘 |
| XSS | `hunt-xss/` | 跨站脚本挖掘 |
| OAuth 安全 | `hunt-oauth/` | OAuth漏洞挖掘 |

**Bug Bounty 方法论**: `bug-bounty/` 目录
- `bugcrowd-reporting/` - BugCrowd 报告模板
- `bb-methodology/` - 方法论框架
- `bb-local-toolkit/` - 本地工具链

---

### 🔴 Red Team / 红队攻击

**路由到**: `external/Claude-BugHunter/skills/`

| 攻击目标 | 技能路径 | 说明 |
|----------|----------|------|
| M365/Entra ID | `cloud-iam-deep/` | 云身份攻击 |
| 企业 VPN | `enterprise-vpn-attack/` | VPN 攻击链 |
| 初始访问 | `apk-redteam-pipeline/` | APK 红队流水线 |
| 凭证安全 | `evidence-hygiene/` | 凭证处理 |

---

### 🔬 逆向工程 / Reversing

**路由到**: `external/reverse-skill/skills/`

| 目标类型 | 技能路径 | 说明 |
|----------|----------|------|
| APK 逆向 | `apk-reverse/` | Android 逆向 |
| IDA Pro | `ida-reverse/` | IDA 逆向分析 |
| JavaScript 逆向 | `js-reverse/` | JS 加密分析 |
| .NET 逆向 | `dotnet-reverse/` | .NET 逆向 |
| 固件分析 | `firmware-pentest/` | 固件安全 |
| 恶意软件 | `malware-analysis/` | 恶意软件分析 |
| 补丁比对 | `patch-diff-exploit/` | 补丁分析利用 |

---

### 🏆 CTF / 竞赛

**路由到**: `external/reverse-skill/CTF-Sandbox-Orchestrator/`

| 场景类型 | 路径 | 说明 |
|----------|------|------|
| Android Hooking | `competition-android-hooking/` | 安卓hooking |
| 容器逃逸 | `competition-container-runtime/` | 容器安全 |
| 内核漏洞 | `competition-kernel-container-escape/` | 内核利用 |
| Kerberos 攻击 | `competition-kerberos-delegation/` | AD攻击 |
| 云平台 | `competition-agent-cloud/` | 云安全挑战 |
| 固件安全 | `competition-firmware-layout/` | 固件CTF |
| 取证分析 | `competition-forensic-timeline/` | 取证分析 |

---

### 🛡️ 安全评估 / 全面审计

**路由到**: `external/Anthropic-Cybersecurity-Skills/skills/`

| 领域 | 技能前缀 | 说明 |
|------|----------|------|
| Web 安全 | `analyzing-*` | Web 漏洞分析 |
| AD 安全 | `analyzing-active-directory-*` | AD 攻击分析 |
| 云安全 | `analyzing-aws-*`, `analyzing-azure-*` | 云安全审计 |
| 移动安全 | `analyzing-android-*`, `analyzing-ios-*` | 移动端安全 |
| 恶意软件 | `analyzing-malware-*` | 恶意软件分析 |
| 取证 | `analyzing-disk-*`, `analyzing-memory-*` | 数字取证 |
| 网络安全 | `analyzing-network-*` | 网络流量分析 |

---

## 调用示例

### 在 Agent 中调用外部技能

```markdown
# 调用示例: Bug Bounty 漏洞挖掘

当用户请求 Bug Bounty 测试时:

1. 首先加载方法论:
   - 参考: `external/Claude-BugHunter/skills/bb-methodology/SKILL.md`
   - 参考: `external/Claude-BugHunter/skills/bug-bounty/SKILL.md`

2. 根据目标类型路由:
   - API 测试 → `external/Claude-BugHunter/skills/hunt-api-misconfig/`
   - 认证测试 → `external/Claude-BugHunter/skills/hunt-auth-bypass/`
   - XSS 测试 → `external/Claude-BugHunter/skills/hunt-xss/`

3. 使用工具链:
   - 本地工具: `external/Claude-BugHunter/skills/bb-local-toolkit/`
   - Burp 集成: Burp MCP (port 8090)
```

---

## 工具链集成

### Claude-BugHunter 工具
```
external/Claude-BugHunter/
├── cbh/              # CLI 工具
├── commands/         # 命令集
├── engine/           # 引擎
├── eval/             # 评估框架
└── scripts/          # 脚本
```

### reverse-skill 工具
```
external/reverse-skill/
├── burp-mcp-full/    # Burp MCP 扩展
├── kali/            # Kali 工具链
└── scripts/         # 辅助脚本
```

---

## 🧩 DSH (DeepSeek Harness) 平台插件路由

当运行环境为 DSH 时，除文件型技能路由外，还可通过 Cordis 插件链使用专用能力。
完整安装与 profile 配置见 [.dsh/HARNESS.md](.dsh/HARNESS.md)。

| 场景 | 路由目标 | 加载方式 |
|------|----------|----------|
| SRC/众包挖洞方法论、线索板跟踪 | `external/CkSKILLS/.agents/skills/`、`hunts/` | DSH skill-filesystem 行按目录加载 |
| 渗透任务全链路记录（goal→intent→fact→finding→report） | `external/dsh-pentest/` | `dsh plugin --profile web add` 安装 bundle；`pentest_*` 工具 + pentest preset |
| 红队模型破甲评测 / 双层提示词注入研究 | `external/dsh-infinite-gen-4/` | `install.ps1` / `install.sh` 安装（仅授权评测环境） |
| 红队模型研究（提示词工程 + 防御规避 + 场景构建） | `external/dsh-redteam-model/` | DSH skill-filesystem 或直接引用 |

DSH 运行时纪律：commander（decision agent）建 goal/intent 并委派；spawn/fork 执行子代理
只回写 `pentest_submit` 已确认结果，引用真实 ID，finding 必须含 `reproducibleSteps`。

---

## 路由优先级

当多个子仓库提供相似技能时，按以下优先级:

1. **内部 skills/** - 核心技能（最高优先级）
2. **Claude-BugHunter** - Bug Hunting 专项
3. **CkSKILLS** - SRC 挖洞专项（DSH 环境可由 skill-filesystem 直连）
4. **Anthropic-Cybersecurity-Skills** - 全面覆盖
5. **reverse-skill** - 逆向/CTF 专项
6. **AboutSecurity** - 工具集成

---

## 更新机制

- 子仓库通过 `submodule-sync.yml` 自动同步
- 路由文档由 `submodule-report.yml` 定期更新
- 手动更新: `git submodule update --remote`

---

*最后更新: 2026-09-11*
