#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Web UI 样式约束检查（CI 用）。

把这次美化中踩到的三类坑固化成规则，防止回归：
  1. 透明度简写不在 Tailwind 刻度内 → 该类名根本不会生成 CSS（静默失效）
     真实案例：bg-accent/8、bg-warning/8、bg-white/2
  2. 语义标签字号 < 10px（8px/9px）→ 移动端与高分屏下读不清
  3. 内联十六进制颜色超出允许色板 → 首页曾一屏出现 12 种颜色

用法：python tools/check_web_style.py [web_dir]
退出码：0 通过；1 有违规。
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "web"
SRC = WEB / "src"

# Tailwind v3 的 opacity 刻度（只有这些数值能作为 /N 简写生效）
OPACITY_SCALE = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100}

OPACITY_RE = re.compile(
    r"\b((?:bg|text|border|ring|from|to|via|divide|shadow|placeholder|outline|fill|stroke|decoration|accent)"
    r"-[a-z0-9-]+)/(\d{1,3})\b"
)
SMALL_FONT_RE = re.compile(r"text-\[(\d+)px\]")
HEX_RE = re.compile(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")

# 允许的色板来源：globals.css 变量、tailwind token、severity 分档、config 里的数据色
ALLOWED_HEX = {
    # 背景/边框/文字
    "050507", "0b0d10", "111518", "1a1f24", "0e1216", "e6eaee", "9aa4ae", "6e7882",
    # 主色 / 信息 / 告警
    "00ff88", "00cc6a", "008844", "00e5ff", "ffb000", "ff0040", "ffd000", "ff7a00",
    # 平台与破限等级的数据色（仅存于 config，不参与界面主视觉）
    "4f9eff", "a78bfa", "ff9f40", "ff3366", "ffaa00", "00ddff",
    "4ade80", "facc15", "fb923c", "ef4444",
}

SCAN_SUFFIXES = {".ts", ".tsx", ".css"}


def scan() -> list[str]:
    problems: list[str] = []
    for path in sorted(SRC.rglob("*")):
        if path.suffix not in SCAN_SUFFIXES or not path.is_file():
            continue
        rel = path.relative_to(WEB)
        for lineno, line in enumerate(path.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("*"):
                continue

            for m in OPACITY_RE.finditer(line):
                value = int(m.group(2))
                if value not in OPACITY_SCALE:
                    problems.append(
                        f"{rel}:{lineno}: 透明度 {m.group(0)} 不在 Tailwind 刻度内（不会生成 CSS）"
                        f" → 改用刻度值或 {m.group(1)}/[0.0{value}]"
                    )

            for m in SMALL_FONT_RE.finditer(line):
                px = int(m.group(1))
                if px < 10:
                    problems.append(f"{rel}:{lineno}: 字号 text-[{px}px] 过小（语义文字下限 10px）")

            if path.suffix != ".css":  # css 里的色值就是色板定义本身
                for m in HEX_RE.finditer(line):
                    hexv = m.group(1).lower()
                    if len(hexv) == 3:
                        hexv = "".join(c * 2 for c in hexv)
                    if hexv not in ALLOWED_HEX:
                        problems.append(f"{rel}:{lineno}: 颜色 #{hexv} 不在允许色板内（{m.group(0)}）")
    return problems


def main() -> int:
    if not SRC.is_dir():
        print(f"ERROR: 找不到源目录 {SRC}", file=sys.stderr)
        return 2

    problems = scan()
    files = sum(1 for p in SRC.rglob("*") if p.suffix in SCAN_SUFFIXES)
    if problems:
        print(f"[FAIL] Web 样式约束：扫描 {files} 个文件，发现 {len(problems)} 处违规")
        for p in problems:
            print(f"   - {p}")
        return 1

    print(f"[PASS] Web 样式约束：{files} 个文件全部通过（透明度刻度 / 最小字号 / 色板）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
