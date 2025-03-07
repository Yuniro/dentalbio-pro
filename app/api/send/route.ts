import { Resend } from "resend";
import { NextResponse } from "next/server";

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  email: string;
  title: string;
  country: string;
  position: string;
  username: string;
  firstName: string;
  lastName: string;
  time: string;
  location: string;
  trialMonths: number;
}

export async function POST(req: Request) {
  const {
    email,
    title,
    country,
    position,
    username,
    firstName,
    lastName,
    time,
    location,
    trialMonths
  }: EmailData = await req.json();

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
                                        Hello <b>${firstName} ${lastName}</b>,
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

    // Send a plain text email to the admin
    const adminEmail = await resend.emails.send({
      from: "Dentalbio <noreply@dental.bio>",
      to: ["shaz@dental.bio"], // Multiple recipients
      subject: `dental.bio/${username} signed up!`,
      text: `A new user has signed up on Dentalbio. 
            
            Title: ${title ? title : ""}
            First Name: ${firstName ? firstName : ""}
            Last Name: ${lastName ? lastName : ""}
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
