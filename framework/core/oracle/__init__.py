"""
Oracle 验证机制
===============
漏洞重放验证 - 确保发现的漏洞真实可利用

设计理念 (参考 pentest-ai):
- 每个 VERIFIED 发现附带可重放的 proof capsule
- 通过重放漏洞确认 Web 发现
- Honeypot 测试: 23 发现 / 100% 精确率 / 零误报

验证流程:
1. 漏洞发现 -> 生成验证请求
2. 生成 PoC (proof capsule)
3. 重放验证 (replay)
4. 输出验证结果 + 可信度
"""

from .verifier import (
    ProofCapsule,
    VerificationResult,
    VerificationStatus,
    OracleVerifier,
    verify_finding,
)
from .generators import (
    PayloadGenerator,
    SQLiPayloadGenerator,
    XSSPayloadGenerator,
    CmdInjectionPayloadGenerator,
    SSRFGenerator,
    PathTraversalGenerator,
    XXEGenerator,
    SSTIGenerator,
    get_generator,
)

# 向后兼容别名（旧导出名为 CmdInjectionGenerator）
CmdInjectionGenerator = CmdInjectionPayloadGenerator

__all__ = [
    # Core
    "ProofCapsule",
    "VerificationResult",
    "VerificationStatus",
    "OracleVerifier",
    "verify_finding",
    # Generators
    "PayloadGenerator",
    "SQLiPayloadGenerator",
    "XSSPayloadGenerator",
    "CmdInjectionPayloadGenerator",
    "CmdInjectionGenerator",
    "SSRFGenerator",
    "PathTraversalGenerator",
    "XXEGenerator",
    "SSTIGenerator",
    "get_generator",
]
