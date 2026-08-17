"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function WhyInvest() {
  const scrollToZones = () => {
    const element = document.getElementById("geographic-zones");
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full relative mt-16 mb-8 bg-[#1A1A1A] overflow-hidden">
      {/* Background Image Container (Right Side) */}
      <div 
        className="absolute top-0 right-0 w-full md:w-3/4 h-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('https://shop.creativemox.com/haveno/wp-content/uploads/sites/18/2026/07/img_8.jpg')"
        }}
      >
        {/* Gradient overlays to blend the image into the dark background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A] md:hidden"></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16 flex flex-col justify-center min-h-[350px]">
        
        {/* Left Side: Text and Button */}
        <div className="max-w-xl text-left relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Invest with Confidence
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
            Explore high-potential investment zones featuring premium real estate opportunities, modern infrastructure, and strategic connectivity. Gain valuable insights to choose the best location for your next investment.
          </p>
          
          <button 
            onClick={scrollToZones}
            className="inline-flex items-center gap-3 bg-white/5 hover:bg-[#00B37E] text-white font-bold py-4 px-8 rounded transition-all duration-300 border border-white/10 hover:border-[#00B37E] shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(0,179,126,0.4)] group"
          >
            Explore Investment Zone
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
