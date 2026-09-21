import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 页面标题区：// 小节名 + 标题 + 说明 + 可选右侧内容 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-start gap-4", className)}>
      <div className="min-w-0 flex-1">
        <div className="label-tech text-accent/70 mb-1">{eyebrow}</div>
        <h1 className="text-2xl font-bold text-gray-100 font-mono break-words">{title}</h1>
        {description && <p className="text-xs text-gray-400 mt-2 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
