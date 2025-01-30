// app/location/page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MapLoader from "./MapLoader";
import ManageLocations from "./ManageLocations";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";

// Utility function to fetch authenticated user, user ID, and dentistry ID
async function fetchUserAndDentistry() {
  "use server";
  const supabase = createClient();

  const userId = await getEffectiveUserId({ targetUserId: AdminServer.getTargetUserId(), supabase });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role")
    .eq("id", userId)
    .single();

  // Fetch Dentistry ID
  const { data: dentistry, error: dentistryError } = await supabase
    .from("dentistries")
    .select("dentistry_id")
    .eq("user_id", userId)
    .single();
  if (dentistryError || !dentistry) {
    redirect("/error?message=dentistry_not_found");
  }

  return { userId, userData, dentistryId: dentistry.dentistry_id };
}

// Fetch existing location data
async function fetchLocation(dentistryId: string) {
  "use server";
  const supabase = createClient();

  const { data: dentistryLocation, error: joinError } = await supabase
    .from("dentistry_locations")
    .select("location_id")
    .eq("dentistry_id", dentistryId)

  if (joinError || !dentistryLocation) return null;

  const locationIdList = dentistryLocation.map((location) => location.location_id);

  const { data: locations, error: locationError } = await supabase
    .from("locations")
    .select("*")
    .in("location_id", locationIdList)

  return locationError ? null : locations;
}

// Save or update location data
async function updateLocation(locationData: LocationType, location_id: string) {
  "use server";
  const supabase = createClient();

  const { error: updateError } = await supabase
    .from("locations")
    .update(locationData)
    .eq("location_id", location_id);

  if (updateError) {
    redirect("/location?error=Error updating location");
  }
}

// Main component
export default async function Location() {
  const { userData, dentistryId } = await fetchUserAndDentistry();
  const locations = await fetchLocation(dentistryId);

  if (!userData)
    return redirect("/dashboard");

  const proAvailable = (userData.subscription_status === "PRO" || userData.subscription_status === "PREMIUM PRO");

  return (
    <div className="memberpanel-details-wrapper">
      {!proAvailable &&
        <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
          Upgrade your membership to use multiple location feature
        </div>}

      <MapLoader />
      <ManageLocations locations={locations} updateLocation={updateLocation} />
    </div>
  );
}
