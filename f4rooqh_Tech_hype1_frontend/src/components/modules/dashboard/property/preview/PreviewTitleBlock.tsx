'use client';

import { MapPin } from 'lucide-react';

interface PreviewTitleBlockProps {
    previewData: any;
}

export const PreviewTitleBlock = ({ previewData }: PreviewTitleBlockProps) => {
    return (
        <div className='border p-2 bg-stone-900/60 rounded'>
            <h1 className="text-3xl font-light">{previewData?.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <p>{previewData?.location}</p>
            </div>
        </div>
    );
};
