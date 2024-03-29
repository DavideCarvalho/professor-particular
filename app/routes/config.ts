import { json, LoaderFunction } from "@remix-run/node";
import { isAuthenticated, getToken } from '~/lib/auth';

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request)))
    throw new Response('Unauthorized', {
      status: 401,
    });
  return json({
    supabaseToken: await getToken(request),
  });
};
