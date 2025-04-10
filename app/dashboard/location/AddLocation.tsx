'use client'
import { createClient } from "@/utils/supabase/client";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";
import { redirect, useSearchParams } from "next/navigation";
import { getDentistryInfo } from "@/utils/userInfo";
import { useEffect, useState } from "react";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import LabeledInput from "../components/LabeledInput"
import { showErrorToast } from "@/utils/Toast";
import { Subtitles } from "@phosphor-icons/react/dist/ssr"
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

type AddLocationProps = {
  onAddressAdd: (location: LocationType) => void;
  location_title: string;
}
const AddLocation: React.FC<AddLocationProps> = ({
  onAddressAdd,
  location_title
}) => {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const [address, setAddress] = useState<string>("");
  const [locationTitle, setLocationTitle] = useState<string>(location_title);
  const supabase = createClient();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fecthUserId = async () => {
      setUserId(await getEffectiveUserId({ targetUserId: targetUserId, supabase }));
    }

    fecthUserId();
  }, []);

  const SaveLocationTitle = async (formData: FormData) => {
    const location_title = formData.get("location_title");

    const { data: title, error: joinError } = await supabase
      .from("dentistries")
      .update({ location_title })
      .eq('user_id', userId)
      .select('*')
      .single();
  }

  // Save or update location data
  const saveLocation = async (formData: FormData) => {
    const dentistryData = await getDentistryInfo({ supabase, user_id: userId });
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
      .eq("id", userId)
      .single();

    const { data: dentistryLocation, error: joinError } = await supabase
      .from("dentistry_locations")
      .select("location_id")
      .eq("dentistry_id", dentistryData.dentistry_id)

    if (joinError || (dentistryLocation.length === 0) || (userRecord?.subscription_status === "PRO" || userRecord?.subscription_status === "PREMIUM PRO")) {
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
    } else {
      showErrorToast("You need to upgrade your membership to access the multiple location feature.")
    }
  }

  return (
    <div id="columns">
      <form action={SaveLocationTitle} className="mb-6 mt-10">
        <h2 className="text-lg font-semibold mb-3">Location Title</h2>
        <LabeledInput
          label="Location Title"
          defaultValue={locationTitle}
          name="location_title"
          onChange={(e) => setLocationTitle(e.target.value)}
          className="w-full text-base pl-7">
          <Subtitles
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
          />
        </LabeledInput>
        <FullRoundedButton type="submit" buttonType="primary" className="ml-auto"> Submit </FullRoundedButton>
      </form>
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