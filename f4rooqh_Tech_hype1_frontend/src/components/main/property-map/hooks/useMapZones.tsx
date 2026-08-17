import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getAttractiveColor } from "@/components/shared/NavCategory";

interface UseMapZonesProps {
  mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
  zones?: any[];
  activeZoneId?: string;
  onZoneClick?: (zoneId: string) => void;
}

export function useMapZones({
  mapInstance,
  zones,
  activeZoneId,
  onZoneClick,
}: UseMapZonesProps) {
  const [activePolygonIndex, setActivePolygonIndex] = useState<number | null>(null);

  useEffect(() => {
    setActivePolygonIndex(null);
  }, [activeZoneId]);

  const onZoneClickRef = useRef(onZoneClick);
  useEffect(() => {
    onZoneClickRef.current = onZoneClick;
  }, [onZoneClick]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const handleMapLoad = () => {
      if (!map.getSource("all-zones")) {
        map.addSource("all-zones", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });

        map.addLayer({
          id: "all-zones-fill",
          type: "fill",
          source: "all-zones",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": [
              "case",
              ["boolean", ["get", "isActive"], false],
              0.4,
              0.15
            ]
          }
        }, "waterway-label");

        map.addLayer({
          id: "all-zones-line",
          type: "line",
          source: "all-zones",
          paint: {
            "line-color": [
              "case",
              ["boolean", ["get", "isActive"], false],
              "#ffffff",
              ["get", "color"]
            ],
            "line-width": [
              "case",
              ["boolean", ["get", "isActive"], false],
              3,
              1
            ]
          }
        }, "waterway-label");

        map.on("click", "all-zones-fill", (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const zId = feature.properties?.zoneId;
            const pIdx = feature.properties?.polygonIndex;

            if (zId && onZoneClickRef.current) {
              onZoneClickRef.current(zId);
              setActivePolygonIndex(pIdx);

              const activeZoneEvent = new CustomEvent("focus-property-location", { 
                detail: { 
                   id: zId, 
                   geojson: feature.geometry, 
                   label: feature.properties?.name,
                   color: feature.properties?.color,
                   isMainZone: false
                } 
              });
              window.dispatchEvent(activeZoneEvent);
            }
          }
        });

        map.on("mouseenter", "all-zones-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "all-zones-fill", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    };

    if (map.isStyleLoaded()) {
      handleMapLoad();
    } else {
      map.on("style.load", handleMapLoad);
    }
  }, [mapInstance]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !zones || zones.length === 0) {
        if (map && map.getSource("all-zones")) {
            (map.getSource("all-zones") as mapboxgl.GeoJSONSource).setData({ type: "FeatureCollection", features: [] });
        }
        return;
    }

    const features: any[] = [];
    zones.forEach(zone => {
      if (zone.geojson) {
        let geo = typeof zone.geojson === "string" ? JSON.parse(zone.geojson) : zone.geojson;
        const color = getAttractiveColor(zone.label, zone.color);
        const isZoneActive = activeZoneId === zone.value;

        if (geo.type === "FeatureCollection") {
          let polyIdx = 0;
          geo.features.forEach((f: any) => {
            if (f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon") {
              const currentPolyIdx = polyIdx++;
              const isActive = isZoneActive && (activePolygonIndex === null || activePolygonIndex === currentPolyIdx);
              features.push({
                ...f,
                properties: { ...f.properties, zoneId: zone.value, polygonIndex: currentPolyIdx, color, isActive, name: zone.label }
              });
            }
          });
        } else if (geo.type === "Feature") {
          const isActive = isZoneActive && (activePolygonIndex === null || activePolygonIndex === 0);
          features.push({
            ...geo,
            properties: { ...geo.properties, zoneId: zone.value, polygonIndex: 0, color, isActive, name: zone.label }
          });
        } else if (geo.type === "Polygon" || geo.type === "MultiPolygon") {
          const isActive = isZoneActive && (activePolygonIndex === null || activePolygonIndex === 0);
          features.push({
            type: "Feature",
            geometry: geo,
            properties: { zoneId: zone.value, polygonIndex: 0, color, isActive, name: zone.label }
          });
        }
      }
    });

    const updateSource = () => {
      const source = map.getSource("all-zones") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: "FeatureCollection", features });
      }
    };

    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.once("style.load", updateSource);
    }
  }, [zones, activeZoneId, activePolygonIndex, mapInstance]);
}
