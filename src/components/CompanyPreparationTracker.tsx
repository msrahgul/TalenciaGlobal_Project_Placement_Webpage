import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, LogIn, Target } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// ── Types ──────────────────────────────────────────────────────────────────
type Stage = "Not Started" | "Researching" | "Skill Building" | "Interview Prep" | "Ready";

interface StageConfig {
  label: Stage;
  emoji: string;
  desc: string;
  color: string;
  glow: string;
  bg: string;
}

export const STAGES: StageConfig[] = [
  {
    label: "Not Started",
    emoji: "🔍",
    desc: "Haven't begun exploring this company yet",
    color: "#64748b",
    glow: "rgba(100,116,139,0.35)",
    bg: "rgba(100,116,139,0.08)",
  },
  {
    label: "Researching",
    emoji: "📖",
    desc: "Studying culture, tech stack & role requirements",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
    bg: "rgba(56,189,248,0.08)",
  },
  {
    label: "Skill Building",
    emoji: "⚙️",
    desc: "Actively upskilling for this company's requirements",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    bg: "rgba(167,139,250,0.08)",
  },
  {
    label: "Interview Prep",
    emoji: "🎯",
    desc: "Doing mock interviews & company-specific prep",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    bg: "rgba(251,146,60,0.08)",
  },
  {
    label: "Ready",
    emoji: "🚀",
    desc: "Fully prepared — ready to apply!",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.35)",
    bg: "rgba(74,222,128,0.08)",
  },
];

export const STAGE_INDEX: Record<Stage, number> = {
  "Not Started": 0,
  Researching: 1,
  "Skill Building": 2,
  "Interview Prep": 3,
  Ready: 4,
};

// ── Component ──────────────────────────────────────────────────────────────
export function CompanyPreparationTracker({ companyId }: { companyId: number }) {
  const { user } = useAuth();
  const [currentStage, setCurrentStage] = useState<Stage>("Not Started");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── Fetch current stage ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchStage() {
      try {
        const { data, error } = await supabase
          .from("student_company_tracking")
          .select("preparation_stage")
          .eq("student_id", user!.id)
          .eq("company_id", companyId)
          .maybeSingle();

        if (error) throw error;
        if (data?.preparation_stage) {
          setCurrentStage(data.preparation_stage as Stage);
        }
      } catch (err) {
        console.error("[CompanyPreparationTracker] fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStage();
  }, [user, companyId]);

  // ── Update stage ─────────────────────────────────────────────────────────
  async function handleStageClick(stage: Stage) {
    if (!user || isUpdating) return;
    if (stage === currentStage) return;

    setIsUpdating(true);
    const optimisticPrev = currentStage;
    setCurrentStage(stage);

    try {
      const { error } = await supabase
        .from("student_company_tracking")
        .upsert(
          {
            student_id: user.id,
            company_id: companyId,
            preparation_stage: stage,
            last_updated: new Date().toISOString(),
          },
          { onConflict: "student_id,company_id" },
        );

      if (error) throw error;
      toast.success("Stage updated!", {
        description: `You are now in: ${stage}`,
      });
    } catch (err) {
      console.error("[CompanyPreparationTracker] upsert error:", err);
      setCurrentStage(optimisticPrev);
      toast.error("Update failed", {
        description: "Could not save your preparation stage. Try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // ── Unauthenticated state ─────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-400">Your Preparation Stage</h3>
        </div>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <LogIn className="w-8 h-8 text-slate-600" />
          <p className="text-sm text-slate-500">Sign in to track your preparation for this company</p>
        </div>
      </div>
    );
  }

  const currentIdx = STAGE_INDEX[currentStage];
  const currentConfig = STAGES[currentIdx];
  const progressPct = (currentIdx / (STAGES.length - 1)) * 100;

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Target className="w-5 h-5 text-[var(--theme-text,#a78bfa)]" />
          <h3 className="text-sm font-semibold text-slate-200">Your Preparation Stage</h3>
        </div>
        {isUpdating && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving…
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-2 w-full rounded-full bg-slate-800 animate-pulse" />
          <div className="flex justify-between gap-2">
            {STAGES.map((_, i) => (
              <div key={i} className="flex-1 h-14 rounded-xl bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="relative h-1.5 w-full rounded-full bg-slate-800 mb-5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: `linear-gradient(90deg, #38bdf8, ${currentConfig.color})`,
                boxShadow: `0 0 12px ${currentConfig.glow}`,
              }}
            />
          </div>

          {/* Stage Steps */}
          <div className="flex gap-2">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <motion.button
                  key={stage.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStageClick(stage.label)}
                  disabled={isUpdating}
                  className={`flex-1 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                    isCurrent
                      ? "shadow-lg"
                      : isCompleted
                        ? "border-slate-700/60 bg-slate-900/30 hover:border-slate-600"
                        : "border-slate-800/40 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/20"
                  }`}
                  style={
                    isCurrent
                      ? {
                          borderColor: `${stage.color}50`,
                          background: stage.bg,
                          boxShadow: `0 0 20px ${stage.glow}`,
                        }
                      : {}
                  }
                  title={stage.desc}
                >
                  {/* Icon */}
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: stage.color }}
                          />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.span
                          key="emoji"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-lg leading-none"
                        >
                          {stage.emoji}
                        </motion.span>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-700" />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className="text-[10px] font-semibold leading-tight"
                    style={{
                      color: isCurrent
                        ? stage.color
                        : isCompleted
                          ? "#94a3b8"
                          : "#475569",
                    }}
                  >
                    {stage.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Current stage description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="mt-3.5 text-center text-xs text-slate-500"
            >
              {currentConfig.emoji} {currentConfig.desc}
            </motion.p>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
