import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "default" | "accent" | "info" | "warning";

const VARIANTS: Record<ChipVariant, string> = {
  default: "bg-bg-tertiary border-bg-border text-ink-muted hover:border-accent/40",
  accent: "bg-accent/10 border-accent/25 text-accent",
  info: "bg-info/10 border-info/25 text-info",
  warning: "bg-warning/10 border-warning/25 text-warning",
};

/**
 * 统一标签芯片：平台、标签、ATT&CK 编号、NIST 控制项、合规标准都用它。
 * 之前这些地方各自写 `text-[10px] px-1.5 py-0.5 bg-.../8` 之类，既有失效的透明度刻度、也不一致。
 */
export function Chip({
  children,
  variant = "default",
  title,
  className,
  dot = false,
}: {
  children: ReactNode;
  variant?: ChipVariant;
  title?: string;
  className?: string;
  /** 左侧小方块（用于平台芯片这类需要视觉锚点的场景） */
  dot?: boolean;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono border transition-colors",
        VARIANTS[variant],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 bg-accent/60 shrink-0" />}
      {children}
    </span>
  );
}
