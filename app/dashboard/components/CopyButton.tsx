"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";

const CopyButton = ({ link }: { link: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Get logged-in user's email and fetch their username
  const fetchUserInfo = async () => {
    const supabase = createClient();

    // Check if username is already in cookies
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      return; // No need to make another request if we already have it in cookies
    }

    // Fetch the logged-in user's email
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      console.error("Error fetching user:", authError);
      return;
    }

    const userEmail = authData.user.email;

    // Fetch the username from the `users` table using the email
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("email", userEmail)
      .single();

    if (userError || !userRecord) {
      console.error("Error fetching user info from users table:", userError);
      return;
    }

    const fetchedUsername = userRecord.username;

    // Store the username in cookies for future usage
    Cookies.set("username", fetchedUsername, { expires: 7 }); // Set cookie to expire in 7 days
    setUsername(fetchedUsername);
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dental.bio/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset copy message after 2 seconds
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-2 dentalbio-copy-wrapper">
      <p className="m-0 truncate transition-all">
        dental.bio/
        <span>{username ? `${username}` : "Loading..."}</span>
      </p>
      <button
        className="btn btn-outline-primary z-10  transition-all"
        onClick={handleCopy}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CopyButton;
