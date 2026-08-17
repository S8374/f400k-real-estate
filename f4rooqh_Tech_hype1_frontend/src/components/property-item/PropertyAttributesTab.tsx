"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface PropertyAttributesTabProps {
  attributes: any[];
  setAttributeModal: (val: boolean) => void;
  setSelectedAttribute: (attr: any) => void;
  setEditAttributeModal: (val: boolean) => void;
  handleDeleteAttribute: (id: string) => void;
}

export function PropertyAttributesTab({
  attributes,
  setAttributeModal,
  setSelectedAttribute,
  setEditAttributeModal,
  handleDeleteAttribute,
}: PropertyAttributesTabProps) {
  return (
    <TabsContent value="attributes" className="mt-4">
      <div className="flex justify-between items-center bg-stone-900 p-3 rounded border border-stone-800 mb-4">
        <p className="text-stone-400 text-sm">
          Manage additional attributes for this property.
        </p>
        <Button
          onClick={() => setAttributeModal(true)}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
        >
          <Plus className="h-4 w-4" /> Add Attribute
        </Button>
      </div>
      {attributes && attributes.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {attributes.map((attr: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-stone-800/30 p-3 rounded border border-stone-700 hover:border-stone-600 transition"
              >
                {/* Attribute Key */}
                <p className="text-sm font-medium text-white">
                  {attr.key?.slice(0, 15)}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setSelectedAttribute(attr);
                      setEditAttributeModal(true);
                    }}
                    className="cursor-pointer p-1.5 rounded bg-stone-700 hover:bg-stone-600 transition"
                  >
                    <Pencil size={14} className="text-blue-400" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteAttribute(attr.id)}
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
          <p className="text-lg text-white mb-2">No attributes added yet</p>
          <Button
            onClick={() => setAttributeModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Attribute
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
