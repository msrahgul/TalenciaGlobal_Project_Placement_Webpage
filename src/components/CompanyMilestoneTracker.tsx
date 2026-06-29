import { useEffect, useState } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const MILESTONES = [
  "Profile Formed",
  "Skill Validation",
  "Mock Tests Cleared",
  "Interview Ready",
  "Placed",
];

export function CompanyMilestoneTracker({ companyId }: { companyId: number }) {
  const { user } = useAuth();
  const [currentMilestone, setCurrentMilestone] = useState("Profile Formed");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchMilestone() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("user_company_milestones")
          .select("current_milestone")
          .eq("user_id", user.id)
          .eq("company_id", companyId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setCurrentMilestone(data.current_milestone);
        } else {
          // If no row exists, they are implicitly on "Profile Formed"
          setCurrentMilestone("Profile Formed");
        }
      } catch (err) {
        console.error("Failed to fetch company milestone:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMilestone();
  }, [user, companyId]);

  const updateMilestone = async (milestone: string, targetIdx: number) => {
    const currentIdx = MILESTONES.indexOf(currentMilestone);
    if (isUpdating || targetIdx < currentIdx) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_company_milestones')
        .upsert({
          user_id: user?.id,
          company_id: companyId,
          current_milestone: milestone,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,company_id' });
        
      if (error) throw error;
      
      setCurrentMilestone(milestone);
    } catch (err) {
      console.error("Failed to update company milestone:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user || isLoading) return null;

  const currentMilestoneIndex = MILESTONES.indexOf(currentMilestone);

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm mt-8">
      <h2 className="text-lg font-semibold text-white mb-8 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-500" />
        Your Placement Journey Here
      </h2>
      
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
        
        <div className="relative z-10 flex justify-between">
          {MILESTONES.map((milestone, idx) => {
            const isCompleted = idx <= currentMilestoneIndex;
            const isCurrent = idx === currentMilestoneIndex;
            const isNext = idx === currentMilestoneIndex + 1;
            
            return (
              <button 
                key={milestone} 
                className="flex flex-col items-center gap-3 group outline-none"
                onClick={() => updateMilestone(milestone, idx)}
                disabled={idx < currentMilestoneIndex || isUpdating}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : isNext
                    ? 'bg-slate-900/80 text-blue-400/70 border-2 border-blue-500/50 group-hover:border-blue-400 group-hover:text-blue-300 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-2 border-slate-800'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-xs font-medium text-center max-w-[80px] transition-colors ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : isNext ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600'
                }`}>
                  {milestone}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
