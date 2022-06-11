import type { SupabaseScript } from './lib/supabase'

declare global {
    interface Window {
        ENV: {
            NEXT_PUBLIC_SUPABASE_URL: string,
            SUPABASE_SERVICE_ROLE_KEY: string
        },
        supabase?: SupabaseScript;
    }
}

export {}
