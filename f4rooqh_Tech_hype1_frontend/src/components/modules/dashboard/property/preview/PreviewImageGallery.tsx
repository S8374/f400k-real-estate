'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight, Verified, CircleAlert, Edit, CircleCheckBig, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PreviewImageGalleryProps {
    previewData: any;
}

export const PreviewImageGallery = ({ previewData }: PreviewImageGalleryProps) => {
    const router = useRouter();

    const handlePublish = () => {
        console.log("Confirmed & Published Data:", previewData);
        toast.success("Property Published Successfully!");
        router.push("/dashboard");
    };

    return (
        <div className="relative rounded overflow-hidden">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                    prevEl: '.custom-prev',
                    nextEl: '.custom-next',
                }}
                pagination={{ clickable: true }}
                loop={(previewData?.images?.length || 0) > 1}
                className="aspect-video lg:aspect-auto"
            >
                {previewData.images?.map((img: any, i: any) => (
                    <SwiperSlide key={i}>
                        <Image
                            src={img}
                            alt={`Property image ${i + 1}`}
                            width={1320}
                            height={500}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Arrows */}
                <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 cursor-pointer rounded-full p-3 shadow-lg transition">
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 rounded-full cursor-pointer p-3 shadow-lg transition">
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </Swiper>

            {/* Golden Visa Badge */}
            <div className="absolute top-6 left-6 z-10">
                <div className="bg-linear-to-b from-amber-200 to-yellow-600 rounded px-4 py-6 shadow-xl">
                    <p className="text-black text-xs font-bold text-center leading-tight">
                        Golden<br />Visa<br />Eligible
                    </p>
                </div>
            </div>
            <div className="absolute top-6 right-6 z-10">
                <div className="bg-linear-to-b from-green-800 to-green-900 rounded px-6 py-2 shadow-xl">
                    <p className="text-lg text-center leading-tight flex flex-col">
                        <span className='flex items-center gap-x-1'>
                            <Verified />
                            REGA</span> <span>
                            VERIFIED
                        </span>
                    </p>
                </div>
            </div>
            <div className="absolute top-0 z-10 w-full">
                <div className="flex items-center justify-between bg-linear-to-b from-green-600 to-green-900 px-16 py-2 shadow-xl">
                    <div className='flex items-center gap-2'>
                        <div>
                            <CircleAlert />
                        </div>
                        <div>
                            <p className='text-sm'>Preview Mode</p>
                            <p className='text-xs'>This is a preview. Your listing is not yet visible to buyers.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant="ghost"
                            className="bg-white text-black hover:bg-emerald-800/50"
                            onClick={() => router.back()} // Back to AddPropertyModal
                        >
                            <Edit className="mr-2 h-5 w-5" />
                            Back to Edit
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-500 gap-2"
                            onClick={handlePublish}
                        >
                            <CircleCheckBig />
                            Confirm & Publish
                        </Button>

                        <Button
                            onClick={() => router.push("/dashboard")} // Cross → সব বন্ধ + ড্যাশবোর্ডে
                            className="text-white bg-emerald-500"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Heart Icon */}
            <button className="absolute bottom-6 right-6 bg-green-600 rounded-full p-4 shadow-2xl hover:bg-green-700 transition z-10">
                <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            </button>
        </div>
    );
};
