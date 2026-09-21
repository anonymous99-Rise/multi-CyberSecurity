#!/usr/bin/env python3
"""
multi-CyberSecurity skill 格式标准化脚本
"""
import os, re, json, yaml
from pathlib import Path

SUBDOMAIN_MAP = {
    "信息搜集": "reconnaissance",
    "漏洞扫描": "vulnerability-scanning",
    "漏洞利用": "exploitation",
    "权限提升": "privilege-escalation",
    "后渗透": "post-exploitation",
    "横向移动": "lateral-movement",
    "持久化": "persistence",
    "痕迹清除": "covering-tracks",
    "报告撰写": "reporting",
    "移动安全": "mobile-security",
    "无线安全": "wireless-security",
    "代码审计": "code-audit",
    "逆向工程": "reverse-engineering",
    "安全审计": "security-audit",
    "应急响应": "incident-response",
    "大模型安全": "llm-security",
    "云安全": "cloud-security",
    "安全开发运维": "devsecops",
    "工控安全": "ics-ot-security",
    "区块链安全": "blockchain-web3-security",
    "物联网安全": "iot-security",
    "数据安全与隐私": "data-security-privacy",
    "社会工程学": "social-engineering",
    "红蓝对抗": "red-blue-team",
    "供应链安全": "supply-chain-security",
    "漏洞管理": "vulnerability-management",
    "操作系统安全": "os-security",
    "威胁狩猎": "threat-hunting",
    "威胁情报": "threat-intelligence",
    "数字取证": "digital-forensics",
    "SOC运营": "soc-operations",
    "身份访问管理": "iam",
    "容器安全": "container-security",
    "API安全": "api-security",
    "密码学与PKI": "cryptography-pki",
    "零信任架构": "zero-trust",
    "端点安全": "endpoint-security",
    "勒索软件防御": "ransomware-defense",
    "安全治理合规": "governance-compliance",
}

ATTACK_DB = {
    "dns-enumeration": ["T1106", "T1482"],
    "active-recon": ["T1595", "T1596"],
    "subdomain-discovery": ["T1482", "T1596"],
    "tech-stack-fingerprint": ["T1592"],
    "osint-search": ["T1593", "T1594"],
    "passive-recon": ["T1593", "T1596"],
    "social-engineering-info": ["T1598", "T1597"],
    "web-vuln-scan": ["T1518", "T1526"],
    "network-vuln-scan": ["T1526"],
    "config-audit-scan": ["T1482"],
    "database-assessment": ["T1505"],
    "ai-agent-vuln-scan": ["T1595"],
    "sql-injection": ["T1505"],
    "xss-exploitation": ["T1505"],
    "command-injection": ["T1059"],
    "file-inclusion": ["T1505"],
    "ssrf": ["T1505"],
    "auth-bypass": ["T1078"],
    "web-exploitation": ["T1505"],
    "metasploit": ["T1059"],
    "ai-agent-exploitation": ["T1595"],
    "linux-priv-esc": ["T1068", "T1548"],
    "windows-priv-esc": ["T1068", "T1548"],
    "kernel-service-priv-esc": ["T1068"],
    "credential-theft": ["T1003"],
    "info-gathering-data-exfil": ["T1041", "T1567"],
    "credential-dumping-pth": ["T1003"],
    "remote-control-shell": ["T1059"],
    "keylogging-screen-capture": ["T1056"],
    "psexec-wmi": ["T1021"],
    "internal-proxy-tunnel": ["T1570", "T1572"],
    "lateral-movement": ["T1021", "T1570"],
    "bootkit-firmware-persistence": ["T1542", "T1019"],
    "office-persistence": ["T1137"],
    "boot-logon-autostart": ["T1547", "T1037"],
    "account-persistence": ["T1098"],
    "amsi-bypass-edr-evasion": ["T1562"],
    "obfuscation-anti-analysis": ["T1027"],
    "process-injection": ["T1055"],
    "android-security-test": ["T1485", "T1629"],
    "ios-security-test": ["T1485", "T1629"],
    "wifi-security-audit": ["T1200"],
    "dynamic-debug-analysis": ["T1629"],
    "malware-analysis": ["T1629"],
    "static-reverse-analysis": ["T1629"],
    "cloud-security-audit": ["T1526"],
    "container-security-audit": ["T1611"],
    "linux-gun": ["T1016", "T1033"],
    "containment-eradication": ["T1484"],
    "cloud-incident-response": ["T1526"],
    "log-collection-analysis": ["T1074"],
    "network-traffic-analysis": ["T1041"],
    "ai-supply-chain-security": ["T1195"],
    "software-supply-chain-security": ["T1195"],
    "aws-security-assessment": ["T1526"],
    "azure-security-assessment": ["T1526"],
    "gcp-security-assessment": ["T1526"],
    "cloud-iam-audit": ["T1526"],
    "cloud-storage-security": ["T1526"],
    "cloud-network-waf": ["T1526"],
    "multi-cloud-security": ["T1526"],
    "serverless-security": ["T1526"],
    "cicd-pipeline-security": ["T1071"],
    "dast": ["T1505"],
    "iac-security": ["T1526"],
    "sast": ["T1505"],
    "plc-rtu-security-testing": ["T0886"],
    "scada-security-assessment": ["T0812"],
    "industrial-firewall-segmentation": ["T0814"],
    "ics-incident-response": ["T0812"],
    "ics-network-protocol-security": ["T0870"],
    "firmware-reverse-engineering": ["T1542"],
    "wireless-protocol-security": ["T1200"],
    "iot-communication-security": ["T1542"],
    "embedded-hardware-security": ["T1542"],
    "smart-home-connected-vehicle-security": ["T1542"],
    "iot-platform-cloud-security": ["T1526"],
    "data-loss-prevention": ["T1041"],
    "database-security-encryption": ["T1485"],
    "security-awareness-assessment": ["T1598"],
    "physical-social-engineering": ["T1189"],
    "vishing-testing": ["T1598"],
    "phishing-infrastructure": ["T1566"],
    "phishing-simulation": ["T1566"],
    "sbom-generation": ["T1195"],
    "code-signing-integrity": ["T1195"],
    "supply-chain-attack-response": ["T1195"],
    "third-party-vendor-risk": ["T1195"],
    "dependency-license-compliance": ["T1195"],
    "linux-hardening-baseline": ["T1068"],
    "linux-attack-persistence": ["T1547"],
    "macos-security-hardening": ["T1068"],
    "windows-hardening-baseline": ["T1068"],
    "windows-attack-lateral-movement": ["T1021"],
    "mitre-attack-hunting": ["T1046"],
    "sigma-rule-engineering": ["T1059"],
    "threat-hunting-methodology": ["T1046"],
    "traffic-log-anomaly-detection": ["T1041"],
    "linux-digital-forensics": ["T1003", "T1074"],
    "windows-digital-forensics": ["T1003", "T1074"],
    "memory-forensics-volatility": ["T1003"],
    "browser-email-forensics": ["T1530"],
    "disk-imaging-evidence-acquisition": ["T1005"],
    "siem-alert-correlation": ["T1041"],
    "ad-security-attack-path-analysis": ["T1098", "T1484"],
    "privileged-access-management": ["T1098"],
    "cloud-iam-federation": ["T1526"],
    "kubernetes-rbac-security-policy": ["T1611"],
    "container-runtime-security-falco": ["T1611"],
    "container-escape-detection-defense": ["T1611"],
    "container-image-security-scanning": ["T1611"],
    "api-auth-authorization-security": ["T1505"],
    "graphql-microservice-api-security": ["T1505"],
    "owasp-api-security-testing": ["T1505"],
    "tlsssl-security-configuration-audit": ["T1043"],
    "edr-deployment-detection-rules": ["T1041"],
    "fileless-malware-lolbins-detection": ["T1055"],
    "mobile-device-security-mdm": ["T1485"],
    "ransomware-incident-response-recovery": ["T1486"],
    "ransomware-attack-chain-analysis-detection": ["T1486"],
    "anti-ransomware-hardening-backup": ["T1486"],
}


def parse_frontmatter(content):
    m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return None, content
    try:
        fm = yaml.safe_load(m.group(1))
        body = content[len(m.group(0)):].lstrip('\n')
        return fm, body
    except Exception:
        return None, content


def build_name(title):
    t = re.sub(r'[^\w\s-]', ' ', title)
    t = re.sub(r'\s*\([^)]*\)', '', t)
    t = t.strip()
    return '-'.join(t.lower().split())


def extract_description(body):
    for line in body.split('\n'):
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('```') and len(line) > 15:
            return line[:200]
    return ""


def infer_attack(filename):
    techniques = []
    name_lower = filename.lower()
    for key, tids in ATTACK_DB.items():
        if key in name_lower:
            for t in tids:
                if t not in techniques:
                    techniques.append(t)
    return techniques


def yaml_str(s, indent=0):
    """Safe YAML string quoting for values with special chars."""
    s = str(s)
    # If it has YAML-special chars (* : - > | # @ ! % & ' " ` , [ ] { }), quote it
    if any(c in s for c in '*:#>|[],{}!%&\'"@`-'):
        # Use single-quote, escape embedded single quotes by doubling
        return "'" + s.replace("'", "''") + "'"
    # If it looks like a YAML keyword or is empty-ish, quote it
    if s.lower() in ('null', 'true', 'false', 'yes', 'no', 'on', 'off', ''):
        return "'" + s + "'"
    return s


def fmt_list(items, indent=4):
    if not items:
        return "  []"
    sp = " " * indent
    result = []
    for item in items:
        result.append(sp + "- " + yaml_str(item).strip())
    return "\n".join(result)


def transform_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fm, body = parse_frontmatter(content)
    if fm is None:
        return False, "PARSE_ERROR"

    filename = os.path.basename(filepath)

    title = str(fm.get('title', ''))
    category = str(fm.get('category', ''))
    category_en = str(fm.get('category_en', ''))
    difficulty = str(fm.get('difficulty', ''))
    tools = str(fm.get('tools', ''))
    last_updated = str(fm.get('last_updated', ''))
    tags = fm.get('tags', [])
    nist_csf = fm.get('nist_csf', [])
    mitre_attack = fm.get('mitre_attack', [])

    if mitre_attack in ('all', ['all'], '[]'):
        mitre_attack = []
    if not mitre_attack:
        mitre_attack = infer_attack(filename)
    else:
        mitre_attack = [str(t).strip() for t in mitre_attack
                       if str(t).strip() and str(t).strip() != 'all']

    if isinstance(nist_csf, str):
        nist_csf = [nist_csf]
    nist_csf = [str(n).strip() for n in nist_csf if str(n).strip()]

    if isinstance(tags, str):
        tags = [tags]
    if not tags:
        tags = []
    else:
        tags = [str(t).strip().strip('"\'') for t in tags]

    name = build_name(title)
    description = extract_description(body)
    if not description:
        description = title.split('(')[0].strip()

    subdomain = ""
    for cat_cn, cat_en in SUBDOMAIN_MAP.items():
        if cat_cn in category:
            subdomain = cat_en
            break
    if not subdomain:
        fm_sub = str(fm.get('subdomain', '')).strip()
        if fm_sub:
            subdomain = fm_sub.lower().replace(' ', '-')

    if tags:
        tags_section = fmt_list(tags)
    else:
        inferred = []
        if subdomain:
            inferred.append(subdomain)
        inferred.append(name)
        seen = set()
        unique = []
        for x in inferred:
            if x not in seen:
                seen.add(x)
                unique.append(x)
        tags_section = fmt_list(unique[:10])

    lines = []
    lines.append("---")
    lines.append("name: " + name)
    lines.append("description: " + yaml_str(description))
    lines.append("domain: cybersecurity")
    if subdomain:
        lines.append("subdomain: " + subdomain)
    lines.append("tags:")
    lines.append(tags_section)
    lines.append("version: '1.0.0'")
    lines.append("author: multi-cybersecurity")
    lines.append("license: Apache-2.0")
    lines.append("nist_csf:")
    lines.append(fmt_list(nist_csf) if nist_csf else "  []")
    lines.append("mitre_attack:")
    lines.append(fmt_list(mitre_attack) if mitre_attack else "  []")
    lines.append("---")

    preserve = [
        "",
        "# === 原始信息（向下兼容）===",
        "# original_title: " + title,
        "# original_category: " + category,
        "# original_category_en: " + category_en,
        "# original_difficulty: " + difficulty,
        "# original_tools: " + tools,
        "# original_last_updated: " + last_updated,
        ""
    ]

    new_content = "\n".join(lines) + "\n" + "\n".join(preserve) + body

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, name


def generate_attack_layer(base):
    layer = {
        "name": "multi-CyberSecurity ATT&CK Coverage",
        "versions": {"attack": "14", "navigator": "4.9.1", "layer": "4.5"},
        "domain": "enterprise-attack",
        "description": "MITRE ATT&CK technique coverage map for multi-CyberSecurity skills.",
        "filters": {"platforms": ["Linux", "Windows", "macOS", "Cloud", "Network"]},
        "sorting": 0,
        "layout": {"layout": "side", "aggregateFunction": "average"},
        "hideDisabled": False,
        "showID": False,
        "showName": True,
        "showAggregateScores": False,
        "alignIcon": True,
        "tooltips": True,
        "selectTechniquesAcross": True,
        "selectSubtechniquesAcross": True,
        "selectedLayers": [],
        "unselectedLayers": [],
        "url": "",
        "overrideFilters": False,
        "overrideSort": False,
        "overrideHidden": False,
        "overrideLayout": False,
        "overrideColors": False,
        "scale": {"type": "linear"},
        "metadata": [{"name": "Techniques", "System": "false"}],
        "metadataTypes": ["text"],
        "legendItems": [],
        "showTacticRowBackground": False,
        "tacticRowBackground": "#dddddd",
        "selectTechniques": False,
        "selectSubtechniques": False,
        "selectVisible": False,
        "selectAggregateFunction": "average",
        "techniques": []
    }

    skill_techniques = {}
    skill_files = []
    for cat_dir in base.iterdir():
        if cat_dir.is_dir() and cat_dir.name[0].isdigit():
            skills_dir = cat_dir / 'skills'
            if skills_dir.exists():
                skill_files.extend([f for f in skills_dir.glob('*.md') if f.name != 'README.md'])

    for f in skill_files:
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
        fm, _ = parse_frontmatter(content)
        if not fm:
            continue
        skill_name = fm.get('name', f.stem)
        attack = fm.get('mitre_attack', [])
        if not attack or attack == 'all':
            continue
        if isinstance(attack, list):
            for tid in attack:
                tid = str(tid).strip()
                if not tid:
                    continue
                if tid not in skill_techniques:
                    skill_techniques[tid] = []
                skill_techniques[tid].append(skill_name)

    for tid, skill_names in sorted(skill_techniques.items()):
        layer['techniques'].append({
            "techniqueID": tid,
            "score": len(skill_names),
            "metadata": [{"name": "Skills", "value": ", ".join(skill_names)}],
            "comment": "",
            "enabled": True,
            "color": "",
            "links": [],
            "showSubtechniques": False,
            "subtechniques": []
        })

    return layer


def main():
    # 默认以脚本所在仓库根目录为基准；可传参覆盖：python tools/transform_skills.py [仓库根]
    # 注意：本脚本会原地重写 skill 文件的 frontmatter，运行前先提交/备份。
    import sys
    base = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
    if not base.is_dir():
        print(f'ERROR: 目录不存在: {base}')
        raise SystemExit(2)
    skill_files = []
    for cat_dir in sorted(base.iterdir()):
        if cat_dir.is_dir() and cat_dir.name[0].isdigit():
            skills_dir = cat_dir / 'skills'
            if skills_dir.exists():
                skill_files.extend([f for f in skills_dir.glob('*.md') if f.name != 'README.md'])

    print("Found " + str(len(skill_files)) + " skill files, transforming...")

    success = 0
    failed = []
    for f in sorted(skill_files):
        ok, result = transform_file(f)
        if ok:
            success += 1
        else:
            failed.append((f, result))

    print("Transform: " + str(success) + " ok, " + str(len(failed)) + " failed")
    for f, err in failed:
        print("  FAIL: " + str(f.parent.parent.name) + "/" + str(f.name) + " -> " + err)

    layer = generate_attack_layer(base)
    mapping_dir = base / 'mappings'
    mapping_dir.mkdir(exist_ok=True)
    layer_path = mapping_dir / 'attack-navigator-layer.json'
    with open(layer_path, 'w', encoding='utf-8') as f:
        json.dump(layer, f, indent=2, ensure_ascii=False)

    print("")
    print("ATT&CK Navigator layer: " + str(layer_path))
    print("Covers " + str(len(layer['techniques'])) + " ATT&CK techniques")

    print("")
    print("--- Validation ---")
    import subprocess
    r = subprocess.run(['python3', str(base / 'tools' / 'validate_skills.py')],
                      capture_output=True, text=True)
    print(r.stdout)
    if r.stderr:
        print(r.stderr)


if __name__ == '__main__':
    main()
