import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, haySupabaseEnv } from "./config";

export { haySupabaseEnv };

/** Cliente de Supabase para Client Components (navegador). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
