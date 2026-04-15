"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@/context/ThemeContext";

// Fix default marker icon paths broken by webpack asset hashing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;background:#34d399;border:3px solid white;border-radius:50%;box-shadow:0 0 8px #34d39988"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const stationIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;background:#10b981;border:3px solid white;border-radius:4px;box-shadow:0 2px 6px #00000088"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const TILE_LAYERS = {
  map_dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  map_light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
  },
} as const;

type MapType = "map" | "satellite";

interface LeafletMapProps {
  userLat?: number;
  userLng?: number;
  stationLat?: number;
  stationLng?: number;
  stationName?: string;
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

export default function LeafletMap({
  userLat,
  userLng,
  stationLat,
  stationLng,
  stationName,
}: LeafletMapProps) {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [mapType, setMapType] = useState<MapType>("map");
  const { theme } = useTheme();

  useEffect(() => {
    if (!userLat || !userLng || !stationLat || !stationLng) {
      setRoutePoints([]);
      return;
    }
    const url = `https://router.project-osrm.org/route/v1/foot/${userLng},${userLat};${stationLng},${stationLat}?geometries=geojson&overview=full`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const coords = data.routes?.[0]?.geometry?.coordinates as [number, number][];
        if (coords) {
          setRoutePoints(coords.map(([lng, lat]) => [lat, lng]));
        }
      })
      .catch(() => {
        setRoutePoints([
          [userLat, userLng],
          [stationLat, stationLng],
        ]);
      });
  }, [userLat, userLng, stationLat, stationLng]);

  const hasRoute = routePoints.length >= 2;
  const tileKey = mapType === "satellite"
    ? "satellite"
    : theme === "light" ? "map_light" : "map_dark";
  const tile = TILE_LAYERS[tileKey];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[12.8797, 121.774]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer key={mapType} url={tile.url} attribution={tile.attribution} />

        {hasRoute && (
          <Polyline
            positions={routePoints}
            color="#34d399"
            weight={4}
            opacity={0.85}
          />
        )}

        {hasRoute && <FitBounds points={routePoints} />}

        {userLat && userLng && (
          <Marker position={[userLat, userLng]} icon={userIcon}>
            <Popup>
              <span style={{ color: "#0a1a1a", fontWeight: 600 }}>Your location</span>
            </Popup>
          </Marker>
        )}

        {stationLat && stationLng && (
          <Marker position={[stationLat, stationLng]} icon={stationIcon}>
            <Popup>
              <span style={{ color: "#0a1a1a", fontWeight: 600 }}>
                {stationName ?? "Nearest Station"}
              </span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map / Satellite toggle — overlaid on the map */}
      <div className="absolute top-3 right-3 z-[1000] flex rounded-lg overflow-hidden border border-white/20 shadow-lg">
        {(["map", "satellite"] as MapType[]).map((type) => (
          <button
            key={type}
            onClick={() => setMapType(type)}
            className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors duration-150 ${
              mapType === type
                ? "bg-emerald-500 text-white"
                : "leaflet-toggle-inactive bg-[#0d2222]/90 text-gray-300 hover:bg-[#1a2e2e]/90 hover:text-white"
            }`}
          >
            {type === "map" ? "Map" : "Satellite"}
          </button>
        ))}
      </div>
    </div>
  );
}
