/**
 * CompanyAIChatbot.tsx
 *
 * Floating "Company Intelligence AI" chatbot panel.
 *
 * Placement:  Mounted once inside CompanyLayout (company.tsx).
 * Visibility: Bottom-right floating trigger button; slides open as a panel.
 * API:        POST to import.meta.env.VITE_AI_CHAT_URL with { message, companyName, companyId }.
 *             Falls back to a polite mock when the env var is not set.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  ChevronDown,
  Bot,
  User,
  RotateCcw,
  Minimize2,
} from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { chatWithGemini } from "@/routes/api/chat";

/* ─── Types ────────────────────────────────────────────── */

type Role = "user" | "ai";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

/* ─── Constants ─────────────────────────────────────────── */

// No client-side endpoint needed — chatWithGemini is a TanStack Start
// server function called directly via RPC. The API key never reaches the browser.

const SYSTEM_PREAMBLE = (companyName: string) =>
  `You are the "Company Intelligence AI", a specialized corporate analyst chatbot embedded within the KITS Placement Hub platform. ` +
  `Your knowledge base is strictly derived from the companies_master dataset which contains deep intelligence on over 100+ data points for top recruiting companies. ` +
  `The user is currently viewing the company: ${companyName}. ` +
  `Answer questions accurately and concisely. If data is unavailable for a metric, say so honestly rather than guessing. ` +
  `Format your answers with bullet points and bold text where appropriate for maximum clarity.`;

const STARTER_PROMPTS = [
  "Is this a good company to join?",
  "What is the work culture like?",
  "What's the tech stack used?",
  "What are the salary & ESOP details?",
  "How is the remote work policy?",
  "What are the key competitors?",
];

const MOCK_RESPONSE = (companyName: string) =>
  `I'm your **Company Intelligence AI** for **${companyName}**. ` +
  `To activate live AI responses, set the \`VITE_AI_CHAT_URL\` environment variable in your \`.env\` file to point to your RAG/AI API endpoint.\n\n` +
  `In the meantime, I can tell you that the dataset covers:\n` +
  `- **Financials & Growth** — revenue, valuation, YoY growth\n` +
  `- **Culture & HR** — leave policy, burnout risk, remote policy\n` +
  `- **Technology** — AI/ML adoption, tech stack, cloud partners\n` +
  `- **Competitors & Strategy** — key rivals, future projections\n\n` +
  `Configure the endpoint and I'll answer any of those questions with real data! 🚀`;

/* ─── Helpers ───────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function fmt(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── Sub-components ─────────────────────────────────────── */

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="thinking-dot h-2 w-2 rounded-full bg-blue-400/70"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, onSuggestionClick }: { msg: Message; onSuggestionClick?: (q: string) => void }) {
  const isUser = msg.role === "user";

  let displayContent = msg.content;
  let suggestions: string[] = [];

  if (!isUser && displayContent.includes("Suggested questions:")) {
    const parts = displayContent.split(/---?\s*\nSuggested questions:/);
    if (parts.length > 1) {
      displayContent = parts[0].trim();
      const suggestionsText = parts[1];
      const lines = suggestionsText.split('\n');
      lines.forEach(line => {
        const match = line.match(/^\d+\.\s*(.+)/);
        if (match && match[1]) {
          suggestions.push(match[1].replace(/\*/g, '').trim());
        }
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[10px] mb-0.5 ${
          isUser
            ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
            : "bg-violet-500/20 border border-violet-500/30 text-violet-400"
        }`}
      >
        {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
      </div>

      {/* Bubble & Suggestions */}
      <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "chat-bubble-user rounded-br-sm"
              : msg.isError
              ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm"
              : "chat-bubble-ai rounded-bl-sm"
          }`}
          dangerouslySetInnerHTML={{
            __html: displayContent
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/^### (.*?)$/gm, "<div class='text-[14px] font-bold text-slate-100 mt-2 mb-1'>$1</div>")
              .replace(/^#### (.*?)$/gm, "<div class='text-[13px] font-bold text-slate-200 mt-1.5 mb-1'>$1</div>")
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/^(?:\*|-) (.*?)$/gm, "<div class='flex items-start gap-1.5 mt-0.5'><span class='text-blue-400 shrink-0'>•</span><span>$1</span></div>")
              .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noreferrer' class='text-blue-400 hover:underline'>$1</a>")
              .replace(/\n/g, "<br/>")
              .replace(/<\/div><br\/>/g, "</div>"),
          }}
        />

        {/* Render Suggested Questions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1.5 w-full">
            <span className="text-[10px] text-slate-400 font-medium px-1 mb-0.5 uppercase tracking-wider">Suggested Follow-ups:</span>
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick && onSuggestionClick(q)}
                className="text-[11px] text-left leading-snug px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-300 hover:bg-blue-500/15 hover:border-blue-500/30 transition-all w-fit cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <span className="text-[10px] text-slate-600 px-1 mt-0.5">{fmt(msg.timestamp)}</span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

export function CompanyAIChatbot() {
  const { selected } = useCompany();
  const companyName = selected?.companyName ?? "the selected company";
  const companyId = selected?.companyId ?? 0;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "ai",
      content: `Hello! I'm your **Company Intelligence AI** for **${companyName}**.\n\nAsk me anything about this company — culture, financials, tech stack, competitors, hiring velocity, and more. I'll answer based on our intelligence platform.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Reset greeting when company changes
  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: "ai",
        content: `Hello! I'm your **Company Intelligence AI** for **${companyName}**.\n\nAsk me anything about this company — culture, financials, tech stack, competitors, hiring velocity, and more. I'll answer based on our intelligence platform.`,
        timestamp: new Date(),
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, thinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [open, minimized]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setThinking(true);

      try {
        // Call the TanStack Start server function directly (RPC — no fetch needed)
        const result = await chatWithGemini({
          data: { message: trimmed, companyName },
        });

        const aiContent = result.reply;

        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "ai", content: aiContent, timestamp: new Date() },
        ]);
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "ai",
            content: `⚠️ **Error**: ${errMsg}\n\nPlease verify your \`VITE_AI_CHAT_URL\` endpoint is reachable and returning valid JSON.`,
            timestamp: new Date(),
            isError: true,
          },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking, companyName, companyId],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: uid(),
        role: "ai",
        content: `Chat cleared. How can I help you learn about **${companyName}**?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chatbot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-5 shadow-[0_8px_32px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.60)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
            aria-label="Open Company Intelligence AI chatbot"
            id="chatbot-trigger-btn"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500 pointer-events-none" />
            <Sparkles className="h-5 w-5 text-white shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
              Ask AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ──────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot-panel"
            initial={{ x: "110%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "110%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed right-4 bottom-4 z-50 flex flex-col w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(99,102,241,0.08)] overflow-hidden"
            style={{ height: minimized ? "auto" : "min(680px, calc(100vh - 6rem))" }}
            id="chatbot-panel"
            role="dialog"
            aria-label="Company Intelligence AI chatbot"
          >
            {/* ─── Panel Header ─── */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60 bg-gradient-to-r from-slate-900/80 to-slate-950/80 shrink-0">
              <div className="flex items-center gap-3">
                {/* Animated icon */}
                <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-blue-400" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-100 leading-none">Company Intelligence AI</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate max-w-[180px]">
                    {companyName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
                  title="Clear chat"
                  id="chatbot-clear-btn"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setMinimized((m) => !m)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
                  title={minimized ? "Expand" : "Minimize"}
                  id="chatbot-minimize-btn"
                >
                  {minimized ? (
                    <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                  ) : (
                    <Minimize2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Close"
                  id="chatbot-close-btn"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ─── Collapsible Body ─── */}
            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="chatbot-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col flex-1 min-h-0 overflow-hidden"
                  style={{ flex: "1 1 0%", minHeight: 0 }}
                >
                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-3 py-4 space-y-3 no-scrollbar"
                    style={{ minHeight: 0 }}
                  >
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} onSuggestionClick={sendMessage} />
                    ))}

                    {/* Thinking dots */}
                    <AnimatePresence>
                      {thinking && (
                        <motion.div
                          key="thinking"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="flex items-end gap-2"
                        >
                          <div className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center bg-violet-500/20 border border-violet-500/30 text-violet-400">
                            <Bot className="h-3 w-3" />
                          </div>
                          <div className="chat-bubble-ai rounded-2xl rounded-bl-sm">
                            <ThinkingDots />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Starter prompts (only when 1 message = greeting) */}
                  {messages.length === 1 && !thinking && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                      {STARTER_PROMPTS.map((p) => (
                        <button
                          key={p}
                          onClick={() => sendMessage(p)}
                          className="text-[11px] font-medium text-slate-400 hover:text-blue-300 bg-slate-900/40 hover:bg-blue-500/10 border border-slate-800/60 hover:border-blue-500/20 rounded-full px-3 py-1 transition-all cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="px-3 pb-3 pt-2 border-t border-slate-800/60 bg-slate-950/40 shrink-0">
                    <div className="flex items-end gap-2 rounded-xl bg-slate-900/60 border border-slate-800/60 focus-within:border-blue-500/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all px-3 py-2">
                      <textarea
                        ref={inputRef}
                        id="chatbot-input"
                        rows={1}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          // Auto-grow
                          e.target.style.height = "auto";
                          e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={thinking}
                        placeholder={`Ask about ${companyName}…`}
                        className="flex-1 resize-none bg-transparent text-[13px] text-slate-200 placeholder:text-slate-600 outline-none leading-relaxed min-h-[22px] max-h-[100px] no-scrollbar disabled:opacity-50"
                        style={{ height: "22px" }}
                        aria-label="Chat message input"
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || thinking}
                        className="h-7 w-7 shrink-0 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        id="chatbot-send-btn"
                        aria-label="Send message"
                      >
                        <Send className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                    <p className="mt-1.5 text-center text-[10px] text-slate-700">
                      Powered by Company Intelligence AI
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
