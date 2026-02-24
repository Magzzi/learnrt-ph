"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import TrainOption from "@/app/trip/option";
import { getFareFromMatrix } from "@/utils/FareMatrix";

export default function TripCalculator() {
  const [rw, setRailway] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("sjt");
  const [fare, setFare] = useState<number | null>(null);
  const [discounted, setDiscounted] = useState<boolean>(false);
  const [calculated, setCalculated] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const calculateFare = async () => {
    setCalculated(true);
    const fareValue = await getFareFromMatrix(rw, origin, destination, type, discounted);
    setFare(fareValue);
  };

  const railway = ["LRT1", "LRT2", "MRT3"];
  const passengerType = ["Discounted (Senior/PWD/Student)", "Regular"];
  const ticketType = ["Single Journey Ticket", "Stored Value Ticket"];

  const selectClasses =
    "mt-1 block w-full rounded-lg border border-white/10 bg-[#0a1a1a] px-3 py-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-400";

  return (
    <div className="min-h-screen bg-[#0a1a1a]">
      <div className="max-w-md mx-auto pt-12 pb-16 px-4">
        {/* Header badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-[#1a2e2e] border border-[#2a4a3a] rounded-full px-4 py-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Calculator size={14} className="text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Fare Calculator</span>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-[#0d2222] border border-white/10 rounded-xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Trip Calculator</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="railway" className={labelClasses}>
                Railway
              </label>
              <select
                id="railway"
                onChange={(e) => setRailway(e.target.value)}
                className={selectClasses}
              >
                <option value="">Select a railway</option>
                {railway.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="passengerType" className={labelClasses}>
                Passenger Type
              </label>
              <select
                id="passengerType"
                name="passengerType"
                onChange={(e) =>
                  setDiscounted(
                    e.target.value === "Discounted (Senior/PWD/Student)"
                  )
                }
                className={selectClasses}
              >
                <option value="">Select passenger type</option>
                {passengerType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ticketType" className={labelClasses}>
                Ticket Type
              </label>
              <select
                id="ticketType"
                name="ticketType"
                onChange={(e) =>
                  setType(
                    e.target.value === "Single Journey Ticket" ? "sjt" : "svf"
                  )
                }
                className={selectClasses}
              >
                <option value="">Select ticket type</option>
                {ticketType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="origin" className={labelClasses}>
                Origin
              </label>
              <TrainOption
                station={rw}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="destination" className={labelClasses}>
                Destination
              </label>
              <TrainOption
                station={rw}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                exclude={origin}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-colors duration-200 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/25"
              onClick={() => calculateFare()}
            >
              Calculate Trip
            </button>

            {calculated && fare !== null && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
                <p className="text-emerald-400 font-semibold text-lg">Fare: ₱{fare}</p>
              </div>
            )}
            {calculated && fare === null && (
              <div className="bg-[#1a2e2e] border border-white/10 rounded-lg px-4 py-3">
                <p className="text-gray-400 font-semibold">Fare: ₱0.00</p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
