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
      {/* Module tree */}
      <div className="w-48 shrink-0 border-r border-bg-border bg-bg-secondary/50 overflow-y-auto">
        <div className="px-3 py-3 sticky top-0 bg-bg-secondary/90 backdrop-blur-sm z-10 border-b border-bg-border">
          <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-2">// MODULES</div>
          <div className="relative">
            <Search size={11} className="absolute left-2 top-2 text-gray-700" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedModule(null); }}
              placeholder="search..."
              className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-bg border border-bg-border text-gray-300 placeholder-gray-700 font-mono"
            />
          </div>
        </div>
        <div className="px-2 py-2">
          <button
            onClick={() => { setSelectedModule(null); setQuery(""); }}
            className={cn(
              "w-full text-left px-2 py-1 text-[11px] font-mono mb-0.5 transition-colors",
              !selectedModule && !query ? "text-accent bg-accent/5" : "text-gray-500 hover:text-gray-300",
            )}
          >
            ALL [{skillsIndex.length}]
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelectedModule(m.path); setQuery(""); }}
              className={cn(
                "w-full text-left px-2 py-1 text-[11px] mb-0.5 flex items-center gap-1.5 transition-colors",
                selectedModule === m.path ? "text-accent bg-accent/5" : "text-gray-500 hover:text-gray-300",
              )}
            >
              <span className="text-[9px] text-gray-700">{String(m.id).padStart(2, "0")}</span>
              <span className="truncate">{m.name_cn}</span>
              <span className="ml-auto text-gray-700 text-[9px]">{m.skill_count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skill list */}
      <div className="w-72 shrink-0 border-r border-bg-border overflow-y-auto">
        <div className="px-3 py-3 border-b border-bg-border sticky top-0 bg-bg-secondary/90 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
              // RESULTS
            </span>
            <span className="text-[10px] font-mono text-accent/60">{filtered.length}</span>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-700 text-xs font-mono">// no matches</div>
        ) : (
          filtered.map((skill, i) => (
            <button
              key={i}
              onClick={() => setSelectedSkill(skill)}
              className={cn(
                "w-full text-left px-3 py-2.5 border-b border-bg-border/30 hover:bg-accent/5 transition-colors",
                selectedSkill?.name === skill.name && "bg-accent/5 border-l-2 border-l-accent",
              )}
            >
              <h3 className="text-[12px] text-gray-200 mb-0.5 truncate">
                {skill.name.split("-")[0]}
              </h3>
              <p className="text-[10px] text-gray-600 line-clamp-1">{skill.description}</p>
              {skill.mitre_attack.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {skill.mitre_attack.slice(0, 2).map((t) => (
                    <span key={t} className="text-[8px] px-1 py-0.5 bg-accent/8 text-accent/60 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedSkill ? (
          <div className="p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-5">
              <div className="text-[9px] text-accent/50 font-mono tracking-widest uppercase mb-1">
                // SKILL DETAIL
              </div>
              <h1 className="text-xl font-bold text-gray-100 font-mono">{selectedSkill.name}</h1>
              <p className="text-xs text-gray-500 mt-1">{selectedSkill.description}</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { l: "CATEGORY", v: selectedSkill.category },
                { l: "SUBDOMAIN", v: selectedSkill.subdomain },
                { l: "VERSION", v: selectedSkill.version },
                { l: "AUTHOR", v: selectedSkill.author },
              ].map((f) => (
                <div key={f.l} className="tac-card p-3">
                  <div className="text-[8px] text-gray-600 font-mono tracking-widest mb-0.5">{f.l}</div>
                  <div className="text-xs text-gray-300 font-mono">{f.v}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {selectedSkill.tags.length > 0 && (
              <div className="mb-5">
                <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-2">// TAGS</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.tags.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary border border-bg-border text-gray-500 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ATT&CK + NIST */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="tac-card p-3">
                <div className="text-[8px] text-gray-600 font-mono tracking-widest mb-2">MITRE ATT&CK</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.mitre_attack.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-accent/8 text-accent/70 font-mono">{t}</span>
                  ))}
                </div>
              </div>
              <div className="tac-card p-3">
                <div className="text-[8px] text-gray-600 font-mono tracking-widest mb-2">NIST CSF</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.nist_csf.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-warning/8 text-warning/70 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* MD content */}
            {skillsContent[selectedSkill.name] && (
              <div className="tac-card p-4 mb-5">
                <div className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-3">
                  // CONTENT
                </div>
                <div className="bg-black/40 border border-bg-border p-3 overflow-x-auto max-h-[400px] overflow-y-auto">
                  <pre className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {skillsContent[selectedSkill.name]}
                  </pre>
                </div>
              </div>
            )}

            {/* File path */}
            <div className="tac-card p-3">
              <div className="text-[8px] text-gray-600 font-mono tracking-widest mb-1">FILE PATH</div>
              <code className="text-[11px] text-accent/60 font-mono break-all">{selectedSkill.file}</code>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-700">
            <div className="text-center">
              <ChevronRight size={20} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-mono">// select a skill</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
