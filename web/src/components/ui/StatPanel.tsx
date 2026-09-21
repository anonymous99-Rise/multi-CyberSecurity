import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: string | number;
  /** 数字下方的小字说明 */
  sub?: string;
  /** 标记色（默认主色）；只有 EXTERNAL 这类"另一维度"才用信息色 */
  color?: string;
}

/**
 * 统计面板：一个面板 + 发丝分隔线，所有数字同色同权重，颜色只作短横标记。
 * 原先首页/ATT&CK 各自实现一套"每卡一色"的统计卡，导致一屏 5 种颜色。
 */
export function StatPanel({
  items,
  columns = 5,
  className,
}: {
  items: StatItem[];
  /** 桌面端列数（窄屏固定 2 列） */
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "md:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
  }[columns];

  const divider = columns >= 4 ? "md:divide-y-0" : "sm:divide-y-0";

  return (
    <div className={cn("tac-card", className)}>
      <div className={cn("grid grid-cols-2 divide-x divide-y divide-bg-border", colClass, divider)}>
        {items.map((s) => (
          <div key={s.label} className="p-4 min-w-0">
            <span className="block h-[2px] w-8 mb-2.5" style={{ background: s.color ?? "var(--accent)" }} />
            <div className="label-tech mb-1.5 truncate">{s.label}</div>
            <div className="text-2xl sm:text-3xl font-bold metric-num truncate text-ink">{s.value}</div>
            {s.sub && (
              <div
                className="text-[10px] mt-1 truncate"
                style={{ color: s.color && s.color !== "var(--accent)" ? s.color : "var(--text-3)" }}
              >
                {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
