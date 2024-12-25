'use client';
import { loadGoogleMapsScript } from '@/utils/loadScript';
import { Check, MapPin, Spinner } from '@phosphor-icons/react/dist/ssr';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

type MapComponentProps = {
  id: string;
  latitude: number;
  longitude: number;
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const MapComponent: React.FC<MapComponentProps> = ({
  id,
  latitude,
  longitude,
}: MapComponentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [city, setCity] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [showMap, toggleShowMap] = useReducer((oriValue) => !oriValue, false);

  const status = useFormStatus();
  const hasStartedPending = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadGoogleMapsScript(apiKey);
        // Initialize Geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Initialize Google Map with a unique container
        const mapElement = document.getElementById(id + "_map");
        if (mapElement) {
          const newMap = new google.maps.Map(mapElement, {
            center: { lat: latitude, lng: longitude }, // Default center
            zoom: 17,
          });
          setMap(newMap);
        }
      } catch (error) {
        console.error('Error loading Google Maps script:', error);
      }
    };

    // console.log(typeof google);
    initialize();

    return () => {
      // Cleanup event listeners when the component unmounts
      if (autocomplete) {
        google.maps.event.clearListeners(autocomplete, 'place_changed');
      }
    };
  }, [apiKey]);

  return (
    <>
      <div id={id + "_map"} className={`w-full h-[400px] mb-3`} />
    </>
  );
};

export default MapComponent;
