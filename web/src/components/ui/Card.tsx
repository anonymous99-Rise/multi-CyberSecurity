import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** 基础卡片：统一边框/悬浮发光（样式在 globals.css 的 .tac-card） */
export function Card({
  children,
  className,
  primary = false,
}: {
  children: ReactNode;
  className?: string;
  /** 主入口样式：左侧主色条 + 略深底色 */
  primary?: boolean;
}) {
  return <div className={cn("tac-card", primary && "tac-card-primary", className)}>{children}</div>;
}

/**
 * 带标题的分区卡：标题统一用 .label-tech（10px / 高对比），
 * 避免各页面自己拼 `text-[9px] text-gray-600 font-mono tracking-widest` 这类写法。
 */
export function SectionCard({
  label,
  icon: Icon,
  suffix,
  children,
  className,
  bodyClassName,
  iconClassName,
}: {
  label: string;
  icon?: LucideIcon;
  suffix?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  iconClassName?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="label-tech mb-3 flex flex-wrap items-center gap-2">
        {Icon && <Icon size={12} className={cn("text-accent", iconClassName)} />}
        <span>{label}</span>
        {suffix && <span className="text-gray-500 normal-case tracking-normal">{suffix}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </Card>
  );
}
