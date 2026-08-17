import { PaymentPlanAcceptanceService } from './payment-plan-acceptance.service';
import { CreatePaymentPlanAcceptanceDto } from './dto/create-payment-plan-acceptance.dto';
import { FilterPaymentPlanAcceptanceDto } from './dto/filter-payment-plan-acceptance.dto';
export declare class PaymentPlanAcceptanceController {
    private readonly service;
    constructor(service: PaymentPlanAcceptanceService);
    create(createDto: CreatePaymentPlanAcceptanceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            };
            paymentPlan: {
                id: string;
                name: string;
            };
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
            };
            acceptedBy: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        };
    }>;
    toggle(createDto: CreatePaymentPlanAcceptanceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            accepted: boolean;
        };
    } | {
        success: boolean;
        message: string;
        data: {
            accepted: boolean;
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        };
    }>;
    checkAcceptance(agentId: string, propertyId: string, paymentPlanId: string): Promise<{
        success: boolean;
        data: {
            isAgentProperty: boolean;
            accepted: boolean;
            acceptance: ({
                acceptedBy: {
                    id: string;
                    fullName: string | null;
                } | null;
            } & {
                id: string;
                propertyId: string;
                buyerId: string;
                paymentPlanId: string;
                acceptedAt: Date;
                acceptedById: string | null;
            }) | null;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
            };
            paymentPlan: {
                milestones: {
                    id: string;
                    description: string;
                    milestoneOrder: number;
                    planId: string;
                    tittle: string | null;
                    amount: number | null;
                    dueDate: Date | null;
                    constructionProgress: number | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                propertyId: string;
                totalInstallments: number | null;
                createdById: string | null;
            };
            buyer: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            };
            acceptedBy: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        };
    }>;
    findByAgent(agentId: string, filterDto: FilterPaymentPlanAcceptanceDto): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                title: string;
            };
            paymentPlan: {
                id: string;
                name: string;
            };
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
            };
            acceptedBy: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByBuyer(buyerId: string, filterDto: FilterPaymentPlanAcceptanceDto): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                title: string;
            };
            paymentPlan: {
                id: string;
                name: string;
            };
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
            };
            acceptedBy: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
