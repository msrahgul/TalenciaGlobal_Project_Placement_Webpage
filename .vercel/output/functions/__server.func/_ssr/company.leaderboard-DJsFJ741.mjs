import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useAuth } from "./AuthContext-zkUkKsx2.mjs";
import { u as useCompanyProfile } from "./companyApi-BITDVXfd.mjs";
import { G as ChevronDown, a as Trophy, o as TrendingUp, r as Users, rt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as CompanyPreparationTracker } from "./CompanyPreparationTracker-CG7EQT2M.mjs";
import { n as readStoredCompany, r as useCompany } from "./CompanyContext-BG10XvC_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.leaderboard-DJsFJ741.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGE_RANK = {
	Ready: 5,
	"Interview Prep": 4,
	"Skill Building": 3,
	Researching: 2,
	"Not Started": 1
};
var STAGE_COLORS = {
	Ready: "#4ade80",
	"Interview Prep": "#fb923c",
	"Skill Building": "#a78bfa",
	Researching: "#38bdf8",
	"Not Started": "#64748b"
};
function getInitialsAvatar(name) {
	return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e293b&textColor=94a3b8`;
}
function computePercentile(rank, total) {
	if (total <= 1) return 100;
	return Math.round((total - rank) / (total - 1) * 100);
}
function CompanyLeaderboard({ companyId }) {
	const { user } = useAuth();
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!companyId) return;
		async function fetchLeaderboard() {
			try {
				const { data, error } = await supabase.from("student_company_tracking").select(`
            student_id,
            preparation_stage,
            last_updated,
            student_profiles (
              name,
              avatar_url,
              readiness_score
            )
          `).eq("company_id", companyId).order("last_updated", { ascending: false });
				if (error) throw error;
				if (!data || data.length === 0) {
					setEntries([]);
					return;
				}
				setEntries(data.slice().sort((a, b) => {
					const stageA = STAGE_RANK[a.preparation_stage] ?? 0;
					const stageB = STAGE_RANK[b.preparation_stage] ?? 0;
					if (stageB !== stageA) return stageB - stageA;
					const scoreA = a.student_profiles?.readiness_score ?? 0;
					return (b.student_profiles?.readiness_score ?? 0) - scoreA;
				}).map((row, idx) => ({
					studentId: row.student_id,
					name: row.student_profiles?.name || "Anonymous",
					avatarUrl: row.student_profiles?.avatar_url || getInitialsAvatar(row.student_profiles?.name || "?"),
					readinessScore: row.student_profiles?.readiness_score ?? 0,
					stage: row.preparation_stage,
					rank: idx + 1
				})));
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
	const userPercentile = currentEntry ? computePercentile(currentEntry.rank, total) : null;
	const visible = entries.slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setIsOpen((o) => !o),
			className: "w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-colors cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
						className: "w-4.5 h-4.5 text-blue-400",
						style: {
							width: 18,
							height: 18
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-slate-200",
						children: "Aspirants Leaderboard"
					}),
					total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 rounded-full bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 text-[10px] font-bold text-blue-400",
						children: [total, " tracking"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				animate: { rotate: isOpen ? 180 : 0 },
				transition: {
					type: "spring",
					stiffness: 300,
					damping: 25
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4 text-slate-500" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
				transition: {
					height: {
						duration: .3,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					opacity: { duration: .25 }
				},
				className: "overflow-hidden border-t border-slate-800/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pb-5 pt-4 space-y-3",
					children: [
						user && currentEntry && userPercentile !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3",
							style: { background: "rgba(74,222,128,0.06)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-emerald-300 font-medium",
								children: [
									"You are in the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-emerald-400",
										children: [
											"top ",
											Math.max(1, 100 - userPercentile + 1),
											"%"
										]
									}),
									" ",
									"of aspirants for this company",
									currentEntry.stage !== "Not Started" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" — currently at ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										style: { color: STAGE_COLORS[currentEntry.stage] },
										children: currentEntry.stage
									})] })
								]
							})]
						}),
						user && !currentEntry && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 text-center py-2",
							children: "Start tracking this company to appear on the leaderboard"
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center py-8 gap-2 text-slate-500 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), "Loading leaderboard…"]
						}) : total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center py-8 text-slate-600 text-sm",
							children: "No one is tracking this company yet. Be the first! 🚀"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [visible.map((entry, idx) => {
								const isCurrentUser = entry.studentId === user?.id;
								const stageColor = STAGE_COLORS[entry.stage] ?? "#64748b";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										x: -12
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: {
										delay: idx * .04,
										duration: .3
									},
									className: `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${isCurrentUser ? "border shadow-lg" : "border border-transparent hover:bg-slate-800/30"}`,
									style: isCurrentUser ? {
										borderColor: "rgba(167,139,250,0.35)",
										background: "rgba(167,139,250,0.06)",
										boxShadow: "0 0 20px rgba(167,139,250,0.15)"
									} : {},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `w-7 text-center text-sm font-bold tabular-nums shrink-0 ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-slate-600"}`,
											children: idx === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-4 h-4 text-yellow-400 mx-auto" }) : `#${entry.rank}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: entry.avatarUrl,
											alt: entry.name,
											className: "w-8 h-8 rounded-full border border-slate-700 bg-slate-800 shrink-0",
											onError: (e) => {
												e.target.src = getInitialsAvatar(entry.name);
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-wrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-sm font-medium truncate ${isCurrentUser ? "text-violet-200" : "text-slate-200"}`,
													children: isCurrentUser ? "You" : entry.name
												}), isCurrentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] uppercase tracking-wider font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-1.5 py-0.5",
													children: "You"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-semibold",
												style: { color: stageColor },
												children: entry.stage
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-bold tabular-nums text-slate-200",
												children: entry.readinessScore
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] uppercase tracking-wider text-slate-600 font-semibold",
												children: "Score"
											})]
										})
									]
								}, entry.studentId);
							}), total > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-xs text-slate-600 pt-1",
								children: [
									"+",
									total - 10,
									" more aspirants…"
								]
							})]
						})
					]
				})
			}, "content")
		})]
	});
}
function CompanyLeaderboardPage() {
	const { selected } = useCompany();
	const companyId = (selected ?? readStoredCompany())?.companyId ?? 1;
	const { data: profile } = useCompanyProfile(companyId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6 pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyPreparationTracker, { companyId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLeaderboard, { companyId })]
	});
}
//#endregion
export { CompanyLeaderboardPage as component };
