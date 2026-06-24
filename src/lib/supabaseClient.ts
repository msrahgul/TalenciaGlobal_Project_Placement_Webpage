import { createClient } from "@supabase/supabase-js";

// Polyfill WebSocket for SSR on Node.js (< 22)
if (typeof window === "undefined" && !globalThis.WebSocket) {
  try {
    const ws = await import(/* @vite-ignore */ "ws");
    (globalThis as any).WebSocket = ws.default || ws;
  } catch (err) {
    console.error("Could not polyfill WebSocket for SSR:", err);
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Missing env variable VITE_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  console.error("Missing env variable VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
