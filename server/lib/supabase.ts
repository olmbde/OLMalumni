import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ndnflifradbwcomcjpxa.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_kHqPFcfykrptmCBKwSDxgA_lWIUXQgb";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials not found.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
