import { Role } from '@prisma/client';
export declare class RegisterAuthDto {
    fullName: string;
    email: string;
    password: string;
    nationality?: string;
    avatarUrl?: string;
    role?: Role;
    licenseNumber?: number;
    ragaId?: number;
    agencyName?: string;
    investmentField?: string;
    investmentBudgetMin?: number;
    investmentBudgetMax?: number;
    termsAndCondition: boolean;
}
