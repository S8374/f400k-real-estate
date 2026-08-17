"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, User, Shield } from "lucide-react";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";

interface PropertyInvisitorTabProps {
  invisitors: any[];
  hasInvisitor: boolean;
  setInvisitorModal: (val: boolean) => void;
  setSelectedInvisitor: (invisitor: any) => void;
  setEditInvisitorModal: (val: boolean) => void;
  deleteInvisitorLoading: boolean;
  handleDeleteInvisitor: (id: string) => void;
}

export function PropertyInvisitorTab({
  invisitors,
  hasInvisitor,
  setInvisitorModal,
  setSelectedInvisitor,
  setEditInvisitorModal,
  deleteInvisitorLoading,
  handleDeleteInvisitor,
}: PropertyInvisitorTabProps) {
  return (
    <TabsContent value="invisitor" className="mt-4">
      <div className="flex justify-between items-center bg-stone-900 p-3 rounded border border-stone-800 mb-4">
        <p className="text-stone-400 text-sm">
          Manage invisitors for this property.
        </p>
        {!hasInvisitor && (
          <Button
            onClick={() => setInvisitorModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Invisitor
          </Button>
        )}
      </div>
      {invisitors && invisitors.length > 0 ? (
        <div className="space-y-4">
          {invisitors.map((visitor: any) => (
            <Card
              key={visitor.id}
              className="bg-stone-800/50 border-stone-700"
            >
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {visitor.name}{" "}
                        <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </h3>
                      <p className="text-xs text-gray-400">
                        {visitor.relationship?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-stone-700">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-700 text-blue-400 hover:bg-blue-700/20"
                      onClick={() => {
                        setSelectedInvisitor(visitor);
                        setEditInvisitorModal(true);
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDeleteDialog
                      loading={deleteInvisitorLoading}
                      onConfirm={() => handleDeleteInvisitor(visitor.id)}
                      title="Delete Invisitor?"
                      description="This invisitor will be permanently deleted."
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-700 text-red-400 hover:bg-red-700/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-stone-800 rounded">
          <p className="text-lg text-white mb-2">No invisitors added</p>
          <p className="text-sm text-gray-400 mb-4">
            Add an invisitor to manage this property
          </p>
          <Button
            onClick={() => setInvisitorModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Invisitor
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
