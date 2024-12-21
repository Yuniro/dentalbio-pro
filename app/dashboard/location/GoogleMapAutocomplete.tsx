'use client';
import { loadGoogleMapsScript } from '@/utils/loadScript';
import { MapPin } from 'phosphor-react';
import React, { useEffect, useRef, useState } from 'react';

type GoogleMapAutocompleteProps = {
  defaultAddress: string;
};

const GoogleMapAutocomplete: React.FC<GoogleMapAutocompleteProps> = ({
  defaultAddress,
}: GoogleMapAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [inputAddress, setInputAddress] = useState(defaultAddress); // Track input changes
  const [city, setCity] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // console.log(defaultAddress);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load Google Maps API
        await loadGoogleMapsScript(apiKey);

        // Initialize Geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Initialize Google Map
        const mapElement = document.getElementById('google-map');
        if (mapElement) {
          const newMap = new google.maps.Map(mapElement, {
            center: { lat: -34.397, lng: 150.644 }, // Default center
            zoom: 8,
          });
          setMap(newMap);
        }

        // Initialize Autocomplete
        if (inputRef.current) {
          const autoComplete = new google.maps.places.Autocomplete(inputRef.current);

          autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            if (place.geometry?.location) {
              const location = place.geometry.location;
              setInputAddress(place.formatted_address || ''); // Update input state
              if (map) {
                map.setCenter(location);
                map.setZoom(18);
              }
            }
          });

          setAutocomplete(autoComplete);
        }
      } catch (error) {
        console.error('Error loading Google Maps script:', error);
      }
    };

    initialize();
  }, [apiKey]);

  // Handle manual input address changes
  useEffect(() => {
    if (geocoder && map && inputAddress) {
      geocoder.geocode({ address: inputAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]?.geometry.location) {
          const location = results[0].geometry.location;

          setLatitude(location.lat);
          setLongitude(location.lng);

          const cityName = extractCityName(results[0]);
          console.log(cityName);
          setCity(cityName || "");

          map.setCenter(location);
          map.setZoom(19);
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [inputAddress, geocoder, map]);

  // Function to extract city name from address components
  const extractCityName = (place: google.maps.places.PlaceResult | google.maps.GeocoderResult): string | null => {
    const addressComponents = place.address_components;
    console.log(addressComponents);
    if (addressComponents) {
      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          return component.long_name; // City name
        }
        if (component.types.includes('postal_town')) {
          return component.long_name; // City name
        }
        if (component.types.includes('administrative_area_level_2')) {
          return component.long_name; // Fallback for city name if locality is missing
        }
      }
    }
    return null; // No city found
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (inputAddress === '') {
      setIsFocused(false);
    }
  };

  return (
    <>
      <div className="relative w-full mb-3">
        <div className='rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px]'>
          <label
            htmlFor="full_address"
            className={`absolute top-[12px] text-gray-500 transition-all duration-100 ease-linear transform ${isFocused || inputAddress ? '-translate-y-[7px] text-xs' : 'scale-100'} pl-5`}
          >
            Enter your address
          </label>
          <MapPin
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
          />
          <input
            ref={inputRef}
            type="text"
            id="full_address"
            name="full_address"
            className="w-full pl-5 text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            // placeholder="Enter your address"
            defaultValue={defaultAddress}
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)} // Update input state for manual entry
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>


        <input type="hidden" name="full_address" value={inputAddress} />
        <input type="hidden" name="city" value={city} />
        <input
          type="hidden"
          name="latitude"
          value={latitude ? latitude.toString() : ""}
        />
        <input
          type="hidden"
          name="longitude"
          value={longitude ? longitude.toString() : ""}
        />
      </div >

      <div className="my-4 text-neutral-700">
        <strong>Full Address:</strong> {inputAddress}
      </div>
      <div className="mt-2 mb-4 text-neutral-700">
        <strong>City:</strong> {city}
      </div>

      <div id="google-map" className='w-full h-[400px] mb-3'></div>
    </>
  );
};

export default GoogleMapAutocomplete;
