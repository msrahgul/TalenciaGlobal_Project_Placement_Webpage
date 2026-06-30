import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useCompanySkills, o as proficiencyToBloom, s as scoreToCriticality } from "./companyApi-BITDVXfd.mjs";
import { A as Info, G as ChevronDown, O as Lock, U as ChevronRight, t as Zap } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as readStoredCompany, r as useCompany } from "./CompanyContext-BG10XvC_.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.skills-EVy00zqf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BLOOM_LEGEND = [
	{
		code: "CU",
		label: "Understand",
		color: "#3b82f6",
		from: "#93c5fd",
		to: "#3b82f6"
	},
	{
		code: "AP",
		label: "Apply",
		color: "#22c55e",
		from: "#86efac",
		to: "#22c55e"
	},
	{
		code: "AS",
		label: "Analyze",
		color: "#eab308",
		from: "#fde047",
		to: "#eab308"
	},
	{
		code: "EV",
		label: "Evaluate",
		color: "#ef4444",
		from: "#fca5a5",
		to: "#ef4444"
	},
	{
		code: "CR",
		label: "Create",
		color: "#a855f7",
		from: "#d8b4fe",
		to: "#a855f7"
	}
];
var CRIT_LEGEND = [
	{
		label: "Critical",
		color: "#ef4444",
		bg: "rgba(239,68,68,0.08)",
		desc: "Score ≥ 7 — must clear for the role."
	},
	{
		label: "Important",
		color: "#d97706",
		bg: "rgba(217,119,6,0.08)",
		desc: "Score 5–6 — strong differentiator."
	},
	{
		label: "Baseline",
		color: "#16a34a",
		bg: "rgba(22,163,74,0.08)",
		desc: "Score ≤ 4 — foundational coverage."
	}
];
function GlowBar({ level, color, from, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-2 flex-1 overflow-hidden rounded-full bg-slate-950 border border-slate-900/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute left-0 top-0 h-full rounded-full",
				initial: { width: 0 },
				animate: { width: `${level * 10}%` },
				transition: {
					duration: .8,
					ease: [
						.22,
						1,
						.36,
						1
					],
					delay: .15
				},
				style: {
					background: `linear-gradient(90deg, ${from}, ${to})`,
					boxShadow: `0 0 12px ${color}55`
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "w-10 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-400",
			children: [level, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-normal text-slate-500",
				children: "/10"
			})]
		})]
	});
}
function SkillIntelligencePage() {
	const { selected } = useCompany();
	const { data, isLoading, isError, refetch } = useCompanySkills((selected ?? readStoredCompany())?.companyId ?? 1);
	const skills = (data?.skills ?? []).slice().sort((a, b) => b.required_level - a.required_level);
	const roadmaps = data?.roadmaps ?? {};
	const [open, setOpen] = (0, import_react.useState)({});
	const [showMobileLegends, setShowMobileLegends] = (0, import_react.useState)(false);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:flex lg:flex-col gap-4 w-80 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 space-y-3",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 animate-pulse rounded-2xl bg-slate-900/40 border border-slate-900" }, i))
			})]
		})
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-red-400",
			children: "Failed to load skill intelligence data."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800",
			onClick: () => refetch(),
			children: "Try again"
		})]
	});
	if (skills.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground",
		children: "No skill requirements registered for this company."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row gap-6 items-start",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden lg:flex lg:flex-col gap-4 w-80 sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 no-scrollbar shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-850/80 bg-slate-950/30 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-[var(--theme-text)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400",
								children: "Bloom's Taxonomy Levels"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-col gap-4 pl-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[13px] top-3 bottom-6 w-0.5 bg-slate-900" }), BLOOM_LEGEND.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-sm",
									style: {
										background: `linear-gradient(135deg, ${b.from}, ${b.to})`,
										boxShadow: `0 2px 8px -1px ${b.color}44`
									},
									children: b.code
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-slate-200",
										children: b.label
									})
								})]
							}, b.code))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-850/80 bg-slate-950/30 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400",
								children: "Criticality Guidelines"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-3",
							children: CRIT_LEGEND.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-slate-900/60 p-3",
								style: { background: c.bg },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2 w-2 rounded-full animate-pulse",
										style: {
											backgroundColor: c.color,
											boxShadow: `0 0 6px ${c.color}`
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-heading text-xs font-bold",
										style: { color: c.color },
										children: c.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] leading-relaxed text-slate-400",
									children: c.desc
								})]
							}, c.label))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full lg:hidden border border-slate-850/80 bg-slate-950/20 rounded-2xl overflow-hidden transition-all duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowMobileLegends(!showMobileLegends),
						className: "w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-[var(--theme-text)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Taxonomy Legends & Guidelines" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showMobileLegends ? "rotate-180" : ""}` })]
					}), showMobileLegends && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-900 bg-slate-950/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400",
								children: "Bloom's Levels"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-2",
								children: BLOOM_LEGEND.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-extrabold text-white",
										style: { background: `linear-gradient(135deg, ${b.from}, ${b.to})` },
										children: b.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-slate-400 font-semibold",
										children: b.label
									})]
								}, b.code))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-900 bg-slate-950/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400",
								children: "Criticality Guide"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: CRIT_LEGEND.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										style: { color: c.color },
										children: c.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-right",
										children: c.desc.split(" — ")[0]
									})]
								}, c.label))
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-grow space-y-4 w-full",
					children: skills.map((skill, idx) => {
						const bloom = proficiencyToBloom(skill.required_level);
						const crit = scoreToCriticality(skill.required_level);
						const bloomData = BLOOM_LEGEND.find((b) => b.color === bloom.color) ?? BLOOM_LEGEND[0];
						const isOpen = !!open[skill.skill_set_id];
						const roadmap = roadmaps[skill.skill_set_id] ?? [];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 14
							},
							animate: {
								opacity: 1,
								y: 0
							},
							whileHover: { y: -3 },
							whileTap: { scale: .99 },
							transition: {
								duration: .4,
								delay: idx * .03,
								ease: [
									.22,
									1,
									.36,
									1
								]
							},
							className: "rounded-2xl border border-slate-850/80 bg-gradient-to-b from-slate-900/40 to-slate-950/95 overflow-hidden shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-[var(--theme-gradient-from)] hover:to-[var(--theme-gradient-to)] hover:border-[var(--theme-border)] hover:shadow-[0_0_30px_var(--theme-shadow)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen((o) => ({
									...o,
									[skill.skill_set_id]: !o[skill.skill_set_id]
								})),
								className: "flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-slate-900/20 cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white font-heading",
										style: {
											background: `linear-gradient(135deg, ${bloomData.from}, ${bloomData.to})`,
											boxShadow: `0 4px 14px -4px ${bloom.color}55`
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-extrabold leading-none",
											children: skill.required_level
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-medium opacity-80 mt-0.5",
											children: "/10"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-heading text-sm font-bold text-slate-100 sm:text-base",
														children: skill.skill_set_name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm",
														style: {
															background: `linear-gradient(135deg, ${bloomData.from}, ${bloomData.to})`,
															boxShadow: `0 2px 8px -2px ${bloom.color}55`
														},
														children: [
															bloom.code,
															" · ",
															bloom.label
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
														style: {
															background: `${crit.color}15`,
															color: crit.color,
															border: `1px solid ${crit.color}30`
														},
														children: crit.label
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1.5 text-xs text-slate-400",
												children: ["Required proficiency: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-slate-200",
													children: skill.required_proficiency
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlowBar, {
													level: skill.required_level,
													color: bloom.color,
													from: bloomData.from,
													to: bloomData.to
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 shrink-0 p-1.5 rounded-lg bg-slate-950/40 border border-slate-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
											animate: { rotate: isOpen ? 90 : 0 },
											transition: {
												type: "spring",
												stiffness: 300,
												damping: 25
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-slate-500" })
										})
									})
								]
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
										opacity: { duration: .3 }
									},
									className: "overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-slate-900 bg-slate-950/30 px-5 pb-6 pt-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 mb-4 border-b border-slate-900 pb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-[var(--theme-text)] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-[10px] font-bold uppercase tracking-widest text-slate-400",
												children: "10-Level Topic Learning Roadmap"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative pl-2 space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[15px] top-4 bottom-8 w-0.5 bg-slate-900" }), roadmap.map((topic, i) => {
												const level = i + 1;
												const locked = level > skill.required_level;
												const levelBloom = proficiencyToBloom(level);
												const levelBloomData = BLOOM_LEGEND.find((b) => b.color === levelBloom.color) ?? BLOOM_LEGEND[0];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													initial: {
														opacity: 0,
														x: -8
													},
													animate: {
														opacity: 1,
														x: 0
													},
													transition: {
														delay: i * .02,
														duration: .3
													},
													className: `relative flex items-start gap-4 rounded-xl border p-3 transition-all duration-300 ${locked ? "border-slate-900/40 bg-slate-950/10 opacity-30" : "border-slate-900 bg-slate-950/50 hover:border-slate-800 shadow-sm"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
															style: locked ? {
																background: "#1e293b",
																border: "1px solid rgba(255,255,255,0.05)"
															} : {
																background: `linear-gradient(135deg, ${levelBloomData.from}, ${levelBloomData.to})`,
																boxShadow: `0 2px 6px -2px ${levelBloom.color}77`
															},
															children: level
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0 flex-1 pt-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-sm font-semibold text-slate-200 leading-snug",
																children: topic
															}), locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Beyond Scope of Role"]
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide",
																style: { color: "var(--theme-text-hover)" },
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "inline-block h-1.5 w-1.5 rounded-full",
																	style: { backgroundColor: "var(--theme-icon)" }
																}), "Coverage Required"]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `hidden sm:inline-flex rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase shrink-0 border ${locked ? "bg-slate-900/20 border-slate-900 text-slate-500" : "bg-slate-950/60 border-slate-900 text-slate-400"}`,
															children: levelBloom.code
														})
													]
												}, i);
											})]
										})]
									})
								}, "roadmap")
							})]
						}, skill.skill_set_id);
					})
				})
			]
		})
	});
}
//#endregion
export { SkillIntelligencePage as component };
