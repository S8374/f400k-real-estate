import { Role, UserStatus } from '@prisma/client';
export declare class UserEntity {
    id: string;
    fullName: string | null;
    email: string;
    password: string | null;
    role: Role;
    status: UserStatus;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    nationality?: string | null;
    verifiedAt?: Date | null;
    lastLogin?: Date | null;
    constructor(partial: Partial<UserEntity>);
}
export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    email: string;
    type: string;
    role: Role;
}
