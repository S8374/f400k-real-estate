import { Send } from "lucide-react";
import Link from "next/link";

export default function ContactBanner() {
  return (
    <div className="w-full relative mt-16 mb-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Text */}
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Find Best Place For Living
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Spend vacations in best hotels and resorts find the great place of your choice using different searching options.
          </p>
        </div>

        {/* Right Side: Button */}
        <div className="flex-shrink-0">
          <Link 
            href="/contact" 
            className="group flex items-center justify-center gap-3 bg-[#00B37E] hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded transition-all duration-300 shadow-[0_0_20px_rgba(0,179,126,0.3)] hover:shadow-[0_0_30px_rgba(0,179,126,0.5)]"
          >
            CONTACT US 
            <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </div>
  );
}
