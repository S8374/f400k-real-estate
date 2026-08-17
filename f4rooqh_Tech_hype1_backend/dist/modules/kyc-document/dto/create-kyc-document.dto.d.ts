import { KycStatus } from '@prisma/client';
export declare enum DocumentType {
    PASSPORT = "PASSPORT",
    NATIONAL_ID = "NATIONAL_ID",
    DRIVING_LICENSE = "DRIVING_LICENSE",
    RESIDENT_ID = "RESIDENT_ID",
    PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS",
    BANK_STATEMENT = "BANK_STATEMENT",
    TAX_CERTIFICATE = "TAX_CERTIFICATE",
    COMPANY_REGISTRATION = "COMPANY_REGISTRATION",
    TRADE_LICENSE = "TRADE_LICENSE",
    OTHER = "OTHER"
}
export declare class CreateKycDocumentDto {
    userId: string;
    documentType: DocumentType;
    fileUrl: string;
    notes?: string;
}
export declare class AdminVerifyKycDto {
    documentId: string;
    adminId: string;
    status: KycStatus;
    rejectionReason?: string;
}
