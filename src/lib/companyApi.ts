import { useQuery } from "@tanstack/react-query";
import { supabase, hasSupabase } from "./supabaseClient";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  type CompanySummary,
  type CompanyProfile,
  type DashboardSkill,
} from "./companyData";
import { SEED_COMPANIES } from "../data/seedCompanies";
import { SKILL_TOPICS } from "../data/skillTopics";

function seedSummaries(): CompanySummary[] {
  return SEED_COMPANIES.map((row) =>
    normalizeCompanySummary(row.short_json as Record<string, unknown>, row.company_id),
  );
}

function seedProfile(id: number): CompanyProfile | null {
  const row = SEED_COMPANIES.find((c) => c.company_id === id);
  if (!row) return null;
  return normalizeCompanyProfile(
    row.full_json as Record<string, unknown>,
    row.short_json as Record<string, unknown>,
    row.company_id,
  );
}

function seedSkills(id: number): CompanySkillsResult {
  const row = SEED_COMPANIES.find((c) => c.company_id === id);
  if (!row) return { skills: [], roadmaps: {} };
  const normalized = normalizeDashboardSkills(
    (row.skill_levels || []) as Array<Record<string, unknown>>,
  );
  const roadmaps: Record<number, string[]> = {};
  normalized.forEach((s) => {
    roadmaps[s.skill_set_id] = SKILL_TOPICS[s.skill_set_id] || [];
  });
  return { skills: normalized, roadmaps };
}

/**
 * Fetch all company summaries from company_json.
 * Falls back to bundled seed data when Supabase isn't configured or errors.
 */
export function useCompanies() {
  return useQuery<CompanySummary[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      if (!hasSupabase) return seedSummaries();
      try {
        const { data, error } = await supabase
          .from("company_json")
          .select("company_id, short_json")
          .limit(1000);
        if (error) throw error;
        if (!data || data.length === 0) return seedSummaries();
        return data.map((row) =>
          normalizeCompanySummary(
            row.short_json as Record<string, unknown>,
            row.company_id,
          ),
        );
      } catch (err) {
        console.warn("[useCompanies] Falling back to seed data:", err);
        return seedSummaries();
      }
    },
  });
}

/**
 * Fetch a single company's full profile from company_json
 */
export function useCompanyProfile(id: number) {
  return useQuery<CompanyProfile | null>({
    queryKey: ["companyProfile", id],
    queryFn: async () => {
      if (!id) return null;
      if (!hasSupabase) return seedProfile(id);
      try {
        const { data, error } = await supabase
          .from("company_json")
          .select("company_id, short_json, full_json")
          .eq("company_id", id)
          .single();
        if (error) throw error;
        if (!data) return seedProfile(id);
        return normalizeCompanyProfile(
          data.full_json as Record<string, unknown>,
          data.short_json as Record<string, unknown>,
          data.company_id,
        );
      } catch (err) {
        console.warn(`[useCompanyProfile] Falling back to seed for id=${id}:`, err);
        return seedProfile(id);
      }
    },
    enabled: !!id,
  });
}

export interface CompanySkillsResult {
  skills: DashboardSkill[];
  roadmaps: Record<number, string[]>;
}

/**
 * Fetch skill requirements for a company and build skill cards + 10-level roadmaps.
 * Queries the 4 skill tables independently then joins in-memory.
 */
export function useCompanySkills(id: number) {
  return useQuery<CompanySkillsResult>({
    queryKey: ["companySkills", id],
    queryFn: async (): Promise<CompanySkillsResult> => {
      if (!id) return { skills: [], roadmaps: {} };
      if (!hasSupabase) return seedSkills(id);

      try {
        // Step 1 — Fetch the company's skill levels (which skills + what level required)
        const { data: levels, error: levelsErr } = await supabase
          .from("company_skill_levels")
          .select("company_id, skill_set_id, required_level, required_proficiency_level_id")
          .eq("company_id", id);

        if (levelsErr) {
          console.error("[useCompanySkills] company_skill_levels error:", levelsErr);
          throw levelsErr;
        }

        if (!levels || levels.length === 0) {
          console.warn(`[useCompanySkills] No skill levels found for company_id=${id}`);
          return seedSkills(id);
        }

        // Collect the skill_set_ids this company actually uses
        const skillSetIds = [...new Set(levels.map((r) => Number(r.skill_set_id)))];

        // Collect the proficiency_level_ids this company uses
        const profIds = [
          ...new Set(
            levels
              .map((r) => r.required_proficiency_level_id)
              .filter((v) => v != null)
              .map(Number),
          ),
        ];

        // Step 2 — Parallel fetch of the 3 reference tables, scoped to what we need
        const [masterRes, profRes, topicsRes] = await Promise.all([
          supabase
            .from("skill_set_master")
            .select("skill_set_id, skill_set_name, short_name")
            .in("skill_set_id", skillSetIds),

          profIds.length > 0
            ? supabase
                .from("proficiency_levels")
                .select("proficiency_level_id, proficiency_name, proficiency_code")
                .in("proficiency_level_id", profIds)
            : Promise.resolve({ data: [], error: null }),

          supabase
            .from("skill_set_topics")
            .select("skill_set_id, level_number, topics")
            .in("skill_set_id", skillSetIds)
            .order("skill_set_id", { ascending: true })
            .order("level_number", { ascending: true })
            .limit(2000),
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

        // Step 3 — Build roadmaps: { skill_set_id -> ["topic L1", "topic L2", ...] }
        const roadmaps: Record<number, string[]> = {};
        topics.forEach((row) => {
          const skillId = Number(row.skill_set_id);
          if (!roadmaps[skillId]) roadmaps[skillId] = [];
          roadmaps[skillId].push(String(row.topics || ""));
        });

        // Step 4 — Join levels + masters + profs into the shape normalizeDashboardSkills expects
        const joinedData = levels.map((row) => {
          const master = masters.find(
            (m) => Number(m.skill_set_id) === Number(row.skill_set_id),
          );
          const prof = profs.find(
            (p) =>
              Number(p.proficiency_level_id) ===
              Number(row.required_proficiency_level_id),
          );

          return {
            skill_set_id: Number(row.skill_set_id),
            skill_set_name: master ? String(master.skill_set_name) : `Skill ${row.skill_set_id}`,
            required_level: Number(row.required_level),
            required_proficiency: prof ? String(prof.proficiency_name) : "",
          };
        });

        const normalized = normalizeDashboardSkills(joinedData);

        return { skills: normalized, roadmaps };
      } catch (err) {
        console.warn(`[useCompanySkills] Falling back to seed for id=${id}:`, err);
        return seedSkills(id);
      }
    },
    enabled: !!id,
  });
}
