import { UnitStatus } from '@prisma/client';
export declare class FilterUnitDto {
    propertyId?: string;
    status?: UnitStatus;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    isFeatured?: boolean;
    isPricedOnRequest?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
