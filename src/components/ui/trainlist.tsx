"use client";

export default function TrainList() {
  return (
    <div className="flex gap-4 mt-8 justify-center md:justify-start">
      {["LRT-1", "MRT-3", "LRT-2", "PNR", "NSCR", "MRT-7"].map((line) => (
        <button
          key={line}
          className="border border-gray-300 bg-white text-gray-800 font-medium px-5 py-2 rounded-full text-sm shadow-sm 
                                  hover:scale-105 hover:bg-sky-100 hover:border-sky-300 transition-all duration-200"
        >
          {line}
        </button>
      ))}
    </div>
  );
}
