'use client'
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from '@phosphor-icons/react/dist/ssr';

type AddressAutoCompleteProps = {
  // onAddressSelect: (address: string, coordinates: [number, number]) => void;
  defaultAddress: string;
};

type GeocodingResponse = {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  }>;
}

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
  defaultAddress,
}: AddressAutoCompleteProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  }, []);

  useEffect(() => {
    if (!mapboxgl.supported()) {
      alert('Your browser does not support Mapbox GL');
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 50],
        zoom: 16,
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    setQuery(defaultAddress);
  }, [defaultAddress])

  useEffect(() => {
    getCoordinates(query);
  }, [query])

  async function getCoordinates(address: string): Promise<void> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: GeocodingResponse = await response.json();
      if (data.features.length > 0) {
        const latitude = data.features[0].geometry.coordinates[1];
        const longitude = data.features[0].geometry.coordinates[0];

        console.log(latitude, longitude);

        mapRef.current?.flyTo({
          center: [longitude, latitude],
          essential: true,
          zoom: 16,
          pitch: 0,
          bearing: 0
        })
      } else {
        console.log('No results found for this address.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fetchSuggestions = async (input: string) => {
    if (input) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setSuggestions(data.features);
      console.log(data.features);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    fetchSuggestions(event.target.value);


  };

  const handleAddressSelect = (address: string, coordinates: [number, number]) => {
    // onAddressSelect(address, coordinates);
    setQuery(address); // Optionally set the input value to the selected address
    setSuggestions([]); // Clear suggestions after selection
  };

  const renderSuggestions = () => {
    return suggestions.map((suggestion, index) => (
      <div
        key={index}
        className="cursor-pointer p-2 hover:bg-gray-200"
        onClick={() =>
          handleAddressSelect(suggestion.place_name, suggestion.center as [number, number])
        }
      >
        {suggestion.place_name}
      </div>
    ));
  };

  return (
    <>
      <div className="relative w-full mb-3">
        <MapPin
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
        <input
          ref={inputRef}
          type="text"
          name="full_address"
          value={query}
          onChange={handleInputChange} // Apply debounce to input
          className="w-full pl-11 rounded-[26px] py-2 text-base pr-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
          placeholder="Search for an address"
        />
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto">
            {renderSuggestions()}
          </div>
        )}
      </div>
      <div ref={mapContainerRef} className="w-full h-[300px] mb-5 rounded-[26px]" />
    </>
  );
};

export default AddressAutoComplete;
