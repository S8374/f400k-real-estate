"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import ZoneCard from "@/components/shared/cards/ZoneCard";

const ZONES_DATA = [
  {
    id: "zone-1",
    name: "Riyadh Region",
    subtitle: "The vibrant capital and ultimate business hub of the Kingdom.",
    imageUrl: "https://images.unsplash.com/photo-1586724236151-e772186588aa?q=80&w=600&auto=format&fit=crop",
    propertyCount: 142
  },
  {
    id: "zone-2",
    name: "Makkah Region",
    subtitle: "The heart of religious tourism and global hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1565552643952-2591fb83a6b6?q=80&w=600&auto=format&fit=crop",
    propertyCount: 89
  },
  {
    id: "zone-3",
    name: "Eastern Province",
    subtitle: "The massive energy, logistics, and coastal industrial hub.",
    imageUrl: "https://images.unsplash.com/photo-1572008470550-936615b3c4f7?q=80&w=600&auto=format&fit=crop",
    propertyCount: 115
  },
  {
    id: "zone-4",
    name: "Madinah Region",
    subtitle: "Rich heritage blending seamlessly with premium hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1590422998396-e2de437cf239?q=80&w=600&auto=format&fit=crop",
    propertyCount: 64
  },
  {
    id: "zone-5",
    name: "Tabuk Region",
    subtitle: "Home of NEOM and the future of sustainable living.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
    propertyCount: 47
  },
  {
    id: "zone-6",
    name: "Asir Region",
    subtitle: "Breathtaking mountain tourism and serene nature resorts.",
    imageUrl: "https://images.unsplash.com/photo-1621213032549-d101d2bd98d8?q=80&w=600&auto=format&fit=crop",
    propertyCount: 31
  },
  {
    id: "zone-7",
    name: "Jazan Region",
    subtitle: "A booming logistics, port, and coastal economic zone.",
    imageUrl: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=600&auto=format&fit=crop",
    propertyCount: 22
  }
];

import { useGetAllZonesQuery } from "@/redux/api/zoneApi";

export default function GeographicZones() {
  const swiperRef = useRef<SwiperType | null>(null);
  
  const { data: zonesData, isLoading } = useGetAllZonesQuery({});
  const dynamicZones = (zonesData?.data || []).filter((z: any) => z.isActive !== false);
  
  // Use dynamic zones if available, otherwise fallback to empty array or ZONES_DATA
  const zonesToDisplay = dynamicZones.length > 0 ? dynamicZones : ZONES_DATA;

  if (isLoading) {
    return (
      <section className="my-12 p-4 lg:p-8 rounded py-10 overflow-hidden">
        <div className="flex flex-col text-left mb-8 animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
            <div className="h-8 bg-zinc-800 rounded w-64 md:w-96" />
          </div>
          <div className="h-4 bg-zinc-800 rounded w-48 ml-4 mt-2" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-[300px] md:w-[400px] shrink-0 h-[250px] bg-zinc-800/50 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="geographic-zones" className="my-12 p-4 lg:p-8 rounded py-10   border-white/5 overflow-hidden">
      {/* Section Title */}
      <div className="flex flex-col text-left mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Geographic Zones for Foreign Investment
          </h2>
        </div>
        <p className="text-zinc-400 text-sm max-w-2xl ml-4">
          Explore exclusive investment opportunities across the major regions of Saudi Arabia
        </p>
      </div>

      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
        >
          {zonesToDisplay.filter((z: any) => !z.parentId).map((zone: any) => (
            <SwiperSlide key={zone.id}>
              <div
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
                className="h-full flex flex-col"
              >
                <ZoneCard 
                  {...zone} 
                  propertyCount={zone._count?.properties ?? zone.propertyCount ?? 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
