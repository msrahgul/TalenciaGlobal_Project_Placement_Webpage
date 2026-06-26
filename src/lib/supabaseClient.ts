import { createClient } from "@supabase/supabase-js";

// Polyfill a dummy WebSocket class for Server-Side Rendering (SSR) to prevent Supabase Realtime warnings/crashes in Node.js 20
if (typeof window === "undefined" && !globalThis.WebSocket) {
  class DummyWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    constructor() {
      // No-op
    }
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  }
  (globalThis as any).WebSocket = DummyWebSocket;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabase) {
  console.error(
    "Supabase configuration missing! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined. Falling back to static seed data.",
  );
}

// Use a placeholder URL so createClient doesn't throw at import time when
// the project hasn't been wired to Supabase yet. Any network call will
// fail and trigger the seed-data fallback in companyApi.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);

