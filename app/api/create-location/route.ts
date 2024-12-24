import stripe from "@/app/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Utility function to fetch authenticated user, user ID, and dentistry ID
async function fetchUserAndDentistry() {
  "use server";
  const supabase = createClient();

  // Fetch authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    NextResponse.redirect("/login?error=User authentication failed, NextResponse.redirecting to login.");
  }

  const userEmail = userData.user?.email;

  // Fetch user ID
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();
  if (userError || !userRecord) {
    NextResponse.redirect("/error?message=user_not_found_in_users_table");
  }

  const userId = userRecord?.id;

  // Fetch Dentistry ID
  const { data: dentistry, error: dentistryError } = await supabase
    .from("dentistries")
    .select("dentistry_id")
    .eq("user_id", userId)
    .single();
  if (dentistryError || !dentistry) {
    NextResponse.redirect("/error?message=dentistry_not_found");
  }

  return { userId, dentistryId: dentistry?.dentistry_id };
}

export async function POST(req: Request) {
  const { full_address, city, latitude, longitude } = await req.json();

  try {
    const supabase = createClient();
    const { userId, dentistryId } = await fetchUserAndDentistry();

    const newLocation = {
      full_address,
      city,
      latitude,
      longitude,
    };

    const { data: dentistryLocation, error: joinError } = await supabase
      .from("dentistry_locations")
      .select("location_id")
      .eq("dentistry_id", dentistryId)
      .single();

    if (joinError || !dentistryLocation) {
      const { data: insertedLocation, error: insertError } = await supabase
        .from("locations")
        .insert([newLocation])
        .select("location_id")
        .single();

      if (insertError) {
        NextResponse.redirect("/location?error=Failed to create location");
      }

      const { error: linkError } = await supabase
        .from("dentistry_locations")
        .insert([{ dentistry_id: dentistryId, location_id: insertedLocation?.location_id }]);

      if (linkError) {
        NextResponse.redirect("/location?error=Failed to link location to dentistry");
      }
    } else {
      const { data: userRecord, error: userError } = await supabase
        .from("users")
        .select("username, subscription_status, first_name")
        .eq("id", userId)
        .single();

      if (userRecord?.subscription_status === "trialing" || !userRecord?.subscription_status) {
        console.log("You are using the free")
        return "Free version for now";
      }

      const { error: updateError } = await supabase
        .from("locations")
        .update(newLocation)
        .eq("location_id", dentistryLocation.location_id);

      if (updateError) {
        NextResponse.redirect("/location?error=Error updating location");
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
