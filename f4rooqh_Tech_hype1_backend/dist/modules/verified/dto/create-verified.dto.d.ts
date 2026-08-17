export declare class VerifyAgentDto {
    agentId: string;
    adminId: string;
    isRegaVerified: boolean;
    isNafathVerified: boolean;
    notes?: string;
}
export declare class VerifyPropertyDto {
    propertyId: string;
    adminId: string;
    isRegaVerified: boolean;
    sakNumber?: string;
    notes?: string;
}
export declare class VerificationFilterDto {
    type?: 'agent' | 'property' | 'all';
    pendingOnly?: boolean;
    agentId?: string;
}
