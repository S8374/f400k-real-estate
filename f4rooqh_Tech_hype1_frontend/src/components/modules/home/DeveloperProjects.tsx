"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DeveloperProjects() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: developerResponse, isLoading } = useGetDeveloperQuery({});

  if (isLoading) {
    return (
      <section className="py-10 lg:py-16 p-4 lg:p-8 overflow-hidden">
        <div className="flex flex-col text-left mb-12 animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
            <div className="h-8 bg-zinc-800 rounded w-72 md:w-96" />
          </div>
          <div className="h-4 bg-zinc-800 rounded w-64 ml-4 mt-2" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-[300px] shrink-0 h-[380px] bg-zinc-800/50 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const developersRaw =
    developerResponse?.data?.data?.data ||
    developerResponse?.data?.data ||
    developerResponse?.data ||
    [];

  const developerProjects = (Array.isArray(developersRaw) ? developersRaw : []).map((developer: any) => ({
    id: developer?.id,
    image: developer?.logoUrl || developer?.image || "/developer_project.png",
    title: developer?.name || "Unknown Developer",
    description: developer?.description || "",
    website: developer?.website || developer?.websiteUrl || developer?.url || "#",
  }));

  return (
    <section className="py-10 lg:py-16 p-4 lg:p-8">
        {/* Section Title & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Projects by Developers in KSA
              </h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl ml-4">
              Discover breathtaking developments from leading visionaries across Saudi Arabia
            </p>
          </div>
          
          {/* Custom Navigation Arrows */}
          <div className="flex items-center gap-3 ml-4 md:ml-0">
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div className="relative pb-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.1}
            loop={developerProjects.length >= 3}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 3 },
              1536: { slidesPerView: 3 },
            }}
          >
            {developerProjects.map((project, index) => (
              <SwiperSlide key={project.id || index}>
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                  onMouseLeave={() => swiperRef.current?.autoplay.start()}
                  className="group cursor-pointer block w-full relative pt-2 pb-6 px-1"
                >
                  {/* Card Container */}
                  <div className="flex flex-col w-full h-[320px] md:h-[350px] rounded overflow-hidden shadow-lg border border-white/5 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:-translate-y-2">
                    
                    {/* Top Header Area */}
                    <div className="w-full bg-[#0B1527] py-3 px-4 text-center border-b border-white/10 group-hover:bg-[#111f3a] transition-all duration-300">
                      <h3 className="text-lg md:text-xl font-semibold text-white truncate">
                        {project.title}
                      </h3>
                    </div>

                    {/* Image Area (White BG so dark logos are visible) */}
                    <div className="relative w-full flex-1 bg-white flex items-center justify-center p-6">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 24vw"
                        className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-500" />
                    </div>

                    {/* Bottom Button Area */}
                    <div className="w-full bg-[#0B1527] py-4 md:py-5 px-4 text-center border-t border-white/10 group-hover:bg-[#111f3a] transition-all duration-300">
                      <p className="text-white text-xs md:text-sm font-semibold uppercase tracking-widest line-clamp-1">
                        VISIT WEBSITE
                      </p>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
    </section>
  );
}
