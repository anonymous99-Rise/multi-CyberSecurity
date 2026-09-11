#!/usr/bin/env python3
"""
Version Manager for multi-CyberSecurity
统一管理和同步项目中的所有版本号

Usage:
    python scripts/version_manager.py bump patch  # 4.1.2 -> 4.1.3
    python scripts/version_manager.py bump minor  # 4.1.2 -> 4.2.0
    python scripts/version_manager.py bump major  # 4.1.2 -> 5.0.0
    python scripts/version_manager.py set 4.2.0   # 设置指定版本
    python scripts/version_manager.py check       # 检查版本一致性
"""

import json
import re
import sys
from pathlib import Path
from typing import List, Tuple

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent

# 需要更新的文件列表（相对路径 + 替换规则）
VERSION_FILES = [
    ("README.md", [
        (r"multi-CyberSecurity v[\d.]+", "multi-CyberSecurity v{version}"),
        (r"version-[\d.]+-", "version-{version}-"),
    ]),
    ("cli.py", [
        (r"multi-CyberSecurity v[\d.]+(?: Enhanced)?", "multi-CyberSecurity v{version} Enhanced"),
        (r"multi-CyberSecurity v[\d.]+ - AI", "multi-CyberSecurity v{version} - AI"),
    ]),
    ("framework/skills/index.md", [
        (r"Framework Version: v[\d.]+", "Framework Version: v{version}"),
    ]),
    ("index.json", [
        (r'"version":\s*"[^"]+"', '"version": "{version}"'),
    ]),
]

# 用于一致性检查的文件（只读检查）
CHECK_ONLY_FILES = [
    ("CHANGELOG.md", r"## \[v([\d.]+)\]"),
]


def get_current_version() -> str:
    """从 README.md 获取当前版本号"""
    readme_path = PROJECT_ROOT / "README.md"
    content = readme_path.read_text(encoding="utf-8")

    # 匹配标题中的版本号
    match = re.search(r"multi-CyberSecurity v([\d.]+)", content)
    if match:
        return match.group(1)

    # 匹配 badge 中的版本号
    match = re.search(r"version-([\d.]+)-", content)
    if match:
        return match.group(1)

    raise ValueError("Could not find current version in README.md")


def validate_version(version: str) -> bool:
    """校验版本号格式 (X.Y.Z)"""
    return bool(re.match(r"^\d+\.\d+\.\d+$", version))


def bump_version(version: str, bump_type: str) -> str:
    """递增版本号"""
    parts = version.split(".")

    # 确保有3个部分
    while len(parts) < 3:
        parts.append("0")

    major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])

    if bump_type == "major":
        return f"{major + 1}.0.0"
    elif bump_type == "minor":
        return f"{major}.{minor + 1}.0"
    elif bump_type == "patch":
        return f"{major}.{minor}.{patch + 1}"
    else:
        raise ValueError(f"Unknown bump type: {bump_type}")


def update_file(filepath: Path, patterns: List[Tuple[str, str]], version: str) -> bool:
    """更新单个文件中的版本号"""
    if not filepath.exists():
        print(f"  SKIP: {filepath} (not found)")
        return False

    content = filepath.read_text(encoding="utf-8")
    original_content = content

    for pattern, replacement_template in patterns:
        replacement = replacement_template.format(version=version)
        content = re.sub(pattern, replacement, content)

    if content != original_content:
        filepath.write_text(content, encoding="utf-8")
        print(f"  UPDATED: {filepath}")
        return True
    else:
        print(f"  OK: {filepath} (already at v{version})")
        return False


def update_version(new_version: str) -> None:
    """更新所有文件中的版本号"""
    if not validate_version(new_version):
        print(f"Error: Invalid version format '{new_version}'. Expected: X.Y.Z")
        sys.exit(1)

    current = get_current_version()
    print(f"Current version: v{current}")
    print(f"Target version:  v{new_version}")
    print("-" * 50)

    updated = False
    for relative_path, patterns in VERSION_FILES:
        filepath = PROJECT_ROOT / relative_path
        if update_file(filepath, patterns, new_version):
            updated = True

    print("-" * 50)
    if updated:
        print(f"Version updated to v{new_version}")
        print("\nNext steps:")
        print(f"  1. Review:   git diff")
        print(f"  2. Commit:   git commit -am 'chore: bump version to v{new_version}'")
        print(f"  3. Tag:      git tag -a v{new_version} -m 'Release v{new_version}'")
        print(f"  4. Push:     git push origin main && git push origin v{new_version}")
        print(f"  5. Release:  gh release create v{new_version} --generate-notes")
    else:
        print("No files were updated (all already at target version)")


def check_version_consistency() -> bool:
    """检查所有文件中的版本号是否一致"""
    print("Checking version consistency across all files...")
    print("-" * 50)

    versions = {}

    # 检查可写文件
    for relative_path, patterns in VERSION_FILES:
        filepath = PROJECT_ROOT / relative_path
        if not filepath.exists():
            print(f"  MISSING: {relative_path}")
            continue

        content = filepath.read_text(encoding="utf-8")

        for pattern, _ in patterns:
            matches = re.findall(pattern, content)
            if matches:
                version_match = re.search(r"[\d.]+", matches[0])
                if version_match:
                    versions[relative_path] = version_match.group(0)
                    break

    # 检查只读文件
    for relative_path, pattern in CHECK_ONLY_FILES:
        filepath = PROJECT_ROOT / relative_path
        if not filepath.exists():
            continue
        content = filepath.read_text(encoding="utf-8")
        match = re.search(pattern, content)
        if match:
            versions[f"{relative_path} (latest)"] = match.group(1)

    # 显示结果
    for filepath, version in sorted(versions.items()):
        status = "OK" if version == list(versions.values())[0] else "MISMATCH"
        print(f"  [{status}] {filepath}: v{version}")

    print("-" * 50)

    unique_versions = set(versions.values())
    if len(unique_versions) == 1:
        print(f"All files consistent at v{list(unique_versions)[0]}")
        return True
    else:
        print(f"VERSION INCONSISTENCY DETECTED!")
        for v in sorted(unique_versions):
            files = [f for f, ver in versions.items() if ver == v]
            print(f"  v{v}: {', '.join(files)}")
        return False


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    if command == "bump":
        if len(sys.argv) < 3:
            print("Error: bump type required (patch/minor/major)")
            sys.exit(1)

        bump_type = sys.argv[2]
        if bump_type not in ("patch", "minor", "major"):
            print(f"Error: invalid bump type '{bump_type}'. Use: patch, minor, or major")
            sys.exit(1)

        current = get_current_version()
        new_version = bump_version(current, bump_type)
        update_version(new_version)

    elif command == "set":
        if len(sys.argv) < 3:
            print("Error: version required (e.g., 4.2.0)")
            sys.exit(1)

        new_version = sys.argv[2]
        update_version(new_version)

    elif command == "check":
        consistent = check_version_consistency()
        sys.exit(0 if consistent else 1)

    else:
        print(f"Unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
