import { PrismaService } from '../../common/context/prisma.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
export declare class DeveloperService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDeveloperDto: CreateDeveloperDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logoUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    findAll(includeProjects?: boolean): Promise<{
        success: boolean;
        data: ({
            property: {
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logoUrl: string | null;
            websiteUrl: string | null;
        })[];
        count: number;
    }>;
    findOne(id: string, includeProjects?: boolean): Promise<{
        success: boolean;
        data: {
            property: {
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logoUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    update(id: string, updateDeveloperDto: UpdateDeveloperDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logoUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    searchByName(name: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logoUrl: string | null;
            websiteUrl: string | null;
        }[];
        count: number;
    }>;
}
