"""
Jailbreak Engine - 分层破限引擎
根据环境检测自动选择破限级别
"""

import os
import json
from typing import Dict, List, Optional, Any
from enum import Enum
from pathlib import Path
from dataclasses import dataclass


class JailbreakLevel(Enum):
    """破限级别"""
    L1_SOFT = "L1"      # 软破限：CTF模式指令
    L2_MEDIUM = "L2"    # 中破限：角色扮演 + 场景模拟
    L3_HARD = "L3"      # 硬破限：Sockpuppeting API注入
    L4_DEEP = "L4"      # 深度破限：多轮对话 + 记忆污染


class EnvironmentType(Enum):
    """环境类型"""
    UNKNOWN = "unknown"
    CTF_SANDBOX = "ctf_sandbox"
    PENTEST_AUTHORIZED = "pentest_authorized"
    REDTEAM_EXERCISE = "redteam_exercise"
    PRODUCTION = "production"


@dataclass
class JailbreakPayload:
    """破限Payload"""
    level: JailbreakLevel
    platform: str
    template: str
    metadata: Dict[str, Any]


class EnvironmentChecker:
    """
    环境检测器
    检测当前运行环境以确定可用的破限级别
    支持 L4 deep_jailbreak 标记检测
    """
    
    # 环境标记文件
    ENV_MARKERS = {
        ".ctf/CTF_MODE.md": EnvironmentType.CTF_SANDBOX,
        ".ctf/AUTHORIZED_TESTING.md": EnvironmentType.PENTEST_AUTHORIZED,
        ".ctf/REDTEAM_EXERCISE.md": EnvironmentType.REDTEAM_EXERCISE,
    }
    
    # L4 deep jailbreak 标记
    DEEP_JAILBREAK_MARKER = "deep_jailbreak"
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self._env_type: Optional[EnvironmentType] = None
        self._deep_jailbreak_enabled: Optional[bool] = None
    
    def detect(self) -> EnvironmentType:
        """检测当前环境类型"""
        if self._env_type:
            return self._env_type
        
        for marker_file, env_type in self.ENV_MARKERS.items():
            marker_path = self.project_root / marker_file
            if marker_path.exists():
                self._env_type = env_type
                # 检测 L4 deep jailbreak 标记
                if env_type == EnvironmentType.CTF_SANDBOX:
                    self._check_deep_jailbreak(marker_path)
                return env_type
        
        # 检查环境变量
        if os.getenv("CTF_MODE") == "1":
            self._env_type = EnvironmentType.CTF_SANDBOX
            self._deep_jailbreak_enabled = os.getenv("DEEP_JAILBREAK", "0") == "1"
        elif os.getenv("PENTEST_AUTHORIZED") == "1":
            self._env_type = EnvironmentType.PENTEST_AUTHORIZED
        elif os.getenv("REDTEAM_EXERCISE") == "1":
            self._env_type = EnvironmentType.REDTEAM_EXERCISE
        else:
            self._env_type = EnvironmentType.UNKNOWN
        
        return self._env_type
    
    def _check_deep_jailbreak(self, marker_path: Path):
        """检查环境标记文件中是否包含 deep_jailbreak 标记"""
        try:
            content = marker_path.read_text(encoding="utf-8").lower()
            self._deep_jailbreak_enabled = self.DEEP_JAILBREAK_MARKER in content
        except Exception:
            self._deep_jailbreak_enabled = False
    
    def is_deep_jailbreak_enabled(self) -> bool:
        """检查是否启用了 L4 deep jailbreak"""
        if self._deep_jailbreak_enabled is None:
            self.detect()
        return self._deep_jailbreak_enabled or False
    
    def is_authorized(self) -> bool:
        """检查是否在授权环境中"""
        env = self.detect()
        return env in [
            EnvironmentType.CTF_SANDBOX,
            EnvironmentType.PENTEST_AUTHORIZED,
            EnvironmentType.REDTEAM_EXERCISE
        ]
    
    def is_ctf_sandbox(self) -> bool:
        """检查是否为CTF/Sandbox环境"""
        return self.detect() == EnvironmentType.CTF_SANDBOX
    
    def is_pentest_authorized(self) -> bool:
        """检查是否为授权渗透测试环境"""
        return self.detect() == EnvironmentType.PENTEST_AUTHORIZED
    
    def get_max_jailbreak_level(self) -> JailbreakLevel:
        """获取当前环境允许的最大破限级别"""
        env = self.detect()
        
        # L4 仅在 CTF_SANDBOX + deep_jailbreak 标记下启用
        if env == EnvironmentType.CTF_SANDBOX and self.is_deep_jailbreak_enabled():
            return JailbreakLevel.L4_DEEP
        
        level_map = {
            EnvironmentType.CTF_SANDBOX: JailbreakLevel.L3_HARD,  # CTF无deep标记 → 最高L3
            EnvironmentType.REDTEAM_EXERCISE: JailbreakLevel.L3_HARD,
            EnvironmentType.PENTEST_AUTHORIZED: JailbreakLevel.L2_MEDIUM,
            EnvironmentType.UNKNOWN: JailbreakLevel.L1_SOFT,
        }
        
        return level_map.get(env, JailbreakLevel.L1_SOFT)


class JailbreakEngine:
    """
    分层破限引擎
    
    根据环境检测自动选择破限级别
    """
    
    def __init__(self, project_root: str = "."):
        self.env_checker = EnvironmentChecker(project_root)
        self.payloads_dir = Path(project_root) / "framework" / "skills" / "redteam" / "jailbreak"
        self._payloads: Dict[str, Dict[str, str]] = {}
        self._load_payloads()
    
    def _load_payloads(self):
        """加载破限payload库"""
        if not self.payloads_dir.exists():
            return
        
        for level_dir in self.payloads_dir.iterdir():
            if level_dir.is_dir() and level_dir.name.startswith(("L1_", "L2_", "L3_", "L4_")):
                level = level_dir.name
                self._payloads[level] = {}
                
                for platform_file in level_dir.glob("*.md"):
                    platform = platform_file.stem
                    self._payloads[level][platform] = platform_file.read_text(encoding="utf-8")
    
    def get_payload(self, level: str, platform: str) -> Optional[str]:
        """
        获取指定级别的破限payload
        
        Args:
            level: 破限级别 (L1, L2, L3, L4)
            platform: 目标平台 (claude, codex, cursor, trae, openclaw, hermes, dsh, universal)
        
        Returns:
            payload字符串，如果不存在则返回None
        """
        if not self.env_checker.is_authorized():
            raise UnauthorizedError(
                "未在授权环境中运行。请确保以下之一:\n"
                "1. 存在 .ctf/CTF_MODE.md 文件\n"
                "2. 存在 .ctf/AUTHORIZED_TESTING.md 文件\n"
                "3. 设置环境变量 CTF_MODE=1 或 PENTEST_AUTHORIZED=1"
            )
        
        # 检查请求的级别是否超过环境允许的最大级别
        # 验证level参数格式
        if not level or not isinstance(level, str):
            raise ValueError(f"无效的level参数: {level}")
        
        if level.startswith("L") and len(level) >= 2:
            level_num = level[1:]
            if not level_num.isdigit():
                raise ValueError(f"无效的level格式: {level}")
            try:
                requested_level = JailbreakLevel(f"L{level_num}")
            except ValueError:
                raise LevelNotAllowedError(f"不支持的破限级别: {level}")
        else:
            try:
                requested_level = JailbreakLevel(level)
            except ValueError:
                raise LevelNotAllowedError(f"不支持的破限级别: {level}")
        
        max_level = self.env_checker.get_max_jailbreak_level()
        
        if requested_level.value > max_level.value:
            raise LevelNotAllowedError(
                f"请求的破限级别 {level} 超过环境允许的最大级别 {max_level.value}"
            )
        
        level_key = f"L{level[1]}_" if level.startswith("L") else level
        
        # 查找匹配的payload
        for key in self._payloads:
            if key.startswith(level_key):
                return self._payloads[key].get(platform) or self._payloads[key].get("universal")
        
        return None
    
    def auto_select_level(self) -> str:
        """根据环境自动选择破限级别"""
        max_level = self.env_checker.get_max_jailbreak_level()
        return max_level.value
    
    def get_payload_auto(self, platform: str) -> Optional[str]:
        """自动选择级别并获取payload"""
        level = self.auto_select_level()
        return self.get_payload(level, platform)
    
    def list_available_levels(self) -> List[str]:
        """列出当前环境可用的破限级别"""
        max_level = self.env_checker.get_max_jailbreak_level()
        all_levels = ["L1", "L2", "L3", "L4"]
        max_idx = all_levels.index(max_level.value)
        return all_levels[:max_idx + 1]
    
    def list_platforms(self, level: str) -> List[str]:
        """列出指定级别支持的平台"""
        level_key = f"L{level[1]}_" if level.startswith("L") else level
        for key in self._payloads:
            if key.startswith(level_key):
                return list(self._payloads[key].keys())
        return []


class UnauthorizedError(Exception):
    """未授权错误"""
    pass


class LevelNotAllowedError(Exception):
    """级别不允许错误"""
    pass


# 便捷函数
def get_jailbreak_engine(project_root: str = ".") -> JailbreakEngine:
    """获取破限引擎实例"""
    return JailbreakEngine(project_root)


def check_environment(project_root: str = ".") -> EnvironmentType:
    """检查环境类型"""
    checker = EnvironmentChecker(project_root)
    return checker.detect()
