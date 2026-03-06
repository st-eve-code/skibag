import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bvvosplyvnkdtsiqokoq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dm9zcGx5dm5rZHRzaXFva29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTMzMzIsImV4cCI6MjA4ODM2OTMzMn0.Wdjrim4gb5aunY8AUFtQEesFbFJvRwKqNczV4nexT1w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
