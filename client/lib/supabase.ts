import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials not found. Using demo mode with sample data."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
