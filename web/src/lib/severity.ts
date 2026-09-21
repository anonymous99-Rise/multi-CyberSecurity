/**
 * ATT&CK 分数 → 严重度分档。放在 lib 里而不是页面内，
 * 便于图例、矩阵格子、未来其它视图共用同一套分档（避免三处各写一遍导致不一致）。
 */
export interface SeverityStep {
  /** 该档的上界分数（含） */
  max: number;
  color: string;
  label: string;
  bg: number;
  border: number;
}

export const SEVERITY_RAMP: SeverityStep[] = [
  { max: 2, color: "#00ff88", label: "0-2", bg: 0.08, border: 0.35 },
  { max: 4, color: "#ffd000", label: "3-4", bg: 0.2, border: 0.6 },
  { max: 7, color: "#ff7a00", label: "5-7", bg: 0.38, border: 0.85 },
  { max: Infinity, color: "#ff0040", label: "8+", bg: 0.58, border: 1 },
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
