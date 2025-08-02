"use client";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import MapIcon from "@mui/icons-material/Map";
import StationItem from "@/components/ui/stationitem";
import Map from "@/components/ui/map";
import { findNearestStations, getCoordinates } from "@/app/route/findnearest";

export default function Page() {
  const [location, setLocation] = useState("");

  const [nearest, setNearest] = useState<{ name: string; distance: number }[]>(
    []
  );

  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const input = (e.target as HTMLFormElement).location.value;
      setLocation(input);

      const coords = await getCoordinates(input);
      if (coords) {
        setNearest(findNearestStations(coords.lat, coords.lng));
      } else {
        setNearest([]);
      }
    };
    return (
      <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden inset-0">
        {/* Left side */}
        <div className="md:w-1/3 w-full flex flex-col items-center justify-start p-6 bg-gray-50 space-y-6">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-4 mt-12"
          >
            <h1 className="text-2xl font-bold text-sky-700">
              Find Route <MapIcon fontSize="medium" />
            </h1>

            <div className="w-full">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter location (use exact location)"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-500 cursor-pointer transition-colors duration-200 py-2 px-4 rounded-md text-white"
            >
              Search
              <SearchIcon fontSize="small" />
            </button>
          </form>

          <hr className="w-full max-w-sm border-t border-gray-300 my-4" />
          <div className="w-full max-w-sm items-center text-center">
            <ul className="flex flex-col items-center w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-4">
              <h1 className="text-xl font-bold text-sky-700 mb-4">
                Nearest Station <DirectionsRailwayIcon fontSize="medium" />
              </h1>
              {nearest.map((station, index) => (
                <StationItem
                  key={index}
                  label={station.name}
                  distance={`${station.distance.toFixed(1)} km`}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-2/3 w-full bg-white flex flex-col items-center justify-center">
          <Map location={location} />
        </div>
      </div>
    );
  };

