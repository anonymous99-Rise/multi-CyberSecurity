# multi-CyberSecurity v4.2.29

> AI驱动的网络安全技能框架 — 融合MITRE ATT&CK + NIST CSF标准

[![技能数量](https://img.shields.io/badge/skills-199-blue)](skills_index.json)
[![ATT&CK覆盖](https://img.shields.io/badge/ATT%26CK-97%20techniques-green)](mappings/attack-navigator-layer.json)
[![MIT License](https://img.shields.io/badge/license-Apache--2.0-yellow)](LICENSE)

## 核心能力

- **39个安全分类**，覆盖渗透测试、安全审计、应急响应、云安全、代码审计等全领域
- **MITRE ATT&CK** 标准化映射，147个skill已关联97个ATT&CK技术ID
- **NIST CSF** 全覆盖，每个skill均标注对应的CSF控制措施
- **YAML标准格式**，机器可读，便于AI Agent动态调用

## 目录结构

```
00-09/          信息搜集 · 漏洞扫描 · 漏洞利用
10-19/          权限提升 · 后渗透 · 横向移动 · 持久化
20-29/          痕迹清除 · 报告撰写 · 移动安全 · 区块链 · IoT
30-39/          SOC运营 · 威胁狩猎 · 数字取证 · 容器安全 · API安全
Skills20260809/ CyberStrikeAI v3.0 深度攻防专家技能包（31个技能包，兼容agentskills.io规范）
external/        外部子仓库（CyberStrikeAI 运行时、reverse-skill、AboutSecurity 等）
framework/      红队框架（jailbreak技能分级体系）
mappings/       ATT&CK Navigator可视化层
tools/          标准化脚本集
workflows/      多Agent工作流定义（web_pentest_flow.yaml等）
```

## CyberStrikeAI 技能包 (Skills20260809)

`Skills20260809/` 集成了 **CyberStrikeAI v3.0** 深度攻防专家技能包（By Tas9er），共 **31个技能包**，兼容 [agentskills.io 规范](https://agentskills.io/specification.md)，支持 Eino ADK 框架的 `skill("name")` 按需加载。

> 💡 **运行时**：技能包配套的 CyberStrikeAI 运行时已作为子仓库集成至 [external/CyberStrikeAI/](external/CyberStrikeAI)（[AIPentest/CyberStrikeAI](https://github.com/AIPentest/CyberStrikeAI) v1.7.18），提供 HTTP API（端口 8888）、Eino Agent、MCP 工具、RAG 知识库与可视化工作流。克隆时使用 `git clone --recursive` 拉取子仓库。

### 技能包分类

| 分类 | 数量 | 说明 |
|------|------|------|
| 核心漏洞测试 | 18 | SQL/XSS/SSRF/命令注入/XXE/文件上传/CSRF/IDOR/API/业务逻辑/LDAP/XPath/反序列化/Fastjson/Shiro/Spring/Log4Shell/网络渗透 (v3.0) |
| 基础设施/环境 | 11 | 信息收集/内网渗透/CI-CD攻击/漏洞评估/云安全/容器安全/移动安全/代码审查/应急响应/安全自动化/安全意识培训 |
| 示例/模板 | 1 | `cyberstrike-eino-demo/` — 满配示例（SKILL.md + scripts/ + references/ + assets/） |

### 技能包结构

```
skill-name/
├── SKILL.md          # 必需：YAML Front Matter (name/description/version) + Markdown正文
├── scripts/          # 可选：可执行脚本/payload/工具
├── references/       # 可选：参考文档
├── assets/           # 可选：静态资源
├── FORMS.md          # 可选：检查清单表格
└── REFERENCE.md     # 可选：API参考
```

### Eino ADK 快速调用

```bash
# 查看所有可用技能
curl http://localhost:8888/api/skills

# 查看技能摘要
curl http://localhost:8888/api/skills/sql-injection-testing?depth=summary

# 加载完整技能定义
curl http://localhost:8888/api/skills/sql-injection-testing?depth=full

# 访问技能包内脚本/资源
curl http://localhost:8888/api/skills/cyberstrike-eino-demo/scripts/check-env.sh
```

## 快速使用

```bash
# 搜索特定ATT&CK技术的相关skill
grep -l "T1059" */skills/*.md

# 验证所有skill的frontmatter格式
python3 tools/validate_skills.py

# 重新标准化skill格式
python3 tools/transform_skills.py

# 查看ATT&CK覆盖仪表盘
# 在 https://mitre-attack.github.io/attack-navigator/ 加载 mappings/attack-navigator-layer.json
```

## 格式标准

每个skill采用统一YAML frontmatter：

```yaml
---
name: skill-name-kebab-case
description: 简短描述（150-200字符）
domain: cybersecurity
subdomain: category-subdomain
tags:
  - technique
  - tool-name
version: '1.0.0'
author: multi-cybersecurity
license: Apache-2.0
nist_csf:
  - PR.AC-01
mitre_attack:
  - T1190
---
```

## 与源仓库的差异化

| 特性 | Anthropic-Cybersecurity-Skills | multi-CyberSecurity |
|------|-------------------------------|----------------------|
| 语言 | 英文 | 中文为主，标注英文术语 |
| 分类 | 扁平（~20类） | 层级（39类垂直分类） |
| Agent | 无 | 7个专用Agent + 8阶段pipeline |
| 框架 | 无 | 红队jailbreak分级框架 |
| NIST CSF | 部分 | 100%覆盖 |
| 索引 | JSON | JSON + Navigator Layer |
