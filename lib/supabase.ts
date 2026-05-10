import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// For client-side usage and public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side administrative operations (bypassing RLS)
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon key.');
    return supabase;
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
