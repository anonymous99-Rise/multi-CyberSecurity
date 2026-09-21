"use client";
import { useState, useMemo } from "react";
import { Search, ChevronRight, X, ShieldCheck, Layers } from "lucide-react";
import { modules, skillsIndex, searchSkills, skillsContent, getTopModules, getAttackMappedCount, type SkillIndexEntry } from "@/lib/data";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import { StatPanel } from "@/components/ui/StatPanel";
import { BarList } from "@/components/ui/BarList";

export default function SkillsPage() {
  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillIndexEntry | null>(null);

  const filtered = useMemo(() => {
    if (query.trim()) return searchSkills(query);
    if (selectedModule) return skillsIndex.filter((s) => s.category === selectedModule);
    return skillsIndex;
  }, [query, selectedModule]);

  const attackMapped = useMemo(() => getAttackMappedCount(), []);
  const topModules = useMemo(() => getTopModules(6), []);

  const selectModule = (path: string | null) => {
    setSelectedModule(path);
    setQuery("");
  };

  return (
    <div className="flex h-screen">
      {/* 分类树：窄屏隐藏（改用下方列表 + 搜索），避免三栏在手机上被压扁 */}
      <aside className="hidden md:flex md:w-52 shrink-0 border-r border-bg-border bg-bg-secondary/50 flex-col">
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
            onClick={() => selectModule(null)}
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
              onClick={() => selectModule(m.path)}
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
      </aside>

      {/* 结果列表：min-w-0 必须保留 —— flex 子项默认 min-width:auto，
          会被内部横向滚动条的 max-content 宽度撑开，导致整页被裁切 */}
      <div className="flex-1 md:flex-none md:w-72 xl:w-80 shrink-0 min-w-0 border-r border-bg-border flex flex-col">
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
          {/* 窄屏下的分类筛选（桌面在左栏；此前手机上完全没有分类入口） */}
          <div className="md:hidden mt-2 overflow-x-auto">
            <div className="flex gap-1.5 w-max pb-1 pr-2">
              <button
                onClick={() => selectModule(null)}
                className={cn(
                  "shrink-0 px-2 py-1 text-[11px] font-mono border transition-colors",
                  !selectedModule && !query
                    ? "border-accent/40 text-accent bg-accent/5"
                    : "border-bg-border text-gray-400 hover:text-gray-100",
                )}
              >
                ALL {skillsIndex.length}
              </button>
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectModule(m.path)}
                  className={cn(
                    "shrink-0 px-2 py-1 text-[11px] font-mono border transition-colors",
                    selectedModule === m.path
                      ? "border-accent/40 text-accent bg-accent/5"
                      : "border-bg-border text-gray-400 hover:text-gray-100",
                  )}
                >
                  {String(m.id).padStart(2, "0")} {m.name_cn}
                </button>
              ))}
            </div>
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
                      <Chip key={t} variant="accent" className="px-1.5 py-0.5 text-[10px]">
                        {t}
                      </Chip>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* 详情：桌面为右栏；窄屏选中技能时变为整屏浮层 */}
      <div
        className={cn(
          "bg-bg overflow-y-auto min-w-0",
          selectedSkill ? "fixed inset-0 z-40 lg:static lg:z-auto" : "hidden lg:block lg:flex-1",
          selectedSkill && "lg:flex-1",
        )}
      >
        {selectedSkill ? (
          <div className="p-4 sm:p-6 animate-fade-in">
            <button
              onClick={() => setSelectedSkill(null)}
              className="lg:hidden mb-3 flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-accent transition-colors"
            >
              <X size={12} /> 返回列表
            </button>

            <div className="mb-5">
              <div className="label-tech text-accent/70 mb-1">// SKILL DETAIL</div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 font-mono break-words">
                {selectedSkill.name}
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{selectedSkill.description}</p>
            </div>

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

            {selectedSkill.tags.length > 0 && (
              <div className="mb-5">
                <div className="label-tech mb-2">// TAGS</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="tac-card p-3">
                <div className="label-tech mb-2">MITRE ATT&amp;CK</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.mitre_attack.length > 0 ? (
                    selectedSkill.mitre_attack.map((t) => (
                      <Chip key={t} variant="accent">{t}</Chip>
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
                    <Chip key={t} variant="warning">{t}</Chip>
                  ))}
                </div>
              </div>
            </div>

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

            <div className="tac-card p-3">
              <div className="label-tech mb-1">FILE PATH</div>
              <code className="text-[11px] text-accent/80 font-mono break-all">{selectedSkill.file}</code>
            </div>
          </div>
        ) : (
          /* 空态：给信息摘要，而不是一句 "// select a skill" */
          <div className="p-6 lg:p-8 max-w-2xl">
            <div className="label-tech mb-2">// OVERVIEW</div>
            <h2 className="text-lg font-bold text-gray-100 font-mono mb-4">
              技能库 · {fmt(skillsIndex.length)} 个技能 / {modules.length} 个分类
            </h2>

            <StatPanel
              className="mb-6"
              columns={3}
              items={[
                { label: "SKILLS", value: fmt(skillsIndex.length) },
                { label: "MODULES", value: modules.length },
                { label: "ATT&CK 映射", value: attackMapped },
              ]}
            />

            <ul className="text-[12px] text-gray-400 space-y-2 leading-relaxed mb-6">
              <li className="flex gap-2">
                <Layers size={13} className="text-accent shrink-0 mt-0.5" />
                左侧按 {modules.length} 个分类浏览，或在搜索框输入技能名 / ATT&amp;CK 技术编号（如{" "}
                <span className="font-mono text-gray-300">T1059</span>）。
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

            <div className="label-tech mb-3">// 技能最多的分类</div>
            <BarList
              items={topModules.map((m) => ({
                label: String(m.id).padStart(2, "0") + " " + m.name_cn,
                value: m.skill_count,
                title: `${m.name_cn} · ${m.name_en}`,
                onClick: () => selectModule(m.path),
              }))}
              labelWidth="w-40"
              barHeight="h-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
