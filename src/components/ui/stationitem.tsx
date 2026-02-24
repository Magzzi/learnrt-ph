'use client';

import { Train } from 'lucide-react';

export default function StationItem({ label = "Station Name", distance = "" }) {
  return (
    <li className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-colors cursor-pointer">
      <Train 
        className="text-emerald-400 flex-shrink-0" 
        size={16}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <span className="text-gray-300 font-medium text-sm sm:text-base truncate pr-2">
          {label}
        </span>
        <span className="text-gray-500 sm:text-gray-400 text-xs sm:text-sm font-normal sm:font-medium whitespace-nowrap">
          {distance}
        </span>
      </div>
    </li>
  );
}