import { KycDocument } from "@/redux/api/kycDocumentApi";
import { AlertCircle, CarFront, CheckCircle2, Clock, DollarSign, FileText, XCircle } from "lucide-react";
import { BsPassport } from "react-icons/bs";

export type KycStatus = "NOT_UPLOADED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
export type KycDocumentType =
    | "NATIONAL_ID"
    | "PASSPORT"
    | "DRIVING_LICENSE"
    | "PROOF_OF_ADDRESS"
    | "BANK_STATEMENT";

export interface KycDocumentConfig {
    label: string;
    type: KycDocumentType;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    notes: string;
}

export const KYC_DOCUMENTS: KycDocumentConfig[] = [
    {
        label: "National ID",
        type: "NATIONAL_ID",
        icon: FileText,
        notes: "National ID document",
    },
    {
        label: "Passport",
        type: "PASSPORT",
        icon: BsPassport,
        notes: "International passport",
    },
    {
        label: "Driving License",
        type: "DRIVING_LICENSE",
        icon: CarFront,
        notes: "Valid driving license",
    },
    {
        label: "Proof of Funds",
        type: "PROOF_OF_ADDRESS",
        icon: DollarSign,
        notes: "Proof of funds document",
    },
    {
        label: "Bank Statement",
        type: "BANK_STATEMENT",
        icon: FileText,
        notes: "Recent bank statement",
    },
];

export const STATUS_UI: Record<KycStatus, { label: string; className: string; icon: any }> = {
    NOT_UPLOADED: {
        label: "Not Uploaded",
        className: "bg-zinc-800 text-zinc-400 border-zinc-700",
        icon: AlertCircle,
    },
    PENDING_VERIFICATION: {
        label: "Pending",
        className: "bg-amber-900/20 text-amber-500 border-amber-900/30",
        icon: Clock,
    },
    VERIFIED: {
        label: "Verified",
        className: "bg-emerald-900/20 text-emerald-500 border-emerald-900/30",
        icon: CheckCircle2,
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-red-900/20 text-red-500 border-red-900/30",
        icon: XCircle,
    },
};

export function normalizeDocType(type?: string): KycDocumentType | null {
    if (!type) return null;

    const normalized = type.trim().toUpperCase().replace(/[\s-]+/g, "_");
    const matching = KYC_DOCUMENTS.find((item) => item.type === normalized);
    return (matching?.type as KycDocumentType) ?? null;
}

export function normalizeStatus(document?: KycDocument): KycStatus {
    if (!document?.fileUrl) return "NOT_UPLOADED";
    if (document?.isVerified) return "VERIFIED";

    const rawStatus = (document?.status || document?.verificationStatus || "").toUpperCase();

    if (rawStatus === "REJECTED" || rawStatus.includes("REJECT")) {
        return "REJECTED";
    }

    if (rawStatus === "VERIFIED" || rawStatus === "APPROVED") {
        return "VERIFIED";
    }

    return "PENDING_VERIFICATION";
}

export function getDocumentUID(document?: KycDocument): string | null {
    const uid = document?.documentUID || document?.id || (document as any)?._id || (document as any)?.uid;
    return typeof uid === "string" && uid.length > 0 ? uid : null;
}

export function getRejectionReason(document?: KycDocument): string {
    if (!document) return "";

    const reason = document.rejectionReason || (document as any)?.rejection_reason || (document as any)?.reason || "";
    return reason.trim();
}

export function getDocumentPriority(document?: KycDocument): number {
    const status = normalizeStatus(document);

    if (status === "PENDING_VERIFICATION") return 4;
    if (status === "VERIFIED") return 3;
    if (status === "REJECTED") return 2;
    return 1;
}

export function getDocumentTimestamp(document?: KycDocument): number {
    if (!document) return 0;

    const candidates = [
        document.updatedAt, 
        document.createdAt, 
        (document as any)?.uploadedAt, 
        (document as any)?.submittedAt
    ];

    for (const value of candidates) {
        if (!value) continue;
        const parsed = Date.parse(value as string);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return 0;
}
