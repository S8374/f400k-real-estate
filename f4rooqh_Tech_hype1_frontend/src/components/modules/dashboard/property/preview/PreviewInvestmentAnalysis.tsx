'use client';

import { Card } from '@/components/ui/card';

interface PreviewInvestmentAnalysisProps {
    previewData: any;
}

export const PreviewInvestmentAnalysis = ({ previewData }: PreviewInvestmentAnalysisProps) => {
    return (
        <Card className="bg-neutral-800 border-white/10 p-6">
            <h2 className="text-lg mb-6">Investment Analysis</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-700 rounded px-4 py-4">
                    <p>Est. Monthly Rent</p>
                    <p className="font-medium">{previewData?.monthlyRent}</p>
                </div>
                <div className="flex justify-between items-center bg-neutral-700 rounded px-4 py-4">
                    <p>Annual Return</p>
                    <p className="font-medium text-emerald-500">{previewData?.annualReturn}</p>
                </div>
                <div className="flex justify-between items-center bg-neutral-700 rounded px-4 py-4">
                    <p>Value Appreciation</p>
                    <p className="font-medium text-yellow-400">{previewData?.appreciation}</p>
                </div>
            </div>
        </Card>
    );
};
