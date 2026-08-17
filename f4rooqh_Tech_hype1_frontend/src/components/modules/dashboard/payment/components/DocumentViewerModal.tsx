import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layout, FileText } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrls: string[];
  currentIndex: number;
  documentType: 'pdf' | 'image' | 'document';
  onNext: () => void;
  onPrev: () => void;
  onDownload: (url: string) => void;
}

export default function DocumentViewerModal({
  isOpen,
  onOpenChange,
  documentUrls,
  currentIndex,
  documentType,
  onNext,
  onPrev,
  onDownload
}: DocumentViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121417] border border-white/5 text-white rounded p-0 max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/5 shrink-0 flex flex-row items-center justify-between">
          <div>
             <DialogTitle className="text-xl font-black tracking-tight">Document Viewer</DialogTitle>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
               File {currentIndex + 1} of {documentUrls.length}
             </p>
          </div>
        </DialogHeader>
        
        <div className="flex-1 relative overflow-hidden bg-black/40 flex items-center justify-center p-4 min-h-[500px]">
          {/* Navigation Arrows */}
          {documentUrls.length > 1 && (
             <>
                <button onClick={onPrev} className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white/70">
                  <Layout className="w-5 h-5 rotate-90" />
                </button>
                <button onClick={onNext} className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white/70">
                  <Layout className="w-5 h-5 -rotate-90" />
                </button>
             </>
          )}

          <div className="w-full h-full flex items-center justify-center transition-all duration-500">
             {documentType === 'image' ? (
               <img 
                 src={documentUrls[currentIndex]} 
                 alt="Document" 
                 className="max-w-full max-h-[calc(90vh-200px)] object-contain rounded shadow-2xl"
               />
             ) : (
               <div className="text-center space-y-6 p-12 bg-white/5 rounded border border-white/5 backdrop-blur-xl">
                 <div className="w-20 h-20 bg-blue-500/10 rounded flex items-center justify-center text-blue-500 mx-auto">
                    <FileText className="w-10 h-10" />
                 </div>
                 <div>
                    <p className="text-lg font-bold text-white mb-2">Document Preview Not Available</p>
                    <p className="text-sm text-gray-400">Please download the file to view its full content</p>
                 </div>
                 <Button 
                   onClick={() => onDownload(documentUrls[currentIndex])}
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded shadow-lg shadow-blue-900/20"
                 >
                    Download File
                 </Button>
               </div>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
