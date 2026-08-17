"use client";

import { use, useEffect, useState } from "react";
import ZoneForm from "@/components/zones/ZoneForm";
import { useGetAllZonesQuery } from "@/redux/api/adminApi";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { data: zonesData, isLoading } = useGetAllZonesQuery({});
  const [zoneToEdit, setZoneToEdit] = useState<any>(null);

  useEffect(() => {
    if (zonesData?.data) {
      let found = null;
      for (const parent of zonesData.data) {
        if (parent.id === id) {
          found = parent;
          break;
        }
        if (parent.children) {
          const child = parent.children.find((c: any) => c.id === id);
          if (child) {
            found = child;
            break;
          }
        }
      }
      
      if (found) {
        setZoneToEdit({
          id: found.id,
          name: found.name,
          subtitle: found.subtitle || "",
          imageUrl: found.imageUrl || "",
          latitude: found.latitude || undefined,
          longitude: found.longitude || undefined,
          parentId: found.parentId || "",
          color: found.color || "#10b981",
          geojson: found.geojson ? (typeof found.geojson === "string" ? found.geojson : JSON.stringify(found.geojson)) : "",
        });
      }
    }
  }, [zonesData, id]);

  if (isLoading) {
    return <div className="p-6 text-gray-400 animate-pulse font-medium">Loading zone data...</div>;
  }

  if (!zoneToEdit && !isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded font-medium shadow-lg">
          Zone not found! It may have been deleted.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto animate-in fade-in duration-700">
      <div className="mb-4">
        <Link href="/dashboard/zones" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Zones
        </Link>
      </div>
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-[#00B37E]/20 p-2.5 rounded text-[#00B37E]">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Zone</h1>
          <p className="text-gray-400 mt-1 text-sm">Modify the details of this geographic zone.</p>
        </div>
      </div>
      
      <div className="flex justify-center  mx-auto">
        {zoneToEdit && <ZoneForm isEditMode={true} initialData={zoneToEdit} />}
      </div>
    </div>
  );
}
