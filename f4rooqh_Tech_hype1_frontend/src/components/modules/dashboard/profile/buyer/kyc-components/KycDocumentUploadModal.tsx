import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ImagePlus, Loader2, X } from "lucide-react";
import { KycDocumentConfig, KycDocumentType } from "./kyc.utils";

interface KycDocumentUploadModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    doc: KycDocumentConfig;
    documentUID: string | null;
    selectedFile?: File;
    selectedPreview?: string;
    isSubmitting: boolean;
    handleFileChange: (type: KycDocumentType, file?: File) => void;
    handleRemoveSelectedFile: (type: KycDocumentType) => void;
    handleSubmitDocument: (doc: KycDocumentConfig) => void;
}

export default function KycDocumentUploadModal({
    isOpen,
    onOpenChange,
    doc,
    documentUID,
    selectedFile,
    selectedPreview,
    isSubmitting,
    handleFileChange,
    handleRemoveSelectedFile,
    handleSubmitDocument,
}: KycDocumentUploadModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#2c2a2a] border border-emerald-900/50 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Upload {doc.label}</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        {documentUID
                            ? `Replace your existing ${doc.label.toLowerCase()} file.`
                            : `Upload your ${doc.label.toLowerCase()} file. This will be sent for verification.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <input
                        id={`file-${doc.type}`}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(doc.type, e.target.files?.[0])}
                        className="hidden"
                    />

                    <label
                        htmlFor={`file-${doc.type}`}
                        className="block cursor-pointer rounded border-2 border-dashed border-stone-600 bg-[#383636] p-5 text-center transition hover:border-emerald-500"
                    >
                        <ImagePlus className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                        <p className="text-sm font-medium text-gray-200">Click to select document</p>
                        <p className="text-xs text-gray-400 mt-1">Supported: PDF, JPG, PNG, JPEG</p>
                    </label>

                    {selectedFile ? (
                        <div className="rounded border border-stone-600 bg-[#383636] p-3">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="text-xs text-emerald-300 truncate">{selectedFile.name}</p>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-300 hover:bg-red-900/30 hover:text-red-200"
                                    onClick={() => handleRemoveSelectedFile(doc.type)}
                                    aria-label="Remove selected file"
                                >
                                    <X size={14} />
                                </Button>
                            </div>

                            {selectedPreview ? (
                                <div className="overflow-hidden rounded border border-stone-700">
                                    <img
                                        src={selectedPreview}
                                        alt={`${doc.label} preview`}
                                        className="h-48 w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="rounded border border-stone-700 bg-[#2c2a2a] px-3 py-4 text-center text-xs text-gray-400">
                                    Preview not available for this file type.
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-600 text-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleSubmitDocument(doc)}
                        disabled={!selectedFile || isSubmitting}
                        className="bg-emerald-800 hover:bg-emerald-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            documentUID ? "Update Document" : "Upload Document"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
