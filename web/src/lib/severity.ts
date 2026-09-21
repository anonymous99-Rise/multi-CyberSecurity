/**
 * ATT&CK 分数 → 严重度分档。放在 lib 里而不是页面内，
 * 便于图例、矩阵格子、未来其它视图共用同一套分档（避免三处各写一遍导致不一致）。
 */
export interface SeverityStep {
  /** 该档的上界分数（含） */
  max: number;
  /** 文字/标记色 */
  color: string;
  /** 格子底色 */
  bg: string;
  /** 格子描边色 */
  border: string;
  label: string;
}

/**
 * 四档色阶的色值全部走 CSS 变量（见 globals.css 的 --sevN / --sevN-bg / --sevN-bd），
 * 这样浅色主题可以单独调深，而组件端不必知道当前主题（也就不会出现 SSR/hydration 不一致）。
 */
export const SEVERITY_RAMP: SeverityStep[] = [
  { max: 2, color: "var(--sev1)", bg: "var(--sev1-bg)", border: "var(--sev1-bd)", label: "0-2" },
  { max: 4, color: "var(--sev2)", bg: "var(--sev2-bg)", border: "var(--sev2-bd)", label: "3-4" },
  { max: 7, color: "var(--sev3)", bg: "var(--sev3-bg)", border: "var(--sev3-bd)", label: "5-7" },
  { max: Infinity, color: "var(--sev4)", bg: "var(--sev4-bg)", border: "var(--sev4-bd)", label: "8+" },
];

export const severityStep = (score: number): SeverityStep =>
  SEVERITY_RAMP.find((s) => score <= s.max) ?? SEVERITY_RAMP[SEVERITY_RAMP.length - 1];

/** 统计各档落了多少技术（图例上标 ×N） */
export function severityBuckets(scores: number[]): number[] {
  const counts = SEVERITY_RAMP.map(() => 0);
  for (const score of scores) {
    const idx = SEVERITY_RAMP.findIndex((s) => score <= s.max);
    if (idx >= 0) counts[idx] += 1;
  }
  return counts;
}

/** NIST CSF 五大功能的中文/英文显示名 */
export const CSF_LABELS: Record<string, string> = {
  ID: "IDENTIFY",
  PR: "PROTECT",
  DE: "DETECT",
  RS: "RESPOND",
  RC: "RECOVER",
};
