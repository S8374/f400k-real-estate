import { PrismaService } from '../../common/context/prisma.service';
import { CreateKycDocumentDto, AdminVerifyKycDto, DocumentType } from './dto/create-kyc-document.dto';
import { UpdateKycDocumentDto } from './dto/update-kyc-document.dto';
import { FilterKycDocumentDto } from './dto/filter-kyc-document.dto';
export declare class KycDocumentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
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
            requiredDocuments: DocumentType[];
            missingDocuments: DocumentType[];
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
    private checkUserKycCompletion;
    private validateUser;
    private validateAdmin;
}
