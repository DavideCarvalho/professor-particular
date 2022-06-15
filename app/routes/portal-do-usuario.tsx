import { LoaderFunction, redirect } from "@remix-run/node";
import Stripe from 'stripe';
import qs from 'qs';
import { supabase } from '~/lib/supabase/supabase.server';
import {getUserByRequestToken, isAuthenticated} from "~/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const [url] = request.url.split('?');
  const { data, error } = await supabase
    .from('user')
    .select('stripe_id')
    .match({ id: user.id })
    .single();
  if (!data || error) {
    throw new Error('User not found');
  }
  if (!data.stripe_id) {
    throw new Error(`User doesn't have a payment method yet`);
  }
  const [, , urlWithoutSufix] = url.split('/');
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_id,
    locale: 'pt-BR',
    return_url: `https://${urlWithoutSufix}/salas`,
  });
  return redirect(session.url!);
};
