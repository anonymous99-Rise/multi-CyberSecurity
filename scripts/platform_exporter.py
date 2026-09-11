"""
platform_exporter.py - 技能库平台适配导出器

将 39 分类技能库导出为各 AI Agent 平台的配置文件：
- openclaw: SOUL.md / AGENTS.md / IDENTITY.md
- trae:     .traerules
- hermes:   instructions / rules / identity 目录结构
- dsh:      .dsh 配置包（AGENTS.md / RULES.md / preset 示例）

用法:
    python scripts/platform_exporter.py --platform dsh
    python scripts/platform_exporter.py --platform all
"""

import argparse
import os
import re


def parse_simple_yaml(yaml_str):
    data = {}
    for line in yaml_str.split('\n'):
        if ':' in line:
            key, val = line.split(':', 1)
            data[key.strip()] = val.strip().strip('"').strip("'")
    return data


def parse_md_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
    if match:
        frontmatter = parse_simple_yaml(match.group(1))
        body = match.group(2)
        return frontmatter, body
    return None, content


def iter_skill_files(skill_library_path):
    """遍历技能库，产出 (相对路径, frontmatter) 元组"""
    for root, dirs, files in os.walk(skill_library_path):
        # 跳过外部子仓库与模板输出目录
        dirs[:] = [d for d in dirs if d not in ('external', 'vendor', 'templates', '.git')]
        if 'skills' in dirs:
            skill_dir = os.path.join(root, 'skills')
            for f in os.listdir(skill_dir):
                if f.endswith('.md'):
                    file_path = os.path.join(skill_dir, f)
                    meta, _ = parse_md_file(file_path)
                    rel = os.path.relpath(file_path, skill_library_path)
                    yield rel, meta


def generate_openclaw_manifests(skill_library_path, output_path):
    # Create OpenClaw specific files
    soul_content = "# Security Expert Soul\n\nYou are a professional Cyber Security Specialist and Pen-tester..."
    agents_content = "# Security Capabilities\n\n"
    identity_content = "# Security Agent Identity\n\nThis agent is equipped with a comprehensive Cyber Security Skill library."

    for root, dirs, files in os.walk(skill_library_path):
        dirs[:] = [d for d in dirs if d not in ('external', 'vendor', 'templates', '.git')]
        if 'skills' in dirs:
            skill_dir = os.path.join(root, 'skills')
            for f in os.listdir(skill_dir):
                if f.endswith('.md'):
                    meta, body = parse_md_file(os.path.join(skill_dir, f))
                    if meta:
                        agents_content += f"## {meta.get('title')}\n"
                        agents_content += f"**Category**: {meta.get('category')}\n"
                        agents_content += f"**Tools**: {meta.get('tools')}\n\n"

    os.makedirs(output_path, exist_ok=True)
    with open(os.path.join(output_path, 'SOUL.md'), 'w', encoding='utf-8') as f:
        f.write(soul_content)
    with open(os.path.join(output_path, 'AGENTS.md'), 'w', encoding='utf-8') as f:
        f.write(agents_content)
    with open(os.path.join(output_path, 'IDENTITY.md'), 'w', encoding='utf-8') as f:
        f.write(identity_content)


def generate_trae_rules(skill_library_path, output_file):
    rules = "# multi-CyberSecurity Rules for Trae\n\n"
    rules += "When performing security tasks, refer to the following skill library:\n\n"

    for root, dirs, files in os.walk(skill_library_path):
        dirs[:] = [d for d in dirs if d not in ('external', 'vendor', 'templates', '.git')]
        if 'skills' in dirs:
            skill_dir = os.path.join(root, 'skills')
            for f in os.listdir(skill_dir):
                if f.endswith('.md'):
                    meta, _ = parse_md_file(os.path.join(skill_dir, f))
                    if meta:
                        rel = os.path.relpath(os.path.join(skill_dir, f), skill_library_path)
                        rules += f"- **{meta.get('title')}**: Path: `{rel}`\n"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(rules)


def generate_hermes_manifests(skill_library_path, output_path):
    """导出 Hermes 平台配置 (instructions/rules/identity)"""
    instructions = (
        "# multi-CyberSecurity Instructions for Hermes\n\n"
        "## Mission Context\n\n"
        "You are working on multi-CyberSecurity, an AI-powered cybersecurity agent framework. "
        "Assist security professionals with authorized penetration testing, vulnerability assessment, "
        "and security research.\n\n"
        "## Skill Library\n\n"
        "Load specialist skills on demand via agent handoff. Available skills:\n\n"
    )
    for rel, meta in iter_skill_files(skill_library_path):
        if meta:
            instructions += f"- **{meta.get('title', rel)}**: `{rel}`\n"

    rules = (
        "# Security-First Coding Rules\n\n"
        "1. Verify authorization before every action.\n"
        "2. Never generate ransomware, malware, or weaponized exploits.\n"
        "3. Never exfiltrate sensitive data.\n"
        "4. All PoC code must include safety checks.\n"
        "5. Destructive operations require explicit consent.\n"
    )
    identity = (
        "# multi-CyberSecurity Agent Identity\n\n"
        "Professional, cautious, defensive-minded, ethical. "
        "Find vulnerabilities to fix them, not to exploit them.\n"
    )

    os.makedirs(output_path, exist_ok=True)
    for name, content in (('instructions.md', instructions),
                          ('rules.md', rules),
                          ('identity.md', identity)):
        with open(os.path.join(output_path, name), 'w', encoding='utf-8') as f:
            f.write(content)


def generate_dsh_manifests(skill_library_path, output_path):
    """导出 DeepSeek Harness (DSH) 平台配置包

    产出与仓库内 .dsh/ 同构的最小配置包，可放入 DSH profile / 项目根使用：
    - AGENTS.md   指挥官 + 执行子代理定义 + 技能路由
    - RULES.md    分层安全规则
    - preset.yml  preset 元数据示例
    """
    agents = (
        "# multi-CyberSecurity Agent Definitions for DeepSeek Harness (DSH)\n\n"
        "> commander（decision agent）建 goal/intent 并委派；"
        "spawn/fork 执行子代理通过 pentest_submit 回写已确认结果。\n\n"
        "## Agent 编队\n\n"
        "| Agent | 职责 |\n"
        "|-------|------|\n"
        "| Coordinator | 渗透指挥官：goal/intent、委派、报告 |\n"
        "| ReconAgent | 资产测绘、指纹、JS/密钥提取 |\n"
        "| VulnerabilityHunter | 漏洞验证与 PoC（含安全检查） |\n"
        "| ValidatorAgent | 复现确认、误报排除（95%+ 置信度） |\n"
        "| AdvisorAgent | 风险优先级、修复路线图 |\n"
        "| BlueTeamAgent | 加固基线、检测规则 |\n"
        "| LibrarianAgent | 模式沉淀、技能维护 |\n\n"
        "## 技能路由（按需经 tool-skill 加载）\n\n"
    )
    for rel, meta in iter_skill_files(skill_library_path):
        if meta:
            agents += f"- **{meta.get('title', rel)}**: `{rel}`\n"

    agents += (
        "\n## 子代理委派约束\n\n"
        "- intentId 必须是 pentest_add_intent 实际返回的 ID，禁止占位符\n"
        "- 执行子代理禁止再委派、禁止建 goal/intent/report\n"
        "- finding 必须含 title/severity/reproducibleSteps（≥1 条）\n"
        "- 每批独立、已确认结果立即提交，不重复提交\n"
        "- 提交后回复仅含结论、证据摘要、提交计数\n"
    )

    rules = (
        "# DeepSeek Harness (DSH) Coding and Security Rules\n\n"
        "## Tier 1: 绝对规则\n"
        "- 任何动作前验证授权（pentest_add_goal.authorization 写实）\n"
        "- 不做破坏性操作 / 数据外泄 / DoS / scope 外 pivot\n"
        "- 客户信息绝对保密\n\n"
        "## Tier 2: DSH 运行时规则\n"
        "- 执行型子代理禁止建 goal/intent、禁止再委派\n"
        "- 只引用工具返回的真实 ID，不臆造证据/资产/漏洞\n"
        "- finding 门禁：reproducibleSteps >= 1\n"
        "- 渗透记录按单会话作用域；新 engagement 新建 goal\n\n"
        "## Tier 3: 质量规则\n"
        "- 每个动作可复现、可审计；Critical/High 要求 95%+ 置信度\n"
        "- 大输出落盘，回复只给高信号摘要（简体中文）\n"
    )

    preset = (
        "# DSH preset 元数据示例\n"
        "# 完整组合行（persona / tool-bash / tool-fs / skill-filesystem /\n"
        "# tool-subagent / pentest）参考 external/dsh-pentest/preset/pentest/agent.cordis.yml\n"
        "name: 网络安全评估\n"
        "description: multi-CyberSecurity 8 阶段审计流水线（授权范围使用）\n"
    )

    os.makedirs(output_path, exist_ok=True)
    for name, content in (('AGENTS.md', agents),
                          ('RULES.md', rules),
                          ('preset.yml', preset)):
        with open(os.path.join(output_path, name), 'w', encoding='utf-8') as f:
            f.write(content)


# 平台导出注册表：platform -> (callable, 默认输出路径)
EXPORTERS = {
    'openclaw': (generate_openclaw_manifests, 'templates/openclaw'),
    'trae': (generate_trae_rules, '.traerules'),
    'hermes': (generate_hermes_manifests, 'templates/hermes'),
    'dsh': (generate_dsh_manifests, 'templates/dsh'),
}


def export_platform(platform, project_root='.'):
    if platform == 'all':
        for name in EXPORTERS:
            export_platform(name, project_root)
        return

    if platform not in EXPORTERS:
        raise SystemExit(f"Unsupported platform: {platform}. "
                         f"Choose from: {', '.join(EXPORTERS)} or 'all'")

    func, output_path = EXPORTERS[platform]
    func(project_root, output_path)
    print(f"[+] Exported '{platform}' manifests -> {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export skill library to AI platform configs")
    parser.add_argument("--platform", default="all",
                        choices=[*EXPORTERS.keys(), "all"],
                        help="Target platform (default: all)")
    parser.add_argument("--root", default=".", help="Project root (default: current dir)")
    args = parser.parse_args()

    export_platform(args.platform, args.root)
    print("Exported platform-specific manifests.")
