import React from "react";
import CopyButton from "./CopyButton";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import RightPanelClient from "./RightPanelClient";

// Fetch the authenticated user ID
async function getUserId() {
  "use server";
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return redirect(
      "/login?error=User authentication failed, redirecting to login."
    );
  }

  const userEmail = userData.user.email;

  // Fetch the correct user_id from the users table based on the email
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("email", userEmail)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=user_not_found_in_users_table");
  }

  return userRecord.username; // The correct user ID from the users table
}

const RightPanel = async () => {
  const username = await getUserId();

  // Define a server-side refresh function that revalidates a specific path

  return (
    <>
      <div className="col-xl-3 col-12 mb-3">
        <CopyButton link={username} />
        <RightPanelClient username={username} />
      </div>
    </>
  );
};

export default RightPanel;
