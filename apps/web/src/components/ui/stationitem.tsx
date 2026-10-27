'use client';

import { Train } from 'lucide-react';

interface StationItemProps {
  label?: string;
  distance?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function StationItem({ label = "Station Name", distance = "", isActive = false, onClick }: StationItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition-colors cursor-pointer ${
        isActive
          ? "bg-emerald-500/15 border-emerald-500/50"
          : "border-transparent hover:bg-emerald-500/10 hover:border-emerald-500/20"
      }`}
    >
      <Train
        className={`flex-shrink-0 ${isActive ? "text-emerald-400" : "text-emerald-400"}`}
        size={16}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <span className={`font-medium text-sm sm:text-base truncate pr-2 ${isActive ? "text-white" : "text-gray-300"}`}>
          {label}
        </span>
        <span className={`text-xs sm:text-sm font-normal sm:font-medium whitespace-nowrap ${isActive ? "text-emerald-400" : "text-gray-500 sm:text-gray-400"}`}>
          {distance}
        </span>
      </div>
    </li>
  );
}