import { MilestonePaymentStatus } from '@prisma/client';
export declare class FilterMilestonePaymentDto {
    milestoneId?: string;
    propertyId?: string;
    status?: MilestonePaymentStatus;
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
}
