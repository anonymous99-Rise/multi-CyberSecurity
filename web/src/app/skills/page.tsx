"use client";
import { useState, useMemo } from "react";
import { Search, ChevronRight, X, ShieldCheck, Layers } from "lucide-react";
import { modules, skillsIndex, searchSkills, skillsContent, type SkillIndexEntry } from "@/lib/data";
import { cn } from "@/lib/utils";

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function SkillsPage() {
  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillIndexEntry | null>(null);

  const filtered = useMemo(() => {
    if (query.trim()) return searchSkills(query);
    if (selectedModule) return skillsIndex.filter((s) => s.category === selectedModule);
    return skillsIndex;
  }, [query, selectedModule]);

  const attackMapped = useMemo(() => skillsIndex.filter((s) => s.mitre_attack.length > 0).length, []);
  const topModules = useMemo(() => [...modules].sort((a, b) => b.skill_count - a.skill_count).slice(0, 6), []);

  return (
    <div className="flex h-screen">
      {/* Module tree：窄屏隐藏（改用下方列表 + 搜索），避免三栏挤压 */}
      <div className="hidden md:flex md:w-52 shrink-0 border-r border-bg-border bg-bg-secondary/50 flex-col">
        <div className="px-3 py-3 border-b border-bg-border">
          <div className="label-tech mb-2">// MODULES</div>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-2.5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedModule(null); }}
              placeholder="搜索技能 / T-ID…"
              aria-label="搜索技能"
              className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-bg border border-bg-border text-gray-200 placeholder-gray-500 font-mono"
            />
          </div>
        </div>
        <div className="px-2 py-2 overflow-y-auto flex-1">
          <button
            onClick={() => { setSelectedModule(null); setQuery(""); }}
            className={cn(
              "w-full text-left px-2 py-1.5 text-[12px] font-mono mb-0.5 transition-colors flex items-center justify-between",
              !selectedModule && !query ? "text-accent bg-accent/5" : "text-gray-400 hover:text-gray-100 hover:bg-white/5",
            )}
          >
            <span>ALL</span>
            <span className="text-[10px] text-gray-500 metric-num">{skillsIndex.length}</span>
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelectedModule(m.path); setQuery(""); }}
              title={`${m.name_cn} · ${m.name_en}`}
              className={cn(
                "w-full text-left px-2 py-1.5 text-[12px] mb-0.5 flex items-center gap-1.5 transition-colors",
                selectedModule === m.path ? "text-accent bg-accent/5" : "text-gray-400 hover:text-gray-100 hover:bg-white/5",
              )}
            >
              <span className="text-[10px] text-gray-500 metric-num">{String(m.id).padStart(2, "0")}</span>
              <span className="truncate">{m.name_cn}</span>
              <span className="ml-auto text-gray-500 text-[10px] metric-num">{m.skill_count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skill list */}
      <div className="flex-1 md:flex-none md:w-72 xl:w-80 shrink-0 border-r border-bg-border flex flex-col">
        <div className="px-3 py-3 border-b border-bg-border md:sticky md:top-0 bg-bg-secondary/90 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="label-tech">// RESULTS</span>
            <span className="text-[11px] font-mono text-accent metric-num">{filtered.length}</span>
          </div>
          {/* 窄屏下的搜索框（桌面在左栏） */}
          <div className="relative md:hidden">
            <Search size={12} className="absolute left-2 top-2.5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedModule(null); }}
              placeholder="搜索技能 / T-ID…"
              aria-label="搜索技能"
              className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-bg border border-bg-border text-gray-200 placeholder-gray-500 font-mono"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-mono">// 无匹配结果</div>
          ) : (
            filtered.map((skill, i) => (
              <button
                key={i}
                onClick={() => setSelectedSkill(skill)}
                className={cn(
                  "w-full text-left px-3 py-3 border-b border-bg-border/60 hover:bg-white/5 transition-colors",
                  selectedSkill?.name === skill.name && "bg-accent/5 border-l-2 border-l-accent",
                )}
              >
                <h3 className="text-[13px] text-gray-200 mb-1 truncate">{skill.name.split("-")[0]}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{skill.description}</p>
                {skill.mitre_attack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {skill.mitre_attack.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 border border-accent/30 text-accent/80 font-mono metric-num"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel：桌面为右栏；窄屏选中技能时变为整屏浮层 */}
      <div
        className={cn(
          "bg-bg overflow-y-auto",
          selectedSkill ? "fixed inset-0 z-40 lg:static lg:z-auto" : "hidden lg:block lg:flex-1",
          selectedSkill && "lg:flex-1",
        )}
      >
        {selectedSkill ? (
          <div className="p-4 sm:p-6 animate-fade-in">
            {/* 窄屏关闭按钮 */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="lg:hidden mb-3 flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-accent transition-colors"
            >
              <X size={12} /> 返回列表
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="label-tech text-accent/70 mb-1">// SKILL DETAIL</div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 font-mono break-words">
                {selectedSkill.name}
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{selectedSkill.description}</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { l: "CATEGORY", v: selectedSkill.category },
                { l: "SUBDOMAIN", v: selectedSkill.subdomain },
                { l: "VERSION", v: selectedSkill.version },
                { l: "AUTHOR", v: selectedSkill.author },
              ].map((f) => (
                <div key={f.l} className="tac-card p-3 min-w-0">
                  <div className="label-tech mb-1">{f.l}</div>
                  <div className="text-[12px] text-gray-200 font-mono truncate" title={f.v}>{f.v}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {selectedSkill.tags.length > 0 && (
              <div className="mb-5">
                <div className="label-tech mb-2">// TAGS</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 bg-bg-tertiary border border-bg-border text-gray-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ATT&CK + NIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="tac-card p-3">
                <div className="label-tech mb-2">MITRE ATT&amp;CK</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.mitre_attack.length > 0 ? (
                    selectedSkill.mitre_attack.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent font-mono metric-num">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-gray-500 font-mono">—</span>
                  )}
                </div>
              </div>
              <div className="tac-card p-3">
                <div className="label-tech mb-2">NIST CSF</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.nist_csf.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 bg-warning/10 border border-warning/20 text-warning font-mono metric-num">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* MD content */}
            {skillsContent[selectedSkill.name] ? (
              <div className="tac-card p-4 mb-5">
                <div className="label-tech mb-3">// CONTENT</div>
                <div className="bg-black/40 border border-bg-border p-3 overflow-x-auto max-h-[460px] overflow-y-auto">
                  <pre className="text-[12px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {skillsContent[selectedSkill.name]}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="note-strip px-3 py-2.5 mb-5">
                <p className="text-[11px] text-gray-400">
                  该技能的正文未收录到站点数据（`skills_content.json` 只预渲染磁盘上存在的文件）。
                  可直接查看仓库内源文件：<code className="text-accent font-mono break-all">{selectedSkill.file}</code>
                </p>
              </div>
            )}

            {/* File path */}
            <div className="tac-card p-3">
              <div className="label-tech mb-1">FILE PATH</div>
              <code className="text-[11px] text-accent/80 font-mono break-all">{selectedSkill.file}</code>
            </div>
          </div>
        ) : (
          /* 空态：给出信息摘要，而不是一句 "// select a skill" */
          <div className="p-6 lg:p-8 max-w-2xl">
            <div className="label-tech mb-2">// OVERVIEW</div>
            <h2 className="text-lg font-bold text-gray-100 font-mono mb-4">
              技能库 · {fmt(skillsIndex.length)} 个技能 / {modules.length} 个分类
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { l: "SKILLS", v: fmt(skillsIndex.length) },
                { l: "MODULES", v: String(modules.length) },
                { l: "ATT&CK 映射", v: String(attackMapped) },
              ].map((s) => (
                <div key={s.l} className="tac-card p-3">
                  <div className="label-tech mb-1">{s.l}</div>
                  <div className="text-xl font-bold text-gray-100 metric-num">{s.v}</div>
                </div>
              ))}
            </div>
            <ul className="text-[12px] text-gray-400 space-y-2 leading-relaxed mb-6">
              <li className="flex gap-2">
                <Layers size={13} className="text-accent shrink-0 mt-0.5" />
                左侧按 39 个分类浏览，或在搜索框输入技能名 / ATT&amp;CK 技术编号（如 <span className="font-mono text-gray-300">T1059</span>）。
              </li>
              <li className="flex gap-2">
                <ChevronRight size={13} className="text-accent shrink-0 mt-0.5" />
                点击中间列表的任意技能，右侧显示详情（分类、ATT&amp;CK / NIST 映射与正文）。
              </li>
              <li className="flex gap-2">
                <ShieldCheck size={13} className="text-accent shrink-0 mt-0.5" />
                每个技能都带 NIST CSF 控制项标注；{attackMapped} 个技能已映射到 MITRE ATT&amp;CK。
              </li>
            </ul>

            {/* 分类分布：空态也能一眼看出技能集中在哪几类，并可直接点进去 */}
            <div className="label-tech mb-3">// 技能最多的分类</div>
            <div className="space-y-2">
              {topModules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedModule(m.path); setQuery(""); }}
                  className="w-full flex items-center gap-3 text-left group"
                >
                  <span className="text-[11px] font-mono text-gray-500 w-6 metric-num shrink-0">
                    {String(m.id).padStart(2, "0")}
                  </span>
                  <span className="text-[12px] text-gray-300 w-24 sm:w-28 truncate group-hover:text-accent transition-colors shrink-0">
                    {m.name_cn}
                  </span>
                  <span className="flex-1 h-2 bg-bg-tertiary border border-bg-border relative overflow-hidden">
                    <span
                      className="absolute inset-y-0 left-0"
                      style={{ width: `${(m.skill_count / topModules[0].skill_count) * 100}%`, background: "var(--accent-dim)" }}
                    />
                  </span>
                  <span className="text-[11px] font-mono text-accent w-6 text-right metric-num shrink-0">
                    {m.skill_count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
