import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import { GoHomeFill } from "react-icons/go";
import PropertyCardMap from "../../PropertyCardMap";
import { useRouter } from "next/navigation";

interface MapProperty {
  id?: string | number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

interface UseMapMarkersProps {
  properties: MapProperty[];
  mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>;
  markerByPropertyIdRef: React.MutableRefObject<Map<string, mapboxgl.Marker>>;
  activePopupRef: React.MutableRefObject<mapboxgl.Popup | null>;
  hasInitiallyFocusedRef: React.MutableRefObject<boolean>;
  defaultFlyToProperty: boolean;
}

export function useMapMarkers({
  properties,
  mapInstance,
  markersRef,
  markerByPropertyIdRef,
  activePopupRef,
  hasInitiallyFocusedRef,
  defaultFlyToProperty,
}: UseMapMarkersProps) {
  const router = useRouter();

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerByPropertyIdRef.current.clear();
    activePopupRef.current = null;

    let firstValidCoords: [number, number] | null = null;
    let firstPopup: mapboxgl.Popup | null = null;

    for (const property of properties) {
      const lat = Number(property.latitude ?? property.lat);
      const lng = Number(property.longitude ?? property.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng) || (lat === 0 && lng === 0)) continue;

      if (!firstValidCoords) {
        firstValidCoords = [lng, lat];
      }

      const markerDiv = document.createElement("div");
      markerDiv.style.cursor = "pointer";
      const markerRoot = createRoot(markerDiv);
      markerRoot.render(
        <div className="map-home-marker text-3xl text-blue-600">
          <GoHomeFill />
        </div>,
      );

      const popupDiv = document.createElement("div");
      popupDiv.className = "map-popup-container";
      popupDiv.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      const popupRoot = createRoot(popupDiv);
      popupRoot.render(
        <PropertyCardMap
          property={property as any}
          onCardClick={() => router.push(`/property/${property.id}`)}
        />,
      );

      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "340px",
        className: "map-property-popup",
      }).setDOMContent(popupDiv);

      popup.on("close", () => {
        if (activePopupRef.current === popup) {
          activePopupRef.current = null;
        }
      });

      const marker = new mapboxgl.Marker({
        element: markerDiv,
        anchor: "bottom",
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      if (firstValidCoords && firstValidCoords[0] === lng && firstValidCoords[1] === lat && !firstPopup) {
        firstPopup = popup;
      }

      const markerElement = marker.getElement();
      markerElement.style.cursor = "pointer";
      markerElement.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (activePopupRef.current && activePopupRef.current !== popup) {
          activePopupRef.current.remove();
        }

        if (popup.isOpen()) {
          popup.remove();
          activePopupRef.current = null;
          return;
        }

        popup.addTo(map);
        activePopupRef.current = popup;
      });

      markersRef.current.push(marker);

      if (property.id !== undefined && property.id !== null) {
        markerByPropertyIdRef.current.set(String(property.id), marker);
      }
    }

    // By default, fly to the first valid property on initial load if we want to default fly
    if (defaultFlyToProperty && firstValidCoords && !hasInitiallyFocusedRef.current) {
      hasInitiallyFocusedRef.current = true;
      map.flyTo({
        center: firstValidCoords,
        zoom: 14.5,
        pitch: 50,
        bearing: 0,
        duration: 2000,
        essential: true,
        offset: [window.innerWidth >= 1024 ? -100 : 0, 0],
      });
      
      if (firstPopup) {
        firstPopup.addTo(map);
        activePopupRef.current = firstPopup;
      }
    }
  }, [properties, router, mapInstance, markersRef, markerByPropertyIdRef, activePopupRef, hasInitiallyFocusedRef, defaultFlyToProperty]);
}
