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
    category: asString(s.category) || undefined,
    incorporation_year: s.incorporation_year as number | string | undefined,
    employee_size: asString(s.employee_size) || undefined,
    headquarters_address: asString(s.headquarters_address) || undefined,
    yoy_growth_rate: asString(s.yoy_growth_rate) || undefined,
    website_url: asString(s.website_url) || undefined,
    office_locations: asString(s.office_locations) || undefined,
    operating_countries: asString(s.operating_countries) || undefined,
  };
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
