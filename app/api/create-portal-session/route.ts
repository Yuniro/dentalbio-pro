// app/api/create-portal-session/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const POST = async (request: Request) => {
  try {
    // Initialize Supabase client
    const supabase = createClient();

    // Get the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect('/login');
    }

    // Use the user's email for lookup
    const email = user.email ?? '';

    // Fetch the user's customer ID from the database
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('customer_id')
      .eq('email', email)
      .single();

    if (userError || !userRecord?.customer_id) {
      console.error('Customer ID not found for user:', email);
      return NextResponse.redirect('/success'); // Or show an error page
    }

    const customerId = userRecord.customer_id;

    // Create a Customer Portal session
    const returnUrl = `${process.env.APP_URL}/success`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    // Redirect the user to the portal URL with a 303 See Other status
    return NextResponse.redirect(portalSession.url, {
      status: 303,
    });

  } catch (err: any) {
    console.error('Failed to create portal session:', err.message);
    return NextResponse.redirect('/success'); // Or show an error page
  }
};
