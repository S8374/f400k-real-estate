"use client";

import Image from "next/image";
import { ArrowRight, Eye, Target } from "lucide-react";

export default function WhoWeAre() {
  const scrollToTrending = () => {
    const element = document.getElementById("trending-properties");
    if (element) {
      // Get the nav height offset (assuming roughly 100px for the navbar)
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
    <div className="py-16 md:py-24 px-4 lg:px-8  mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col space-y-6">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full w-max">
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Who We Are</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Helping people find <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00B37E]">
              meaningful property
            </span> spaces
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            We are dedicated to transforming the Saudi Arabian real estate market by providing unparalleled access to certified properties, elite developers, and verified opportunities. Our platform bridges the gap between vision and reality.
          </p>
          <div>
            <button 
              onClick={scrollToTrending}
              className="flex items-center gap-2 bg-[#00B37E] hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
            >
              Find Trending Property <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Column: Image */}
        <div className="relative h-[400px] md:h-[500px] w-full flex justify-center items-center px-4">
          {/* We use a custom clip-path to mimic a house/arch shape, adapted for modern dark theme */}
          <div 
            className="relative w-full h-full overflow-hidden"
            style={{ 
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 100%, 75% 100%, 75% 85%, 25% 85%, 25% 100%, 0 100%, 0 25%)',
              borderRadius: '24px'
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Luxury Property"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay for dark theme blending */}
            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply"></div>
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="flex flex-col space-y-6">
          {/* Vision Card */}
          <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded shadow-lg hover:border-emerald-500/30 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                <Eye className="w-6 h-6 text-gray-400 group-hover:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  To be the Kingdom's most trusted and innovative real estate ecosystem, empowering investors with transparent and verified data.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Card - Highlighted */}
          <div className="bg-gradient-to-br from-[#00B37E]/20 to-emerald-900/40 border border-[#00B37E]/30 p-8 rounded shadow-lg hover:border-[#00B37E]/60 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00B37E]/20 rounded-lg group-hover:bg-[#00B37E]/40 transition-colors">
                <Target className="w-6 h-6 text-[#00B37E]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                <p className="text-emerald-50/70 text-sm leading-relaxed">
                  To connect buyers and developers seamlessly through a secure platform, ensuring every property transaction is authentic and reliable.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
