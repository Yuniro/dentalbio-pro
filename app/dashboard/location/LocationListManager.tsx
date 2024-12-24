'use client'
import React from "react";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";
import SaveButton from "../components/SaveButton";
import AddressItem from "../components/AddressItem";

type LocationManagerProps = {
  saveLocation: (formData: FormData) => void;
  locations: any[];
}

const LocationListManager: React.FC<LocationManagerProps> = ({
  saveLocation,
  locations,
}) => {
  return (
    <>
      <div id="columns">
        <form action={saveLocation} method="POST" className="mb-6 mt-10">
          <h2 className="text-lg font-semibold mb-3">Location</h2>
          <GoogleMapAutocomplete defaultAddress="" id="full_address" />
          <div className="w-full flex items-end justify-end">
            <SaveButton />
          </div>
        </form>
      </div>
      {locations && locations.map((location, index) => (
        <AddressItem {...location} key={index} />
      ))}
    </>
  )
}

export default LocationListManager;