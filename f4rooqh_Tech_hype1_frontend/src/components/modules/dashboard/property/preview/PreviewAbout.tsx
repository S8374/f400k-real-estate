'use client';

import { Card } from '@/components/ui/card';

interface PreviewAboutProps {
    previewData: any;
}

export const PreviewAbout = ({ previewData }: PreviewAboutProps) => {
    return (
        <Card className="bg-stone-900 border-white/10 p-6">
            <h2 className="text-lg mb-4">About This Property</h2>
            <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                {previewData?.description}
            </p>
        </Card>
    );
};
