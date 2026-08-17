"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface PropertyUnitsTabProps {
  units: any[];
  setUnitModalOpen: (val: boolean) => void;
  setUnitId: (id: string) => void;
  setEditUnitModalOpen: (val: boolean) => void;
  handleDeleteUnit: (id: string) => void;
}

export function PropertyUnitsTab({
  units,
  setUnitModalOpen,
  setUnitId,
  setEditUnitModalOpen,
  handleDeleteUnit,
}: PropertyUnitsTabProps) {
  return (
    <TabsContent value="units" className="mt-4">
      <div className="flex justify-between items-center bg-stone-900 p-3 rounded border border-stone-800 mb-4">
        <p className="text-stone-400 text-sm">
          Manage individual units within this property.
        </p>
        <Button
          onClick={() => setUnitModalOpen(true)}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
        >
          <Plus className="h-4 w-4" /> Add Unit
        </Button>
      </div>
      {units && units.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {units.map((unit: any, idx: number) => (
              <div
                key={idx}
                className="bg-stone-800/30 p-3 rounded border border-stone-700 flex justify-between items-center"
              >
                {/* Unit Info */}
                <div>
                  <p className="font-medium text-white">
                    {unit.title} {unit.unitNumber}
                  </p>
                  <p className="text-xs text-gray-400">
                    {unit.bedrooms} Bed • {unit.areaSqm} m²
                  </p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <Badge
                    className={
                      unit.status === "AVAILABLE"
                        ? "bg-emerald-600"
                        : "bg-yellow-600"
                    }
                  >
                    {unit.status}
                  </Badge>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setUnitId(unit?.id);
                      setEditUnitModalOpen(true);
                    }}
                    className="cursor-pointer p-1.5 rounded bg-stone-700 hover:bg-stone-600 transition"
                  >
                    <Pencil size={14} className="text-blue-400" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="cursor-pointer p-1.5 rounded bg-stone-700 hover:bg-red-600 transition"
                  >
                    <Trash2 size={14} className="text-red-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-stone-800 rounded">
          <p className="text-lg text-white mb-2">No units created yet</p>
          <Button
            onClick={() => setUnitModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Unit
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
