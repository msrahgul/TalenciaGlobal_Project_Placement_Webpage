import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Trophy, TrendingUp, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// ── Types ──────────────────────────────────────────────────────────────────
const STAGE_RANK: Record<string, number> = {
  Ready: 5,
  "Interview Prep": 4,
  "Skill Building": 3,
  Researching: 2,
  "Not Started": 1,
};

const STAGE_COLORS: Record<string, string> = {
  Ready: "#4ade80",
  "Interview Prep": "#fb923c",
  "Skill Building": "#a78bfa",
  Researching: "#38bdf8",
  "Not Started": "#64748b",
};

interface TrackingRow {
  student_id: string;
  preparation_stage: string;
  last_updated: string;
  student_profiles: {
    name: string | null;
    avatar_url: string | null;
    readiness_score: number | null;
  } | null;
}

interface RankedEntry {
  studentId: string;
  name: string;
  avatarUrl: string;
  readinessScore: number;
  stage: string;
  rank: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getInitialsAvatar(name: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e293b&textColor=94a3b8`;
}

function computePercentile(rank: number, total: number): number {
  if (total <= 1) return 100;
  return Math.round(((total - rank) / (total - 1)) * 100);
}

// ── Component ──────────────────────────────────────────────────────────────
export function CompanyLeaderboard({ companyId }: { companyId: number }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<RankedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    async function fetchLeaderboard() {
      try {
        // Fetch all tracking rows for this company, joined with student profile
        const { data, error } = await supabase
          .from("student_company_tracking")
          .select(`
            student_id,
            preparation_stage,
            last_updated,
            student_profiles (
              name,
              avatar_url,
              readiness_score
            )
          `)
          .eq("company_id", companyId)
          .order("last_updated", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
          setEntries([]);
          return;
        }

        // Sort: stage rank DESC, then readiness_score DESC
        const sorted = (data as unknown as TrackingRow[])
          .slice()
          .sort((a, b) => {
            const stageA = STAGE_RANK[a.preparation_stage] ?? 0;
            const stageB = STAGE_RANK[b.preparation_stage] ?? 0;
            if (stageB !== stageA) return stageB - stageA;
            const scoreA = a.student_profiles?.readiness_score ?? 0;
            const scoreB = b.student_profiles?.readiness_score ?? 0;
            return scoreB - scoreA;
          });

        const ranked: RankedEntry[] = sorted.map((row, idx) => ({
          studentId: row.student_id,
          name: row.student_profiles?.name || "Anonymous",
          avatarUrl:
            row.student_profiles?.avatar_url ||
            getInitialsAvatar(row.student_profiles?.name || "?"),
          readinessScore: row.student_profiles?.readiness_score ?? 0,
          stage: row.preparation_stage,
          rank: idx + 1,
        }));

        setEntries(ranked);
      } catch (err) {
        console.error("[CompanyLeaderboard] fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [companyId]);

  const total = entries.length;
  const currentEntry = entries.find((e) => e.studentId === user?.id);
  const userPercentile = currentEntry
    ? computePercentile(currentEntry.rank, total)
    : null;

  // Only show top 10 in the list
  const visible = entries.slice(0, 10);

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Users className="w-4.5 h-4.5 text-blue-400" style={{ width: 18, height: 18 }} />
          <span className="text-sm font-semibold text-slate-200">
            Aspirants Leaderboard
          </span>
          {total > 0 && (
            <span className="ml-1 rounded-full bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              {total} tracking
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.25 },
            }}
            className="overflow-hidden border-t border-slate-800/60"
          >
            <div className="px-5 pb-5 pt-4 space-y-3">
              {/* User percentile banner */}
              {user && currentEntry && userPercentile !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3"
                  style={{ background: "rgba(74,222,128,0.06)" }}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 font-medium">
                    You are in the{" "}
                    <span className="font-bold text-emerald-400">
                      top {Math.max(1, 100 - userPercentile + 1)}%
                    </span>{" "}
                    of aspirants for this company
                    {currentEntry.stage !== "Not Started" && (
                      <> — currently at <span className="font-bold" style={{ color: STAGE_COLORS[currentEntry.stage] }}>{currentEntry.stage}</span></>
                    )}
                  </p>
                </motion.div>
              )}

              {user && !currentEntry && !isLoading && (
                <p className="text-xs text-slate-500 text-center py-2">
                  Start tracking this company to appear on the leaderboard
                </p>
              )}

              {/* Leaderboard rows */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading leaderboard…
                </div>
              ) : total === 0 ? (
                <div className="text-center py-8 text-slate-600 text-sm">
                  No one is tracking this company yet. Be the first! 🚀
                </div>
              ) : (
                <div className="space-y-1.5">
                  {visible.map((entry, idx) => {
                    const isCurrentUser = entry.studentId === user?.id;
                    const stageColor = STAGE_COLORS[entry.stage] ?? "#64748b";

                    return (
                      <motion.div
                        key={entry.studentId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                          isCurrentUser
                            ? "border shadow-lg"
                            : "border border-transparent hover:bg-slate-800/30"
                        }`}
                        style={
                          isCurrentUser
                            ? {
                                borderColor: "rgba(167,139,250,0.35)",
                                background: "rgba(167,139,250,0.06)",
                                boxShadow: "0 0 20px rgba(167,139,250,0.15)",
                              }
                            : {}
                        }
                      >
                        {/* Rank */}
                        <div
                          className={`w-7 text-center text-sm font-bold tabular-nums shrink-0 ${
                            idx === 0
                              ? "text-yellow-400"
                              : idx === 1
                                ? "text-slate-300"
                                : idx === 2
                                  ? "text-amber-600"
                                  : "text-slate-600"
                          }`}
                        >
                          {idx === 0 ? (
                            <Trophy className="w-4 h-4 text-yellow-400 mx-auto" />
                          ) : (
                            `#${entry.rank}`
                          )}
                        </div>

                        {/* Avatar */}
                        <img
                          src={entry.avatarUrl}
                          alt={entry.name}
                          className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getInitialsAvatar(entry.name);
                          }}
                        />

                        {/* Name + stage */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium truncate ${isCurrentUser ? "text-violet-200" : "text-slate-200"}`}>
                              {isCurrentUser ? "You" : entry.name}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-1.5 py-0.5">
                                You
                              </span>
                            )}
                          </div>
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: stageColor }}
                          >
                            {entry.stage}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-bold tabular-nums text-slate-200">
                            {entry.readinessScore}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
                            Score
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {total > 10 && (
                    <p className="text-center text-xs text-slate-600 pt-1">
                      +{total - 10} more aspirants…
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
