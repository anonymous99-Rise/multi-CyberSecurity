#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 external-skills.json —— 外部子仓库的技能清单与计数。

两个模式（结果字段一致）：
  1) 本地遍历（默认）：需要子仓库已 checkout —— `git submodule update --init --recursive`
  2) GitHub API：`GH_TOKEN=xxx python tools/external_skills_manifest.py --api`
     无需 checkout，按 .gitmodules 里固定的 commit 统计，适合本地没拉子仓库时刷新。

口径：`skill_md` = 仓库内 SKILL.md 文件数（大小写不敏感），这是各上游技能库的通用标记；
      没有 SKILL.md 的仓库按 kind=tool/collection 记录（如 Desinter_scan 的 collector、MCP 服务）。
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GITMODULES = ROOT / ".gitmodules"
OUT = ROOT / "external-skills.json"

SCHEMA_VERSION = 1


def parse_gitmodules():
    """解析 .gitmodules → [{name, path, url}]，容忍 tab 缩进与 CRLF。"""
    text = GITMODULES.read_text(encoding="utf-8")
    entries = []
    for block in re.split(r"(?m)^\s*\[submodule\s+", text):
        name = re.match(r'"([^"]+)"\]', block)
        path = re.search(r"(?m)^\s*path\s*=\s*(\S+?)\s*$", block)
        url = re.search(r"(?m)^\s*url\s*=\s*(\S+?)\s*$", block)
        if name and path and url:
            entries.append({"name": name.group(1), "path": path.group(1), "url": url.group(1)})
    return entries


def pinned_sha(path):
    """取仓库索引里固定的子仓库 commit（避免统计到未固定的工作区状态）。"""
    try:
        out = subprocess.run(["git", "ls-tree", "HEAD", path], cwd=ROOT,
                             capture_output=True, text=True, encoding="utf-8").stdout.strip()
        if out:
            return out.split()[2]
    except Exception:
        pass
    return None


def count_local(repo_dir):
    if not repo_dir.is_dir():
        return None, "not-checked-out"
    n = sum(1 for p in repo_dir.rglob("SKILL.md") if p.is_file())
    return n, "local"


def count_api(repo, sha, token):
    url = f"https://api.github.com/repos/{repo}/git/trees/{sha}?recursive=1"
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "external-skills-manifest",
        **({"Authorization": f"Bearer {token}"} if token else {}),
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        return None, f"http-{e.code}"
    except Exception as e:
        return None, f"error:{e}"
    if data.get("truncated"):
        return None, "truncated"
    n = sum(1 for item in data.get("tree", [])
            if item.get("type") == "blob" and item.get("path", "").lower().endswith("skill.md"))
    return n, "api"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", action="store_true", help="用 GitHub API 统计（需要 GH_TOKEN）")
    ap.add_argument("--out", default=str(OUT))
    args = ap.parse_args()

    token = os.environ.get("GH_TOKEN", "").strip()
    if args.api and not token:
        print("ERROR: --api 模式需要 GH_TOKEN（gh auth token 可获取）", file=sys.stderr)
        return 2

    repos = []
    total = 0
    for sm in parse_gitmodules():
        sha = pinned_sha(sm["path"])
        if args.api:
            repo = re.sub(r"^https?://github\.com/", "", sm["url"]).removesuffix(".git")
            count, source = count_api(repo, sha or "HEAD", token)
            repo_slug = repo
        else:
            count, source = count_local(ROOT / sm["path"])
            repo_slug = re.sub(r"^https?://github\.com/", "", sm["url"]).removesuffix(".git")

        entry = {
            "name": sm["name"],
            "path": sm["path"],
            "url": sm["url"],
            "repo": repo_slug,
            "commit": sha[:7] if sha else None,
            "skill_md": count,
            "count_source": source,
            "kind": "skills" if (count or 0) > 0 else "tool",
        }
        repos.append(entry)
        if count:
            total += count
        print(f"  {sm['path']:38s} SKILL.md={str(count):>5s} ({source})")

    manifest = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "generated_by": "tools/external_skills_manifest.py" + (" --api" if args.api else ""),
        "note": ("external/ 子仓库以 git submodule 引用，不计入本仓库自有技能数（index.json meta.total_skills）；"
                 "此文件只做「外部技能」单独计数维度，供站点与文档引用。"),
        "metric": "SKILL.md 文件数（递归，大小写不敏感）",
        "repo_count": len(repos),
        "repo_with_skills": sum(1 for r in repos if r["kind"] == "skills"),
        "external_skill_md_total": total,
        "repos": repos,
    }
    Path(args.out).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\n写入 {args.out}")
    print(f"合计：{manifest['repo_count']} 个子仓库，其中 {manifest['repo_with_skills']} 个含 SKILL.md，"
          f"外部 SKILL.md 总数 = {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
