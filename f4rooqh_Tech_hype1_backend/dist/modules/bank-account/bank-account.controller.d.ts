import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { FilterBankAccountDto } from './dto/filter-bank-account.dto';
export declare class BankAccountController {
    private readonly service;
    constructor(service: BankAccountService);
    create(createDto: CreateBankAccountDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        };
    }>;
    findAll(filterDto: FilterBankAccountDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            };
            property: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                title: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByProperty(propertyId: string, filterDto: FilterBankAccountDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            };
            property: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                title: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByUser(userId: string, filterDto: FilterBankAccountDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            };
            property: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                title: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, updateDto: UpdateBankAccountDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                fullName: string | null;
            };
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
