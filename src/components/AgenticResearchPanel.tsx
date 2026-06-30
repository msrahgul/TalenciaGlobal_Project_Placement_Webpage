import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Terminal,
  Database,
  FlaskConical,
  GitMerge,
  Shield,
  Play,
  RefreshCw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// ── Config ──────────────────────────────────────────────────────────────────
const SERVICE_URL =
  (import.meta.env.VITE_AGENTIC_SERVICE_URL as string) || "http://localhost:7788";

// ── Types ───────────────────────────────────────────────────────────────────
type PipelineStage =
  | "idle"
  | "research"
  | "validate"
  | "consolidate"
  | "gate"
  | "db_write"
  | "skills"
  | "hiring"
  | "done"
  | "error";

interface PipelineResult {
  company?: string;
  company_id?: number | null;
  db_status?: string;
  gate_failures?: number;
  stage_failures?: string[];
  golden_record_fields?: number;
  providers_ok?: string[];
}

interface NodeConfig {
  id: PipelineStage;
  label: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  logKeywords: string[];
}

// ── Pipeline Node Definitions ────────────────────────────────────────────────
const NODES: NodeConfig[] = [
  {
    id: "research",
    label: "Research",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/40",
    logKeywords: ["[research]"],
  },
  {
    id: "validate",
    label: "Validate",
    icon: Shield,
    color: "from-purple-500 to-violet-500",
    glow: "shadow-purple-500/40",
    logKeywords: ["[validate]"],
  },
  {
    id: "consolidate",
    label: "Consolidate",
    icon: GitMerge,
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/40",
    logKeywords: ["[consolidate]"],
  },
  {
    id: "gate",
    label: "Quality Gate",
    icon: FlaskConical,
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/40",
    logKeywords: ["[gate]"],
  },
  {
    id: "db_write",
    label: "Persist",
    icon: Database,
    color: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/40",
    logKeywords: ["[db]"],
  },
  {
    id: "skills",
    label: "Skills",
    icon: Zap,
    color: "from-lime-500 to-green-500",
    glow: "shadow-lime-500/40",
    logKeywords: ["[skills]"],
  },
  {
    id: "hiring",
    label: "Hiring",
    icon: Sparkles,
    color: "from-fuchsia-500 to-purple-500",
    glow: "shadow-fuchsia-500/40",
    logKeywords: ["[hiring]"],
  },
];

const STAGE_ORDER: PipelineStage[] = [
  "research", "validate", "consolidate", "gate", "db_write", "skills", "hiring",
];

function stageFromLog(line: string): PipelineStage | null {
  for (const node of NODES) {
    if (node.logKeywords.some((kw) => line.includes(kw))) return node.id;
  }
  return null;
}

// ── Sub-components ───────────────────────────────────────────────────────────
function PipelineNodeViz({
  node,
  status,
}: {
  node: NodeConfig;
  status: "idle" | "active" | "done" | "error";
}) {
  const Icon = node.icon;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center
          ${
            status === "active"
              ? `bg-gradient-to-br ${node.color} shadow-lg ${node.glow}`
              : status === "done"
              ? "bg-emerald-500/20 border border-emerald-500/40"
              : status === "error"
              ? "bg-rose-500/20 border border-rose-500/40"
              : "bg-slate-800/60 border border-slate-700/40"
          }`}
        animate={
          status === "active"
            ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.5 } }
            : { scale: 1 }
        }
      >
        {status === "active" && (
          <motion.div
            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${node.color} opacity-30`}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        {status === "done" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : status === "error" ? (
          <XCircle className="w-5 h-5 text-rose-400" />
        ) : status === "active" ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Icon className="w-5 h-5 text-slate-400" />
        )}
      </motion.div>
      <span
        className={`text-[10px] font-medium tracking-wide ${
          status === "active"
            ? "text-white"
            : status === "done"
            ? "text-emerald-400"
            : status === "error"
            ? "text-rose-400"
            : "text-slate-500"
        }`}
      >
        {node.label}
      </span>
    </div>
  );
}

function LogTerminal({ lines }: { lines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const colorLine = (line: string) => {
    if (line.includes("[research]")) return "text-blue-300";
    if (line.includes("[validate]")) return "text-purple-300";
    if (line.includes("[consolidate]")) return "text-amber-300";
    if (line.includes("[gate]")) return "text-emerald-300";
    if (line.includes("[db]")) return "text-rose-300";
    if (line.includes("[skills]")) return "text-lime-300";
    if (line.includes("[hiring]")) return "text-fuchsia-300";
    if (line.includes("ERROR") || line.includes("error")) return "text-red-400";
    if (line.includes("OK") || line.includes("Done")) return "text-green-400";
    return "text-slate-400";
  };

  return (
    <div className="relative bg-black/70 border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-[11px] text-slate-400 font-mono">openradix_graph pipeline log</span>
      </div>
      {/* Log lines */}
      <div className="h-52 overflow-y-auto p-4 font-mono text-[11px] leading-5 space-y-0.5">
        {lines.length === 0 ? (
          <span className="text-slate-600">Awaiting pipeline start…</span>
        ) : (
          lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={colorLine(line)}
            >
              <span className="text-slate-600 mr-2 select-none">›</span>
              {line}
            </motion.div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function ResultBadges({ result }: { result: PipelineResult }) {
  const allGreen =
    result.gate_failures === 0 && result.db_status?.includes("ok");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
    >
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-white">
          {result.golden_record_fields ?? "—"}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Golden Record Fields</div>
      </div>
      <div
        className={`rounded-xl p-3 text-center border ${
          result.gate_failures === 0
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-rose-500/10 border-rose-500/30"
        }`}
      >
        <div
          className={`text-2xl font-bold ${
            result.gate_failures === 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {result.gate_failures ?? "—"}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Gate Failures</div>
      </div>
      <div
        className={`rounded-xl p-3 text-center border ${
          result.db_status?.includes("ok")
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-rose-500/10 border-rose-500/30"
        }`}
      >
        <div
          className={`text-sm font-bold truncate ${
            result.db_status?.includes("ok") ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {result.db_status ?? "—"}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">DB Status</div>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 text-center">
        <div className="text-sm font-bold text-blue-300">
          {(result.providers_ok ?? []).join(", ") || "—"}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Providers Used</div>
      </div>

      {allGreen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-2 sm:col-span-4 bg-gradient-to-r from-emerald-500/15 to-teal-500/15
            border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm text-emerald-300 font-medium">
            All gates passed! Company data has been persisted to Supabase. Refresh the page to see updated intelligence.
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
interface AgenticResearchPanelProps {
  companyName: string;
  companyId?: number;
}

export function AgenticResearchPanel({ companyName, companyId }: AgenticResearchPanelProps) {
  const { user } = useAuth();
  const [runState, setRunState] = useState<
    "idle" | "checking" | "running" | "done" | "error" | "service_offline"
  >("idle");
  const [currentStage, setCurrentStage] = useState<PipelineStage>("idle");
  const [completedStages, setCompletedStages] = useState<Set<PipelineStage>>(new Set());
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [serviceOnline, setServiceOnline] = useState<boolean | null>(null);

  const esRef = useRef<EventSource | null>(null);

  // ── Check service health on mount ────────────────────────────────────────
  useEffect(() => {
    fetch(`${SERVICE_URL}/health`, { signal: AbortSignal.timeout(3000) })
      .then(() => setServiceOnline(true))
      .catch(() => setServiceOnline(false));
  }, []);

  const getNodeStatus = useCallback(
    (nodeId: PipelineStage) => {
      if (completedStages.has(nodeId)) return "done" as const;
      if (currentStage === nodeId && runState === "running") return "active" as const;
      if (runState === "error" && currentStage === nodeId) return "error" as const;
      return "idle" as const;
    },
    [completedStages, currentStage, runState],
  );

  const handleRun = async () => {
    if (!serviceOnline) {
      toast.error("Agentic service is offline. Start it with: cd agentic_service && python main.py");
      return;
    }

    setRunState("checking");
    setLogs([]);
    setResult(null);
    setCompletedStages(new Set());
    setCurrentStage("idle");

    try {
      // 1. Start the job
      const res = await fetch(`${SERVICE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: companyName, company_id: companyId, max_retries: 2 }),
      });
      const { job_id } = await res.json();

      setRunState("running");
      setCurrentStage("research");

      // 2. Stream logs via SSE
      const es = new EventSource(`${SERVICE_URL}/stream/${job_id}`);
      esRef.current = es;

      es.onmessage = (event) => {
        const line = event.data as string;
        setLogs((prev) => [...prev, line]);

        // Update current stage from log keywords
        const stage = stageFromLog(line);
        if (stage) {
          setCurrentStage((prev) => {
            // Mark previous stage as done when we move to the next
            const prevIdx = STAGE_ORDER.indexOf(prev);
            const newIdx = STAGE_ORDER.indexOf(stage);
            if (newIdx > prevIdx && prev !== "idle") {
              setCompletedStages((s) => new Set([...s, prev]));
            }
            return stage;
          });
        }
      };

      es.addEventListener("done", (event) => {
        const parsed = JSON.parse((event as MessageEvent).data) as PipelineResult;
        setResult(parsed);
        setRunState("done");
        setCompletedStages(new Set(STAGE_ORDER));
        setCurrentStage("done");
        es.close();
        toast.success(`Research complete! ${parsed.golden_record_fields ?? 0} fields in golden record.`);
      });

      es.addEventListener("error", (event) => {
        try {
          const parsed = JSON.parse((event as MessageEvent).data) as PipelineResult;
          setResult(parsed);
        } catch {}
        setRunState("error");
        es.close();
        toast.error("Pipeline encountered an error. Check logs for details.");
      });

      es.onerror = () => {
        setRunState("error");
        setLogs((prev) => [...prev, "[stream error] Connection to service lost."]);
        es.close();
      };
    } catch (err) {
      setRunState("error");
      setLogs((prev) => [...prev, `[error] ${err instanceof Error ? err.message : String(err)}`]);
    }
  };

  const handleReset = () => {
    esRef.current?.close();
    setRunState("idle");
    setCurrentStage("idle");
    setCompletedStages(new Set());
    setLogs([]);
    setResult(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const isAdmin = !!user;  // guard further if needed
  const isRunning = runState === "running" || runState === "checking";

  return (
    <div className="mt-8 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-950/40 to-purple-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Research Pipeline</h3>
            <p className="text-[11px] text-slate-400">LangGraph · 3 LLMs · 3 Gates</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Service status indicator */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <div
              className={`w-2 h-2 rounded-full ${
                serviceOnline === null
                  ? "bg-slate-500 animate-pulse"
                  : serviceOnline
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-slate-400">
              {serviceOnline === null ? "Checking…" : serviceOnline ? "Service Online" : "Service Offline"}
            </span>
          </div>

          {/* Action buttons */}
          {runState === "idle" || runState === "service_offline" ? (
            <Button
              size="sm"
              onClick={handleRun}
              disabled={!isAdmin || serviceOnline === false}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs gap-1.5 h-8"
            >
              <Play className="w-3.5 h-3.5" />
              Run Research
            </Button>
          ) : runState === "done" || runState === "error" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs gap-1.5 h-8 border-slate-600 text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="text-xs gap-1.5 h-8 border-slate-600 text-slate-400"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Running…
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Service offline warning */}
        {serviceOnline === false && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-300 space-y-1">
              <p className="font-medium">Agentic service is not running</p>
              <p className="text-amber-400/80">
                Start it by running:{" "}
                <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono">
                  cd agentic_service &amp;&amp; python main.py
                </code>
              </p>
            </div>
          </motion.div>
        )}

        {/* Pipeline Node Graph */}
        <div className="relative">
          <div className="flex items-start justify-between gap-0 overflow-x-auto pb-2">
            {NODES.map((node, i) => (
              <div key={node.id} className="flex items-start">
                <PipelineNodeViz node={node} status={getNodeStatus(node.id)} />
                {i < NODES.length - 1 && (
                  <div className="flex items-center mt-4 -mx-0.5 z-10">
                    <motion.div
                      className={`h-0.5 w-6 sm:w-8 ${
                        completedStages.has(node.id)
                          ? "bg-emerald-500/60"
                          : "bg-slate-700/60"
                      }`}
                      animate={
                        completedStages.has(node.id)
                          ? { opacity: [0.5, 1, 0.5] }
                          : {}
                      }
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Log Terminal */}
        <AnimatePresence>
          {(runState !== "idle" || logs.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <LogTerminal lines={logs} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (runState === "done" || runState === "error") && (
            <ResultBadges result={result} />
          )}
        </AnimatePresence>

        {/* Admin-only notice */}
        {!isAdmin && (
          <p className="text-[11px] text-slate-500 text-center">
            Sign in as admin to trigger AI research
          </p>
        )}
      </div>
    </div>
  );
}
