import { PrismaService } from '../../common/context/prisma.service';
import { CreatePropertyAttributeDto } from './dto/create-property-attribute.dto';
import { UpdatePropertyAttributeDto } from './dto/update-property-attribute.dto';
export declare class PropertyAttributeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPropertyAttributeDto: CreatePropertyAttributeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        data: ({
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        })[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            property: {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                title: string;
                price: number;
            };
        } & {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        };
    }>;
    findByProperty(propertyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
        count: number;
        propertyId: string;
    }>;
    update(id: string, updatePropertyAttributeDto: UpdatePropertyAttributeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    upsert(propertyId: string, key: string, value: string, valueType: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        };
    }>;
    private validateProperty;
}
