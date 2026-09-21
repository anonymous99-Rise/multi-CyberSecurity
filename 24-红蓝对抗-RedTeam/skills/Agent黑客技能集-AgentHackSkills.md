---
name: agent-黑客技能集-agent-hack-skills
description: 这是一个面向 AI Agent 的全能黑客技能知识库，旨在赋予智能体执行专业级渗透测试、漏洞赏金和红队评估的能力。
domain: cybersecurity
subdomain: red-blue-team
tags:
    - 'agent-security'
    - 'automated-pentest'
    - 'red-teaming'
    - 'skill-library'
version: '1.0.0'
author: multi-cybersecurity
license: Apache-2.0
nist_csf:
    - 'ID.RA-01'
    - 'PR.PT-01'
mitre_attack:
    - T1595
    - T1190
    - T1068
---

# === 原始信息（向下兼容）===
# original_title: 🤖 Agent 黑客技能集 (Agent Hack Skills)
# original_category: 红蓝对抗
# original_category_en: RedBlueTeam
# original_difficulty: ★★★★★
# original_tools: HACK.SKILLS, yaklang, nuclei
# original_last_updated: 2026-05
# 🤖 Agent 黑客技能集 (Agent Hack Skills)

## 概述
这是一个面向 AI Agent 的全能黑客技能知识库，旨在赋予智能体执行专业级渗透测试、漏洞赏金和红队评估的能力。

## 核心能力

### 1. 全方位攻击面覆盖
- **Web & API 安全**：深度审计 OWASP Top 10 与 API 特定风险。
- **基础设施利用**：包含 Active Directory (AD) 攻击路径分析、横向移动与提权。
- **高级领域**：区块链/智能合约安全、AI/ML 与 LLM 安全审计。

### 2. 自动化实战流程
- **漏洞验证**：集成 Nuclei/Yaklang 等工具的自动化 PoC 验证。
- **数字取证**：支持攻击后的证据留存与分析。

## 常用工具
| 工具 | 用途 | 链接 |
|:---|:---|:---|
| yaklang | 国产自研安全 DSL | https://www.yaklang.io/ |
| HACK.SKILLS | 面向 Agent 的知识库 | https://github.com/yaklang/hack-skills |

## 参考资源
- [HACK.SKILLS README](https://github.com/yaklang/hack-skills/blob/main/README_CN.md)
- [Agentic Security Research](https://github.com/msitarzewski/agency-agents)
