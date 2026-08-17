"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CircleCheckBig, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyConfirmModalProps {
  showConfirmModal: boolean;
  setShowConfirmModal: (val: boolean) => void;
  title: string | undefined;
  isLoading: boolean;
  handlePublish: () => void;
}

export function PropertyConfirmModal({
  showConfirmModal,
  setShowConfirmModal,
  title,
  isLoading,
  handlePublish,
}: PropertyConfirmModalProps) {
  if (!showConfirmModal) return null;

  return (
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent className="bg-stone-900 border border-stone-800 rounded-xl w-full max-w-md p-0 overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-stone-800 bg-stone-900/50">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Review & Publish
            </h2>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-stone-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="bg-stone-800/50 p-4 rounded">
              <p className="text-sm text-gray-300 mb-2">Property:</p>
              <p className="text-white font-medium">
                {title || "Untitled Property"}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                Once published, this property will:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                  Visible to all buyers on the interactive map
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                  Searchable through filters and categories
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                  Open for direct buyer inquiries
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                  Tracked for performance analytics
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 italic">
              Note: You can edit or unpublish this listing anytime from your dashboard.
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-stone-700 flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 bg-transparent border-stone-600 text-white hover:bg-stone-800 hover:text-white"
            >
              Back to Edit
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium border-0"
            >
              {isLoading ? "Publishing..." : "Confirm & Publish"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
