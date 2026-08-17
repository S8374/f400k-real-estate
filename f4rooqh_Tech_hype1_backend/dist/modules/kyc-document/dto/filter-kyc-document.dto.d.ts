import { KycStatus } from '@prisma/client';
import { DocumentType } from './create-kyc-document.dto';
export declare class FilterKycDocumentDto {
    userId?: string;
    documentType?: DocumentType;
    verificationStatus?: KycStatus;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
