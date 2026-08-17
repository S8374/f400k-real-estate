"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMediaDto) {
        const { propertyId, unitId, ...mediaData } = createMediaDto;
        if (!propertyId && !unitId) {
            throw new common_1.BadRequestException('Either propertyId or unitId must be provided');
        }
        if (propertyId && unitId) {
            throw new common_1.BadRequestException('Cannot provide both propertyId and unitId');
        }
        if (propertyId) {
            await this.validateProperty(propertyId);
        }
        if (unitId) {
            await this.validateUnit(unitId);
        }
        try {
            const media = await this.prisma.media.create({
                data: {
                    ...mediaData,
                    propertyId,
                    unitId,
                },
                include: {
                    property: {
                        select: { id: true, title: true },
                    },
                    unit: {
                        select: { id: true, unitNumber: true },
                    },
                },
            });
            return {
                success: true,
                message: 'Media created successfully',
                data: media,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(filterDto) {
        const { propertyId, unitId, type, isPrimary, page = 1, limit = 50, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (unitId)
            where.unitId = unitId;
        if (type)
            where.type = type;
        if (isPrimary !== undefined)
            where.isPrimary = isPrimary;
        const [media, total] = await Promise.all([
            this.prisma.media.findMany({
                where,
                include: {
                    property: {
                        select: { id: true, title: true },
                    },
                    unit: {
                        select: { id: true, unitNumber: true },
                    },
                },
                orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.media.count({ where }),
        ]);
        return {
            success: true,
            data: media,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const media = await this.prisma.media.findUnique({
            where: { id },
            include: {
                property: {
                    select: { id: true, title: true },
                },
                unit: {
                    select: { id: true, unitNumber: true, title: true },
                },
            },
        });
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID ${id} not found`);
        }
        return {
            success: true,
            data: media,
        };
    }
    async findByProperty(propertyId) {
        await this.validateProperty(propertyId);
        const media = await this.prisma.media.findMany({
            where: { propertyId },
            orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
        });
        return {
            success: true,
            data: media,
            count: media.length,
            propertyId,
        };
    }
    async findByUnit(unitId) {
        await this.validateUnit(unitId);
        const media = await this.prisma.media.findMany({
            where: { unitId },
            orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
        });
        return {
            success: true,
            data: media,
            count: media.length,
            unitId,
        };
    }
    async findPrimary(entityType, entityId) {
        const where = entityType === 'property'
            ? { propertyId: entityId, isPrimary: true }
            : { unitId: entityId, isPrimary: true };
        const media = await this.prisma.media.findFirst({
            where,
        });
        return {
            success: true,
            data: media,
        };
    }
    async update(id, updateMediaDto) {
        await this.findOne(id);
        const { propertyId, unitId, ...updateData } = updateMediaDto;
        if (propertyId) {
            await this.validateProperty(propertyId);
        }
        if (unitId) {
            await this.validateUnit(unitId);
        }
        const updatedMedia = await this.prisma.media.update({
            where: { id },
            data: {
                ...updateData,
                ...(propertyId && { propertyId }),
                ...(unitId && { unitId }),
            },
            include: {
                property: {
                    select: { id: true, title: true },
                },
                unit: {
                    select: { id: true, unitNumber: true },
                },
            },
        });
        return {
            success: true,
            message: 'Media updated successfully',
            data: updatedMedia,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.media.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Media deleted successfully',
        };
    }
    async removeAllByProperty(propertyId) {
        await this.validateProperty(propertyId);
        const result = await this.prisma.media.deleteMany({
            where: { propertyId },
        });
        return {
            success: true,
            message: `Successfully deleted ${result.count} media items`,
            count: result.count,
        };
    }
    async removeAllByUnit(unitId) {
        await this.validateUnit(unitId);
        const result = await this.prisma.media.deleteMany({
            where: { unitId },
        });
        return {
            success: true,
            message: `Successfully deleted ${result.count} media items`,
            count: result.count,
        };
    }
    async getMediaTypes() {
        return {
            success: true,
            data: Object.values(client_1.MediaType),
        };
    }
    async validateProperty(propertyId) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        return property;
    }
    async validateUnit(unitId) {
        const unit = await this.prisma.unit.findUnique({
            where: { id: unitId },
        });
        if (!unit) {
            throw new common_1.NotFoundException(`Unit with ID ${unitId} not found`);
        }
        return unit;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map