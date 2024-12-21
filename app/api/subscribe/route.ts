import stripe from "@/app/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { customerId, priceId } = await req.json();

  try {
    // Create a subscription schedule with a specific start date
    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
      customer: customerId,
      start_date: Math.floor(new Date("2025-02-01").getTime() / 1000), // Feb 01, 2025 in Unix timestamp
      end_behavior: "release",
      phases: [
        {
          items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          // Use the price's billing interval (monthly/yearly is defined in Stripe price object)
          billing_cycle_anchor: "automatic",
        },
      ],
    });

    return NextResponse.json({ subscriptionSchedule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
