"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Train, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const getOpenStatus = (start: string, end: string): string => {
  const now = new Date();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startTime = new Date(now);
  startTime.setHours(sh, sm, 0, 0);
  const endTime = new Date(now);
  endTime.setHours(eh, em, 0, 0);
  return now >= startTime && now <= endTime ? "Open" : "Closed";
};

const railwayData = [
  {
    name: "LRT-1",
    status: "Operational",
    areas: ["Manila", "Pasay", "Caloocan", "Cavite"],
    isopen: getOpenStatus("4:30", "22:30"),
    stations: [
      "Roosevelt", "Balintawak", "Monumento", "5th Avenue", "R. Papa",
      "Abad Santos", "Blumentritt", "Tayuman", "Bambang", "Doroteo Jose",
      "Carriedo", "Central Terminal", "UN Avenue", "Pedro Gil", "Quirino",
      "Vito Cruz", "Gil Puyat", "Libertad", "EDSA", "Baclaran",
      "Redemptorist-Aseana", "Ninoy Aquino Avenue", "PITX", "MIA Road", "Dr. Santos",
    ],
  },
  {
    name: "MRT-3",
    status: "Operational",
    areas: ["North Avenue", "Quezon City", "Makati", "Pasay"],
    isopen: getOpenStatus("4:30", "21:30"),
    stations: [
      "North Ave", "Quezon Ave", "GMA-Kamuning", "Cubao", "Santolan",
      "Ortigas", "Shaw Blvd", "Boni", "Guadalupe", "Buendia",
      "Ayala", "Magallanes", "Taft Ave",
    ],
  },
  {
    name: "LRT-2",
    status: "Operational",
    areas: ["Manila", "San Juan", "Quezon City"],
    isopen: getOpenStatus("5:00", "21:30"),
    stations: [
      "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz",
      "Gilmore", "Betty Go-Belmonte", "Cubao", "Anonas", "Katipunan",
      "Santolan", "Marikina", "Antipolo",
    ],
  },
  {
    name: "PNR",
    status: "Limited Operations",
    areas: ["Manila", "Calamba", "Naga (temporarily suspended)"],
    isopen: "Closed",
    stations: [
      "Tutuban", "Blumentritt", "España", "Sta. Mesa", "Paco",
      "Buendia", "FTI", "Sucat", "Alabang", "Muntinlupa",
      "San Pedro", "Calamba",
    ],
  },
  {
    name: "NSCR",
    status: "Under Construction",
    areas: ["Clark", "Bulacan", "Valenzuela", "Manila", "Parañaque", "Calamba"],
    isopen: "Closed",
    stations: [
      "New Clark City", "Clark International Airport", "Clark", "Angeles",
      "San Fernando", "Apalit", "Calumpit", "Malolos", "Guiguinto",
      "Balagtas", "Bocaue", "Marilao", "Meycauayan", "West Valenzuela",
      "Caloocan", "Solis", "Tutuban", "Blumentritt", "España",
      "Santa Mesa", "Paco", "Buendia", "EDSA", "Senate-DepED",
      "FTI", "Bicutan", "Sucat", "Alabang", "Muntinlupa",
      "San Pedro", "Pacita", "Biñan", "Santa Rosa", "Cabuyao",
      "Banlic", "Calamba",
    ],
  },
  {
    name: "MRT-7",
    status: "Under Construction",
    areas: ["North Ave QC", "San Jose del Monte, Bulacan"],
    isopen: "Closed",
    stations: [
      "North Ave", "Quezon Memorial Circle", "UP Diliman", "Tandang Sora",
      "Don Antonio", "Batasan", "San Mateo Rd", "Quirino Hwy",
      "SM Fairview", "San Jose del Monte",
    ],
  },
];

export default function Page() {
  const [openRailway, setOpenRailway] = useState<string | null>(null);

  const toggleRailway = (name: string) => {
    setOpenRailway((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-[#0a1a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Page Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#1a2e2e] border border-[#2a4a3a] rounded-full px-4 py-2 mb-4">
            <Train size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Rail Networks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Explore Philippine Railways
          </h1>
          <p className="text-gray-400 text-base">Browse all active and upcoming rail lines across the country.</p>
        </motion.div>

        {/* Railway Cards */}
        <div className="space-y-4">
          {railwayData.map((railway, index) => (
            <motion.div
              key={railway.name}
              className="border border-white/10 rounded-xl bg-[#0d2222] overflow-hidden transition-all duration-200 hover:border-emerald-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleRailway(railway.name)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">{railway.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`text-xs font-medium text-white px-3 py-1 rounded-full ${
                        railway.status.includes("Operational")
                          ? "bg-emerald-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {railway.status}
                    </span>
                    <span
                      className={`text-xs font-medium text-white px-3 py-1 rounded-full ${
                        railway.isopen.includes("Open")
                          ? "bg-emerald-500"
                          : "bg-red-500/80"
                      }`}
                    >
                      {railway.isopen}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {railway.areas.join(" · ")}
                  </p>
                </div>
                <span className="text-gray-400 ml-4 shrink-0">
                  {openRailway === railway.name ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>

              {openRailway === railway.name && (
                <div className="px-6 py-5 border-t border-white/10">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                    Stations ({railway.stations.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {railway.stations.map((station, i) => (
                      <span
                        key={i}
                        className="bg-[#1a2e2e] border border-white/5 px-3 py-2 rounded-lg text-sm text-gray-300 flex items-center justify-between hover:border-emerald-500/30 transition-colors"
                      >
                        <span className="truncate">{station}</span>
                        <span className="ml-2 bg-emerald-500/20 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium shrink-0">
                          {i + 1}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
