import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { getUserLocation } from "@/utils/functions/getUserIp";

export default async function ConfirmPage() {
  const supabase = createClient();

  // Get the session and user
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    return redirect("/error?message=session_error");
  }

  const { user } = sessionData.session;

  if (!user) {
    return redirect("/error?message=user_error");
  }

  // Extract user metadata
  const {
    username,
    first_name,
    last_name,
    birthday,
    title,
    country,
    offer_code,
    position,
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
  const userTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const userLocation = await getUserLocation();

  try {
    // Check if the user already exists in your custom `users` table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return redirect("/error?message=check_error");
    }

    if (existingUser) {
      return redirect("/error?message=user_exists");
    }

    // Insert the user into your custom `users` table
    const { error: insertError } = await supabase.from("users").insert({
      username,
      email,
      first_name,
      last_name,
      title,
      birthday,
      offer_code,
      country,
      position,
      time_registered: userTime,
      location_registered: userLocation,
    });

    if (insertError) {
      return redirect(`/error?message=insert_error&details=${insertError.message}`);
    }

    // Send the welcome email via API
    const emailData = {
      email,
      firstName: first_name,
      username,
      time: userTime,
      location: userLocation || "Unknown",
    };

    const emailResponse = await fetch("/api/send", {
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
  } catch (err) {
    console.error("Unexpected error:", err);
    return redirect("/error?message=unexpected_error");
  }
}