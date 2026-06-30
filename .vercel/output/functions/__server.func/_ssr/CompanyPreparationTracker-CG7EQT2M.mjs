import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./AuthContext-zkUkKsx2.mjs";
import { D as LogIn, V as Circle, at as CircleCheck, l as Target, rt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompanyPreparationTracker-CG7EQT2M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	{
		label: "Not Started",
		emoji: "🔍",
		desc: "Haven't begun exploring this company yet",
		color: "#64748b",
		glow: "rgba(100,116,139,0.35)",
		bg: "rgba(100,116,139,0.08)"
	},
	{
		label: "Researching",
		emoji: "📖",
		desc: "Studying culture, tech stack & role requirements",
		color: "#38bdf8",
		glow: "rgba(56,189,248,0.35)",
		bg: "rgba(56,189,248,0.08)"
	},
	{
		label: "Skill Building",
		emoji: "⚙️",
		desc: "Actively upskilling for this company's requirements",
		color: "#a78bfa",
		glow: "rgba(167,139,250,0.35)",
		bg: "rgba(167,139,250,0.08)"
	},
	{
		label: "Interview Prep",
		emoji: "🎯",
		desc: "Doing mock interviews & company-specific prep",
		color: "#fb923c",
		glow: "rgba(251,146,60,0.35)",
		bg: "rgba(251,146,60,0.08)"
	},
	{
		label: "Ready",
		emoji: "🚀",
		desc: "Fully prepared — ready to apply!",
		color: "#4ade80",
		glow: "rgba(74,222,128,0.35)",
		bg: "rgba(74,222,128,0.08)"
	}
];
var STAGE_INDEX = {
	"Not Started": 0,
	Researching: 1,
	"Skill Building": 2,
	"Interview Prep": 3,
	Ready: 4
};
function CompanyPreparationTracker({ companyId }) {
	const { user } = useAuth();
	const [currentStage, setCurrentStage] = (0, import_react.useState)("Not Started");
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isUpdating, setIsUpdating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setIsLoading(false);
			return;
		}
		async function fetchStage() {
			try {
				const { data, error } = await supabase.from("student_company_tracking").select("preparation_stage").eq("student_id", user.id).eq("company_id", companyId).maybeSingle();
				if (error) throw error;
				if (data?.preparation_stage) setCurrentStage(data.preparation_stage);
			} catch (err) {
				console.error("[CompanyPreparationTracker] fetch error:", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchStage();
	}, [user, companyId]);
	async function handleStageClick(stage) {
		if (!user || isUpdating) return;
		if (stage === currentStage) return;
		setIsUpdating(true);
		const optimisticPrev = currentStage;
		setCurrentStage(stage);
		try {
			const { error } = await supabase.from("student_company_tracking").upsert({
				student_id: user.id,
				company_id: companyId,
				preparation_stage: stage,
				last_updated: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "student_id,company_id" });
			if (error) throw error;
			toast.success("Stage updated!", { description: `You are now in: ${stage}` });
		} catch (err) {
			console.error("[CompanyPreparationTracker] upsert error:", err);
			setCurrentStage(optimisticPrev);
			toast.error("Update failed", { description: "Could not save your preparation stage. Try again." });
		} finally {
			setIsUpdating(false);
		}
	}
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-5 h-5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-slate-400",
				children: "Your Preparation Stage"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 py-6 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-8 h-8 text-slate-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500",
				children: "Sign in to track your preparation for this company"
			})]
		})]
	});
	const currentIdx = STAGE_INDEX[currentStage];
	const currentConfig = STAGES[currentIdx];
	const progressPct = currentIdx / (STAGES.length - 1) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-5 h-5 text-[var(--theme-text,#a78bfa)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-slate-200",
					children: "Your Preparation Stage"
				})]
			}), isUpdating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs text-slate-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "Saving…"]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded-full bg-slate-800 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-between gap-2",
				children: STAGES.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-14 rounded-xl bg-slate-800/60 animate-pulse" }, i))
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-1.5 w-full rounded-full bg-slate-800 mb-5 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "absolute inset-y-0 left-0 rounded-full",
					initial: { width: 0 },
					animate: { width: `${progressPct}%` },
					transition: {
						duration: .6,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					style: {
						background: `linear-gradient(90deg, #38bdf8, ${currentConfig.color})`,
						boxShadow: `0 0 12px ${currentConfig.glow}`
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: STAGES.map((stage, idx) => {
					const isCompleted = idx < currentIdx;
					const isCurrent = idx === currentIdx;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.04,
							y: -2
						},
						whileTap: { scale: .97 },
						onClick: () => handleStageClick(stage.label),
						disabled: isUpdating,
						className: `flex-1 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer outline-none disabled:opacity-60 disabled:cursor-not-allowed ${isCurrent ? "shadow-lg" : isCompleted ? "border-slate-700/60 bg-slate-900/30 hover:border-slate-600" : "border-slate-800/40 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/20"}`,
						style: isCurrent ? {
							borderColor: `${stage.color}50`,
							background: stage.bg,
							boxShadow: `0 0 20px ${stage.glow}`
						} : {},
						title: stage.desc,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: { scale: 0 },
									animate: { scale: 1 },
									exit: { scale: 0 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										className: "w-5 h-5",
										style: { color: stage.color }
									})
								}, "check") : isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									initial: {
										scale: .5,
										opacity: 0
									},
									animate: {
										scale: 1,
										opacity: 1
									},
									className: "text-lg leading-none",
									children: stage.emoji
								}, "emoji") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "w-5 h-5 text-slate-700" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold leading-tight",
							style: { color: isCurrent ? stage.color : isCompleted ? "#94a3b8" : "#475569" },
							children: stage.label
						})]
					}, stage.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
					initial: {
						opacity: 0,
						y: 4
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -4
					},
					transition: { duration: .25 },
					className: "mt-3.5 text-center text-xs text-slate-500",
					children: [
						currentConfig.emoji,
						" ",
						currentConfig.desc
					]
				}, currentStage)
			})
		] })]
	});
}
//#endregion
export { STAGES as n, CompanyPreparationTracker as t };
