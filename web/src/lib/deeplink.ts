/**
 * 技能库深链（hash 形式）。
 *
 * 为什么用 hash 而不是 query：站点是 `output: "export"` 静态导出，
 * `useSearchParams()` 需要 Suspense 边界且会在构建期报错，而 hash 天然只在客户端生效、
 * 不参与服务端渲染，也就没有 hydration 不一致的风险。链接形如：
 *   https://<site>/skills/#module=01-信息搜集-Reconnaissance
 *   https://<site>/skills/#skill=子域名探测-subdomain-discovery
 *   https://<site>/skills/#q=T1059
 */

export interface SkillsLinkState {
  q?: string;
  module?: string;
  skill?: string;
}

const KEYS: (keyof SkillsLinkState)[] = ["q", "module", "skill"];

/**
 * 容错解码：被截断或手改坏的链接（如 `%E5%AD`）会让 decodeURIComponent 抛 URIError，
 * 直接把整页渲染打断 —— 这里失败时退回原文，绝不让解析崩溃。
 */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** 解析 hash（容忍前导 #、空值、未知键、重复键取首个、非法的百分号编码） */
export function parseSkillsHash(hash: string): SkillsLinkState {
  const raw = (hash || "").replace(/^#/, "").trim();
  if (!raw) return {};

  const state: SkillsLinkState = {};
  for (const part of raw.split("&")) {
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const key = safeDecode(part.slice(0, eq));
    const value = safeDecode(part.slice(eq + 1));
    if (!KEYS.includes(key as keyof SkillsLinkState)) continue;
    if (!value) continue;
    if (state[key as keyof SkillsLinkState] !== undefined) continue;
    state[key as keyof SkillsLinkState] = value;
  }
  return state;
}

/** 生成 hash（固定键顺序，省略空值；无内容时返回空串） */
export function buildSkillsHash(state: SkillsLinkState): string {
  const parts = KEYS.filter((k) => {
    const v = state[k];
    return typeof v === "string" && v.length > 0;
  }).map((k) => `${k}=${encodeURIComponent(state[k] as string)}`);
  return parts.length > 0 ? `#${parts.join("&")}` : "";
}

/** 深链是否为空（用于判断要不要写历史记录） */
export const isEmptySkillsLink = (state: SkillsLinkState): boolean => buildSkillsHash(state) === "";
