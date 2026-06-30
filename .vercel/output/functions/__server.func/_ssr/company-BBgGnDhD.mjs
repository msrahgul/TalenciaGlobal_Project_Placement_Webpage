import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as getCategoryAccent, r as getCategoryHue, u as useCompanyProfile } from "./companyApi-BITDVXfd.mjs";
import { G as ChevronDown, J as Briefcase, K as Building, N as GraduationCap, P as Globe, S as Minimize2, W as ChevronLeft, Y as Bot, g as Send, i as User, n as X, nt as Sparkles, q as Building2, r as Users, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CFoaHS6j.mjs";
import { F as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as readStoredCompany, r as useCompany } from "./CompanyContext-BG10XvC_.mjs";
import { n as chatWithGemini } from "./chat-wMuKBjBU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company-BBgGnDhD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var STARTER_PROMPTS = [
	"Is this a good company to join?",
	"What is the work culture like?",
	"What's the tech stack used?",
	"What are the salary & ESOP details?",
	"How is the remote work policy?",
	"What are the key competitors?"
];
function uid() {
	return Math.random().toString(36).slice(2, 9);
}
function fmt(d) {
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function ThinkingDots() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1.5 px-4 py-3",
		children: [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "thinking-dot h-2 w-2 rounded-full bg-blue-400/70",
			style: { animationDelay: `${i * .18}s` }
		}, i))
	});
}
function MessageBubble({ msg, onSuggestionClick }) {
	const isUser = msg.role === "user";
	let displayContent = msg.content;
	let suggestions = [];
	if (!isUser && displayContent.includes("Suggested questions:")) {
		const parts = displayContent.split(/---?\s*\nSuggested questions:/);
		if (parts.length > 1) {
			displayContent = parts[0].trim();
			parts[1].split("\n").forEach((line) => {
				const match = line.match(/^\d+\.\s*(.+)/);
				if (match && match[1]) suggestions.push(match[1].replace(/\*/g, "").trim());
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8,
			scale: .97
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		transition: {
			duration: .22,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: `flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[10px] mb-0.5 ${isUser ? "bg-blue-500/20 border border-blue-500/30 text-blue-400" : "bg-violet-500/20 border border-violet-500/30 text-violet-400"}`,
			children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3 w-3" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${isUser ? "chat-bubble-user rounded-br-sm" : msg.isError ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm" : "chat-bubble-ai rounded-bl-sm"}`,
					dangerouslySetInnerHTML: { __html: displayContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^### (.*?)$/gm, "<div class='text-[14px] font-bold text-slate-100 mt-2 mb-1'>$1</div>").replace(/^#### (.*?)$/gm, "<div class='text-[13px] font-bold text-slate-200 mt-1.5 mb-1'>$1</div>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/^(?:\*|-) (.*?)$/gm, "<div class='flex items-start gap-1.5 mt-0.5'><span class='text-blue-400 shrink-0'>•</span><span>$1</span></div>").replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noreferrer' class='text-blue-400 hover:underline'>$1</a>").replace(/\n/g, "<br/>").replace(/<\/div><br\/>/g, "</div>") }
				}),
				suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5 mt-1.5 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-slate-400 font-medium px-1 mb-0.5 uppercase tracking-wider",
						children: "Suggested Follow-ups:"
					}), suggestions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onSuggestionClick && onSuggestionClick(q),
						className: "text-[11px] text-left leading-snug px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-300 hover:bg-blue-500/15 hover:border-blue-500/30 transition-all w-fit cursor-pointer",
						children: q
					}, i))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-slate-600 px-1 mt-0.5",
					children: fmt(msg.timestamp)
				})
			]
		})]
	});
}
function CompanyAIChatbot() {
	const { selected } = useCompany();
	const companyName = selected?.companyName ?? "the selected company";
	const companyId = selected?.companyId ?? 0;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([{
		id: uid(),
		role: "ai",
		content: `Hello! I'm your **Company Intelligence AI** for **${companyName}**.\n\nAsk me anything about this company — culture, financials, tech stack, competitors, hiring velocity, and more. I'll answer based on our intelligence platform.`,
		timestamp: /* @__PURE__ */ new Date()
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [thinking, setThinking] = (0, import_react.useState)(false);
	const [minimized, setMinimized] = (0, import_react.useState)(false);
	const messagesEndRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const messagesContainerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setMessages([{
			id: uid(),
			role: "ai",
			content: `Hello! I'm your **Company Intelligence AI** for **${companyName}**.\n\nAsk me anything about this company — culture, financials, tech stack, competitors, hiring velocity, and more. I'll answer based on our intelligence platform.`,
			timestamp: /* @__PURE__ */ new Date()
		}]);
	}, [companyId]);
	(0, import_react.useEffect)(() => {
		if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages, thinking]);
	(0, import_react.useEffect)(() => {
		if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 320);
	}, [open, minimized]);
	const sendMessage = (0, import_react.useCallback)(async (text) => {
		const trimmed = text.trim();
		if (!trimmed || thinking) return;
		const userMsg = {
			id: uid(),
			role: "user",
			content: trimmed,
			timestamp: /* @__PURE__ */ new Date()
		};
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setThinking(true);
		try {
			const aiContent = (await chatWithGemini({ data: {
				message: trimmed,
				companyName
			} })).reply;
			setMessages((prev) => [...prev, {
				id: uid(),
				role: "ai",
				content: aiContent,
				timestamp: /* @__PURE__ */ new Date()
			}]);
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
			setMessages((prev) => [...prev, {
				id: uid(),
				role: "ai",
				content: `⚠️ **Error**: ${errMsg}\n\nPlease verify your \`VITE_AI_CHAT_URL\` endpoint is reachable and returning valid JSON.`,
				timestamp: /* @__PURE__ */ new Date(),
				isError: true
			}]);
		} finally {
			setThinking(false);
		}
	}, [
		thinking,
		companyName,
		companyId
	]);
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage(input);
		}
	};
	const clearChat = () => {
		setMessages([{
			id: uid(),
			role: "ai",
			content: `Chat cleared. How can I help you learn about **${companyName}**?`,
			timestamp: /* @__PURE__ */ new Date()
		}]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: !open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
		initial: {
			scale: 0,
			opacity: 0
		},
		animate: {
			scale: 1,
			opacity: 1
		},
		exit: {
			scale: 0,
			opacity: 0
		},
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 25
		},
		onClick: () => {
			setOpen(true);
			setMinimized(false);
		},
		className: "fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-5 shadow-[0_8px_32px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.60)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/10",
		"aria-label": "Open Company Intelligence AI chatbot",
		id: "chatbot-trigger-btn",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-white shrink-0 group-hover:rotate-12 transition-transform duration-300" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-bold text-white tracking-tight whitespace-nowrap",
				children: "Ask AI"
			})
		]
	}, "chatbot-trigger") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			x: "110%",
			opacity: 0
		},
		animate: {
			x: 0,
			opacity: 1
		},
		exit: {
			x: "110%",
			opacity: 0
		},
		transition: {
			type: "spring",
			stiffness: 340,
			damping: 32
		},
		className: "fixed right-4 bottom-4 z-50 flex flex-col w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(99,102,241,0.08)] overflow-hidden",
		style: { height: minimized ? "auto" : "min(680px, calc(100vh - 6rem))" },
		id: "chatbot-panel",
		role: "dialog",
		"aria-label": "Company Intelligence AI chatbot",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60 bg-gradient-to-r from-slate-900/80 to-slate-950/80 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-bold text-slate-100 leading-none",
					children: "Company Intelligence AI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500 mt-0.5 font-medium truncate max-w-[180px]",
					children: companyName
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: clearChat,
						className: "h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer",
						title: "Clear chat",
						id: "chatbot-clear-btn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMinimized((m) => !m),
						className: "h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer",
						title: minimized ? "Expand" : "Minimize",
						id: "chatbot-minimize-btn",
						children: minimized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 rotate-180" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer",
						title: "Close",
						id: "chatbot-close-btn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: !minimized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .25,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "flex flex-col flex-1 min-h-0 overflow-hidden",
				style: {
					flex: "1 1 0%",
					minHeight: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: messagesContainerRef,
						className: "flex-1 overflow-y-auto px-3 py-4 space-y-3 no-scrollbar",
						style: { minHeight: 0 },
						children: [
							messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
								msg,
								onSuggestionClick: sendMessage
							}, msg.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: 6
								},
								className: "flex items-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-6 w-6 shrink-0 rounded-full flex items-center justify-center bg-violet-500/20 border border-violet-500/30 text-violet-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3 w-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "chat-bubble-ai rounded-2xl rounded-bl-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThinkingDots, {})
								})]
							}, "thinking") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
						]
					}),
					messages.length === 1 && !thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-2 flex flex-wrap gap-1.5",
						children: STARTER_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => sendMessage(p),
							className: "text-[11px] font-medium text-slate-400 hover:text-blue-300 bg-slate-900/40 hover:bg-blue-500/10 border border-slate-800/60 hover:border-blue-500/20 rounded-full px-3 py-1 transition-all cursor-pointer",
							children: p
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 pb-3 pt-2 border-t border-slate-800/60 bg-slate-950/40 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-2 rounded-xl bg-slate-900/60 border border-slate-800/60 focus-within:border-blue-500/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								id: "chatbot-input",
								rows: 1,
								value: input,
								onChange: (e) => {
									setInput(e.target.value);
									e.target.style.height = "auto";
									e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
								},
								onKeyDown: handleKeyDown,
								disabled: thinking,
								placeholder: `Ask about ${companyName}…`,
								className: "flex-1 resize-none bg-transparent text-[13px] text-slate-200 placeholder:text-slate-600 outline-none leading-relaxed min-h-[22px] max-h-[100px] no-scrollbar disabled:opacity-50",
								style: { height: "22px" },
								"aria-label": "Chat message input"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => sendMessage(input),
								disabled: !input.trim() || thinking,
								className: "h-7 w-7 shrink-0 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer",
								id: "chatbot-send-btn",
								"aria-label": "Send message",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 text-white" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-center text-[10px] text-slate-700",
							children: "Powered by Company Intelligence AI"
						})]
					})
				]
			}, "chatbot-body")
		})]
	}, "chatbot-panel") })] });
}
var PlacementNetworkBackground = (0, import_react.memo)(function PlacementNetworkBackground({ category }) {
	const canvasRef = (0, import_react.useRef)(null);
	const mouseRef = (0, import_react.useRef)({
		x: -9999,
		y: -9999
	});
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		let rafId;
		let paused = false;
		let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		let W = window.innerWidth;
		let H = window.innerHeight;
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 1.5);
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = Math.floor(W * dpr);
			canvas.height = Math.floor(H * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		let lastMouseTime = 0;
		const onMouse = (e) => {
			const now = performance.now();
			if (now - lastMouseTime < 16) return;
			lastMouseTime = now;
			mouseRef.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const onLeave = () => {
			mouseRef.current = {
				x: -9999,
				y: -9999
			};
		};
		const onVisibility = () => {
			paused = document.hidden;
		};
		window.addEventListener("resize", resize, { passive: true });
		window.addEventListener("mousemove", onMouse, { passive: true });
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("visibilitychange", onVisibility);
		const h1 = getCategoryHue(category);
		const h2 = (h1 + 40) % 360;
		const h3 = (h1 + 120) % 360;
		const COLORS = [
			{
				outer: `hsla(${h1}, 85%, 60%, 0.18)`,
				fill: `hsla(${h1}, 85%, 60%, 0.75)`
			},
			{
				outer: `hsla(${h2}, 85%, 60%, 0.18)`,
				fill: `hsla(${h2}, 85%, 60%, 0.75)`
			},
			{
				outer: `hsla(${h3}, 80%, 65%, 0.18)`,
				fill: `hsla(${h3}, 80%, 65%, 0.75)`
			},
			{
				outer: `hsla(${(h1 + 200) % 360}, 75%, 65%, 0.15)`,
				fill: `hsla(${(h1 + 200) % 360}, 75%, 65%, 0.75)`
			},
			{
				outer: `hsla(${(h1 + 180) % 360}, 60%, 75%, 0.15)`,
				fill: `hsla(${(h1 + 180) % 360}, 60%, 75%, 0.70)`
			}
		];
		const particles = Array.from({ length: 40 }, (_, i) => {
			const dur = 18 + Math.random() * 24;
			const yFrac = Math.random();
			return {
				lp: Math.random() * 100,
				y: H + 50 - yFrac * (H + 100),
				sz: i < 8 ? 2.5 : Math.random() < .4 ? 2 : 1.5,
				spd: (H + 150) / (dur * 60),
				col: COLORS[i % COLORS.length],
				swA: 25 + Math.random() * 40,
				swS: .007 + Math.random() * .007,
				swP: Math.random() * Math.PI * 2,
				ox: 0,
				oy: 0,
				af: 0,
				dx: 0,
				dy: 0,
				md: 9999
			};
		});
		let t = 0;
		const draw = () => {
			if (paused) {
				rafId = requestAnimationFrame(draw);
				return;
			}
			t += .4;
			ctx.clearRect(0, 0, W, H);
			const mx = mouseRef.current.x;
			const my = mouseRef.current.y;
			const mouseActive = mx > -500;
			for (const p of particles) {
				p.y -= p.spd;
				if (p.y < -50) {
					p.y = H + 50;
					p.lp = Math.random() * 100;
				}
				const tx = p.lp * W / 100 + Math.sin(t * p.swS + p.swP) * p.swA;
				if (mouseActive) {
					const dx = tx - mx, dy = p.y - my;
					const dist = Math.sqrt(dx * dx + dy * dy);
					p.md = dist;
					if (dist < 160) {
						const f = (160 - dist) / 160;
						p.ox += (dx / (dist || 1) * f * 36 - p.ox) * .1;
						p.oy += (dy / (dist || 1) * f * 36 - p.oy) * .1;
						p.af += (1 - p.af) * .1;
					} else {
						p.ox *= .9;
						p.oy *= .9;
						p.af *= .9;
					}
				} else {
					p.md = 9999;
					p.ox *= .9;
					p.oy *= .9;
					p.af *= .9;
				}
				p.dx = tx + p.ox;
				p.dy = p.y + p.oy;
			}
			if (mouseActive) {
				ctx.lineWidth = .7;
				for (let i = 0; i < particles.length; i++) {
					const a = particles[i];
					if (a.md > 160) continue;
					for (let j = i + 1; j < particles.length; j++) {
						const b = particles[j];
						if (b.md > 160) continue;
						const ex = a.dx - b.dx, ey = a.dy - b.dy;
						const ed2 = ex * ex + ey * ey;
						if (ed2 < 12100) {
							const alpha = (160 - a.md) / 160 * ((160 - b.md) / 160) * (1 - ed2 / 12100) * .16;
							ctx.beginPath();
							ctx.moveTo(a.dx, a.dy);
							ctx.lineTo(b.dx, b.dy);
							ctx.strokeStyle = `hsla(${h1}, 80%, 65%, ${alpha.toFixed(3)})`;
							ctx.stroke();
						}
					}
				}
			}
			ctx.shadowBlur = 0;
			ctx.shadowColor = "transparent";
			for (const p of particles) {
				const outerRadius = p.sz * 3.5 * (1 + Math.sin(t * .02 + p.swP) * .25);
				ctx.beginPath();
				ctx.arc(p.dx, p.dy, outerRadius, 0, Math.PI * 2);
				ctx.strokeStyle = p.col.outer;
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(p.dx, p.dy, p.sz, 0, Math.PI * 2);
				ctx.fillStyle = p.col.fill;
				ctx.fill();
			}
			rafId = requestAnimationFrame(draw);
		};
		draw();
		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouse);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [category]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-0 select-none bg-[#0a0a0c] overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent z-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 w-full h-full z-10"
		})]
	});
});
function CompanyLayout() {
	const navigate = useNavigate();
	const { selected, selectCompany } = useCompany();
	const { data: profile } = useCompanyProfile(selected?.companyId ?? 0);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (selected) return;
		const stored = readStoredCompany();
		if (stored) selectCompany(stored);
		else navigate({ to: "/" });
	}, [
		selected,
		selectCompany,
		navigate
	]);
	if (!selected) return null;
	const accent = getCategoryAccent(profile?.category);
	const activeClass = `${accent.badgeBg} ${accent.badgeText} border ${accent.badgeBorder} shadow-sm font-bold`;
	const h1 = getCategoryHue(profile?.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mesh-bg min-h-screen w-full flex flex-col relative",
		style: {
			"--theme-text": `hsla(${h1}, 85%, 65%, 1)`,
			"--theme-text-hover": `hsla(${h1}, 85%, 75%, 1)`,
			"--theme-border": `hsla(${h1}, 85%, 60%, 0.25)`,
			"--theme-bg": `hsla(${h1}, 85%, 60%, 0.12)`,
			"--theme-bg-faint": `hsla(${h1}, 85%, 60%, 0.02)`,
			"--theme-shadow": `hsla(${h1}, 85%, 60%, 0.15)`,
			"--theme-icon": `hsla(${h1}, 85%, 65%, 1)`,
			"--theme-gradient-from": `hsla(${h1}, 85%, 60%, 0.18)`,
			"--theme-gradient-to": `hsla(${h1}, 85%, 60%, 0.05)`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-bg absolute inset-0 z-0 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacementNetworkBackground, { category: profile?.category }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.header, {
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "sticky top-0 z-30 border-b border-slate-900/60 bg-slate-950/95 backdrop-blur-sm shadow-lg relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								whileHover: { x: -2 },
								whileTap: { scale: .92 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-850/60 bg-slate-900/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all shrink-0 cursor-pointer",
									title: "Back to all companies",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
								name: selected.companyName,
								logoUrl: selected.logoUrl,
								size: 40,
								className: "shrink-0 rounded-xl border border-slate-850/65 bg-slate-900/40 p-0.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-heading text-lg sm:text-xl font-bold text-slate-100 leading-snug break-words",
									children: selected.companyName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-medium text-slate-400",
									children: [
										profile?.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3 text-slate-500" }), String(profile.category)]
										}) : null,
										profile?.nature_of_company ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3 w-3 text-slate-500" }), String(profile.nature_of_company)]
										}) : null,
										profile?.website_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: String(profile.website_url),
											target: "_blank",
											rel: "noreferrer",
											className: `flex items-center gap-1 hover:underline transition-colors ${accent.badgeText.replace("group-hover:", "hover:")}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3" }), " Website"]
										}) : null
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-4 self-end md:self-auto shrink-0 relative z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex bg-slate-900/40 p-1 border border-slate-850/80 rounded-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/company/intelligence",
									className: `inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${pathname === "/company/intelligence" ? activeClass : "text-slate-400 hover:text-slate-200 border border-transparent font-medium"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: { rotate: -8 },
										whileTap: { scale: .95 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Intelligence" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/company/skills",
									className: `inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${pathname === "/company/skills" ? activeClass : "text-slate-400 hover:text-slate-200 border border-transparent font-medium"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: { rotate: 12 },
										whileTap: { scale: .95 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skills" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/company/leaderboard",
									className: `inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${pathname === "/company/leaderboard" ? activeClass : "text-slate-400 hover:text-slate-200 border border-transparent font-medium"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: { scale: 1.1 },
										whileTap: { scale: .95 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Leaderboard" })]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 w-full relative z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAIChatbot, {})
		]
	});
}
//#endregion
export { CompanyLayout as component };
