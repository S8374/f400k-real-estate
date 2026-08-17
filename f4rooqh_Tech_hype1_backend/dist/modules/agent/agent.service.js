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
exports.AgentMilestonePaymentService = void 0;
const common_1 = require("@nestjs/common");
const milestone_payment_service_1 = require("../milestone-payment/milestone-payment.service");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let AgentMilestonePaymentService = class AgentMilestonePaymentService {
    prisma;
    milestonePaymentService;
    constructor(prisma, milestonePaymentService) {
        this.prisma = prisma;
        this.milestonePaymentService = milestonePaymentService;
    }
    async getPendingPayments(agentId, filterDto) {
        await this.milestonePaymentService.validateAgent(agentId);
        const properties = await this.prisma.property.findMany({
            where: { listingAgentId: agentId },
            select: { id: true },
        });
        const propertyIds = properties.map(p => p.id);
        const where = {
            status: client_1.MilestonePaymentStatus.PENDING,
            milestone: {
                plan: {
                    propertyId: { in: propertyIds },
                },
            },
            ...(filterDto.unreadOnly && { isReadByAgent: false }),
        };
        const result = await this.milestonePaymentService.findPayments(where, {
            milestone: {
                include: {
                    plan: {
                        include: {
                            property: true,
                        },
                    },
                },
            },
            buyer: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                },
            },
        }, filterDto.page, filterDto.limit);
        return {
            success: true,
            data: result.data,
            meta: result.meta,
        };
    }
    async uploadDocument(dto) {
        const { paymentId, agentId, agentDocumentUrls, notes } = dto;
        const payment = await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, agentId);
        const updated = await this.prisma.milestonePayment.update({
            where: { id: paymentId },
            data: {
                agentDocumentUrls,
                agentDocumentNote: notes,
                agentUploadedAt: new Date(),
                isReadByBuyer: false,
                isReadByAgent: true,
                notes: notes ? `${payment.notes || ''} | Agent uploaded: ${notes}` : payment.notes,
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Document uploaded successfully',
            data: updated,
        };
    }
    async reviewPayment(dto) {
        const { paymentId, agentId, notes, status } = dto;
        await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, agentId);
        const payment = await this.prisma.milestonePayment.findUnique({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== client_1.MilestonePaymentStatus.PENDING) {
            throw new common_1.BadRequestException(`Payment cannot be reviewed. Current status: ${payment.status}`);
        }
        const updated = await this.prisma.milestonePayment.update({
            where: { id: paymentId },
            data: {
                agentId,
                agentReviewedAt: new Date(),
                status,
                notes: notes ? `${payment.notes || ''} | Agent review: ${notes}` : payment.notes,
                isReadByAdmin: false,
                isReadByAgent: true,
                isReadByBuyer: false,
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Payment reviewed successfully',
            data: updated,
        };
    }
    async markAsRead(dto) {
        const { paymentId, userId, userRole } = dto;
        await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, userId);
        const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);
        return {
            success: true,
            message: 'Marked as read',
            data: updated,
        };
    }
    async getAgentPerformance(agentId) {
        const agent = await this.prisma.agentProfile.findUnique({
            where: { userId: agentId },
            include: { user: true },
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        const properties = await this.prisma.property.findMany({
            where: { listingAgentId: agentId },
            select: {
                id: true,
                status: true,
            },
        });
        const propertyIds = properties.map(p => p.id);
        const totalListings = properties.length;
        const activeListings = properties.filter(p => p.status === client_1.PropertyStatus.ACTIVE).length;
        const dealsCompleted = await this.prisma.milestonePayment.count({
            where: {
                agentId,
                status: client_1.MilestonePaymentStatus.VERIFIED,
                milestone: {
                    plan: {
                        propertyId: { in: propertyIds },
                    },
                },
            },
        });
        return {
            totalListings,
            activeListings,
            dealsCompleted,
        };
    }
    async getPaymentDetails(id, agentId) {
        await this.milestonePaymentService.validatePaymentAccess(id, undefined, agentId);
        const payment = await this.milestonePaymentService.findOne(id);
        return {
            success: true,
            data: payment,
        };
    }
    async findByAgent(agentId) {
        const agentExists = await this.prisma.agentProfile.findUnique({
            where: { userId: agentId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                        phoneNumber: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!agentExists) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        const properties = await this.prisma.property.findMany({
            where: { listingAgentId: agentId },
            include: {
                developer: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                attributes: true,
                media: {
                    orderBy: {
                        sortOrder: 'asc',
                    },
                },
                units: {
                    include: {
                        media: true,
                    },
                },
                paymentPlans: {
                    include: {
                        milestones: {
                            orderBy: {
                                milestoneOrder: 'asc',
                            },
                        },
                        acceptances: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
                propertyViews: {
                    orderBy: {
                        viewedAt: 'desc',
                    },
                    take: 50,
                },
                savedBy: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                    },
                },
                invisitor: true,
                bankAccount: true,
                nearbyProjects: {
                    where: { isActive: true },
                    orderBy: {
                        distanceKm: 'asc',
                    },
                },
                paymentPlanAcceptances: {
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                        paymentPlan: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        units: true,
                        savedBy: true,
                        propertyViews: true,
                        paymentPlans: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return properties;
    }
    async getAgentDashboardStats(agentId) {
        const agentExists = await this.prisma.agentProfile.findUnique({
            where: { userId: agentId },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!agentExists) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        const agentProperties = await this.prisma.property.findMany({
            where: { listingAgentId: agentId },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                media: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true },
                },
            },
        });
        const propertyIds = agentProperties.map(p => p.id);
        const [totalListings, activeListings, soldListings, pendingListings, totalLeads, totalViews] = await Promise.all([
            this.prisma.property.count({
                where: { listingAgentId: agentId },
            }),
            this.prisma.property.count({
                where: {
                    listingAgentId: agentId,
                    status: 'ACTIVE',
                },
            }),
            this.prisma.property.count({
                where: {
                    listingAgentId: agentId,
                    status: 'SOLD',
                },
            }),
            this.prisma.property.count({
                where: {
                    listingAgentId: agentId,
                    status: 'PENDING',
                },
            }),
            this.prisma.message.count({
                where: {
                    conversation: {
                        propertyId: {
                            in: propertyIds.length > 0 ? propertyIds : ['no-properties'],
                        },
                    },
                },
            }),
            this.prisma.propertyView.count({
                where: {
                    propertyId: {
                        in: propertyIds.length > 0 ? propertyIds : ['no-properties'],
                    },
                },
            }),
            this.prisma.property.groupBy({
                by: ['status'],
                where: { listingAgentId: agentId },
                _count: true,
            }),
            propertyIds.length > 0
                ? this.prisma.propertyView.findMany({
                    where: {
                        propertyId: {
                            in: propertyIds,
                        },
                    },
                    take: 5,
                    orderBy: { viewedAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                })
                : Promise.resolve([]),
            propertyIds.length > 0
                ? this.prisma.message.findMany({
                    where: {
                        conversation: {
                            propertyId: {
                                in: propertyIds,
                            },
                        },
                    },
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        sender: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                })
                : Promise.resolve([]),
            propertyIds.length > 0
                ? this.prisma.savedListing.findMany({
                    where: {
                        propertyId: {
                            in: propertyIds,
                        },
                    },
                    take: 5,
                    orderBy: { savedAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                })
                : Promise.resolve([]),
            this.getTopPerformingProperties(agentId, 5),
        ]);
        const conversionRate = totalViews > 0
            ? ((totalLeads / totalViews) * 100).toFixed(1)
            : '0.0';
        return {
            success: true,
            data: {
                totalListings,
                activeListings,
                soldListings,
                pendingListings,
                totalLeads,
                conversionRate: `${conversionRate}%`,
            },
        };
    }
    async getTopPerformingProperties(agentId, limit = 5) {
        const properties = await this.prisma.property.findMany({
            where: {
                listingAgentId: agentId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                media: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true },
                },
                _count: {
                    select: {
                        propertyViews: true,
                        savedBy: true,
                    },
                },
            },
            orderBy: {
                propertyViews: {
                    _count: 'desc',
                },
            },
            take: limit,
        });
        const propertiesWithLeads = await Promise.all(properties.map(async (property) => {
            const leads = await this.prisma.message.count({
                where: {
                    conversation: {
                        propertyId: property.id,
                    },
                },
            });
            return {
                id: property.id,
                title: property.title,
                price: property.price,
                currency: property.currency,
                image: property.media[0]?.url || null,
                views: property._count.propertyViews,
                saves: property._count.savedBy,
                leads,
                engagementScore: this.calculateEngagementScore(property._count.propertyViews, property._count.savedBy, leads),
            };
        }));
        return propertiesWithLeads.sort((a, b) => b.engagementScore - a.engagementScore);
    }
    calculateEngagementScore(views, saves, leads) {
        return (views * 0.3) + (saves * 1.5) + (leads * 2);
    }
    async getUnreadCount(agentId) {
        await this.milestonePaymentService.validateAgent(agentId);
        return this.milestonePaymentService.getUnreadCount(agentId, 'AGENT');
    }
};
exports.AgentMilestonePaymentService = AgentMilestonePaymentService;
exports.AgentMilestonePaymentService = AgentMilestonePaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        milestone_payment_service_1.MilestonePaymentService])
], AgentMilestonePaymentService);
//# sourceMappingURL=agent.service.js.map