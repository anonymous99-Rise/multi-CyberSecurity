/**
 * 共享格式化工具。
 *
 * 说明：千分位刻意不用 `toLocaleString()` —— 静态导出时在 Node 端渲染一次、浏览器端再 hydrate 一次，
 * 两端 locale 不一致会产生 hydration 警告。这里用确定性实现，两端结果必然相同。
 */

/** 千分位：1234 → "1,234" */
export const fmt = (n: number): string => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** 十六进制色 + 透明度 → rgba()，用于按分数分档的格子/图例 */
export function hexA(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
