import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        inviteUserId,
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
        const serverOfferCode = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: "Can't get offerCode from the admin" }, { status: 400 })
        }

        const trialEndDate = (referralMonths: number) => {
            return (calculateAge(birthday) <= 27 && position === "Student" && offerCode === serverOfferCode.value) ? addMonthsToCurrentDate(6 + referralMonths) : addMonthsToCurrentDate(3 + referralMonths)
        }

        // Check if inviteUserId exists
        let referralUser;
        if (inviteUserId) {
            const { data: inviteUserData, error: inviteUserError } = await supabase
                .from("users")
                .select("email, trial_end, current_period_end")
                .eq("id", inviteUserId)
                .single();

            if (inviteUserError || !inviteUserData) {
                return NextResponse.json({ error: "Invalid referral link." }, { status: 400 });
            }
            referralUser = inviteUserData;
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
                    trial_end: referralUser?.email ? trialEndDate(1) : trialEndDate(0),
                    country,
                    title,
                },
                emailRedirectTo: redirectUrl,
            },
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

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
                .eq("id", inviteUserId);

            if (updateInviteeError) {
                console.error("Error updating inviter's trial end date:", updateInviteeError);
            }

            await resend.emails.send({
                from: "Dentalbio <noreply@dental.bio>",
                to: referralUser.email,
                subject: "You're invited to join Dentalbio!",
                html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Referral Sign-up Confirmation!</title>
                            <style>
                                /* Button Styles */
                                .btn {
                                    background-color: #5046db;
                                    color: white!important;
                                    padding: 14px 24px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    border-radius: 8px;
                                    text-decoration: none;
                                    display: inline-block;
                                    margin-top: 30px;
                                }
                                .btn:hover {
                                    background-color: #3e3bb1;
                                }
                            </style>
                        </head>
                        <body style="background-color: #5046db; height: 100%; margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #5046db; margin: auto; padding-left: 10px; padding-right: 10px; width: 100%;">
                                <tr>
                                    <td align="center" style="padding: 20px 0; width: 100%;">
                                        <table cellspacing="0" cellpadding="0" border="0" style="background-color: #fefefe; border-radius: 32px; max-width: 600px; width: 100%; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: 0 auto; table-layout: fixed;">
                                            <!-- Top Row with Logo -->
                                            <tr>
                                                <td style="padding: 50px;">
                                                    <table cellspacing="0" cellpadding="0" border="0" style="width: auto; margin-left: auto;">
                                                        <tr>
                                                            <td style="text-align: right;">
                                                                <img src="https://cxqkuqtwrtgvoorxidvn.supabase.co/storage/v1/object/public/assets/logo%201.png" alt="Dentalbio Logo" width="150" style="display: block; border: 0; height: auto; line-height: 100%; outline: none;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Content Section -->
                                            <tr>
                                                <td style="padding: 0 50px;">
                                                    <h1 style="font-size: 28px; font-weight: 300; color: #7646ff; line-height: 1.5; margin: 0;">
                                                        Great News! 🎉
                                                    </h1>
                                                    <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 50px 0 0 0;">
                                                        👋 Hey there!
                                                    </p>
                                                    <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin: 20px 0;">
                                                        We wanted to let you know that someone has just signed up using your referral link! 🙌
                                                        <br /><br />
                                                        Your referral is now part of the <b>Dentalbio</b> community, and you both get to enjoy the benefits of creating your personal dental identity.
                                                    </p>
                        
                                                    <!-- Pro Plan Feature -->
                                                    <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin-top: 30px;">
                                                        🎁 <b>Special Offer</b>: Your referral also receives 1 month of Pro Plan features for free! You’re both getting the most out of your Dentalbio experience. 😎
                                                    </p>
                        
                                                    <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 20px 0; margin-top: 30px;">
                                                        Thanks for sharing Dentalbio, and we can't wait to see the amazing dental journeys you and your invitees will build together!
                                                    </p>
                                                </td>
                                            </tr>
                                            <!-- Footer -->
                                            <tr>
                                                <td style="padding: 0 50px; text-align: left; padding-bottom: 50px;">
                                                    <p style="font-size: 16px; color: #888888; margin-top: 30px;">
                                                        <span style="color: #5046db; font-weight: bold; line-height: 1.7;">Dentalbio</span><br />
                                                        <span style="color: #fd8516; line-height: 1.7; font-weight: 300;">Your dental identity, simplified.</span>
                                                    </p>
                                                    <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 30px; line-height: 1.7;">
                                                        You received this email because someone used your referral link to sign up for a Dentalbio account.
                                                    </p>
                                                    <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 14px; line-height: 1.7;">
                                                        Biocloud Ltd, 113 Crawford Street, London, W1H 2JG
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `,
            });
        }

        return NextResponse.json({ message: "User registered successfully." }, { status: 200 });
    } catch (err) {
        console.error("Error during registration:", err);
        return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
    }
}
