import React from "react";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import AddLinkGroupForm from "./components/AddLinkGroupForm";
import ManageLinkGroups from "./components/ManageLinkGroups";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";

// Fetch authenticated user ID
async function getUserId() {
  "use server";
  const supabase = createClient();
  
  return getEffectiveUserId({ targetUserId: AdminServer.getTargetUserId(), supabase });
}

// Fetch Dentistry ID based on user ID
async function getDentistryId(userId: string) {
  "use server";
  const supabase = createClient();
  const { data: dentistry, error } = await supabase
    .from("dentistries")
    .select("dentistry_id")
    .eq("user_id", userId)
    .single();

  if (error || !dentistry) {
    return redirect("/error?message=dentistry_not_found");
  }

  return dentistry.dentistry_id;
}

// Main page component
export default async function LinksPage() {
  const userId = await getUserId();
  const dentistryId = await getDentistryId(userId); // Fetch dentistry ID

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        <AddLinkGroupForm dentistryId={dentistryId} />
        <ManageLinkGroups dentistryId={dentistryId} />
      </div>
    </div>
  );
}
