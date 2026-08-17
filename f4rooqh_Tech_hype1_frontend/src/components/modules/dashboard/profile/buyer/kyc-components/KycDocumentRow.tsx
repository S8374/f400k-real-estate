import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Trash2, UploadIcon } from "lucide-react";
import { KycDocument } from "@/redux/api/kycDocumentApi";
import {
    KycDocumentConfig,
    KycDocumentType,
    STATUS_UI,
    getDocumentUID,
    getRejectionReason,
    normalizeStatus,
} from "./kyc.utils";

interface KycDocumentRowProps {
    doc: KycDocumentConfig;
    serverDocument?: KycDocument;
    isDeleting: boolean;
    setActiveModalType: (type: KycDocumentType | null) => void;
    setPreviewModalType: (type: KycDocumentType | null) => void;
    handleDeleteDocument: (doc: KycDocumentConfig) => void;
}

export default function KycDocumentRow({
    doc,
    serverDocument,
    isDeleting,
    setActiveModalType,
    setPreviewModalType,
    handleDeleteDocument,
}: KycDocumentRowProps) {
    const Icon = doc.icon;
    const documentUID = getDocumentUID(serverDocument);
    const status = normalizeStatus(serverDocument);
    const fileUrl = serverDocument?.fileUrl;
    const rejectionReason = status === "REJECTED" ? getRejectionReason(serverDocument) : "";
    const statusUi = STATUS_UI[status];

    return (
        <div className="bg-[#383636] p-3 rounded flex items-center justify-between gap-3">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <Icon size={16} className="text-emerald-500" />
                    <span>{doc.label}</span>
                </div>
                {rejectionReason ? (
                    <p className="mt-1 text-xs text-red-300 truncate" title={rejectionReason}>
                        Reason: {rejectionReason}
                    </p>
                ) : null}
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider rounded-full gap-1.5 px-3 py-1 border ${statusUi.className}`}>
                    <statusUi.icon size={12} />
                    {statusUi.label}
                </div>

                {status === "REJECTED" && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveModalType(doc.type)}
                        className="h-8 bg-red-950/10 border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-xs font-bold"
                    >
                        <UploadIcon size={12} className="mr-1.5" />
                        Re-upload
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-gray-400 hover:bg-white/5 hover:text-white rounded transition-all"
                            aria-label={`${doc.label} actions`}
                        >
                            <MoreVertical size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-52 border-white/5 bg-[#1a1a1a] text-gray-200 rounded p-2 shadow-2xl backdrop-blur-xl"
                    >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 py-2">Document Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />

                        {fileUrl ? (
                            <DropdownMenuItem
                                onClick={() => setPreviewModalType(doc.type)}
                                className="rounded focus:bg-white/5 focus:text-[#EAB308] gap-3 px-3 py-2.5 cursor-pointer"
                            >
                                <Eye size={16} />
                                <span className="font-bold text-sm">View Document</span>
                            </DropdownMenuItem>
                        ) : null}

                        <DropdownMenuItem
                            onClick={() => setActiveModalType(doc.type)}
                            className="rounded focus:bg-white/5 focus:text-emerald-500 gap-3 px-3 py-2.5 cursor-pointer"
                        >
                            <UploadIcon size={16} />
                            <span className="font-bold text-sm">{documentUID ? "Update Document" : "Upload Document"}</span>
                        </DropdownMenuItem>

                        {documentUID ? (
                            <DropdownMenuItem
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={() => handleDeleteDocument(doc)}
                                className="rounded focus:bg-red-500/10 focus:text-red-500 gap-3 px-3 py-2.5 cursor-pointer mt-1"
                            >
                                <Trash2 size={16} />
                                <span className="font-bold text-sm">{isDeleting ? "Deleting..." : "Delete Document"}</span>
                            </DropdownMenuItem>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
