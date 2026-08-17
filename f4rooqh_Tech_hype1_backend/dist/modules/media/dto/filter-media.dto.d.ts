import { MediaType } from '@prisma/client';
export declare class FilterMediaDto {
    propertyId?: string;
    unitId?: string;
    type?: MediaType;
    isPrimary?: boolean;
    page?: number;
    limit?: number;
}
