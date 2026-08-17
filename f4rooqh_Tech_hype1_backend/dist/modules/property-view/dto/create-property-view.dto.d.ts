export declare enum ViewSource {
    WEBSITE = "WEBSITE",
    MOBILE_APP = "MOBILE_APP",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    EMAIL = "EMAIL",
    WHATSAPP = "WHATSAPP",
    DIRECT_LINK = "DIRECT_LINK",
    SEARCH_ENGINE = "SEARCH_ENGINE",
    REFERRAL = "REFERRAL",
    ADMIN_PANEL = "ADMIN_PANEL",
    OTHER = "OTHER"
}
export declare class CreatePropertyViewDto {
    propertyId: string;
    userId?: string;
    source?: ViewSource;
    viewedAt?: string;
}
export declare class BulkCreatePropertyViewDto {
    propertyId: string;
    userId?: string;
    source?: ViewSource;
    viewedAt?: string;
    sessionId?: string;
}
