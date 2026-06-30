import { n as supabase, t as hasSupabase } from "./supabaseClient-BlbV5jcN.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/companyApi-BITDVXfd.js
var asString = (v) => {
	if (v === null || v === void 0) return "";
	if (typeof v === "string") return v;
	if (typeof v === "number" || typeof v === "boolean") return String(v);
	try {
		return JSON.stringify(v);
	} catch {
		return "";
	}
};
var asRecord = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
var isNullish = (v) => {
	if (v === null || v === void 0) return true;
	const s = asString(v).trim().toLowerCase();
	return [
		"",
		"na",
		"n/a",
		"none",
		"-",
		"null",
		"undefined"
	].includes(s);
};
var splitItems = (v) => {
	const s = asString(v);
	if (!s) return [];
	return s.split(/\n|;|•|·/g).map((p) => p.trim()).filter(Boolean);
};
var scoreToDifficulty = (score) => {
	if (score >= 8) return "EXPERT";
	if (score >= 6) return "ADVANCED";
	if (score >= 4) return "PRO";
	return "BEGINNER";
};
var normalizeSector = (category) => {
	const cat = (category ?? "").toLowerCase().trim();
	if (!cat) return "Technology & Services";
	if (cat.includes("artificial") || cat.includes("ai") || cat.includes("data") || cat.includes("machine learning")) return "AI & Data";
	if (cat.includes("aerospace") || cat.includes("aviation") || cat.includes("space")) return "Aerospace & Defense";
	if (cat.includes("auto") || cat.includes("vehicle") || cat.includes("mobility") || cat.includes("motor")) return "Automotive";
	if (cat.includes("manufactur") || cat.includes("industrial") || cat.includes("hardware")) return "Manufacturing";
	if (cat.includes("finance") || cat.includes("banking") || cat.includes("fintech") || cat.includes("investment")) return "Finance & Banking";
	if (cat.includes("consult") || cat.includes("advisory")) return "Consulting";
	if (cat.includes("health") || cat.includes("pharma") || cat.includes("medic") || cat.includes("bio")) return "Healthcare & Pharma";
	if (cat.includes("educat") || cat.includes("edtech") || cat.includes("learn")) return "Education";
	if (cat.includes("e-comm") || cat.includes("ecomm") || cat.includes("retail") || cat.includes("logistic")) return "E-Commerce & Retail";
	if (cat.includes("secur") || cat.includes("cyber")) return "Cybersecurity";
	if (cat.includes("media") || cat.includes("entertain") || cat.includes("game") || cat.includes("gaming") || cat.includes("animation")) return "Media & Entertainment";
	if (cat.includes("energy") || cat.includes("environ") || cat.includes("sustain") || cat.includes("power")) return "Energy & Environment";
	if (cat.includes("telecom") || cat.includes("network") || cat.includes("communication")) return "Telecommunications";
	if (cat.includes("real estate") || cat.includes("construct") || cat.includes("prop") || cat.includes("infrastructure")) return "Real Estate";
	if (cat.includes("software") || cat.includes("it ") || cat.includes("tech") || cat.includes("cloud") || cat.includes("saas")) return "IT & Software";
	return "Technology & Services";
};
var normalizeCompanySummary = (short_json, company_id) => {
	const s = asRecord(short_json);
	return {
		company_id,
		name: asString(s.name) || "Unknown Company",
		short_name: asString(s.short_name) || asString(s.name),
		logo_url: asString(s.logo_url) || void 0,
		category: normalizeSector(asString(s.category)),
		incorporation_year: s.incorporation_year,
		employee_size: asString(s.employee_size) || void 0,
		headquarters_address: asString(s.headquarters_address) || void 0,
		yoy_growth_rate: asString(s.yoy_growth_rate) || void 0,
		website_url: asString(s.website_url) || void 0,
		office_locations: asString(s.office_locations) || void 0,
		operating_countries: asString(s.operating_countries) || void 0
	};
};
var getCategoryColorName = (category) => {
	return {
		"AI & Data": "fuchsia",
		"Aerospace & Defense": "sky",
		"Automotive": "red",
		"Manufacturing": "cyan",
		"Finance & Banking": "emerald",
		"Consulting": "amber",
		"Healthcare & Pharma": "rose",
		"Education": "orange",
		"E-Commerce & Retail": "violet",
		"Cybersecurity": "yellow",
		"Media & Entertainment": "pink",
		"Energy & Environment": "lime",
		"Telecommunications": "indigo",
		"Real Estate": "teal",
		"IT & Software": "blue",
		"Technology & Services": "blue"
	}[normalizeSector(category)] || "blue";
};
var getCategoryHue = (category) => {
	return {
		fuchsia: 290,
		sky: 200,
		red: 0,
		cyan: 190,
		emerald: 160,
		amber: 35,
		rose: 350,
		orange: 25,
		violet: 260,
		yellow: 45,
		pink: 320,
		lime: 85,
		indigo: 230,
		teal: 175,
		blue: 220
	}[getCategoryColorName(category)] || 220;
};
var getCategoryAccent = (category) => {
	const color = getCategoryColorName(category);
	const accents = {
		fuchsia: {
			stripe: "from-transparent via-fuchsia-500/55 to-transparent",
			hoverBorder: "hover:border-fuchsia-500/30",
			badgeBg: "bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
			badgeBorder: "border-fuchsia-500/20 group-hover:border-fuchsia-400/30",
			badgeText: "text-fuchsia-400 group-hover:text-fuchsia-300"
		},
		sky: {
			stripe: "from-transparent via-sky-500/55 to-transparent",
			hoverBorder: "hover:border-sky-500/30",
			badgeBg: "bg-sky-500/10 group-hover:bg-sky-500/20",
			badgeBorder: "border-sky-500/20 group-hover:border-sky-400/30",
			badgeText: "text-sky-400 group-hover:text-sky-300"
		},
		red: {
			stripe: "from-transparent via-red-500/55 to-transparent",
			hoverBorder: "hover:border-red-500/30",
			badgeBg: "bg-red-500/10 group-hover:bg-red-500/20",
			badgeBorder: "border-red-500/20 group-hover:border-red-400/30",
			badgeText: "text-red-400 group-hover:text-red-300"
		},
		cyan: {
			stripe: "from-transparent via-cyan-500/55 to-transparent",
			hoverBorder: "hover:border-cyan-500/30",
			badgeBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
			badgeBorder: "border-cyan-500/20 group-hover:border-cyan-400/30",
			badgeText: "text-cyan-400 group-hover:text-cyan-300"
		},
		emerald: {
			stripe: "from-transparent via-emerald-500/55 to-transparent",
			hoverBorder: "hover:border-emerald-500/30",
			badgeBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
			badgeBorder: "border-emerald-500/20 group-hover:border-emerald-400/30",
			badgeText: "text-emerald-400 group-hover:text-emerald-300"
		},
		amber: {
			stripe: "from-transparent via-amber-500/55 to-transparent",
			hoverBorder: "hover:border-amber-500/30",
			badgeBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
			badgeBorder: "border-amber-500/20 group-hover:border-amber-400/30",
			badgeText: "text-amber-400 group-hover:text-amber-300"
		},
		rose: {
			stripe: "from-transparent via-rose-500/55 to-transparent",
			hoverBorder: "hover:border-rose-500/30",
			badgeBg: "bg-rose-500/10 group-hover:bg-rose-500/20",
			badgeBorder: "border-rose-500/20 group-hover:border-rose-400/30",
			badgeText: "text-rose-400 group-hover:text-rose-300"
		},
		orange: {
			stripe: "from-transparent via-orange-500/55 to-transparent",
			hoverBorder: "hover:border-orange-500/30",
			badgeBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
			badgeBorder: "border-orange-500/20 group-hover:border-orange-400/30",
			badgeText: "text-orange-400 group-hover:text-orange-300"
		},
		violet: {
			stripe: "from-transparent via-violet-500/55 to-transparent",
			hoverBorder: "hover:border-violet-500/30",
			badgeBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
			badgeBorder: "border-violet-500/20 group-hover:border-violet-400/30",
			badgeText: "text-violet-400 group-hover:text-violet-300"
		},
		yellow: {
			stripe: "from-transparent via-yellow-500/55 to-transparent",
			hoverBorder: "hover:border-yellow-500/30",
			badgeBg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
			badgeBorder: "border-yellow-500/20 group-hover:border-yellow-400/30",
			badgeText: "text-yellow-400 group-hover:text-yellow-300"
		},
		pink: {
			stripe: "from-transparent via-pink-500/55 to-transparent",
			hoverBorder: "hover:border-pink-500/30",
			badgeBg: "bg-pink-500/10 group-hover:bg-pink-500/20",
			badgeBorder: "border-pink-500/20 group-hover:border-pink-400/30",
			badgeText: "text-pink-400 group-hover:text-pink-300"
		},
		lime: {
			stripe: "from-transparent via-lime-500/55 to-transparent",
			hoverBorder: "hover:border-lime-500/30",
			badgeBg: "bg-lime-500/10 group-hover:bg-lime-500/20",
			badgeBorder: "border-lime-500/20 group-hover:border-lime-400/30",
			badgeText: "text-lime-400 group-hover:text-lime-300"
		},
		indigo: {
			stripe: "from-transparent via-indigo-500/55 to-transparent",
			hoverBorder: "hover:border-indigo-500/30",
			badgeBg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
			badgeBorder: "border-indigo-500/20 group-hover:border-indigo-400/30",
			badgeText: "text-indigo-400 group-hover:text-indigo-300"
		},
		teal: {
			stripe: "from-transparent via-teal-500/55 to-transparent",
			hoverBorder: "hover:border-teal-500/30",
			badgeBg: "bg-teal-500/10 group-hover:bg-teal-500/20",
			badgeBorder: "border-teal-500/20 group-hover:border-teal-400/30",
			badgeText: "text-teal-400 group-hover:text-teal-300"
		},
		blue: {
			stripe: "from-transparent via-blue-500/55 to-transparent",
			hoverBorder: "hover:border-blue-500/30",
			badgeBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
			badgeBorder: "border-blue-500/20 group-hover:border-blue-400/30",
			badgeText: "text-blue-400 group-hover:text-blue-300"
		}
	};
	return accents[color] || accents["blue"];
};
var normalizeCompanyProfile = (full_json, short_json, company_id) => {
	const f = asRecord(full_json);
	const s = asRecord(short_json);
	return {
		...f,
		company_id,
		name: asString(f.name || s.name) || "Unknown Company",
		short_name: asString(f.short_name || s.short_name),
		logo_url: asString(s.logo_url || f.logo_url) || void 0,
		category: normalizeSector(asString(f.category || s.category))
	};
};
var normalizeDashboardSkills = (skillLevels) => (skillLevels ?? []).map((row) => {
	const required_level = Number(row.required_level ?? 0);
	return {
		skill_set_id: Number(row.skill_set_id),
		skill_set_name: asString(row.skill_set_name),
		required_level,
		required_proficiency: asString(row.required_proficiency),
		difficulty: scoreToDifficulty(required_level)
	};
});
var proficiencyToBloom = (level) => {
	if (level <= 2) return {
		code: "CU",
		label: "Understand",
		color: "#3b82f6"
	};
	if (level <= 4) return {
		code: "AP",
		label: "Apply",
		color: "#22c55e"
	};
	if (level <= 6) return {
		code: "AS",
		label: "Analyze",
		color: "#eab308"
	};
	if (level <= 8) return {
		code: "EV",
		label: "Evaluate",
		color: "#ef4444"
	};
	return {
		code: "CR",
		label: "Create",
		color: "#a855f7"
	};
};
var scoreToCriticality = (score) => {
	if (score >= 7) return {
		label: "Critical",
		color: "#ef4444"
	};
	if (score >= 5) return {
		label: "Important",
		color: "#d97706"
	};
	return {
		label: "Baseline",
		color: "#16a34a"
	};
};
var SEED_COMPANIES = [{
	company_id: 1,
	short_json: {
		name: "Accenture plc",
		short_name: "Accenture",
		logo_url: "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg",
		category: "Enterprise",
		company_type: "Dream",
		incorporation_year: 1989,
		employee_size: "740,000 employees",
		headquarters_address: "Dublin, Ireland",
		operating_countries: "United States; United Kingdom; India; Germany; France; Japan; Australia; Canada; Brazil; Singapore",
		office_locations: "New York, United States; London, United Kingdom; Bangalore, India; Paris, France; Tokyo, Japan; Toronto, Canada; Sydney, Australia; Frankfurt, Germany",
		yoy_growth_rate: "3%",
		website_url: "https://www.accenture.com"
	},
	full_json: {
		name: "Accenture plc",
		short_name: "Accenture",
		category: "Enterprise",
		incorporation_year: 1989,
		nature_of_company: "Public",
		overview_text: "Accenture is a global professional services company providing strategy, consulting, digital, technology, and operations services, serving large enterprises and governments across more than 120 countries with a strong focus on cloud, AI, and digital transformation.",
		headquarters_address: "Dublin, Ireland",
		operating_countries: "United States; United Kingdom; India; Germany; France; Japan; Australia; Canada; Brazil; Singapore",
		office_count: "200+",
		office_locations: "New York, United States; London, United Kingdom; Bangalore, India; Paris, France; Tokyo, Japan; Toronto, Canada; Sydney, Australia; Frankfurt, Germany",
		employee_size: "740,000 employees",
		vision_statement: "To drive continuous innovation and help the world's leading organizations build their digital core and achieve greater value.",
		mission_statement: "Deliver on the promise of technology and human ingenuity to create value and shared success for clients, people, shareholders, partners, and communities.",
		core_values: "Client value creation; Integrity; Respect for individuals; Innovation; Stewardship; Best people",
		history_timeline: "One of the largest employers of tech talent globally; Invests over $1B annually in R&D and innovation",
		recent_news: "2024, Invested $3B in generative AI strategy; 2024, Acquired multiple cloud and AI consulting firms in Europe",
		website_url: "https://www.accenture.com",
		linkedin_url: "https://www.linkedin.com/company/accenture",
		twitter_handle: "@Accenture",
		facebook_url: "https://www.facebook.com/accenture",
		instagram_url: "https://www.instagram.com/accenture",
		primary_contact_email: "contact@accenture.com",
		primary_phone_number: "NA",
		regulatory_status: "ISO 27001; SOC 2; GDPR Compliance; HIPAA Compliance",
		legal_issues: "Periodic labor and contract disputes; no major unresolved global litigation",
		esg_ratings: "Net-zero commitment by 2025; Science Based Targets; Diversity equity programs",
		supply_chain_dependencies: "Cloud providers; Software vendors; Talent workforce",
		geopolitical_risks: "Trade regulations; Data privacy laws; Regional conflicts",
		macro_risks: "Global recession; Enterprise IT budget cuts",
		carbon_footprint: "Actively reducing via renewable energy sourcing",
		ethical_sourcing: "Supplier code of conduct; ESG audits",
		marketing_video_url: "https://www.youtube.com/@Accenture",
		customer_testimonials: "Unilever transformation story; Microsoft cloud case",
		website_quality: "Enterprise-grade, high clarity, strong thought leadership, polished UX",
		website_rating: "NA",
		website_traffic_rank: "Global 12,000; US 4,000",
		social_media_followers: "15000000",
		glassdoor_rating: "4.1/5",
		indeed_rating: "4.2/5",
		google_rating: "4.3/5",
		awards_recognitions: "Fortune Global 500; Great Place to Work Certified; Gartner Magic Quadrant Leader; Forbes Most Admired Companies",
		brand_sentiment_score: "Very Positive, strong global brand, high enterprise trust",
		event_participation: "World Economic Forum; Microsoft Ignite; AWS re:Invent; Global Fintech Fest",
		pain_points_addressed: "Digital transformation complexity; Legacy IT modernization; Cloud migration risk; Talent and skill gaps; Cybersecurity threats; Operational inefficiency",
		focus_sectors: "Financials; Health Care; Consumer Discretionary; Industrials; Energy; Telecommunications; Public Sector; Technology",
		offerings_description: "Management Consulting; Technology Services; Cloud Solutions; AI & Analytics; Cybersecurity; Business Process Outsourcing; Digital Engineering",
		top_customers: "Fortune 500 Enterprises; Global Banks; Government Agencies; Healthcare Systems; Telecom Operators; Energy Majors",
		core_value_proposition: "End-to-end transformation; Global delivery scale; Deep industry expertise; Strong technology partnerships; Innovation leadership",
		unique_differentiators: "Global delivery network; Industry-specific consulting; Strong alliance ecosystem; Proprietary AI and analytics platforms",
		competitive_advantages: "Brand leadership; Scale and geographic reach; Deep enterprise relationships; Strong partner network",
		weaknesses_gaps: "High cost structure; Dependency on large enterprise spending cycles; Complex organizational structure",
		key_challenges_needs: "Talent retention; Pricing pressure from competitors; Rapid AI disruption; Regulatory compliance across regions",
		key_competitors: "IBM Consulting; Deloitte; TCS; Infosys; Capgemini; Cognizant; Wipro; PwC; EY",
		market_share_percentage: "6–7% of global IT services market",
		sales_motion: "Enterprise Field Sales",
		customer_concentration_risk: "No, highly diversified client base",
		exit_strategy_history: "Mature public enterprise; Strategic acquisitions",
		benchmark_vs_peers: "Higher revenue than Capgemini; Comparable margins to IBM Consulting; Stronger cloud alliances than TCS",
		future_projections: "Revenue projected $70B by 2027",
		strategic_priorities: "Generative AI leadership; Cloud transformation; Sustainability consulting; Emerging markets growth",
		industry_associations: "World Economic Forum; NASSCOM; Business Roundtable",
		case_studies: "Microsoft cloud modernization; Unilever digital supply chain",
		go_to_market_strategy: "Enterprise account teams; Strategic alliances; Thought leadership marketing",
		innovation_roadmap: "GenAI platforms; Industry cloud solutions; Cyber resilience tools",
		product_pipeline: "AI copilots; Industry SaaS accelerators",
		tam: "$1.5T global IT and business services",
		sam: "$400B enterprise digital transformation",
		som: "7%",
		leave_policy: "Paid leave; Mental health days",
		health_support: "Health insurance; Mental wellness",
		family_health_insurance: "Dependents covered; OPD",
		relocation_support: "Housing; Travel reimbursement",
		lifestyle_benefits: "Wellness programs; Meals; Fitness",
		hiring_velocity: "Technology ~15,000 open roles; Consulting ~8,000 open roles; Operations ~6,000 open roles; Sales ~2,000 open roles",
		employee_turnover: "15% annually (industry benchmark estimate)",
		avg_retention_tenure: "4.5 years",
		diversity_metrics: "47% women workforce; Global DEI programs",
		work_culture_summary: "Collaborative; Performance-driven",
		manager_quality: "Strong coaching focus",
		psychological_safety: "High",
		feedback_culture: "Continuous feedback; Annual reviews",
		diversity_inclusion_score: "Gender equity; Inclusive leadership",
		ethical_standards: "High integrity; Compliance-driven",
		burnout_risk: "Moderate",
		layoff_history: "Periodic restructuring",
		mission_clarity: "High",
		sustainability_csr: "Net-zero goals; Community programs",
		crisis_behavior: "Transparent and compliance-driven",
		annual_revenue: "$64.1B (FY2024)",
		annual_profit: "$7.2B net income (FY2024)",
		revenue_mix: "Consulting 55%; Managed Services 45%",
		valuation: "$220B market capitalization",
		yoy_growth_rate: "3%",
		profitability_status: "Profitable",
		key_investors: "Vanguard Group; BlackRock; State Street",
		recent_funding_rounds: "Public equity markets, ongoing institutional investment",
		total_capital_raised: "Public market funded",
		remote_policy_details: "Hybrid, 60% flexible",
		typical_hours: "Flexible",
		overtime_expectations: "Occasional during project peaks",
		weekend_work: "Rare",
		flexibility_level: "Remote; Hybrid",
		location_centrality: "Central business districts",
		public_transport_access: "Metro; Bus; Train",
		cab_policy: "Ride-hailing; Company transport",
		airport_commute_time: "45 minutes",
		office_zone_type: "IT hub",
		area_safety: "Secure; Well-monitored",
		safety_policies: "Late-night transport; Workplace safety",
		infrastructure_safety: "Fire compliant; Secure access",
		emergency_preparedness: "Medical support; Fire drills",
		ceo_name: "Julie Sweet",
		ceo_linkedin_url: "https://www.linkedin.com/in/juliesweet",
		key_leaders: "Julie Sweet, Chair & CEO; Manish Sharma, CEO; Jack Azagury, Group Chief Executive",
		warm_intro_pathways: "Fortune 500 board connections; Alumni network; Technology partner ecosystems",
		decision_maker_access: "Low, Large enterprise structure with formal procurement and partner-led access",
		contact_person_name: "Julie Sweet",
		contact_person_title: "CEO",
		contact_person_email: "prabhakar.d.phatak@accenture.com",
		contact_person_phone: "793 1578",
		board_members: "Julie Sweet; David Rowland; Former global executives",
		training_spend: "$1,500 per employee/year",
		onboarding_quality: "Industry-leading",
		learning_culture: "Internal LMS; Certifications",
		exposure_quality: "High",
		mentorship_availability: "Leadership mentors; Peer mentors",
		internal_mobility: "High",
		promotion_clarity: "Merit-based; Transparent",
		tools_access: "Enterprise software; Cloud platforms",
		role_clarity: "High",
		early_ownership: "Medium",
		work_impact: "Client-facing; Revenue-linked",
		execution_thinking_balance: "Balanced",
		automation_level: "High",
		cross_functional_exposure: "Consulting; Technology; Sales",
		company_maturity: "Mature enterprise",
		brand_value: "Global top-tier brand",
		client_quality: "Fortune 500; Governments",
		exit_opportunities: "Big Tech; Global consultancies; Industry leadership roles",
		skill_relevance: "Very High",
		external_recognition: "Strong global credibility",
		network_strength: "Global alumni network; Executive connections",
		global_exposure: "Global clients; International teams",
		technology_partners: "Microsoft; SAP; Oracle; AWS; Google Cloud; Salesforce; NVIDIA",
		intellectual_property: "Accenture Labs IP; Industry AI frameworks; Proprietary cloud accelerators",
		r_and_d_investment: "$1.5B annually",
		ai_ml_adoption_level: "High, generative AI platforms, AI-led consulting, automation for delivery optimization",
		tech_stack: "SAP; Salesforce; AWS; Microsoft Azure; ServiceNow; Kubernetes; Python",
		cybersecurity_posture: "ISO 27001; SOC 2; Global cyber defense centers",
		partnership_ecosystem: "Microsoft; SAP; Oracle; Google; AWS; Salesforce",
		tech_adoption_rating: "High, Industry Leader; Top-tier among peers"
	},
	skill_levels: [
		{
			skill_set_id: 1,
			skill_set_name: "Data Structures & Algorithms",
			required_level: 8,
			required_proficiency: "Expert"
		},
		{
			skill_set_id: 2,
			skill_set_name: "Object-Oriented Programming",
			required_level: 7,
			required_proficiency: "Advanced"
		},
		{
			skill_set_id: 3,
			skill_set_name: "SQL & Databases",
			required_level: 7,
			required_proficiency: "Advanced"
		},
		{
			skill_set_id: 4,
			skill_set_name: "Cloud Fundamentals (AWS/Azure)",
			required_level: 6,
			required_proficiency: "Proficient"
		},
		{
			skill_set_id: 5,
			skill_set_name: "Operating Systems",
			required_level: 6,
			required_proficiency: "Proficient"
		},
		{
			skill_set_id: 6,
			skill_set_name: "Computer Networks",
			required_level: 5,
			required_proficiency: "Proficient"
		},
		{
			skill_set_id: 7,
			skill_set_name: "Aptitude & Logical Reasoning",
			required_level: 7,
			required_proficiency: "Advanced"
		},
		{
			skill_set_id: 8,
			skill_set_name: "Communication & Behavioral",
			required_level: 7,
			required_proficiency: "Advanced"
		},
		{
			skill_set_id: 9,
			skill_set_name: "Web Development Basics",
			required_level: 5,
			required_proficiency: "Proficient"
		},
		{
			skill_set_id: 10,
			skill_set_name: "System Design (Intro)",
			required_level: 4,
			required_proficiency: "Intermediate"
		},
		{
			skill_set_id: 11,
			skill_set_name: "Git & Version Control",
			required_level: 5,
			required_proficiency: "Proficient"
		},
		{
			skill_set_id: 12,
			skill_set_name: "Generative AI Basics",
			required_level: 4,
			required_proficiency: "Intermediate"
		}
	]
}];
var SKILL_TOPICS = {
	1: [
		"Arrays, strings, basic complexity (Big-O)",
		"Linked lists, stacks, queues",
		"Hash maps, sets, two-pointer patterns",
		"Recursion and sorting fundamentals",
		"Binary search, sliding window",
		"Trees, BSTs, traversals",
		"Graphs: BFS, DFS, shortest paths",
		"Dynamic programming patterns",
		"Greedy, backtracking, advanced graph algos",
		"System-level algorithmic design and trade-offs"
	],
	2: [
		"Classes, objects, encapsulation",
		"Inheritance and polymorphism basics",
		"Interfaces, abstract classes",
		"SOLID principles introduction",
		"Composition over inheritance",
		"Common design patterns (Factory, Strategy)",
		"Behavioral and structural patterns",
		"Concurrency-safe OO design",
		"Refactoring legacy OO code",
		"Domain-driven design and architecture"
	],
	3: [
		"SELECT, WHERE, ORDER BY basics",
		"Joins (INNER, LEFT, RIGHT)",
		"Aggregations and GROUP BY",
		"Subqueries and CTEs",
		"Indexes and query plans",
		"Normalization and schema design",
		"Transactions and isolation levels",
		"Window functions",
		"Query tuning and partitioning",
		"Distributed databases and sharding"
	],
	4: [
		"Cloud concepts, regions, availability zones",
		"Compute basics (EC2 / VM)",
		"Storage services (S3 / Blob)",
		"Networking: VPC, subnets, security groups",
		"Managed databases (RDS / Cosmos)",
		"Serverless (Lambda / Functions)",
		"IAM, roles, least privilege",
		"Containers and Kubernetes basics",
		"CI/CD pipelines on cloud",
		"Multi-cloud, cost and well-architected design"
	],
	5: [
		"Processes, threads, scheduling basics",
		"Memory management fundamentals",
		"File systems and I/O",
		"Synchronization, locks, semaphores",
		"Deadlocks and concurrency issues",
		"Virtual memory, paging",
		"Linux shell and system calls",
		"Performance tuning basics",
		"Kernel concepts overview",
		"Distributed OS and modern containers"
	],
	6: [
		"OSI and TCP/IP models",
		"IP addressing and subnetting",
		"TCP vs UDP, sockets",
		"DNS, HTTP, HTTPS basics",
		"Routing and switching fundamentals",
		"Network security basics (TLS, firewalls)",
		"Load balancers and CDNs",
		"Wi-Fi, mobile networks overview",
		"Network troubleshooting tools",
		"Modern protocols: HTTP/3, QUIC, gRPC"
	],
	7: [
		"Number system, percentages",
		"Ratios, averages, profit/loss",
		"Time, speed, distance",
		"Probability and permutations basics",
		"Data interpretation",
		"Logical sequences and analogies",
		"Syllogisms and statements",
		"Puzzles and seating arrangements",
		"Advanced quant under time pressure",
		"Adaptive aptitude for placement tests"
	],
	8: [
		"Active listening and clarity",
		"Self-introduction and elevator pitch",
		"Email and written professionalism",
		"Group discussion fundamentals",
		"Behavioral STAR storytelling",
		"Handling tough HR questions",
		"Conflict resolution scenarios",
		"Presentation and stage presence",
		"Cross-cultural communication",
		"Executive presence and influencing"
	],
	9: [
		"HTML semantics and accessibility",
		"CSS layout (Flexbox, Grid)",
		"JavaScript fundamentals (ES6+)",
		"DOM manipulation and events",
		"Responsive design and media queries",
		"Fetch API and async/await",
		"Intro to React components",
		"State management basics",
		"Build tools and deployment",
		"Performance, SEO, and PWA basics"
	],
	10: [
		"What is system design? Key terms",
		"Client-server and request lifecycle",
		"Databases SQL vs NoSQL choices",
		"Caching strategies introduction",
		"Load balancing basics",
		"Designing a URL shortener",
		"Rate limiting and queues",
		"CAP theorem and consistency",
		"Designing chat or news feed (intro)",
		"Scalability trade-offs and back-of-envelope"
	],
	11: [
		"What is Git? Init, add, commit",
		"Branches and switching",
		"Remote repos: push, pull, fetch",
		"Merging and resolving conflicts",
		"Rebasing basics",
		"Pull requests and code review",
		"Tags, releases, and stash",
		"Git workflows (Git Flow, trunk-based)",
		"Hooks and submodules",
		"Advanced recovery and bisect"
	],
	12: [
		"What is generative AI? LLM basics",
		"Prompting fundamentals",
		"Tokens, context windows, hallucinations",
		"Using ChatGPT / Copilot effectively",
		"Embeddings and semantic search intro",
		"Retrieval-augmented generation (RAG) basics",
		"Building a simple chatbot",
		"Fine-tuning vs prompting trade-offs",
		"AI safety, bias, and ethics",
		"Designing GenAI-powered features"
	]
};
function seedSummaries() {
	return SEED_COMPANIES.map((row) => normalizeCompanySummary(row.short_json, row.company_id));
}
function seedProfile(id) {
	const row = SEED_COMPANIES.find((c) => c.company_id === id);
	if (!row) return null;
	return normalizeCompanyProfile(row.full_json, row.short_json, row.company_id);
}
function seedSkills(id) {
	const row = SEED_COMPANIES.find((c) => c.company_id === id);
	if (!row) return {
		skills: [],
		roadmaps: {}
	};
	const normalized = normalizeDashboardSkills(row.skill_levels || []);
	const roadmaps = {};
	normalized.forEach((s) => {
		roadmaps[s.skill_set_id] = SKILL_TOPICS[s.skill_set_id] || [];
	});
	return {
		skills: normalized,
		roadmaps
	};
}
/**
* Fetch all company summaries from company_json.
* Falls back to bundled seed data when Supabase isn't configured or errors.
*/
function useCompanies() {
	return useQuery({
		queryKey: ["companies"],
		queryFn: async () => {
			if (!hasSupabase) return seedSummaries();
			try {
				const { data, error } = await supabase.from("company_json").select("company_id, short_json").limit(1e3);
				if (error) throw error;
				if (!data || data.length === 0) return seedSummaries();
				return data.map((row) => normalizeCompanySummary(row.short_json, row.company_id));
			} catch (err) {
				console.warn("[useCompanies] Falling back to seed data:", err);
				return seedSummaries();
			}
		}
	});
}
/**
* Fetch a single company's full profile from company_json
*/
function useCompanyProfile(id) {
	return useQuery({
		queryKey: ["companyProfile", id],
		queryFn: async () => {
			if (!id) return null;
			if (!hasSupabase) return seedProfile(id);
			try {
				const { data, error } = await supabase.from("company_json").select("company_id, short_json, full_json").eq("company_id", id).single();
				if (error) throw error;
				if (!data) return seedProfile(id);
				return normalizeCompanyProfile(data.full_json, data.short_json, data.company_id);
			} catch (err) {
				console.warn(`[useCompanyProfile] Falling back to seed for id=${id}:`, err);
				return seedProfile(id);
			}
		},
		enabled: !!id
	});
}
/**
* Fetch skill requirements for a company and build skill cards + 10-level roadmaps.
* Queries the 4 skill tables independently then joins in-memory.
*/
function useCompanySkills(id) {
	return useQuery({
		queryKey: ["companySkills", id],
		queryFn: async () => {
			if (!id) return {
				skills: [],
				roadmaps: {}
			};
			if (!hasSupabase) return seedSkills(id);
			try {
				const { data: levels, error: levelsErr } = await supabase.from("company_skill_levels").select("company_id, skill_set_id, required_level, required_proficiency_level_id").eq("company_id", id);
				if (levelsErr) {
					console.error("[useCompanySkills] company_skill_levels error:", levelsErr);
					throw levelsErr;
				}
				if (!levels || levels.length === 0) {
					console.warn(`[useCompanySkills] No skill levels found for company_id=${id}`);
					return seedSkills(id);
				}
				const skillSetIds = [...new Set(levels.map((r) => Number(r.skill_set_id)))];
				const profIds = [...new Set(levels.map((r) => r.required_proficiency_level_id).filter((v) => v != null).map(Number))];
				const [masterRes, profRes, topicsRes] = await Promise.all([
					supabase.from("skill_set_master").select("skill_set_id, skill_set_name, short_name").in("skill_set_id", skillSetIds),
					profIds.length > 0 ? supabase.from("proficiency_levels").select("proficiency_level_id, proficiency_name, proficiency_code").in("proficiency_level_id", profIds) : Promise.resolve({
						data: [],
						error: null
					}),
					supabase.from("skill_set_topics").select("skill_set_id, level_number, topics").in("skill_set_id", skillSetIds).order("skill_set_id", { ascending: true }).order("level_number", { ascending: true }).limit(2e3)
				]);
				if (masterRes.error) {
					console.error("[useCompanySkills] skill_set_master error:", masterRes.error);
					throw masterRes.error;
				}
				if (profRes.error) {
					console.error("[useCompanySkills] proficiency_levels error:", profRes.error);
					throw profRes.error;
				}
				if (topicsRes.error) {
					console.error("[useCompanySkills] skill_set_topics error:", topicsRes.error);
					throw topicsRes.error;
				}
				const masters = masterRes.data || [];
				const profs = profRes.data || [];
				const topics = topicsRes.data || [];
				const roadmaps = {};
				topics.forEach((row) => {
					const skillId = Number(row.skill_set_id);
					if (!roadmaps[skillId]) roadmaps[skillId] = [];
					roadmaps[skillId].push(String(row.topics || ""));
				});
				return {
					skills: normalizeDashboardSkills(levels.map((row) => {
						const master = masters.find((m) => Number(m.skill_set_id) === Number(row.skill_set_id));
						const prof = profs.find((p) => Number(p.proficiency_level_id) === Number(row.required_proficiency_level_id));
						return {
							skill_set_id: Number(row.skill_set_id),
							skill_set_name: master ? String(master.skill_set_name) : `Skill ${row.skill_set_id}`,
							required_level: Number(row.required_level),
							required_proficiency: prof ? String(prof.proficiency_name) : ""
						};
					})),
					roadmaps
				};
			} catch (err) {
				console.warn(`[useCompanySkills] Falling back to seed for id=${id}:`, err);
				return seedSkills(id);
			}
		},
		enabled: !!id
	});
}
//#endregion
export { normalizeSector as a, splitItems as c, useCompanySkills as d, isNullish as i, useCompanies as l, getCategoryAccent as n, proficiencyToBloom as o, getCategoryHue as r, scoreToCriticality as s, asString as t, useCompanyProfile as u };
