"use client";

import { useState } from "react";

const LRT1 = [
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
];

const MRT3 = [
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
];

const LRT2 = [
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
];

type Props = {
  station: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  exclude?: string;
};

export default function TrainOption({
  station,
  value,
  onChange,
  exclude,
}: Props) {
  let options: string[] = [];

  switch (station) {
    case "LRT1":
      options = LRT1;
      break;
    case "LRT2":
      options = LRT2;
      break;
    case "MRT3":
      options = MRT3;
      break;
    default:
      return (
        <select
          id="station"
          name="station"
          className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0a1a1a] px-3 py-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
        >
          <option value="">Select a station</option>
        </select>
      );
  }

  return (
    <select
        id="station"
        name="station"
        value={value} // bind selected value
        onChange={onChange} // handle changes
        className="mt-1 block w-full rounded-lg border border-white/10 bg-[#0a1a1a] px-3 py-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
    >
        <option value="">Select a station</option>
        {options
        .filter((s) => s !== exclude)
        .map((s) => (
            <option key={s} value={s}>
            {s}
            </option>
        ))}
    </select>
    );
}
