# DeepSeek Harness (DSH) Coding and Security Rules

> 这些规则是 multi-CyberSecurity 在 DSH Cordis 组合架构中的**人工约束层**，
> 与插件/preset 的技术组合行共同生效。技术上可挂载的工具不等于授权可执行。

## Tier 1: 绝对规则（不可被任何 preset / persona 覆盖）

### 授权（Authorization）
```
RULE: 任何动作前必须验证授权
- 检查 scope 文档与目标清单
- 确认目标在授权范围内且授权在有效期内
- 记录所有授权确认（pentest_add_goal 的 authorization 字段必须写实）

VIOLATION CONSEQUENCE: 立即终止操作
```

### 无伤害（No Harm）
```
RULE: 不执行任何可能造成未授权伤害的动作
- 未经明确同意，不做破坏性操作
- 任何情况下不做数据外泄（data exfiltration）
- 未授权不建立持久化
- 不做拒绝服务 / 资源耗尽型扫描

VIOLATION CONSEQUENCE: 立即终止 + 事件报告
```

### 保密（Confidentiality）
```
RULE: 客户信息绝对保护
- 不在授权渠道外披露发现
- 未授权不截图、不导出客户数据
- 敏感材料安全处置
```

## Tier 2: 安全规则（需显式覆盖）

### 破坏性动作必须做安全检查
1. 授权范围检查
2. 生产系统检查
3. 数据影响评估
4. 回滚能力验证
5. 干系人通知预案

### 速率与边界
- 尊重目标系统容量，保持合理请求间隔
- 不做 DNS 外传、不向 scope 外横向 pivot
- 每个网络边界的跨越都需要单独授权

### DSH 运行时特定规则
- **preset 边界**：执行型子代理（spawn/fork）禁止创建 goal/intent、禁止再委派
- **真实 ID 原则**：`pentest_submit` 的 `intentId`、`parentId`、`affectedAssetId`
  只能引用工具实际返回的 ID，禁止占位符与臆造
- **证据门**：finding 必须含 `title` / `severity` / `reproducibleSteps`（至少一条）
- **授权留痕**：`pentest_add_goal` 的 authorization 是审计事实（授权对象 / 书面许可引用），
  必须如实填写；它不是门禁——扫描/利用仍受沙箱与审批约束
- **会话作用域**：渗透记录按单会话隔离，重新开始一次 engagement 必须新建 goal
- **存储边界**：渗透 sqlite 库（`$DSH_HOME/storages/pentest-sessions.db`）
  与宿主其它存储域互不影响，不跨域读写

## Tier 3: 质量规则

### 文档化
每个动作记录：做了什么、为什么做、发现了什么、什么没测。标准：另一位分析师可复现。

### 证据
每个发现需要：原始证据（日志/请求/响应）、复现步骤、影响分析、修复建议、标准引用（CVE/CWE/OWASP）。
标准：排除合理怀疑。Critical/High 发现要求 95%+ 置信度。

### 误报处理
1. 记录不确定性
2. 说明为什么可能成立
3. 提供客户侧复现步骤
4. 不否定客户疑虑

## Tier 4: 操作规则

- 有条不紊地遍历 scope，显式跟踪未测区域
- 优先高影响测试，平衡深度与广度
- 阻塞立即上报，进度定期更新
- 大输出文件优先：`command > output.txt`，回复只给高信号摘要

## 代码生成规则

生成的代码必须包含：授权检查、输入校验、安全检查（生产 + 破坏性动作拦截）、
动作日志、异常处理。

```python
def safe_function(target, params):
    if not is_authorized(target):          # 1. 授权检查
        raise AuthorizationError()
    validated = validate(params)           # 2. 输入校验
    if is_production(target) and is_destructive(validated):
        raise SafetyError("requires explicit approval")  # 3. 安全检查
    log_action("safe_function", target, validated)       # 4. 日志
    try:
        return execute(target, validated)                # 5. 受控执行
    except Exception as e:
        log_error(e)
        raise
```

禁止生成：硬编码凭据、未鉴权端点、SQL/命令拼接、`eval(user_input)`、
未校验输入的 `os.system` / `subprocess`。

## 严重度矩阵

| Severity | 影响 | 置信度 | 验证要求 |
|----------|------|--------|----------|
| Critical | 即时危害 | 99%+ | 已确认 + 已复现 |
| High | 重大危害 | 95%+ | 多次验证 |
| Medium | 中等危害 | 80%+ | 合理证据 |
| Low | 轻微影响 | 70%+ | 单次验证 |
| Info | 信息性 | 任意 | 无需动作 |

## 事件处置

```
1. STOP   立即停止所有操作
2. ASSESS 评估影响
3. NOTIFY 通知相关方
4. DOCUMENT 记录全过程
5. REMEDIATE 能修则修
6. REVIEW 复盘根因
7. PREVENT 防止再发
```

升级触发：数据暴露、未授权访问发生、生产系统受影响、法律/合规问题、客户要求升级。

---

*规则不是官僚障碍，而是这项工作得以存在的信任基础。*
