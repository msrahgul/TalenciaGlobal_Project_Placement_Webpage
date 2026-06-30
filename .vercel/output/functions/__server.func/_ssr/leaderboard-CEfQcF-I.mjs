import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useAuth } from "./AuthContext-zkUkKsx2.mjs";
import { C as Medal, U as ChevronRight, a as Trophy, d as Star, l as Target, o as TrendingUp, r as Users, t as Zap, z as Crown } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-CEfQcF-I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MILESTONE_ORDER = [
	"Profile Formed",
	"Skill Validation",
	"Mock Tests Cleared",
	"Interview Ready",
	"Placed"
];
var MILESTONE_COLORS = {
	"Profile Formed": "#64748b",
	"Skill Validation": "#38bdf8",
	"Mock Tests Cleared": "#a78bfa",
	"Interview Ready": "#fb923c",
	"Placed": "#4ade80"
};
function getInitialsAvatar(name) {
	return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e293b&textColor=94a3b8`;
}
function rankEntries(data) {
	return data.slice().sort((a, b) => {
		const scoreDiff = (b.readiness_score ?? 0) - (a.readiness_score ?? 0);
		if (scoreDiff !== 0) return scoreDiff;
		const milestoneA = MILESTONE_ORDER.indexOf(a.current_milestone ?? "");
		return MILESTONE_ORDER.indexOf(b.current_milestone ?? "") - milestoneA;
	}).map((entry, idx) => ({
		...entry,
		rank: idx + 1
	}));
}
function RankDisplay({ rank }) {
	if (rank === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-5 h-5 text-yellow-400" });
	if (rank === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "w-5 h-5 text-slate-300" });
	if (rank === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "w-5 h-5 text-amber-600" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-sm font-bold tabular-nums text-slate-500",
		children: ["#", rank]
	});
}
function ScoreRing({ score, size = 56 }) {
	const pct = Math.min(100, score);
	const r = (size - 8) / 2;
	const circ = 2 * Math.PI * r;
	const dash = pct / 100 * circ;
	const color = pct >= 80 ? "#4ade80" : pct >= 60 ? "#a78bfa" : pct >= 40 ? "#fb923c" : "#38bdf8";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-flex items-center justify-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "rgba(255,255,255,0.05)",
				strokeWidth: "4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: color,
				strokeWidth: "4",
				strokeDasharray: `${dash} ${circ}`,
				strokeLinecap: "round",
				style: { filter: `drop-shadow(0 0 6px ${color}88)` }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute text-sm font-bold tabular-nums",
			style: { color },
			children: score
		})]
	});
}
function Podium({ entries }) {
	const top3 = entries.slice(0, 3);
	const ordered = [
		top3[1],
		top3[0],
		top3[2]
	].filter(Boolean);
	const orderedHeights = {
		1: 80,
		2: 56,
		3: 40
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-end justify-center gap-4 pb-2 pt-6",
		children: ordered.map((entry) => {
			if (!entry) return null;
			const h = orderedHeights[entry.rank] ?? 40;
			const isFirst = entry.rank === 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 30
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: entry.rank * .1,
					duration: .5,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "flex flex-col items-center gap-2",
				children: [
					isFirst && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						animate: { y: [
							0,
							-4,
							0
						] },
						transition: {
							repeat: Infinity,
							duration: 2,
							ease: "easeInOut"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-6 h-6 text-yellow-400" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: entry.avatar_url || getInitialsAvatar(entry.name ?? "?"),
						alt: entry.name ?? "",
						className: `rounded-full border-2 bg-slate-800 ${isFirst ? "w-16 h-16" : "w-12 h-12"}`,
						style: { borderColor: entry.rank === 1 ? "#facc15" : entry.rank === 2 ? "#cbd5e1" : "#92400e" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `font-semibold text-slate-200 ${isFirst ? "text-sm" : "text-xs"}`,
							children: entry.name?.split(" ")[0] ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold tabular-nums",
							style: { color: entry.rank === 1 ? "#facc15" : entry.rank === 2 ? "#94a3b8" : "#92400e" },
							children: entry.readiness_score ?? 0
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-20 rounded-t-xl flex items-center justify-center text-xs font-bold text-white",
						style: {
							height: h,
							background: entry.rank === 1 ? "linear-gradient(135deg, #facc15, #ca8a04)" : entry.rank === 2 ? "linear-gradient(135deg, #94a3b8, #475569)" : "linear-gradient(135deg, #92400e, #78350f)"
						},
						children: ["#", entry.rank]
					})
				]
			}, entry.id);
		})
	});
}
function LeaderboardPage() {
	const { user } = useAuth();
	const [allEntries, setAllEntries] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		async function fetchData() {
			try {
				const { data, error } = await supabase.from("student_profiles").select("id, name, avatar_url, readiness_score, current_milestone, email").order("readiness_score", { ascending: false }).limit(200);
				if (data && !error) setAllEntries(data);
				else if (error) console.error("[Leaderboard] fetch error:", error);
			} catch (err) {
				console.error("[Leaderboard] unexpected error:", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);
	const ranked = (0, import_react.useMemo)(() => rankEntries(allEntries), [allEntries]);
	const currentEntry = ranked.find((e) => e.id === user?.id);
	const total = ranked.length;
	const userPercentile = currentEntry ? Math.round((total - currentEntry.rank) / Math.max(total - 1, 1) * 100) : null;
	const milestoneGroups = (0, import_react.useMemo)(() => {
		const groups = {};
		MILESTONE_ORDER.forEach((m) => {
			groups[m] = [];
		});
		ranked.forEach((e) => {
			const m = e.current_milestone ?? "Profile Formed";
			if (!groups[m]) groups[m] = [];
			groups[m].push(e);
		});
		return groups;
	}, [ranked]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#0a0a0c] pt-20 pb-20 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: -16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .5 },
					className: "text-center max-w-2xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/8 px-4 py-1.5 text-xs font-semibold text-yellow-500 mb-6 shadow-[0_0_24px_rgba(234,179,8,0.12)]",
							style: { background: "rgba(234,179,8,0.06)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-3.5 h-3.5" }), "Global Arena — Batch Rankings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-4xl md:text-5xl font-heading font-bold text-white mb-3 tracking-tight",
							children: [
								"Campus Placement",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent",
									children: "Leaderboard"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm",
							children: "Ranked by readiness score and placement milestone. Updated in real-time."
						})
					]
				}),
				user && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: currentEntry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						scale: .96
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					className: "rounded-2xl border border-violet-500/25 p-5",
					style: { background: "rgba(167,139,250,0.05)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								score: currentEntry.readiness_score ?? 0,
								size: 64
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1",
									children: "Your Global Rank"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-4xl font-heading font-bold text-white tabular-nums",
										children: ["#", currentEntry.rank]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 text-sm",
										children: ["of ", total]
									})]
								}),
								userPercentile !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-violet-400 mt-1 font-medium",
									children: [
										"Top ",
										Math.max(1, 100 - userPercentile),
										"% of all students"
									]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold text-white tabular-nums",
									children: currentEntry.readiness_score ?? 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-500 uppercase tracking-wider font-semibold",
									children: "Score"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold",
									style: { color: MILESTONE_COLORS[currentEntry.current_milestone ?? ""] ?? "#64748b" },
									children: currentEntry.current_milestone ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-500 uppercase tracking-wider font-semibold",
									children: "Milestone"
								})]
							})]
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-slate-500 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4" }), "Complete your onboarding to appear on the leaderboard"]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex bg-slate-900/40 border border-slate-800/60 rounded-2xl p-1 w-fit mx-auto",
					children: ["all", "milestone"].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab(tab),
						className: `px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`,
						children: tab === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }), "All Students"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-3.5 h-3.5" }), "By Milestone"]
						})
					}, tab))
				}),
				activeTab === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [!isLoading && ranked.length >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-slate-950 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 pt-5 pb-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-yellow-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-slate-300",
								children: "Top Performers"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Podium, {
							entries: ranked,
							currentUserId: user?.id
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3 border-b border-slate-800/60 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold text-slate-300 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-blue-400" }), "Full Rankings"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-600",
								children: [total, " students"]
							})]
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-0",
							children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 px-5 py-3 border-b border-slate-900/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-4 rounded bg-slate-800 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full bg-slate-800 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-4 rounded bg-slate-800 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-8 rounded-xl bg-slate-800 animate-pulse" })
								]
							}, i))
						}) : ranked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-14 text-center text-slate-600 text-sm",
							children: "No students on the leaderboard yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: ranked.map((entry, idx) => {
							const isCurrentUser = entry.id === user?.id;
							const milestoneColor = MILESTONE_COLORS[entry.current_milestone ?? ""] ?? "#64748b";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: -12
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: Math.min(idx * .025, .5) },
								className: `flex items-center gap-3 sm:gap-4 px-5 py-3 border-b border-slate-900/40 transition-all ${isCurrentUser ? "shadow-inner" : "hover:bg-slate-800/15"}`,
								style: isCurrentUser ? {
									background: "rgba(167,139,250,0.07)",
									borderLeft: "3px solid rgba(167,139,250,0.5)"
								} : {},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 flex justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankDisplay, { rank: entry.rank })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: entry.avatar_url || getInitialsAvatar(entry.name ?? "?"),
										alt: entry.name ?? "",
										className: "w-10 h-10 rounded-full border border-slate-700 bg-slate-800 shrink-0",
										onError: (e) => {
											e.target.src = getInitialsAvatar(entry.name ?? "?");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-sm font-semibold truncate ${isCurrentUser ? "text-violet-200" : "text-slate-200"}`,
												children: isCurrentUser ? "You" : entry.name ?? "—"
											}), isCurrentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] uppercase tracking-wider font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-1.5 py-0.5",
												children: "You"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold",
											style: { color: milestoneColor },
											children: entry.current_milestone ?? "Profile Formed"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
											score: entry.readiness_score ?? 0,
											size: 44
										})
									})
								]
							}, entry.id);
						}) })]
					})]
				}),
				activeTab === "milestone" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: MILESTONE_ORDER.slice().reverse().map((milestone) => {
						const group = milestoneGroups[milestone] ?? [];
						if (group.length === 0 && !isLoading) return null;
						const color = MILESTONE_COLORS[milestone] ?? "#64748b";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60",
								style: { borderLeft: `3px solid ${color}` },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-2.5 h-2.5 rounded-full animate-pulse",
										style: {
											backgroundColor: color,
											boxShadow: `0 0 8px ${color}`
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold",
										style: { color },
										children: milestone
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold rounded-full px-2 py-0.5",
									style: {
										background: `${color}15`,
										color,
										border: `1px solid ${color}30`
									},
									children: [group.length, " students"]
								})]
							}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 py-3 space-y-2",
								children: [1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 rounded-xl bg-slate-800/50 animate-pulse" }, i))
							}) : group.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 py-4 text-xs text-slate-600 italic",
								children: "No students at this milestone yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "divide-y divide-slate-900/40",
								children: [group.slice(0, 5).map((entry) => {
									const isCurrentUser = entry.id === user?.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center gap-3 px-5 py-2.5 ${isCurrentUser ? "" : "hover:bg-slate-800/15"} transition-colors`,
										style: isCurrentUser ? { background: "rgba(167,139,250,0.06)" } : {},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "w-7 text-xs font-bold text-slate-600 tabular-nums",
												children: ["#", entry.rank]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: entry.avatar_url || getInitialsAvatar(entry.name ?? "?"),
												alt: entry.name ?? "",
												className: "w-7 h-7 rounded-full border border-slate-700 bg-slate-800"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `flex-1 text-sm truncate ${isCurrentUser ? "text-violet-300 font-semibold" : "text-slate-300"}`,
												children: isCurrentUser ? "You" : entry.name ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-bold tabular-nums text-slate-300",
												children: entry.readiness_score ?? 0
											})
										]
									}, entry.id);
								}), group.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-5 py-2.5 text-xs text-slate-600 flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" }),
										group.length - 5,
										" more at this milestone"
									]
								})]
							})]
						}, milestone);
					})
				}),
				!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-10 h-10 text-slate-600 mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-heading font-semibold text-slate-300 mb-2",
							children: "Join the Arena"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500 mb-5",
							children: "Sign in with your Karunya institutional account to track your rank and compete with batchmates."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-sm font-semibold transition-colors",
							children: "Get Started →"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LeaderboardPage as component };
