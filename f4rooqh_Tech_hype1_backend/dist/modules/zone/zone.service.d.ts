import { PrismaService } from '../../common/context/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ZoneService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ZoneCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        latitude: number | null;
        longitude: number | null;
        isActive: boolean;
        subtitle: string | null;
        imageUrl: string | null;
        color: string | null;
        geojson: Prisma.JsonValue | null;
        propertyCount: number;
        parentId: string | null;
    }>;
    findAll(onlyActive?: boolean): Promise<({
        _count: {
            properties: number;
        };
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            latitude: number | null;
            longitude: number | null;
            isActive: boolean;
            subtitle: string | null;
            imageUrl: string | null;
            color: string | null;
            geojson: Prisma.JsonValue | null;
            propertyCount: number;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        latitude: number | null;
        longitude: number | null;
        isActive: boolean;
        subtitle: string | null;
        imageUrl: string | null;
        color: string | null;
        geojson: Prisma.JsonValue | null;
        propertyCount: number;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        latitude: number | null;
        longitude: number | null;
        isActive: boolean;
        subtitle: string | null;
        imageUrl: string | null;
        color: string | null;
        geojson: Prisma.JsonValue | null;
        propertyCount: number;
        parentId: string | null;
    }>;
    update(id: string, data: Prisma.ZoneUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        latitude: number | null;
        longitude: number | null;
        isActive: boolean;
        subtitle: string | null;
        imageUrl: string | null;
        color: string | null;
        geojson: Prisma.JsonValue | null;
        propertyCount: number;
        parentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        latitude: number | null;
        longitude: number | null;
        isActive: boolean;
        subtitle: string | null;
        imageUrl: string | null;
        color: string | null;
        geojson: Prisma.JsonValue | null;
        propertyCount: number;
        parentId: string | null;
    }>;
}
