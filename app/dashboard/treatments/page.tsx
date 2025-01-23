import React from "react";
import { createClient } from "@/utils/supabase/server";
import AddTreatmentForm from "./AddTreatment";
import ManageTreatments from "./ManageTreatments";
import { redirect } from "next/navigation";
import ManageServices from "./ManageServices";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";

// Fetch authenticated user ID
async function getUserId() {
  "use server";
  const supabase = createClient();

  const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

  if (!userId) {
    return redirect("/error?message=user_not_found");
  }

  return userId;
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
export default async function TreatmentsPage() {
  const userId = await getUserId();
  const dentistryId = await getDentistryId(userId); // Fetch dentistry ID

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        {/* Pass the dentistryId to client-side components */}
        <AddTreatmentForm dentistryId={dentistryId} />
        <ManageTreatments dentistryId={dentistryId} />
        <ManageServices dentistryId={dentistryId} />
      </div>
    </div>
  );
}
