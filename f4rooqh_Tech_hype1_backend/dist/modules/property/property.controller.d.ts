import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    create(createPropertyDto: CreatePropertyDto): Promise<({
        developer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
        attributes: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
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
    }) | null>;
    findAll(searchDto: SearchPropertyDto): Promise<{
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
                    phoneNumber: string | null;
                    fullName: string | null;
                    avatarUrl: string | null;
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
            attributes: {
                id: string;
                propertyId: string;
                key: string;
                value: string;
            }[];
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
                phoneNumber: string | null;
                fullName: string | null;
                avatarUrl: string | null;
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
        paymentPlans: ({
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
        })[];
        units: ({
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
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        } | null;
        nearbyProjects: {
            id: string;
            name: string;
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
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<{
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
                phoneNumber: string | null;
                fullName: string | null;
                avatarUrl: string | null;
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
        paymentPlans: ({
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
        })[];
        units: ({
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
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        } | null;
        nearbyProjects: {
            id: string;
            name: string;
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
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
