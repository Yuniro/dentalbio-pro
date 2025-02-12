// app/api/checkout/route.ts

import { createClient } from "@/utils/supabase/server";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// async function createPrice() {
//   try {
//     const prices = await stripe.prices.create({
//       active: true,
//       product: "prod_QqVPOJBK8nRBXg",
//       unit_amount: 0,
//       currency: "gbp",
//       recurring: {
//         interval: "year",
//       },
//       billing_scheme: "per_unit",
//     });

//     console.log(prices);

//     return prices;
//   } catch (err: any) {
//     console.error("Failed to fetch prices:", err);
//     return null;
//   }
// }

export const POST = async (request: Request) => {
  const supabase = createClient();
  const userId = await getEffectiveUserId({ targetUserId: null, supabase });
  const { priceId, email } = await request.json();
  const APP_URL = process.env.APP_URL || "http://localhost:3000";

  // Fetch the user's trial end date from Supabase
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('trial_end, subscription_status')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: { message: "User not found." } }, { status: 404 });
  }

  const trialEndDate = new Date(user.trial_end);
  const today = new Date();
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);

  // Check if the trial end date is within the next 2 days
  const isTrialEndingSoon = trialEndDate > today && trialEndDate <= twoDaysFromNow;

  // Determine subscription data based on trial end date
  let subscription_data = {};
  if (isTrialEndingSoon) {
    subscription_data = {
      trial_end: Math.floor(trialEndDate.getTime() / 1000),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data,
      metadata: {
        userId: userId,
      },
      success_url: `${APP_URL}/api/stripe/webhook/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/success`,
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Session creation failed:", err);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
};
