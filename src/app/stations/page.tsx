"use client";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function StationsPage() {
  return (
    <div className="min-h-screen bg-[#0a1a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#1a2e2e] border border-[#2a4a3a] rounded-full px-4 py-2 mb-4">
            <MapPin size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">All Stations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Stations
          </h1>
          <p className="text-gray-400 text-base">Station directory coming soon.</p>
        </motion.div>
      </div>
    </div>
  );
}