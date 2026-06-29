import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { INDUSTRY_SECTORS } from "./OnboardingModal";
import { X } from "lucide-react";

interface SkillMaster {
  skill_set_id: number;
  skill_set_name: string;
  short_name: string;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [skills, setSkills] = useState<SkillMaster[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
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
    if (isOpen) {
      fetchSkills();
      if (profile) {
        setSelectedSkills(profile.skills || []);
        setSelectedSectors(profile.target_sectors || []);
      }
    }
  }, [isOpen, profile]);

  if (!isOpen || !profile || !user) return null;

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
    
    const { error } = await supabase
      .from("student_profiles")
      .update({
        skills: selectedSkills,
        target_sectors: selectedSectors,
      })
      .eq("id", user.id);

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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading tracking-tight">Manage Preferences</h2>
            <p className="text-slate-400 text-sm mt-1">
              Update your target sectors and technical skills
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              Target Industries
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{selectedSectors.length} selected</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INDUSTRY_SECTORS.map((sector) => {
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
              })}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              Technical Skills
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{selectedSkills.length} selected</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {skills.map((skill) => {
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
              })}
            </div>
          </section>

        </div>
        
        <div className="p-6 flex justify-end flex-shrink-0 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || selectedSkills.length === 0 || selectedSectors.length === 0}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
          >
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

      </div>
    </div>
  );
}
