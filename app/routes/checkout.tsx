import { LoaderFunction, redirect } from 'remix';
import Stripe from 'stripe';
import qs from 'qs';
import { supabase } from '~/lib/supabase/supabase.server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

export const loader: LoaderFunction = async ({ request }) => {
  const [url, queryString] = request.url.split('?');
  const { productId, userId } = qs.parse(queryString) as {
    productId: string;
    userId: string;
  };
  const { data, error } = await supabase
    .from('user')
    .select('email')
    .match({ id: userId })
    .single();
  if (!data || error) {
    throw new Error('User not found');
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: data.email,
    line_items: [
      {
        price: productId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${url}-sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}-cancelado`,
  });
  return redirect(session.url!);
};
