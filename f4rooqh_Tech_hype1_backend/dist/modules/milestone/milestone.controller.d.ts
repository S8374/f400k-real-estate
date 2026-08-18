import { MilestoneService } from './milestone.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { FilterMilestoneDto } from './dto/filter-milestone.dto';
export declare class MilestoneController {
    private readonly milestoneService;
    constructor(milestoneService: MilestoneService);
    create(createMilestoneDto: CreateMilestoneDto): Promise<{
        success: boolean;
        message: string;
        data: {
            plan: {
                id: string;
                name: string;
                property: {
                    id: string;
                    title: string;
                };
            };
        } & {
            id: string;
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
        };
    }>;
    reorder(planId: string, items: {
        id: string;
        milestoneOrder: number;
    }[]): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(filterDto: FilterMilestoneDto): Promise<{
        success: boolean;
        data: ({
            plan: {
                id: string;
                name: string;
                property: {
                    id: string;
                    title: string;
                };
            };
            payments: {
                id: string;
                status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            }[];
            _count: {
                payments: number;
            };
        } & {
            id: string;
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByPlan(planId: string, filterDto: FilterMilestoneDto): Promise<{
        success: boolean;
        data: ({
            plan: {
                id: string;
                name: string;
                property: {
                    id: string;
                    title: string;
                };
            };
            payments: {
                id: string;
                status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            }[];
            _count: {
                payments: number;
            };
        } & {
            id: string;
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
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
                description: string | null;
                name: string;
                propertyId: string;
                totalInstallments: number | null;
                createdById: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
        })[];
        count: number;
        timeframe: string;
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
                description: string | null;
                name: string;
                propertyId: string;
                totalInstallments: number | null;
                createdById: string | null;
                createdAt: Date;
            };
            payments: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                milestoneId: string;
                buyerId: string;
                agentId: string | null;
                adminId: string | null;
                amountPaid: number;
                proofUrls: string[];
                paidAt: Date;
                agentReviewedAt: Date | null;
                verifiedAt: Date | null;
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
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
        };
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
            tittle: string | null;
            milestoneOrder: number;
            description: string;
            amount: number | null;
            dueDate: Date | null;
            constructionProgress: number | null;
            planId: string;
        };
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
}
