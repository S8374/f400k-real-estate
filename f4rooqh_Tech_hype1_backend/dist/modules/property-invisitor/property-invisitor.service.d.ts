import { PrismaService } from '../../common/context/prisma.service';
import { CreatePropertyInvisitorDto } from './dto/create-property-invisitor.dto';
import { UpdatePropertyInvisitorDto } from './dto/update-property-invisitor.dto';
import { FilterPropertyInvisitorDto } from './dto/filter-property-invisitor.dto';
export declare class PropertyInvisitorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreatePropertyInvisitorDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                fullName: string | null;
                avatarUrl: string | null;
                nationality: string | null;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.UserStatus;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                verifiedAt: Date | null;
                lastLogin: Date | null;
                lastActive: Date | null;
                isOnline: boolean;
            } | null;
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        };
    }>;
    findAll(filterDto: FilterPropertyInvisitorDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            } | null;
            property: {
                id: string;
                addressLine: string | null;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
                role: import("@prisma/client").$Enums.Role;
            } | null;
            property: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                addressLine: string | null;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        };
    }>;
    findByProperty(propertyId: string, filterDto: FilterPropertyInvisitorDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            } | null;
            property: {
                id: string;
                addressLine: string | null;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByUser(userId: string, filterDto: FilterPropertyInvisitorDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
            } | null;
            property: {
                id: string;
                addressLine: string | null;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, updateDto: UpdatePropertyInvisitorDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                fullName: string | null;
                avatarUrl: string | null;
                nationality: string | null;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.UserStatus;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                verifiedAt: Date | null;
                lastLogin: Date | null;
                lastActive: Date | null;
                isOnline: boolean;
            } | null;
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private validateProperty;
    private validateUser;
}
