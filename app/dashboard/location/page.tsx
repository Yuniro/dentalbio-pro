// app/location/page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SaveButton from "../components/SaveButton"; // Your existing SaveButton
import AddressAutocomplete from "./MapboxMapAutocomplete";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";

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
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !userRecord) {
    return redirect("/error?message=user_not_found_in_users_table");
  }

  return userRecord.id; // The correct user ID from the users table
}

// Fetch the Dentistry ID (assuming it's already created)
async function getDentistryId(userId: string) {
  "use server";
  const supabase = createClient();

  // Fetch the existing dentistry associated with the user
  const { data: dentistry, error } = await supabase
    .from("dentistries")
    .select("dentistry_id")
    .eq("user_id", userId)
    .single();

  if (!dentistry || error) {
    return redirect("/error?message=dentistry_not_found");
  }

  return dentistry.dentistry_id;
}

// Fetch or update the existing Location for the Dentistry
async function getLocation(dentistryId: string) {
  "use server";
  const supabase = createClient();

  // Fetch location_id from the dentistry_locations join table using dentistry_id
  const { data: dentistryLocation, error: joinTableError } = await supabase
    .from("dentistry_locations")
    .select("location_id")
    .eq("dentistry_id", dentistryId)
    .single();

  if (joinTableError || !dentistryLocation) {
    return null; // No location linked yet
  }

  const locationId = dentistryLocation.location_id;

  // Fetch the actual location data from the locations table using the location_id
  const { data: location, error: locationError } = await supabase
    .from("locations")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (locationError || !location) {
    return null; // Return null if no location exists
  }

  return location; // Return the existing location data
}

// Server Action to update or create the Location for the Dentistry
async function saveLocation(formData: FormData) {
  "use server";
  const supabase = createClient();
  const userId = await getUserId();
  const dentistryId = await getDentistryId(userId); // Fetch existing dentistry

  // Prepare the new location data
  const newLocation = {
    full_address: formData.get("full_address") as string,
    city: formData.get("city") as string,
    latitude: parseFloat(formData.get("latitude") as string),
    longitude: parseFloat(formData.get("longitude") as string),
  };

  // Check if a location is already linked to the dentistry
  const { data: dentistryLocation, error: joinTableError } = await supabase
    .from("dentistry_locations")
    .select("location_id")
    .eq("dentistry_id", dentistryId)
    .single();

  if (joinTableError || !dentistryLocation) {
    // If no location exists, create a new location and link it
    const { data: insertedLocation, error: insertLocationError } =
      await supabase
        .from("locations")
        .insert([newLocation])
        .select("location_id")
        .single();

    if (insertLocationError) {
      return redirect("/location?error=Failed to create location");
    }

    // Link the new location to the dentistry in the dentistry_locations join table
    const { error: dentistryLocationError } = await supabase
      .from("dentistry_locations")
      .insert([
        {
          dentistry_id: dentistryId,
          location_id: insertedLocation.location_id,
        },
      ]);

    if (dentistryLocationError) {
      return redirect("/location?error=Failed to link location to dentistry");
    }

    return; // Return without redirecting (success is handled by the SaveButton)
  } else {
    // If a location already exists, update it
    const locationId = dentistryLocation.location_id;
    const { error: updateLocationError } = await supabase
      .from("locations")
      .update(newLocation)
      .eq("location_id", locationId);

    if (updateLocationError) {
      return redirect("/location?error=Error updating location");
    }

    return; // Return without redirecting (success is handled by the SaveButton)
  }
}

// Main component to display and manage the location data
export default async function Location() {
  const userId = await getUserId();
  const dentistryId = await getDentistryId(userId); // Get the Dentistry ID
  const location = await getLocation(dentistryId); // Fetch existing location, if any

  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        <form action={saveLocation} method="post" className="mb-6 mt-10">
          <h2 className="text-lg font-semibold mb-3">Location</h2>
          {/* <AddressAutocomplete defaultAddress={location?.full_address || ""} /> */}
          <GoogleMapAutocomplete defaultAddress={location?.full_address || ""} />    

          {/* Removed manual input fields */}

          <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
}
