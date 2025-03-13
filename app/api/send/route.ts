import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
    email: string;
    title: string;
    country: string;
    position: string;
    username: string;
    first_name: string;
    last_name: string;
    time: string;
    location: string;
    trialMonths: number;
    inviteUserName: string | null;
}

export async function POST(req: Request) {
    const {
        email,
        title,
        country,
        position,
        username,
        first_name,
        last_name,
        time,
        location,
        trialMonths,
        inviteUserName
    }: EmailData = await req.json();

    const supabase = createClient();

    try {
        // Send HTML email to the user
        const userEmail = await resend.emails.send({
            from: "Dentalbio <noreply@dental.bio>",
            to: [email],
            subject: `You have secured dental.bio/${username}!`,
            html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to Dentalbio - Enjoy 3 Months of Pro & Secure Your Username!</title>
            <style>
                body {
                    background-color: #5046db;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #5046db; margin: auto; padding-left: 10px; padding-right: 10px;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table cellspacing="0" cellpadding="0" border="0" style="background-color: #fefefe; border-radius: 32px; max-width: 600px; width: 100%; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: 0 auto; table-layout: fixed;">
                            <tr>
                                <td style="padding: 50px; text-align: center;">
                                    <img src="https://cxqkuqtwrtgvoorxidvn.supabase.co/storage/v1/object/public/assets/logo%201.png" alt="Dentalbio Logo" width="150" style="display: block; border: 0; height: auto; line-height: 100%; outline: none; margin: 0 auto;" />
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 50px; text-align: center;">
                                    <h1 style="font-size: 28px; font-weight: 300; color: #7646ff; line-height: 1.5; margin: 0;">
                                        Welcome to Dentalbio! 🎉
                                    </h1>
                                    <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 50px 0 0 0;">
                                        Hello <b>${first_name} ${last_name}</b>,
                                    </p>
                                    <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin: 20px 0;">
                                        Your registration was successful! 🚀 You have secured your Dentalbio username:
                                    </p>
                                    <h2 style="font-size: 24px; font-weight: bold; color: #5046db; margin: 10px 0;">
                                        dental.bio/<span style="color: #f1852f">${username}</span>
                                    </h2>
                                    <p style="font-size: 16px; font-weight: 300; color: #1c1c21; line-height: 1.7;">
                                        Username: <span style="color: #f1852f">@${username}</span>
                                    </p>
                                    <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin-top: 20px;">
                                        As a welcome gift, you're getting <b>${trialMonths} months of Pro Plan for FREE!</b> 🎁
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 50px; text-align: center; padding-bottom: 50px;">
                                    <p style="font-size: 16px; color: #888888; margin-top: 30px;">
                                        <span style="color: #5046db; font-weight: bold; line-height: 1.7;">Dentalbio</span><br />
                                        <span style="color: #fd8516; line-height: 1.7; font-weight: 300;">Your dental identity, simplified.</span>
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
        </html>`,
        });

        console.log(inviteUserName, 'inviteUserName-----------')

        // if (inviteUserName) {
        //     const { data: inviteUserEmail, error: emailCheckError } = await supabase
        //     .from("users")
        //     .select("email")
        //     .eq("username", inviteUserName)
        //     .single();

        //     console.log(inviteUserEmail, 'testdata----------------')

        //     if (inviteUserEmail) {
        //         const sendToInviteUser = await resend.emails.send({
        //             from: "Dentalbio <noreply@dental.bio>",
        //             to: inviteUserEmail,
        //             subject: "You're invited to join Dentalbio!",
        //             html: `
        //         <!DOCTYPE html>
        //         <html lang="en">
        //         <head>
        //         <meta charset="UTF-8" />
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //                     <title>Referral Sign-up Confirmation!</title>
        //                     <style>
        //                     /* Button Styles */
        //                         .btn {
        //                             background-color: #5046db;
        //                             color: white!important;
        //                             padding: 14px 24px;
        //                             font-size: 16px;
        //                             font-weight: 600;
        //                             border-radius: 8px;
        //                             text-decoration: none;
        //                             display: inline-block;
        //                             margin-top: 30px;
        //                         }
        //                         .btn:hover {
        //                             background-color: #3e3bb1;
        //                         }
        //                     </style>
        //                 </head>
        //                 <body style="background-color: #5046db; height: 100%; margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif;">
        //                 <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #5046db; margin: auto; padding-left: 10px; padding-right: 10px; width: 100%;">
        //                         <tr>
        //                         <td align="center" style="padding: 20px 0; width: 100%;">
        //                         <table cellspacing="0" cellpadding="0" border="0" style="background-color: #fefefe; border-radius: 32px; max-width: 600px; width: 100%; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: 0 auto; table-layout: fixed;">
        //                         <!-- Top Row with Logo -->
        //                                     <tr>
        //                                         <td style="padding: 50px;">
        //                                         <table cellspacing="0" cellpadding="0" border="0" style="width: auto; margin-left: auto;">
        //                                         <tr>
        //                                         <td style="text-align: right;">
        //                                                         <img src="https://cxqkuqtwrtgvoorxidvn.supabase.co/storage/v1/object/public/assets/logo%201.png" alt="Dentalbio Logo" width="150" style="display: block; border: 0; height: auto; line-height: 100%; outline: none;" />
        //                                                         </td>
        //                                                 </tr>
        //                                                 </table>
        //                                                 </td>
        //                                                 </tr>
        //                                                 <!-- Content Section -->
        //                                                 <tr>
        //                                                 <td style="padding: 0 50px;">
        //                                                 <h1 style="font-size: 28px; font-weight: 300; color: #7646ff; line-height: 1.5; margin: 0;">
        //                                                 Great News! 🎉
        //                                             </h1>
        //                                             <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 50px 0 0 0;">
        //                                                 👋 Hey there!
        //                                             </p>
        //                                             <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin: 20px 0;">
        //                                                 We wanted to let you know that someone has just signed up using your referral link! 🙌
        //                                                 <br /><br />
        //                                                 Your referral is now part of the <b>Dentalbio</b> community, and you both get to enjoy the benefits of creating your personal dental identity.
        //                                             </p>
                        
        //                                             <!-- Pro Plan Feature -->
        //                                             <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin-top: 30px;">
        //                                                 🎁 <b>Special Offer</b>: Your referral also receives 1 month of Pro Plan features for free! You're both getting the most out of your Dentalbio experience. 😎
        //                                             </p>
                        
        //                                             <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 20px 0; margin-top: 30px;">
        //                                                 Thanks for sharing Dentalbio, and we can't wait to see the amazing dental journeys you and your invitees will build together!
        //                                             </p>
        //                                             </td>
        //                                     </tr>
        //                                     <!-- Footer -->
        //                                     <tr>
        //                                         <td style="padding: 0 50px; text-align: left; padding-bottom: 50px;">
        //                                             <p style="font-size: 16px; color: #888888; margin-top: 30px;">
        //                                             <span style="color: #5046db; font-weight: bold; line-height: 1.7;">Dentalbio</span><br />
        //                                                 <span style="color: #fd8516; line-height: 1.7; font-weight: 300;">Your dental identity, simplified.</span>
        //                                             </p>
        //                                             <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 30px; line-height: 1.7;">
        //                                                 You received this email because someone used your referral link to sign up for a Dentalbio account.
        //                                             </p>
        //                                             <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 14px; line-height: 1.7;">
        //                                                 Biocloud Ltd, 113 Crawford Street, London, W1H 2JG
        //                                             </p>
        //                                         </td>
        //                                     </tr>
        //                                 </table>
        //                             </td>
        //                         </tr>
        //                     </table>
        //                 </body>
        //                 </html>
        //                 `,
        //         });
        //     }
        // }

        // Send a plain text email to the admin
        const adminEmail = await resend.emails.send({
            from: "Dentalbio <noreply@dental.bio>",
            to: ["shaz@dental.bio"], // Multiple recipients
            subject: `dental.bio/${username} signed up!`,
            text: `A new user has signed up on Dentalbio. 
            
            Title: ${title ? title : ""}
            First Name: ${first_name ? first_name : ""}
            Last Name: ${last_name ? last_name : ""}
            Position: ${position ? position : ""}
            Country: ${country ? country : ""}

            Username: @${username ? username : ""}
            Email: ${email ? email : ""}
            
            
            Registered at: ${time ? time : ""}
            Registered from: ${location ? location : ""}

            `,
        });

        return NextResponse.json({ success: true, userEmail, adminEmail });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
