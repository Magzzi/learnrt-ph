"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import TrainList from "@/components/ui/trainlist";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import Link from "next/link";

const images = ["/mrt3-train.jpg", "/lrt1-train.png", "/lrt2-train.jpg"];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1555557356-51c5d7a8f4c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Faint Railway Background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center mt-12 ml-8 mr-8 gap-10">
        {/* Text Left */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-center md:text-left text-[#101010]">
            Discover & Navigate the <br />
            <span className="text-sky-700 ">Philippine Railway System</span>
          </h1>

          <p className="flex items-center whitespace-nowrap text-gray-800 mb-6 font-light text-sm sm:text-base bg-white/70 rounded-lg px-4 py-2 shadow-sm border border-gray-200 max-w-full overflow-hidden">
            <LightbulbIcon className="text-yellow-400 mr-2" fontSize="small" />
            <span>
              <span className="font-semibold text-yellow-600">LearnRT</span>{" "}
              helps you explore train routes, stations, and landmarks — all in
              one place.
            </span>
          </p>

          <Link href="/explore"
          className="bg-sky-400 w-fit hover:bg-sky-500 cursor-pointer transition-colors duration-200 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 mx-auto md:mx-0 shadow-md">
            Get Started <ArrowRight size={18} />
          </Link>
          {/* Railway List */}
          <TrainList />
        </div>

        {/* Image Right */}
        <div className="flex-1 w-full px-4">
          <div className="bg-white/70 p-4 rounded-xl shadow-md w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
            {/* Image container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[1170/780] rounded-xl overflow-hidden">
              <Image
                src={images[currentIndex]}
                alt={`Train UI ${currentIndex + 1}`}
                fill
                className="object-cover transition-all duration-500 ease-in-out"
                priority
              />
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-3 gap-2 flex-wrap">
                {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full border ${
                  idx === currentIndex
                    ? "bg-sky-500 border-sky-700/50"
                    : "bg-white border-gray-500/50"
                  }`}
                />
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* overview section */}
    </div>
  );
}
