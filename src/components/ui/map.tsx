"use client";
import dynamic from "next/dynamic";

interface MapProps {
  userLat?: number;
  userLng?: number;
  stationLat?: number;
  stationLng?: number;
  stationName?: string;
}

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a1a1a]">
      <p className="text-gray-500 text-sm">Loading map...</p>
    </div>
  ),
});

export default function Map(props: MapProps) {
  return <LeafletMap {...props} />;
}
