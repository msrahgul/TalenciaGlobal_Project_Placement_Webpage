import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabaseClient-BlbV5jcN.js
if (typeof window === "undefined" && !globalThis.WebSocket) {
	class DummyWebSocket {
		static CONNECTING = 0;
		static OPEN = 1;
		static CLOSING = 2;
		static CLOSED = 3;
		constructor() {}
		addEventListener() {}
		removeEventListener() {}
		send() {}
		close() {}
	}
	globalThis.WebSocket = DummyWebSocket;
}
var supabaseUrl = "https://ilmwoggoqmqfylfuswdx.supabase.co";
var supabaseAnonKey = "sb_publishable_GWvHlQpCbZVv1h90NRAMmw_qll69xd9";
var hasSupabase = Boolean(supabaseAnonKey);
if (!hasSupabase) console.error("Supabase configuration missing! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined. Falling back to static seed data.");
var supabase = createClient(supabaseUrl, supabaseAnonKey);
//#endregion
export { supabase as n, hasSupabase as t };
