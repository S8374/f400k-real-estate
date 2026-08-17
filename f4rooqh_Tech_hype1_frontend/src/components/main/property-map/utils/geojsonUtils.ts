export function createCircleGeoJSON(center: [number, number], radiusInKm: number, points: number = 8): any {
  const [lng, lat] = center;
  const coords: [number, number][] = [];
  const seed = Math.sin(lng) * Math.cos(lat);

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    // Deterministic random factor between 0.88 and 1.12
    const variance = 0.88 + Math.abs(Math.sin(seed + i * 1.5)) * 0.24;
    const r = radiusInKm * variance;

    const distanceX = r / (111.32 * Math.cos((lat * Math.PI) / 180));
    const distanceY = r / 110.574;

    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }
  coords.push(coords[0]);

  return {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      }
    }]
  };
}

export function processOuterRing(coords: any[], lines: [number, number][][], dots: [number, number][]) {
  let sumLng = 0;
  let sumLat = 0;
  const numCoords = coords.length - 1;
  if (numCoords <= 0) return;

  for (let i = 0; i < numCoords; i++) {
    const vertex = coords[i];
    if (!vertex || typeof vertex[0] !== "number" || typeof vertex[1] !== "number") {
      return;
    }
    sumLng += vertex[0];
    sumLat += vertex[1];
  }
  const center: [number, number] = [sumLng / numCoords, sumLat / numCoords];

  for (let i = 0; i < numCoords; i++) {
    const vertex = coords[i];
    dots.push(vertex as [number, number]);

    // Line from vertex to center
    lines.push([center, vertex as [number, number]]);

    // Diagonal lines to build mesh geometry
    const nextTarget = coords[(i + 2) % numCoords];
    if (nextTarget) {
      lines.push([vertex as [number, number], nextTarget as [number, number]]);
    }
  }
}

export function makeFuturisticGeoJSON(geojson: any): any {
  if (!geojson) return geojson;

  let polygonFeatures: any[] = [];

  if (geojson.type === "FeatureCollection") {
    polygonFeatures = geojson.features.filter((f: any) => f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon");
  } else if (geojson.type === "Feature" && (geojson.geometry?.type === "Polygon" || geojson.geometry?.type === "MultiPolygon")) {
    polygonFeatures = [geojson];
  } else if (geojson.type === "Polygon" || geojson.type === "MultiPolygon") {
    polygonFeatures = [{
      type: "Feature",
      properties: {},
      geometry: geojson,
    }];
  }

  if (polygonFeatures.length === 0) return geojson;

  const lines: [number, number][][] = [];
  const dots: [number, number][] = [];

  for (const polygonFeature of polygonFeatures) {
    const geomType = polygonFeature.geometry?.type;
    
    if (geomType === "Polygon") {
      const coords = polygonFeature.geometry.coordinates[0];
      if (Array.isArray(coords) && coords.length > 0) {
        processOuterRing(coords, lines, dots);
      }
    } else if (geomType === "MultiPolygon") {
      const polygons = polygonFeature.geometry.coordinates;
      if (Array.isArray(polygons)) {
        for (const polygon of polygons) {
          if (Array.isArray(polygon)) {
            const coords = polygon[0]; // Outer ring of this sub-polygon
            if (Array.isArray(coords) && coords.length > 0) {
              processOuterRing(coords, lines, dots);
            }
          }
        }
      }
    }
  }

  return {
    type: "FeatureCollection",
    features: [
      ...polygonFeatures,
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiLineString",
          coordinates: lines,
        }
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiPoint",
          coordinates: dots,
        }
      }
    ]
  };
}
