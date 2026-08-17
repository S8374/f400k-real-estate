import { KycStatus } from '@prisma/client';
export declare class VerifyKycDocumentDto {
    documentId: string;
    adminId: string;
    status: KycStatus;
    rejectionReason?: string;
    notes?: string;
}
