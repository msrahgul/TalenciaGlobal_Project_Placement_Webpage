import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-PZwSt8gG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-wMuKBjBU.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* src/routes/api/chat.ts
*
* TanStack Start server function — Gemini chat proxy with Local NLP fallback.
*
* GEMINI_API_KEY lives ONLY in process.env (server-side).
* This file exports a `createFileRoute` with no component (API-only)
* and the `chatWithGemini` server function for use by the chatbot.
*
* Fallback: If GEMINI_API_KEY is missing, rate-limited (429), or erroring,
* it parses `src/data/companies_master(Master Data).csv` and uses a keyword-based
* local NLP query matcher to answer questions accurately from the 100+ CSV fields.
*/
var $$splitComponentImporter = () => import("./chat-B_EchPau.mjs");
var Route = createFileRoute("/api/chat")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var chatWithGemini = createServerFn({ method: "POST" }).validator((data) => {
	if (typeof data !== "object" || !data) throw new Error("Invalid input");
	const d = data;
	if (typeof d.message !== "string" || !d.message.trim()) throw new Error("message required");
	return {
		message: d.message.trim(),
		companyName: typeof d.companyName === "string" ? d.companyName : "the selected company"
	};
}).handler(createSsrRpc("57dd3b36b2cdcfcbbaf3ea3ef81c88448fb18c571c86ac5b208919ce183ef769"));
//#endregion
export { chatWithGemini as n, Route as t };
