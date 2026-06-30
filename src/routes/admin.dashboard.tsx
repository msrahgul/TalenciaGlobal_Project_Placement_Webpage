import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  Users,
  TrendingUp,
  Target,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Download,
  RefreshCw,
  AlertTriangle,
  Building2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useCompanies } from "@/lib/companyApi";
import { STAGES, STAGE_INDEX } from "@/components/CompanyPreparationTracker";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ── Route Guard ────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — KITS Placement Hub" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

// ── Types ──────────────────────────────────────────────────────────────────
interface StudentRow {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  readiness_score: number | null;
  current_milestone: string | null;
  skills: string[] | null;
  target_sectors: string[] | null;
  tracking_count: number;
  tracking_stages: string[];
  tracked_companies: { company_id: number; stage: string }[];
}

type SortKey = "name" | "email" | "readiness_score" | "current_milestone" | "tracking_count";
type SortDir = "asc" | "desc";

const MILESTONE_ORDER = [
  "Profile Formed",
  "Skill Validation",
  "Mock Tests Cleared",
  "Interview Ready",
  "Placed",
];

const MILESTONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Profile Formed":    { bg: "rgba(100,116,139,0.12)", text: "#94a3b8", border: "rgba(100,116,139,0.3)" },
  "Skill Validation":  { bg: "rgba(56,189,248,0.10)",  text: "#38bdf8", border: "rgba(56,189,248,0.3)" },
  "Mock Tests Cleared":{ bg: "rgba(167,139,250,0.10)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  "Interview Ready":   { bg: "rgba(251,146,60,0.10)",  text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  "Placed":            { bg: "rgba(74,222,128,0.10)",  text: "#4ade80", border: "rgba(74,222,128,0.3)" },
};

function ScorePill({ score }: { score: number | null }) {
  const s = score ?? 0;
  const color =
    s >= 80 ? "#4ade80"
    : s >= 60 ? "#a78bfa"
    : s >= 40 ? "#fb923c"
    : s >= 20 ? "#38bdf8"
    : "#64748b";
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl px-3 py-0.5 text-sm font-bold tabular-nums min-w-[52px]"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}35`,
      }}
    >
      {s}
    </span>
  );
}

function MilestoneBadge({ milestone }: { milestone: string | null }) {
  const m = milestone ?? "Profile Formed";
  const cfg = MILESTONE_COLORS[m] ?? MILESTONE_COLORS["Profile Formed"];
  return (
    <span
      className="inline-flex items-center rounded-xl px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {m}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("readiness_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: allCompanies = [] } = useCompanies();

  // ── Auth guard (client-side) ────────────────────────────────────────────
  // The route doesn't use beforeLoad because auth state is async;
  // we guard inside the component after auth resolves.
  const showUnauthorised = !authLoading && (!user || !isAdmin);

  // ── Data fetch ──────────────────────────────────────────────────────────
  async function fetchData(quiet = false) {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. All student profiles
      const { data: profiles, error: profileErr } = await supabase
        .from("student_profiles")
        .select("id, name, email, avatar_url, readiness_score, current_milestone, skills, target_sectors")
        .order("readiness_score", { ascending: false });

      if (profileErr) throw profileErr;

      // 2. All tracking rows (for count + stage overview per student)
      const { data: tracking, error: trackErr } = await supabase
        .from("student_company_tracking")
        .select("student_id, company_id, preparation_stage");

      if (trackErr) {
        console.warn("[AdminDashboard] tracking fetch error (non-critical):", trackErr);
      }

      const trackMap: Record<string, string[]> = {};
      const companyMap: Record<string, { company_id: number; stage: string }[]> = {};
      
      (tracking ?? []).forEach((row) => {
        if (!trackMap[row.student_id]) trackMap[row.student_id] = [];
        if (!companyMap[row.student_id]) companyMap[row.student_id] = [];
        
        trackMap[row.student_id].push(row.preparation_stage);
        companyMap[row.student_id].push({
          company_id: row.company_id,
          stage: row.preparation_stage,
        });
      });

      const rows: StudentRow[] = (profiles ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar_url: p.avatar_url,
        readiness_score: p.readiness_score,
        current_milestone: p.current_milestone,
        skills: p.skills,
        target_sectors: p.target_sectors,
        tracking_count: (trackMap[p.id] ?? []).length,
        tracking_stages: trackMap[p.id] ?? [],
        tracked_companies: companyMap[p.id] ?? [],
      }));

      setStudents(rows);
    } catch (err) {
      console.error("[AdminDashboard] fetch error:", err);
      toast.error("Failed to load student data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  // ── Delete Student ──────────────────────────────────────────────────────
  const handleDeleteStudent = async (studentId: string, studentName: string | null) => {
    if (!confirm(`Are you sure you want to completely remove ${studentName || 'this user'}? This will delete their profile and progress.`)) return;
    
    try {
      const { error } = await supabase
        .from("student_profiles")
        .delete()
        .eq("id", studentId);
        
      if (error) throw error;
      
      toast.success("User deleted successfully.");
      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (expandedRow === studentId) setExpandedRow(null);
    } catch (err) {
      console.error("[AdminDashboard] delete error:", err);
      toast.error("Failed to delete user. Make sure your RLS allows admin deletes.");
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchData();
    }
    if (!authLoading && !isAdmin) {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAdmin]);

  // ── Filtering + Sorting ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let rows = students;

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q),
      );
    }

    if (milestoneFilter !== "all") {
      rows = rows.filter((s) => s.current_milestone === milestoneFilter);
    }

    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = (a.name ?? "").localeCompare(b.name ?? "");
      } else if (sortKey === "email") {
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      } else if (sortKey === "readiness_score") {
        cmp = (a.readiness_score ?? 0) - (b.readiness_score ?? 0);
      } else if (sortKey === "current_milestone") {
        cmp =
          MILESTONE_ORDER.indexOf(a.current_milestone ?? "") -
          MILESTONE_ORDER.indexOf(b.current_milestone ?? "");
      } else if (sortKey === "tracking_count") {
        cmp = a.tracking_count - b.tracking_count;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [students, search, milestoneFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-violet-400" />
      : <ChevronDown className="w-3 h-3 text-violet-400" />;
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Readiness Score", "Current Milestone", "Companies Tracking", "Stages"];
    const rows = filtered.map((s) => [
      s.name ?? "",
      s.email ?? "",
      s.readiness_score ?? 0,
      s.current_milestone ?? "",
      s.tracking_count,
      s.tracking_stages.join("; "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kits-students-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  }

  // Stats
  const avgScore = students.length
    ? Math.round(students.reduce((s, r) => s + (r.readiness_score ?? 0), 0) / students.length)
    : 0;
  const totalTracking = students.reduce((s, r) => s + r.tracking_count, 0);
  const placedCount = students.filter((s) => s.current_milestone === "Placed").length;

  // ── Unauthorised state ──────────────────────────────────────────────────
  if (showUnauthorised) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 text-sm mb-6">
            {!user
              ? "You must be signed in as the master admin to view this page."
              : "Your account does not have administrator privileges."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const gridCols = "grid-cols-[2fr_2fr_1.5fr_1fr_auto]";

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-slate-900 bg-[#0a0a0c]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Shield className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h1 className="text-base font-heading font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">KITS Placement Intelligence — Master Control</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users,      label: "Total Students",       value: students.length,  color: "#38bdf8" },
            { icon: TrendingUp, label: "Avg Readiness Score",  value: avgScore,         color: "#a78bfa" },
            { icon: Building2,  label: "Tracking Entries",     value: totalTracking,    color: "#fb923c" },
            { icon: Target,     label: "Students Placed",      value: placedCount,      color: "#4ade80" },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <div className="text-2xl font-heading font-bold text-white tabular-nums">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Filters Row ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
          <select
            value={milestoneFilter}
            onChange={(e) => setMilestoneFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 cursor-pointer"
          >
            <option value="all">All Milestones</option>
            {MILESTONE_ORDER.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
          {/* Table header */}
          <div className={`grid ${gridCols} gap-3 px-4 py-3 border-b border-slate-800/60 text-[10px] font-bold uppercase tracking-widest text-slate-500`}>
            {(
              [
                { key: "name" as SortKey,           label: "Student" },
                { key: "email" as SortKey,          label: "Email" },
                { key: "current_milestone" as SortKey, label: "Milestone" },
                { key: "tracking_count" as SortKey, label: "Companies" },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-pointer text-left"
              >
                {label} <SortIcon col={key} />
              </button>
            ))}
          </div>

          {/* Table body */}
          {isLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`grid ${gridCols} gap-3 px-4 py-3 border-b border-slate-900/60`}
                >
                  {[1, 2, 1.5, 0.5, 0.2].map((w, j) => (
                    <div
                      key={j}
                      className="h-8 rounded-xl bg-slate-800/50 animate-pulse"
                      style={{ flexGrow: w }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-600 text-sm">
              No students match your filters.
            </div>
          ) : (
            <div>
              {filtered.map((student, idx) => (
                <div key={student.id} className="border-b border-slate-900/40">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setExpandedRow(expandedRow === student.id ? null : student.id)}
                    className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr_auto] gap-3 items-center px-4 py-3 hover:bg-slate-800/20 transition-colors cursor-pointer"
                  >
                    {/* Name + Avatar */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="w-8 h-8 border border-slate-700 shrink-0">
                        <AvatarImage src={student.avatar_url || undefined} referrerPolicy="no-referrer" />
                        <AvatarFallback className="bg-slate-800 text-slate-300 text-xs font-medium">
                          {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-200 truncate">
                          {student.name ?? "—"}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="text-xs text-slate-400 truncate">
                      {student.email ?? "—"}
                    </div>

                    {/* Milestone */}
                    <div>
                      <MilestoneBadge milestone={student.current_milestone} />
                    </div>

                    {/* Companies tracking count */}
                    <div className="flex items-center justify-between gap-1.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-300 tabular-nums">
                          {student.tracking_count}
                        </span>
                        {student.tracking_count > 0 && (
                          <span className="text-[10px] text-slate-600">
                            co.
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${expandedRow === student.id ? "rotate-180" : ""}`}
                      />
                    </div>
                    
                    {/* Delete Action */}
                    <div 
                      className="flex items-center justify-center p-1.5 hover:bg-red-500/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student.id, student.name);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400" />
                    </div>
                  </motion.div>

                  {/* Expanded Row */}
                  <AnimatePresence>
                    {expandedRow === student.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-900/40"
                      >
                        <div className="p-5 border-t border-slate-800/50">
                          <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                            <Target className="w-3.5 h-3.5" />
                            Tracking Progress ({student.tracked_companies.length} Companies)
                          </h4>
                          {student.tracked_companies.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">This student is not tracking any companies yet.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {student.tracked_companies.map((tc) => {
                                const comp = allCompanies.find(c => c.company_id === tc.company_id);
                                const stageConfig = STAGES.find(s => s.label === tc.stage) || STAGES[0];
                                return (
                                  <div key={tc.company_id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 overflow-hidden">
                                        <CompanyLogo 
                                          name={comp?.name || ""} 
                                          logoUrl={comp?.logo_url} 
                                          website={comp?.website_url}
                                          className="w-full h-full object-cover" 
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-sm font-medium text-slate-200 truncate pr-2">{comp?.name || "Unknown Company"}</div>
                                        <div className="text-[10px] font-semibold mt-0.5" style={{ color: stageConfig.color }}>
                                          {tc.stage}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {/* Table footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-800/60 text-xs text-slate-600 flex justify-between">
              <span>Showing {filtered.length} of {students.length} students</span>
              <span>Last refreshed: just now</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
