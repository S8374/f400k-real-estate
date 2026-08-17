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
exports.MilestonePaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
let MilestonePaymentService = class MilestonePaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateMilestone(milestoneId, propertyId) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: {
                plan: {
                    include: {
                        property: true,
                    },
                },
            },
        });
        if (!milestone) {
            throw new common_1.NotFoundException(`Milestone with ID ${milestoneId} not found`);
        }
        if (propertyId && milestone.plan.propertyId !== propertyId) {
            throw new common_1.BadRequestException('Milestone does not belong to the specified property');
        }
        return milestone;
    }
    async validateBuyer(buyerId) {
        if (!buyerId) {
            throw new common_1.BadRequestException('Buyer ID is required');
        }
        const buyer = await this.prisma.buyerProfile.findUnique({
            where: { userId: buyerId },
        });
        if (!buyer) {
            throw new common_1.NotFoundException(`Buyer with ID ${buyerId} not found`);
        }
        return buyer;
    }
    async validateAgent(agentId) {
        const agent = await this.prisma.agentProfile.findUnique({
            where: { userId: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        return agent;
    }
    async validateAdmin(adminId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: 'ADMIN' },
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${adminId} not found`);
        }
        return admin;
    }
    async validatePaymentAccess(paymentId, buyerId, agentId) {
        const payment = await this.prisma.milestonePayment.findUnique({
            where: { id: paymentId },
            include: {
                milestone: {
                    include: {
                        plan: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${paymentId} not found`);
        }
        if (buyerId && payment.buyerId !== buyerId) {
            throw new common_1.BadRequestException('You do not have access to this payment');
        }
        if (agentId && payment.milestone.plan.property.listingAgentId !== agentId) {
            throw new common_1.BadRequestException('You do not have access to this payment');
        }
        return payment;
    }
    async findPayments(where, include, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            this.prisma.milestonePayment.findMany({
                where,
                include: include || {
                    milestone: {
                        include: {
                            plan: {
                                include: {
                                    property: {
                                        select: {
                                            id: true,
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                    agent: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                    admin: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.milestonePayment.count({ where }),
        ]);
        return {
            data: payments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const payment = await this.prisma.milestonePayment.findUnique({
            where: { id },
            include: {
                milestone: {
                    include: {
                        plan: {
                            include: {
                                milestones: {
                                    include: {
                                        payments: true,
                                    },
                                },
                                property: {
                                    select: {
                                        id: true,
                                        title: true,
                                        listingAgentId: true,
                                    },
                                },
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
                agent: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async markAsRead(paymentId, userRole) {
        const updateData = {};
        switch (userRole) {
            case 'BUYER':
                updateData['isReadByBuyer'] = true;
                break;
            case 'AGENT':
                updateData['isReadByAgent'] = true;
                break;
            case 'ADMIN':
                updateData['isReadByAdmin'] = true;
                break;
        }
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('Invalid user role for marking as read');
        }
        return this.prisma.milestonePayment.update({
            where: { id: paymentId },
            data: updateData,
        });
    }
    async getUnreadCount(userId, role) {
        let where = {};
        if (role === 'BUYER') {
            where = { buyerId: userId, isReadByBuyer: false };
        }
        else if (role === 'AGENT') {
            const properties = await this.prisma.property.findMany({
                where: { listingAgentId: userId },
                select: { id: true },
            });
            where = {
                isReadByAgent: false,
                milestone: {
                    plan: {
                        propertyId: { in: properties.map(p => p.id) },
                    },
                },
            };
        }
        else if (role === 'ADMIN') {
            where = { isReadByAdmin: false };
        }
        const count = await this.prisma.milestonePayment.count({ where });
        return { unreadCount: count };
    }
};
exports.MilestonePaymentService = MilestonePaymentService;
exports.MilestonePaymentService = MilestonePaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MilestonePaymentService);
//# sourceMappingURL=milestone-payment.service.js.map