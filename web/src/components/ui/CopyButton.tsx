"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 复制按钮（原先 cli 与 jailbreak 各自实现一份，行为一致但代码重复）。
 * 复制成功后 2 秒内显示 COPIED。
 */
export function CopyButton({
  text,
  className,
  label = "COPY",
  copiedLabel = "COPIED",
}: {
  /** 要复制的内容；传函数则点击时才求值（如需要读取当前 URL） */
  text: string | (() => string);
  className?: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
    } catch {
      // 非安全上下文（http）下 clipboard 可能不可用，静默降级，不影响页面
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      title={copied ? "已复制" : "复制到剪贴板"}
      className={cn(
        "flex items-center gap-1 text-[10px] font-mono transition-colors",
        copied ? "text-accent" : "text-ink-muted hover:text-accent",
        className,
      )}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? copiedLabel : label}
    </button>
  );
}
