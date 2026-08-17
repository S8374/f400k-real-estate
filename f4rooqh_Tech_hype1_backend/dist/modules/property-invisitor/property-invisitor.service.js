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
exports.PropertyInvisitorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let PropertyInvisitorService = class PropertyInvisitorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { propertyId, userId, ...visitorData } = createDto;
        await this.validateProperty(propertyId);
        if (userId) {
            await this.validateUser(userId);
        }
        const existing = await this.prisma.propertyInvisitor.findUnique({
            where: { propertyId },
        });
        if (existing) {
            throw new common_1.ConflictException('This property already has an invisitor assigned');
        }
        try {
            const invisitor = await this.prisma.propertyInvisitor.create({
                data: {
                    propertyId,
                    userId,
                    ...visitorData,
                },
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    user: userId ? {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    } : undefined,
                },
            });
            return {
                success: true,
                message: 'Property invisitor created successfully',
                data: invisitor,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('This property already has an invisitor');
                }
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException('Property or User not found');
                }
            }
            throw error;
        }
    }
    async findAll(filterDto) {
        const { propertyId, userId, name, email, phoneNumber, relationship, idType, hasIdDocument, isRegistered, page = 1, limit = 20, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (userId)
            where.userId = userId;
        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }
        if (email)
            where.email = email;
        if (phoneNumber)
            where.phoneNumber = phoneNumber;
        if (relationship)
            where.relationship = relationship;
        if (idType)
            where.idType = idType;
        if (hasIdDocument) {
            where.AND = [
                { idNumber: { not: null } },
                { idType: { not: null } },
            ];
        }
        if (isRegistered !== undefined) {
            where.userId = isRegistered ? { not: null } : null;
        }
        const [invisors, total] = await Promise.all([
            this.prisma.propertyInvisitor.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            addressLine: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phoneNumber: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.propertyInvisitor.count({ where }),
        ]);
        return {
            success: true,
            data: invisors,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const invisitor = await this.prisma.propertyInvisitor.findUnique({
            where: { id },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        addressLine: true,
                        status: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                        role: true,
                    },
                },
            },
        });
        if (!invisitor) {
            throw new common_1.NotFoundException(`Property invisitor with ID ${id} not found`);
        }
        return {
            success: true,
            data: invisitor,
        };
    }
    async findByProperty(propertyId, filterDto) {
        await this.validateProperty(propertyId);
        return this.findAll({ ...filterDto, propertyId });
    }
    async findByUser(userId, filterDto) {
        await this.validateUser(userId);
        return this.findAll({ ...filterDto, userId });
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const { propertyId, userId, ...updateData } = updateDto;
        if (propertyId) {
            await this.validateProperty(propertyId);
            if (propertyId) {
                const existing = await this.prisma.propertyInvisitor.findUnique({
                    where: { propertyId },
                });
                if (existing && existing.id !== id) {
                    throw new common_1.ConflictException('Target property already has an invisitor');
                }
            }
        }
        if (userId) {
            await this.validateUser(userId);
        }
        const updated = await this.prisma.propertyInvisitor.update({
            where: { id },
            data: {
                ...updateData,
                ...(propertyId && { propertyId }),
                ...(userId && { userId }),
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                user: userId ? {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                } : undefined,
            },
        });
        return {
            success: true,
            message: 'Property invisitor updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.propertyInvisitor.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Property invisitor deleted successfully',
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
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
};
exports.PropertyInvisitorService = PropertyInvisitorService;
exports.PropertyInvisitorService = PropertyInvisitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyInvisitorService);
//# sourceMappingURL=property-invisitor.service.js.map