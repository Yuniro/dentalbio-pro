"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import "../../globals.css";
import MapComponent from "./MapComponent";

export default function WorkLocation({ dentistry }: { dentistry: any }) {
  const [locations, setLocations] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      const supabase = createClient();

      // Fetch location based on dentistry_id
      const { data: dentistryLocations, error: dentistryLocationError } = await supabase
        .from("dentistry_locations")
        .select(`
          location_id,
          locations (country, city, area, latitude, longitude, full_address)
        `)
        .eq("dentistry_id", dentistry.dentistry_id) // Assuming one location per dentistry

      if (dentistryLocationError) {
        console.error("Error fetching location:", dentistryLocationError);
        setLoading(false);
        return;
      }

      setLocations(dentistryLocations); // Store the location data
      setLoading(false);
    }

    fetchLocation();
  }, [dentistry.dentistry_id]);

  // Show loading message while fetching location data
  if (loading) {
    return <h2 className="section-heading-work">Loading location...</h2>;
  }

  // If no location data is available, show a placeholder message
  if (!location) {
    return <h2 className="section-heading-work p-0"></h2>;
  }

  return (
    <div id="location">
      <div className="row section-wrapper-work">
        <h1 className="text-center section-heading-work text-[26px] font-bold pb-8">Where I work</h1>

        {locations?.map((location) =>
          <div className="col-12 map-wrapper" key={location.location_id}>
            {/* Google Maps Iframe with dynamic latitude and longitude */}
            <MapComponent
              id={location.location_id}
              latitude={location.locations.latitude}
              longitude={location.locations.longitude}
            />
            {/* <iframe
            className="bg-black"
            width="100%"
            height={200}
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location.full_address)}&z=15&output=embed`} // Dynamically set address
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          /> */}

            <div className="d-flex align-items-center justify-content-center map-button">
              {dentistry.booking_link && (
                <Link
                  href={dentistry.booking_link || ""}
                  className="primary-btn map-primary-btn no-underline"
                >
                  Book an appointment
                </Link>
              )}
              {dentistry.contact_email && (
                <Link
                  className="primary-btn map-primary-btn text-white text-decoration-none"
                  href={`mailto:${dentistry.contact_email || ""}`}
                >
                  Email
                </Link>
              )}
              {dentistry.phone && (
                <Link
                  className="primary-btn map-primary-btn text-white text-decoration-none"
                  href={`tel:${dentistry.phone || ""}`}
                >
                  {dentistry.phone}
                </Link>
              )}
            </div>

            {/* Dynamically display the address */}
            <p className="text-decoration-none text-center map-detail">
              {location.locations.full_address}
            </p>
          </div>)}
      </div>
    </div>
  );
}
