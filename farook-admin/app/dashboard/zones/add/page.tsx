import ZoneForm from "@/components/zones/ZoneForm";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddZonePage() {
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Add New Zone</h1>
          <p className="text-gray-400 mt-1 text-sm">Create a new geographic zone or sub-zone for your platform.</p>
        </div>
      </div>
      
      <div className="flex justify-center  mx-auto">
        <ZoneForm isEditMode={false} />
      </div>
    </div>
  );
}
