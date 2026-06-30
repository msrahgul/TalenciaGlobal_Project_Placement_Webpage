import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as splitItems, i as isNullish, t as asString, u as useCompanyProfile } from "./companyApi-BITDVXfd.mjs";
import { B as Cpu, F as Gift, I as Eye, L as ExternalLink, M as Handshake, N as GraduationCap, T as Mail, X as Banknote, Z as Award, b as Package, d as Star, et as Activity, f as Siren, it as Earth, j as HeartHandshake, k as Linkedin, m as ShieldCheck, nt as Sparkles, o as TrendingUp, ot as ChartColumn, q as Building2, r as Users, u as Swords, w as MapPin, x as Newspaper } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { n as readStoredCompany, r as useCompany } from "./CompanyContext-BG10XvC_.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.intelligence-CeZQV4bN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buildIntelligenceSections = (_profile) => [
	{
		id: "identity",
		title: "Company Identity",
		icon: Building2,
		fields: [
			{
				key: "name",
				label: "Legal Name"
			},
			{
				key: "short_name",
				label: "Short Name"
			},
			{
				key: "category",
				label: "Category"
			},
			{
				key: "incorporation_year",
				label: "Founded"
			},
			{
				key: "nature_of_company",
				label: "Nature"
			}
		]
	},
	{
		id: "overview",
		title: "Overview & Vision",
		icon: Eye,
		fields: [
			{
				key: "overview_text",
				label: "Overview",
				type: "paragraph"
			},
			{
				key: "vision_statement",
				label: "Vision",
				type: "paragraph"
			},
			{
				key: "mission_statement",
				label: "Mission",
				type: "paragraph"
			},
			{
				key: "core_values",
				label: "Core Values",
				type: "list"
			},
			{
				key: "history_timeline",
				label: "History",
				type: "list"
			}
		]
	},
	{
		id: "leadership",
		title: "Leadership",
		icon: Users,
		fields: [
			{
				key: "ceo_name",
				label: "CEO"
			},
			{
				key: "ceo_linkedin_url",
				label: "CEO LinkedIn",
				type: "url"
			},
			{
				key: "key_leaders",
				label: "Key Leaders",
				type: "list"
			},
			{
				key: "board_members",
				label: "Board",
				type: "list"
			},
			{
				key: "warm_intro_pathways",
				label: "Intro Pathways",
				type: "list"
			},
			{
				key: "decision_maker_access",
				label: "Decision Maker Access"
			}
		]
	},
	{
		id: "financials",
		title: "Funding & Financials",
		icon: Banknote,
		fields: [
			{
				key: "annual_revenue",
				label: "Annual Revenue"
			},
			{
				key: "annual_profit",
				label: "Annual Profit"
			},
			{
				key: "revenue_mix",
				label: "Revenue Mix"
			},
			{
				key: "valuation",
				label: "Valuation"
			},
			{
				key: "yoy_growth_rate",
				label: "YoY Growth"
			},
			{
				key: "profitability_status",
				label: "Profitability"
			},
			{
				key: "key_investors",
				label: "Investors",
				type: "list"
			},
			{
				key: "recent_funding_rounds",
				label: "Recent Funding"
			},
			{
				key: "total_capital_raised",
				label: "Capital Raised"
			}
		]
	},
	{
		id: "global",
		title: "Global Presence",
		icon: Earth,
		fields: [
			{
				key: "headquarters_address",
				label: "HQ"
			},
			{
				key: "operating_countries",
				label: "Countries",
				type: "list"
			},
			{
				key: "office_count",
				label: "Offices"
			},
			{
				key: "office_locations",
				label: "Office Locations",
				type: "list"
			},
			{
				key: "employee_size",
				label: "Employees"
			}
		]
	},
	{
		id: "products",
		title: "Products & Services",
		icon: Package,
		fields: [
			{
				key: "offerings_description",
				label: "Offerings",
				type: "list"
			},
			{
				key: "pain_points_addressed",
				label: "Pain Points",
				type: "list"
			},
			{
				key: "focus_sectors",
				label: "Focus Sectors",
				type: "list"
			},
			{
				key: "product_pipeline",
				label: "Pipeline",
				type: "list"
			},
			{
				key: "innovation_roadmap",
				label: "Innovation Roadmap",
				type: "list"
			}
		]
	},
	{
		id: "tech",
		title: "Technology Stack",
		icon: Cpu,
		fields: [
			{
				key: "tech_stack",
				label: "Stack",
				type: "list"
			},
			{
				key: "ai_ml_adoption_level",
				label: "AI / ML"
			},
			{
				key: "intellectual_property",
				label: "IP"
			},
			{
				key: "r_and_d_investment",
				label: "R&D Spend"
			},
			{
				key: "cybersecurity_posture",
				label: "Cybersecurity"
			},
			{
				key: "tech_adoption_rating",
				label: "Tech Adoption"
			}
		]
	},
	{
		id: "partnerships",
		title: "Partnerships & Ecosystem",
		icon: Handshake,
		fields: [
			{
				key: "technology_partners",
				label: "Tech Partners",
				type: "list"
			},
			{
				key: "partnership_ecosystem",
				label: "Ecosystem",
				type: "list"
			},
			{
				key: "industry_associations",
				label: "Associations",
				type: "list"
			}
		]
	},
	{
		id: "competitive",
		title: "Competitive Landscape",
		icon: Swords,
		fields: [
			{
				key: "key_competitors",
				label: "Competitors",
				type: "list"
			},
			{
				key: "market_share_percentage",
				label: "Market Share"
			},
			{
				key: "competitive_advantages",
				label: "Advantages",
				type: "list"
			},
			{
				key: "weaknesses_gaps",
				label: "Weaknesses",
				type: "list"
			},
			{
				key: "benchmark_vs_peers",
				label: "Benchmark vs Peers"
			}
		]
	},
	{
		id: "market",
		title: "Market Opportunity",
		icon: TrendingUp,
		fields: [
			{
				key: "tam",
				label: "TAM"
			},
			{
				key: "sam",
				label: "SAM"
			},
			{
				key: "som",
				label: "SOM"
			},
			{
				key: "future_projections",
				label: "Projections"
			},
			{
				key: "strategic_priorities",
				label: "Priorities",
				type: "list"
			},
			{
				key: "go_to_market_strategy",
				label: "GTM Strategy"
			}
		]
	},
	{
		id: "value",
		title: "Core Value Proposition & ESG",
		icon: Sparkles,
		fields: [
			{
				key: "core_value_proposition",
				label: "Value Prop",
				type: "list"
			},
			{
				key: "unique_differentiators",
				label: "Differentiators",
				type: "list"
			},
			{
				key: "esg_ratings",
				label: "ESG"
			},
			{
				key: "carbon_footprint",
				label: "Carbon Footprint"
			},
			{
				key: "ethical_sourcing",
				label: "Ethical Sourcing"
			},
			{
				key: "sustainability_csr",
				label: "Sustainability / CSR"
			}
		]
	},
	{
		id: "culture",
		title: "Culture & Work Life",
		icon: HeartHandshake,
		fields: [
			{
				key: "work_culture_summary",
				label: "Culture Summary"
			},
			{
				key: "manager_quality",
				label: "Manager Quality"
			},
			{
				key: "psychological_safety",
				label: "Psych Safety"
			},
			{
				key: "feedback_culture",
				label: "Feedback Culture"
			},
			{
				key: "diversity_inclusion_score",
				label: "Diversity & Inclusion"
			},
			{
				key: "ethical_standards",
				label: "Ethical Standards"
			},
			{
				key: "burnout_risk",
				label: "Burnout Risk"
			},
			{
				key: "layoff_history",
				label: "Layoff History"
			},
			{
				key: "mission_clarity",
				label: "Mission Clarity"
			},
			{
				key: "crisis_behavior",
				label: "Crisis Behavior"
			}
		]
	},
	{
		id: "news",
		title: "Recent News & Milestones",
		icon: Newspaper,
		fields: [
			{
				key: "recent_news",
				label: "Recent News",
				type: "list"
			},
			{
				key: "case_studies",
				label: "Case Studies",
				type: "list"
			},
			{
				key: "event_participation",
				label: "Events",
				type: "list"
			}
		]
	},
	{
		id: "sales",
		title: "Sales & Customer Metrics",
		icon: ChartColumn,
		fields: [
			{
				key: "top_customers",
				label: "Top Customers",
				type: "list"
			},
			{
				key: "customer_testimonials",
				label: "Testimonials",
				type: "list"
			},
			{
				key: "sales_motion",
				label: "Sales Motion"
			},
			{
				key: "customer_concentration_risk",
				label: "Concentration Risk"
			},
			{
				key: "exit_strategy_history",
				label: "Exit Strategy"
			}
		]
	},
	{
		id: "risk",
		title: "Risk & Compliance",
		icon: ShieldCheck,
		fields: [
			{
				key: "regulatory_status",
				label: "Regulatory",
				type: "list"
			},
			{
				key: "legal_issues",
				label: "Legal"
			},
			{
				key: "supply_chain_dependencies",
				label: "Supply Chain",
				type: "list"
			},
			{
				key: "geopolitical_risks",
				label: "Geopolitical",
				type: "list"
			},
			{
				key: "macro_risks",
				label: "Macro Risks",
				type: "list"
			}
		]
	},
	{
		id: "commute",
		title: "Work Location & Commute",
		icon: MapPin,
		fields: [
			{
				key: "remote_policy_details",
				label: "Remote Policy"
			},
			{
				key: "typical_hours",
				label: "Typical Hours"
			},
			{
				key: "overtime_expectations",
				label: "Overtime"
			},
			{
				key: "weekend_work",
				label: "Weekend Work"
			},
			{
				key: "flexibility_level",
				label: "Flexibility"
			},
			{
				key: "location_centrality",
				label: "Location"
			},
			{
				key: "public_transport_access",
				label: "Public Transport"
			},
			{
				key: "cab_policy",
				label: "Cab Policy"
			},
			{
				key: "airport_commute_time",
				label: "Airport Commute"
			},
			{
				key: "office_zone_type",
				label: "Zone Type"
			}
		]
	},
	{
		id: "safety",
		title: "Safety & Wellbeing",
		icon: Siren,
		fields: [
			{
				key: "area_safety",
				label: "Area Safety"
			},
			{
				key: "safety_policies",
				label: "Safety Policies"
			},
			{
				key: "infrastructure_safety",
				label: "Infrastructure"
			},
			{
				key: "emergency_preparedness",
				label: "Emergency"
			},
			{
				key: "health_support",
				label: "Health Support"
			}
		]
	},
	{
		id: "career",
		title: "Career Growth & Learning",
		icon: GraduationCap,
		fields: [
			{
				key: "training_spend",
				label: "Training Spend"
			},
			{
				key: "onboarding_quality",
				label: "Onboarding"
			},
			{
				key: "learning_culture",
				label: "Learning Culture"
			},
			{
				key: "mentorship_availability",
				label: "Mentorship"
			},
			{
				key: "internal_mobility",
				label: "Internal Mobility"
			},
			{
				key: "promotion_clarity",
				label: "Promotions"
			},
			{
				key: "tools_access",
				label: "Tools Access"
			},
			{
				key: "role_clarity",
				label: "Role Clarity"
			},
			{
				key: "early_ownership",
				label: "Early Ownership"
			},
			{
				key: "work_impact",
				label: "Impact"
			},
			{
				key: "cross_functional_exposure",
				label: "Cross-functional"
			},
			{
				key: "exit_opportunities",
				label: "Exit Opportunities"
			},
			{
				key: "skill_relevance",
				label: "Skill Relevance"
			},
			{
				key: "global_exposure",
				label: "Global Exposure"
			}
		]
	},
	{
		id: "brand",
		title: "Brand & Reputation",
		icon: Award,
		fields: [
			{
				key: "awards_recognitions",
				label: "Awards",
				type: "list"
			},
			{
				key: "brand_sentiment_score",
				label: "Sentiment"
			},
			{
				key: "brand_value",
				label: "Brand Value"
			},
			{
				key: "client_quality",
				label: "Client Quality"
			},
			{
				key: "external_recognition",
				label: "Recognition"
			},
			{
				key: "network_strength",
				label: "Network"
			}
		]
	},
	{
		id: "comp",
		title: "Compensation & Benefits",
		icon: Gift,
		fields: [
			{
				key: "leave_policy",
				label: "Leave Policy"
			},
			{
				key: "family_health_insurance",
				label: "Family Health"
			},
			{
				key: "relocation_support",
				label: "Relocation"
			},
			{
				key: "lifestyle_benefits",
				label: "Lifestyle",
				type: "list"
			},
			{
				key: "hiring_velocity",
				label: "Hiring Velocity",
				type: "list"
			},
			{
				key: "employee_turnover",
				label: "Turnover"
			},
			{
				key: "avg_retention_tenure",
				label: "Avg Tenure"
			},
			{
				key: "diversity_metrics",
				label: "Diversity"
			}
		]
	},
	{
		id: "digital",
		title: "Digital Presence & Ratings",
		icon: Star,
		fields: [
			{
				key: "website_url",
				label: "Website",
				type: "url"
			},
			{
				key: "linkedin_url",
				label: "LinkedIn",
				type: "url"
			},
			{
				key: "twitter_handle",
				label: "Twitter"
			},
			{
				key: "facebook_url",
				label: "Facebook",
				type: "url"
			},
			{
				key: "instagram_url",
				label: "Instagram",
				type: "url"
			},
			{
				key: "marketing_video_url",
				label: "Marketing Video",
				type: "video"
			},
			{
				key: "website_quality",
				label: "Site Quality"
			},
			{
				key: "website_traffic_rank",
				label: "Traffic Rank"
			},
			{
				key: "social_media_followers",
				label: "Social Followers"
			},
			{
				key: "glassdoor_rating",
				label: "Glassdoor",
				type: "rating"
			},
			{
				key: "indeed_rating",
				label: "Indeed",
				type: "rating"
			},
			{
				key: "google_rating",
				label: "Google",
				type: "rating"
			}
		]
	},
	{
		id: "contact",
		title: "Contact Information",
		icon: Mail,
		fields: [
			{
				key: "primary_contact_email",
				label: "Email"
			},
			{
				key: "primary_phone_number",
				label: "Phone"
			},
			{
				key: "contact_person_name",
				label: "Contact Person"
			},
			{
				key: "contact_person_title",
				label: "Title"
			},
			{
				key: "contact_person_email",
				label: "Person Email"
			},
			{
				key: "contact_person_phone",
				label: "Person Phone"
			}
		]
	}
];
function NotAvailable() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs font-medium text-slate-600/50 italic",
		children: "Not provided"
	});
}
function renderValue(value, type) {
	if (isNullish(value)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotAvailable, {});
	const s = asString(value);
	if (type === "url" || /^https?:\/\//i.test(s)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: s,
		target: "_blank",
		rel: "noreferrer",
		className: "inline-flex items-center gap-1.5 font-semibold text-[var(--theme-text)] hover:text-[var(--theme-text-hover)] transition-colors group/link",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate max-w-[200px] sm:max-w-[300px]",
			children: s.replace(/^https?:\/\/(www\.)?/, "")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 shrink-0" })]
	});
	if (type === "video") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: s,
		target: "_blank",
		rel: "noreferrer",
		className: "inline-flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-400 transition-all hover:bg-violet-500/20 hover:border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.05)] hover:scale-[1.02]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Watch Video Clip" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" })]
	});
	if (type === "rating") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.08)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" }),
			s,
			" / 5.0"
		]
	});
	if (type === "list" || type !== "paragraph" && /[;\n•]/.test(s)) {
		const items = splitItems(s);
		if (items.length > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5 mt-0.5",
			children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center rounded-lg bg-slate-950/60 border border-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-700/60 hover:text-white transition-all cursor-default",
				children: it
			}, i))
		});
	}
	if (type === "paragraph") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "leading-relaxed text-slate-300 text-sm mt-0.5 whitespace-pre-line",
		children: s
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-semibold text-slate-200 text-sm",
		children: s
	});
}
function BentoFieldCell({ label, value, type }) {
	const empty = isNullish(value);
	const s = asString(value);
	let colSpan = "col-span-1";
	if (type === "paragraph" || type === "video" || s.length > 120 || type === "list" && s.split(/[;\n•]/).length > 4) colSpan = "md:col-span-2 lg:col-span-3 col-span-1";
	else if (type === "list" || s.length > 50) colSpan = "md:col-span-2 col-span-1";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group/cell relative flex flex-col gap-1.5 rounded-xl border transition-all duration-300 ease-in-out ${empty ? "border-white/[0.03] bg-slate-900/[0.06] opacity-40 hover:opacity-65 hover:border-slate-800/30 hover:bg-slate-900/15 p-3" : "border-white/[0.05] bg-slate-900/[0.12] hover:border-[var(--theme-border)] hover:bg-[var(--theme-bg-faint)] hover:shadow-[0_4px_16px_-4px_var(--theme-shadow)] p-4"} ${colSpan}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover/cell:text-slate-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 text-sm text-slate-200",
			children: [renderValue(value, type), !empty && type === "rating" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 rounded-full bg-slate-950 border border-slate-900/50 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.25)]",
					style: { width: `${(parseFloat(s) || 0) * 20}%` }
				})
			})]
		})]
	});
}
function IntelligenceOverviewDashboard({ profile }) {
	const growthRaw = asString(profile.yoy_growth_rate);
	const hasGrowth = !isNullish(profile.yoy_growth_rate);
	const isNegGrowth = growthRaw.trim().startsWith("-");
	const ratingRaw = asString(profile.glassdoor_rating || profile.google_rating || profile.indeed_rating);
	const ratingLabel = profile.glassdoor_rating ? "Glassdoor Rating" : profile.google_rating ? "Google Rating" : profile.indeed_rating ? "Indeed Rating" : "Reputation";
	const hasRating = !isNullish(profile.glassdoor_rating || profile.google_rating || profile.indeed_rating);
	const ratingVal = parseFloat(ratingRaw) || 0;
	const sizeRaw = asString(profile.employee_size);
	const hasSize = !isNullish(profile.employee_size);
	const techRaw = asString(profile.tech_adoption_rating || profile.ai_ml_adoption_level);
	const techLabel = profile.tech_adoption_rating ? "Tech Rating" : "AI/ML Adoption";
	const hasTech = !isNullish(profile.tech_adoption_rating || profile.ai_ml_adoption_level);
	const techVal = parseFloat(techRaw) || (techRaw.toLowerCase().includes("high") ? 8 : techRaw.toLowerCase().includes("medium") ? 5 : 3);
	const radialRadius = 16;
	const radialCircumference = 2 * Math.PI * radialRadius;
	const radialOffset = radialCircumference - Math.min(1, Math.max(0, ratingVal / 5)) * radialCircumference;
	if (!hasGrowth && !hasRating && !hasSize && !hasTech) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
		children: [
			hasGrowth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/[0.05] bg-slate-900/15 p-4 flex flex-col justify-between h-28 hover:border-slate-800/80 hover:bg-slate-950/50 hover:shadow-[0_4px_20px_-4px_var(--theme-shadow)] transition-all duration-300 ease-in-out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase tracking-widest",
						children: "YoY Growth"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-slate-400" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xl font-bold font-heading tabular-nums leading-none ${isNegGrowth ? "text-red-400" : "text-[var(--theme-text)]"}`,
							children: growthRaw
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-500 font-semibold mt-1",
							children: "Growth Indicator"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: `w-16 h-8 shrink-0 ${isNegGrowth ? "text-red-500/80" : "text-[var(--theme-icon)]"}`,
						viewBox: "0 0 50 20",
						style: { opacity: isNegGrowth ? 1 : .8 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: isNegGrowth ? "M0 2 L 12 8 L 25 7 L 37 14 L 50 18" : "M0 18 L 12 12 L 25 14 L 37 5 L 50 2",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})]
			}),
			hasRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/[0.05] bg-slate-900/15 p-4 flex flex-col justify-between h-28 hover:border-slate-800/80 hover:bg-slate-950/50 hover:shadow-[0_4px_20px_-4px_var(--theme-shadow)] transition-all duration-300 ease-in-out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase tracking-widest",
						children: ratingLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-[var(--theme-icon)]" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-bold font-heading text-slate-100 leading-none",
							children: [
								ratingVal.toFixed(1),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-500 font-normal",
									children: "/ 5.0"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-500 font-semibold mt-1",
							children: "Employer Brand"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-center h-10 w-10 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "w-10 h-10 transform -rotate-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "20",
								cy: "20",
								r: radialRadius,
								className: "text-slate-900",
								strokeWidth: "2.5",
								stroke: "currentColor",
								fill: "transparent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "20",
								cy: "20",
								r: radialRadius,
								className: "text-[var(--theme-text)]",
								style: { opacity: .8 },
								strokeWidth: "2.5",
								strokeDasharray: radialCircumference,
								strokeDashoffset: radialOffset,
								strokeLinecap: "round",
								stroke: "currentColor",
								fill: "transparent"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "absolute h-3.5 w-3.5 fill-transparent text-[var(--theme-icon)]",
							style: { fill: "var(--theme-icon)" }
						})]
					})]
				})]
			}),
			hasSize && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/[0.05] bg-slate-900/15 p-4 flex flex-col justify-between h-28 hover:border-slate-800/80 hover:bg-slate-950/50 hover:shadow-[0_4px_20px_-4px_var(--theme-shadow)] transition-all duration-300 ease-in-out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase tracking-widest",
						children: "Workforce Scale"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-[var(--theme-icon)]" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold font-heading text-slate-100 truncate leading-none",
						children: sizeRaw
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-full bg-slate-950 border border-slate-900/50 overflow-hidden relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full",
							style: {
								background: "linear-gradient(90deg, var(--theme-gradient-from), var(--theme-text))",
								width: sizeRaw.toLowerCase().includes("10k") || sizeRaw.toLowerCase().includes("50k") || sizeRaw.toLowerCase().includes("100k") || parseFloat(sizeRaw) > 1e4 ? "85%" : "45%"
							}
						})
					})]
				})]
			}),
			hasTech && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/[0.05] bg-slate-900/15 p-4 flex flex-col justify-between h-28 hover:border-slate-800/80 hover:bg-slate-950/50 hover:shadow-[0_4px_20px_-4px_var(--theme-shadow)] transition-all duration-300 ease-in-out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase tracking-widest",
						children: techLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-[var(--theme-icon)]" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-bold font-heading text-slate-100 leading-none",
							children: [
								techVal.toFixed(1),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-500 font-normal",
									children: "/ 10.0"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-500 font-semibold mt-1",
							children: "Innovation Index"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-0.5 shrink-0 pb-1",
						children: Array.from({ length: 5 }).map((_, i) => {
							const filled = techVal >= (i + 1) * 2;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `h-4 w-1.5 rounded-sm ${filled ? "shadow-[0_0_8px_var(--theme-shadow)]" : "bg-slate-900"}`,
								style: filled ? {
									backgroundColor: "var(--theme-text)",
									opacity: .8
								} : void 0
							}, i);
						})
					})]
				})]
			})
		]
	});
}
function CompanyIntelligencePage() {
	const { selected } = useCompany();
	const { data: profile, isLoading, isError, refetch } = useCompanyProfile((selected ?? readStoredCompany())?.companyId ?? 1);
	const sections = (0, import_react.useMemo)(() => buildIntelligenceSections(profile ?? void 0), [profile]);
	const [activeIdx, setActiveIdx] = (0, import_react.useState)(0);
	const isScrollingRef = (0, import_react.useRef)(false);
	const tabsRef = (0, import_react.useRef)(null);
	const sidebarRef = (0, import_react.useRef)(null);
	const sectionRefs = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					if (isScrollingRef.current) {
						ticking = false;
						return;
					}
					const offset = window.innerWidth >= 1024 ? 120 : 160;
					let current = 0;
					sectionRefs.current.forEach((el, i) => {
						if (el && el.getBoundingClientRect().top - offset <= 0) current = i;
					});
					setActiveIdx(current);
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [profile]);
	(0, import_react.useEffect)(() => {
		(tabsRef.current?.querySelector(`[data-tab-idx="${activeIdx}"]`))?.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest"
		});
		const sidebar = sidebarRef.current;
		if (sidebar) sidebar.querySelector(`[data-tab-idx="${activeIdx}"]`)?.scrollIntoView({
			behavior: "smooth",
			block: "nearest"
		});
	}, [activeIdx]);
	const scrollToSection = (i) => {
		const el = sectionRefs.current[i];
		if (!el) return;
		isScrollingRef.current = true;
		setActiveIdx(i);
		const headerHeight = window.innerWidth >= 1024 ? 90 : 135;
		const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
		window.scrollTo({
			top: y,
			behavior: "smooth"
		});
		window.setTimeout(() => {
			isScrollingRef.current = false;
		}, 600);
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900 mb-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:flex lg:flex-col gap-2 w-72 shrink-0",
				children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded-xl bg-slate-900/30 border border-slate-900" }, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 space-y-6",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-64 animate-pulse rounded-2xl bg-slate-900/40 border border-slate-900 p-6 space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-800/30 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-9 rounded-xl bg-slate-800/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-40 bg-slate-800/50 rounded-lg" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-12 bg-slate-800/30 rounded-full animate-pulse" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 bg-slate-900/20 border border-slate-850 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 bg-slate-900/20 border border-slate-850 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 bg-slate-900/20 border border-slate-850 rounded-xl col-span-1 md:col-span-2" })
						]
					})]
				}, i))
			})]
		})]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-red-400",
			children: "Failed to load company intelligence details."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800",
			onClick: () => refetch(),
			children: "Try again"
		})]
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground",
		children: "Company profile not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-4 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:sticky lg:top-[80px] z-20 flex flex-wrap items-center justify-between gap-4 bg-slate-950/95 border border-slate-900/60 rounded-2xl px-5 py-3 shadow-md backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase tracking-widest text-slate-500",
						children: "Sector:"
					}), !isNullish(profile.category) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text)]",
						children: asString(profile.category)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotAvailable, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [!isNullish(profile.website_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "rounded-full border-slate-800/80 bg-slate-900/40 text-xs text-slate-350 hover:bg-[var(--theme-bg)] hover:border-[var(--theme-border)] hover:text-[var(--theme-text)] hover:scale-[1.03] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: asString(profile.website_url),
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 h-3.5 w-3.5" }), " Website"]
						})
					}), !isNullish(profile.linkedin_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "rounded-full border-slate-800/80 bg-slate-900/40 text-xs text-slate-350 hover:bg-[var(--theme-bg)] hover:border-[var(--theme-border)] hover:text-[var(--theme-text)] hover:scale-[1.03] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: asString(profile.linkedin_url),
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "mr-1.5 h-3.5 w-3.5" }), " LinkedIn"]
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: tabsRef,
				className: "sticky top-[72px] z-20 flex gap-1 overflow-x-auto rounded-2xl border border-slate-850/80 bg-slate-950/95 p-1 shadow-md backdrop-blur-sm lg:hidden",
				style: { scrollbarWidth: "none" },
				children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"data-tab-idx": i,
					onClick: () => scrollToSection(i),
					className: "relative inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none cursor-pointer",
					style: {
						color: activeIdx === i ? "var(--theme-text)" : "#94a3b8",
						zIndex: 1
					},
					children: [
						activeIdx === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							layoutId: "tab-indicator",
							className: "absolute inset-0 rounded-xl border border-[var(--theme-border)]",
							style: {
								background: "linear-gradient(135deg, var(--theme-gradient-from) 0%, var(--theme-gradient-to) 100%)",
								boxShadow: "0 4px 12px -2px var(--theme-shadow)"
							},
							transition: {
								type: "spring",
								bounce: .2,
								duration: .4
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "relative h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative",
							children: s.title
						})
					]
				}, s.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row gap-6 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: sidebarRef,
				className: "hidden lg:flex lg:flex-col gap-1 w-72 sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 border-r border-slate-900/60 no-scrollbar select-none shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500",
					children: "Intelligence Categories"
				}), sections.map((s, i) => {
					const populated = s.fields.filter((f) => !isNullish(profile[f.key])).length;
					const isActive = activeIdx === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						"data-tab-idx": i,
						onClick: () => scrollToSection(i),
						className: `group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${isActive ? "bg-slate-900/40 border border-[var(--theme-border)] text-[var(--theme-text)] shadow-[0_4px_12px_-2px_var(--theme-shadow)]" : "border border-transparent text-slate-400 hover:bg-slate-900/10 hover:text-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-[var(--theme-icon)] animate-pulse" : "text-slate-500 group-hover:text-slate-300"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: s.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full border transition-colors shrink-0 ${isActive ? "bg-[var(--theme-bg)] border-[var(--theme-border)] text-[var(--theme-text)]" : "bg-slate-950/60 border-slate-900/80 text-slate-500 group-hover:text-slate-400"}`,
							children: [
								populated,
								"/",
								s.fields.length
							]
						})]
					}, s.id);
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 w-full space-y-6 pb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelligenceOverviewDashboard, { profile }), sections.map((section, i) => {
					const populated = section.fields.filter((f) => !isNullish(profile[f.key])).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: (el) => {
							sectionRefs.current[i] = el;
						},
						className: "scroll-mt-[88px] lg:scroll-mt-[88px] rounded-2xl border border-white/[0.04] bg-slate-900/[0.07] backdrop-blur-[2px] p-6 transition-all duration-300 ease-in-out hover:bg-[var(--theme-bg-faint)] hover:border-[var(--theme-border)] hover:shadow-[0_0_30px_var(--theme-shadow)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-center justify-between gap-3 border-b border-slate-900 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--theme-border)] shadow-[0_0_15px_var(--theme-shadow)] shrink-0",
									style: { background: "linear-gradient(135deg, var(--theme-gradient-from) 0%, var(--theme-gradient-to) 100%)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(section.icon, {
										className: "h-4.5 w-4.5 text-[var(--theme-icon)]",
										style: {
											width: 18,
											height: 18
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-heading text-lg font-bold text-slate-100 tracking-tight",
									children: section.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-slate-950/80 border border-slate-900 px-3 py-0.5 text-xs font-semibold tabular-nums text-slate-400",
								children: [
									populated,
									"/",
									section.fields.length,
									" Completeness"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
							children: section.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoFieldCell, {
								label: f.label,
								value: profile[f.key],
								type: f.type
							}, f.key))
						})]
					}, section.id);
				})]
			})]
		})]
	});
}
//#endregion
export { CompanyIntelligencePage as component };
