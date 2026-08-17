import { CreateMilestonePaymentDto } from '../milestone-payment/dto/create-milestone-payment.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { BuyerMilestonePaymentService } from './buyer.service';
export declare class BuyerMilestonePaymentController {
    private readonly service;
    constructor(service: BuyerMilestonePaymentService);
    uploadPayment(dto: CreateMilestonePaymentDto, buyerId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getMyPayments(buyerId: string, filterDto: FilterMilestonePaymentDto): Promise<{
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
    getUnreadCount(buyerId: string): Promise<{
        unreadCount: number;
    }>;
    getPerformanceStats(buyerId: string): Promise<{
        success: boolean;
        data: {
            propertiesViewed: number;
            propertiesSaved: number;
            propertiesOwned: number;
        };
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
    getGoldenVisaProgress(queryBuyerId: string, user: any): Promise<{
        success: boolean;
        data: {
            hasGoldenVisaProject: boolean;
            progress: number;
            milestoneProgress: number;
            documentProgress: number;
            totalProgress?: undefined;
        };
    } | {
        success: boolean;
        data: {
            totalProgress: number;
            hasGoldenVisaProject?: undefined;
            progress?: undefined;
            milestoneProgress?: undefined;
            documentProgress?: undefined;
        };
    }>;
    getPaymentDetails(id: string, buyerId: string): Promise<{
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
}
