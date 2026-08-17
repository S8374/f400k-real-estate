'use client';

import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface PreviewLocationSidebarProps {
    previewData: any;
}

export const PreviewLocationSidebar = ({ previewData }: PreviewLocationSidebarProps) => {
    return (
        <div className="space-y-6">
            {/* Location & Proximity */}
            <Card className="bg-stone-900 border-white/10 p-6">
                <h3 className="text-base mb-4">Location & Proximity</h3>
                <div className="bg-zinc-800 rounded overflow-hidden mb-4">
                    <Image
                        src={previewData?.mapImage || '/no-image.png'}
                        alt="Location map"
                        width={505}
                        height={346}
                        className="w-full h-auto"
                        unoptimized
                    />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <p className="text-sm">Diriyah UNESCO Heritage Zone</p>
                </div>
            </Card>

            {/* Nearby Giga-Projects */}
            <Card className="bg-neutral-800 border-neutral-800 p-4">
                <h3 className="text-base">Nearby Giga-Projects</h3>
                <div className="flex items-center gap-x-3">
                    <div className="w-2 h-2 bg-emerald-800 rounded-full opacity-50" />
                    <div>
                        <p className="font-medium">New Murabba</p>
                        <p className="text-sm text-gray-400">12 mins to New Murabba (Mukaab)</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
