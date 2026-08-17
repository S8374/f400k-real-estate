"use client";

import { Copy, Car, VectorSquare, BedDouble, Bath } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import UnitDetailsModal from "../modal/UnitDetailsModal";

type Unit = {
  id: string;
  unitNumber: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "RENTED" | "OFF_MARKET" | "UNDER_OFFER" | "SELL";
  price: number;
  currency: string;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  title?: string;
  description?: string;
  images?: string[];
  isFeatured?: boolean;
  isPricedOnRequest?: boolean;
};

type UnitsTableProps = {
  units: Unit[];
};

export default function UnitsTable({ units }: UnitsTableProps) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const copyAd = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("AD ID copied");
  };

  // filter units by status
  const filteredUnits = (status: string) => {
    if (status === "All") return units;

    return units.filter(
      (unit) => unit.status?.toLowerCase() === status.toLowerCase()
    );
  };

  const renderUnits = (status: string) => {
    const filtered = filteredUnits(status);
    
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-neutral-900 border border-neutral-700 rounded text-center">
          <VectorSquare className="w-12 h-12 text-zinc-500 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-zinc-300">No units available</h3>
          <p className="text-sm text-zinc-500 mt-1">
            {status === "All" 
              ? "There are no units associated with this property yet." 
              : `There are no units currently matching the '${status}' status.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((unit) => {
        const sold =
          unit.status === "SOLD"
            ? 100
            : unit.status === "RESERVED"
            ? 70
            : 20;

        return (
          <div
            key={unit.id}
            className="bg-neutral-900 border border-neutral-700 rounded p-4 text-white space-y-4"
          >
            {/* Status */}
            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full
                ${
                  unit.status === "AVAILABLE"
                    ? "bg-emerald-600"
                    : unit.status === "SOLD" || unit.status === "OFF_MARKET"
                    ? "bg-red-600"
                    : unit.status === "SELL" || unit.status === "UNDER_OFFER"
                    ? "bg-orange-500"
                    : "bg-amber-600"
                }`}
              >
                {unit.status}
              </span>

              <span className="text-xs text-zinc-400">{sold}%</span>
            </div>

            {/* Progress */}
            <div>
              <p className="text-xs mb-1">Sold Units</p>

              <div className="w-full bg-zinc-700 h-2 rounded-full">
                <div
                  style={{ width: `${sold}%` }}
                  className={`h-2 rounded-full
                  ${
                    unit.status === "SOLD"
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-yellow-400 to-green-600"
                  }`}
                />
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Price */}
              <div className="bg-white/10 p-3 rounded flex flex-col items-center">
                <p>{unit.price}</p>

                <p className="text-zinc-400 flex items-center gap-1">
                  <Image
                    src="/saudi-rial.svg"
                    alt="sar"
                    width={16}
                    height={16}
                  />
                  {unit.currency}
                </p>
              </div>

              {/* Area */}
              <div className="bg-white/10 p-3 rounded flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <VectorSquare className="w-4 h-4" />
                  <p>{unit.areaSqm} sqm</p>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Car className="w-4 h-4" />
                  <p>{unit.parkingSlots} Parking</p>
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="bg-white/10 p-3 rounded flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <p>{unit.bedrooms} Beds</p>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Bath className="w-4 h-4" />
                  <p>{unit.bathrooms} Baths</p>
                </div>
              </div>

              {/* Unit Number */}
              <button
                onClick={() => copyAd(unit.id)}
                className="bg-white/10 rounded flex items-center justify-center gap-2 text-sm"
              >
                Unit #{unit.unitNumber}
                <Copy className="text-emerald-500 w-4 h-4" />
              </button>

              {/* More Info */}
              <Button 
                onClick={() => setSelectedUnit(unit)}
                className="col-span-2 bg-white/10 hover:bg-emerald-600 h-10"
              >
                More Info
              </Button>
            </div>
          </div>
        );
      })}
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Units Table</h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All" className="w-full">
        <div className="flex w-full overflow-x-auto no-scrollbar pb-2">
          <TabsList className="bg-neutral-900 border border-neutral-700 w-max shrink-0 ml-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            {/* <TabsTrigger value="AVAILABLE">Available</TabsTrigger> */}
            <TabsTrigger value="SELL">Sell</TabsTrigger>
            <TabsTrigger value="RENTED">Rented</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="All">
          {renderUnits("All")}
        </TabsContent>

        <TabsContent value="AVAILABLE">
          {renderUnits("AVAILABLE")}
        </TabsContent>

        <TabsContent value="SELL">
          {renderUnits("SELL")}
        </TabsContent>

        <TabsContent value="RENTED">
          {renderUnits("RENTED")}
        </TabsContent>
      </Tabs>

      <UnitDetailsModal 
        unit={selectedUnit} 
        open={!!selectedUnit} 
        onClose={() => setSelectedUnit(null)} 
      />
    </div>
  );
}