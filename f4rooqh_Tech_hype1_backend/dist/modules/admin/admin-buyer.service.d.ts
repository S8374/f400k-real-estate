import { PrismaService } from '../../common/context/prisma.service';
import { UserStatus } from '@prisma/client';
export declare class AdminBuyerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllBuyers(adminId: string, query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getBuyerStats(adminId: string): Promise<{
        success: boolean;
        data: {
            totalBuyers: number;
            kycVerified: number;
            nafathVerified: number;
            statusBreakdown: Record<string, number>;
        };
    }>;
    updateBuyerStatus(userId: string, status: UserStatus): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            fullName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
        };
    }>;
}
