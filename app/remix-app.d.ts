import type { SupabaseScript } from './lib/supabase'

declare global {
    interface Window {
        ENV: {
            NEXT_PUBLIC_SUPABASE_URL: string,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string
        },
        supabase?: SupabaseScript;
    }
}

export {}
