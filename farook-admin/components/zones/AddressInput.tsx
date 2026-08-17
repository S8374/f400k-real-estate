// Address Input

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { UseFormRegister, UseFormSetValue, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";
import { LocateFixed } from "lucide-react";

interface AddressInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  addressLineFieldName: Path<T>;
  latitudeFieldName: Path<T>;
  longitudeFieldName: Path<T>;
  mapEmbedUrlFieldName: Path<T>;
  locationFieldName: Path<T>; // e.g., Downtown Riyadh
  geojsonFieldName?: Path<T>;
  nameFieldName?: Path<T>;
  subtitleFieldName?: Path<T>;
  placeholder?: string;
  zoneName?: string; // Add zoneName prop
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  geojson?: any;
  address?: {
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export default function AddressInput<T extends FieldValues>({
  register,
  setValue,
  addressLineFieldName,
  latitudeFieldName,
  longitudeFieldName,
  mapEmbedUrlFieldName,
  locationFieldName,
  geojsonFieldName,
  nameFieldName,
  subtitleFieldName,
  placeholder = "Search for your address",
  zoneName,
}: AddressInputProps<T>) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Fetch suggestions from OpenStreetMap
  useEffect(() => {
    if (!query && !zoneName) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Helper to extract a real geographical region from the zone name for better map searches
        const getGeographicRegion = (name?: string) => {
          if (!name) return "Saudi Arabia";
          const lower = name.toLowerCase();
          if (lower.includes("riyadh")) return "Riyadh, Saudi Arabia";
          if (lower.includes("jeddah")) return "Jeddah, Saudi Arabia";
          if (lower.includes("makkah")) return "Makkah, Saudi Arabia";
          if (lower.includes("madinah")) return "Madinah, Saudi Arabia";
          if (lower.includes("al-ula") || lower.includes("al ula") || lower.includes("alula")) return "AlUla, Saudi Arabia";
          if (lower.includes("neom")) return "Neom, Tabuk, Saudi Arabia";
          if (lower.includes("red sea")) return "Red Sea, Saudi Arabia";
          if (lower.includes("amaala")) return "Amaala, Saudi Arabia";
          return "Saudi Arabia"; // Default to KSA if no specific city is found
        };

        const regionQuery = getGeographicRegion(zoneName);
        
        // If there's a zone but no query, suggest the zone itself
        const searchQuery = query ? `${query}, ${regionQuery}` : regionQuery;

        // Prevent searching for just "Saudi Arabia" on initial load
        if (!query && searchQuery === "Saudi Arabia") {
          setSuggestions([]);
          return;
        }
        
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json&addressdetails=1&polygon_geojson=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, zoneName]);

  const handleSelectSuggestion = (s: Suggestion) => {
    let latitude = parseFloat(s.lat);
    let longitude = parseFloat(s.lon);
    let geojsonStr = s.geojson ? JSON.stringify(s.geojson) : undefined;
    
    // Frontend overrides for known problematic regions from Nominatim
    const nameLower = s.display_name.toLowerCase();
    
    // Fix Riyadh Region (Nominatim returns province center instead of city)
    if (nameLower.includes("riyadh") || nameLower.includes("الرياض")) {
      latitude = 24.7135;
      longitude = 46.6753;
      geojsonStr = undefined; // Clear geojson so it generates a proper 5km circle instead of huge province polygon
    } else if (nameLower.includes("makkah") || nameLower.includes("mecca")) {
      latitude = 21.3891;
      longitude = 39.8579;
      geojsonStr = undefined;
    } else if (nameLower.includes("jeddah")) {
      latitude = 21.4858;
      longitude = 39.1925;
      geojsonStr = undefined;
    } else if (nameLower.includes("medina") || nameLower.includes("madinah")) {
      latitude = 24.5247;
      longitude = 39.5692;
      geojsonStr = undefined;
    }

    const addressLine = s.display_name;
    const location = s.address?.suburb || s.address?.city || s.address?.state || "";

    setValue(addressLineFieldName, addressLine as any);
    setValue(latitudeFieldName, latitude as any);
    setValue(longitudeFieldName, longitude as any);
    setValue(locationFieldName, location as any);
    if (geojsonFieldName && geojsonStr) {
      setValue(geojsonFieldName, geojsonStr as any);
    } else if (geojsonFieldName) {
      setValue(geojsonFieldName, "" as any); // Clear if overriden or not present
    }
    setValue(
      mapEmbedUrlFieldName,
      `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed` as any
    );

    const parts = addressLine.split(',');
    if (parts.length > 0 && nameFieldName) {
      setValue(nameFieldName, parts[0].trim() as any);
    }
    if (parts.length > 1 && subtitleFieldName) {
      setValue(subtitleFieldName, parts.slice(1).join(',').trim() as any);
    }

    setQuery(addressLine);
    setSuggestions([]);
  };

  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          const addressLine = data.display_name || "Current location";
          const location =
            data.address.suburb || data.address.city || data.address.state || "";

          setValue(addressLineFieldName, addressLine as any);
          setValue(latitudeFieldName, latitude as any);
          setValue(longitudeFieldName, longitude as any);
          setValue(locationFieldName, location as any);
          setValue(
            mapEmbedUrlFieldName,
            `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed` as any
          );

          setQuery(addressLine);
          toast.success("Current location set!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch address from location.");
        }
      }
    );
  };

  return (
    <div className="relative">
      <Label className="text-sm">Location</Label>
      <div className="relative">
        <Input
          {...register(addressLineFieldName)}
          className="mt-1.5 h-11 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSetCurrentLocation}
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-700"
        >
          <LocateFixed className="w-5 h-5 mr-2 mt-1" />
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-[9999] w-full bg-black border border-stone-700 rounded mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-emerald-700 cursor-pointer text-sm"
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}