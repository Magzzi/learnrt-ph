'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import { default as HomeIcon } from '@mui/icons-material/Home';
import { default as ExploreIcon } from '@mui/icons-material/Train';
import { default as TripIcon } from '@mui/icons-material/Calculate';
import { default as LandmarkIcon } from '@mui/icons-material/LocationPin';
import { default as RouteFinderIcon } from '@mui/icons-material/TravelExplore';

const links = [
  { name: 'Home', href: '/', icon: <HomeIcon fontSize="small" /> },
  { name: 'Explore', href: '/explore', icon: <ExploreIcon fontSize="small" /> },
  { name: 'Trip', href: '/trip', icon: <TripIcon fontSize="small" /> },
  { name: 'Landmarks', href: '/landmark', icon: <LandmarkIcon fontSize="small" /> },
  { name: 'Route Finder', href: '/route', icon: <RouteFinderIcon fontSize="small" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-sky-100 shadow sticky top-0 z-50">
      <div className="relative flex items-center justify-center px-4 pr-[88px] py-5">
        {/* Center: Nav Links */}
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative flex items-center gap-1 text-sm sm:text-base font-medium transition-all duration-300 ease-in-out
                  ${pathname === link.href ? 'text-sky-700' : 'text-sky-900'}
                  hover:text-black
                  before:absolute before:left-0 before:-bottom-1.5 before:h-[3px] before:bg-sky-700 before:transition-all before:duration-300
                  before:w-0 hover:before:w-full
                  ${pathname === link.href ? 'before:w-full before:h-[4px]' : ''}
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Logo */}
        <div className="absolute right-4">
          <Image
            src="https://i.postimg.cc/3rLf6Z7n/Learn-RT-Logo.png"
            alt="Logo"
            width={64}
            height={48}
            className="object-contain aspect-[4/3] w-12 h-9 sm:w-14 sm:h-10 md:w-16 md:h-12 lg:w-20 lg:h-15 transition-all duration-300 hover:brightness-125 hover:drop-shadow-lg"
          />
        </div>
      </div>
    </nav>
  );
}
