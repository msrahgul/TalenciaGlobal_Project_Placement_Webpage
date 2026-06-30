import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useAuth } from "./AuthContext-zkUkKsx2.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as normalizeSector, l as useCompanies, n as getCategoryAccent, r as getCategoryHue } from "./companyApi-BITDVXfd.mjs";
import { $ as ArrowRight, P as Globe, _ as Search, a as Trophy, n as X, nt as Sparkles, o as TrendingUp, q as Building2, r as Users, s as TrendingDown, w as MapPin } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CFoaHS6j.mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useCompany } from "./CompanyContext-BG10XvC_.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-wK2NeV4y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
function DashboardWidget() {
	const navigate = useNavigate();
	const { user, profile, isLoading: isAuthLoading } = useAuth();
	const { data: companies = [], isLoading: isCompaniesLoading } = useCompanies();
	const { selectCompany } = useCompany();
	const [matchingCompanies, setMatchingCompanies] = (0, import_react.useState)([]);
	const [isMatching, setIsMatching] = (0, import_react.useState)(false);
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function matchCompanies() {
			if (!profile || companies.length === 0) return;
			setIsMatching(true);
			try {
				const { data: levels, error } = await supabase.from("company_skill_levels").select("company_id, skill_set_id").limit(2e3);
				if (error) throw error;
				const { data: masters, error: mError } = await supabase.from("skill_set_master").select("skill_set_id, short_name");
				if (mError) throw mError;
				const companySkillsMap = /* @__PURE__ */ new Map();
				levels?.forEach((level) => {
					const m = masters?.find((m) => m.skill_set_id === level.skill_set_id);
					if (m) {
						if (!companySkillsMap.has(level.company_id)) companySkillsMap.set(level.company_id, /* @__PURE__ */ new Set());
						companySkillsMap.get(level.company_id)?.add(m.short_name);
					}
				});
				const targetSectors = profile.target_sectors || [];
				setMatchingCompanies(companies.map((company) => {
					const required = companySkillsMap.get(company.company_id);
					let overlap = 0;
					if (required && required.size > 0) profile.skills.forEach((skill) => {
						if (required.has(skill)) overlap++;
					});
					let matchScore = required && required.size > 0 ? Math.round(overlap / required.size * 100) : 0;
					const normalizedCompanySector = normalizeSector(company.category);
					let sectorMatch = false;
					if (targetSectors.includes(normalizedCompanySector)) {
						sectorMatch = true;
						matchScore = Math.min(100, matchScore + 30);
					} else if (targetSectors.length > 0 && matchScore === 0) matchScore = -1;
					return {
						...company,
						matchScore,
						sectorMatch,
						normalizedSector: normalizedCompanySector
					};
				}).filter((c) => c.matchScore > 0 || c.sectorMatch).sort((a, b) => b.matchScore - a.matchScore).slice(0, 12));
			} catch (err) {
				console.error("Failed to match companies:", err);
			} finally {
				setIsMatching(false);
			}
		}
		matchCompanies();
	}, [profile, companies]);
	if (isAuthLoading || !user || !profile) return null;
	const displayedCompanies = showAll ? matchingCompanies : matchingCompanies.slice(0, 3);
	const handleSelect = (c) => {
		selectCompany({
			companyId: c.company_id,
			companyName: c.name,
			logoUrl: c.logo_url
		});
		navigate({ to: "/company/intelligence" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "text-3xl font-heading font-bold text-white mb-2",
			children: ["Welcome back, ", profile.name]
		}), profile.target_sectors && profile.target_sectors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-2",
				children: "Target Industries:"
			}), profile.target_sectors.map((sector) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300",
				children: sector
			}, sector))]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-xl font-heading font-bold text-white flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-5 h-5 text-yellow-500" }), "Suggested for You"]
			}), matchingCompanies.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setShowAll(!showAll),
				className: "text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors",
				children: showAll ? "Show Less" : `Show More (${matchingCompanies.length - 3})`
			})]
		}), isCompaniesLoading || isMatching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
			children: [
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" }, i))
		}) : matchingCompanies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-12 rounded-2xl bg-slate-900/20 border border-slate-800/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-400",
				children: "No companies matched your skills or sectors yet. Try updating your preferences!"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
			children: displayedCompanies.map((company, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 15
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: idx * .05 },
				className: `group rounded-2xl border ${company.sectorMatch ? "border-purple-500/30 bg-purple-500/5" : "border-slate-800 bg-slate-900/40"} p-5 hover:bg-slate-800/60 hover:border-blue-500/40 transition-all cursor-pointer`,
				onClick: () => handleSelect(company),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-start mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
								logoUrl: company.logo_url,
								name: company.name,
								size: 36
							})
						}), company.sectorMatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase tracking-wider font-bold rounded-full",
							children: "Industry Match"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] uppercase tracking-wider font-bold rounded-full",
							children: "Skill Match"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-heading font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors",
						children: company.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-slate-500 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: company.office_locations?.split(",")[0] || "Global"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-800 flex items-center justify-between group-hover:border-slate-700 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-slate-400",
							children: company.normalizedSector
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" })]
					})
				]
			}, company.company_id))
		})] })]
	});
}
var COLLEGE_SHORT = "KITS";
var COLLEGE_NAME = "Karunya Institute of Technology and Sciences";
var nil = (v) => !v || [
	"na",
	"n/a",
	"none",
	"-",
	"null",
	"undefined",
	""
].includes(v.trim().toLowerCase());
function domain(url) {
	if (!url || nil(url)) return null;
	return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}
var PlacementNetworkBackground = (0, import_react.memo)(function PlacementNetworkBackground() {
	const canvasRef = (0, import_react.useRef)(null);
	const mouseRef = (0, import_react.useRef)({
		x: -9999,
		y: -9999
	});
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		let rafId;
		let paused = false;
		let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		let W = window.innerWidth;
		let H = window.innerHeight;
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 1.5);
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = Math.floor(W * dpr);
			canvas.height = Math.floor(H * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		let lastMouseTime = 0;
		const onMouse = (e) => {
			const now = performance.now();
			if (now - lastMouseTime < 16) return;
			lastMouseTime = now;
			mouseRef.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const onLeave = () => {
			mouseRef.current = {
				x: -9999,
				y: -9999
			};
		};
		const onVisibility = () => {
			paused = document.hidden;
		};
		window.addEventListener("resize", resize, { passive: true });
		window.addEventListener("mousemove", onMouse, { passive: true });
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("visibilitychange", onVisibility);
		const COLORS = [
			{
				outer: "rgba(59, 130, 246, 0.18)",
				fill: "rgba(59, 130, 246, 0.75)"
			},
			{
				outer: "rgba(139, 92, 246, 0.18)",
				fill: "rgba(139, 92, 246, 0.75)"
			},
			{
				outer: "rgba(16, 185, 129, 0.18)",
				fill: "rgba(16, 185, 129, 0.75)"
			},
			{
				outer: "rgba(245, 158, 11, 0.15)",
				fill: "rgba(245, 158, 11, 0.75)"
			},
			{
				outer: "rgba(148, 163, 184, 0.15)",
				fill: "rgba(148, 163, 184, 0.70)"
			}
		];
		const particles = Array.from({ length: 40 }, (_, i) => {
			const dur = 18 + Math.random() * 24;
			const yFrac = Math.random();
			return {
				lp: Math.random() * 100,
				y: H + 50 - yFrac * (H + 100),
				sz: i < 8 ? 2.5 : Math.random() < .4 ? 2 : 1.5,
				spd: (H + 150) / (dur * 60),
				col: COLORS[i % COLORS.length],
				swA: 25 + Math.random() * 40,
				swS: .007 + Math.random() * .007,
				swP: Math.random() * Math.PI * 2,
				ox: 0,
				oy: 0,
				af: 0,
				dx: 0,
				dy: 0,
				md: 9999
			};
		});
		let t = 0;
		const draw = () => {
			if (paused) {
				rafId = requestAnimationFrame(draw);
				return;
			}
			t += .4;
			ctx.clearRect(0, 0, W, H);
			const mx = mouseRef.current.x;
			const my = mouseRef.current.y;
			const mouseActive = mx > -500;
			for (const p of particles) {
				p.y -= p.spd;
				if (p.y < -50) {
					p.y = H + 50;
					p.lp = Math.random() * 100;
				}
				const tx = p.lp * W / 100 + Math.sin(t * p.swS + p.swP) * p.swA;
				if (mouseActive) {
					const dx = tx - mx, dy = p.y - my;
					const dist = Math.sqrt(dx * dx + dy * dy);
					p.md = dist;
					if (dist < 160) {
						const f = (160 - dist) / 160;
						p.ox += (dx / (dist || 1) * f * 36 - p.ox) * .1;
						p.oy += (dy / (dist || 1) * f * 36 - p.oy) * .1;
						p.af += (1 - p.af) * .1;
					} else {
						p.ox *= .9;
						p.oy *= .9;
						p.af *= .9;
					}
				} else {
					p.md = 9999;
					p.ox *= .9;
					p.oy *= .9;
					p.af *= .9;
				}
				p.dx = tx + p.ox;
				p.dy = p.y + p.oy;
			}
			if (mouseActive) {
				ctx.lineWidth = .7;
				for (let i = 0; i < particles.length; i++) {
					const a = particles[i];
					if (a.md > 160) continue;
					for (let j = i + 1; j < particles.length; j++) {
						const b = particles[j];
						if (b.md > 160) continue;
						const ex = a.dx - b.dx, ey = a.dy - b.dy;
						const ed2 = ex * ex + ey * ey;
						if (ed2 < 12100) {
							(160 - a.md) / 160 * ((160 - b.md) / 160) * (1 - ed2 / 12100) * .16;
							ctx.beginPath();
							ctx.moveTo(a.dx, a.dy);
							ctx.lineTo(b.dx, b.dy);
							ctx.strokeStyle = `rgba(99,130,246,\${alpha.toFixed(3)})`;
							ctx.stroke();
						}
					}
				}
			}
			ctx.shadowBlur = 0;
			ctx.shadowColor = "transparent";
			for (const p of particles) {
				const outerRadius = p.sz * 3.5 * (1 + Math.sin(t * .02 + p.swP) * .25);
				ctx.beginPath();
				ctx.arc(p.dx, p.dy, outerRadius, 0, Math.PI * 2);
				ctx.strokeStyle = p.col.outer;
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(p.dx, p.dy, p.sz, 0, Math.PI * 2);
				ctx.fillStyle = p.col.fill;
				ctx.fill();
			}
			rafId = requestAnimationFrame(draw);
		};
		draw();
		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouse);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-0 select-none bg-[#0a0a0c] overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent z-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 w-full h-full z-10"
		})]
	});
});
var CompanyCard = (0, import_react.memo)(function CompanyCard({ company, onSelect, index }) {
	const growth = company.yoy_growth_rate ?? "";
	const neg = growth.trim().startsWith("-");
	const webDomain = domain(company.website_url);
	const primaryLocation = (0, import_react.useMemo)(() => {
		if (!company.office_locations || nil(company.office_locations)) return "";
		return company.office_locations.split(/[,;/·]/)[0].trim();
	}, [company.office_locations]);
	const shortCategory = (0, import_react.useMemo)(() => catShortName(company.category), [company.category]);
	const accent = (0, import_react.useMemo)(() => getCategoryAccent(company.category), [company.category]);
	const cardRef = (0, import_react.useRef)(null);
	const handleMouseMove = (e) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		cardRef.current.style.setProperty("--mouse-x", `${x}px`);
		cardRef.current.style.setProperty("--mouse-y", `${y}px`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		whileHover: { y: -4 },
		whileTap: { scale: .985 },
		transition: {
			duration: .35,
			delay: Math.min(index * .02, .4),
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			ref: cardRef,
			type: "button",
			onMouseMove: handleMouseMove,
			onClick: () => onSelect(company),
			className: `group relative overflow-hidden flex flex-col w-full rounded-2xl text-left border border-white/[0.05] bg-slate-900/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 p-6 min-h-[248px] transition-all duration-300 ease-in-out hover:bg-slate-800/40 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] ${accent.hoverBorder}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
					style: { background: "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.06), transparent 40%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
					style: {
						background: "radial-gradient(250px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99, 102, 241, 0.8), transparent 40%) border-box",
						WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
						border: "2px solid transparent"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col w-full h-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-6 -left-6 -right-6 h-px bg-gradient-to-r ${accent.stripe}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
								name: company.name,
								logoUrl: company.logo_url,
								website: company.website_url,
								size: 44,
								className: "shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/80 p-0.5"
							}), shortCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex items-center rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${accent.badgeBg} ${accent.badgeBorder} ${accent.badgeText}`,
								children: shortCategory
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "truncate font-heading text-[15px] font-bold leading-snug text-slate-100 group-hover:text-white transition-colors duration-200",
								children: company.name
							}), primaryLocation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors duration-200" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: primaryLocation
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 text-[11px] text-slate-600 italic",
								children: "Location unlisted"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 mt-4 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl bg-slate-950/20 border border-white/[0.04] px-3 py-2.5 group-hover:bg-slate-950/50 group-hover:border-slate-800/40 transition-all duration-300 ease-in-out",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 shrink-0 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-200",
									children: !nil(company.employee_size) ? company.employee_size.replace(/\s+/g, "") : "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-300 ease-in-out ${nil(growth) ? "bg-slate-950/20 border-white/[0.04] group-hover:bg-slate-950/50 group-hover:border-slate-800/40" : neg ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"}`,
								children: [nil(growth) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 shrink-0 text-slate-600" }) : neg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-[11px] font-semibold",
									children: !nil(growth) ? growth : "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 pt-3.5 border-t border-white/[0.04] group-hover:border-slate-800/30 flex items-center justify-between w-full transition-all duration-300 ease-in-out",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex items-center gap-1.5 text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors duration-200 truncate max-w-[65%]",
								children: webDomain && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: webDomain
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors duration-200 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" })]
							})]
						})
					]
				})
			]
		})
	});
});
var parseGrowth = (str) => {
	if (!str) return null;
	const s = str.replace(/[+%]/g, "").trim();
	const val = parseFloat(s);
	return isNaN(val) ? null : val;
};
var classifySize = (sizeStr) => {
	if (!sizeStr || nil(sizeStr)) return "Unknown";
	const s = sizeStr.toLowerCase().replace(/,/g, "").trim();
	if (s.includes("10k") || s.includes("50k") || s.includes("100k") || s.includes("10000") || s.includes("50000") || s.includes("100000")) return "Enterprise";
	if (s.includes("1k") || s.includes("5k") || s.includes("1000") || s.includes("2000") || s.includes("5000")) return "Large";
	if (s.includes("100") || s.includes("200") || s.includes("500") || s.includes("mid")) return "Mid-size";
	const num = parseFloat(s);
	if (!isNaN(num)) {
		if (num >= 1e4) return "Enterprise";
		if (num >= 1e3) return "Large";
		if (num >= 100) return "Mid-size";
		return "Small";
	}
	return "Small";
};
function HomepageAnalyticsDashboard({ companies }) {
	const [showDashboard, setShowDashboard] = (0, import_react.useState)(false);
	const totalCompanies = companies.length;
	const growthRates = (0, import_react.useMemo)(() => {
		return companies.map((c) => ({
			company: c,
			val: parseGrowth(c.yoy_growth_rate)
		})).filter((item) => item.val !== null);
	}, [companies]);
	const avgGrowth = (0, import_react.useMemo)(() => {
		if (growthRates.length === 0) return 0;
		return growthRates.reduce((acc, curr) => acc + curr.val, 0) / growthRates.length;
	}, [growthRates]);
	const positiveGrowthCount = (0, import_react.useMemo)(() => {
		return growthRates.filter((item) => item.val > 0).length;
	}, [growthRates]);
	const growthRatio = totalCompanies > 0 ? positiveGrowthCount / totalCompanies * 100 : 0;
	const uniqueCountries = (0, import_react.useMemo)(() => {
		const countriesSet = /* @__PURE__ */ new Set();
		companies.forEach((c) => {
			if (c.operating_countries && !nil(c.operating_countries)) c.operating_countries.split(/[,;/·]/g).forEach((item) => {
				const name = item.trim();
				if (name && !nil(name)) {
					let stdName = name;
					if (name.toLowerCase() === "usa") stdName = "United States";
					if (name.toLowerCase() === "uk") stdName = "United Kingdom";
					countriesSet.add(stdName.charAt(0).toUpperCase() + stdName.slice(1));
				}
			});
			else countriesSet.add("India");
		});
		return countriesSet;
	}, [companies]);
	const topGrowthCompanies = (0, import_react.useMemo)(() => {
		return [...growthRates].sort((a, b) => b.val - a.val).slice(0, 5);
	}, [growthRates]);
	const sizeDistribution = (0, import_react.useMemo)(() => {
		let enterprise = 0;
		let large = 0;
		let mid = 0;
		let small = 0;
		companies.forEach((c) => {
			const cls = classifySize(c.employee_size);
			if (cls === "Enterprise") enterprise++;
			else if (cls === "Large") large++;
			else if (cls === "Mid-size") mid++;
			else if (cls === "Small") small++;
		});
		const totalClassified = enterprise + large + mid + small;
		const pEnterprise = totalClassified > 0 ? enterprise / totalClassified * 100 : 0;
		const pLarge = totalClassified > 0 ? large / totalClassified * 100 : 0;
		const pMid = totalClassified > 0 ? mid / totalClassified * 100 : 0;
		const pSmall = totalClassified > 0 ? small / totalClassified * 100 : 0;
		return {
			totalClassified,
			enterprise,
			large,
			mid,
			small,
			pEnterprise,
			pLarge,
			pMid,
			pSmall
		};
	}, [companies]);
	if (totalCompanies === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-12 w-full relative z-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-5 border-b border-slate-800/50 pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.12)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-blue-400 animate-pulse" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-heading text-[11px] font-bold text-slate-200 tracking-[0.12em] uppercase leading-none",
					children: "Karunya Placement Analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500 mt-0.5",
					children: "Live recruiting intelligence"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setShowDashboard(!showDashboard),
				className: "rounded-full border-slate-700/60 bg-slate-900/50 text-[11px] font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-600 transition-all duration-200",
				children: showDashboard ? "Collapse" : "Expand"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: showDashboard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				transition: {
					duration: .4,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "overflow-hidden space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: "hidden",
					animate: "show",
					variants: {
						hidden: {},
						show: { transition: {
							staggerChildren: .08,
							delayChildren: .05
						} }
					},
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							variants: {
								hidden: {
									opacity: 0,
									y: 14
								},
								show: {
									opacity: 1,
									y: 0,
									transition: {
										duration: .45,
										ease: [
											.22,
											1,
											.36,
											1
										]
									}
								}
							},
							whileHover: { y: -3 },
							whileTap: { scale: .985 },
							className: "group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-blue-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500",
										children: "Recruiting Partners"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3 text-blue-400" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl font-extrabold font-heading text-slate-100 leading-none tabular-nums",
										children: totalCompanies
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 mt-1.5",
										children: "Verified Organizations"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							variants: {
								hidden: {
									opacity: 0,
									y: 14
								},
								show: {
									opacity: 1,
									y: 0,
									transition: {
										duration: .45,
										ease: [
											.22,
											1,
											.36,
											1
										]
									}
								}
							},
							whileHover: { y: -3 },
							whileTap: { scale: .985 },
							className: "group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-emerald-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500",
										children: "Avg YoY Growth"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3 text-emerald-400" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-3xl font-extrabold font-heading text-emerald-400 leading-none tabular-nums",
										children: [
											"+",
											avgGrowth.toFixed(1),
											"%"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 mt-1.5",
										children: "Annual Growth Trajectory"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							variants: {
								hidden: {
									opacity: 0,
									y: 14
								},
								show: {
									opacity: 1,
									y: 0,
									transition: {
										duration: .45,
										ease: [
											.22,
											1,
											.36,
											1
										]
									}
								}
							},
							whileHover: { y: -3 },
							whileTap: { scale: .985 },
							className: "group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-violet-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500",
										children: "Global Coverage"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 text-violet-400" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl font-extrabold font-heading text-slate-100 leading-none tabular-nums",
										children: uniqueCountries.size
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 mt-1.5",
										children: "Operating Countries"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							variants: {
								hidden: {
									opacity: 0,
									y: 14
								},
								show: {
									opacity: 1,
									y: 0,
									transition: {
										duration: .45,
										ease: [
											.22,
											1,
											.36,
											1
										]
									}
								}
							},
							whileHover: { y: -3 },
							whileTap: { scale: .985 },
							className: "group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-amber-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500",
										children: "Growth Ratio"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-amber-400" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-3xl font-extrabold font-heading text-amber-400 leading-none tabular-nums",
										children: [growthRatio.toFixed(0), "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-500 mt-1.5",
										children: "Expanding Partners"
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-6 flex flex-col hover:border-slate-700/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[9.5px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-5",
								children: "Top YoY Growth Leaders"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: topGrowthCompanies.map(({ company, val }, idx) => {
									const maxVal = topGrowthCompanies[0]?.val || 100;
									const pct = maxVal > 0 ? val / maxVal * 100 : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate pr-4 text-[12px] font-semibold text-slate-300",
												children: company.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums text-[12px] font-bold text-emerald-400 shrink-0",
												children: [
													"+",
													val?.toFixed(1),
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 w-full rounded-full bg-slate-950/80 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												initial: { width: 0 },
												animate: { width: `${pct}%` },
												transition: {
													duration: 1,
													delay: idx * .12,
													ease: [
														.22,
														1,
														.36,
														1
													]
												},
												className: "h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
											})
										})]
									}, company.company_id);
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-6 flex flex-col hover:border-slate-700/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[9.5px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-5",
								children: "Workforce Scale Distribution"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-center justify-around gap-6",
								children: [sizeDistribution.totalClassified > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center justify-center w-32 h-32 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 40 40",
										className: "w-full h-full transform -rotate-90",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "20",
												cy: "20",
												r: "15.9155",
												fill: "transparent",
												stroke: "#0a0f1a",
												strokeWidth: "5"
											}),
											sizeDistribution.pEnterprise > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
												cx: "20",
												cy: "20",
												r: "15.9155",
												fill: "transparent",
												stroke: "#3b82f6",
												strokeWidth: "5",
												strokeDasharray: `${sizeDistribution.pEnterprise} 100`,
												strokeDashoffset: 0,
												initial: { strokeDasharray: "0 100" },
												animate: { strokeDasharray: `${sizeDistribution.pEnterprise} 100` },
												transition: {
													duration: 1.1,
													ease: [
														.22,
														1,
														.36,
														1
													]
												}
											}),
											sizeDistribution.pLarge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
												cx: "20",
												cy: "20",
												r: "15.9155",
												fill: "transparent",
												stroke: "#6366f1",
												strokeWidth: "5",
												strokeDasharray: `${sizeDistribution.pLarge} 100`,
												strokeDashoffset: -sizeDistribution.pEnterprise,
												initial: { strokeDasharray: "0 100" },
												animate: { strokeDasharray: `${sizeDistribution.pLarge} 100` },
												transition: {
													duration: 1.1,
													ease: [
														.22,
														1,
														.36,
														1
													]
												}
											}),
											sizeDistribution.pMid > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
												cx: "20",
												cy: "20",
												r: "15.9155",
												fill: "transparent",
												stroke: "#8b5cf6",
												strokeWidth: "5",
												strokeDasharray: `${sizeDistribution.pMid} 100`,
												strokeDashoffset: -(sizeDistribution.pEnterprise + sizeDistribution.pLarge),
												initial: { strokeDasharray: "0 100" },
												animate: { strokeDasharray: `${sizeDistribution.pMid} 100` },
												transition: {
													duration: 1.1,
													ease: [
														.22,
														1,
														.36,
														1
													]
												}
											}),
											sizeDistribution.pSmall > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
												cx: "20",
												cy: "20",
												r: "15.9155",
												fill: "transparent",
												stroke: "#10b981",
												strokeWidth: "5",
												strokeDasharray: `${sizeDistribution.pSmall} 100`,
												strokeDashoffset: -(sizeDistribution.pEnterprise + sizeDistribution.pLarge + sizeDistribution.pMid),
												initial: { strokeDasharray: "0 100" },
												animate: { strokeDasharray: `${sizeDistribution.pSmall} 100` },
												transition: {
													duration: 1.1,
													ease: [
														.22,
														1,
														.36,
														1
													]
												}
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute flex flex-col items-center justify-center text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none",
											children: "Total"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-extrabold text-slate-200 mt-0.5",
											children: sizeDistribution.totalClassified
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-500 italic",
									children: "No size metrics available"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 grid grid-cols-2 gap-x-5 gap-y-3 w-full max-w-[240px]",
									children: [
										{
											color: "bg-blue-500",
											label: "Enterprise",
											count: sizeDistribution.enterprise,
											pct: sizeDistribution.pEnterprise
										},
										{
											color: "bg-indigo-500",
											label: "Large",
											count: sizeDistribution.large,
											pct: sizeDistribution.pLarge
										},
										{
											color: "bg-violet-500",
											label: "Mid-size",
											count: sizeDistribution.mid,
											pct: sizeDistribution.pMid
										},
										{
											color: "bg-emerald-500",
											label: "Small",
											count: sizeDistribution.small,
											pct: sizeDistribution.pSmall
										}
									].map(({ color, label, count, pct }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${color} shrink-0 mt-0.5` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-500 leading-none",
												children: label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-bold text-slate-200 mt-1",
												children: [
													count,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-500 font-medium",
														children: [
															"(",
															pct.toFixed(0),
															"%)"
														]
													})
												]
											})]
										})]
									}, label))
								})]
							})
						]
					})]
				})]
			})
		})]
	});
}
var catShortName = (cat) => {
	if (!cat || nil(cat)) return "";
	const s = cat.trim();
	if (s.toLowerCase().includes("information technology") || s.toLowerCase() === "it" || s.toLowerCase().includes("software")) return "Tech";
	if (s.toLowerCase().includes("consulting")) return "Consulting";
	if (s.toLowerCase().includes("finance") || s.toLowerCase().includes("banking")) return "Finance";
	if (s.toLowerCase().includes("healthcare") || s.toLowerCase().includes("pharma")) return "Healthcare";
	if (s.toLowerCase().includes("education") || s.toLowerCase().includes("edtech")) return "EdTech";
	return s.split(/\s+/)[0];
};
function IndexPage() {
	const navigate = useNavigate();
	const { selectCompany } = useCompany();
	const { user, signInWithGoogle, isAdmin } = useAuth();
	const [isGuest, setIsGuest] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isAdmin) navigate({
			to: "/admin/dashboard",
			replace: true
		});
	}, [isAdmin, navigate]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [sortBy, setSortBy] = (0, import_react.useState)("name");
	const [filterSector, setFilterSector] = (0, import_react.useState)(null);
	const { data: companies = [], isLoading, isError, refetch } = useCompanies();
	const sectors = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		companies.forEach((c) => {
			const cat = catShortName(c.category);
			if (cat) set.add(cat);
		});
		return Array.from(set).sort();
	}, [companies]);
	const deferred = (0, import_react.useDeferredValue)(query);
	const filtered = (0, import_react.useMemo)(() => {
		const q = deferred.trim().toLowerCase();
		let result = [...companies];
		if (filterSector) result = result.filter((c) => catShortName(c.category) === filterSector);
		if (q) result = result.filter((c) => {
			return c.name.toLowerCase().includes(q) || c.short_name.toLowerCase().includes(q) || (c.office_locations ?? "").toLowerCase().includes(q) || (c.operating_countries ?? "").toLowerCase().includes(q) || (c.category ?? "").toLowerCase().includes(q);
		});
		if (sortBy === "sector") result.sort((a, b) => {
			const catA = a.category || "";
			const catB = b.category || "";
			if (catA !== catB) return catA.localeCompare(catB);
			return a.name.localeCompare(b.name);
		});
		else result.sort((a, b) => a.name.localeCompare(b.name));
		return result;
	}, [
		companies,
		deferred,
		sortBy,
		filterSector
	]);
	const handleSelect = (c) => {
		selectCompany({
			companyId: c.company_id,
			companyName: c.name,
			logoUrl: c.logo_url
		});
		navigate({ to: "/company/intelligence" });
	};
	const showHeroOnly = !user && !isGuest;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `mesh-bg relative ${showHeroOnly ? "h-screen overflow-hidden" : "min-h-screen"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-bg absolute inset-0 z-0 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacementNetworkBackground, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: showHeroOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: {
						opacity: 0,
						y: -40
					},
					transition: {
						duration: .6,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "relative z-10 flex flex-col items-center justify-center h-full w-full px-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .5,
								delay: .1
							},
							className: "mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/50 px-4 py-1.5 text-[12px] font-medium text-slate-300 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-blue-500" })]
								}),
								COLLEGE_SHORT,
								" · Placement Intelligence Platform"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .2
							},
							className: "font-heading text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05]",
							children: [
								"Every recruiter at ",
								COLLEGE_SHORT,
								",",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400",
									children: "in one quiet place."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
							initial: {
								opacity: 0,
								y: 15
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .3
							},
							className: "mt-8 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-slate-400 font-medium",
							children: [
								"Deep company intelligence, skill maps, and growth analytics — engineered for the students and faculty of ",
								COLLEGE_NAME,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 15
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .4
							},
							className: "mt-12 flex flex-col items-center gap-3 justify-center w-full max-w-sm mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => signInWithGoogle(),
								className: "w-full h-14 px-8 text-[15px] font-semibold rounded-2xl bg-white hover:bg-slate-100 text-slate-900 shadow-[0_0_32px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "w-5 h-5",
									viewBox: "0 0 24 24",
									fill: "none",
									xmlns: "http://www.w3.org/2000/svg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
											fill: "#4285F4"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
											fill: "#34A853"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
											fill: "#FBBC05"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
											fill: "#EA4335"
										})
									]
								}), "Sign in with Google"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 15
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .5
							},
							className: "mt-6 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: () => setIsGuest(true),
								variant: "ghost",
								className: "text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full px-6",
								children: ["Continue as Guest ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 ml-2" })]
							})
						})
					]
				}, "hero") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { duration: .6 },
					className: "relative z-10 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "relative mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24",
						children: [
							!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-6 right-6 z-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => setIsGuest(false),
									className: "rounded-full bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg backdrop-blur-sm",
									children: "Sign In"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: -8
								},
								animate: {
									opacity: 1,
									y: 0
								},
								className: "mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex h-1.5 w-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" })]
									}),
									COLLEGE_SHORT,
									" · Placement Intelligence"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-heading text-[2.5rem] font-semibold tracking-[-0.035em] text-foreground sm:text-[3.5rem] leading-[1.02]",
								children: [
									"Every recruiter at ",
									COLLEGE_SHORT,
									",",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "in one quiet place."
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "mx-auto max-w-7xl px-5 pb-24 sm:px-8",
						children: [
							user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardWidget, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border mt-10 mb-10" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between mb-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "text-xl font-heading font-bold text-white flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-blue-500" }), "Complete Companies Directory"]
										})
									})
								]
							}),
							!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-10 flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-heading font-bold text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-blue-500" }), "Complete Companies Directory"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "glass-search relative flex items-center px-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none h-4 w-4 shrink-0 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: query,
												onChange: (e) => setQuery(e.target.value),
												placeholder: "Search companies, locations, categories…",
												className: "h-12 flex-1 border-0 bg-transparent px-3 text-[14px] text-foreground placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
												type: "button",
												initial: {
													opacity: 0,
													scale: .7
												},
												animate: {
													opacity: 1,
													scale: 1
												},
												exit: {
													opacity: 0,
													scale: .7
												},
												transition: { duration: .12 },
												onClick: () => setQuery(""),
												className: "rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
											}) })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-col gap-3 px-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 text-[13px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-slate-500 uppercase tracking-wider text-[10px]",
													children: "Sort by:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setSortBy("name"),
													className: `px-3 py-1 rounded-full transition-colors border ${sortBy === "name" ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800"}`,
													children: "Company Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setSortBy("sector"),
													className: `px-3 py-1 rounded-full transition-colors border ${sortBy === "sector" ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800"}`,
													children: "Industry Sector"
												})
											]
										}), sectors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-1 shrink-0",
													children: "Filter:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setFilterSector(null),
													className: `shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${filterSector === null ? "bg-slate-800 text-slate-200 border-slate-700 shadow-[0_0_12px_rgba(148,163,184,0.15)]" : "bg-transparent text-slate-400 border-slate-800/60 hover:bg-slate-800/50"}`,
													children: "All"
												}),
												sectors.map((s) => {
													const isActive = filterSector === s;
													const accent = getCategoryAccent(s);
													const hue = getCategoryHue(s);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setFilterSector(isActive ? null : s),
														className: `group shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${isActive ? `${accent.badgeBg} ${accent.badgeText} ${accent.badgeBorder}` : "bg-transparent text-slate-400 border-slate-800/60 hover:bg-slate-800/50"}`,
														style: isActive ? { boxShadow: `0 0 12px hsla(${hue}, 80%, 60%, 0.2)` } : void 0,
														children: s
													}, s);
												})
											]
										})]
									})]
								})
							}),
							!isLoading && !isError && companies.length > 0 && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomepageAnalyticsDashboard, { companies }),
							!isLoading && !isError && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-5 text-[11px] font-semibold text-slate-500 tracking-wide",
								children: [
									filtered.length,
									" ",
									filtered.length === 1 ? "company" : "companies"
								]
							}),
							isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
								children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative overflow-hidden flex flex-col rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-950/70 p-6 min-h-[248px] justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-11 animate-pulse rounded-xl bg-slate-800/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-14 animate-pulse rounded-lg bg-slate-800/60" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 mt-4 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 animate-pulse rounded bg-slate-800/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 animate-pulse rounded bg-slate-800/40" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 mt-4 w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 animate-pulse rounded-xl bg-slate-800/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 animate-pulse rounded-xl bg-slate-800/40" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 pt-3 border-t border-slate-800/30 flex items-center justify-between w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 animate-pulse rounded bg-slate-800/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-12 animate-pulse rounded bg-slate-800/30" })]
										})
									]
								}, i))
							}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-slate-800/50 bg-slate-900/40 p-16 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mx-auto mb-4 h-9 w-9 text-slate-700" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-slate-400",
										children: "Failed to load companies."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "mt-5 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600",
										onClick: () => refetch(),
										children: "Try again"
									})
								]
							}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-slate-800/50 bg-slate-900/40 p-16 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mx-auto mb-4 h-9 w-9 text-slate-700" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-slate-500",
										children: "No companies match your search."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "mt-5 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600",
										onClick: () => setQuery(""),
										children: "Clear search"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "company-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
								children: filtered.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyCard, {
									company: c,
									onSelect: handleSelect,
									index: i
								}, c.company_id))
							})
						]
					})]
				}, "content")
			})
		]
	});
}
//#endregion
export { IndexPage as component };
