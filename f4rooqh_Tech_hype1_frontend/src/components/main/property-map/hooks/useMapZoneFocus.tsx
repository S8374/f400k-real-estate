import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { createCircleGeoJSON, makeFuturisticGeoJSON } from "../utils/geojsonUtils";
import { getAttractiveColor } from "@/components/shared/NavCategory";

interface MapProperty {
  id?: string | number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

interface UseMapZoneFocusProps {
  mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
  properties: MapProperty[];
  lastFocusedLocationRef: React.MutableRefObject<string | null>;
  zoneMarkerRef: React.MutableRefObject<mapboxgl.Marker | null>;
  markerByPropertyIdRef: React.MutableRefObject<Map<string, mapboxgl.Marker>>;
  activePopupRef: React.MutableRefObject<mapboxgl.Popup | null>;
}

export function useMapZoneFocus({
  mapInstance,
  properties,
  lastFocusedLocationRef,
  zoneMarkerRef,
  markerByPropertyIdRef,
  activePopupRef,
}: UseMapZoneFocusProps) {
  useEffect(() => {
    const handleFocusLocation = (event: Event) => {
      const map = mapInstance.current;
      if (!map) return;

      const customEvent = event as CustomEvent<{
        id?: string | number;
        latitude?: number;
        longitude?: number;
        color?: string;
        geojson?: any;
        label?: string;
        isMainZone?: boolean;
      }>;

      const id = customEvent.detail?.id;
      const lat = Number(customEvent.detail?.latitude);
      const lng = Number(customEvent.detail?.longitude);
      const label = customEvent.detail?.label;
      const isMainZone = customEvent.detail?.isMainZone;
      
      const locationKey = label || `${lat},${lng}`;
      if (lastFocusedLocationRef.current === locationKey && !id) {
        // Prevent duplicate firing that causes flickering for the same zone
        return;
      }
      lastFocusedLocationRef.current = locationKey;
      
      const color = getAttractiveColor(label, customEvent.detail?.color);
      console.log("focusLocation color calculation: label=" + label + ", eventColor=" + customEvent.detail?.color + ", calculatedColor=" + color + ", isMainZone=" + isMainZone);
      
      if (label === "allproperties") {
        if (properties.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          let hasValidCoords = false;
          properties.forEach((p) => {
            const plat = Number(p.latitude ?? p.lat);
            const plng = Number(p.longitude ?? p.lng);
            if (Number.isFinite(plat) && Number.isFinite(plng) && plat !== 0 && plng !== 0) {
              bounds.extend([plng, plat]);
              hasValidCoords = true;
            }
          });

          if (hasValidCoords) {
            map.fitBounds(bounds, {
              padding: 100,
              pitch: 0,
              bearing: 0,
              duration: 1500,
              essential: true,
            });
          }
        }
        
        // Cleanup existing zone layers since we are showing "All"
        if (map.getLayer("zone-polygon-fill")) map.removeLayer("zone-polygon-fill");
        if (map.getLayer("zone-polygon-outline")) map.removeLayer("zone-polygon-outline");
        if (map.getLayer("zone-mesh-lines")) map.removeLayer("zone-mesh-lines");
        if (map.getLayer("zone-mesh-dots")) map.removeLayer("zone-mesh-dots");
        if (map.getLayer("zone-point-circle")) map.removeLayer("zone-point-circle");
        if (map.getSource("zone-polygon")) map.removeSource("zone-polygon");
        
        if (zoneMarkerRef.current) {
          zoneMarkerRef.current.remove();
          zoneMarkerRef.current = null;
        }

        return;
      }
      
      let geojson = customEvent.detail?.geojson;
      console.log("focusLocation event detail:", customEvent.detail);
      
      if (typeof geojson === "string") {
        try {
          geojson = JSON.parse(geojson);
        } catch (e) {
          console.error("Failed to parse geojson string:", e);
        }
      }

      // Cleanup existing DOM-based zone marker
      if (zoneMarkerRef.current) {
        zoneMarkerRef.current.remove();
        zoneMarkerRef.current = null;
      }
      
      // Determine if geojson is a Point
      let isPoint = false;
      let pointCoords: [number, number] | null = null;

      if (geojson) {
        if (geojson.type === "Point" && Array.isArray(geojson.coordinates)) {
          isPoint = true;
          pointCoords = geojson.coordinates as [number, number];
        } else if (geojson.type === "Feature" && geojson.geometry?.type === "Point" && Array.isArray(geojson.geometry.coordinates)) {
          isPoint = true;
          pointCoords = geojson.geometry.coordinates as [number, number];
        } else if (geojson.type === "FeatureCollection") {
          // Check if there is ANY polygon in the collection. If so, it's NOT a point zone.
          const hasPolygon = geojson.features.some((f: any) => 
            f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon"
          );
          
          if (!hasPolygon) {
            const pointFeature = geojson.features.find((f: any) => f.geometry?.type === "Point");
            if (pointFeature && Array.isArray(pointFeature.geometry.coordinates)) {
              isPoint = true;
              pointCoords = pointFeature.geometry.coordinates as [number, number];
            }
          }
        }
      }

      const isZoneFocus = id === undefined || id === null;

      // Fallback: If no GeoJSON is present but this is a zone/category focus and we have valid latitude and longitude, treat as a point zone
      if (isZoneFocus && !geojson && !pointCoords && Number.isFinite(lng) && Number.isFinite(lat) && lat !== 0 && lng !== 0) {
        isPoint = true;
        pointCoords = [lng, lat];
      }

      let dynamicRadius = 3.0; // Default subzone radius (3km)
      if (label === "Riyadh" || label === "Riyadh Region" || (label && label.toLowerCase().includes("riyadh"))) {
        dynamicRadius = 18.0; // Riyadh metropolitan area covers ~36km diameter
      } else if (isMainZone) {
        dynamicRadius = 10.0; // Other main zones/cities cover ~20km diameter
      }

      // If it is a point-based zone, convert it to a circular polygon representing the district/city area
      if (isPoint && pointCoords) {
        geojson = createCircleGeoJSON(pointCoords, dynamicRadius);
        isPoint = false; // Render using standard polygon style
      }

      // Format geojson appropriately for Polygons
      if (geojson && !isPoint) {
        if (Array.isArray(geojson)) {
          geojson = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: geojson.length > 0 && typeof geojson[0][0] === "number" ? [geojson] : geojson
              }
            }]
          };
        } else if (geojson.type === "Feature") {
          geojson = {
            type: "FeatureCollection",
            features: [geojson]
          };
        } else if (geojson.type && geojson.type !== "FeatureCollection") {
          geojson = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              properties: {},
              geometry: geojson
            }]
          };
        }

        // Apply futuristic mesh overlay effect to the polygon
        geojson = makeFuturisticGeoJSON(geojson);
      }
      
      console.log("Parsed geojson for map:", geojson);

      const markerById =
        id !== undefined && id !== null
          ? markerByPropertyIdRef.current.get(String(id))
          : undefined;

      const markerLngLat = markerById?.getLngLat();
      const targetLng = Number.isFinite(lng) ? lng : markerLngLat?.lng;
      const targetLat = Number.isFinite(lat) ? lat : markerLngLat?.lat;

      let hasBounds = false;
      const bounds = new mapboxgl.LngLatBounds();
      
      if (isZoneFocus && geojson && geojson.features) {
         const extractCoords = (obj: any) => {
            if (Array.isArray(obj)) {
               if (obj.length === 2 && typeof obj[0] === "number" && typeof obj[1] === "number") {
                  bounds.extend(obj as [number, number]);
                  hasBounds = true;
               } else {
                  obj.forEach(extractCoords);
               }
            }
         };
         geojson.features.forEach((f: any) => {
            if (f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon") {
               extractCoords(f.geometry.coordinates);
            }
         });
      }

      if (!hasBounds && (typeof targetLng !== "number" || typeof targetLat !== "number")) return;

      const mapWidth = map.getContainer().clientWidth;
      const isDesktop = window.innerWidth >= 1024;
      const horizontalOffset = isDesktop ? Math.round(Math.min(220, mapWidth * 0.11)) : 0;
      const verticalOffset = isDesktop ? 170 : 110;

      if (hasBounds) {
        map.fitBounds(bounds, {
          padding: 80,
          pitch: 0,
          bearing: 0,
          duration: 1500,
          essential: true
        });
      } else {
        let targetZoom = 16;
        if (isZoneFocus) {
          if (dynamicRadius >= 15) {
            targetZoom = 10.8;
          } else if (dynamicRadius >= 8) {
            targetZoom = 12.5;
          } else {
            targetZoom = 14.5;
          }
        }

        map.flyTo({
          center: [targetLng as number, targetLat as number],
          zoom: targetZoom,
          pitch: isZoneFocus ? 50 : 0, // Cinematic tilt for zones
          bearing: isZoneFocus ? 15 : 0, // Slight rotation for a 3D effect
          duration: 1500, // Smoother and longer animation for an attractive transition
          essential: true,
          offset: [isDesktop ? -horizontalOffset : 0, verticalOffset], // Negative offset to push content right
        });
      }

      if (markerById) {
        const popup = markerById.getPopup();
        if (popup && activePopupRef.current !== popup) {
          if (activePopupRef.current) {
            activePopupRef.current.remove();
          }
          popup.addTo(map);
          activePopupRef.current = popup;
        }
      }

      // Handle Mapbox Source and Layer addition (only for Polygons now)
      if (geojson && !isPoint) {
        // Clear circle layer if it exists
        if (map.getLayer("zone-point-circle")) map.removeLayer("zone-point-circle");

        // Clean up existing zone-polygon source and layers first to make sure color updates and new layers apply cleanly
        if (map.getLayer("zone-polygon-fill")) map.removeLayer("zone-polygon-fill");
        if (map.getLayer("zone-polygon-outline")) map.removeLayer("zone-polygon-outline");
        if (map.getLayer("zone-mesh-lines")) map.removeLayer("zone-mesh-lines");
        if (map.getLayer("zone-mesh-dots")) map.removeLayer("zone-mesh-dots");
        if (map.getSource("zone-polygon")) map.removeSource("zone-polygon");

        // Add source and layers fresh (Only futuristic mesh, since all-zones-fill handles the solid fill)
        map.addSource("zone-polygon", { type: "geojson", data: geojson });

      } else if (isPoint && pointCoords) {
        // Clean up polygon layers if they exist
        if (map.getLayer("zone-polygon-fill")) map.removeLayer("zone-polygon-fill");
        if (map.getLayer("zone-polygon-outline")) map.removeLayer("zone-polygon-outline");
        if (map.getSource("zone-polygon")) map.removeSource("zone-polygon");

        // Render DOM-based Point Zone Marker
        const container = document.createElement("div");
        container.style.width = "120px";
        container.style.height = "120px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.pointerEvents = "none";

        const el = document.createElement("div");
        el.className = "zone-point-marker";
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.borderRadius = "50%";
        el.style.border = "4px solid #ffffff";
        el.style.backgroundColor = color;
        el.style.opacity = "0.45";
        el.style.pointerEvents = "none";
        
        // Add pulsing highlight effect
        el.style.animation = "pulse-marker 2s infinite ease-in-out";
        
        container.appendChild(el);
        
        // Dynamically inject pulse keyframes if not present
        if (!document.getElementById("pulse-marker-style")) {
          const style = document.createElement("style");
          style.id = "pulse-marker-style";
          style.innerHTML = `
            @keyframes pulse-marker {
              0% { transform: scale(0.85); opacity: 0.35; }
              50% { transform: scale(1.1); opacity: 0.55; }
              100% { transform: scale(0.85); opacity: 0.35; }
            }
          `;
          document.head.appendChild(style);
        }

        zoneMarkerRef.current = new mapboxgl.Marker({
          element: container,
          anchor: "center",
        })
          .setLngLat(pointCoords)
          .addTo(map);
      } else if (isZoneFocus) {
        // Clear all layers & markers if no geojson and it's a zone focus
        if (map.getLayer("zone-polygon-fill")) map.removeLayer("zone-polygon-fill");
        if (map.getLayer("zone-polygon-outline")) map.removeLayer("zone-polygon-outline");
        if (map.getLayer("zone-mesh-lines")) map.removeLayer("zone-mesh-lines");
        if (map.getLayer("zone-mesh-dots")) map.removeLayer("zone-mesh-dots");
        if (map.getLayer("zone-point-circle")) map.removeLayer("zone-point-circle");
        if (map.getSource("zone-polygon")) map.removeSource("zone-polygon");
      }
    };

    window.addEventListener("focus-property-location", handleFocusLocation);
    return () => {
      window.removeEventListener("focus-property-location", handleFocusLocation);
      if (zoneMarkerRef.current) {
        zoneMarkerRef.current.remove();
      }
    };
  }, [properties, mapInstance, lastFocusedLocationRef, zoneMarkerRef, markerByPropertyIdRef, activePopupRef]);
}
