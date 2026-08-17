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
exports.UnitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let UnitService = class UnitService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUnitDto) {
        const { propertyId, images, ...unitData } = createUnitDto;
        const property = await this.validateProperty(propertyId);
        if (!property.availableUnits || property.availableUnits <= 0) {
            throw new common_1.BadRequestException('No available units left for this property');
        }
        const allowedCreateStatuses = [
            client_1.UnitStatus.AVAILABLE,
            client_1.UnitStatus.RENTED,
            client_1.UnitStatus.SELL,
            client_1.UnitStatus.UNDER_OFFER,
            client_1.UnitStatus.OFF_MARKET,
        ];
        if (unitData.status && !allowedCreateStatuses.includes(unitData.status)) {
            throw new common_1.BadRequestException(`Status ${unitData.status} is not allowed during creation. Allowed: ${allowedCreateStatuses.join(', ')}`);
        }
        try {
            const unit = await this.prisma.unit.create({
                data: {
                    propertyId,
                    images: images || [],
                    ...unitData,
                    currency: unitData.currency || 'SAR',
                    status: unitData.status || client_1.UnitStatus.AVAILABLE,
                },
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            listingPurpose: true,
                        },
                    },
                },
            });
            if (property.availableUnits && property.availableUnits > 0) {
                await this.prisma.property.update({
                    where: { id: propertyId },
                    data: {
                        availableUnits: {
                            decrement: 1,
                        },
                    },
                });
            }
            return {
                success: true,
                message: 'Unit created successfully',
                data: unit,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new common_1.BadRequestException('Invalid property ID');
                }
            }
            throw error;
        }
    }
    async findAll(filterDto) {
        const { propertyId, status, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, isFeatured, isPricedOnRequest, search, page = 1, limit = 20, sortBy = 'unitNumber', sortOrder = 'asc', } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (status)
            where.status = status;
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (minArea !== undefined || maxArea !== undefined) {
            where.areaSqm = {};
            if (minArea !== undefined)
                where.areaSqm.gte = minArea;
            if (maxArea !== undefined)
                where.areaSqm.lte = maxArea;
        }
        if (bedrooms !== undefined)
            where.bedrooms = bedrooms;
        if (bathrooms !== undefined)
            where.bathrooms = bathrooms;
        if (isFeatured !== undefined)
            where.isFeatured = isFeatured;
        if (isPricedOnRequest !== undefined)
            where.isPricedOnRequest = isPricedOnRequest;
        if (search) {
            where.OR = [
                { unitNumber: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [units, total] = await Promise.all([
            this.prisma.unit.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            listingPurpose: true,
                        },
                    },
                    media: {
                        take: 1,
                        where: { isPrimary: true },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.prisma.unit.count({ where }),
        ]);
        return {
            success: true,
            data: units,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const unit = await this.prisma.unit.findUnique({
            where: { id },
            include: {
                media: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return {
            success: true,
            data: unit,
        };
    }
    async findByProperty(propertyId, filterDto) {
        await this.validateProperty(propertyId);
        return this.findAll({ ...filterDto, propertyId });
    }
    async findFeatured(limit = 10) {
        const units = await this.prisma.unit.findMany({
            where: {
                isFeatured: true,
                status: client_1.UnitStatus.AVAILABLE,
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                    },
                },
                media: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            take: limit,
        });
        return {
            success: true,
            data: units,
            count: units.length,
        };
    }
    async update(id, updateUnitDto) {
        await this.findOne(id);
        const { propertyId, images, ...updateData } = updateUnitDto;
        if (propertyId) {
            await this.validateProperty(propertyId);
        }
        const allowedUpdateStatuses = [
            client_1.UnitStatus.AVAILABLE,
            client_1.UnitStatus.RENTED,
            client_1.UnitStatus.SELL,
            client_1.UnitStatus.UNDER_OFFER,
            client_1.UnitStatus.OFF_MARKET,
            client_1.UnitStatus.RESERVED,
            client_1.UnitStatus.SOLD,
        ];
        if (updateData.status && !allowedUpdateStatuses.includes(updateData.status)) {
            throw new common_1.BadRequestException(`Status ${updateData.status} is not allowed during update. Allowed: ${allowedUpdateStatuses.join(', ')}`);
        }
        try {
            const updatedUnit = await this.prisma.unit.update({
                where: { id },
                data: {
                    ...updateData,
                    ...(images && { images }),
                    ...(propertyId && { propertyId }),
                },
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'Unit updated successfully',
                data: updatedUnit,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new common_1.BadRequestException('Invalid property ID');
                }
            }
            throw error;
        }
    }
    async updateStatus(id, status) {
        const allowedUpdateStatuses = [
            client_1.UnitStatus.AVAILABLE,
            client_1.UnitStatus.RENTED,
            client_1.UnitStatus.SELL,
            client_1.UnitStatus.UNDER_OFFER,
            client_1.UnitStatus.OFF_MARKET,
            client_1.UnitStatus.RESERVED,
            client_1.UnitStatus.SOLD,
        ];
        if (!allowedUpdateStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Status ${status} is not allowed. Allowed: ${allowedUpdateStatuses.join(', ')}`);
        }
        await this.findOne(id);
        const updatedUnit = await this.prisma.unit.update({
            where: { id },
            data: { status: status },
        });
        return {
            success: true,
            message: `Unit status updated to ${status}`,
            data: updatedUnit,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.unit.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Unit deleted successfully',
        };
    }
    async removeAllByProperty(propertyId) {
        await this.validateProperty(propertyId);
        const result = await this.prisma.unit.deleteMany({
            where: { propertyId },
        });
        return {
            success: true,
            message: `Successfully deleted ${result.count} units`,
            count: result.count,
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
};
exports.UnitService = UnitService;
exports.UnitService = UnitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UnitService);
//# sourceMappingURL=unit.service.js.map