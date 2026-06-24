import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  type CompanySummary,
  type CompanyProfile,
  type DashboardSkill,
} from "./companyData";

/**
 * Fetch all company summaries from company_json
 */
export function useCompanies() {
  return useQuery<CompanySummary[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_json")
        .select("company_id, short_json")
        .limit(1000);

      if (error) {
        console.error("[useCompanies] Supabase error:", error);
        throw error;
      }
      if (!data) return [];

      return data.map((row) =>
        normalizeCompanySummary(
          row.short_json as Record<string, unknown>,
          row.company_id,
        ),
      );
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

      const { data, error } = await supabase
        .from("company_json")
        .select("company_id, short_json, full_json")
        .eq("company_id", id)
        .single();

      if (error) {
        console.error(`[useCompanyProfile] Supabase error for id=${id}:`, error);
        throw error;
      }
      if (!data) return null;

      return normalizeCompanyProfile(
        data.full_json as Record<string, unknown>,
        data.short_json as Record<string, unknown>,
        data.company_id,
      );
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
        return { skills: [], roadmaps: {} };
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
    },
    enabled: !!id,
  });
}
