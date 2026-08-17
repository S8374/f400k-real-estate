import { Relationship, IdType } from './create-property-invisitor.dto';
export declare class FilterPropertyInvisitorDto {
    propertyId?: string;
    userId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    relationship?: Relationship;
    idType?: IdType;
    hasIdDocument?: boolean;
    isRegistered?: boolean;
    page?: number;
    limit?: number;
}
