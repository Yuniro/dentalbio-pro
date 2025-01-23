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
  
  // Calculate the trial end timestamp for February 1, 2025
  const trialEndDate = new Date("2025-02-01");
  const trialEndTimestamp = Math.floor(trialEndDate.getTime() / 1000);
  
  const subscription_data = (trialEndTimestamp > (new Date()).getTime() / 1000 + 2 * 24 * 60 * 60) ? {
    trial_end: trialEndTimestamp,
  } : {};
  
  
  
  // const user = await supabase.from('users').select('*').eq('id', userId).single();
  
  // const trialEndTimestamp = Math.floor((user.data?.trial_end) ? (new Date(user.data?.trial_end)).getTime() / 1000 : (new Date()).getTime() / 1000 + 31 * 24 * 60 * 60);
  
  // const subscription_data = (trialEndTimestamp > (new Date()).getTime() / 1000 + 2 * 24 * 60 * 60) ? {
  //   trial_end: trialEndTimestamp,
  // } : {};

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
