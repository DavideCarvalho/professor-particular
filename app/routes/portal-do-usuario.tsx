import { LoaderFunction, redirect } from 'remix';
import Stripe from 'stripe';
import qs from 'qs';
import { supabase } from '~/lib/supabase/supabase.server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

export const loader: LoaderFunction = async ({ request }) => {
  const [url, queryString] = request.url.split('?');
  const { userId } = qs.parse(queryString) as {
    userId: string;
  };
  const { data, error } = await supabase
    .from('user')
    .select('stripe_id')
    .match({ id: userId })
    .single();
  if (!data || error) {
    throw new Error('User not found');
  }
  const [, , urlWithoutSufix] = url.split('/');
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_id,
    locale: 'pt-BR',
    return_url: `https://${urlWithoutSufix}/salas`,
  });
  return redirect(session.url!);
};
