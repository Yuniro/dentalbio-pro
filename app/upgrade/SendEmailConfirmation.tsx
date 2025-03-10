"use client";
import { useEffect } from "react";
import { getUserLocation } from "@/utils/functions/getUserIp";

export default function SendEmailConfirmation({
  email,
  firstName,
  username,

  lastName,
  title,
  country,
  position,
}: {
  email: string;
  firstName: string;
  username: string;
  lastName: string;
  title: string;
  country: string;
  position: string;
}) {
  useEffect(() => {

    // Function to send the confirmation email
    async function sendConfirmationEmail() {
      // Get user time
      const now = new Date();
      const userTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      // Get user location
      const userLocation = await getUserLocation();

      // Send the confirmation email with time and location
      const emailData = {
        email,
        firstName,
        username,
        lastName,
        title,
        country,
        position,
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
        console.error("Error sending confirmation email");
      }
    }

    // Call the email sending function on mount
    sendConfirmationEmail();
  }, [email, firstName, username]);

  return null; // This component does not render any UI
}
