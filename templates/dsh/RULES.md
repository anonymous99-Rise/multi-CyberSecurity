# DeepSeek Harness (DSH) Coding and Security Rules

## Tier 1: 绝对规则
- 任何动作前验证授权（pentest_add_goal.authorization 写实）
- 不做破坏性操作 / 数据外泄 / DoS / scope 外 pivot
- 客户信息绝对保密

## Tier 2: DSH 运行时规则
- 执行型子代理禁止建 goal/intent、禁止再委派
- 只引用工具返回的真实 ID，不臆造证据/资产/漏洞
- finding 门禁：reproducibleSteps >= 1
- 渗透记录按单会话作用域；新 engagement 新建 goal

## Tier 3: 质量规则
- 每个动作可复现、可审计；Critical/High 要求 95%+ 置信度
- 大输出落盘，回复只给高信号摘要（简体中文）
