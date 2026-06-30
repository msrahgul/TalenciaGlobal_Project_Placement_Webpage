import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as useAuth, t as AuthProvider } from "./AuthContext-zkUkKsx2.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { E as LogOut, h as Settings, i as User, n as X } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { I as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, k as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CompanyProvider } from "./CompanyContext-BG10XvC_.mjs";
import { t as Route$8 } from "./chat-wMuKBjBU.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-wDmahJev.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Dx48r3PS.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var INDUSTRY_SECTORS = [
	"IT & Software",
	"AI & Data",
	"Finance & Banking",
	"Consulting",
	"Healthcare & Pharma",
	"E-Commerce & Retail",
	"Cybersecurity",
	"Media & Entertainment",
	"Energy & Environment",
	"Automotive",
	"Aerospace & Defense",
	"Telecommunications"
];
function OnboardingModal() {
	const { user, profile, isLoading, refreshProfile, isAdmin } = useAuth();
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [selectedSkills, setSelectedSkills] = (0, import_react.useState)([]);
	const [selectedSectors, setSelectedSectors] = (0, import_react.useState)([]);
	const [step, setStep] = (0, import_react.useState)(1);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function fetchSkills() {
			const { data, error } = await supabase.from("skill_set_master").select("*").order("skill_set_name");
			if (!error && data) setSkills(data);
		}
		if (user && !profile && !isLoading && !isAdmin) fetchSkills();
	}, [
		user,
		profile,
		isLoading,
		isAdmin
	]);
	if (isLoading || !user || profile || isAdmin) return null;
	const toggleSkill = (shortName) => {
		setSelectedSkills((prev) => prev.includes(shortName) ? prev.filter((s) => s !== shortName) : [...prev, shortName]);
	};
	const toggleSector = (sector) => {
		setSelectedSectors((prev) => prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]);
	};
	const handleSubmit = async () => {
		if (selectedSkills.length === 0) {
			toast.error("Please select at least one skill.");
			return;
		}
		if (selectedSectors.length === 0) {
			toast.error("Please select at least one target sector.");
			return;
		}
		setIsSubmitting(true);
		const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
		const avatar_url = user.user_metadata?.avatar_url || "";
		const { error } = await supabase.from("student_profiles").insert({
			id: user.id,
			name,
			email: user.email,
			avatar_url,
			skills: selectedSkills,
			target_sectors: selectedSectors,
			readiness_score: 10,
			current_milestone: "Profile Formed"
		});
		setIsSubmitting(false);
		if (error) {
			console.error("Onboarding error:", error);
			toast.error("Failed to create profile. Please try again.");
		} else {
			toast.success("Profile created successfully!");
			await refreshProfile();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex-shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold text-white mb-2 font-heading tracking-tight",
							children: step === 1 ? "Target Sectors" : "Technical Skills"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-slate-800"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-slate-800"}` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm",
							children: step === 1 ? "Select the industry sectors you are most interested in pursuing." : "Select the technical skills you possess for personalized company matching."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto min-h-0 pr-2 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
						children: step === 1 ? INDUSTRY_SECTORS.map((sector) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleSector(sector),
								className: `flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${selectedSectors.includes(sector) ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"}`,
								children: sector
							}, sector);
						}) : skills.map((skill) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleSkill(skill.short_name),
								className: `flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${selectedSkills.includes(skill.short_name) ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"}`,
								children: skill.short_name
							}, skill.skill_set_id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-between flex-shrink-0 pt-4 border-t border-slate-800/50",
					children: [step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep(1),
						variant: "outline",
						className: "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
						children: "Back"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep(2),
						disabled: selectedSectors.length === 0,
						className: "bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2 rounded-xl transition-all",
						children: "Next Step"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSubmit,
						disabled: isSubmitting || selectedSkills.length === 0,
						className: "bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]",
						children: isSubmitting ? "Saving..." : "Save Profile & Continue"
					})]
				})
			]
		})
	});
}
function PreferencesModal({ isOpen, onClose }) {
	const { user, profile, refreshProfile } = useAuth();
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [selectedSkills, setSelectedSkills] = (0, import_react.useState)([]);
	const [selectedSectors, setSelectedSectors] = (0, import_react.useState)([]);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function fetchSkills() {
			const { data, error } = await supabase.from("skill_set_master").select("*").order("skill_set_name");
			if (!error && data) setSkills(data);
		}
		if (isOpen) {
			fetchSkills();
			if (profile) {
				setSelectedSkills(profile.skills || []);
				setSelectedSectors(profile.target_sectors || []);
			}
		}
	}, [isOpen, profile]);
	if (!isOpen || !profile || !user) return null;
	const toggleSkill = (shortName) => {
		setSelectedSkills((prev) => prev.includes(shortName) ? prev.filter((s) => s !== shortName) : [...prev, shortName]);
	};
	const toggleSector = (sector) => {
		setSelectedSectors((prev) => prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]);
	};
	const handleSubmit = async () => {
		if (selectedSkills.length === 0) {
			toast.error("Please select at least one skill.");
			return;
		}
		if (selectedSectors.length === 0) {
			toast.error("Please select at least one target sector.");
			return;
		}
		setIsSubmitting(true);
		const { error } = await supabase.from("student_profiles").update({
			skills: selectedSkills,
			target_sectors: selectedSectors
		}).eq("id", user.id);
		setIsSubmitting(false);
		if (error) {
			console.error("Update error:", error);
			toast.error("Failed to update preferences. Please try again.");
		} else {
			toast.success("Preferences updated successfully!");
			await refreshProfile();
			onClose();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center p-6 border-b border-slate-800/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-white font-heading tracking-tight",
						children: "Manage Preferences"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-400 text-sm mt-1",
						children: "Update your target sectors and technical skills"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto min-h-0 p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-semibold text-white mb-3 flex items-center gap-2",
						children: ["Target Industries", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20",
							children: [selectedSectors.length, " selected"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
						children: INDUSTRY_SECTORS.map((sector) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleSector(sector),
								className: `flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${selectedSectors.includes(sector) ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"}`,
								children: sector
							}, sector);
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-semibold text-white mb-3 flex items-center gap-2",
						children: ["Technical Skills", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20",
							children: [selectedSkills.length, " selected"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
						children: skills.map((skill) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleSkill(skill.short_name),
								className: `flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${selectedSkills.includes(skill.short_name) ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"}`,
								children: skill.short_name
							}, skill.skill_set_id);
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 flex justify-end flex-shrink-0 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSubmit,
						disabled: isSubmitting || selectedSkills.length === 0 || selectedSectors.length === 0,
						className: "bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]",
						children: isSubmitting ? "Saving..." : "Save Preferences"
					})
				})
			]
		})
	});
}
function UserNav() {
	const { user, profile, signOut } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	const [isPreferencesOpen, setIsPreferencesOpen] = (0, import_react.useState)(false);
	if (!user || !profile) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setIsMenuOpen(!isMenuOpen),
			className: "flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 p-1.5 pr-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-blue-500",
				children: profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: profile.avatar_url,
					alt: profile.name,
					className: "h-full w-full rounded-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
			}), profile.name.split(" ")[0]]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40",
			onClick: () => setIsMenuOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 10,
				scale: .95
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: 10,
				scale: .95
			},
			transition: { duration: .15 },
			className: "absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 border-b border-slate-800/60 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-white",
						children: profile.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 truncate",
						children: user.email
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setIsMenuOpen(false);
						setIsPreferencesOpen(true);
					},
					className: "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 text-slate-400" }), "Manage Preferences"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setIsMenuOpen(false);
						signOut();
					},
					className: "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Sign Out"]
				})
			]
		})] }) })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModal, {
		isOpen: isPreferencesOpen,
		onClose: () => setIsPreferencesOpen(false)
	})] });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-heading text-7xl font-semibold tracking-tight text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-lg font-medium text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-accent-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-heading text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-full bg-accent-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "KITS Placement Intelligence Hub" },
			{
				name: "description",
				content: "Karunya Institute of Technology and Sciences — Companies Research & Placement Analytics Portal."
			},
			{
				name: "author",
				content: "KITS"
			},
			{
				property: "og:title",
				content: "KITS Placement Intelligence Hub"
			},
			{
				property: "og:description",
				content: "Your strategic edge for campus placements."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CompanyProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed top-6 right-6 z-[60]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserNav, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		] }) }) })
	});
}
var $$splitComponentImporter$6 = () => import("./leaderboard-CEfQcF-I.mjs");
var Route$6 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [{ title: "Leaderboard — KITS Placement Intelligence Hub" }, {
		name: "description",
		content: "Compete with peers, track your readiness score, and see your global rank on the KITS Placement leaderboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./company-BBgGnDhD.mjs");
var Route$5 = createFileRoute("/company")({
	beforeLoad: ({ location }) => {
		if (location.pathname === "/company" || location.pathname === "/company/") throw redirect({ to: "/company/intelligence" });
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./routes-wK2NeV4y.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "KITS Companies Research & Placement Analytics Portal" }, {
		name: "description",
		content: "Browse companies recruiting at Karunya Institute of Technology and Sciences with deep intelligence and skill insights."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./company.skills-EVy00zqf.mjs");
var Route$3 = createFileRoute("/company/skills")({
	head: () => ({ meta: [{ title: "Skill Intelligence — KITS Placement Hub" }, {
		name: "description",
		content: "Bloom-mapped skill ladder and 10-level topic roadmaps."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./company.leaderboard-DJsFJ741.mjs");
var Route$2 = createFileRoute("/company/leaderboard")({
	head: () => ({ meta: [{ title: "Company Leaderboard — KITS Placement Hub" }, {
		name: "description",
		content: "Aspirants leaderboard for this company."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./company.intelligence-CeZQV4bN.mjs");
var Route$1 = createFileRoute("/company/intelligence")({
	head: () => ({ meta: [{ title: "Company Intelligence — KITS Placement Hub" }, {
		name: "description",
		content: "22-section deep dive on a recruiting company."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.dashboard-X7C2Xkg8.mjs");
var Route = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Admin Dashboard — KITS Placement Hub" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var LeaderboardRoute = Route$6.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => Route$7
});
var CompanyRoute = Route$5.update({
	id: "/company",
	path: "/company",
	getParentRoute: () => Route$7
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var CompanySkillsRoute = Route$3.update({
	id: "/skills",
	path: "/skills",
	getParentRoute: () => CompanyRoute
});
var CompanyLeaderboardRoute = Route$2.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => CompanyRoute
});
var CompanyIntelligenceRoute = Route$1.update({
	id: "/intelligence",
	path: "/intelligence",
	getParentRoute: () => CompanyRoute
});
var ApiChatRoute = Route$8.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$7
});
var AdminDashboardRoute = Route.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => Route$7
});
var CompanyRouteChildren = {
	CompanyIntelligenceRoute,
	CompanyLeaderboardRoute,
	CompanySkillsRoute
};
var rootRouteChildren = {
	IndexRoute,
	CompanyRoute: CompanyRoute._addFileChildren(CompanyRouteChildren),
	LeaderboardRoute,
	AdminDashboardRoute,
	ApiChatRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 1e3 * 60 * 5,
			gcTime: 1e3 * 60 * 10,
			retry: 1
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
