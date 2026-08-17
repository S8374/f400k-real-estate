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
exports.SavedListingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let SavedListingService = class SavedListingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { userId, propertyId } = createDto;
        await this.validateUser(userId);
        await this.validateProperty(propertyId);
        const existing = await this.prisma.savedListing.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Property already saved');
        }
        try {
            const savedListing = await this.prisma.savedListing.create({
                data: {
                    userId,
                    propertyId,
                    savedAt: new Date(),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                    property: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            currency: true,
                            images: true,
                            location: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'Property saved successfully',
                data: savedListing,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Property already saved');
                }
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException('User or Property not found');
                }
            }
            throw error;
        }
    }
    async toggle(createDto) {
        const { userId, propertyId } = createDto;
        await this.validateUser(userId);
        await this.validateProperty(propertyId);
        const existing = await this.prisma.savedListing.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        if (existing) {
            await this.prisma.savedListing.delete({
                where: {
                    userId_propertyId: {
                        userId,
                        propertyId,
                    },
                },
            });
            return {
                success: true,
                message: 'Property removed from saved',
                data: { saved: false },
            };
        }
        else {
            const saved = await this.prisma.savedListing.create({
                data: {
                    userId,
                    propertyId,
                    savedAt: new Date(),
                },
            });
            return {
                success: true,
                message: 'Property saved',
                data: { ...saved, saved: true },
            };
        }
    }
    async findAll(filterDto) {
        const { userId, propertyId, page = 1, limit = 20 } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (userId)
            where.userId = userId;
        if (propertyId)
            where.propertyId = propertyId;
        const [savedListings, total] = await Promise.all([
            this.prisma.savedListing.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                    property: {
                        include: {
                            agent: {
                                include: {
                                    user: {
                                        select: {
                                            fullName: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            media: {
                                where: { isPrimary: true },
                                take: 1,
                            },
                            _count: {
                                select: {
                                    savedBy: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    savedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.savedListing.count({ where }),
        ]);
        return {
            success: true,
            data: savedListings,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(userId, propertyId) {
        const savedListing = await this.prisma.savedListing.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                property: {
                    include: {
                        agent: {
                            include: {
                                user: {
                                    select: {
                                        fullName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        media: true,
                    },
                },
            },
        });
        if (!savedListing) {
            throw new common_1.NotFoundException('Saved listing not found');
        }
        return {
            success: true,
            data: savedListing,
        };
    }
    async findByUser(userId, filterDto) {
        await this.validateUser(userId);
        const result = await this.findAll({ ...filterDto, userId });
        console.log(result);
        const properties = result.data.map(item => ({
            ...item.property,
            savedAt: item.savedAt,
        }));
        return {
            success: true,
            data: properties,
            meta: result.meta,
        };
    }
    async checkSaved(userId, propertyId) {
        await this.validateUser(userId);
        await this.validateProperty(propertyId);
        const saved = await this.prisma.savedListing.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        return {
            success: true,
            data: {
                isSaved: !!saved,
                savedAt: saved?.savedAt || null,
            },
        };
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
exports.SavedListingService = SavedListingService;
exports.SavedListingService = SavedListingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedListingService);
//# sourceMappingURL=save-property.service.js.map