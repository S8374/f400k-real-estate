'use client';

import { Button } from '@/components/ui/button';
import { Check, Heart } from 'lucide-react';

interface PreviewBottomBarProps {
    previewData: any;
}

export const PreviewBottomBar = ({ previewData }: PreviewBottomBarProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur border-t border-white/10 px-4 py-4 lg:px-14 z-50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xl font-bold">SAR 4,100,000</p>
                <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="rounded-full px-6 border-white/10 text-white bg-transparent hover:bg-white/10">
                        <Heart className="w-5 h-5 mr-2" />
                        Save
                    </Button>
                    <Button size="lg" className="bg-emerald-800 hover:bg-emerald-700 rounded-full px-8 text-white">
                        <Check className="w-5 h-5 mr-2" />
                        Contact Agent
                    </Button>
                </div>
            </div>
        </div>
    );
};
