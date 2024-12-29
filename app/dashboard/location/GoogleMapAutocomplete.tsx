'use client';
import { Check, MapPin, Spinner } from '@phosphor-icons/react/dist/ssr';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

type GoogleMapAutocompleteProps = {
  id: string;
  defaultAddress: string;
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

function waitForGoogleAPI(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100; // Check every 100ms
    const maxAttempts = timeout / interval;
    let attempts = 0;

    const checkGoogleAPI = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(checkGoogleAPI);
        resolve('Google API is ready');
      } else if (attempts >= maxAttempts) {
        clearInterval(checkGoogleAPI);
        reject('Google API script did not load in time');
      }
      attempts++;
    }, interval);
  });
}

const GoogleMapAutocomplete: React.FC<GoogleMapAutocompleteProps> = ({
  id,
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
  const [showMap, toggleShowMap] = useReducer((oriValue) => !oriValue, false);

  const status = useFormStatus();
  const hasStartedPending = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Initialize Google Map with a unique container
        const mapElement = document.getElementById(id + "_map");
        if (mapElement) {
          const newMap = new google.maps.Map(mapElement, {
            center: { lat: 51.51, lng: -0.14 }, // Default center
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

    // console.log(typeof google);
    waitForGoogleAPI()
      .then(() => {
        initialize();
      })
      .catch((error) => {
        console.error(error);
      })

    return () => {
      // Cleanup event listeners when the component unmounts
      if (autocomplete) {
        google.maps.event.clearListeners(autocomplete, 'place_changed');
      }
    };
  }, [apiKey, typeof google]);

  // Handle manual input address changes
  useEffect(() => {
    if (geocoder && map && inputAddress) {
      geocoder.geocode({ address: inputAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]?.geometry.location) {
          const location = results[0].geometry.location;
          setLatitude(location.lat());
          setLongitude(location.lng());

          const cityName = extractCityName(results[0]);
          setCity(cityName || "");

          map.setCenter(location);
          map.setZoom(19);
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [inputAddress, geocoder, map]);

  useEffect(() => {
    if (status.pending && !hasStartedPending.current) {
      hasStartedPending.current = true;
    }

    if (!status.pending && hasStartedPending.current) {
      hasStartedPending.current = false;

      // Dispatch the custom event to trigger iframe refresh
      const event = new Event("iframeRefresh");
      window.dispatchEvent(event); // Fire the event to refresh the iframe
    }
  }, [status.pending]);

  // Function to extract city name from address components
  const extractCityName = (place: google.maps.places.PlaceResult | google.maps.GeocoderResult): string | null => {
    const addressComponents = place.address_components;
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
            htmlFor={id}
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
            id={id}
            name={id}
            className="w-full pl-5 text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            placeholder=""
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)} // Update input state for manual entry
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button type='submit' className='absolute flex justify-center items-center top-0 right-0 w-[60px] h-[50px] rounded-r-[26px] bg-[#5046DB] hover:bg-[#6960e6]'>
            {status.pending ? (
              <Spinner className="animate-spin" size={20} color='white' />
            ) : (
              <Check size={20} color='white' />
            )}
          </button>
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

      {/* Map Container with unique ID */}
      <div id={id + "_map"} className={`w-full h-[400px] mb-3 ${inputAddress ? "block" : "hidden"}`} />
    </>
  );
};

export default GoogleMapAutocomplete;
