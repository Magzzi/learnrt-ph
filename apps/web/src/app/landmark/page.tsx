"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Landmark, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const landmarkData = [
  {
    name: "LRT-1",
    stations: {
      "Roosevelt": ["Waltermart Muñoz", "Lourdes School of Quezon City"],
      "Balintawak": ["Balintawak Market"],
      "Monumento": [
        "Bonifacio Monument at Monumento Circle",
        "Caloocan Cathedral",
        "Victory Central Mall"
      ],
      "5th Avenue": ["San Roque Parish Church", "Philippine Business Bank"],
      "R. Papa": ["Manila North Cemetery"],
      "Abad Santos": ["St. Joseph the Worker Parish"],
      "Blumentritt": [
        "Chinese General Hospital / North Cemetery",
        "Philippine National Railways (PNR) Blumentritt Station interchange"
      ],
      "Tayuman": [
        "University of Santo Tomas (UST) via jeepney or LRT‑2 walkway",
        "SM City San Lazaro"
      ],
      "Bambang": ["St. Jude College", "Ospital ng Maynila Medical Center"],
      "Doroteo Jose": [
        "Isetann / Cinerama Recto",
        "Far Eastern University (FEU)",
        "University of the East (UE)",
        "LRT-2 Recto Station interchange"
      ],
      "Carriedo": [
        "Quiapo Church",
        "Binondo Chinatown & Plaza Lacson",
        "Escolta Street"
      ],
      "Central Terminal": [
        "Manila City Hall",
        "Intramuros (including Fort Santiago & Manila Cathedral)",
        "Rizal Park / Quirino Grandstand",
        "National Museum Complex (National Museum of Fine Arts, Anthropology, and Natural History)"
      ],
      "UN Avenue": ["National Bureau of Investigation (NBI)", "Paco Park"],
      "Pedro Gil": [
        "University of the Philippines Manila",
        "Philippine General Hospital (PGH)",
        "Robinsons Place Manila"
      ],
      "Quirino": ["Malate Church", "Remedios Circle"],
      "Vito Cruz": [
        "Cultural Center of the Philippines (CCP)",
        "Star City",
        "De La Salle University (DLSU)"
      ],
      "Gil Puyat": [
        "World Trade Center",
        "Star City (via shuttle)",
        "Cartimar Shopping Center"
      ],
      "Libertad": ["Pasay City Hall", "Libertad Market"],
      "EDSA": [
        "SM Mall of Asia",
        "SMX Convention Center",
        "Metropoint Mall",
        "MRT-3 Taft Avenue Station interchange"
      ],
      "Baclaran": [
        "Baclaran Church (Our Mother of Perpetual Help)",
        "Redemptorist Market"
      ],
      "Redemptorist‑Aseana": ["City of Dreams Manila", "Solaire Resort & Casino"],
      "Ninoy Aquino Avenue": ["Duty Free Philippines Fiestamall", "NAIA Terminal 1"],
      "PITX": ["Parañaque Integrated Terminal Exchange (PITX)"],
      "MIA Road": ["NAIA Terminal 2 & 3"],
      "Dr. Santos": ["SM City BF Parañaque", "Unihealth-Parañaque Hospital"]
    }
  },
  {
    name: "MRT-3",
    stations: {
      "North Ave": [
        "SM North EDSA",
        "Trinoma Mall",
        "Vertis North",
        "LRT-1 Roosevelt Station (via EDSA Carousel bus)"
      ],
      "Quezon Ave": [
        "Centris Station",
        "Quezon City Hall",
        "Office of the Ombudsman"
      ],
      "GMA‑Kamuning": ["GMA Network Center", "Timog Avenue restaurant row"],
      "Cubao": [
        "Araneta City (Gateway, Ali & Farmers Plaza)",
        "Smart Araneta Coliseum",
        "New Frontier Theater",
        "LRT-2 Cubao Station interchange"
      ],
      "Santolan": ["Camp Aguinaldo"],
      "Ortigas": ["SM Megamall", "Podium Mall", "ADB Headquarters"],
      "Shaw Blvd": ["Shangri‑La Plaza Mall", "Starmall EDSA-Shaw", "Lourdes School of Mandaluyong"],
      "Boni": ["Forum Robinsons", "Light Mall"],
      "Guadalupe": ["Guadalupe Market", "Guadalupe Church"],
      "Buendia": ["Makati Central Business District", "Ayala Triangle Gardens"],
      "Ayala": [
        "Ayala Center (Greenbelt / Glorietta)",
        "Ayala Museum",
        "The Landmark"
      ],
      "Magallanes": ["Alphaland Southgate Mall", "Philippine National Railways (PNR) Magallanes Station"],
      "Taft Ave": ["LRT-1 EDSA Station interchange", "SM Mall of Asia (via bus)"]
    }
  },
  {
    name: "LRT-2",
    stations: {
      "Recto": [
        "University Belt",
        "Divisoria markets (near Tutuban)",
        "LRT-1 Doroteo Jose Station interchange"
      ],
      "Legarda": ["San Sebastian Church", "San Beda College"],
      "Pureza": ["University of the East Ramon Magsaysay Memorial Medical Center (UERMMMC)"],
      "V. Mapa": ["SM City Sta. Mesa", "Our Lady of Lourdes Hospital"],
      "J. Ruiz": ["San Juan City Hall"],
      "Gilmore": ["Robinsons Magnolia", "St. Luke’s Medical Center"],
      "Betty Go‑Belmonte": ["Trinity University of Asia", "Cubao Cathedral"],
      "Cubao": [
        "Araneta City / LRT‑MRT interchange",
        "Ali Mall",
        "Gateway Mall"
      ],
      "Anonas": ["WorldCiti Medical Center"],
      "Katipunan": [
        "Ateneo de Manila University",
        "Miriam College",
        "University of the Philippines Diliman (UP Diliman) via jeepney"
      ],
      "Santolan": [
        "SM City Marikina",
        "Riverbanks Center",
        "Marikina Sports Complex"
      ],
      "Marikina": ["Robinsons Metro East", "Sta. Lucia Mall"],
      "Antipolo": ["SM City Masinag", "Antipolo Cathedral (via tricycle or jeepney)"]
    }
  },
  {
    name: "PNR",
    stations: {
      "Tutuban": [
        "Tutuban Center (heritage mall)",
        "168 Shopping Mall & Divisoria",
        "Chinatown"
      ],
      "Blumentritt": [
        "LRT-1 Blumentritt interchange",
        "San Lazaro Tourism and Business Park"
      ],
      "España": ["University of Santo Tomas", "Española Food Strip"],
      "Sta. Mesa": ["Polytechnic University of the Philippines (PUP)"],
      "Paco": ["Paco Church", "Paco Market"],
      "Buendia": ["Makati Central Business District", "Cash & Carry Mall"],
      "FTI": ["Food Terminal Inc. Complex", "SM City Bicutan"],
      "Sucat": ["Sucat Market"],
      "Alabang": ["Festival Mall", "Starmall Alabang"],
      "Muntinlupa": ["Muntinlupa City Hall", "New Bilibid Prison"],
      "San Pedro": ["San Pedro City Hall", "San Pedro Cathedral"],
      "Calamba": ["Calamba City Hall", "Rizal Shrine"]
    }
  }
];




export default function LandmarksPage() {
  const [openLine, setOpenLine] = useState<string | null>("LRT-1");

  const toggleLine = (name: string) => {
    setOpenLine((prev) => (prev === name ? null : name));
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
            <Landmark size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Points of Interest</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Notable Landmarks Near Stations
          </h1>
          <p className="text-gray-400 text-base">Discover places, malls, schools, and attractions near every rail station.</p>
        </motion.div>

        {/* Landmark Cards */}
        <div className="space-y-4">
          {landmarkData.map((line, index) => (
            <motion.div
              key={line.name}
              className="border border-white/10 rounded-xl bg-[#0d2222] overflow-hidden transition-all duration-200 hover:border-emerald-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleLine(line.name)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white">{line.name}</h2>
                <span className="text-gray-400 ml-4 shrink-0">
                  {openLine === line.name ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>

              {openLine === line.name && (
                <div className="px-6 py-5 border-t border-white/10">
                  <div className="space-y-5">
                    {Object.entries(line.stations).map(
                      ([stationName, landmarks]) => (
                        <div key={stationName}>
                          <h3 className="text-base font-medium text-emerald-400 flex items-center gap-2 mb-2">
                            <MapPin size={14} />
                            {stationName}
                          </h3>
                          <ul className="space-y-1 pl-6">
                            {(landmarks as string[]).map((landmark: string, i: number) => (
                              <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                                <span className="text-gray-600 mt-1.5 shrink-0">•</span>
                                {landmark}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
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
