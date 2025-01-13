import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const body = await req.json();
    const { status, id: session_id } = body; // Adjust fields based on Veriff's callback payload

    if (status === 'approved') {
      const { error } = await supabase
        .from('users') // Your Supabase table
        .update({ isVerified: true })
        .eq('session_id', session_id)

      // console.log(body);

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`);
      }
    }

    const { data, error } = await supabase
    .from('users') // Your Supabase table
    .select('*')
    .eq('session_id', session_id)
    .single();

    const subject = status === "approved" ? "You verified your identity" : "Your verification has been declined";

    send_email({ userData: data, subject });

    // return NextResponse.redirect('/dashboard/verification');
    return NextResponse.json({ message: 'Callback handled successfully' });
  } catch (error) {
    console.error('Error handling Veriff callback:', error);
    return NextResponse.json(
      { error: 'Failed to handle callback' },
      { status: 500 }
    );
  }
}

const send_email = async ({
  userData,
  subject
}: {
  userData: UserType;
  subject: string;
}) => {
  try {
    const userMail = await resend.emails.send({
      from: "Dentalbio <noreply@dental.bio",
      to: [userData.email!],
      subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{subject}</title>
      </head>

      <body
        style="background-color: #5046db; height: 100%; margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0"
          style="background-color: #5046db; margin: auto; padding-left: 10px; padding-right: 10px; width: 100%;">
          <tr>
            <td align="center" style="padding: 20px 0; width: 100%;">
              <table cellspacing="0" cellpadding="0" border="0"
                style="background-color: #fefefe; border-radius: 32px; max-width: 600px; width: 100%; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: 0 auto; table-layout: fixed;">
                <!-- Top Row with Logo -->
                <tr>
                  <td style="padding: 50px;">
                    <table cellspacing="0" cellpadding="0" border="0" style="width: auto; margin-left: auto;">
                      <tr>
                        <td style="text-align: right;">
                          <img src="https://cxqkuqtwrtgvoorxidvn.supabase.co/storage/v1/object/public/assets/logo%201.png"
                            alt="Dentalbio Logo" width="150"
                            style="display: block; border: 0; height: auto; line-height: 100%; outline: none;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Content Section -->
                <tr>
                  <td style="padding: 0 50px;">
                    <h1 style="font-size: 28px; font-weight: 300; color: #7646ff; line-height: 1.5; margin: 0;">
                      {subject}
                    </h1>
                    <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 50px 0 0 0;">
                      👋 Hello ${userData.first_name},
                    </p>
                    <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin: 20px 0;">
                      Your Dentalbio verification has been {status}.
                    </p>
                    {status === "approved" ?
                    <p
                      style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 20px 0; margin-top: 30px;">
                      You've completed an important part of establishing trust in our community. Now you will have
                      verification badge right of your name.
                    </p> :
                    <p
                      style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 20px 0; margin-top: 30px;">
                      Please try again to indentity your verification. You can make to ensure the authenticity of user
                      accounts, preventing impersonation, building trust among users by confirming identities.
                    </p>}
                    <!-- <a href="https://dentalbio-dev-v2.vercel.app/dashboard/verification"
                      style="font-size: 16px; font-weight: 300; color: #1c1c21; line-height: 1.7; margin-top: 30px; padding: 12px; border-radius: 26px;">
                      Visit Verification
                    </a> -->
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 0 50px; text-align: left; padding-bottom: 50px;">
                    <p style="font-size: 16px; color: #888888; margin-top: 30px;">
                      <span style="color: #5046db; font-weight: bold; line-height: 1.7;">Dentalbio</span><br />
                      <span style="color: #fd8516; line-height: 1.7; font-weight: 300;">Your dental identity,
                        simplified.</span>
                    </p>
                    <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 30px; line-height: 1.7;">
                      You received this email because a Dentalbio account was created with this email.
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
    })
  } catch (e) {

  }
}