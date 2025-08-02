'use client';

import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';

export default function StationItem({ label = "Station Name", distance = "" }) {
  return (
    <li className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
      <DirectionsRailwayIcon 
        className="text-blue-600 flex-shrink-0" 
        fontSize="small" 
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <span className="text-gray-700 font-medium text-sm sm:text-base truncate pr-2">
          {label}
        </span>
        <span className="text-gray-600 sm:text-gray-700 text-xs sm:text-sm font-normal sm:font-medium whitespace-nowrap">
          {distance}
        </span>
      </div>
    </li>
  );
}