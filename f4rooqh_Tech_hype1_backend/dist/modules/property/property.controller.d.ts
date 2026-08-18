import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    create(createPropertyDto: CreatePropertyDto): Promise<({
        developer: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
            websiteUrl: string | null;
        } | null;
        agent: {
            user: {
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            };
        } & {
            isRegaVerified: boolean;
            verifiedAt: Date | null;
            userId: string;
            licenseId: string | null;
            agencyName: string | null;
            isNafathVerified: boolean;
            trustScore: number;
            bio: string | null;
            yearsExperience: number | null;
        };
        attributes: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
    } & {
        id: string;
        listingAgentId: string;
        status: import("@prisma/client").$Enums.PropertyStatus;
        listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
        type: import("@prisma/client").$Enums.ProjectType;
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
        isRegaVerified: boolean | null;
        sakNumber: string | null;
        roiProjectionPercent: number | null;
        estimatedRentalIncome: number | null;
        estimatedRentalCurrency: string | null;
        valueApproximate: number | null;
        valueApproximateCurrency: string | null;
        views: number;
        featuredUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAll(searchDto: SearchPropertyDto): Promise<{
        success: boolean;
        data: ({
            developer: {
                name: string;
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                logoUrl: string | null;
                websiteUrl: string | null;
            } | null;
            media: {
                id: string;
                type: import("@prisma/client").$Enums.MediaType;
                title: string | null;
                description: string | null;
                propertyId: string | null;
                sortOrder: number;
                isPrimary: boolean;
                unitId: string | null;
                url: string;
                uploadedAt: Date;
            }[];
            agent: {
                user: {
                    email: string;
                    phoneNumber: string | null;
                    fullName: string | null;
                    avatarUrl: string | null;
                };
            } & {
                isRegaVerified: boolean;
                verifiedAt: Date | null;
                userId: string;
                licenseId: string | null;
                agencyName: string | null;
                isNafathVerified: boolean;
                trustScore: number;
                bio: string | null;
                yearsExperience: number | null;
            };
            attributes: {
                id: string;
                propertyId: string;
                key: string;
                value: string;
            }[];
        } & {
            id: string;
            listingAgentId: string;
            status: import("@prisma/client").$Enums.PropertyStatus;
            listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
            type: import("@prisma/client").$Enums.ProjectType;
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
            isRegaVerified: boolean | null;
            sakNumber: string | null;
            roiProjectionPercent: number | null;
            estimatedRentalIncome: number | null;
            estimatedRentalCurrency: string | null;
            valueApproximate: number | null;
            valueApproximateCurrency: string | null;
            views: number;
            featuredUntil: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getAllPropertyTypes(): Promise<{
        success: boolean;
        data: {
            type: "GOLDEN_VISA" | "HIGH_YIELD" | "GIGA_PROJECT" | "OFF_PLAN" | "LUXURY" | "COMMERCIAL" | "RESIDENTIAL" | "KAFD_ELITE" | "MADINAH" | "MAKKAH";
            count: number;
        }[];
    }>;
    getAdminStats(adminId: string): Promise<{
        success: boolean;
        data: {
            totalProperties: number;
            totalInactive: number;
            totalRegaVerified: number;
            totalNonRegaVerified: number;
        };
    }>;
    findOne(id: string): Promise<{
        developer: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
            websiteUrl: string | null;
        } | null;
        media: {
            id: string;
            type: import("@prisma/client").$Enums.MediaType;
            title: string | null;
            description: string | null;
            propertyId: string | null;
            sortOrder: number;
            isPrimary: boolean;
            unitId: string | null;
            url: string;
            uploadedAt: Date;
        }[];
        agent: {
            user: {
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
                avatarUrl: string | null;
            };
        } & {
            isRegaVerified: boolean;
            verifiedAt: Date | null;
            userId: string;
            licenseId: string | null;
            agencyName: string | null;
            isNafathVerified: boolean;
            trustScore: number;
            bio: string | null;
            yearsExperience: number | null;
        };
        paymentPlans: ({
            milestones: ({
                payments: {
                    id: string;
                    status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                    createdAt: Date;
                    verifiedAt: Date | null;
                    milestoneId: string;
                    buyerId: string;
                    agentId: string | null;
                    adminId: string | null;
                    amountPaid: number;
                    proofUrls: string[];
                    paidAt: Date;
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
            })[];
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        })[];
        units: ({
            media: {
                id: string;
                type: import("@prisma/client").$Enums.MediaType;
                title: string | null;
                description: string | null;
                propertyId: string | null;
                sortOrder: number;
                isPrimary: boolean;
                unitId: string | null;
                url: string;
                uploadedAt: Date;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus | null;
            images: string[];
            title: string | null;
            description: string | null;
            price: number;
            currency: string;
            areaSqm: number;
            areaSqFt: number | null;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            floorNumber: number | null;
            parkingSlots: number | null;
            propertyId: string;
            unitNumber: string;
            isFeatured: boolean;
            isPricedOnRequest: boolean;
        })[];
        bankAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
            additionalInfo: string | null;
        } | null;
        nearbyProjects: {
            name: string;
            id: string;
            latitude: number | null;
            longitude: number | null;
            description: string | null;
            propertyId: string;
            isActive: boolean;
            distanceKm: number | null;
            category: string | null;
            icon: string | null;
        }[];
        attributes: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
        _count: {
            propertyViews: number;
            savedBy: number;
        };
    } & {
        id: string;
        listingAgentId: string;
        status: import("@prisma/client").$Enums.PropertyStatus;
        listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
        type: import("@prisma/client").$Enums.ProjectType;
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
        isRegaVerified: boolean | null;
        sakNumber: string | null;
        roiProjectionPercent: number | null;
        estimatedRentalIncome: number | null;
        estimatedRentalCurrency: string | null;
        valueApproximate: number | null;
        valueApproximateCurrency: string | null;
        views: number;
        featuredUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<{
        developer: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
            websiteUrl: string | null;
        } | null;
        media: {
            id: string;
            type: import("@prisma/client").$Enums.MediaType;
            title: string | null;
            description: string | null;
            propertyId: string | null;
            sortOrder: number;
            isPrimary: boolean;
            unitId: string | null;
            url: string;
            uploadedAt: Date;
        }[];
        agent: {
            user: {
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
                avatarUrl: string | null;
            };
        } & {
            isRegaVerified: boolean;
            verifiedAt: Date | null;
            userId: string;
            licenseId: string | null;
            agencyName: string | null;
            isNafathVerified: boolean;
            trustScore: number;
            bio: string | null;
            yearsExperience: number | null;
        };
        paymentPlans: ({
            milestones: ({
                payments: {
                    id: string;
                    status: import("@prisma/client").$Enums.MilestonePaymentStatus;
                    createdAt: Date;
                    verifiedAt: Date | null;
                    milestoneId: string;
                    buyerId: string;
                    agentId: string | null;
                    adminId: string | null;
                    amountPaid: number;
                    proofUrls: string[];
                    paidAt: Date;
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
            })[];
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        })[];
        units: ({
            media: {
                id: string;
                type: import("@prisma/client").$Enums.MediaType;
                title: string | null;
                description: string | null;
                propertyId: string | null;
                sortOrder: number;
                isPrimary: boolean;
                unitId: string | null;
                url: string;
                uploadedAt: Date;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus | null;
            images: string[];
            title: string | null;
            description: string | null;
            price: number;
            currency: string;
            areaSqm: number;
            areaSqFt: number | null;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            floorNumber: number | null;
            parkingSlots: number | null;
            propertyId: string;
            unitNumber: string;
            isFeatured: boolean;
            isPricedOnRequest: boolean;
        })[];
        bankAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
            additionalInfo: string | null;
        } | null;
        nearbyProjects: {
            name: string;
            id: string;
            latitude: number | null;
            longitude: number | null;
            description: string | null;
            propertyId: string;
            isActive: boolean;
            distanceKm: number | null;
            category: string | null;
            icon: string | null;
        }[];
        attributes: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
        _count: {
            propertyViews: number;
            savedBy: number;
        };
    } & {
        id: string;
        listingAgentId: string;
        status: import("@prisma/client").$Enums.PropertyStatus;
        listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
        type: import("@prisma/client").$Enums.ProjectType;
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
        isRegaVerified: boolean | null;
        sakNumber: string | null;
        roiProjectionPercent: number | null;
        estimatedRentalIncome: number | null;
        estimatedRentalCurrency: string | null;
        valueApproximate: number | null;
        valueApproximateCurrency: string | null;
        views: number;
        featuredUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
