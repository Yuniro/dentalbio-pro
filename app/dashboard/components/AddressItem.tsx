'use client'
import { NotePencil, X } from "@phosphor-icons/react/dist/ssr";
import React, { useReducer, useState } from "react";
import GoogleMapAutocomplete from "../location/GoogleMapAutocomplete";
import SaveButton from "./SaveButton";

type LocationProps = {
  location_id?: string;
  country?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  full_address?: string;
  onAddressChange: (data: LocationType, id: string) => void;
}

const AddressItem: React.FC<LocationProps> = ({
  location_id,
  country,
  city,
  area,
  latitude,
  longitude,
  full_address,
  onAddressChange,
}: LocationProps) => {
  const [isEditing, toggleIsEditing] = useReducer((state) => !state, false);
  const [address, setAddress] = useState<string>(full_address || "");
  const [cityname, setCityname] = useState<string>(city || "");

  const onSaveAction = (formData: FormData) => {
    const newLocation = {
      full_address: formData.get("full_address") as string,
      city: formData.get("city") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
    };

    onAddressChange(newLocation, location_id!);

    setAddress(formData.get("full_address") as string);
    setCityname(formData.get("city") as string);
    toggleIsEditing();
  }

  return (
    <div className="w-full p-4 bg-[#F3F3F1] border border-gray-200 rounded-[26px] shadow">
      <div className={`flex justify-between items-end ${isEditing ? "border-b pb-3 mb-3" : "border-none"} transition-all duration-300 pb-0 mb-0 border-[#666]]`}>
        <div>
          <h5 className="text-lg">City: {cityname}</h5>
          <p className="mb-0">Full Address: {address}</p>
        </div>
        <div>
          {isEditing ?
            <X size={22} className="cursor-pointer hover:text-[#5046DB]" onClick={toggleIsEditing} /> :
            <NotePencil size={22} className="cursor-pointer hover:text-[#5046DB]" onClick={toggleIsEditing} />}
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isEditing ? "max-h-screen" : "max-h-0"}`}
      >
        <form action={onSaveAction} method="POST">
          <GoogleMapAutocomplete id={location_id!} defaultAddress={address!} />
          {/* <div className="flex justify-end">
            <SaveButton />
          </div> */}
        </form>
      </div>
    </div>
  )
}

export default AddressItem;