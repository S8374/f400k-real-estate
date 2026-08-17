import { ListingPurpose, ProjectType, PropertyStatus } from '@prisma/client';
declare class PropertyAttributeDto {
    key: string;
    value: string;
    valueType?: string;
}
export declare class CreatePropertyDto {
    listingAgentId: string;
    status: PropertyStatus;
    listingPurpose: ListingPurpose;
    type?: ProjectType;
    developerId?: string;
    images?: string[];
    totalUnits?: number;
    availableUnits?: number;
    latitude?: number;
    longitude?: number;
    addressLine?: string;
    mapEmbedUrl?: string;
    location?: string;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    areaSqm?: number;
    areaSqFt?: number;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    floorNumber?: number;
    yearBuilt?: number;
    parkingSlots?: number;
    furnished?: boolean;
    roiProjectionPercent?: number;
    estimatedRentalIncome?: number;
    estimatedRentalCurrency?: string;
    valueApproximate?: number;
    valueApproximateCurrency?: string;
    featuredUntil?: string;
    attributes?: PropertyAttributeDto[];
}
export {};
