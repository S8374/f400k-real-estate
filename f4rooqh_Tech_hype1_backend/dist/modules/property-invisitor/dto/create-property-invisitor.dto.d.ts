export declare enum IdType {
    PASSPORT = "PASSPORT",
    NATIONAL_ID = "NATIONAL_ID",
    DRIVING_LICENSE = "DRIVING_LICENSE",
    RESIDENT_ID = "RESIDENT_ID",
    OTHER = "OTHER"
}
export declare enum Relationship {
    OWNER = "OWNER",
    TENANT = "TENANT",
    FAMILY_MEMBER = "FAMILY_MEMBER",
    FRIEND = "FRIEND",
    COLLEAGUE = "COLLEAGUE",
    LEGAL_REPRESENTATIVE = "LEGAL_REPRESENTATIVE",
    OTHER = "OTHER"
}
export declare class CreatePropertyInvisitorDto {
    propertyId: string;
    userId?: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    relationship?: Relationship;
    idNumber?: string;
    idType?: IdType;
    additionalInfo?: string;
}
