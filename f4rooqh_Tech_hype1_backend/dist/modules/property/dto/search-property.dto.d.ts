import { ListingPurpose } from '@prisma/client';
export declare class SearchPropertyDto {
    location?: string;
    listingPurpose?: ListingPurpose;
    type?: string;
    zoneId?: string;
    minPrice?: number;
    maxPrice?: number;
    timeFilter?: 'today' | 'this_week' | 'this_month' | 'this_year';
    search?: string;
    sortBy?: 'price' | 'createdAt' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
