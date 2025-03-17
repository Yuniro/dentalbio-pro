
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
  firstName: string;
  lastName: string;
  time: string;
  location: string;
}

export async function GET(req: Request) {
  // const {
  //   email,
  //   title,
  //   username,
  //   firstName,
  // }: EmailData = await req.json();

  const supabase = createClient();

  try {
    if (req.method !== 'GET') {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: users, error } = await supabase
      .from('users')
      .select('email, username, trial_end')
      .lte('trial_end', threeDaysFromNow.toISOString());

    if (error) {
      console.error('Error fetch users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }

    // for (const user of users) {
    //   // Send HTML email to the user
    //   const userEmail = await resend.emails.send({
    //     from: "Dentalbio <noreply@dental.bio>",
    //     to: [user.email],
    //     subject: `You have secured dental.bio/${user.username}!`,
    //     html: `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //       <head>
    //         <meta charset="UTF-8" />
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //         <title>${title}</title>
    //       </head>
    //       <body style="background-color: #5046db; height: 100%; margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif;">
    //         <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #5046db; margin: auto; padding-left: 10px; padding-right: 10px; width: 100%;">
    //           <tr>
    //             <td align="center" style="padding: 20px 0; width: 100%;">
    //               <table cellspacing="0" cellpadding="0" border="0" style="background-color: #fefefe; border-radius: 32px; max-width: 600px; width: 100%; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: 0 auto; table-layout: fixed;">
    //                 <!-- Top Row with Logo -->
    //                 <tr>
    //                   <td style="padding: 50px;">
    //                     <table cellspacing="0" cellpadding="0" border="0" style="width: auto; margin-left: auto;">
    //                       <tr>
    //                         <td style="text-align: right;">
    //                           <img src="https://cxqkuqtwrtgvoorxidvn.supabase.co/storage/v1/object/public/assets/logo%201.png" alt="Dentalbio Logo" width="150" style="display: block; border: 0; height: auto; line-height: 100%; outline: none;" />
    //                         </td>
    //                       </tr>
    //                     </table>
    //                   </td>
    //                 </tr>
    //                 <!-- Content Section -->
    //                 <tr>
    //                   <td style="padding: 0 50px;">
    //                     <h1 style="font-size: 28px; font-weight: 300; color: #7646ff; line-height: 1.5; margin: 0;">
    //                       Congratulations <br />
    //                       <span style="font-size: 28px; font-weight: bold; color: #5046db;">
    //                         dental.bio/<span style="color: #f1852f">${username}</span>
    //                       </span>
    //                       <br />
    //                       is yours 🎉
    //                     </h1>
    //                     <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 50px 0 0 0;">
    //                       👋 Hello ${firstName},
    //                     </p>
    //                     <p style="font-size: 16px; font-weight: 500; color: #1c1c21; line-height: 1.7; margin: 20px 0;">
    //                       Your Dentalbio username <span style="color: #f1852f">@${username}</span> registration has already been successful! 📣
    //                       You can start building your Dentalbio now!
    //                     </p>
    //                     <p style="font-size: 16px; font-weight: 300; color: #1c1c21; line-height: 1.7; margin-top: 30px;">
    //                       Website: <span style="font-weight: bold; color: #5046db;">dental.bio/<span style="color: #f1852f">${username}</span></span>
    //                     </p>
    //                     <p style="font-size: 16px; font-weight: 300; color: #1c1c21; line-height: 1.7; margin-top: -10px;">
    //                       Username: <span style="color: #f1852f">@${username}</span>
    //                     </p>
    //                     <p style="font-size: 16px; font-weight: 400; color: #1c1c21; line-height: 1.7; margin: 20px 0; margin-top: 30px;">
    //                       Have a good day!
    //                     </p>
    //                   </td>
    //                 </tr>
    //                 <!-- Footer -->
    //                 <tr>
    //                   <td style="padding: 0 50px; text-align: left; padding-bottom: 50px;">
    //                     <p style="font-size: 16px; color: #888888; margin-top: 30px;">
    //                       <span style="color: #5046db; font-weight: bold; line-height: 1.7;">Dentalbio</span><br />
    //                       <span style="color: #fd8516; line-height: 1.7; font-weight: 300;">Your dental identity, simplified.</span>
    //                     </p>
    //                     <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 30px; line-height: 1.7;">
    //                       You received this email because a Dentalbio account was created with this email.
    //                     </p>
    //                     <p style="color: #1c1c21; opacity: 40%; font-size: 12px; margin-top: 14px; line-height: 1.7;">
    //                       Biocloud Ltd, 113 Crawford Street, London, W1H 2JG
    //                     </p>
    //                   </td>
    //                 </tr>
    //               </table>
    //             </td>
    //           </tr>
    //         </table>
    //       </body>
    //     </html>`,
    //   });
    // }
    console.log('-------------------------------+++++++++++++++===========-----------------cron-job.org', users)

    return NextResponse.json({ message: 'Emails sent=cron-job.org))))))))))))))))))))' },  { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}