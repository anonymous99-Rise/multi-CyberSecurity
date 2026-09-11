# DeepSeek Harness (DSH) Platform Configuration

> multi-CyberSecurity × DeepSeek Harness 平台适配包

## 什么是 DeepSeek Harness

DeepSeek Harness（命令行简称 `dsh`）是基于 **Cordis 组合式架构** 的 AI Agent 运行时，面向 DeepSeek-V4.1 / V4-Pro / V4-Flash 等模型，提供：

- **Preset（预设）体系**：通过 `preset.yml` + `agent.cordis.yml` 以组合行（composition rows）方式声明 Agent 人格、工具、技能、子代理与工作流
- **Bundle 插件**：`package.json`（`dsh.bundle.patch` / `dsh.client`）+ `cordis.patch.yml`，使用 `dsh plugin add` 或 `dsh://plugin/install` 协议一键安装
- **System Prompt 段注入**：插件可按 `order` 向系统提示词注入命名段落（如 `pentest:protocol`）
- **子代理委派**：`subagent`（spawn/fork）/ codex / claude-code provider，支持父子代理与执行型子代理
- **技能文件系统**：`@deepseek-ai/dsh-skill-filesystem` 自动发现工作区本地 Skill，`tool-skill` 负责目录与按需加载
- **会话投影（Session Projection）**：插件可向 Web UI 注册实时投影单元（如渗透探索链路图）

## 文件说明

| 文件 | 作用 |
|------|------|
| `AGENTS.md` | DSH 场景下的 Agent 定义（指挥官 + 执行子代理 + 专项审计代理） |
| `IDENTITY.md` | Agent 身份、价值观与边界 |
| `RULES.md` | 分层安全规则与编码约束（对应 Cordis 组合行的人工约束） |
| `REDTEAM.md` | CTF/授权演练的 RedTeam 模式指令（中文直出、高信号输出） |
| `HARNESS.md` | DSH 专属集成指南：profile、preset、插件安装、与三个 DSH 子仓库的对接 |

## 快速使用

```bash
# 1. 克隆时携带子仓库（含 DSH 插件）
git clone --recursive <repo>

# 2. 安装 DSH 渗透模式插件（bundle）
dsh plugin --profile web add https://github.com/howmp/dsh-pentest/releases/latest/download/dsh-pentest.tar.gz

# 3. 或从本仓库子仓库本地安装
dsh plugin --profile web add file:./external/dsh-pentest
# 无限四代红队插件：执行其安装脚本
pwsh ./external/dsh-infinite-gen-4/install.ps1   # Windows
bash ./external/dsh-infinite-gen-4/install.sh    # Linux/macOS
```

详见 [HARNESS.md](HARNESS.md)。

## 与其他平台配置包的关系

`.dsh/` 与 `.hermes/`、`.openclaw/`、`.trae/` 同级，是 multi-CyberSecurity 的**平台适配层**：同一份 39 分类技能库与 8 阶段审计流水线，按各平台的加载约定提供不同的入口形态。DSH 的特点是插件/preset 化程度最高——除本配置包外，还可通过 `external/dsh-pentest` 与 `external/dsh-infinite-gen-4` 获得**可安装的运行时插件**。

## Usage

These files are loaded when working with this project inside DeepSeek Harness:
place or reference them from a DSH profile / preset, or copy into your DSH project root.
