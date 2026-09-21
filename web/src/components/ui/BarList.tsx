import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BarListItem {
  /** 左侧标签（等宽列） */
  label: string;
  value: number;
  /** 右侧值文本（默认显示 value） */
  valueText?: ReactNode;
  /** 点击回调（如跳转到对应分类） */
  onClick?: () => void;
  title?: string;
}

/**
 * 条形列表：NIST CSF 分布、技能最多的分类等共用一处实现。
 * 之前首页、ATT&CK、技能库空态各写了一套。宽度按 items 内最大值归一。
 */
export function BarList({
  items,
  labelWidth = "w-20",
  barHeight = "h-3",
  valueWidth = "w-9",
  className,
}: {
  items: BarListItem[];
  labelWidth?: string;
  barHeight?: string;
  valueWidth?: string;
  className?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className={cn("space-y-2.5", className)}>
      {items.map((item) => {
        const row = (
          <>
            <span className={cn("text-[11px] font-mono text-ink-muted tracking-wider shrink-0 truncate", labelWidth)}>
              {item.label}
            </span>
            <span className={cn("flex-1 bg-bg-tertiary border border-bg-border relative overflow-hidden", barHeight)}>
              <span
                className="absolute inset-y-0 left-0 transition-all duration-700"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: "linear-gradient(90deg, var(--accent-dim), var(--accent))",
                }}
              />
            </span>
            <span className={cn("text-[11px] font-mono text-accent text-right metric-num shrink-0", valueWidth)}>
              {item.valueText ?? item.value}
            </span>
          </>
        );

        return item.onClick ? (
          <button
            key={item.label}
            onClick={item.onClick}
            title={item.title}
            className="w-full flex items-center gap-3 text-left group hover:bg-overlay transition-colors"
          >
            {row}
          </button>
        ) : (
          <div key={item.label} className="flex items-center gap-3" title={item.title}>
            {row}
          </div>
        );
      })}
    </div>
  );
}
