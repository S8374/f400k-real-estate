import { AdminUserService } from './admin-user.service';
import { Role, UserStatus } from '@prisma/client';
export declare class AdminUserController {
    private readonly adminUserService;
    constructor(adminUserService: AdminUserService);
    getAllUsers(adminId: string, page?: string, limit?: string, search?: string, role?: Role, status?: UserStatus): Promise<{
        data: ({
            agentProfile: {
                verifiedAt: Date | null;
                agencyName: string | null;
                bio: string | null;
                yearsExperience: number | null;
                userId: string;
                licenseId: string | null;
                isRegaVerified: boolean;
                isNafathVerified: boolean;
                trustScore: number;
            } | null;
            buyerProfile: {
                investmentField: string | null;
                investmentBudgetMin: number | null;
                investmentBudgetMax: number | null;
                preferredPropertyTypes: string[];
                userId: string;
                isNafathVerified: boolean;
                kycStatus: import("@prisma/client").$Enums.KycStatus;
            } | null;
            _count: {
                kycDocuments: number;
                sentMessages: number;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        stats: {
            totalUsers: number;
            activeUsers: number;
            bannedUsers: number;
            pendingUsers: number;
        };
    }>;
    getUserDetails(userId: string): Promise<{
        agentProfile: ({
            properties: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.ProjectType;
                isRegaVerified: boolean | null;
                listingAgentId: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                developerId: string | null;
                zoneId: string | null;
                images: string[];
                totalUnits: number | null;
                availableUnits: number | null;
                latitude: number | null;
                longitude: number | null;
                addressLine: string | null;
                mapEmbedUrl: string | null;
                location: string | null;
                title: string;
                description: string | null;
                price: number;
                currency: string;
                areaSqm: number | null;
                areaSqFt: number | null;
                bedrooms: number | null;
                bathrooms: number | null;
                balconies: number | null;
                floorNumber: number | null;
                yearBuilt: number | null;
                parkingSlots: number | null;
                furnished: boolean | null;
                isBooked: boolean | null;
                sakNumber: string | null;
                roiProjectionPercent: number | null;
                estimatedRentalIncome: number | null;
                estimatedRentalCurrency: string | null;
                valueApproximate: number | null;
                valueApproximateCurrency: string | null;
                views: number;
                featuredUntil: Date | null;
            }[];
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
        buyerProfile: {
            investmentField: string | null;
            investmentBudgetMin: number | null;
            investmentBudgetMax: number | null;
            preferredPropertyTypes: string[];
            userId: string;
            isNafathVerified: boolean;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
        } | null;
        kycDocuments: {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        }[];
        bankAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        }[];
        _count: {
            sentMessages: number;
            savedListings: number;
        };
    } & {
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
    }>;
    updateStatus(userId: string, status: UserStatus): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    deleteUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
