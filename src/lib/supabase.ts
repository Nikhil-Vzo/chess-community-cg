import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Auth features will not work.')
}

// Singleton pattern: prevent HMR from creating multiple GoTrueClient instances
const globalForSupabase = globalThis as unknown as {
  __supabase?: ReturnType<typeof createClient>
}

export const supabase = globalForSupabase.__supabase ?? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

globalForSupabase.__supabase = supabase
