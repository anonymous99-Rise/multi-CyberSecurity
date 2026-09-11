"use client";
import { useState, useMemo } from "react";
import { Search, ChevronRight, X } from "lucide-react";
import { modules, skillsIndex, searchSkills, skillsContent, type SkillIndexEntry } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillIndexEntry | null>(null);

  const filtered = useMemo(() => {
    if (query.trim()) return searchSkills(query);
    if (selectedModule) return skillsIndex.filter((s) => s.category === selectedModule);
    return skillsIndex;
  }, [query, selectedModule]);

  return (
    <div className="flex h-screen">
      {/* 左侧模块树 */}
      <div className="w-56 shrink-0 border-r border-bg-border bg-bg-secondary overflow-y-auto">
        <div className="p-3 sticky top-0 bg-bg-secondary z-10">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-600" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedModule(null); }}
              placeholder="搜索技能..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-bg border border-bg-border rounded text-gray-300 focus:border-accent/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="px-2 pb-4">
          <button
            onClick={() => { setSelectedModule(null); setQuery(""); }}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded text-xs mb-0.5",
              !selectedModule && !query ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-gray-200",
            )}
          >
            全部 ({skillsIndex.length})
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelectedModule(m.path); setQuery(""); }}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded text-xs mb-0.5 flex items-center gap-2",
                selectedModule === m.path ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
              )}
            >
              <span>{m.emoji}</span>
              <span className="truncate">{m.name_cn}</span>
              <span className="ml-auto text-gray-600">{m.skill_count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 中间技能列表 */}
      <div className="w-80 shrink-0 border-r border-bg-border overflow-y-auto">
        <div className="px-4 py-3 border-b border-bg-border sticky top-0 bg-bg-secondary z-10">
          <p className="text-xs text-gray-500">
            {filtered.length} 个结果
            {selectedModule && ` · ${modules.find(m => m.path === selectedModule)?.name_cn}`}
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-600 text-sm">无匹配结果</div>
        ) : (
          filtered.map((skill, i) => (
            <button
              key={i}
              onClick={() => setSelectedSkill(skill)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-bg-border/50 hover:bg-white/5 transition-colors",
                selectedSkill?.name === skill.name && "bg-accent/5",
              )}
            >
              <h3 className="text-sm text-gray-200 mb-1">{skill.name.split("-")[0]}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {skill.mitre_attack.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent/70 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))
        )}
      </div>

      {/* 右侧详情 */}
      <div className="flex-1 overflow-y-auto">
        {selectedSkill ? (
          <div className="p-6">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-300"
            >
              <X size={18} />
            </button>
            <h1 className="text-xl font-bold text-gray-100 mb-2">{selectedSkill.name}</h1>
            <p className="text-sm text-gray-400 mb-4">{selectedSkill.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="分类" value={selectedSkill.category} />
              <Field label="子域" value={selectedSkill.subdomain} />
              <Field label="版本" value={selectedSkill.version} />
              <Field label="作者" value={selectedSkill.author} />
            </div>
            <div className="mb-6">
              <h2 className="text-xs text-gray-500 mb-2">标签</h2>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkill.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400">{t}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xs text-gray-500 mb-2">MITRE ATT&CK</h2>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.mitre_attack.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-accent/10 text-accent/80 rounded font-mono">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xs text-gray-500 mb-2">NIST CSF</h2>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.nist_csf.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-warning/10 text-warning/80 rounded font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* MD 正文 */}
            {skillsContent[selectedSkill.name] && (
              <div className="mt-6 pt-4 border-t border-bg-border">
                <h2 className="text-xs text-gray-500 mb-3">技能正文</h2>
                <div className="p-4 bg-black/50 border border-bg-border rounded-lg overflow-x-auto">
                  <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {skillsContent[selectedSkill.name]}
                  </pre>
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-bg-border">
              <p className="text-xs text-gray-600">文件路径</p>
              <code className="text-xs text-gray-400 font-mono break-all">{selectedSkill.file}</code>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <div className="text-center">
              <ChevronRight size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">选择一个技能查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-300 mt-0.5">{value}</p>
    </div>
  );
}
