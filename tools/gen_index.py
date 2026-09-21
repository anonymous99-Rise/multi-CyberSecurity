#!/usr/bin/env python3
"""Generate skills_index.json from all transformed skill files."""
import os, re, json, yaml
from pathlib import Path

def parse_frontmatter(content):
    m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1).strip())
    except:
        return None

def main():
    # 默认以脚本所在仓库根目录为基准；可传参覆盖：python tools/gen_index.py [仓库根]
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
                skill_files.extend([(f, cat_dir.name) for f in sorted(skills_dir.glob('*.md')) if f.name != 'README.md'])

    index = []
    for f, cat_name in skill_files:
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
        fm = parse_frontmatter(content)
        if not fm:
            continue
        
        attack = fm.get('mitre_attack', [])
        if attack == 'all':
            attack = []
        
        nist = fm.get('nist_csf', [])
        if isinstance(nist, str):
            nist = [nist]
        
        tags = fm.get('tags', [])
        if isinstance(tags, str):
            tags = [tags]
        
        entry = {
            "name": fm.get('name', ''),
            "description": fm.get('description', ''),
            "domain": fm.get('domain', 'cybersecurity'),
            "subdomain": fm.get('subdomain', ''),
            "tags": [str(t).strip() for t in tags if str(t).strip()],
            "mitre_attack": [str(t).strip() for t in attack if str(t).strip()],
            "nist_csf": [str(n).strip() for n in nist if str(n).strip()],
            "version": fm.get('version', '1.0.0'),
            "author": fm.get('author', 'multi-cybersecurity'),
            "license": fm.get('license', 'Apache-2.0'),
            "category": cat_name,
            "file": str(f.relative_to(base)),
        }
        index.append(entry)

    index_path = base / 'skills_index.json'
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

    print(f"Generated skills_index.json with {len(index)} skills")

    # Stats
    total_attack = sum(1 for e in index if e['mitre_attack'])
    total_nist = sum(1 for e in index if e['nist_csf'])
    all_attack_ids = set()
    for e in index:
        for t in e['mitre_attack']:
            all_attack_ids.add(t)
    print(f"Skills with ATT&CK: {total_attack}/{len(index)}")
    print(f"Unique ATT&CK techniques: {len(all_attack_ids)}")
    print(f"Skills with NIST CSF: {total_nist}/{len(index)}")

if __name__ == '__main__':
    main()
