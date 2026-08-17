'use client';

import { Card } from '@/components/ui/card';

interface PreviewMetricsCardsProps {
    previewData: any;
}

export const PreviewMetricsCards = ({ previewData }: PreviewMetricsCardsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                <p className="text-zinc-400 text-sm">Price</p>
                <p className="text-2xl font-light mt-1">{previewData?.price}</p>
            </Card>
            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                <p className="text-zinc-400 text-sm">Size</p>
                <p className="text-2xl font-light mt-1">{previewData?.sizeM2}</p>
                <p className="text-zinc-500 text-sm">{previewData?.sizeSqft}</p>
            </Card>
            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                <p className="text-zinc-400 text-sm">ROI</p>
                <p className="text-emerald-500 text-2xl font-light mt-1">{previewData?.roi}</p>
                <p className="text-zinc-500 text-sm">Annual</p>
            </Card>
        </div>
    );
};
