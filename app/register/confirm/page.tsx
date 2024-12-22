// "use client";
// import { useSearchParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import supabase from "@/app/lib/supabaseClient";
// import Link from "next/link";
// import Image from "next/image";

// export default function ConfirmPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // State variables to store user's time and location
//   const [userTime, setUserTime] = useState("");
//   const [userLocation, setUserLocation] = useState<any>(null); // Initialize as null

//   // Function to get user's time in the format "21:33 GMT"
//   function getUserTime() {
//     const now = new Date();
//     return now.toLocaleTimeString("en-GB", {
//       hour: "2-digit",
//       minute: "2-digit",
//       timeZoneName: "short",
//     });
//   }

//   // Function to get user's location using ipinfo.io and ENV for token
//   async function getUserLocation() {
//     try {
//       const response = await fetch(
//         `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
//       );
//       const data = await response.json();
//       return `${data.city}, ${data.region}, ${data.country}`;
//     } catch (error) {
//       console.error("Error fetching location:", error);
//       return "Unknown"; // Default to "Unknown" if location can't be fetched
//     }
//   }

//   // useEffect to fetch time and location on component mount
//   useEffect(() => {
//     // Set the user time immediately
//     const time = getUserTime();
//     setUserTime(time);

//     // Fetch the user's location
//     async function fetchLocation() {
//       const location = await getUserLocation();
//       setUserLocation(location); // This will trigger a re-render when the location is fetched
//     }

//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     const confirmEmail = async () => {
//       // Wait until both the time and location are available before proceeding
//       if (!userTime || !userLocation) {
//         return;
//       }

//       setLoading(true);

//       // Fetch the session using getSession
//       const { data, error: sessionError } = await supabase.auth.getSession();

//       if (sessionError || !data.session) {
//         setErrorMessage("Failed to fetch session.");
//         setLoading(false);
//         return;
//       }

//       const { user } = data.session;

//       if (!user) {
//         setErrorMessage("Unable to retrieve user information.");
//         setLoading(false);
//         return;
//       }

//       // Extract all relevant fields from user_metadata
//       const { username, first_name, last_name, title, country, position } =
//         user.user_metadata;
//       const email = user.email;

//       try {
//         // Check if the user already exists in your custom `users` table
//         const { data: existingUser, error: checkError } = await supabase
//           .from("users")
//           .select("id")
//           .or(`email.eq.${email},username.eq.${username}`)
//           .single();

//         if (checkError && checkError.code !== "PGRST116") {
//           setErrorMessage("An error occurred while checking user data.");
//           setLoading(false);
//           return;
//         }

//         if (existingUser) {
//           setErrorMessage("A user with this email or username already exists.");
//           setLoading(false);
//           return;
//         }

//         // Insert the user into your custom `users` table with all fields
//         const { error: insertError } = await supabase.from("users").insert({
//           username,
//           email,
//           first_name,
//           last_name,
//           title,
//           country,
//           position,
//         });

//         if (insertError) {
//           console.error("Insert error:", insertError);
//           setErrorMessage("There was an issue saving your data.");
//           setLoading(false);
//           return;
//         }

//         // Send the welcome email via API
//         const emailData = {
//           email,
//           firstName: first_name,
//           username,
//           time: userTime,
//           location: userLocation || "Unknown",
//         };

//         await fetch("/api/send", {
//           method: "post",
//           body: JSON.stringify(emailData),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         // Redirect to the success page after email
//         router.push("/success");
//       } catch (err) {
//         console.error("Unexpected error:", err);
//         setErrorMessage("An unexpected error occurred.");
//         setLoading(false);
//       }
//     };

//     confirmEmail();
//   }, [searchParams, router, userTime, userLocation]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl">Completing your registration...</h1>

//       {loading && <p>Loading...</p>}
//       <Link href={"/"} target="_blank" className="mt-5">
//         <Image
//           src="/logo.svg"
//           width={150}
//           height={40}
//           alt="Footer logo"
//           className="mb-10 mt-20"
//         />
//       </Link>
//     </div>
//   );
// }

import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";


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
    title,
    country,
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
      method: "post",
      body: JSON.stringify(emailData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!emailResponse.ok) {
      return redirect("/error?message=email_error");
    }

    // Redirect to the success page after email is successfully sent
    return redirect("/success");
  } catch (err) {
    console.error("Unexpected error:", err);
    return redirect("/error?message=unexpected_error");
  }
}

// Helper function to get user's location using ipinfo.io
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
