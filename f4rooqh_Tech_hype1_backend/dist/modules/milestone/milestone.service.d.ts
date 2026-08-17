import { PrismaService } from '../../common/context/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { FilterMilestoneDto } from './dto/filter-milestone.dto';
export declare class MilestoneService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMilestoneDto: CreateMilestoneDto): Promise<{
        success: boolean;
        message: string;
        data: {
            plan: {
                property: {
                    id: string;
                    title: string;
                };
                id: string;
                name: string;
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
    }>;
    findAll(filterDto: FilterMilestoneDto): Promise<{
        success: boolean;
        data: ({
            _count: {
                payments: number;
            };
            plan: {
                property: {
                    id: string;
                    title: string;
                };
                id: string;
                name: string;
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
        })[];
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
            plan: {
                property: {
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
        };
    }>;
    findByPlan(planId: string, filterDto: FilterMilestoneDto): Promise<{
        success: boolean;
        data: ({
            _count: {
                payments: number;
            };
            plan: {
                property: {
                    id: string;
                    title: string;
                };
                id: string;
                name: string;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findUpcoming(days?: number): Promise<{
        success: boolean;
        data: ({
            plan: {
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
        count: number;
        timeframe: string;
    }>;
    update(id: string, updateMilestoneDto: UpdateMilestoneDto): Promise<{
        success: boolean;
        message: string;
        data: {
            plan: {
                id: string;
                name: string;
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
    }>;
    reorder(planId: string, items: {
        id: string;
        milestoneOrder: number;
    }[]): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAllByPlan(planId: string): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    getPlanSummary(planId: string): Promise<{
        success: boolean;
        data: {
            planId: string;
            totalMilestones: number;
            totalAmount: number;
            withDueDate: number;
            withConstructionProgress: number;
            milestones: {
                id: string;
                order: number;
                tittle: string | null;
                description: string;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
                paymentCount: number;
            }[];
        };
    }>;
    getPropertyConstructionProgress(propertyId: string): Promise<{
        success: boolean;
        data: {
            totalMilestones: number;
            completedMilestones: number;
            constructionProgress: number;
        };
    }>;
    private validatePaymentPlan;
}
