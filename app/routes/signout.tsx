import { ActionFunction, redirect } from "@remix-run/node";
import { supabase } from '~/lib/supabase/supabase.server';
import { supabaseToken } from '~/cookies';
import { getToken } from '~/lib/auth';

export let action: ActionFunction = async ({ request }) => {
  const token = await getToken(request);
  await supabase.auth.api.signOut(token!);
  return redirect('/', {
    headers: {
      'Set-Cookie': await supabaseToken.serialize('', { maxAge: 0 }),
    },
  });
};
