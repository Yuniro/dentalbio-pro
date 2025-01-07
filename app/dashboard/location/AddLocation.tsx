'use client'
import { createClient } from "@/utils/supabase/client";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";
import { redirect } from "next/navigation";
import { getDentistryInfo, getUserInfo } from "@/utils/userInfo";
import { useState } from "react";

type AddLocationProps = {
  onAddressAdd: (location: LocationType) => void;
}
const AddLocation: React.FC<AddLocationProps> = ({
  onAddressAdd
}) => {
  const [address, setAddress] = useState<string>("");

  // Save or update location data
  const saveLocation = async (formData: FormData) => {
    const supabase = createClient();
    const userData = await getUserInfo({ supabase });
    const dentistryData = await getDentistryInfo({ supabase, user_id: userData.id });

    const newLocation = {
      full_address: formData.get("full_address") as string,
      country: formData.get("country") as string,
      city: formData.get("city-full_address") as string,
      area: formData.get("area") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
    };

    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("username, subscription_status, first_name")
      .eq("id", userData.id)
      .single();

    const { data: dentistryLocation, error: joinError } = await supabase
      .from("dentistry_locations")
      .select("location_id")
      .eq("dentistry_id", dentistryData.dentistry_id)

    if (joinError || (dentistryLocation.length === 0) || (userRecord?.subscription_status === "pro")) {
      const { data: insertedLocation, error: insertError } = await supabase
        .from("locations")
        .insert([newLocation])
        .select("location_id")
        .single();

      if (insertError) {
        redirect("/location?error=Failed to create location");
      }

      const { error: linkError } = await supabase
        .from("dentistry_locations")
        .insert([{ dentistry_id: dentistryData.dentistry_id, location_id: insertedLocation.location_id }]);

      if (linkError) {
        redirect("/location?error=Failed to link location to dentistry");
      }

      onAddressAdd({ ...newLocation, location_id: insertedLocation.location_id });
      setAddress("");
    }
  }

  return (
    <div id="columns">
      <form action={saveLocation} className="mb-6 mt-10">
        <h2 className="text-lg font-semibold mb-3">Location</h2>
        <GoogleMapAutocomplete defaultAddress={address} id="full_address" />
        {/* <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div> */}
      </form>
    </div>
  )
}

export default AddLocation;