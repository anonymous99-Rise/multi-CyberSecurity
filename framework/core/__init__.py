"""
Framework Core
==============

核心模块:
- orchestrator: 任务编排器 (增强多级预算控制)
- pipeline: 8阶段安全审计管道
- blackboard: 信息素黑板 (Phase 2)
- agent_registry: Agent 注册表
- redteam_gateway: 红队网关
"""

from .orchestrator import MissionOrchestrator, BudgetController
from .pipeline import AuditPipeline, Stage, Finding as PipelineFinding
from .agent_registry import AgentRegistry, get_registry

# Blackboard (Phase 2)
from .blackboard import (
    FindingType,
    Finding,
    Predicate,
    Budget,
    AgentBudget,
    CampaignConfig,
    Board,
    MemoryBoard,
    get_board,
    Scheduler,
    Agent,
    SchedulerEvent,
)

# Oracle Verification
from .oracle import (
    ProofCapsule,
    VerificationResult,
    VerificationStatus,
    OracleVerifier,
    verify_finding,
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

# MCP Tools
from .mcp import (
    ToolMetadata,
    ToolCategory,
    ToolRegistry,
    get_registry as get_tool_registry,
    register_tool,
    list_tools,
    ToolRouter,
    RouteContext,
    route_tool,
    ValidationResult,
    validate_tool_params,
)

# Red Blue Team
from .redblue import (
    Team,
    RedTeam,
    BlueTeam,
    TeamResult,
    RedAgent,
    BlueAgent,
    AgentRole,
    AttackResult,
    DetectionResult,
    Evidence,
    EvidenceChain,
    EvidenceBus,
    RedBlueController,
    EngagementConfig,
    EngagementResult,
)

# Context Guard
from .context_guard import (
    SensitivityLevel,
    SensitiveInfo,
    ContextScanner,
    scan_text,
    scan_prompt,
    RedactionRule,
    Redactor,
    redact_sensitive,
    GuardConfig,
    ContextGuard,
    protect_prompt,
    verify_output,
)

# LangGraph Integration
from .langgraph_integration import (
    PentestState,
    Stage,
    Finding,
    Target,
    PentestGraph,
    create_pentest_graph,
    ReconNode,
    HuntNode,
    ValidateNode,
    ExploitNode,
    ReportNode,
    create_standard_graph,
)

__all__ = [
    # Core
    "MissionOrchestrator",
    "BudgetController",
    "AuditPipeline",
    "PipelineFinding",
    "Stage",
    "AgentRegistry",
    "get_registry",
    # Blackboard
    "FindingType",
    "Finding",
    "Predicate",
    "Budget",
    "AgentBudget",
    "CampaignConfig",
    "Board",
    "MemoryBoard",
    "get_board",
    "Scheduler",
    "Agent",
    "SchedulerEvent",
    # Oracle
    "ProofCapsule",
    "VerificationResult",
    "VerificationStatus",
    "OracleVerifier",
    "verify_finding",
    "PayloadGenerator",
    "SQLiPayloadGenerator",
    "XSSPayloadGenerator",
    "CmdInjectionPayloadGenerator",
    "SSRFGenerator",
    "PathTraversalGenerator",
    "XXEGenerator",
    "SSTIGenerator",
    "get_generator",
    # MCP
    "ToolMetadata",
    "ToolCategory",
    "ToolRegistry",
    "get_tool_registry",
    "register_tool",
    "list_tools",
    "ToolRouter",
    "RouteContext",
    "route_tool",
    "ValidationResult",
    "validate_tool_params",
    # Red Blue Team
    "Team",
    "RedTeam",
    "BlueTeam",
    "TeamResult",
    "RedAgent",
    "BlueAgent",
    "AgentRole",
    "AttackResult",
    "DetectionResult",
    "Evidence",
    "EvidenceChain",
    "EvidenceBus",
    "RedBlueController",
    "EngagementConfig",
    "EngagementResult",
    # Context Guard
    "SensitivityLevel",
    "SensitiveInfo",
    "ContextScanner",
    "scan_text",
    "scan_prompt",
    "RedactionRule",
    "Redactor",
    "redact_sensitive",
    "GuardConfig",
    "ContextGuard",
    "protect_prompt",
    "verify_output",
    # LangGraph
    "PentestState",
    "Stage",
    "Finding",
    "Target",
    "PentestGraph",
    "create_pentest_graph",
    "ReconNode",
    "HuntNode",
    "ValidateNode",
    "ExploitNode",
    "ReportNode",
    "create_standard_graph",
]
