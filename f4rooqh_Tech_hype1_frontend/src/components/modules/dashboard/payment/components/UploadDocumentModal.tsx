import React, { RefObject } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, Clock } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  note: string;
  setNote: (val: string) => void;
  isUploading: boolean;
  handleConfirmUpload: () => void;
}

export default function UploadDocumentModal({
  isOpen,
  onOpenChange,
  selectedFiles,
  setSelectedFiles,
  fileInputRef,
  note,
  setNote,
  isUploading,
  handleConfirmUpload
}: UploadDocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white rounded p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black mb-1">Upload Documentation</DialogTitle>
          <p className="text-gray-400 text-sm font-medium">Add receipts or confirmation documents</p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* File List */}
          {selectedFiles.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-300 truncate font-medium">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="text-gray-500 hover:text-red-400 p-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-800 rounded p-8 text-center hover:border-[#EAB308]/50 hover:bg-[#EAB308]/5 transition-all cursor-pointer group"
            >
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3 group-hover:text-[#EAB308] transition-colors" />
              <p className="text-sm text-gray-400 font-medium">Click to select multiple files</p>
              <p className="text-[10px] text-gray-600 mt-1">Images or PDF</p>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 border border-dashed border-gray-800 rounded text-[11px] text-gray-500 font-bold hover:border-[#EAB308]/50 hover:text-[#EAB308] transition-all"
            >
              + Add More Files
            </button>
          )}

          <div className="pt-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Notes</label>
            <Textarea
              placeholder="Transaction ID or specific notes..."
              className="bg-black/50 border-gray-800 rounded min-h-24 focus:border-[#EAB308] transition-colors text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button
            className="bg-[#EAB308] hover:bg-amber-400 text-black font-black h-12 px-10 rounded w-full shadow-lg shadow-amber-900/10 transition-all hover:scale-[1.02] active:scale-95"
            onClick={handleConfirmUpload}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Uploading {selectedFiles.length} File(s)...</span>
              </div>
            ) : (
              `Submit ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
