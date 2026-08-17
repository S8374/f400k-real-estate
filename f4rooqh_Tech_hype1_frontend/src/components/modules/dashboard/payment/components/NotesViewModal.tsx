import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Eye } from 'lucide-react';

interface NotesViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  viewNotesMilestone: any;
  handleViewDocument: (url: string, allUrls?: string[]) => void;
}

export default function NotesViewModal({
  isOpen,
  onOpenChange,
  viewNotesMilestone,
  handleViewDocument
}: NotesViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white rounded p-8 max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black mb-1">Payment & Document Details</DialogTitle>
          <p className="text-gray-400 text-sm font-medium">Review transaction notes and all uploaded documents</p>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
           {/* Documents Gallery Section */}
           {((viewNotesMilestone?.proofUrls?.length || 0) > 0 || (viewNotesMilestone?.agentDocumentUrls?.length || 0) > 0) && (
             <div className="space-y-4">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Uploaded Documents</span>
                <div className="grid grid-cols-2 gap-3">
                   {[...(viewNotesMilestone?.proofUrls || []), ...(viewNotesMilestone?.agentDocumentUrls || [])].map((url: string, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => handleViewDocument(url, [...(viewNotesMilestone?.proofUrls || []), ...(viewNotesMilestone?.agentDocumentUrls || [])])}
                        className="relative aspect-video bg-black/40 border border-gray-800 rounded overflow-hidden group cursor-pointer hover:border-[#EAB308]/50 transition-all"
                      >
                         {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={url} alt={`Doc ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                               <FileText className="w-6 h-6 text-blue-500" />
                               <span className="text-[10px] text-gray-500 font-bold">PDF Document</span>
                            </div>
                         )}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           <div className="bg-black/40 p-5 rounded border border-gray-800/50 transition-colors hover:border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                    <FileText className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-black text-gray-200 uppercase tracking-widest">Buyer's Note</span>
              </div>
              <p className="text-gray-400 text-[13px] leading-relaxed italic ml-11">
                 {viewNotesMilestone?.buyerNote || 'No notes provided by the buyer.'}
              </p>
           </div>

           <div className="bg-black/40 p-5 rounded border border-gray-800/50 transition-colors hover:border-emerald-500/30">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                    <Shield className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-black text-gray-200 uppercase tracking-widest">Agent's Note</span>
              </div>
              <p className="text-gray-400 text-[13px] leading-relaxed italic ml-11">
                 {viewNotesMilestone?.agentDocumentNote || 'No notes provided by the agent.'}
              </p>
           </div>
        </div>

        <DialogFooter className="mt-8">
           <Button className="bg-[#EAB308] hover:bg-amber-400 text-black font-black h-12 px-10 rounded w-full transition-all hover:scale-[1.02] active:scale-95" onClick={() => onOpenChange(false)}>
             Close Details
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
