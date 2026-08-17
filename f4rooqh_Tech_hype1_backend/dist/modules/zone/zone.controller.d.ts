import { ZoneService } from './zone.service';
import { Prisma } from '@prisma/client';
export declare class ZoneController {
    private readonly zoneService;
    constructor(zoneService: ZoneService);
    create(createZoneDto: Prisma.ZoneCreateInput): Promise<{
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
    findAll(all?: string): Promise<({
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
    update(id: string, updateZoneDto: Prisma.ZoneUpdateInput): Promise<{
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
