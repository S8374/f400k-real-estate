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
exports.PaymentPlanAcceptanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let PaymentPlanAcceptanceService = class PaymentPlanAcceptanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { agentId, propertyId, paymentPlanId, buyerId } = createDto;
        await this.validateAgent(agentId, propertyId);
        await this.validateBuyer(buyerId);
        await this.validatePaymentPlan(paymentPlanId);
        const existing = await this.prisma.paymentPlanAcceptance.findUnique({
            where: {
                buyerId_propertyId_paymentPlanId: {
                    buyerId: agentId,
                    propertyId,
                    paymentPlanId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Acceptance already exists');
        }
        try {
            const [acceptance] = await this.prisma.$transaction([
                this.prisma.paymentPlanAcceptance.create({
                    data: {
                        buyerId: agentId,
                        propertyId,
                        paymentPlanId,
                        acceptedById: buyerId,
                        acceptedAt: new Date(),
                    },
                    include: {
                        buyer: {
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
                            },
                        },
                        paymentPlan: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        acceptedBy: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                    },
                }),
                this.prisma.property.update({
                    where: { id: propertyId },
                    data: { isBooked: true },
                }),
            ]);
            return {
                success: true,
                message: 'Payment plan accepted successfully and property booked',
                data: acceptance,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('Acceptance already exists');
                }
                if (error.code === 'P2003') {
                    throw new common_1.BadRequestException('Invalid foreign key reference');
                }
            }
            throw error;
        }
    }
    async toggle(createDto) {
        const { agentId, propertyId, paymentPlanId, buyerId } = createDto;
        await this.validateAgent(agentId, propertyId);
        await this.validateBuyer(buyerId);
        await this.validatePaymentPlan(paymentPlanId);
        const existing = await this.prisma.paymentPlanAcceptance.findUnique({
            where: {
                buyerId_propertyId_paymentPlanId: {
                    buyerId: agentId,
                    propertyId,
                    paymentPlanId,
                },
            },
        });
        if (existing) {
            await this.prisma.paymentPlanAcceptance.delete({
                where: { id: existing.id },
            });
            return {
                success: true,
                message: 'Payment plan acceptance removed',
                data: { accepted: false },
            };
        }
        else {
            const acceptance = await this.prisma.paymentPlanAcceptance.create({
                data: {
                    buyerId: agentId,
                    propertyId,
                    paymentPlanId,
                    acceptedById: buyerId,
                    acceptedAt: new Date(),
                },
            });
            const now = new Date();
            const threeDaysFromNow = new Date(now);
            threeDaysFromNow.setDate(now.getDate() + 3);
            await this.prisma.milestone.updateMany({
                where: {
                    planId: paymentPlanId,
                    dueDate: {
                        lt: now,
                    },
                },
                data: {
                    dueDate: threeDaysFromNow,
                },
            });
            return {
                success: true,
                message: 'Payment plan accepted',
                data: { ...acceptance, accepted: true },
            };
        }
    }
    async findOne(id) {
        const acceptance = await this.prisma.paymentPlanAcceptance.findUnique({
            where: { id },
            include: {
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
                paymentPlan: {
                    include: {
                        milestones: {
                            orderBy: {
                                milestoneOrder: 'asc',
                            },
                        },
                    },
                },
                acceptedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        if (!acceptance) {
            throw new common_1.NotFoundException(`Payment plan acceptance with ID ${id} not found`);
        }
        return {
            success: true,
            data: acceptance,
        };
    }
    async findByAgent(agentId, filterDto) {
        await this.validateAgent(agentId);
        if (filterDto.propertyId) {
            await this.validateAgent(agentId, filterDto.propertyId);
        }
        return this.findAll({ ...filterDto, buyerId: agentId });
    }
    async findByBuyer(buyerId, filterDto) {
        await this.validateBuyer(buyerId);
        return this.findAll({ ...filterDto, acceptedById: buyerId });
    }
    async findAll(filterDto) {
        const { buyerId, acceptedById, propertyId, paymentPlanId, withVerifier, page = 1, limit = 50, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (buyerId)
            where.buyerId = buyerId;
        if (acceptedById)
            where.acceptedById = acceptedById;
        if (propertyId)
            where.propertyId = propertyId;
        if (paymentPlanId)
            where.paymentPlanId = paymentPlanId;
        if (withVerifier)
            where.acceptedById = { not: null };
        const [acceptances, total] = await Promise.all([
            this.prisma.paymentPlanAcceptance.findMany({
                where,
                include: {
                    buyer: {
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
                        },
                    },
                    paymentPlan: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    acceptedBy: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    acceptedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.paymentPlanAcceptance.count({ where }),
        ]);
        return {
            success: true,
            data: acceptances,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async checkAcceptance(agentId, propertyId, paymentPlanId) {
        const isAgentProperty = await this.isAgentProperty(agentId, propertyId);
        const acceptance = await this.prisma.paymentPlanAcceptance.findUnique({
            where: {
                buyerId_propertyId_paymentPlanId: {
                    buyerId: agentId,
                    propertyId,
                    paymentPlanId,
                },
            },
            include: {
                acceptedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: {
                isAgentProperty,
                accepted: !!acceptance,
                acceptance: acceptance || null,
            },
        };
    }
    async validateBuyer(buyerId) {
        const user = await this.prisma.user.findUnique({
            where: { id: buyerId },
            include: {
                buyerProfile: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`Buyer with ID ${buyerId} not found`);
        }
        if (user.role !== 'BUYER' || !user.buyerProfile) {
            throw new common_1.BadRequestException(`User with ID ${buyerId} is not a buyer`);
        }
        return user.buyerProfile;
    }
    async validateAgent(agentId, propertyId) {
        const user = await this.prisma.user.findUnique({
            where: { id: agentId },
            include: {
                agentProfile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        if (user.role !== 'AGENT' || !user.agentProfile) {
            throw new common_1.BadRequestException(`User with ID ${agentId} is not an agent`);
        }
        if (!propertyId) {
            return user.agentProfile;
        }
        const property = await this.prisma.property.findFirst({
            where: {
                id: propertyId,
                listingAgentId: agentId,
            },
            select: {
                id: true,
                listingAgentId: true,
            },
        });
        if (!property) {
            const existingProperty = await this.prisma.property.findUnique({
                where: { id: propertyId },
                select: { id: true },
            });
            if (!existingProperty) {
                throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
            }
            throw new common_1.BadRequestException(`Property with ID ${propertyId} does not belong to agent ${agentId}`);
        }
        return property;
    }
    async isAgentProperty(agentId, propertyId) {
        const property = await this.prisma.property.findFirst({
            where: {
                id: propertyId,
                listingAgentId: agentId,
            },
            select: {
                id: true,
            },
        });
        return !!property;
    }
    async validatePaymentPlan(paymentPlanId) {
        const plan = await this.prisma.paymentPlan.findUnique({
            where: { id: paymentPlanId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Payment plan with ID ${paymentPlanId} not found`);
        }
        return plan;
    }
};
exports.PaymentPlanAcceptanceService = PaymentPlanAcceptanceService;
exports.PaymentPlanAcceptanceService = PaymentPlanAcceptanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentPlanAcceptanceService);
//# sourceMappingURL=payment-plan-acceptance.service.js.map