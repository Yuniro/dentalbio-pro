"use client";
import { useEffect } from "react";

export default function SendEmailConfirmation({
  email,
  firstName,
  username,
  birthday,
  offer_code,
  lastName,
  title,
  country,
  position,
}: {
  email: string;
  firstName: string;
  username: string;
  birthday: Date;
  offer_code: string;
  lastName: string;
  title: string;
  country: string;
  position: string;
}) {
  useEffect(() => {
    // Function to get user's location using ipinfo.io
    async function getUserLocation() {
      try {
        const response = await fetch(
          `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
        );
        const data = await response.json();
        return `${data.city}, ${data.region}, ${data.country}`;
      } catch (error) {
        console.error("Error fetching location:", error);
        return "Unknown"; // Default to "Unknown" if location can't be fetched
      }
    }

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
        birthday,
        offer_code,
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
