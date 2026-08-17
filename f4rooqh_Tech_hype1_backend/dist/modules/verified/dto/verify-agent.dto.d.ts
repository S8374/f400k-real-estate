export declare class VerifyAgentRegaDto {
    agentId: string;
    adminId: string;
    isRegaVerified: boolean;
    notes?: string;
}
export declare class VerifyAgentNafathDto {
    agentId: string;
    adminId: string;
    isNafathVerified: boolean;
    notes?: string;
}
export declare class VerifyAgentResponseDto {
    success: boolean;
    message: string;
    data: {
        agentId: string;
        isRegaVerified: boolean;
        isNafathVerified: boolean;
        verifiedAt?: Date;
    };
}
