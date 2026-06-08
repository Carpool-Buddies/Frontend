"use client";

import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/hooks/use-google-maps";

export interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * A text input wired to Google Places Autocomplete.
 * Falls back to a plain text input when the Maps API key is missing.
 */
export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "הקלד כתובת...",
  className = "",
  required,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isReady } = useGoogleMaps();

  useEffect(() => {
    if (!isReady || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "il" },
      fields: ["formatted_address", "geometry"],
      types: ["geocode", "establishment"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect({
          address: place.formatted_address ?? inputRef.current?.value ?? "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      } else if (place.formatted_address) {
        // address without geometry — still capture the text
        onChange(place.formatted_address);
      }
    });

    autocompleteRef.current = ac;
  }, [isReady, onPlaceSelect, onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      className={className}
    />
  );
}
