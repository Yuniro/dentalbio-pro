import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Resend } from "resend";
import Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

const pricePro = process.env.PRICE_PRO_MONTHLY!

const calculateAge = (birthday: Date) => {
    const today = new Date();
    const birthDate = new Date(birthday); // Convert birthday string to Date if necessary

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the current month is before the birth month, or it's the birth month but the current day is before the birthday
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--; // Subtract 1 from age
    }

    return age;
}

const addMonthsToCurrentDate = (months: number) => {
    const today = new Date();
    today.setMonth(today.getMonth() + months);

    if (today.getDate() !== new Date().getDate()) today.setDate(0)
    return today;
}

export async function POST(request: Request) {
    const supabase = createClient();
    const {
        email,
        password,
        username,
        firstName,
        lastName,
        birthday,
        position,
        offerCode,
        country,
        title,
        redirectUrl,
        inviteUserName,
        location
    } = await request.json();

    // Validate input data
    if (!email || !password || !username) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    try {
        // Check if email is already in use
        const { data: emailCheckData, error: emailCheckError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single();

        if (emailCheckError && emailCheckError.code !== "PGRST116") {
            return NextResponse.json({ error: "Error checking email availability." }, { status: 500 });
        }

        if (emailCheckData) {
            return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
        }

        // Check if username is already taken
        const { data: usernameCheckData, error: usernameCheckError } = await supabase
            .from("users")
            .select("username")
            .ilike("username", username) // Case-insensitive check
            .single();

        if (usernameCheckError && usernameCheckError.code !== "PGRST116") {
            return NextResponse.json({ error: "Error checking username availability." }, { status: 500 });
        }

        if (usernameCheckData) {
            return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-code`, { method: 'GET' })
        const serverOfferCodes = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: "Can't get offerCode from the admin" }, { status: 400 })
        }

        const trialEndDate = () => {
            return (calculateAge(birthday) <= 27 && position === "Student" && serverOfferCodes.some((offer: any) => offer.offer_code === offerCode)) ? 6 : 3
        }

        // Check if inviteUserName exists
        let referralUser;
        if (inviteUserName) {
            const { data: inviteUserData, error: inviteUserError } = await supabase
                .from("users")
                .select("email, trial_end, current_period_end, subscription_status, subscription_id")
                .eq("username", inviteUserName)
                .single();

            if (inviteUserError || !inviteUserData) {
                return NextResponse.json({ error: "Invalid referral link." }, { status: 400 });
            }
            referralUser = inviteUserData;
        }

        const trialMonths = trialEndDate() + (referralUser?.email || 0);
        const trial_end = addMonthsToCurrentDate(trialMonths)

        const customers = await stripe.customers.list({
            email: email,
        })

        let customer;
        let subscription;

        if (customers.data.length === 0) {
            customer = await stripe.customers.create({
                email,
                name: (`${firstName} ${lastName}`).trim()
            })

            subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [
                    {
                        price: pricePro,
                    },
                ],
                trial_period_days: trialMonths * 30,
            });
        } else {
            customer = customers.data[0];
        }

        // Sign up the user with Supabase
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    birthday,
                    position,
                    offer_code: offerCode,
                    subscription_status: "PRO",
                    customer_id: customer.id,
                    subscription_id: subscription?.id || "",
                    plan_id: pricePro,
                    trial_end,
                    country,
                    title,
                    inviteUserName,
                    location
                },
                emailRedirectTo: redirectUrl,
            },
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // If the inviter is on a paid Pro Plan, extend their subscription end date
        if (referralUser?.email) {
            const now = new Date();
            const trialEndDate = new Date(referralUser.trial_end);
            const currentPeriodEndDate = new Date(referralUser.current_period_end);

            const isTrialEnded = trialEndDate < now
            const newEndDate = isTrialEnded ? currentPeriodEndDate : trialEndDate
            const updatedEndDate = new Date(newEndDate);
            updatedEndDate.setMonth(updatedEndDate.getMonth() + 1);

            const { error: updateInviteeError } = await supabase
                .from("users")
                .update({
                    trial_end: isTrialEnded ? null : updatedEndDate, // Set trial_end to null if they are already past trial
                    current_period_end: isTrialEnded ? updatedEndDate : null, // Update current_period_end
                })
                .eq("username", inviteUserName);

            if (updateInviteeError) {
                console.error("Error updating inviter's trial end date:", updateInviteeError);
            }

            const subscriptionId = referralUser.subscription_id; // Assuming you have this field

            if (subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                if (subscription.status === "active") {
                    const currentPeriodEnd = subscription.current_period_end;
                    const extendedAnchor = currentPeriodEnd + 30 * 24 * 60 * 60;

                    await stripe.subscriptions.update(subscriptionId, {
                        trial_end: extendedAnchor,
                        proration_behavior: "none"
                    });
                }
            }
        }
        return NextResponse.json({ message: "User registered successfully." }, { status: 200 });
    } catch (err) {
        console.error("Error during registration:", err);
        return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
    }
}
