import { PrismaService } from '../../common/context/prisma.service';
import { FilterPaymentPlanDto } from './dto/filter-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-paymentplan.dto';
import { CreatePaymentPlanDto } from './dto/create-paymentplan.dto';
export declare class PaymentPlanService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createPaymentPlanDto: CreatePaymentPlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
            };
            createdBy: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        };
    }>;
    findAll(filterDto: FilterPaymentPlanDto): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
            };
            _count: {
                milestones: number;
            };
            milestones: {
                id: string;
                description: string;
                milestoneOrder: number;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            }[];
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        }[];
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
            property: {
                developer: {
                    id: string;
                    name: string;
                } | null;
                id: string;
                title: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        };
    }>;
    findByProperty(propertyId: string, filterDto: FilterPaymentPlanDto): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
            };
            _count: {
                milestones: number;
            };
            milestones: {
                id: string;
                description: string;
                milestoneOrder: number;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            }[];
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, updatePaymentPlanDto: UpdatePaymentPlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            deletedMilestonesCount: number;
        };
    }>;
    getByCreatorId(creatorId: string, propertyId?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            plans: {
                id: any;
                name: any;
                description: any;
                totalInstallments: any;
                createdAt: any;
                property: any;
                accepted: any;
                acceptedAt: any;
                summary: {
                    totalMilestones: number;
                    verifiedMilestones: number;
                    pendingMilestones: number;
                    rejectedMilestones: number;
                    unpaidMilestones: number;
                    totalPaid: number;
                    totalPrice: any;
                    remainingAmount: number;
                    paymentProgress: number;
                    constructionProgress: number;
                    display: {
                        verifiedPayments: string;
                        pendingReviews: number;
                        constructionProgress: string;
                        totalPaidFormatted: string;
                        remainingFormatted: string;
                    };
                };
                recentPayments: {
                    id: string;
                    amount: number;
                    status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                    paidAt: Date;
                    milestoneId: string;
                    milestoneOrder: number | undefined;
                    milestoneTitle: string | null | undefined;
                    constructionProgress: number | null | undefined;
                }[];
                milestones: {
                    cumulativeProgress: number;
                    id: string;
                    tittle: string | null;
                    order: number;
                    description: string;
                    amount: number | null;
                    dueDate: Date | null;
                    constructionProgress: number | null;
                    paymentStatus: string;
                    amountPaid: number;
                    paymentId: string | null;
                    paidAt: Date;
                    proofUrl: string | null;
                    proofUrls: string[];
                    agentDocumentUrl: string | null;
                    agentDocumentUrls: string[];
                    agentDocumentNote: string | null;
                    buyerNote: string | null;
                    adminNote: string | null;
                    adminName: string | null;
                    isReadByBuyer: boolean;
                    isReadByAgent: boolean;
                    isReadByAdmin: boolean;
                }[];
            }[];
            overallStats: any;
        };
    }>;
    getByBuyerId(buyerId: string, propertyId?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            plans: {
                id: any;
                name: any;
                description: any;
                totalInstallments: any;
                createdAt: any;
                property: any;
                accepted: any;
                acceptedAt: any;
                summary: {
                    totalMilestones: number;
                    verifiedMilestones: number;
                    pendingMilestones: number;
                    rejectedMilestones: number;
                    unpaidMilestones: number;
                    totalPaid: number;
                    totalPrice: any;
                    remainingAmount: number;
                    paymentProgress: number;
                    constructionProgress: number;
                    display: {
                        verifiedPayments: string;
                        pendingReviews: number;
                        constructionProgress: string;
                        totalPaidFormatted: string;
                        remainingFormatted: string;
                    };
                };
                recentPayments: {
                    id: string;
                    amount: number;
                    status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                    paidAt: Date;
                    milestoneId: string;
                    milestoneOrder: number | undefined;
                    milestoneTitle: string | null | undefined;
                    constructionProgress: number | null | undefined;
                }[];
                milestones: {
                    cumulativeProgress: number;
                    id: string;
                    tittle: string | null;
                    order: number;
                    description: string;
                    amount: number | null;
                    dueDate: Date | null;
                    constructionProgress: number | null;
                    paymentStatus: string;
                    amountPaid: number;
                    paymentId: string | null;
                    paidAt: Date;
                    proofUrl: string | null;
                    proofUrls: string[];
                    agentDocumentUrl: string | null;
                    agentDocumentUrls: string[];
                    agentDocumentNote: string | null;
                    buyerNote: string | null;
                    adminNote: string | null;
                    adminName: string | null;
                    isReadByBuyer: boolean;
                    isReadByAgent: boolean;
                    isReadByAdmin: boolean;
                }[];
            }[];
            overallStats: any;
        };
    }>;
    private calculateOverallStats;
    private enrichPlansWithSummary;
    getSummary(): Promise<{
        success: boolean;
        data: {
            totalPlans: number;
            plansWithMilestones: number;
            plansWithoutMilestones: number;
            averageInstallments: number;
            topPropertiesByPlans: {
                planCount: number;
                id?: string | undefined;
                title?: string | undefined;
            }[];
        };
    }>;
    getPropertySummary(propertyId: string): Promise<{
        success: boolean;
        data: {
            propertyId: string;
            totalPlans: number;
            plansWithMilestones: number;
            plansWithoutMilestones: number;
            totalMilestones: number;
            plans: {
                id: string;
                name: string;
                totalInstallments: number | null;
                milestoneCount: number;
            }[];
        };
    }>;
    getPropertyStats(propertyId: string): Promise<{
        totalPrice: number;
        totalPaid: number;
        remainingAmount: number;
        percentagePaid: number;
        verifiedPayments: string;
        pendingReview: number;
        constructionProgress: number;
        success?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
                currency: string;
            };
            paymentProgress: {
                totalPrice: number;
                totalPaid: number;
                remainingAmount: number;
                percentagePaid: number;
                verifiedPayments: string;
                pendingReview: number;
                constructionProgress: number;
            };
        };
        totalPrice?: undefined;
        totalPaid?: undefined;
        remainingAmount?: undefined;
        percentagePaid?: undefined;
        verifiedPayments?: undefined;
        pendingReview?: undefined;
        constructionProgress?: undefined;
    }>;
    private validateProperty;
    private getPropertyId;
}
