// app/api/plan/change/route.ts

import { sendDowngradePlanMail } from "@/utils/mails/sendDowngradePlanMail";
import { createClient } from "@/utils/supabase/server";
import { getUserInfo } from "@/utils/userInfo";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const POST = async (request: Request) => {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { id, subscription_status, current_period_end } = body;

    if (!subscription_status) {
      return NextResponse.json(
        { error: "Missing subscription_status in request body." },
        { status: 400 }
      );
    }

    // Fetch the user from your database to get their subscription ID
    const { data: user, error } = await supabase
      .from("users")
      .select("subscription_id, subscription_status")
      .eq("id", id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found or missing subscription ID." },
        { status: 404 }
      );
    }

    const subscriptionId = user.subscription_id;

    if (subscriptionId) {
      // Fetch the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription.status !== 'canceled') {
        const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      } else {
        console.log('Subscription is already canceled.');
      }
    }

    console.log("Subscription status:", subscription_status);

    const { data, error: supabaseError } = await supabase
      .from("users")
      .update({ subscription_status, current_period_end: subscription_status === 'FREE' ? null : current_period_end, subscription_id: null })
      .eq("id", id)
      .select('*');

    // console.log("Updated user:", data, id);

    return NextResponse.json({ message: `Plan changed to ${subscription_status}.` });
  } catch (err: any) {
    console.error("Error changing plan:", err.message);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { priceId, subscription_status } = body;

    if (!subscription_status) {
      return NextResponse.json(
        { error: "Missing subscription_status in request body." },
        { status: 400 }
      );
    }

    const user = await getUserInfo({ supabase });

    const subscriptionId = user.subscription_id;

    if (subscriptionId) {
      // Fetch the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      // console.log('Subscription:', subscription);

      if (subscription.items.data.length > 0) {
        const subscriptionItemId = subscription.items.data[0].id;

        // Update the subscription's price
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: subscriptionItemId,
              price: priceId,
            },
          ],
          proration_behavior: 'create_prorations', // This handles proration
          off_session: true, // If the user is not online, set this to true
        });

        // console.log('Updated Subscription:', updatedSubscription);
      } else {
        return NextResponse.json(
          { error: "No subscription items found for this subscription." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "No subscription ID found for the user." },
        { status: 400 }
      );
    }

    // Update subscription status in your database
    await supabase
      .from("users")
      .update({ subscription_status })
      .eq("id", user.id);

    // Send an email notification about the plan change
    await sendDowngradePlanMail(user.email, user.first_name, subscription_status);

    return NextResponse.json({ message: `Plan changed to ${subscription_status}.` });
  } catch (err: any) {
    console.error("Error changing plan:", err.message);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  const supabase = createClient();

  try {
    const user = await getUserInfo({ supabase });

    const subscriptionId = user.subscription_id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No subscription found for this user." },
        { status: 400 }
      );
    }

    await supabase
      .from("users")
      .update({ subscription_status: "FREE", subscription_id: null })
      .eq("id", user.id);

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription.status !== 'canceled') {
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      console.log('Subscription is already canceled.');
    }

    await sendDowngradePlanMail(user.email, user.first_name, "FREE");

    return NextResponse.json({ message: `Plan changed to FREE.` });
  } catch (err: any) {
    console.error("Error canceling subscription:", err.message);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
};
