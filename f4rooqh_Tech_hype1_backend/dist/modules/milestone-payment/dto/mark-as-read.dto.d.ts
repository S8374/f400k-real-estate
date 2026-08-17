export declare enum UserRole {
    BUYER = "BUYER",
    AGENT = "AGENT",
    ADMIN = "ADMIN"
}
export declare class MarkAsReadDto {
    paymentId: string;
    userId: string;
    userRole: UserRole;
}
