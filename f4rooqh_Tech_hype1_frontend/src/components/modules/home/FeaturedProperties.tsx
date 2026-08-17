"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import PropertyCard from "../dashboard/property/PropertyCard";
import { useState, useMemo, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { Property } from "@/types/property";
import { useGetTrendingPropertiesQuery } from "@/redux/api/propertyApi";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FeaturedPropertyCard = Property & {
  createdAt?: string;
  zoneId?: string;
};

function FeaturedProperties() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: trendingPropertiesData, isLoading } = useGetTrendingPropertiesQuery(undefined);
  const { data: zonesResponse } = useGetAllZonesQuery(undefined);
  const zones = zonesResponse?.data?.filter((z: any) => z.isActive !== false) || [];
  
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  // Transform API response to Property type
  const transformedProperties: FeaturedPropertyCard[] = useMemo(() => {
    if (!trendingPropertiesData || !Array.isArray(trendingPropertiesData)) {
      return [];
    }

    return trendingPropertiesData.map((property: any) => ({
      id: property.id,
      title: property.title || "Untitled Property",
      subtitle: property.agent?.user?.fullName || property.location || "",
      price: `${property.currency} ${property.price}`,
      roi: `${property.roiProjectionPercent}%` || "N/A",
      area: `${property.areaSqm} sqm`,
      images: property.images || [],
      badge: property.type || null,
      verified: property.isRegaVerified || false,
      trophy: property.status === "ACTIVE" || false,
      latitude: property.latitude,
      longitude: property.longitude,
      createdAt: property.createdAt,
      views: property.views || 0,
      zoneId: property.zoneId || property.zone?.id,
    }));
  }, [trendingPropertiesData]);

  const sortedProperties = useMemo(
    () =>
      [...transformedProperties].sort((a, b) => {
        // Sort by views (highest first)
        const aViews = a.views || 0;
        const bViews = b.views || 0;
        if (bViews !== aViews) {
          return bViews - aViews;
        }
        // If views are equal, sort by creation date (newest first)
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }),
    [transformedProperties],
  );

  const filteredProperties = useMemo(() => {
    if (!activeZoneId) return sortedProperties;
    
    // Find the active zone
    const activeZone = zones.find((z: any) => z.id === activeZoneId);
    
    // Get valid zone IDs (the parent zone + any of its children)
    const validZoneIds = [activeZoneId];
    if (activeZone && activeZone.children) {
      activeZone.children.forEach((child: any) => validZoneIds.push(child.id));
    }
    
    return sortedProperties.filter((p) => p.zoneId && validZoneIds.includes(p.zoneId));
  }, [sortedProperties, activeZoneId, zones]);

  if (isLoading) {
    return (
      <div className="my-4 p-4 rounded">
        <h1 className="text-xl my-6 px-4 font-semibold">Trending Properties</h1>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-64 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="trending-properties" className=" p-4 lg:p-8 rounded bg-neutral-900/40 backdrop-blur-3xl border border-white/5">
      <div className="flex flex-col text-left mb-8 px-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Trending Properties
            </h2>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <button onClick={() => scrollTabs("left")} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTabs("right")} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-zinc-400 text-sm max-w-2xl ml-4 mb-6">
          Discover the most sought-after properties currently on the market
        </p>

        {/* Zone Filter Tabs */}
        {zones.length > 0 && (
          <div className="w-full overflow-hidden px-4">
            <div ref={scrollContainerRef} className="flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-4 pt-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <button
                onClick={() => setActiveZoneId(null)}
                className={`px-5 py-2 rounded text-sm font-semibold transition-all duration-300 border flex-shrink-0 snap-start ${
                  activeZoneId === null
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
              >
              All
            </button>
            {zones.filter((z: any) => !z.parentId).map((zone: any) => (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={`px-5 py-2 rounded text-sm font-semibold transition-all duration-300 border flex-shrink-0 snap-start ${
                  activeZoneId === zone.id
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                {zone.name}
              </button>
            ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {filteredProperties.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            No trending properties found in this zone.
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.2}
            loop={filteredProperties.length >= 5}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 },
            }}
          >
            {filteredProperties.map((property, index) => (
              <SwiperSlide key={property.id ?? index}>
                <div
                  onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                  onMouseLeave={() => swiperRef.current?.autoplay.start()}
                >
                  <PropertyCard property={property} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default FeaturedProperties;
