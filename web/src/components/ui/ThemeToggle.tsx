"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "mcs-theme";

/**
 * 深浅主题切换。
 *
 * 首帧刻意渲染成深色（与静态导出的 HTML 一致），挂载后再从 <html> 上的类读取真实主题，
 * 避免 hydration 不一致；实际主题在 layout.tsx 的内联脚本里于首次绘制前就已应用。
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("light", next === "light");
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 隐私模式等场景下 localStorage 不可写，忽略即可（仅本次会话生效）
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "切换到浅色主题" : "切换到深色主题";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex items-center gap-1.5 text-[10px] font-mono text-ink-faint hover:text-accent transition-colors"
    >
      {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
      {theme === "dark" ? "LIGHT" : "DARK"}
    </button>
  );
}
