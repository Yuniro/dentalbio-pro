import { sendUpgradePlanMail } from "@/utils/mails/sendUpgradePlanMail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.redirect("/error?message=Invalid session");
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    const product = await getProductInfo(subscription.items.data[0].plan.product as string);

    // Determine subscription status
    let subscriptionStatus = '';
    switch (product?.name) {
      case 'PRO':
        subscriptionStatus = "PRO";
        break;
      case 'PREMIUM PRO':
        subscriptionStatus = "PREMIUM PRO";
        break;
      default:
        subscriptionStatus = 'FREE';
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        customer_id: session.customer as string,
        subscription_id: session.subscription as string,
        plan_id: subscription.items.data[0].plan.id,
        subscription_status: subscriptionStatus,
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      })
      .eq('id', session.metadata?.userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating subscription status:', error);
      return NextResponse.redirect(`${process.env.APP_URL}/error`);
    }

    await sendUpgradePlanMail(data.email, data.first_name, data.subscription_status);

    // Redirect to success page
    return NextResponse.redirect(`${process.env.APP_URL}/upgrade-success`);

  } catch (error) {
    console.error('Error processing success webhook:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/error`);
  }
}

async function getProductInfo(productId: string) {
  try {
    const product = await stripe.products.retrieve(productId);
    // console.log('Product information:', product);
    return product;
  } catch (error) {
    console.error('Error retrieving product:', error);
  }
}
