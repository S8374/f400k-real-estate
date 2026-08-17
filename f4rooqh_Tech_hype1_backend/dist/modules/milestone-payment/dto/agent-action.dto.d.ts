import { MilestonePaymentStatus } from '@prisma/client';
export declare class AgentUploadDto {
    paymentId: string;
    agentId: string;
    agentDocumentUrls: string[];
    notes?: string;
}
export declare class AgentReviewDto {
    paymentId: string;
    agentId: string;
    notes?: string;
    status: MilestonePaymentStatus;
}
