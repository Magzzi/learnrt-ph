"use client";
import { useState } from "react";
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-sky-700 mb-4">Trip Calculator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="railway"
            className="block text-sm font-medium text-gray-700"
          >
            Railway
          </label>
          <select
            id="railway"
            onChange={(e) => setRailway(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a railway</option>
            {railway.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>

          <label
            htmlFor="passengerType"
            className="block text-sm mt-4 font-medium text-gray-700"
          >
            Passenger Type
          </label>
          <select
            id="passengerType"
            name="passengerType"
            onChange={(e) => setDiscounted(
              e.target.value === "Discounted (Senior/PWD/Student)" ? true : false
            )}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select passenger type</option>
            {passengerType.map((type) => (
              
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label
            htmlFor="ticketType"
            className="block text-sm mt-4 font-medium text-gray-700"
          >
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select ticket type</option>
            {ticketType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label
            htmlFor="origin"
            className="block text-sm mt-4 font-medium text-gray-700"
          >
            Origin
          </label>
          <TrainOption
            station={rw}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
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
          className="w-full bg-sky-400 hover:bg-sky-500 cursor-pointer transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md"
          onClick={() => calculateFare()}
        >
          Calculate Trip
        </button>

        {calculated && fare !== null && (
          <p className="text-sky-500 font-semibold">Fare: ₱{fare}</p>
        )}
        {calculated && fare === null && (
          <p className="text-sky-500 font-semibold">Fare: ₱0.00</p>
        )}
      </form>
    </div>
  );
}
