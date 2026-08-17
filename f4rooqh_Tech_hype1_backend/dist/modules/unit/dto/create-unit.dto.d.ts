import { UnitStatus } from '@prisma/client';
export declare class CreateUnitDto {
    propertyId: string;
    unitNumber: string;
    floorNumber?: number;
    title?: string;
    description?: string;
    price: number;
    currency?: string;
    areaSqm: number;
    areaSqFt?: number;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    parkingSlots?: number;
    status?: UnitStatus;
    images?: string[];
    isFeatured?: boolean;
    isPricedOnRequest?: boolean;
}
