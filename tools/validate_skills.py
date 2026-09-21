#!/usr/bin/env python3
"""
Skill frontmatter 校验脚本
"""
import os, re, yaml
from pathlib import Path

REQUIRED_FIELDS = ['name', 'description', 'domain', 'subdomain', 'tags', 'version', 'author', 'license', 'nist_csf', 'mitre_attack']

def validate_file(p):
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return 'NO_FRONTMATTER', []
    fm = None
    try:
        fm_stripped = m.group(1).strip()
        if fm_stripped:
            fm = yaml.safe_load(fm_stripped)
    except Exception as e:
        return f'YAML_PARSE_ERROR: {e}', []
    issues = []
    for fld in REQUIRED_FIELDS:
        if fld not in fm or fm[fld] is None:
            issues.append(f'MISSING: {fld}')
    if fm.get('mitre_attack') and fm['mitre_attack'] != 'all':
        if isinstance(fm['mitre_attack'], list):
            for t in fm['mitre_attack']:
                if not re.match(r'^T\d{4}(\.\d{3})?$', str(t)):
                    issues.append(f'INVALID_ATTACK_ID: {t}')
    if fm.get('nist_csf'):
        if isinstance(fm['nist_csf'], list):
            for n in fm['nist_csf']:
                if not re.match(r'^[A-Z]{2}\.[A-Z]{2}-\d{2}$', str(n)):
                    issues.append(f'INVALID_NIST_CSF: {n}')
    return None if not issues else '; '.join(issues), issues

def main():
    # 默认扫描脚本所在仓库的根目录；可传参覆盖：python tools/validate_skills.py [仓库根]
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
    total = len(skill_files)
    passed = 0
    failed = []
    for f in sorted(skill_files):
        err, _ = validate_file(f)
        if err:
            failed.append((f, err))
        else:
            passed += 1
    print(f'Validation: {passed}/{total} passed (root: {base})')
    if failed:
        for f, err in failed[:20]:
            print(f'  FAIL: {f.parent.parent.name}/{f.name}')
            print(f'    {err}')
        if len(failed) > 20:
            print(f'  ... 共 {len(failed)} 个文件未通过')
        raise SystemExit(1)
    print('All skills pass validation!')

if __name__ == '__main__':
    main()
