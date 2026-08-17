import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { KycDocumentConfig } from "./kyc.utils";

interface KycDocumentPreviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    doc: KycDocumentConfig;
    fileUrl?: string;
    isUploadedImage: boolean;
}

export default function KycDocumentPreviewModal({
    isOpen,
    onOpenChange,
    doc,
    fileUrl,
    isUploadedImage,
}: KycDocumentPreviewModalProps) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="bg-[#2c2a2a] border border-emerald-900/50 text-white sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{doc.label} Preview</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Uploaded document preview
                    </DialogDescription>
                </DialogHeader>

                {fileUrl ? (
                    isUploadedImage ? (
                        <div className="overflow-hidden rounded border border-stone-700 bg-[#383636]">
                            <img
                                src={fileUrl}
                                alt={`${doc.label} uploaded preview`}
                                className="max-h-[65vh] w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="rounded border border-stone-700 bg-[#383636] p-4 text-center text-sm text-gray-300">
                            Preview is not supported for this file type.
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-1 text-emerald-400 underline hover:text-emerald-300"
                            >
                                Open file
                            </a>
                        </div>
                    )
                ) : (
                    <div className="rounded border border-stone-700 bg-[#383636] p-4 text-center text-sm text-gray-300">
                        No uploaded file found.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
