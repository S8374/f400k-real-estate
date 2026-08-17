import { KycDocumentService } from './kyc-document.service';
import { CreateKycDocumentDto, AdminVerifyKycDto } from './dto/create-kyc-document.dto';
import { UpdateKycDocumentDto } from './dto/update-kyc-document.dto';
import { FilterKycDocumentDto } from './dto/filter-kyc-document.dto';
export declare class KycDocumentController {
    private readonly service;
    constructor(service: KycDocumentService);
    upload(createDto: CreateKycDocumentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        };
    }>;
    verify(verifyDto: AdminVerifyKycDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        };
    }>;
    findAll(filterDto: FilterKycDocumentDto): Promise<{
        success: boolean;
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByUser(userId: string, filterDto: FilterKycDocumentDto): Promise<{
        success: boolean;
        data: {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        }[];
    }>;
    getUserStats(userId: string): Promise<{
        success: boolean;
        data: {
            userId: string;
            totalUploads: number;
            timeline: {
                documentType: string;
                status: import("@prisma/client").$Enums.KycStatus;
                uploadedAt: Date;
                verifiedAt: Date | null;
                rejectionReason: string | null;
            }[];
        };
    }>;
    getUserKycStatus(userId: string): Promise<{
        success: boolean;
        data: {
            userId: string;
            overallStatus: import("@prisma/client").$Enums.KycStatus;
            documents: {
                total: number;
                verified: number;
                pending: number;
                rejected: number;
            };
            requiredDocuments: import("./dto/create-kyc-document.dto").DocumentType[];
            missingDocuments: import("./dto/create-kyc-document.dto").DocumentType[];
            recentActivity: {
                id: string;
                verifiedAt: Date | null;
                userId: string;
                uploadedAt: Date;
                rejectionReason: string | null;
                documentType: string;
                fileUrl: string;
                verificationStatus: import("@prisma/client").$Enums.KycStatus;
            }[];
        };
    }>;
    update(id: string, updateDto: UpdateKycDocumentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                fullName: string | null;
            };
        } & {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
