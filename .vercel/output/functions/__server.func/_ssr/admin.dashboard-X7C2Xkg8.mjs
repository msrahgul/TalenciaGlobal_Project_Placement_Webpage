import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./AuthContext-zkUkKsx2.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { l as useCompanies } from "./companyApi-BITDVXfd.mjs";
import { G as ChevronDown, H as ChevronUp, Q as ArrowUpDown, R as Download, _ as Search, c as Trash2, l as Target, o as TrendingUp, p as Shield, q as Building2, r as Users, tt as TriangleAlert, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as STAGES } from "./CompanyPreparationTracker-CG7EQT2M.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CFoaHS6j.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-X7C2Xkg8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var MILESTONE_ORDER = [
	"Profile Formed",
	"Skill Validation",
	"Mock Tests Cleared",
	"Interview Ready",
	"Placed"
];
var MILESTONE_COLORS = {
	"Profile Formed": {
		bg: "rgba(100,116,139,0.12)",
		text: "#94a3b8",
		border: "rgba(100,116,139,0.3)"
	},
	"Skill Validation": {
		bg: "rgba(56,189,248,0.10)",
		text: "#38bdf8",
		border: "rgba(56,189,248,0.3)"
	},
	"Mock Tests Cleared": {
		bg: "rgba(167,139,250,0.10)",
		text: "#a78bfa",
		border: "rgba(167,139,250,0.3)"
	},
	"Interview Ready": {
		bg: "rgba(251,146,60,0.10)",
		text: "#fb923c",
		border: "rgba(251,146,60,0.3)"
	},
	"Placed": {
		bg: "rgba(74,222,128,0.10)",
		text: "#4ade80",
		border: "rgba(74,222,128,0.3)"
	}
};
function MilestoneBadge({ milestone }) {
	const m = milestone ?? "Profile Formed";
	const cfg = MILESTONE_COLORS[m] ?? MILESTONE_COLORS["Profile Formed"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-xl px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
		style: {
			background: cfg.bg,
			color: cfg.text,
			border: `1px solid ${cfg.border}`
		},
		children: m
	});
}
function AdminDashboard() {
	const { user, isAdmin, isLoading: authLoading } = useAuth();
	const [students, setStudents] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [milestoneFilter, setMilestoneFilter] = (0, import_react.useState)("all");
	const [sortKey, setSortKey] = (0, import_react.useState)("readiness_score");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	const [expandedRow, setExpandedRow] = (0, import_react.useState)(null);
	const { data: allCompanies = [] } = useCompanies();
	const showUnauthorised = !authLoading && (!user || !isAdmin);
	async function fetchData(quiet = false) {
		if (!quiet) setIsLoading(true);
		else setIsRefreshing(true);
		try {
			const { data: profiles, error: profileErr } = await supabase.from("student_profiles").select("id, name, email, avatar_url, readiness_score, current_milestone, skills, target_sectors").order("readiness_score", { ascending: false });
			if (profileErr) throw profileErr;
			const { data: tracking, error: trackErr } = await supabase.from("student_company_tracking").select("student_id, company_id, preparation_stage");
			if (trackErr) console.warn("[AdminDashboard] tracking fetch error (non-critical):", trackErr);
			const trackMap = {};
			const companyMap = {};
			(tracking ?? []).forEach((row) => {
				if (!trackMap[row.student_id]) trackMap[row.student_id] = [];
				if (!companyMap[row.student_id]) companyMap[row.student_id] = [];
				trackMap[row.student_id].push(row.preparation_stage);
				companyMap[row.student_id].push({
					company_id: row.company_id,
					stage: row.preparation_stage
				});
			});
			setStudents((profiles ?? []).map((p) => ({
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
				tracked_companies: companyMap[p.id] ?? []
			})));
		} catch (err) {
			console.error("[AdminDashboard] fetch error:", err);
			toast.error("Failed to load student data");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}
	const handleDeleteStudent = async (studentId, studentName) => {
		if (!confirm(`Are you sure you want to completely remove ${studentName || "this user"}? This will delete their profile and progress.`)) return;
		try {
			const { error } = await supabase.from("student_profiles").delete().eq("id", studentId);
			if (error) throw error;
			toast.success("User deleted successfully.");
			setStudents((prev) => prev.filter((s) => s.id !== studentId));
			if (expandedRow === studentId) setExpandedRow(null);
		} catch (err) {
			console.error("[AdminDashboard] delete error:", err);
			toast.error("Failed to delete user. Make sure your RLS allows admin deletes.");
		}
	};
	(0, import_react.useEffect)(() => {
		if (!authLoading && isAdmin) fetchData();
		if (!authLoading && !isAdmin) setIsLoading(false);
	}, [authLoading, isAdmin]);
	const filtered = (0, import_react.useMemo)(() => {
		let rows = students;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
		}
		if (milestoneFilter !== "all") rows = rows.filter((s) => s.current_milestone === milestoneFilter);
		rows = [...rows].sort((a, b) => {
			let cmp = 0;
			if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
			else if (sortKey === "email") cmp = (a.email ?? "").localeCompare(b.email ?? "");
			else if (sortKey === "readiness_score") cmp = (a.readiness_score ?? 0) - (b.readiness_score ?? 0);
			else if (sortKey === "current_milestone") cmp = MILESTONE_ORDER.indexOf(a.current_milestone ?? "") - MILESTONE_ORDER.indexOf(b.current_milestone ?? "");
			else if (sortKey === "tracking_count") cmp = a.tracking_count - b.tracking_count;
			return sortDir === "asc" ? cmp : -cmp;
		});
		return rows;
	}, [
		students,
		search,
		milestoneFilter,
		sortKey,
		sortDir
	]);
	function toggleSort(key) {
		if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortDir("desc");
		}
	}
	function SortIcon({ col }) {
		if (sortKey !== col) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 text-slate-600" });
		return sortDir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3 h-3 text-violet-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3 text-violet-400" });
	}
	function exportCSV() {
		const csv = [[
			"Name",
			"Email",
			"Readiness Score",
			"Current Milestone",
			"Companies Tracking",
			"Stages"
		], ...filtered.map((s) => [
			s.name ?? "",
			s.email ?? "",
			s.readiness_score ?? 0,
			s.current_milestone ?? "",
			s.tracking_count,
			s.tracking_stages.join("; ")
		])].map((r) => r.map(String).map((v) => `"${v.replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `kits-students-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("CSV exported!");
	}
	const avgScore = students.length ? Math.round(students.reduce((s, r) => s + (r.readiness_score ?? 0), 0) / students.length) : 0;
	const totalTracking = students.reduce((s, r) => s + r.tracking_count, 0);
	const placedCount = students.filter((s) => s.current_milestone === "Placed").length;
	if (showUnauthorised) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "text-center max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-8 h-8 text-red-400" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-heading font-bold text-white mb-2",
					children: "Access Denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400 text-sm mb-6",
					children: !user ? "You must be signed in as the master admin to view this page." : "Your account does not have administrator privileges."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-5 py-2.5 text-sm font-medium transition-colors",
					children: "← Back to Home"
				})
			]
		})
	});
	const gridCols = "grid-cols-[2fr_2fr_1.5fr_1fr_auto]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#0a0a0c] text-slate-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sticky top-0 z-20 border-b border-slate-900 bg-[#0a0a0c]/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-violet-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-heading font-bold text-white",
						children: "Admin Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "KITS Placement Intelligence — Master Control"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => fetchData(true),
							disabled: isRefreshing,
							className: "inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}` }), "Refresh"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: exportCSV,
							disabled: filtered.length === 0,
							className: "inline-flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-colors disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), "Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors",
							children: "← Home"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
					children: [
						{
							icon: Users,
							label: "Total Students",
							value: students.length,
							color: "#38bdf8"
						},
						{
							icon: TrendingUp,
							label: "Avg Readiness Score",
							value: avgScore,
							color: "#a78bfa"
						},
						{
							icon: Building2,
							label: "Tracking Entries",
							value: totalTracking,
							color: "#fb923c"
						},
						{
							icon: Target,
							label: "Students Placed",
							value: placedCount,
							color: "#4ade80"
						}
					].map(({ icon: Icon, label, value, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl flex items-center justify-center",
									style: {
										background: `${color}15`,
										border: `1px solid ${color}30`
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "w-4 h-4",
										style: { color }
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-heading font-bold text-white tabular-nums",
								children: value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-500 mt-0.5",
								children: label
							})
						]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search by name or email…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: milestoneFilter,
						onChange: (e) => setMilestoneFilter(e.target.value),
						className: "rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Milestones"
						}), MILESTONE_ORDER.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m,
							children: m
						}, m))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid ${gridCols} gap-3 px-4 py-3 border-b border-slate-800/60 text-[10px] font-bold uppercase tracking-widest text-slate-500`,
							children: [
								{
									key: "name",
									label: "Student"
								},
								{
									key: "email",
									label: "Email"
								},
								{
									key: "current_milestone",
									label: "Milestone"
								},
								{
									key: "tracking_count",
									label: "Companies"
								}
							].map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleSort(key),
								className: "flex items-center gap-1 hover:text-slate-300 transition-colors cursor-pointer text-left",
								children: [
									label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { col: key })
								]
							}, key))
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-0",
							children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid ${gridCols} gap-3 px-4 py-3 border-b border-slate-900/60`,
								children: [
									1,
									2,
									1.5,
									.5,
									.2
								].map((w, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 rounded-xl bg-slate-800/50 animate-pulse",
									style: { flexGrow: w }
								}, j))
							}, i))
						}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-16 text-center text-slate-600 text-sm",
							children: "No students match your filters."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: filtered.map((student, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-slate-900/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { delay: idx * .02 },
								onClick: () => setExpandedRow(expandedRow === student.id ? null : student.id),
								className: "grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr_auto] gap-3 items-center px-4 py-3 hover:bg-slate-800/20 transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
											className: "w-8 h-8 border border-slate-700 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
												src: student.avatar_url || void 0,
												referrerPolicy: "no-referrer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-slate-800 text-slate-300 text-xs font-medium",
												children: student.name ? student.name.charAt(0).toUpperCase() : "?"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "min-w-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium text-slate-200 truncate",
												children: student.name ?? "—"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400 truncate",
										children: student.email ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MilestoneBadge, { milestone: student.current_milestone }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1.5 pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-bold text-slate-300 tabular-nums",
												children: student.tracking_count
											}), student.tracking_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-600",
												children: "co."
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-4 h-4 text-slate-500 transition-transform ${expandedRow === student.id ? "rotate-180" : ""}` })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center p-1.5 hover:bg-red-500/10 rounded-md transition-colors",
										onClick: (e) => {
											e.stopPropagation();
											handleDeleteStudent(student.id, student.name);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-slate-500 hover:text-red-400" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: expandedRow === student.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								transition: { duration: .2 },
								className: "overflow-hidden bg-slate-900/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5 border-t border-slate-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-3.5 h-3.5" }),
											"Tracking Progress (",
											student.tracked_companies.length,
											" Companies)"
										]
									}), student.tracked_companies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-500 italic",
										children: "This student is not tracking any companies yet."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
										children: student.tracked_companies.map((tc) => {
											const comp = allCompanies.find((c) => c.company_id === tc.company_id);
											const stageConfig = STAGES.find((s) => s.label === tc.stage) || STAGES[0];
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
															name: comp?.name || "",
															logoUrl: comp?.logo_url,
															website: comp?.website_url,
															className: "w-full h-full object-cover"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-sm font-medium text-slate-200 truncate pr-2",
															children: comp?.name || "Unknown Company"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] font-semibold mt-0.5",
															style: { color: stageConfig.color },
															children: tc.stage
														})]
													})]
												})
											}, tc.company_id);
										})
									})]
								})
							}) })]
						}, student.id)) }),
						!isLoading && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3 border-t border-slate-800/60 text-xs text-slate-600 flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Showing ",
								filtered.length,
								" of ",
								students.length,
								" students"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last refreshed: just now" })]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { AdminDashboard as component };
