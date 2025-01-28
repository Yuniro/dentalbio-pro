// app/api/plan/change/route.ts

import { sendDowngradePlanMail } from "@/utils/mails/sendDowngradePlanMail";
import { createClient } from "@/utils/supabase/server";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
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

    const userId = id;

    // Fetch the user from your database to get their subscription ID
    const { data: user, error } = await supabase
      .from("users")
      .select("stripe_subscription_id, subscription_status")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found or missing subscription ID." },
        { status: 404 }
      );
    }

    const subscriptionId = user.stripe_subscription_id;

    if (subscriptionId) {
      // Fetch the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    await supabase
      .from("users")
      .update({ subscription_status, period_end: current_period_end, stripe_subscription_id: null })
      .eq("id", userId);

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

    const subscriptionId = user.stripe_subscription_id;

    if (subscriptionId) {
      // Fetch the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
      });
    }

    await supabase
      .from("users")
      .update({ subscription_status })
      .eq("id", user.id);

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

    const subscriptionId = user.stripe_subscription_id;

    if (subscriptionId) {
      // Fetch the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    await supabase
      .from("users")
      .update({ subscription_status: "FREE" })
      .eq("id", user.id);

    await sendDowngradePlanMail(user.email, user.first_name, "FREE");

    return NextResponse.json({ message: `Plan changed to FREE.` });
  } catch (err: any) {
    console.error("Error changing plan:", err.message);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
};
