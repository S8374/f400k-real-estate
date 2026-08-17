import { PrismaService } from '../../common/context/prisma.service';
import { CreateSavedListingDto } from './dto/create-save-property.dto';
import { FilterSavedListingDto } from './dto/filter-saved.dto';
export declare class SavedListingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateSavedListingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
            property: {
                id: string;
                images: string[];
                location: string | null;
                title: string;
                price: number;
                currency: string;
            };
        } & {
            userId: string;
            savedAt: Date;
            propertyId: string;
        };
    }>;
    toggle(createDto: CreateSavedListingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            saved: boolean;
        };
    } | {
        success: boolean;
        message: string;
        data: {
            saved: boolean;
            userId: string;
            savedAt: Date;
            propertyId: string;
        };
    }>;
    findAll(filterDto: FilterSavedListingDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
            property: {
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
                _count: {
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
            };
        } & {
            userId: string;
            savedAt: Date;
            propertyId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string, propertyId: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
            property: {
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
            };
        } & {
            userId: string;
            savedAt: Date;
            propertyId: string;
        };
    }>;
    findByUser(userId: string, filterDto: FilterSavedListingDto): Promise<{
        success: boolean;
        data: {
            savedAt: Date;
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
            _count: {
                savedBy: number;
            };
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    checkSaved(userId: string, propertyId: string): Promise<{
        success: boolean;
        data: {
            isSaved: boolean;
            savedAt: Date | null;
        };
    }>;
    private validateUser;
    private validateProperty;
}
