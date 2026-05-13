import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fbnjipzbszkfcdxbzwuu.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ImHNdFtpPsSoRumwL4Ny4A_tuTV30G1";

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
