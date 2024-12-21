// app/api/webhooks/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Read the raw body from the request
    const rawBody = await request.text();

    // Verify the event by constructing it with the raw body and signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error handling event:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Initialize Supabase client
  const supabase = createClient();

  // Extract necessary data
  const customerEmail = session.customer_email!;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string; // Get the Stripe customer ID

  // Retrieve the subscription to get more details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Extract relevant fields
  const planId = subscription.items.data[0]?.price.id ?? null;
  const status = subscription.status;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Update the user in Supabase
  const { error } = await supabase
    .from('users')
    .update({
      customer_id: customerId, // Store the customer ID
      subscription_id: subscriptionId,
      plan_id: planId,
      subscription_status: status,
      current_period_end: currentPeriodEnd,
      trial_end: trialEnd,
    })
    .eq('email', customerEmail);

  if (error) {
    console.error('Supabase update error:', error.message);
  } else {
    console.log(`User ${customerEmail} subscription updated successfully.`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // Initialize Supabase client
  const supabase = createClient();

  // Extract relevant fields
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const planId = subscription.items.data[0]?.price.id ?? null;
  const status = subscription.status;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Retrieve the customer to get their email
  const customer = await stripe.customers.retrieve(customerId);
  const customerEmail = (customer as Stripe.Customer).email;

  if (!customerEmail) {
    console.error('Customer email not found.');
    return;
  }

  // Update the user in Supabase
  const { error } = await supabase
    .from('users')
    .update({
      subscription_id: subscriptionId,
      plan_id: planId,
      subscription_status: status,
      current_period_end: currentPeriodEnd,
      trial_end: trialEnd,
    })
    .eq('email', customerEmail);

  if (error) {
    console.error('Supabase update error:', error.message);
  } else {
    console.log(`User ${customerEmail} subscription updated successfully.`);
  }
}
