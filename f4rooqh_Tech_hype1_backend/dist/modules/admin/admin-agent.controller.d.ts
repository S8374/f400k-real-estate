import { AdminAgentService } from './admin-agent.service';
import { UserStatus } from '@prisma/client';
export declare class AdminAgentController {
    private readonly adminAgentService;
    constructor(adminAgentService: AdminAgentService);
    getAgentStats(adminId: string): Promise<{
        success: boolean;
        data: {
            totalAgents: number;
            regaVerified: number;
            nafathVerified: number;
            unverifiedCount: number;
            statusBreakdown: Record<string, number>;
        };
    }>;
    getAllAgents(adminId: string, page?: string, limit?: string, search?: string): Promise<{
        success: boolean;
        data: {
            stats: {
                totalProperties: number;
                verifiedProperties: number;
            };
            agentProfile: ({
                _count: {
                    properties: number;
                };
            } & {
                verifiedAt: Date | null;
                agencyName: string | null;
                bio: string | null;
                yearsExperience: number | null;
                userId: string;
                licenseId: string | null;
                isRegaVerified: boolean;
                isNafathVerified: boolean;
                trustScore: number;
            }) | null;
            id: string;
            email: string;
            phoneNumber: string | null;
            fullName: string | null;
            avatarUrl: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            isVerified: boolean;
            lastLogin: Date | null;
            isOnline: boolean;
        }[];
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
