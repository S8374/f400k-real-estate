"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type ZoneDrawingMapProps = {
  latitude?: number;
  longitude?: number;
  onChange: (geojson: string) => void;
  initialGeoJSON?: string;
};

export default function ZoneDrawingMap({
  latitude,
  longitude,
  onChange,
  initialGeoJSON,
}: ZoneDrawingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const drawInstance = useRef<MapboxDraw | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize Map and Draw Control
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current || !mapboxgl.accessToken) return;

    if (!mapboxgl.supported()) {
      setIsSupported(false);
      return;
    }

    const defaultLat = latitude || 24.7136; // Default to Riyadh
    const defaultLng = longitude || 46.6753;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [defaultLng, defaultLat],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      });

      mapInstance.current = map;

      // Initialize Draw
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });

      map.addControl(draw, "top-right");
      drawInstance.current = draw;

      // Add existing GeoJSON if available
      map.on("load", () => {
        // Switch to night fog for admin style consistency
        map.setFog({
          color: "rgb(11, 15, 26)",
          "high-color": "rgb(36, 52, 78)",
          "space-color": "rgb(4, 7, 14)",
          "horizon-blend": 0.28,
        });

        if (initialGeoJSON) {
          try {
            let parsed = JSON.parse(initialGeoJSON);
            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed);
            }
            if (parsed.type === "FeatureCollection" || parsed.type === "Feature" || parsed.type === "Polygon" || parsed.type === "MultiPolygon") {
               draw.add(parsed);
            }
          } catch (err) {
            console.error("Failed to parse initialGeoJSON", err);
          }
        }
      });

      // Handle drawing events
      const updateFormGeoJSON = () => {
        if (!drawInstance.current) return;
        const data = drawInstance.current.getAll();
        
        if (data.features.length > 0) {
          onChange(JSON.stringify(data));
        } else {
          onChange("");
        }
      };

      map.on("draw.create", updateFormGeoJSON);
      map.on("draw.delete", updateFormGeoJSON);
      map.on("draw.update", updateFormGeoJSON);
      
      // Fix map resize issue by listening to container resize
      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainer.current);
      
      return () => {
        resizeObserver.disconnect();
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    } catch (err) {
      console.error("Failed to initialize Mapbox Draw:", err);
    }
  }, []); // Only run once on mount

  // Fly to location when latitude/longitude props change
  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      mapInstance.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        essential: true,
      });
    }
  }, [latitude, longitude]);

  if (!isSupported) {
    return <div className="text-red-500">Mapbox GL is not supported in this browser.</div>;
  }

  return (
    <div className="w-full mt-4 flex flex-col gap-2">
      <div 
        ref={mapContainer} 
        className="w-full h-[600px] xl:h-[700px] rounded overflow-hidden relative"
      />
    </div>
  );
}
