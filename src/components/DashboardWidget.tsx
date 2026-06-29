import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useAuth } from "@/context/AuthContext";
import { useCompanies } from "@/lib/companyApi";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSector } from "@/lib/companyData";
import { useCompany } from "@/context/CompanyContext";

export function DashboardWidget() {
  const navigate = useNavigate();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const { data: companies = [], isLoading: isCompaniesLoading } = useCompanies();
  const { selectCompany } = useCompany();
  
  const [matchingCompanies, setMatchingCompanies] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function matchCompanies() {
      if (!profile || companies.length === 0) return;
      setIsMatching(true);

      try {
        const { data: levels, error } = await supabase
          .from("company_skill_levels")
          .select("company_id, skill_set_id")
          .limit(2000);

        if (error) throw error;

        const { data: masters, error: mError } = await supabase
          .from("skill_set_master")
          .select("skill_set_id, short_name");

        if (mError) throw mError;

        const companySkillsMap = new Map<number, Set<string>>();
        
        levels?.forEach(level => {
          const m = masters?.find(m => m.skill_set_id === level.skill_set_id);
          if (m) {
            if (!companySkillsMap.has(level.company_id)) {
              companySkillsMap.set(level.company_id, new Set());
            }
            companySkillsMap.get(level.company_id)?.add(m.short_name);
          }
        });

        const targetSectors = profile.target_sectors || [];

        const matched = companies.map(company => {
          const required = companySkillsMap.get(company.company_id);
          
          let overlap = 0;
          if (required && required.size > 0) {
            profile.skills.forEach(skill => {
              if (required.has(skill)) overlap++;
            });
          }
          
          let matchScore = required && required.size > 0 ? Math.round((overlap / required.size) * 100) : 0;
          
          const normalizedCompanySector = normalizeSector(company.category);
          let sectorMatch = false;
          if (targetSectors.includes(normalizedCompanySector)) {
            sectorMatch = true;
            matchScore = Math.min(100, matchScore + 30);
          } else if (targetSectors.length > 0 && matchScore === 0) {
             matchScore = -1;
          }

          return {
            ...company,
            matchScore,
            sectorMatch,
            normalizedSector: normalizedCompanySector
          };
        }).filter(c => c.matchScore > 0 || c.sectorMatch)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 12);

        setMatchingCompanies(matched);

      } catch (err) {
        console.error("Failed to match companies:", err);
      } finally {
        setIsMatching(false);
      }
    }

    matchCompanies();
  }, [profile, companies]);

  if (isAuthLoading || !user || !profile) {
    return null;
  }

  const displayedCompanies = showAll ? matchingCompanies : matchingCompanies.slice(0, 3);
  
  const handleSelect = (c: any) => {
    selectCompany({ companyId: c.company_id, companyName: c.name, logoUrl: c.logo_url });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome back, {profile.name}</h1>
        {profile.target_sectors && profile.target_sectors.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mt-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-2">Target Industries:</span>
            {profile.target_sectors.map(sector => (
              <span key={sector} className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                {sector}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Suggested for You
          </h2>
          {matchingCompanies.length > 3 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showAll ? "Show Less" : `Show More (${matchingCompanies.length - 3})`}
            </button>
          )}
        </div>

        {(isCompaniesLoading || isMatching) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : matchingCompanies.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-900/20 border border-slate-800/40">
            <p className="text-slate-400">No companies matched your skills or sectors yet. Try updating your preferences!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedCompanies.map((company, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={company.company_id}
                className={`group rounded-2xl border ${company.sectorMatch ? 'border-purple-500/30 bg-purple-500/5' : 'border-slate-800 bg-slate-900/40'} p-5 hover:bg-slate-800/60 hover:border-blue-500/40 transition-all cursor-pointer`}
                onClick={() => handleSelect(company)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                    <CompanyLogo logoUrl={company.logo_url} name={company.name} size={36} />
                  </div>
                  {company.sectorMatch ? (
                    <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase tracking-wider font-bold rounded-full">
                      Industry Match
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] uppercase tracking-wider font-bold rounded-full">
                      Skill Match
                    </div>
                  )}
                </div>
                
                <h3 className="font-heading font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{company.office_locations?.split(',')[0] || "Global"}</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between group-hover:border-slate-700 transition-colors">
                  <span className="text-xs font-medium text-slate-400">{company.normalizedSector}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
