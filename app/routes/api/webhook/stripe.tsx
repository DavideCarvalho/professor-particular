import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import Stripe from 'stripe';
import { supabase } from '~/lib/supabase/supabase.server';
import { InvoicePaidStripeWebhookData } from '~/dto/invoice-paid-stripe-webhook.dto';
import {
  CheckoutSessionCompletedDataStripeWebhook,
  CheckoutSessionCompletedStripeWebhook,
} from '~/dto/checkout-session-completed-stripe-webhook.dto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

// function stream2buffer(stream: ReadableStream) {
//   return new Promise((resolve, reject) => {
//     const _buf: any[] = [];
//
//     stream.on('data', (chunk) => _buf.push(chunk));
//     stream.on('end', () => resolve(Buffer.concat(_buf)));
//     stream.on('error', (err) => reject(err));
//   });
// }

const postLoader: LoaderFunction = async ({ request }) => {
  let data;
  let eventType;
  const body = await request.json();
  // Check if webhook signing is configured.
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = request.headers.get('stripe-signature') as string;

    try {
      // console.log('body', body);
      // console.log('signature', signature);
      // console.log('webhookSecret', webhookSecret);
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      // console.log(JSON.stringify(err));
      console.log(`⚠️  Webhook signature verification failed.`);
      return json(err, { status: 400 });
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = body.data;
    eventType = body.type;
  }

  let stripeCustomerId;
  let customerEmail;

  switch (eventType) {
    case 'customer.subscription.created':
    case 'checkout.session.completed':
    case 'invoice.paid':
      const checkoutSessionCompletedStripeWebhook: CheckoutSessionCompletedDataStripeWebhook =
        data;
      stripeCustomerId = checkoutSessionCompletedStripeWebhook.object.customer;
      customerEmail =
        checkoutSessionCompletedStripeWebhook.object.customer_email;
      if (!customerEmail) {
        return json(
          { message: `webhook doesn't have customer_email property` },
          { status: 200 }
        );
      }
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      const {
        data: updatedUserCheckoutCompleted,
        error: errorCheckoutCompleted,
      } = await supabase
        .from('user')
        .update({ stripe_id: stripeCustomerId })
        .match({ email: customerEmail })
        .single();
      if (!updatedUserCheckoutCompleted) {
        return json(
          { message: `User with e-mail ${customerEmail} not found` },
          { status: 404 }
        );
      }
      if (errorCheckoutCompleted) {
        return json(errorCheckoutCompleted, { status: 500 });
      }
      return json(null, { status: 200 });
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      console.log('Vish, parou de pagar, quebra o cara', data);
      break;
    case 'customer.subscription.deleted':
      console.log('vish, o cara parou de pagar');
      break;
    case 'customer.subscription.updated':
      console.log('mudou o billing');
    default:
    // Unhandled event type
  }

  return json(null, { status: 200 });
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  if (request.method.toUpperCase() === 'POST') {
    return postLoader({ request, params, context });
  }
  return json({ message: 'Method not implemented' }, { status: 501 });
};

export const action: ActionFunction = async ({ request, params, context }) => {
  if (request.method.toUpperCase() === 'POST') {
    return postLoader({ request, params, context });
  }
  return json({ message: 'Method not implemented' }, { status: 501 });
};
