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
exports.PropertyViewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const create_property_view_dto_1 = require("./dto/create-property-view.dto");
const client_1 = require("@prisma/client");
let PropertyViewService = class PropertyViewService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async track(createDto) {
        const { propertyId, userId, source, viewedAt } = createDto;
        await this.validateProperty(propertyId);
        if (userId) {
            await this.validateUser(userId);
        }
        try {
            const view = await this.prisma.propertyView.create({
                data: {
                    propertyId,
                    userId,
                    source: source || create_property_view_dto_1.ViewSource.WEBSITE,
                    viewedAt: viewedAt ? new Date(viewedAt) : new Date(),
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
            await this.prisma.property.update({
                where: { id: propertyId },
                data: {
                    views: {
                        increment: 1,
                    },
                },
            });
            return {
                success: true,
                message: 'Property view tracked successfully',
                data: view,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException('Property not found');
                }
            }
            throw error;
        }
    }
    async findAll(filterDto) {
        const { propertyId, userId, source, fromDate, toDate, uniqueUsers, page = 1, limit = 50, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (userId)
            where.userId = userId;
        if (source)
            where.source = source;
        if (fromDate || toDate) {
            where.viewedAt = {};
            if (fromDate)
                where.viewedAt.gte = new Date(fromDate);
            if (toDate)
                where.viewedAt.lte = new Date(toDate);
        }
        if (uniqueUsers) {
            const uniqueUserViews = await this.prisma.propertyView.groupBy({
                by: ['userId', 'propertyId'],
                where,
                _count: true,
                _max: {
                    viewedAt: true,
                },
            });
            return {
                success: true,
                data: uniqueUserViews,
                count: uniqueUserViews.length,
            };
        }
        const [views, total] = await Promise.all([
            this.prisma.propertyView.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            currency: true,
                            images: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    viewedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.propertyView.count({ where }),
        ]);
        return {
            success: true,
            data: views,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const view = await this.prisma.propertyView.findUnique({
            where: { id },
            include: {
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
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!view) {
            throw new common_1.NotFoundException(`Property view with ID ${id} not found`);
        }
        return {
            success: true,
            data: view,
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
    async getPropertyStats(propertyId) {
        await this.validateProperty(propertyId);
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        const monthAgo = new Date(now.setDate(now.getDate() - 30));
        const [totalViews, todayViews, weekViews, monthViews, uniqueViewers, sourceBreakdown,] = await Promise.all([
            this.prisma.propertyView.count({ where: { propertyId } }),
            this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: today } } }),
            this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: weekAgo } } }),
            this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: monthAgo } } }),
            this.prisma.propertyView.groupBy({
                by: ['userId'],
                where: { propertyId, userId: { not: null } },
                _count: true,
            }),
            this.prisma.propertyView.groupBy({
                by: ['source'],
                where: { propertyId },
                _count: true,
            }),
            this.getDailyViews(7, propertyId),
        ]);
        return {
            success: true,
            data: {
                propertyId,
                totalViews,
                todayViews,
                weekViews,
                monthViews,
                uniqueViewers: uniqueViewers.length,
                sourceBreakdown: sourceBreakdown.map(item => ({
                    source: item.source,
                    count: item._count,
                })),
            },
        };
    }
    async getTrendingProperties(days = 7, limit = 10) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const trending = await this.prisma.propertyView.groupBy({
            by: ['propertyId'],
            where: {
                viewedAt: {
                    gte: since,
                },
            },
            _count: {
                propertyId: true,
            },
            orderBy: {
                _count: {
                    propertyId: 'desc',
                },
            },
            take: limit,
        });
        const propertyIds = trending.map(item => item.propertyId);
        const properties = await this.prisma.property.findMany({
            where: {
                id: { in: propertyIds },
            },
            include: {
                media: {
                    where: { isPrimary: true },
                    take: 1,
                },
                agent: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
        const result = trending.map(item => ({
            ...properties.find(p => p.id === item.propertyId),
            viewCount: item._count.propertyId,
            period: `${days} days`,
        }));
        return {
            success: true,
            data: result,
        };
    }
    async getDailyViews(days = 30, propertyId) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const where = {
            viewedAt: { gte: since },
        };
        if (propertyId)
            where.propertyId = propertyId;
        const views = await this.prisma.propertyView.findMany({
            where,
            select: {
                viewedAt: true,
            },
            orderBy: {
                viewedAt: 'asc',
            },
        });
        const dailyData = {};
        views.forEach(view => {
            const date = view.viewedAt.toISOString().split('T')[0];
            dailyData[date] = (dailyData[date] || 0) + 1;
        });
        const result = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(since);
            date.setDate(date.getDate() + i + 1);
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                count: dailyData[dateStr] || 0,
            });
        }
        return result;
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
exports.PropertyViewService = PropertyViewService;
exports.PropertyViewService = PropertyViewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyViewService);
//# sourceMappingURL=property-view.service.js.map