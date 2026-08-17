import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ZoneCardProps {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  propertyCount?: number;
}

export default function ZoneCard({ id, name, subtitle, imageUrl, propertyCount }: ZoneCardProps) {
  return (
    <Link 
      href={`/properties?zoneId=${id}`}
      className="group relative block w-full h-[360px] rounded overflow-hidden cursor-pointer shadow-2xl"
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        unoptimized
      />
      
      {/* ── Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

      {/* ── Content Panel (No Blur) ── */}
      <div className="absolute inset-x-3 bottom-3 p-5 flex flex-col justify-end bg-black/50 border border-white/10 rounded transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-black/60 group-hover:border-emerald-500/50 shadow-lg">
        
        {/* Top bar of the card content */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-xl font-bold leading-tight line-clamp-2 min-h-[3.5rem] text-white drop-shadow-md transition-colors">
            {name}
          </h3>
          {propertyCount !== undefined && (
            <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-emerald-500/80 text-white text-[10px] uppercase tracking-wider font-bold rounded border border-emerald-400/50 shadow-sm">
              {propertyCount} listed
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-100 mb-5 line-clamp-2 leading-relaxed min-h-[2.5rem] drop-shadow-md font-medium">
          {subtitle}
        </p>
        
        {/* Action button */}
        <div className="flex items-center justify-center w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold text-sm transition-colors duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <span>Explore Zone</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
