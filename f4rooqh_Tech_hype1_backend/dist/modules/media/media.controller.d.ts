import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FilterMediaDto } from './dto/filter-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    create(createMediaDto: CreateMediaDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            } | null;
            unit: {
                id: string;
                unitNumber: string;
            } | null;
        } & {
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
        };
    }>;
    findAll(filterDto: FilterMediaDto): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                title: string;
            } | null;
            unit: {
                id: string;
                unitNumber: string;
            } | null;
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByProperty(propertyId: string): Promise<{
        success: boolean;
        data: {
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
        count: number;
        propertyId: string;
    }>;
    findByUnit(unitId: string): Promise<{
        success: boolean;
        data: {
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
        count: number;
        unitId: string;
    }>;
    findPrimary(entityType: 'property' | 'unit', entityId: string): Promise<{
        success: boolean;
        data: {
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
        } | null;
    }>;
    getMediaTypes(): Promise<{
        success: boolean;
        data: ("IMAGE" | "VIDEO" | "VR_TOUR")[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                title: string;
            } | null;
            unit: {
                id: string;
                title: string | null;
                unitNumber: string;
            } | null;
        } & {
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
        };
    }>;
    update(id: string, updateMediaDto: UpdateMediaDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            } | null;
            unit: {
                id: string;
                unitNumber: string;
            } | null;
        } & {
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
    removeAllByUnit(unitId: string): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
}
