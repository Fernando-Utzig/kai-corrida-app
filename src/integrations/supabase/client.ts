// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xddzsxpuyhqjyrcnnfup.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZHpzeHB1eWhxanlyY25uZnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTcyMzgsImV4cCI6MjA2NjYzMzIzOH0.rprxPDQ0j6PPPAyfkLToHcJVCF4Aivtjn-6algn0Nv4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);