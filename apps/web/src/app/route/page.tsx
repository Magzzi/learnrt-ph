"use client";
import { useState, useRef } from "react";
import { Search, Train, Navigation, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StationItem from "@/components/ui/stationitem";
import Map from "@/components/ui/map";
import { findNearestStations } from "@/app/route/findnearest";
import type { NearestStation } from "@/app/route/findnearest";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nearest, setNearest] = useState<NearestStation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&countrycodes=ph&limit=6`
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);
  };

  const applyLocation = (lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    setNearest(findNearestStations(lat, lng));
    setSelectedIndex(0);
  };

  const handleSuggestionSelect = (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    setQuery(s.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    applyLocation(lat, lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!query.trim()) return;
    // If there's an exact match in suggestions, use it
    if (suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0]);
      return;
    }
    // Otherwise geocode the raw query
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=ph&limit=1`
    );
    const data: Suggestion[] = await res.json();
    if (data.length > 0) {
      applyLocation(parseFloat(data[0].lat), parseFloat(data[0].lon));
    } else {
      setUserCoords(null);
      setNearest([]);
    }
  };

  // Brief delay on blur so click on suggestion registers first
  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);

  const shortLabel = (displayName: string) => {
    const parts = displayName.split(",");
    return parts.slice(0, 3).join(",").trim();
  };

  const sublabel = (displayName: string) => {
    const parts = displayName.split(",");
    return parts.slice(3).join(",").trim() || null;
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

          <div className="w-full relative">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Location
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={handleBlur}
                className="block w-full rounded-lg border border-white/10 bg-[#0a1a1a] px-4 py-2.5 pr-10 text-white shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Search a place in the Philippines"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {loadingSuggestions
                  ? <Loader2 size={15} className="animate-spin text-emerald-400" />
                  : <MapPin size={15} />}
              </div>
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 left-0 right-0 mt-1 bg-[#0f2a2a] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onMouseDown={() => handleSuggestionSelect(s)}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 transition-colors flex items-start gap-3 group"
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-500 group-hover:text-emerald-400" />
                        <div className="min-w-0">
                          <p className="text-white text-sm truncate font-medium">
                            {shortLabel(s.display_name)}
                          </p>
                          {sublabel(s.display_name) && (
                            <p className="text-gray-500 text-xs truncate mt-0.5">
                              {sublabel(s.display_name)}
                            </p>
                          )}
                        </div>
                      </button>
                      {i < suggestions.length - 1 && (
                        <div className="mx-4 border-t border-white/5" />
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
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
            {nearest.length > 0 && nearest[0].distance > 100 && (
              <p className="text-yellow-400 text-sm text-center">
                No stations found within 100 km of your location.
              </p>
            )}
            {nearest.map((station, index) => (
              <StationItem
                key={index}
                label={station.name}
                distance={`${station.distance.toFixed(1)} km`}
                isActive={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right side — Map */}
      <div className="md:w-2/3 w-full bg-[#0a1a1a] flex flex-col items-center justify-center min-h-[300px] md:min-h-0">
        <Map
          userLat={userCoords?.lat}
          userLng={userCoords?.lng}
          stationLat={nearest[selectedIndex]?.lat}
          stationLng={nearest[selectedIndex]?.lng}
          stationName={nearest[selectedIndex]?.name}
        />
      </div>
    </div>
  );
}
