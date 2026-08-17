import React from "react";
import Image from "next/image";
import { ArrowRight, Map, Car } from "lucide-react";

export default function ExploreFeatures() {
  return (
    <section className="my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Find an agency */}
        <div className="relative group rounded overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 min-h-[280px] flex flex-col cursor-pointer">
          <div className="p-6 z-10 flex flex-col h-full w-2/3">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              Find an agency
            </h3>
            <p className="text-sm text-zinc-400 mb-6 flex-grow">
              Explore the diversity of properties from top agencies
            </p>
            <div className="flex items-center text-emerald-500 font-semibold text-sm">
              Explore now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
          {/* Background Image Image (Generated) */}
          <div className="absolute top-0 right-0 h-full w-2/3 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-transparent z-10" />
             <Image 
                src="/saudi_agency.png" 
                alt="Find an agency" 
                fill 
                className="object-cover object-left opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
             />
          </div>
        </div>

        {/* Card 2: Search by Drive Time */}
        <div className="relative group rounded overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 min-h-[280px] flex flex-col cursor-pointer">
          <div className="p-6 z-10 flex flex-col h-full w-2/3">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
              Search by Drive Time
            </h3>
            <p className="text-sm text-zinc-400 mb-6 flex-grow">
              Find your ideal home based on the locations you frequently visit
            </p>
            <div className="flex items-center text-blue-500 font-semibold text-sm">
              Search now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
          {/* Decorative Icon Background */}
          <div className="absolute -bottom-4 -right-4 text-blue-500/20 group-hover:text-blue-500/30 transition-colors duration-500">
             <Car className="w-48 h-48" />
          </div>
        </div>

        {/* Card 3: Map View */}
        <div className="relative group rounded overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 min-h-[280px] flex flex-col cursor-pointer">
          <div className="p-6 z-10 flex flex-col h-full w-2/3">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
              Map View
            </h3>
            <p className="text-sm text-zinc-400 mb-6 flex-grow">
              Search for properties in preferred areas using an interactive map
            </p>
            <div className="flex items-center text-purple-500 font-semibold text-sm">
              Open map <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
          {/* Decorative Icon Background */}
          <div className="absolute -bottom-4 -right-4 text-purple-500/20 group-hover:text-purple-500/30 transition-colors duration-500">
             <Map className="w-48 h-48" />
          </div>
        </div>

      </div>
    </section>
  );
}
