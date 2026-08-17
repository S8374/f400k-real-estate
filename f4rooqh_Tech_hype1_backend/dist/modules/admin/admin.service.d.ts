import { MilestonePaymentService } from '../milestone-payment/milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';
import { AdminVerifyDto } from '../milestone-payment/dto/admin-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
export declare class AdminMilestonePaymentService {
    private readonly prisma;
    private readonly milestonePaymentService;
    constructor(prisma: PrismaService, milestonePaymentService: MilestonePaymentService);
    getPendingVerification(adminId: string, filterDto: FilterMilestonePaymentDto): Promise<{
        success: boolean;
        data: ({
            milestone: {
                id: string;
                description: string;
                milestoneOrder: number;
                planId: string;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            };
            agent: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                fullName: string | null;
                avatarUrl: string | null;
                nationality: string | null;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.UserStatus;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                verifiedAt: Date | null;
                lastLogin: Date | null;
                lastActive: Date | null;
                isOnline: boolean;
            } | null;
            admin: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                fullName: string | null;
                avatarUrl: string | null;
                nationality: string | null;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.UserStatus;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                verifiedAt: Date | null;
                lastLogin: Date | null;
                lastActive: Date | null;
                isOnline: boolean;
            } | null;
            buyer: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                fullName: string | null;
                avatarUrl: string | null;
                nationality: string | null;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.UserStatus;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                verifiedAt: Date | null;
                lastLogin: Date | null;
                lastActive: Date | null;
                isOnline: boolean;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            createdAt: Date;
            verifiedAt: Date | null;
            paidAt: Date;
            adminId: string | null;
            buyerId: string;
            milestoneId: string;
            agentId: string | null;
            amountPaid: number;
            proofUrls: string[];
            agentReviewedAt: Date | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            notes: string | null;
            isReadByBuyer: boolean;
            isReadByAgent: boolean;
            isReadByAdmin: boolean;
            agentDocumentUrls: string[];
            agentDocumentNote: string | null;
            agentUploadedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    verifyPayment(dto: AdminVerifyDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    markAsRead(dto: MarkAsReadDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            createdAt: Date;
            verifiedAt: Date | null;
            paidAt: Date;
            adminId: string | null;
            buyerId: string;
            milestoneId: string;
            agentId: string | null;
            amountPaid: number;
            proofUrls: string[];
            agentReviewedAt: Date | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            notes: string | null;
            isReadByBuyer: boolean;
            isReadByAgent: boolean;
            isReadByAdmin: boolean;
            agentDocumentUrls: string[];
            agentDocumentNote: string | null;
            agentUploadedAt: Date | null;
        };
    }>;
    getPaymentDetails(id: string, adminId: string): Promise<{
        success: boolean;
        data: {
            milestone: {
                plan: {
                    property: {
                        id: string;
                        listingAgentId: string;
                        title: string;
                    };
                    milestones: ({
                        payments: {
                            id: string;
                            status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                            createdAt: Date;
                            verifiedAt: Date | null;
                            paidAt: Date;
                            adminId: string | null;
                            buyerId: string;
                            milestoneId: string;
                            agentId: string | null;
                            amountPaid: number;
                            proofUrls: string[];
                            agentReviewedAt: Date | null;
                            rejectedAt: Date | null;
                            rejectionReason: string | null;
                            notes: string | null;
                            isReadByBuyer: boolean;
                            isReadByAgent: boolean;
                            isReadByAdmin: boolean;
                            agentDocumentUrls: string[];
                            agentDocumentNote: string | null;
                            agentUploadedAt: Date | null;
                        }[];
                    } & {
                        id: string;
                        description: string;
                        milestoneOrder: number;
                        planId: string;
                        tittle: string | null;
                        amount: number | null;
                        dueDate: Date | null;
                        constructionProgress: number | null;
                    })[];
                } & {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    propertyId: string;
                    totalInstallments: number | null;
                    createdById: string | null;
                };
            } & {
                id: string;
                description: string;
                milestoneOrder: number;
                planId: string;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            };
            agent: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
            admin: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
            buyer: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            createdAt: Date;
            verifiedAt: Date | null;
            paidAt: Date;
            adminId: string | null;
            buyerId: string;
            milestoneId: string;
            agentId: string | null;
            amountPaid: number;
            proofUrls: string[];
            agentReviewedAt: Date | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            notes: string | null;
            isReadByBuyer: boolean;
            isReadByAgent: boolean;
            isReadByAdmin: boolean;
            agentDocumentUrls: string[];
            agentDocumentNote: string | null;
            agentUploadedAt: Date | null;
        };
    }>;
    getUnreadCount(adminId: string): Promise<{
        unreadCount: number;
    }>;
    getOverview(adminId: string): Promise<{
        success: boolean;
        data: {
            pendingAgentReview: number;
            pendingAdminVerification: number;
            verified: number;
            rejected: number;
            totalVerifiedAmount: number;
        };
    }>;
}
