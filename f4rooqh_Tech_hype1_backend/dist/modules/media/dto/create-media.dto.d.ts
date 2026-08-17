import { MediaType } from '@prisma/client';
export declare class CreateMediaDto {
    propertyId?: string;
    unitId?: string;
    url: string;
    type: MediaType;
    title?: string;
    description?: string;
    sortOrder?: number;
    isPrimary?: boolean;
}
