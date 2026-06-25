import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function isValidUrl(url: string): boolean {
  try {
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
}

export const supabase =
  supabaseUrl && supabaseKey && isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null;
