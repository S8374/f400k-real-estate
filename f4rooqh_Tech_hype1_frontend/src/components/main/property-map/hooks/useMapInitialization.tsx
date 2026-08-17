import { useEffect, useRef, useState, RefObject } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

type MapboxGLModule = typeof import("mapbox-gl");

interface UseMapInitializationProps {
  mapRef: RefObject<HTMLDivElement | null>;
  mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>;
  activePopupRef: React.MutableRefObject<mapboxgl.Popup | null>;
}

export function useMapInitialization({
  mapRef,
  mapInstance,
  markersRef,
  activePopupRef,
}: UseMapInitializationProps) {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !mapboxgl.accessToken) return;

    if (!mapboxgl.supported()) {
      setIsSupported(false);
      return;
    }

    try {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [46.6753, 24.7136],
        zoom: 15.4,
        pitch: 71,
        bearing: -18,
        cooperativeGestures: true,
        antialias: true,
        config: {
          basemap: {
            lightPreset: "night",
            show3dObjects: true,
            showPointOfInterestLabels: true,
            showRoadLabels: true,
            showTransitLabels: false,
          },
        },
      });

      mapInstance.current = map;
      map.on("style.load", () => {
        // Soft atmospheric fog for a more realistic city depth.
        map.setFog({
          color: "rgb(11, 15, 26)",
          "high-color": "rgb(36, 52, 78)",
          "space-color": "rgb(4, 7, 14)",
          "horizon-blend": 0.28,
        });
        (window as any).isPropertyMapReady = true;
        window.dispatchEvent(new Event("property-map-ready"));
      });

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl as unknown as MapboxGLModule,
        marker: false,
        placeholder: "Search location",
        minLength: 1,
        limit: 6,
        autocomplete: true,
        clearAndBlurOnEsc: true,
      });

      map.addControl(geocoder, "top-right");

      const handleMapClick = () => {
        if (activePopupRef.current) {
          activePopupRef.current.remove();
          activePopupRef.current = null;
        }
      };

      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
        markersRef.current.forEach((marker) => marker.remove());
        map.remove();
        mapInstance.current = null;
        (window as any).isPropertyMapReady = false;
      };
    } catch (e) {
      console.error("Mapbox WebGL Error:", e);
      setIsSupported(false);
    }
  }, [mapRef, mapInstance, markersRef, activePopupRef]);

  return { isSupported };
}
