import { PrismaService } from '../../common/context/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilterUnitDto } from './dto/filter-unit.dto';
export declare class UnitService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUnitDto: CreateUnitDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                title: string;
            };
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
        };
    }>;
    findAll(filterDto: FilterUnitDto): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                title: string;
            };
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    findByProperty(propertyId: string, filterDto: FilterUnitDto): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                title: string;
            };
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findFeatured(limit?: number): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                location: string | null;
                title: string;
            };
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
        count: number;
    }>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            };
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
        };
    }>;
    updateStatus(id: string, status: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAllByProperty(propertyId: string): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    private validateProperty;
}
