"use client";

import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoneInfoCardProps {
  zone: any;
  onClose: () => void;
}

export default function ZoneInfoCard({ zone, onClose }: ZoneInfoCardProps) {
  if (!zone) return null;

  return (
    <div className="absolute top-6 left-6 z-50 w-full max-w-sm rounded bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Header */}
      <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-100 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-lg font-bold text-gray-900">Non-Saudi Ownership Zones</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Title Card */}
        <div className="rounded border border-gray-100 bg-white p-4 shadow-sm">
          <div className="inline-flex items-center rounded-full bg-[#187560] px-2.5 py-1 text-[10px] font-semibold text-white mb-3 tracking-wide">
            {zone.parentName || "Investment Zone"}
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight leading-tight">
            {zone.name}
          </h3>
          <p className="text-sm text-gray-500 flex items-start gap-1.5 font-medium mt-2">
            <span className="w-4 h-4 text-emerald-600 flex items-center justify-center shrink-0">📍</span>
            <span className="leading-tight">{zone.subtitle || "Saudi Arabia"}</span>
          </p>
        </div>

        {/* Ownership Rules */}
        <div className="rounded border border-gray-100 bg-white p-4 shadow-sm">
          <h4 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Ownership rules
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-[#187560] shrink-0" />
              <span className="mt-0.5">All property types are allowed</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-[#187560] shrink-0" />
              <span className="mt-0.5">All right types are allowed</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="mt-0.5">Usufruct duration 99 years</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="mt-0.5">Allowed ownership percentage (100%)</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-2">
          <Button className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 border border-emerald-600/30 rounded font-semibold shadow-sm text-[15px]">
            <span className="text-[#F5B50A] mr-2">✦</span> Ask Paseet
          </Button>
          <Button className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded font-semibold shadow-sm text-[15px]">
            <span className="text-gray-400 mr-2">📄</span> Show in P-Record
          </Button>
          <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
            Both actions use only the highlighted part on the map, not the whole zone.
          </p>
        </div>
      </div>
    </div>
  );
}
