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
  parentZoneName?: string; // Parent zone name for better context
  zoneLat?: number;
  zoneLng?: number;
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
  parentZoneName,
  zoneLat,
  zoneLng,
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
        // Use Mapbox Geocoding for professional, fuzzy, and accurate location search
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        
        let searchQuery = query;
        
        // If a zone is selected, smartly append it to the query to bias the search geographically
        if (zoneName) {
          const combinedZoneNames = [zoneName, parentZoneName].filter(Boolean).join(" ");
          
          // Remove filler words to get a clean search term
          const stopWords = ["geographic", "zones", "zone", "main", "special", "economic", "project", "projects", "giga", "mega", "city", "of", "the", "for", "cities", "and", "province", "region", "district"];
          let cleanZoneName = combinedZoneNames.split(/[\s,()]+/).filter(w => w && !stopWords.includes(w.toLowerCase())).join(" ");
          
          if (query) {
             searchQuery = `${query} ${cleanZoneName}`;
          } else {
             searchQuery = cleanZoneName;
          }
        }
        
        if (!searchQuery) {
          setSuggestions([]);
          return;
        }

        // Add proximity bias if zone coordinates are available
        const proximityParam = (zoneLat && zoneLng) ? `&proximity=${zoneLng},${zoneLat}` : '';

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${mapboxToken}&country=sa&types=address,poi,neighborhood,locality&limit=10${proximityParam}`
        );
        const data = await res.json();
        
        if (data.features) {
          const mappedSuggestions = data.features.map((f: any) => {
            const cityContext = f.context?.find((c: any) => c.id.startsWith("place") || c.id.startsWith("locality"));
            return {
              display_name: f.place_name,
              lon: f.center[0].toString(),
              lat: f.center[1].toString(),
              geojson: f.geometry,
              address: {
                city: cityContext ? cityContext.text : ""
              }
            };
          });
          setSuggestions(mappedSuggestions);
        } else {
          setSuggestions([]);
        }
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
          className="mt-1.5 h-11 pr-36"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSetCurrentLocation}
          title="Use my current location"
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 px-3 py-1.5 rounded-md transition-all border border-emerald-900/30 flex items-center justify-center group"
        >
          <LocateFixed className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
          <span className="text-xs font-medium whitespace-nowrap">Use Current Location</span>
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