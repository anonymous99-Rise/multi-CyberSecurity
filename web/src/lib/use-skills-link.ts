"use client";
import { useCallback, useEffect, useState } from "react";
import { buildSkillsHash, parseSkillsHash, type SkillsLinkState } from "./deeplink";

/**
 * 把技能库的选中状态同步到 URL hash（可分享 / 可前进后退）。
 *
 * 注意：初始状态刻意用 `{}` 启动，再在 effect 里读取 hash —— 静态导出会先生成 HTML 再 hydrate，
 * 若首帧就依赖 window.location 会导致 hydration 不一致。
 */
export function useSkillsLinkState() {
  const [state, setState] = useState<SkillsLinkState>({});

  useEffect(() => {
    setState(parseSkillsHash(window.location.hash));
    const sync = () => setState(parseSkillsHash(window.location.hash));
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const update = useCallback((next: SkillsLinkState, replace = false) => {
    const hash = buildSkillsHash(next);
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    // 选择分类/技能用 pushState（浏览器后退可回上一步）；输入搜索词用 replaceState 避免刷满历史
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    setState(next);
  }, []);

  return { state, update };
}
