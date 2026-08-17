import { PropertyViewService } from './property-view.service';
import { CreatePropertyViewDto } from './dto/create-property-view.dto';
import { FilterPropertyViewDto } from './dto/filter-property-view.dto';
export declare class PropertyViewController {
    private readonly service;
    constructor(service: PropertyViewService);
    track(createDto: CreatePropertyViewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
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
            } | null;
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        };
    }>;
    findAll(filterDto: FilterPropertyViewDto): Promise<{
        success: boolean;
        data: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PropertyViewGroupByOutputType, ("userId" | "propertyId")[]> & {
            _count: number;
            _max: {
                viewedAt: Date | null;
            };
        })[];
        count: number;
        meta?: undefined;
    } | {
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            } | null;
            property: {
                id: string;
                images: string[];
                title: string;
                price: number;
                currency: string;
            };
        } & {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        count?: undefined;
    }>;
    findByProperty(propertyId: string, filterDto: FilterPropertyViewDto): Promise<{
        success: boolean;
        data: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PropertyViewGroupByOutputType, ("userId" | "propertyId")[]> & {
            _count: number;
            _max: {
                viewedAt: Date | null;
            };
        })[];
        count: number;
        meta?: undefined;
    } | {
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            } | null;
            property: {
                id: string;
                images: string[];
                title: string;
                price: number;
                currency: string;
            };
        } & {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        count?: undefined;
    }>;
    findByUser(userId: string, filterDto: FilterPropertyViewDto): Promise<{
        success: boolean;
        data: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PropertyViewGroupByOutputType, ("userId" | "propertyId")[]> & {
            _count: number;
            _max: {
                viewedAt: Date | null;
            };
        })[];
        count: number;
        meta?: undefined;
    } | {
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            } | null;
            property: {
                id: string;
                images: string[];
                title: string;
                price: number;
                currency: string;
            };
        } & {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        count?: undefined;
    }>;
    getPropertyStats(propertyId: string): Promise<{
        success: boolean;
        data: {
            propertyId: string;
            totalViews: number;
            todayViews: number;
            weekViews: number;
            monthViews: number;
            uniqueViewers: number;
            sourceBreakdown: {
                source: string | null;
                count: number;
            }[];
        };
    }>;
    getTrendingProperties(days?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            viewCount: number;
            period: string;
            media?: {
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
            }[] | undefined;
            agent?: ({
                user: {
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
            }) | undefined;
            id?: string | undefined;
            status?: import("@prisma/client").$Enums.PropertyStatus | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            type?: import("@prisma/client").$Enums.ProjectType | undefined;
            isRegaVerified?: boolean | null | undefined;
            listingAgentId?: string | undefined;
            listingPurpose?: import("@prisma/client").$Enums.ListingPurpose | undefined;
            developerId?: string | null | undefined;
            zoneId?: string | null | undefined;
            images?: string[] | undefined;
            totalUnits?: number | null | undefined;
            availableUnits?: number | null | undefined;
            latitude?: number | null | undefined;
            longitude?: number | null | undefined;
            addressLine?: string | null | undefined;
            mapEmbedUrl?: string | null | undefined;
            location?: string | null | undefined;
            title?: string | undefined;
            description?: string | null | undefined;
            price?: number | undefined;
            currency?: string | undefined;
            areaSqm?: number | null | undefined;
            areaSqFt?: number | null | undefined;
            bedrooms?: number | null | undefined;
            bathrooms?: number | null | undefined;
            balconies?: number | null | undefined;
            floorNumber?: number | null | undefined;
            yearBuilt?: number | null | undefined;
            parkingSlots?: number | null | undefined;
            furnished?: boolean | null | undefined;
            isBooked?: boolean | null | undefined;
            sakNumber?: string | null | undefined;
            roiProjectionPercent?: number | null | undefined;
            estimatedRentalIncome?: number | null | undefined;
            estimatedRentalCurrency?: string | null | undefined;
            valueApproximate?: number | null | undefined;
            valueApproximateCurrency?: string | null | undefined;
            views?: number | undefined;
            featuredUntil?: Date | null | undefined;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            } | null;
            property: {
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
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        };
    }>;
}
