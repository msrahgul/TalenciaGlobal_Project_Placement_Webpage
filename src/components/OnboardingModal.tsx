import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface SkillMaster {
  skill_set_id: number;
  skill_set_name: string;
  short_name: string;
}

export const INDUSTRY_SECTORS = [
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

export function OnboardingModal() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const [skills, setSkills] = useState<SkillMaster[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skill_set_master")
        .select("*")
        .order("skill_set_name");
      if (!error && data) {
        setSkills(data as SkillMaster[]);
      }
    }
    if (user && !profile && !isLoading) {
      fetchSkills();
    }
  }, [user, profile, isLoading]);

  if (isLoading || !user || profile) {
    return null;
  }

  const toggleSkill = (shortName: string) => {
    setSelectedSkills(prev => 
      prev.includes(shortName) 
        ? prev.filter(s => s !== shortName)
        : [...prev, shortName]
    );
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
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
    
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
    const avatar_url = user.user_metadata?.avatar_url || "";
    
    const { error } = await supabase.from("student_profiles").insert({
      id: user.id,
      name: name,
      email: user.email,
      avatar_url: avatar_url,
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white mb-2 font-heading tracking-tight">
            {step === 1 ? "Target Sectors" : "Technical Skills"}
          </h2>
          <div className="flex gap-2 mb-4">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-800'}`} />
          </div>
          <p className="text-slate-400 text-sm">
            {step === 1 
              ? "Select the industry sectors you are most interested in pursuing." 
              : "Select the technical skills you possess for personalized company matching."}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {step === 1 ? (
              INDUSTRY_SECTORS.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${
                      isSelected 
                        ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                        : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                  >
                    {sector}
                  </button>
                );
              })
            ) : (
              skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.short_name);
                return (
                  <button
                    key={skill.skill_set_id}
                    onClick={() => toggleSkill(skill.short_name)}
                    className={`flex items-center justify-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-center ${
                      isSelected 
                        ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                        : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                  >
                    {skill.short_name}
                  </button>
                );
              })
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between flex-shrink-0 pt-4 border-t border-slate-800/50">
          {step === 2 ? (
            <Button 
              onClick={() => setStep(1)} 
              variant="outline"
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Back
            </Button>
          ) : <div></div>}
          
          {step === 1 ? (
            <Button 
              onClick={() => setStep(2)} 
              disabled={selectedSectors.length === 0}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2 rounded-xl transition-all"
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || selectedSkills.length === 0}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
            >
              {isSubmitting ? "Saving..." : "Save Profile & Continue"}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
