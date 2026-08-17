import { ExternalLink, Eye, XSquare } from "lucide-react";
import { getPreviewFileType } from "../../hooks/useKycVerification";

interface FilePreviewModalProps {
  isFilePreviewOpen: boolean;
  setIsFilePreviewOpen: (open: boolean) => void;
  previewFileUrl: string;
  previewFileLabel: string;
}

export function FilePreviewModal({
  isFilePreviewOpen,
  setIsFilePreviewOpen,
  previewFileUrl,
  previewFileLabel
}: FilePreviewModalProps) {
  if (!isFilePreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg w-full max-w-4xl shadow-2xl relative flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#00B37E]" /> {previewFileLabel}
          </h2>
          <button 
            onClick={() => setIsFilePreviewOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XSquare className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 flex flex-col items-center justify-center bg-black/40 min-h-[50vh]">
          {previewFileUrl ? (
            <div className="relative group w-full flex justify-center">
              {getPreviewFileType(previewFileUrl) === "image" ? (
                <img src={previewFileUrl} alt="" className="max-h-[75vh] max-w-full rounded object-contain" />
              ) : (
                <iframe src={previewFileUrl} title="" className="h-[75vh] w-full rounded border border-white/10 bg-white" />
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={previewFileUrl} target="_blank" rel="noreferrer">
                  <button className="bg-black/60 hover:bg-black backdrop-blur-md border border-white/20 px-3 py-1.5 rounded text-white text-xs font-semibold flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" /> Full Size
                  </button>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
