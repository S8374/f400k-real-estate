import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, VectorSquare, Car, BedDouble, Bath } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Unit = {
  id: string;
  title?: string;
  description?: string;
  unitNumber: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "RENTED" | "OFF_MARKET" | "UNDER_OFFER" | "SELL";
  price: number;
  currency: string;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  images?: string[];
  isFeatured?: boolean;
  isPricedOnRequest?: boolean;
};

type Props = {
  unit: Unit | null;
  open: boolean;
  onClose: () => void;
};

export default function UnitDetailsModal({ unit, open, onClose }: Props) {
  if (!unit) return null;

  const copyAd = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("AD ID copied");
  };

  // Sort images so videos come first
  const sortedMedia = [...(unit.images || [])].sort((a, b) => {
    const isAVideo = a.match(/\.(mp4|webm|ogg)$/i) !== null;
    const isBVideo = b.match(/\.(mp4|webm|ogg)$/i) !== null;
    if (isAVideo && !isBVideo) return -1;
    if (!isAVideo && isBVideo) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-stone-800 text-white">
        <DialogHeader className="border-b border-stone-800 pb-4">
          <div className="flex justify-between items-center pr-8">
            <DialogTitle className="text-2xl font-bold text-emerald-400">
              {unit.title || `Unit #${unit.unitNumber}`}
            </DialogTitle>
            <Badge
              className={`text-xs px-3 py-1 rounded-full text-white ${
                unit.status === "AVAILABLE"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : unit.status === "SOLD" || unit.status === "OFF_MARKET"
                  ? "bg-red-600 hover:bg-red-700"
                  : unit.status === "SELL" || unit.status === "UNDER_OFFER"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {unit.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {sortedMedia.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-emerald-400">Media</h3>
              <div className="relative rounded-xl overflow-hidden bg-black border border-stone-700">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: ".modal-custom-prev",
                    nextEl: ".modal-custom-next",
                  }}
                  pagination={{ clickable: true }}
                  loop={sortedMedia.length > 1}
                  className="aspect-video"
                >
                  {sortedMedia.map((url, idx) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) !== null;
                    const videoSrc = url.startsWith("blob:") ? url : `/api/video-proxy?url=${encodeURIComponent(url)}`;
                    return (
                      <SwiperSlide key={idx} className="flex items-center justify-center">
                        {isVideo ? (
                          <video
                            className="object-contain w-full h-[60vh] max-h-[60vh]"
                            controls
                            crossOrigin="anonymous"
                            preload="metadata"
                          >
                            <source src={videoSrc} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={url}
                            alt={`Media ${idx + 1}`}
                            width={800}
                            height={600}
                            className="object-contain w-full h-[60vh] max-h-[60vh]"
                          />
                        )}
                      </SwiperSlide>
                    );
                  })}
                  
                  {/* Custom Navigation Arrows */}
                  <button type="button" className="modal-custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/60 hover:bg-neutral-700/80 cursor-pointer rounded-full p-2 shadow-lg transition">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button type="button" className="modal-custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/60 hover:bg-neutral-700/80 rounded-full cursor-pointer p-2 shadow-lg transition">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </Swiper>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-800/50 p-4 rounded border border-stone-800 text-center">
              <p className="text-sm text-gray-400 mb-1">Price</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Image src="/saudi-rial.svg" alt="sar" width={16} height={16} />
                {unit.price}
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border border-stone-800 text-center">
              <p className="text-sm text-gray-400 mb-1">Area</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
                <VectorSquare className="w-4 h-4 text-emerald-500" />
                {unit.areaSqm} sqm
              </p>
            </div>

            <div className="bg-stone-800/50 p-4 rounded border border-stone-800 text-center">
              <p className="text-sm text-gray-400 mb-1">Bedrooms</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
                <BedDouble className="w-4 h-4 text-emerald-500" />
                {unit.bedrooms}
              </p>
            </div>

            <div className="bg-stone-800/50 p-4 rounded border border-stone-800 text-center">
              <p className="text-sm text-gray-400 mb-1">Bathrooms</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
                <Bath className="w-4 h-4 text-emerald-500" />
                {unit.bathrooms}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-stone-800/50 px-4 py-2 rounded flex items-center gap-2 border border-stone-800 flex-1 justify-center">
               <Car className="w-4 h-4 text-emerald-500" />
               <span className="text-white">{unit.parkingSlots} Parking Slots</span>
            </div>
            
            <button
              onClick={() => copyAd(unit.id)}
              className="bg-stone-800/50 hover:bg-stone-700 px-4 py-2 rounded flex items-center gap-2 border border-stone-800 transition-colors flex-1 justify-center"
            >
              <span className="text-white text-sm">Unit #{unit.unitNumber}</span>
              <Copy className="text-emerald-500 w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          {unit.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-emerald-400">Description</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed bg-stone-800/30 p-4 rounded border border-stone-800">
                {unit.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
