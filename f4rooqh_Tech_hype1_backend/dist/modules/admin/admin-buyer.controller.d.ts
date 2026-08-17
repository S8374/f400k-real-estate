import { AdminBuyerService } from './admin-buyer.service';
import { UserStatus } from '@prisma/client';
export declare class AdminBuyerController {
    private readonly adminBuyerService;
    constructor(adminBuyerService: AdminBuyerService);
    getBuyerStats(adminId: string): Promise<{
        success: boolean;
        data: {
            totalBuyers: number;
            kycVerified: number;
            nafathVerified: number;
            statusBreakdown: Record<string, number>;
        };
    }>;
    getAllBuyers(adminId: string, page?: string, limit?: string, search?: string): Promise<{
        success: boolean;
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(userId: string, status: UserStatus): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            fullName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
        };
    }>;
}
