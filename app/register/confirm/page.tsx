import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { getUserLocation } from "@/utils/functions/getUserIp";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export default async function ConfirmPage() {
  const supabase = createClient();

  // Get the session and user
  const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !sessionData?.user) {
    return redirect("/error?message=session_error");
  }

  const { user } = sessionData;

  // Extract user metadata
  const {
    title,
    username,
    first_name,
    last_name,
    position,
    country,
    inviteUserName,
    trial_end,
    email_verified,
  } = user.user_metadata;

  const email = user.email;

  if (!username || !email) {
    return redirect("/error?message=missing_data");
  }

  // Ensure that the user's email is verified
  if (!email_verified) {
    return redirect("/error?message=email_not_verified");
  }

  // Get user time and location server-side
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const userLocation = await getUserLocation();

  const trialEnd = new Date(trial_end);
  const today = new Date();

  // Calculate the difference in months
  const months = (trialEnd.getFullYear() - today.getFullYear()) * 12 + (trialEnd.getMonth() - today.getMonth());

  // Clamp to 0 if already expired
  const remainingMonths = Math.max(0, months);

  // Send the welcome email via API
  const emailData = {
    title,
    email,
    first_name,
    last_name,
    position,
    username,
    time,
    country: country || "Unknown",
    location: userLocation || "Unknown",
    trialMonths: remainingMonths,
    inviteUserName,
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

  // Redirect to the success page after email is successfully sent
  return redirect("/dashboard");
}