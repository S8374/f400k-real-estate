import { PrismaService } from '../../common/context/prisma.service';
import { VerifyAgentDto, VerifyPropertyDto, VerificationFilterDto } from './dto/create-verified.dto';
import { UpdateVerifiedDto } from './dto/update-verified.dto';
export declare class VerifiedService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPendingAgents(): Promise<{
        success: boolean;
        data: {
            verificationStatus: {
                regaVerified: boolean;
                nafathVerified: boolean;
                isFullyVerified: boolean;
                pendingVerifications: (string | false)[];
            };
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
                createdAt: Date;
            };
            properties: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                isRegaVerified: boolean | null;
                title: string;
            }[];
            verifiedAt: Date | null;
            agencyName: string | null;
            bio: string | null;
            yearsExperience: number | null;
            userId: string;
            licenseId: string | null;
            isRegaVerified: boolean;
            isNafathVerified: boolean;
            trustScore: number;
        }[];
        count: number;
    }>;
    getVerifiedAgents(): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
                avatarUrl: string | null;
            };
            properties: {
                id: string;
                title: string;
                price: number;
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
        })[];
        count: number;
    }>;
    getAgentVerificationStatus(agentId: string): Promise<{
        success: boolean;
        data: {
            agent: {
                id: string;
                name: string | null;
                email: string;
                phone: string | null;
            };
            verification: {
                regaVerified: boolean;
                nafathVerified: boolean;
                isFullyVerified: boolean;
                verifiedAt: Date | null;
            };
            properties: {
                id: string;
                title: string;
                isRegaVerified: boolean | null;
                sakNumber: string | null;
            }[];
        };
    }>;
    verifyAgent(verifyAgentDto: VerifyAgentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            agentId: string;
            name: string | null;
            isRegaVerified: boolean;
            isNafathVerified: boolean;
            isFullyVerified: boolean;
            verifiedAt: Date | null;
        };
    }>;
    getPendingProperties(): Promise<{
        success: boolean;
        data: ({
            developer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                logoUrl: string | null;
                websiteUrl: string | null;
            } | null;
            media: {
                id: string;
                url: string;
                type: import("@prisma/client").$Enums.MediaType;
                isPrimary: boolean;
                uploadedAt: Date;
                title: string | null;
                description: string | null;
                propertyId: string | null;
                sortOrder: number;
                unitId: string | null;
            }[];
            agent: {
                user: {
                    email: string;
                    fullName: string | null;
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
            };
        } & {
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
        })[];
        count: number;
    }>;
    getVerifiedProperties(): Promise<{
        success: boolean;
        data: ({
            developer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                logoUrl: string | null;
                websiteUrl: string | null;
            } | null;
            media: {
                id: string;
                url: string;
                type: import("@prisma/client").$Enums.MediaType;
                isPrimary: boolean;
                uploadedAt: Date;
                title: string | null;
                description: string | null;
                propertyId: string | null;
                sortOrder: number;
                unitId: string | null;
            }[];
            agent: {
                user: {
                    email: string;
                    fullName: string | null;
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
            };
        } & {
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
        })[];
        count: number;
    }>;
    getPropertyVerificationStatus(propertyId: string): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
                currency: string;
            };
            verification: {
                isRegaVerified: boolean;
                sakNumber: string | null;
                isVerified: boolean;
            };
            agent: {
                id: string;
                name: string | null;
                isRegaVerified: boolean;
                isNafathVerified: boolean;
            };
            developer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                logoUrl: string | null;
                websiteUrl: string | null;
            } | null;
        };
    }>;
    verifyProperty(verifyPropertyDto: VerifyPropertyDto): Promise<{
        success: boolean;
        message: string;
        data: {
            propertyId: string;
            title: string;
            status: import("@prisma/client").$Enums.PropertyStatus;
            isRegaVerified: boolean | null;
            sakNumber: string | null;
            agent: {
                id: string;
                name: string | null;
            };
        };
    }>;
    getAllVerificationStatus(filterDto: VerificationFilterDto): Promise<{
        success: boolean;
        data: any;
    }>;
    getAgentPropertiesVerification(agentId: string): Promise<{
        success: boolean;
        data: {
            properties: {
                media: {
                    url: string;
                }[];
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                isRegaVerified: boolean | null;
                title: string;
                price: number;
                currency: string;
                sakNumber: string | null;
            }[];
        };
    }>;
    getVerificationStats(): Promise<{
        success: boolean;
        data: {
            agents: {
                total: number;
                fullyVerified: number;
                regaVerifiedOnly: number;
                nafathVerifiedOnly: number;
                pending: number;
                verificationRate: number;
            };
            properties: {
                total: number;
                verified: number;
                pending: number;
                verificationRate: number;
            };
        };
    }>;
    create(createVerifiedDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            agent: {
                id: string;
                name: string | null;
                email: string;
                phone: string | null;
            };
            verification: {
                regaVerified: boolean;
                nafathVerified: boolean;
                isFullyVerified: boolean;
                verifiedAt: Date | null;
            };
            properties: {
                id: string;
                title: string;
                isRegaVerified: boolean | null;
                sakNumber: string | null;
            }[];
        };
    } | {
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
                price: number;
                currency: string;
            };
            verification: {
                isRegaVerified: boolean;
                sakNumber: string | null;
                isVerified: boolean;
            };
            agent: {
                id: string;
                name: string | null;
                isRegaVerified: boolean;
                isNafathVerified: boolean;
            };
            developer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                logoUrl: string | null;
                websiteUrl: string | null;
            } | null;
        };
    }>;
    update(id: string, updateVerifiedDto: UpdateVerifiedDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
