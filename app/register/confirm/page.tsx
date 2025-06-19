import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { getUserLocation } from "@/utils/functions/getUserIp";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function ConfirmPage() {
  const supabase = createClient();

  // Get the session and user
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  console.log(sessionData, sessionError)

  if (sessionError || !sessionData?.session) {
    return redirect("/error?message=session_error");
  }

  const { user } = sessionData.session;

  if (!user) {
    return redirect("/error?message=user_error");
  }

  const email = user.email;

  if (!email) {
    return redirect("/error?message=missing_data");
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  const {
    username,
    title,
    country,
    position,
    first_name,
    last_name,
    trial_end,
    created_at
  } = userData;

  const { inviteUserName, email_verified } = user.user_metadata;

  // Ensure that the user's email is verified
  if (!email_verified) {
    return redirect("/error?message=email_not_verified");
  }

  // Get user time and location server-side
  const now = new Date();
  const userTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Calculate trialMonths as the difference in months between today and trial_end
  let trialMonths = 0;
  if (trial_end) {
    const today = new Date();
    const end = new Date(trial_end);
    trialMonths = (end.getFullYear() - today.getFullYear()) * 12 + (end.getMonth() - today.getMonth());
    if (end.getDate() < today.getDate()) trialMonths--;
    if (trialMonths < 0) trialMonths = 0;
  }

  const userLocation = await getUserLocation();

  try {
    // Send the welcome email via API
    const emailData = {
      email,
      title,
      country,
      position,
      username,
      first_name,
      last_name,
      location: userLocation || "Unkown",
      trialMonths,
      time: created_at,
      inviteUserName
    };

    const emailResponse = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      body: JSON.stringify(emailData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!emailResponse.ok) {
      return redirect("/error?message=email_error");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return redirect("/error?message=unexpected_error");
  }

  // Redirect to the success page after email is successfully sent
  return redirect("/dashboard");
}