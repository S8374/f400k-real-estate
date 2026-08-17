'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PreviewImageGallery } from './preview/PreviewImageGallery';
import { PreviewMetricsCards } from './preview/PreviewMetricsCards';
import { PreviewTitleBlock } from './preview/PreviewTitleBlock';
import { PreviewPaymentPlans } from './preview/PreviewPaymentPlans';
import { PreviewAbout } from './preview/PreviewAbout';
import { PreviewInvestmentAnalysis } from './preview/PreviewInvestmentAnalysis';
import { PreviewLocationSidebar } from './preview/PreviewLocationSidebar';
import { PreviewBottomBar } from './preview/PreviewBottomBar';

const PropertyPreviewClient = () => {
    const searchParams = useSearchParams();
    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        const previewDataParam = searchParams.get('previewData');
        if (previewDataParam) {
            try {
                const parsedData = JSON.parse(previewDataParam);
                setPreviewData(parsedData);
            } catch (error) {
                console.error("Error parsing preview data:", error);
            }
        }
    }, [searchParams]);

    if (!previewData) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
                Loading preview...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 py-1 lg:px-8 lg:py-2 mb-24">
                {/* Main Image Swiper and Headers */}
                <PreviewImageGallery previewData={previewData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-7">
                    {/* Left Side - Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        <PreviewMetricsCards previewData={previewData} />
                        <PreviewTitleBlock previewData={previewData} />
                        <PreviewPaymentPlans previewData={previewData} />
                        <PreviewAbout previewData={previewData} />
                        <PreviewInvestmentAnalysis previewData={previewData} />
                    </div>

                    {/* Right Side - Location & Nearby */}
                    <PreviewLocationSidebar previewData={previewData} />
                </div>

                {/* Bottom Fixed Bar */}
                <PreviewBottomBar previewData={previewData} />
            </div>
        </div>
    );
};

export default PropertyPreviewClient;