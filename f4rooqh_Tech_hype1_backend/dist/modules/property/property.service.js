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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let PropertyService = class PropertyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const { featuredUntil, attributes = [], listingAgentId, developerId, ...propertyData } = dto;
        const agentExists = await this.prisma.agentProfile.findUnique({
            where: { userId: listingAgentId },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        if (!agentExists) {
            const userExists = await this.prisma.user.findUnique({
                where: { id: listingAgentId },
                select: { role: true }
            });
            if (userExists) {
                throw new common_1.BadRequestException(`User with ID ${listingAgentId} exists but is not an agent. User role: ${userExists.role}. ` +
                    'Please create an agent profile first or use a valid agent ID.');
            }
            else {
                throw new common_1.NotFoundException(`Agent with ID ${listingAgentId} not found. Please provide a valid agent ID.`);
            }
        }
        if (!agentExists.isRegaVerified || !agentExists.isNafathVerified) {
            throw new common_1.ForbiddenException('Agent must be fully verified (REGA and Nafath) before adding a property.');
        }
        if (developerId) {
            const developerExists = await this.prisma.developer.findUnique({
                where: { id: developerId }
            });
            if (!developerExists) {
                throw new common_1.NotFoundException(`Developer with ID ${developerId} not found`);
            }
        }
        return this.prisma.$transaction(async (tx) => {
            try {
                const property = await tx.property.create({
                    data: {
                        listingAgentId,
                        developerId,
                        ...propertyData,
                        featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
                        currency: dto.currency ?? 'SAR',
                        images: propertyData.images || [],
                    },
                });
                if (attributes.length > 0) {
                    await tx.propertyAttribute.createMany({
                        data: attributes.map(attr => ({
                            propertyId: property.id,
                            key: attr.key,
                            value: attr.value,
                        })),
                        skipDuplicates: true,
                    });
                }
                return tx.property.findUnique({
                    where: { id: property.id },
                    include: {
                        agent: {
                            include: {
                                user: {
                                    select: {
                                        fullName: true,
                                        email: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        },
                        developer: true,
                        attributes: true
                    }
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2003') {
                        const field = error.meta?.field_name || 'unknown';
                        throw new common_1.BadRequestException(`Foreign key constraint failed on ${field}`);
                    }
                    if (error.code === 'P2002') {
                        throw new common_1.BadRequestException('Unique constraint violation');
                    }
                }
                throw error;
            }
        });
    }
    async findAll(searchDto) {
        const { location, listingPurpose, minPrice, type, maxPrice, timeFilter, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20, } = searchDto || {};
        const andConditions = [];
        const orConditions = [];
        const where = {
            isRegaVerified: true,
            status: 'ACTIVE'
        };
        if (location?.trim()) {
            orConditions.push({
                location: { contains: location, mode: 'insensitive' },
            });
        }
        if (listingPurpose) {
            andConditions.push({ listingPurpose });
        }
        if (searchDto?.zoneId && searchDto.zoneId !== 'allproperties') {
            andConditions.push({ zoneId: searchDto.zoneId });
        }
        if (type && type !== 'allproperties') {
            andConditions.push({ type });
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            const price = {};
            if (minPrice !== undefined)
                price.gte = minPrice;
            if (maxPrice !== undefined)
                price.lte = maxPrice;
            andConditions.push({ price });
        }
        if (timeFilter) {
            const now = new Date();
            let gteDate = null;
            switch (timeFilter) {
                case 'today':
                    gteDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'this_week':
                    gteDate = new Date(new Date().setDate(now.getDate() - 7));
                    break;
                case 'this_month':
                    gteDate = new Date(new Date().setMonth(now.getMonth() - 1));
                    break;
                case 'this_year':
                    gteDate = new Date(new Date().setFullYear(now.getFullYear() - 1));
                    break;
            }
            if (gteDate) {
                orConditions.push({ createdAt: { gte: gteDate } });
            }
        }
        if (search?.trim()) {
            const words = search.trim().split(/\s+/);
            words.forEach((word) => {
                const textMatch = { contains: word, mode: 'insensitive' };
                const normalizedWord = word.toUpperCase().replace(/\s+/g, '_');
                const matchedTypes = Object.values(client_1.ProjectType).filter((projectType) => projectType.includes(normalizedWord) ||
                    projectType.replace(/_/g, '').includes(normalizedWord.replace(/_/g, '')));
                orConditions.push({ title: textMatch }, { description: textMatch }, { location: textMatch }, { addressLine: textMatch }, { developer: { name: textMatch } }, { agent: { user: { fullName: textMatch } } }, { agent: { agencyName: textMatch } }, { nearbyProjects: { some: { name: textMatch } } }, {
                    attributes: {
                        some: {
                            OR: [{ key: textMatch }, { value: textMatch }],
                        },
                    },
                }, {
                    nearbyProjects: {
                        some: { name: textMatch },
                    },
                }, {
                    units: {
                        some: {
                            OR: [
                                { unitNumber: textMatch },
                                { title: textMatch },
                                { description: textMatch },
                            ],
                        },
                    },
                }, {
                    paymentPlans: {
                        some: {
                            OR: [
                                { name: textMatch },
                            ]
                        }
                    }
                });
                if (matchedTypes.length > 0) {
                    matchedTypes.forEach((matchedType) => {
                        orConditions.push({ type: matchedType });
                    });
                }
                if (!isNaN(Number(word))) {
                    const num = Number(word);
                    orConditions.push({ price: num }, { bedrooms: num }, { bathrooms: num });
                }
            });
        }
        where.AND = [
            ...andConditions,
            ...(orConditions.length > 0 ? [{ OR: orConditions }] : []),
        ];
        const skip = (page - 1) * limit;
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        const [properties, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                include: {
                    agent: {
                        include: {
                            user: {
                                select: {
                                    fullName: true,
                                    email: true,
                                    phoneNumber: true,
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                    developer: true,
                    attributes: true,
                    media: {
                        take: 1,
                        where: { isPrimary: true },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.property.count({ where }),
        ]);
        return {
            success: true,
            data: properties
        };
    }
    async findOne(id) {
        const property = await this.prisma.property.findUnique({
            where: { id },
            include: {
                agent: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                email: true,
                                phoneNumber: true,
                                avatarUrl: true
                            }
                        }
                    }
                },
                developer: true,
                attributes: true,
                media: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
                units: {
                    include: {
                        media: true
                    }
                },
                paymentPlans: {
                    include: {
                        milestones: {
                            orderBy: {
                                milestoneOrder: 'asc'
                            },
                            include: {
                                payments: {
                                    where: {
                                        status: 'VERIFIED'
                                    }
                                }
                            }
                        }
                    }
                },
                bankAccount: true,
                nearbyProjects: {
                    where: { isActive: true }
                },
                _count: {
                    select: {
                        savedBy: true,
                        propertyViews: true
                    }
                }
            },
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async getAllPropertyTypes() {
        const types = Object.values(client_1.ProjectType);
        const typeCounts = await Promise.all(types.map(async (type) => {
            const count = await this.prisma.property.count({
                where: {
                    type: type,
                    isRegaVerified: true
                },
            });
            return {
                type,
                count,
            };
        }));
        return {
            success: true,
            data: typeCounts,
        };
    }
    async update(id, dto) {
        await this.findOne(id);
        const { attributes, featuredUntil, listingAgentId, developerId, ...restDto } = dto;
        if (listingAgentId) {
            const agentExists = await this.prisma.agentProfile.findUnique({
                where: { userId: listingAgentId }
            });
            if (!agentExists) {
                throw new common_1.NotFoundException(`Agent with ID ${listingAgentId} not found`);
            }
        }
        if (developerId) {
            const developerExists = await this.prisma.developer.findUnique({
                where: { id: developerId }
            });
            if (!developerExists) {
                throw new common_1.NotFoundException(`Developer with ID ${developerId} not found`);
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const updateData = {
                ...restDto,
                ...(listingAgentId && { listingAgentId }),
                ...(developerId && { developerId }),
                featuredUntil: featuredUntil ? new Date(featuredUntil) : undefined,
            };
            if (restDto.images) {
                updateData.images = restDto.images;
            }
            await tx.property.update({
                where: { id },
                data: updateData,
            });
            if (attributes) {
                await tx.propertyAttribute.deleteMany({
                    where: { propertyId: id }
                });
                if (attributes.length > 0) {
                    await tx.propertyAttribute.createMany({
                        data: attributes.map(a => ({
                            propertyId: id,
                            key: a.key,
                            value: a.value,
                        })),
                        skipDuplicates: true,
                    });
                }
            }
            return this.findOne(id);
        });
    }
    async remove(id) {
        try {
            await this.prisma.property.delete({
                where: { id },
            });
            return { success: true, message: 'Property deleted successfully' };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Property with ID ${id} not found`);
                }
                if (error.code === 'P2003') {
                    throw new common_1.BadRequestException('Cannot delete property because it has related records');
                }
            }
            throw error;
        }
    }
    async validateAgent(userId) {
        const agentProfile = await this.prisma.agentProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { role: true }
                }
            }
        });
        return !!agentProfile;
    }
    async getAvailableAgents() {
        return this.prisma.agentProfile.findMany({
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            where: {
                user: {
                    status: 'ACTIVE'
                }
            }
        });
    }
    async getAdminStats(adminId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: 'ADMIN' },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Unauthorized: Only admins can view statistics');
        }
        const [total, inactive, regaVerified, nonRegaVerified] = await Promise.all([
            this.prisma.property.count(),
            this.prisma.property.count({ where: { status: { not: 'ACTIVE' } } }),
            this.prisma.property.count({ where: { isRegaVerified: true } }),
            this.prisma.property.count({ where: { isRegaVerified: false } }),
        ]);
        return {
            success: true,
            data: {
                totalProperties: total,
                totalInactive: inactive,
                totalRegaVerified: regaVerified,
                totalNonRegaVerified: nonRegaVerified,
            },
        };
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyService);
//# sourceMappingURL=property.service.js.map