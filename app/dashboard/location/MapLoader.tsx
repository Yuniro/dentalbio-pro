'use client'
import { loadGoogleMapsScript } from "@/utils/loadScript";
import React from "react"

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

loadGoogleMapsScript(apiKey);

const MapLoader = () => {
  return (
    <div className="hidden">
      Google Map Loader
    </div>
  )
}

export default MapLoader;