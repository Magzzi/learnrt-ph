"use client";
import { useState } from "react";
import Image from "next/image";

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
      "Roosevelt",
      "Balintawak",
      "Monumento",
      "5th Avenue",
      "R. Papa",
      "Abad Santos",
      "Blumentritt",
      "Tayuman",
      "Bambang",
      "Doroteo Jose",
      "Carriedo",
      "Central Terminal",
      "UN Avenue",
      "Pedro Gil",
      "Quirino",
      "Vito Cruz",
      "Gil Puyat",
      "Libertad",
      "EDSA",
      "Baclaran",
      "Redemptorist-Aseana",
      "Ninoy Aquino Avenue",
      "PITX",
      "MIA Road",
      "Dr. Santos",
    ],
  },
  {
    name: "MRT-3",
    status: "Operational",
    areas: ["North Avenue", "Quezon City", "Makati", "Pasay"],
    isopen: getOpenStatus("4:30", "21:30"),
    stations: [
      "North Ave",
      "Quezon Ave",
      "GMA-Kamuning",
      "Cubao",
      "Santolan",
      "Ortigas",
      "Shaw Blvd",
      "Boni",
      "Guadalupe",
      "Buendia",
      "Ayala",
      "Magallanes",
      "Taft Ave",
    ],
  },
  {
    name: "LRT-2",
    status: "Operational",
    areas: ["Manila", "San Juan", "Quezon City"],
    isopen: getOpenStatus("5:00", "21:30"),
    stations: [
      "Recto",
      "Legarda",
      "Pureza",
      "V. Mapa",
      "J. Ruiz",
      "Gilmore",
      "Betty Go-Belmonte",
      "Cubao",
      "Anonas",
      "Katipunan",
      "Santolan",
      "Marikina",
      "Antipolo",
    ],
  },
  {
    name: "PNR",
    status: "Limited Operations",
    areas: ["Manila", "Calamba", "Naga (temporarily suspended)"],
    isopen: "Closed",
    stations: [
      "Tutuban",
      "Blumentritt",
      "España",
      "Sta. Mesa",
      "Paco",
      "Buendia",
      "FTI",
      "Sucat",
      "Alabang",
      "Muntinlupa",
      "San Pedro",
      "Calamba",
    ],
  },
  {
    name: "NSCR",
    status: "Under Construction",
    areas: ["Clark", "Bulacan", "Valenzuela", "Manila", "Parañaque", "Calamba"],
    isopen: "Closed",
    stations: [
      "New Clark City",
      "Clark International Airport",
      "Clark",
      "Angeles",
      "San Fernando",
      "Apalit",
      "Calumpit",
      "Malolos",
      "Guiguinto",
      "Balagtas",
      "Bocaue",
      "Marilao",
      "Meycauayan",
      "West Valenzuela",
      "Caloocan",
      "Solis",
      "Tutuban",
      "Blumentritt",
      "España",
      "Santa Mesa",
      "Paco",
      "Buendia",
      "EDSA",
      "Senate-DepED",
      "FTI",
      "Bicutan",
      "Sucat",
      "Alabang",
      "Muntinlupa",
      "San Pedro",
      "Pacita",
      "Biñan",
      "Santa Rosa",
      "Cabuyao",
      "Banlic",
      "Calamba",
    ],
  },
  {
    name: "MRT-7",
    status: "Under Construction",
    areas: ["North Ave QC", "San Jose del Monte, Bulacan"],
    isopen: "Closed",
    stations: [
      "North Ave",
      "Quezon Memorial Circle",
      "UP Diliman",
      "Tandang Sora",
      "Don Antonio",
      "Batasan",
      "San Mateo Rd",
      "Quirino Hwy",
      "SM Fairview",
      "San Jose del Monte",
    ],
  },
];

export default function Page() {
  const [openRailway, setOpenRailway] = useState<string | null>(null);

  const toggleRailway = (name: string) => {
    setOpenRailway((prev) => (prev === name ? null : name));
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-10">
      <h1 className="text-3xl font-bold text-sky-700 mb-8">
        Explore Philippine Railways
      </h1>
      <div className="space-y-6">
        {railwayData.map((railway) => (
          <div
            key={railway.name}
            className="border rounded-xl shadow hover:shadow-lg transition-shadow bg-white overflow-hidden"
          >
            <button
              onClick={() => toggleRailway(railway.name)}
              className="w-full text-left px-6 py-4 flex justify-between items-center bg-sky-100 hover:bg-sky-200 transition-colors"
            >
              <div>
                <h2 className="text-2xl font-semibold">{railway.name}</h2>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`text-sm text-white px-3 py-1 rounded-lg ${
                      railway.status.includes("Operational") ? "bg-green-600" : "bg-orange-600"
                    }`}
                  >
                    {railway.status}
                  </span>
                  <span
                    className={`text-sm text-white px-3 py-1 rounded-lg ${
                      railway.isopen.includes("Open") ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {railway.isopen}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Areas Covered: {railway.areas.join(", ")}
                </p>
              </div>
              <span className="text-xl">
                {openRailway === railway.name ? "−" : "+"}
              </span>
            </button>
            {openRailway === railway.name && (
              <div className="px-6 py-4 border-t">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Stations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-gray-800">
                  {railway.stations.map((station, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center justify-between"
                    >
                      {station}
                      <span className="ml-2 bg-sky-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {i + 1}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
