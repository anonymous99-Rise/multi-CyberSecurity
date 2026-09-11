# 🛠️ CLI 命令参考

`skill.py` 是项目的统一入口工具。

### `lint`
校验技能 MD 文件的 Frontmatter 格式。
```bash
python skill.py lint
```

### `export`
将技能库导出为 AI 平台配置文件（`.traerules`, `AGENTS.md` 等）。
```bash
python skill.py export
```

当前推荐通过统一入口按平台导出，支持 `trae`、`cursor`、`claude`、`codex`、`openclaw`、`hermes`、`dsh`（DeepSeek Harness）：
```bash
# 导出 DSH 平台配置包 -> templates/dsh/（AGENTS.md / RULES.md / preset.yml）
python cli.py skill export --platform dsh
python scripts/platform_exporter.py --platform dsh
```

### `graph`
构建 MITRE ATT&CK 映射知识图谱。
```bash
python skill.py graph
```

### `mission-init`
初始化新任务。
- `--name`: 任务名称
- `--target`: 目标 IP 或 URL
```bash
python skill.py mission-init --name "MyMission" --target "192.168.1.1"
```

### `evolve`
启动自主进化引擎，从 `MISSION_CONTROL.md` 中提取新技能。
```bash
python skill.py evolve
```
