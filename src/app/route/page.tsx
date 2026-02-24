"use client";
import { useState } from "react";
import { Search, Train, Navigation } from "lucide-react";
import { motion } from "framer-motion";
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
      <div className="flex flex-col md:flex-row min-h-screen md:h-screen md:max-h-screen md:overflow-hidden bg-[#0a1a1a]">
        {/* Left side */}
        <div className="md:w-1/3 w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-[#0d2222] md:border-r border-b md:border-b-0 border-white/10 space-y-6 md:overflow-y-auto">
          {/* Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-sm bg-[#1a2e2e] border border-white/10 shadow-lg rounded-xl p-6 space-y-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Find Route <Navigation size={20} className="text-emerald-400" />
            </h1>

            <div className="w-full">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="block w-full rounded-lg border border-white/10 bg-[#0a1a1a] px-4 py-2.5 text-white shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Enter location (use exact location)"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-colors duration-200 py-2.5 px-4 rounded-lg text-white font-medium"
            >
              Search
              <Search size={16} />
            </button>
          </motion.form>

          <hr className="w-full max-w-sm border-t border-white/10 my-4" />
          <motion.div
            className="w-full max-w-sm items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ul className="flex flex-col items-center w-full max-w-sm bg-[#1a2e2e] border border-white/10 shadow-lg rounded-xl p-6 space-y-4">
              <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Nearest Station <Train size={20} className="text-emerald-400" />
              </h1>
              {nearest.map((station, index) => (
                <StationItem
                  key={index}
                  label={station.name}
                  distance={`${station.distance.toFixed(1)} km`}
                />
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="md:w-2/3 w-full bg-[#0a1a1a] flex flex-col items-center justify-center min-h-[300px] md:min-h-0">
          <Map location={location} />
        </div>
      </div>
    );
  };

