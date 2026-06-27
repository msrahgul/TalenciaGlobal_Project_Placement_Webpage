// Pure normalizers. In Phase 2 the same functions will accept Supabase JSONB rows.

export interface CompanySummary {
  company_id: number;
  name: string;
  short_name: string;
  logo_url?: string;
  category?: string;
  company_type?: string;
  incorporation_year?: number | string;
  employee_size?: string;
  headquarters_address?: string;
  yoy_growth_rate?: string;
  website_url?: string;
  office_locations?: string;
  operating_countries?: string;
}


export type CompanyProfile = Record<string, unknown> & {
  company_id: number;
  name: string;
  short_name: string;
  logo_url?: string;
};

export interface DashboardSkill {
  skill_set_id: number;
  skill_set_name: string;
  required_level: number;
  required_proficiency: string;
  difficulty: "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
}

export const asString = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
};

export const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};

export const isNullish = (v: unknown): boolean => {
  if (v === null || v === undefined) return true;
  const s = asString(v).trim().toLowerCase();
  return ["", "na", "n/a", "none", "-", "null", "undefined"].includes(s);
};

export const splitItems = (v: unknown): string[] => {
  const s = asString(v);
  if (!s) return [];
  return s
    .split(/\n|;|•|·/g)
    .map((p) => p.trim())
    .filter(Boolean);
};

export const titleCaseFromCode = (s: string): string =>
  s
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

export const scoreToDifficulty = (
  score: number,
): DashboardSkill["difficulty"] => {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
};

export const normalizeSector = (category?: string | null): string => {
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

export const normalizeCompanySummary = (
  short_json: Record<string, unknown>,
  company_id: number,
): CompanySummary => {
  const s = asRecord(short_json);
  return {
    company_id,
    name: asString(s.name) || "Unknown Company",
    short_name: asString(s.short_name) || asString(s.name),
    logo_url: asString(s.logo_url) || undefined,
    category: normalizeSector(asString(s.category)),
    incorporation_year: s.incorporation_year as number | string | undefined,
    employee_size: asString(s.employee_size) || undefined,
    headquarters_address: asString(s.headquarters_address) || undefined,
    yoy_growth_rate: asString(s.yoy_growth_rate) || undefined,
    website_url: asString(s.website_url) || undefined,
    office_locations: asString(s.office_locations) || undefined,
    operating_countries: asString(s.operating_countries) || undefined,
  };
};

export type CardAccent = {
  stripe: string;
  hoverBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
};

const getCategoryColorName = (category?: string | null): string => {
  const normalized = normalizeSector(category);
  
  const map: Record<string, string> = {
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
    "Technology & Services": "blue",
  };
  
  return map[normalized] || "blue";
};

export const getCategoryHue = (category?: string | null): number => {
  const color = getCategoryColorName(category);
  const hues: Record<string, number> = {
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
  };
  return hues[color] || 220;
};

export const getCategoryAccent = (category?: string | null): CardAccent => {
  const color = getCategoryColorName(category);
  
  const accents: Record<string, CardAccent> = {
    fuchsia: {
      stripe: "from-transparent via-fuchsia-500/55 to-transparent",
      hoverBorder: "hover:border-fuchsia-500/30",
      badgeBg: "bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
      badgeBorder: "border-fuchsia-500/20 group-hover:border-fuchsia-400/30",
      badgeText: "text-fuchsia-400 group-hover:text-fuchsia-300",
    },
    sky: {
      stripe: "from-transparent via-sky-500/55 to-transparent",
      hoverBorder: "hover:border-sky-500/30",
      badgeBg: "bg-sky-500/10 group-hover:bg-sky-500/20",
      badgeBorder: "border-sky-500/20 group-hover:border-sky-400/30",
      badgeText: "text-sky-400 group-hover:text-sky-300",
    },
    red: {
      stripe: "from-transparent via-red-500/55 to-transparent",
      hoverBorder: "hover:border-red-500/30",
      badgeBg: "bg-red-500/10 group-hover:bg-red-500/20",
      badgeBorder: "border-red-500/20 group-hover:border-red-400/30",
      badgeText: "text-red-400 group-hover:text-red-300",
    },
    cyan: {
      stripe: "from-transparent via-cyan-500/55 to-transparent",
      hoverBorder: "hover:border-cyan-500/30",
      badgeBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
      badgeBorder: "border-cyan-500/20 group-hover:border-cyan-400/30",
      badgeText: "text-cyan-400 group-hover:text-cyan-300",
    },
    emerald: {
      stripe: "from-transparent via-emerald-500/55 to-transparent",
      hoverBorder: "hover:border-emerald-500/30",
      badgeBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      badgeBorder: "border-emerald-500/20 group-hover:border-emerald-400/30",
      badgeText: "text-emerald-400 group-hover:text-emerald-300",
    },
    amber: {
      stripe: "from-transparent via-amber-500/55 to-transparent",
      hoverBorder: "hover:border-amber-500/30",
      badgeBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
      badgeBorder: "border-amber-500/20 group-hover:border-amber-400/30",
      badgeText: "text-amber-400 group-hover:text-amber-300",
    },
    rose: {
      stripe: "from-transparent via-rose-500/55 to-transparent",
      hoverBorder: "hover:border-rose-500/30",
      badgeBg: "bg-rose-500/10 group-hover:bg-rose-500/20",
      badgeBorder: "border-rose-500/20 group-hover:border-rose-400/30",
      badgeText: "text-rose-400 group-hover:text-rose-300",
    },
    orange: {
      stripe: "from-transparent via-orange-500/55 to-transparent",
      hoverBorder: "hover:border-orange-500/30",
      badgeBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
      badgeBorder: "border-orange-500/20 group-hover:border-orange-400/30",
      badgeText: "text-orange-400 group-hover:text-orange-300",
    },
    violet: {
      stripe: "from-transparent via-violet-500/55 to-transparent",
      hoverBorder: "hover:border-violet-500/30",
      badgeBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
      badgeBorder: "border-violet-500/20 group-hover:border-violet-400/30",
      badgeText: "text-violet-400 group-hover:text-violet-300",
    },
    yellow: {
      stripe: "from-transparent via-yellow-500/55 to-transparent",
      hoverBorder: "hover:border-yellow-500/30",
      badgeBg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
      badgeBorder: "border-yellow-500/20 group-hover:border-yellow-400/30",
      badgeText: "text-yellow-400 group-hover:text-yellow-300",
    },
    pink: {
      stripe: "from-transparent via-pink-500/55 to-transparent",
      hoverBorder: "hover:border-pink-500/30",
      badgeBg: "bg-pink-500/10 group-hover:bg-pink-500/20",
      badgeBorder: "border-pink-500/20 group-hover:border-pink-400/30",
      badgeText: "text-pink-400 group-hover:text-pink-300",
    },
    lime: {
      stripe: "from-transparent via-lime-500/55 to-transparent",
      hoverBorder: "hover:border-lime-500/30",
      badgeBg: "bg-lime-500/10 group-hover:bg-lime-500/20",
      badgeBorder: "border-lime-500/20 group-hover:border-lime-400/30",
      badgeText: "text-lime-400 group-hover:text-lime-300",
    },
    indigo: {
      stripe: "from-transparent via-indigo-500/55 to-transparent",
      hoverBorder: "hover:border-indigo-500/30",
      badgeBg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
      badgeBorder: "border-indigo-500/20 group-hover:border-indigo-400/30",
      badgeText: "text-indigo-400 group-hover:text-indigo-300",
    },
    teal: {
      stripe: "from-transparent via-teal-500/55 to-transparent",
      hoverBorder: "hover:border-teal-500/30",
      badgeBg: "bg-teal-500/10 group-hover:bg-teal-500/20",
      badgeBorder: "border-teal-500/20 group-hover:border-teal-400/30",
      badgeText: "text-teal-400 group-hover:text-teal-300",
    },
    blue: {
      stripe: "from-transparent via-blue-500/55 to-transparent",
      hoverBorder: "hover:border-blue-500/30",
      badgeBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
      badgeBorder: "border-blue-500/20 group-hover:border-blue-400/30",
      badgeText: "text-blue-400 group-hover:text-blue-300",
    }
  };
  
  return accents[color] || accents["blue"];
};

export const normalizeCompanyProfile = (
  full_json: Record<string, unknown>,
  short_json: Record<string, unknown>,
  company_id: number,
): CompanyProfile => {
  const f = asRecord(full_json);
  const s = asRecord(short_json);
  return {
    ...f,
    company_id,
    name: asString(f.name || s.name) || "Unknown Company",
    short_name: asString(f.short_name || s.short_name),
    logo_url: asString(s.logo_url || (f as Record<string, unknown>).logo_url) || undefined,
    category: normalizeSector(asString(f.category || s.category)),
  };
};

export const normalizeDashboardSkills = (
  skillLevels: Array<Record<string, unknown>>,
): DashboardSkill[] =>
  (skillLevels ?? []).map((row) => {
    const required_level = Number(row.required_level ?? 0);
    return {
      skill_set_id: Number(row.skill_set_id),
      skill_set_name: asString(row.skill_set_name),
      required_level,
      required_proficiency: asString(row.required_proficiency),
      difficulty: scoreToDifficulty(required_level),
    };
  });

export const proficiencyToBloom = (
  level: number,
): { code: "CU" | "AP" | "AS" | "EV" | "CR"; label: string; color: string } => {
  if (level <= 2)
    return { code: "CU", label: "Understand", color: "#3b82f6" };
  if (level <= 4)
    return { code: "AP", label: "Apply", color: "#22c55e" };
  if (level <= 6)
    return { code: "AS", label: "Analyze", color: "#eab308" };
  if (level <= 8)
    return { code: "EV", label: "Evaluate", color: "#ef4444" };
  return { code: "CR", label: "Create", color: "#a855f7" };
};

export const scoreToCriticality = (
  score: number,
): { label: "Critical" | "Important" | "Baseline"; color: string } => {
  if (score >= 7) return { label: "Critical", color: "#ef4444" };
  if (score >= 5) return { label: "Important", color: "#d97706" };
  return { label: "Baseline", color: "#16a34a" };
};
