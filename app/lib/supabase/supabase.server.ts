import { createClient } from '@supabase/supabase-js'
// @ts-ignore
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
