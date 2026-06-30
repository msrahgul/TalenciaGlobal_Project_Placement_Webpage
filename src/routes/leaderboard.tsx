import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Users,
  TrendingUp,
  Star,
  Zap,
  Crown,
  ChevronRight,
  Target,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — KITS Placement Intelligence Hub" },
      {
        name: "description",
        content: "Compete with peers, track your readiness score, and see your global rank on the KITS Placement leaderboard.",
      },
    ],
  }),
  component: LeaderboardPage,
});

// ── Types ──────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  id: string;
  name: string | null;
  avatar_url: string | null;
  readiness_score: number | null;
  current_milestone: string | null;
  email: string | null;
}

interface RankedEntry extends LeaderboardEntry {
  rank: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const MILESTONE_ORDER = [
  "Profile Formed",
  "Skill Validation",
  "Mock Tests Cleared",
  "Interview Ready",
  "Placed",
];

const MILESTONE_COLORS: Record<string, string> = {
  "Profile Formed":     "#64748b",
  "Skill Validation":   "#38bdf8",
  "Mock Tests Cleared": "#a78bfa",
  "Interview Ready":    "#fb923c",
  "Placed":             "#4ade80",
};

function getInitialsAvatar(name: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e293b&textColor=94a3b8`;
}

function rankEntries(data: LeaderboardEntry[]): RankedEntry[] {
  return data
    .slice()
    .sort((a, b) => {
      const scoreDiff = (b.readiness_score ?? 0) - (a.readiness_score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      const milestoneA = MILESTONE_ORDER.indexOf(a.current_milestone ?? "");
      const milestoneB = MILESTONE_ORDER.indexOf(b.current_milestone ?? "");
      return milestoneB - milestoneA;
    })
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

// ── Medal / rank display ───────────────────────────────────────────────────
function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return (
    <span className="text-sm font-bold tabular-nums text-slate-500">#{rank}</span>
  );
}

// ── Score ring visual ─────────────────────────────────────────────────────
function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const pct = Math.min(100, score);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color =
    pct >= 80 ? "#4ade80"
    : pct >= 60 ? "#a78bfa"
    : pct >= 40 ? "#fb923c"
    : "#38bdf8";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

// ── Podium component (top 3) ──────────────────────────────────────────────
function Podium({ entries }: { entries: RankedEntry[]; currentUserId?: string }) {
  const top3 = entries.slice(0, 3);
  // Reorder: 2nd, 1st, 3rd for visual podium
  const ordered = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = [56, 80, 40]; // px offset from bottom — 1st is tallest
  const orderedHeights: Record<number, number> = { 1: 80, 2: 56, 3: 40 };

  return (
    <div className="flex items-end justify-center gap-4 pb-2 pt-6">
      {ordered.map((entry) => {
        if (!entry) return null;
        const h = orderedHeights[entry.rank] ?? 40;
        const isFirst = entry.rank === 1;
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: entry.rank * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
          >
            {isFirst && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Crown className="w-6 h-6 text-yellow-400" />
              </motion.div>
            )}
            <img
              src={entry.avatar_url || getInitialsAvatar(entry.name ?? "?")}
              alt={entry.name ?? ""}
              className={`rounded-full border-2 bg-slate-800 ${isFirst ? "w-16 h-16" : "w-12 h-12"}`}
              style={{
                borderColor: entry.rank === 1 ? "#facc15" : entry.rank === 2 ? "#cbd5e1" : "#92400e",
              }}
            />
            <div className="text-center">
              <div className={`font-semibold text-slate-200 ${isFirst ? "text-sm" : "text-xs"}`}>
                {entry.name?.split(" ")[0] ?? "—"}
              </div>
              <div
                className="text-xs font-bold tabular-nums"
                style={{ color: entry.rank === 1 ? "#facc15" : entry.rank === 2 ? "#94a3b8" : "#92400e" }}
              >
                {entry.readiness_score ?? 0}
              </div>
            </div>
            <div
              className="w-20 rounded-t-xl flex items-center justify-center text-xs font-bold text-white"
              style={{
                height: h,
                background:
                  entry.rank === 1
                    ? "linear-gradient(135deg, #facc15, #ca8a04)"
                    : entry.rank === 2
                      ? "linear-gradient(135deg, #94a3b8, #475569)"
                      : "linear-gradient(135deg, #92400e, #78350f)",
              }}
            >
              #{entry.rank}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
function LeaderboardPage() {
  const { user } = useAuth();
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "milestone">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("student_profiles")
          .select("id, name, avatar_url, readiness_score, current_milestone, email")
          .order("readiness_score", { ascending: false })
          .limit(200);

        if (data && !error) {
          setAllEntries(data);
        } else if (error) {
          console.error("[Leaderboard] fetch error:", error);
        }
      } catch (err) {
        console.error("[Leaderboard] unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const ranked = useMemo(() => rankEntries(allEntries), [allEntries]);
  const currentEntry = ranked.find((e) => e.id === user?.id);
  const total = ranked.length;

  const userPercentile = currentEntry
    ? Math.round(((total - currentEntry.rank) / Math.max(total - 1, 1)) * 100)
    : null;

  const milestoneGroups = useMemo(() => {
    const groups: Record<string, RankedEntry[]> = {};
    MILESTONE_ORDER.forEach((m) => { groups[m] = []; });
    ranked.forEach((e) => {
      const m = e.current_milestone ?? "Profile Formed";
      if (!groups[m]) groups[m] = [];
      groups[m].push(e);
    });
    return groups;
  }, [ranked]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-20 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/8 px-4 py-1.5 text-xs font-semibold text-yellow-500 mb-6 shadow-[0_0_24px_rgba(234,179,8,0.12)]"
            style={{ background: "rgba(234,179,8,0.06)" }}
          >
            <Trophy className="w-3.5 h-3.5" />
            Global Arena — Batch Rankings
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3 tracking-tight">
            Campus Placement{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            Ranked by readiness score and placement milestone. Updated in real-time.
          </p>
        </motion.div>

        {/* ── User rank banner (logged in) ──────────────────────────── */}
        {user && !isLoading && (
          <AnimatePresence>
            {currentEntry ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-violet-500/25 p-5"
                style={{ background: "rgba(167,139,250,0.05)" }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={currentEntry.readiness_score ?? 0} size={64} />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Your Global Rank</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-heading font-bold text-white tabular-nums">
                          #{currentEntry.rank}
                        </span>
                        <span className="text-slate-400 text-sm">of {total}</span>
                      </div>
                      {userPercentile !== null && (
                        <p className="text-xs text-violet-400 mt-1 font-medium">
                          Top {Math.max(1, 100 - userPercentile)}% of all students
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-center">
                      <div className="text-lg font-bold text-white tabular-nums">{currentEntry.readiness_score ?? 0}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Score</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-center">
                      <div
                        className="text-sm font-bold"
                        style={{ color: MILESTONE_COLORS[currentEntry.current_milestone ?? ""] ?? "#64748b" }}
                      >
                        {currentEntry.current_milestone ?? "—"}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Milestone</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 text-center"
              >
                <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Complete your onboarding to appear on the leaderboard
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex bg-slate-900/40 border border-slate-800/60 rounded-2xl p-1 w-fit mx-auto">
          {(["all", "milestone"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "all" ? (
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />All Students</span>
              ) : (
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />By Milestone</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content: All students tab ────────────────────────────────── */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {/* Podium (top 3) */}
            {!isLoading && ranked.length >= 3 && (
              <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-slate-950 overflow-hidden">
                <div className="px-5 pt-5 pb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <h2 className="text-sm font-semibold text-slate-300">Top Performers</h2>
                </div>
                <Podium entries={ranked} currentUserId={user?.id} />
              </div>
            )}

            {/* Full ranked list */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Full Rankings
                </h2>
                <span className="text-xs text-slate-600">{total} students</span>
              </div>

              {isLoading ? (
                <div className="space-y-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-slate-900/40">
                      <div className="w-10 h-4 rounded bg-slate-800 animate-pulse" />
                      <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
                      <div className="flex-1 h-4 rounded bg-slate-800 animate-pulse" />
                      <div className="w-16 h-8 rounded-xl bg-slate-800 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : ranked.length === 0 ? (
                <div className="py-14 text-center text-slate-600 text-sm">
                  No students on the leaderboard yet.
                </div>
              ) : (
                <div>
                  {ranked.map((entry, idx) => {
                    const isCurrentUser = entry.id === user?.id;
                    const milestoneColor = MILESTONE_COLORS[entry.current_milestone ?? ""] ?? "#64748b";

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx * 0.025, 0.5) }}
                        className={`flex items-center gap-3 sm:gap-4 px-5 py-3 border-b border-slate-900/40 transition-all ${
                          isCurrentUser
                            ? "shadow-inner"
                            : "hover:bg-slate-800/15"
                        }`}
                        style={
                          isCurrentUser
                            ? { background: "rgba(167,139,250,0.07)", borderLeft: "3px solid rgba(167,139,250,0.5)" }
                            : {}
                        }
                      >
                        {/* Rank */}
                        <div className="w-8 flex justify-center shrink-0">
                          <RankDisplay rank={entry.rank} />
                        </div>

                        {/* Avatar */}
                        <img
                          src={entry.avatar_url || getInitialsAvatar(entry.name ?? "?")}
                          alt={entry.name ?? ""}
                          className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getInitialsAvatar(entry.name ?? "?");
                          }}
                        />

                        {/* Name + milestone */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold truncate ${isCurrentUser ? "text-violet-200" : "text-slate-200"}`}>
                              {isCurrentUser ? "You" : (entry.name ?? "—")}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-1.5 py-0.5">
                                You
                              </span>
                            )}
                          </div>
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: milestoneColor }}
                          >
                            {entry.current_milestone ?? "Profile Formed"}
                          </span>
                        </div>

                        {/* Score ring */}
                        <div className="shrink-0">
                          <ScoreRing score={entry.readiness_score ?? 0} size={44} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Content: By Milestone tab ─────────────────────────────── */}
        {activeTab === "milestone" && (
          <div className="space-y-4">
            {MILESTONE_ORDER.slice().reverse().map((milestone) => {
              const group = milestoneGroups[milestone] ?? [];
              if (group.length === 0 && !isLoading) return null;
              const color = MILESTONE_COLORS[milestone] ?? "#64748b";

              return (
                <motion.div
                  key={milestone}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                      />
                      <h3 className="text-sm font-semibold" style={{ color }}>
                        {milestone}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-bold rounded-full px-2 py-0.5"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                    >
                      {group.length} students
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="px-5 py-3 space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-10 rounded-xl bg-slate-800/50 animate-pulse" />
                      ))}
                    </div>
                  ) : group.length === 0 ? (
                    <div className="px-5 py-4 text-xs text-slate-600 italic">No students at this milestone yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-900/40">
                      {group.slice(0, 5).map((entry) => {
                        const isCurrentUser = entry.id === user?.id;
                        return (
                          <div
                            key={entry.id}
                            className={`flex items-center gap-3 px-5 py-2.5 ${isCurrentUser ? "" : "hover:bg-slate-800/15"} transition-colors`}
                            style={isCurrentUser ? { background: "rgba(167,139,250,0.06)" } : {}}
                          >
                            <span className="w-7 text-xs font-bold text-slate-600 tabular-nums">#{entry.rank}</span>
                            <img
                              src={entry.avatar_url || getInitialsAvatar(entry.name ?? "?")}
                              alt={entry.name ?? ""}
                              className="w-7 h-7 rounded-full border border-slate-700 bg-slate-800"
                            />
                            <span className={`flex-1 text-sm truncate ${isCurrentUser ? "text-violet-300 font-semibold" : "text-slate-300"}`}>
                              {isCurrentUser ? "You" : (entry.name ?? "—")}
                            </span>
                            <span className="text-sm font-bold tabular-nums text-slate-300">
                              {entry.readiness_score ?? 0}
                            </span>
                          </div>
                        );
                      })}
                      {group.length > 5 && (
                        <div className="px-5 py-2.5 text-xs text-slate-600 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {group.length - 5} more at this milestone
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── CTA footer ──────────────────────────────────────────────── */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 text-center"
          >
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-semibold text-slate-300 mb-2">
              Join the Arena
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Sign in with your Karunya institutional account to track your rank and compete with batchmates.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              Get Started →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
