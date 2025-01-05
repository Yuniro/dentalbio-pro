// app/location/page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MapLoader from "./MapLoader";
import ManageLocations from "./ManageLocations";

// Utility function to fetch authenticated user, user ID, and dentistry ID
async function fetchUserAndDentistry() {
  "use server";
  const supabase = createClient();

  // Fetch authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    redirect("/login?error=User authentication failed, redirecting to login.");
  }

  const userEmail = userData.user.email;

  // Fetch user ID
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();
  if (userError || !userRecord) {
    redirect("/error?message=user_not_found_in_users_table");
  }

  const userId = userRecord.id;

  // Fetch Dentistry ID
  const { data: dentistry, error: dentistryError } = await supabase
    .from("dentistries")
    .select("dentistry_id")
    .eq("user_id", userId)
    .single();
  if (dentistryError || !dentistry) {
    redirect("/error?message=dentistry_not_found");
  }

  return { userId, dentistryId: dentistry.dentistry_id };
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
  const { dentistryId } = await fetchUserAndDentistry();
  const locations = await fetchLocation(dentistryId);

  return (
    <div className="memberpanel-details-wrapper">
      <MapLoader />
      <ManageLocations locations={locations} updateLocation={updateLocation} />
    </div>
  );
}
