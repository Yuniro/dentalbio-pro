// app/api/checkout/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const POST = async (request: Request) => {
  const { priceId, email } = await request.json();

  const APP_URL = process.env.APP_URL || "http://localhost:3000";

  // Calculate the trial end timestamp for February 1, 2025
  const trialEndDate = new Date('2025-02-01T00:00:00Z');
  const trialEndTimestamp = Math.floor(trialEndDate.getTime() / 1000);

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
      subscription_data: {
        trial_end: trialEndTimestamp,
      },
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/cancel`,
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
