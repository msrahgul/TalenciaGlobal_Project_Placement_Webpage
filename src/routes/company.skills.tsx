import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Lock, Zap, Info } from "lucide-react";

import { useCompanySkills } from "@/lib/companyApi";
import { useCompany, readStoredCompany } from "@/context/CompanyContext";
import {
  proficiencyToBloom,
  scoreToCriticality,
} from "@/lib/companyData";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence — KITS Placement Hub" },
      {
        name: "description",
        content: "Bloom-mapped skill ladder and 10-level topic roadmaps.",
      },
    ],
  }),
  component: SkillIntelligencePage,
});

const BLOOM_LEGEND = [
  { code: "CU", label: "Understand", color: "#3b82f6", from: "#93c5fd", to: "#3b82f6" },
  { code: "AP", label: "Apply",      color: "#22c55e", from: "#86efac", to: "#22c55e" },
  { code: "AS", label: "Analyze",    color: "#eab308", from: "#fde047", to: "#eab308" },
  { code: "EV", label: "Evaluate",   color: "#ef4444", from: "#fca5a5", to: "#ef4444" },
  { code: "CR", label: "Create",     color: "#a855f7", from: "#d8b4fe", to: "#a855f7" },
];

const CRIT_LEGEND = [
  { label: "Critical",  color: "#ef4444", bg: "rgba(239,68,68,0.08)",  desc: "Score ≥ 7 — must clear for the role." },
  { label: "Important", color: "#d97706", bg: "rgba(217,119,6,0.08)",  desc: "Score 5–6 — strong differentiator." },
  { label: "Baseline",  color: "#16a34a", bg: "rgba(22,163,74,0.08)",  desc: "Score ≤ 4 — foundational coverage." },
];

function GlowBar({ level, color, from, to }: { level: number; color: string; from: string; to: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-950 border border-slate-900/50">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level * 10}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{
            background: `linear-gradient(90deg, ${from}, ${to})`,
            boxShadow: `0 0 12px ${color}55`,
          }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-400">
        {level}<span className="font-normal text-slate-500">/10</span>
      </span>
    </div>
  );
}

function SkillIntelligencePage() {
  const { selected } = useCompany();
  const stored = selected ?? readStoredCompany();
  const companyId = stored?.companyId ?? 1;

  const { data, isLoading, isError, refetch } = useCompanySkills(companyId);
  const skills = (data?.skills ?? []).slice().sort((a, b) => b.required_level - a.required_level);
  const roadmaps = data?.roadmaps ?? {};

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [showMobileLegends, setShowMobileLegends] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Body Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Skeleton */}
          <div className="hidden lg:flex lg:flex-col gap-4 w-80 shrink-0">
            <div className="h-56 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900" />
            <div className="h-44 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900" />
          </div>
          {/* Right Feed Skeleton */}
          <div className="flex-1 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-900/40 border border-slate-900" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-sm font-medium text-red-400">Failed to load skill intelligence data.</p>
        <Button variant="outline" className="mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground">
        No skill requirements registered for this company.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6">

      {/* ── Dual-Pane Layout Grid ─────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ── Left Column: Legends & Guides (Desktop Only) ── */}
        <div className="hidden lg:flex lg:flex-col gap-4 w-80 sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 no-scrollbar shrink-0">
          
          {/* Bloom's Levels */}
          <div className="rounded-2xl border border-slate-850/80 bg-slate-950/30 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--theme-text)]" />
              <h2 className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Bloom's Taxonomy Levels
              </h2>
            </div>
            
            <div className="relative flex flex-col gap-4 pl-1">
              {/* Connecting vertical line */}
              <div className="absolute left-[13px] top-3 bottom-6 w-0.5 bg-slate-900" />
              
              {BLOOM_LEGEND.map((b) => (
                <div key={b.code} className="relative flex items-center gap-3">
                  <div
                    className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${b.from}, ${b.to})`,
                      boxShadow: `0 2px 8px -1px ${b.color}44`,
                    }}
                  >
                    {b.code}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-200">{b.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Criticality Guide */}
          <div className="rounded-2xl border border-slate-850/80 bg-slate-950/30 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-500" />
              <h2 className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Criticality Guidelines
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {CRIT_LEGEND.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-slate-900/60 p-3"
                  style={{ background: c.bg }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: c.color,
                        boxShadow: `0 0 6px ${c.color}`,
                      }}
                    />
                    <h3 className="font-heading text-xs font-bold" style={{ color: c.color }}>{c.label}</h3>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Collapsible Legends ── */}
        <div className="w-full lg:hidden border border-slate-850/80 bg-slate-950/20 rounded-2xl overflow-hidden transition-all duration-300">
          <button
            onClick={() => setShowMobileLegends(!showMobileLegends)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--theme-text)]" />
              <span>Taxonomy Legends & Guidelines</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showMobileLegends ? "rotate-180" : ""}`} />
          </button>
          
          {showMobileLegends && (
            <div className="p-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40">
              {/* Bloom levels block */}
              <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-4">
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Bloom's Levels</h3>
                <div className="grid grid-cols-5 gap-2">
                  {BLOOM_LEGEND.map((b) => (
                    <div key={b.code} className="flex flex-col items-center gap-1">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                        style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
                      >
                        {b.code}
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Criticality guidlines block */}
              <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-4">
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Criticality Guide</h3>
                <div className="flex flex-col gap-2">
                  {CRIT_LEGEND.map((c) => (
                    <div key={c.label} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold" style={{ color: c.color }}>{c.label}</span>
                      <span className="text-slate-400 text-right">{c.desc.split(" — ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Interactive Skills Feed ── */}
        <div className="flex-grow space-y-4 w-full">
          {skills.map((skill, idx) => {
            const bloom = proficiencyToBloom(skill.required_level);
            const crit = scoreToCriticality(skill.required_level);
            const bloomData = BLOOM_LEGEND.find(b => b.color === bloom.color) ?? BLOOM_LEGEND[0];
            const isOpen = !!open[skill.skill_set_id];
            const roadmap = roadmaps[skill.skill_set_id] ?? [];

            return (
              <motion.div
                key={skill.skill_set_id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.4, delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-slate-850/80 bg-gradient-to-b from-slate-900/40 to-slate-950/95 overflow-hidden shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-[var(--theme-gradient-from)] hover:to-[var(--theme-gradient-to)] hover:border-[var(--theme-border)] hover:shadow-[0_0_30px_var(--theme-shadow)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen((o) => ({ ...o, [skill.skill_set_id]: !o[skill.skill_set_id] }))
                  }
                  className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-slate-900/20 cursor-pointer"
                >
                  {/* Left: level indicator */}
                  <div
                    className="mt-0.5 flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white font-heading"
                    style={{
                      background: `linear-gradient(135deg, ${bloomData.from}, ${bloomData.to})`,
                      boxShadow: `0 4px 14px -4px ${bloom.color}55`,
                    }}
                  >
                    <span className="text-sm font-extrabold leading-none">{skill.required_level}</span>
                    <span className="text-[9px] font-medium opacity-80 mt-0.5">/10</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-slate-100 sm:text-base">
                        {skill.skill_set_name}
                      </h3>
                      {/* Bloom pill */}
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${bloomData.from}, ${bloomData.to})`,
                          boxShadow: `0 2px 8px -2px ${bloom.color}55`,
                        }}
                      >
                        {bloom.code} · {bloom.label}
                      </span>
                      {/* Criticality pill */}
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: `${crit.color}15`,
                          color: crit.color,
                          border: `1px solid ${crit.color}30`,
                        }}
                      >
                        {crit.label}
                      </span>
                    </div>

                    {/* Proficiency label */}
                    <p className="mt-1.5 text-xs text-slate-400">
                      Required proficiency: <span className="font-semibold text-slate-200">{skill.required_proficiency}</span>
                    </p>

                    {/* Glow bar */}
                    <div className="mt-4">
                      <GlowBar
                        level={skill.required_level}
                        color={bloom.color}
                        from={bloomData.from}
                        to={bloomData.to}
                      />
                    </div>
                  </div>

                  {/* Toggle indicator */}
                  <div className="mt-1 shrink-0 p-1.5 rounded-lg bg-slate-950/40 border border-slate-900">
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </motion.div>
                  </div>
                </button>

                {/* ── Spring Accordion Roadmap (Timeline format) ─────────── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="roadmap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-900 bg-slate-950/30 px-5 pb-6 pt-5">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                          <Zap className="h-3.5 w-3.5 text-[var(--theme-text)] animate-pulse" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            10-Level Topic Learning Roadmap
                          </h4>
                        </div>
                        
                        {/* Interactive vertical roadmap timeline */}
                        <div className="relative pl-2 space-y-4">
                          {/* Timeline path line */}
                          <div className="absolute left-[15px] top-4 bottom-8 w-0.5 bg-slate-900" />
                          
                          {roadmap.map((topic, i) => {
                            const level = i + 1;
                            const locked = level > skill.required_level;
                            const levelBloom = proficiencyToBloom(level);
                            const levelBloomData = BLOOM_LEGEND.find(b => b.color === levelBloom.color) ?? BLOOM_LEGEND[0];
                            
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02, duration: 0.3 }}
                                className={`relative flex items-start gap-4 rounded-xl border p-3 transition-all duration-300 ${
                                  locked
                                    ? "border-slate-900/40 bg-slate-950/10 opacity-30"
                                    : "border-slate-900 bg-slate-950/50 hover:border-slate-800 shadow-sm"
                                }`}
                              >
                                {/* Circle node step */}
                                <div
                                  className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                                  style={
                                    locked
                                      ? { background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)" }
                                      : {
                                          background: `linear-gradient(135deg, ${levelBloomData.from}, ${levelBloomData.to})`,
                                          boxShadow: `0 2px 6px -2px ${levelBloom.color}77`,
                                        }
                                  }
                                >
                                  {level}
                                </div>
                                
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <div className="text-sm font-semibold text-slate-200 leading-snug">{topic}</div>
                                  {locked ? (
                                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                      <Lock className="h-3 w-3" /> Beyond Scope of Role
                                    </div>
                                  ) : (
                                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--theme-text-hover)' }}>
                                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-icon)' }} />
                                      Coverage Required
                                    </div>
                                  )}
                                </div>

                                <span
                                  className={`hidden sm:inline-flex rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase shrink-0 border ${
                                    locked
                                      ? "bg-slate-900/20 border-slate-900 text-slate-500"
                                      : "bg-slate-950/60 border-slate-900 text-slate-400"
                                  }`}
                                >
                                  {levelBloom.code}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
