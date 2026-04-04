import { createBrowserClient } from "@supabase/ssr";

// NEXT_PUBLIC_* vars must be accessed as literals (not via process.env[variable])
// so Next.js / Turbopack can statically inline them into the client bundle.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(url, anonKey);
}
