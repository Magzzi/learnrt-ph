"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Zap, Navigation } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const images = ["/mrt3-train.jpg", "/lrt1-train.png", "/lrt2-train.jpg"];

const railLines = [
  { name: "LRT-1", icon: <Zap size={14} /> },
  { name: "MRT-3", icon: <MapPin size={14} /> },
  { name: "LRT-2", icon: <Navigation size={14} /> },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a1a1a] overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a1a] via-[#0d2626] to-[#0a1a1a] -z-0" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center px-6 sm:px-10 lg:px-20 pt-16 pb-12 gap-12 lg:gap-16 max-w-[1400px] mx-auto">
        {/* Text Left */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[#1a2e2e] border border-[#2a4a3a] rounded-full px-4 py-2 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 text-sm font-medium">
              Live tracking enabled
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
            Navigate PH
            <br />
            <span className="text-emerald-400">rail network</span>
            <br />
            with precision
          </h1>

          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Real-time route planning, live departures, and smart wayfinding for
            every journey. Built for commuters, loved by travelers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
            <Link
              href="/trip"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25"
            >
              Plan your trip <ArrowRight size={18} />
            </Link>
            <Link
              href="/explore"
              className="border border-gray-600 hover:border-gray-400 text-white font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 transition-all duration-200 hover:bg-white/5"
            >
              View live map
            </Link>
          </div>

          {/* Rail line tags */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {railLines.map((line, idx) => (
              <span
                key={idx}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-colors duration-200 ${
                  idx === 0
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-gray-700 text-gray-400 bg-white/5 hover:border-gray-500"
                }`}
              >
                {line.icon}
                {line.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Image Right */}
        <motion.div
          className="flex-1 w-full max-w-xl lg:max-w-2xl"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Teal gradient glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Image container */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={images[currentIndex]}
                alt={`Train ${currentIndex + 1}`}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
                priority
              />
              {/* Dark gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Stats overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex gap-3">
                <div className="flex-1 bg-[#1a2e2e]/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Active routes</p>
                  <p className="text-white text-xl font-bold">3</p>
                </div>
                <div className="flex-1 bg-[#1a2e2e]/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Stations</p>
                  <p className="text-white text-xl font-bold">67</p>
                </div>
                <div className="flex-1 bg-[#1a2e2e]/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Rail lines</p>
                  <p className="text-white text-xl font-bold">LRT &amp; MRT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel dots */}
          <motion.div
            className="flex justify-center mt-5 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-emerald-400 w-6"
                    : "bg-gray-600 w-2.5 hover:bg-gray-500"
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
