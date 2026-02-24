"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Train, Map, Calculator, MapPin, Route, Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: <Train size={16} /> },
  { name: "Explore", href: "/explore", icon: <Map size={16} /> },
  { name: "Trip Planner", href: "/trip", icon: <Calculator size={16} /> },
  { name: "Landmarks", href: "/landmark", icon: <MapPin size={16} /> },
  { name: "Route Finder", href: "/route", icon: <Route size={16} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#0a1a1a] border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 max-w-[1400px] mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-1.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Train className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            LearnRT
          </span>
        </Link>

        {/* Center: Nav Links (desktop) */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Get Started + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="hidden sm:inline-flex bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d2222]">
          <ul className="flex flex-col list-none m-0 p-0 py-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-6 py-3 border-t border-white/10">
            <Link
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
