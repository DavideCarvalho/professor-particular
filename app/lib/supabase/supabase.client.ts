import type { SupabaseClient } from '@supabase/supabase-js';
import { loadScript } from './load-script'

let _supabaseClient: SupabaseClient | null ;
export async function getSupabaseClient(useToken = true) {
  if (!_supabaseClient) {
    const supabase = await loadScript();
    _supabaseClient = supabase?.createClient(window.ENV.NEXT_PUBLIC_SUPABASE_URL, window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY) as SupabaseClient
    if(useToken) {
        fetch('/config').then(res => res.json()).then(config => {
            if (config && config.supabaseToken) _supabaseClient?.auth.setAuth(config.supabaseToken)
        })
    }
  }
  return _supabaseClient;
}
