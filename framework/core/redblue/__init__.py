"""
红蓝对抗双团队模式
==================
参考 Ares 架构实现

设计参考:
- Ares (dreadnode/ares): Redis + 证据驱动链式联动
- Red Team (7 专业Agent) + Blue Team (4 专业Agent)
- 实时对抗模拟

功能:
- Red Team: 攻击模拟
- Blue Team: 检测和响应
- 证据驱动联动
- MITRE ATT&CK 覆盖
"""

from .team import (
    Team,
    RedTeam,
    BlueTeam,
    TeamResult,
)
from .agents import (
    RedAgent,
    BlueAgent,
    AgentRole,
    AttackResult,
    DetectionResult,
)
from .evidence import (
    Evidence,
    EvidenceChain,
    EvidenceBus,
)
from .controller import (
    RedBlueController,
    EngagementConfig,
    EngagementResult,
)

__all__ = [
    # Teams
    "Team",
    "RedTeam",
    "BlueTeam",
    "TeamResult",
    # Agents
    "RedAgent",
    "BlueAgent",
    "AgentRole",
    "AttackResult",
    "DetectionResult",
    # Evidence
    "Evidence",
    "EvidenceChain",
    "EvidenceBus",
    # Controller
    "RedBlueController",
    "EngagementConfig",
    "EngagementResult",
]
