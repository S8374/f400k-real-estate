"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Building2 } from "lucide-react";
import { useMapInitialization } from "./hooks/useMapInitialization";
import { useMapMarkers } from "./hooks/useMapMarkers";
import { useMapZoneFocus } from "./hooks/useMapZoneFocus";
import { useMapZones } from "./hooks/useMapZones";

export interface MapProperty {
  id?: string | number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

export interface PropertyMapProps {
  properties: MapProperty[];
  zones?: any[];
  activeZoneId?: string;
  onZoneClick?: (zoneId: string) => void;
  isMapActive: boolean;
  defaultFlyToProperty?: boolean;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function PropertyMap({
  properties,
  zones,
  activeZoneId,
  onZoneClick,
  isMapActive,
  defaultFlyToProperty = true,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerByPropertyIdRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);
  const zoneMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const lastFocusedLocationRef = useRef<string | null>(null);
  const hasInitiallyFocusedRef = useRef<boolean>(false);

  const { isSupported } = useMapInitialization({
    mapRef,
    mapInstance,
    markersRef,
    activePopupRef,
  });

  useMapMarkers({
    properties,
    mapInstance,
    markersRef,
    markerByPropertyIdRef,
    activePopupRef,
    hasInitiallyFocusedRef,
    defaultFlyToProperty,
  });

  useMapZoneFocus({
    mapInstance,
    properties,
    lastFocusedLocationRef,
    zoneMarkerRef,
    markerByPropertyIdRef,
    activePopupRef,
  });

  useMapZones({
    mapInstance,
    zones,
    activeZoneId,
    onZoneClick,
  });

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (isMapActive) {
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      return;
    }

    map.scrollZoom.disable();
    map.dragPan.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
  }, [isMapActive]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="absolute inset-0 w-full h-full bg-zinc-900 text-zinc-300 flex items-center justify-center p-4 text-center">
        Map cannot load: missing NEXT_PUBLIC_MAPBOX_TOKEN.
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0D0D0D] text-zinc-500 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded bg-zinc-900 flex items-center justify-center mb-4">
           <Building2 className="text-zinc-700" size={32} />
        </div>
        <h3 className="text-white font-bold mb-1">Interactive Map Unavailable</h3>
        <p className="text-sm max-w-xs mx-auto">Your browser or hardware doesn't support WebGL, which is required for this map.</p>
      </div>
    );
  }

  return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
}
