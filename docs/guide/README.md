# 🚦 快速入门指南

## 1. 环境准备
- **Python 3.10+**：核心框架运行环境。
- **Docker**：用于运行 `playground/` 靶场环境。
- **AI 平台**：Trae、Cursor、Claude Code、Codex、OpenClaw、Hermes 或 DeepSeek Harness (DSH)。

## 2. 启动演练靶场
```bash
cd playground
docker-compose up -d
```

## 3. 初始化 Mission
```bash
python skill.py mission-init --name "Lab-Testing" --target "http://localhost:3000"
```

## 4. 运行 Agent
1. 在您的 AI IDE (如 Trae) 中加载本项目。
2. 调出 `Coordinator` Agent。
3. 提示词示例：“根据 MISSION_CONTROL.md 开始 Lab-Testing 任务，调用 ReconAgent 进行初步资产识别。”

## 5. 生成报告
任务完成后，运行：
```bash
python skill.py report
```
系统将根据 `MISSION_CONTROL.md` 中的证据自动生成 `Final_Pentest_Report.md`。
