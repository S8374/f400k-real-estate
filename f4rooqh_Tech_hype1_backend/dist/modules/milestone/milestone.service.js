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
exports.MilestoneService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
let MilestoneService = class MilestoneService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMilestoneDto) {
        const { planId, dueDate, amount, milestoneOrder, ...milestoneData } = createMilestoneDto;
        await this.validatePaymentPlan(planId);
        const lastMilestone = await this.prisma.milestone.findFirst({
            where: { planId },
            orderBy: { milestoneOrder: 'desc' },
            select: { milestoneOrder: true },
        });
        const nextOrder = lastMilestone ? lastMilestone.milestoneOrder + 1 : 1;
        if (milestoneOrder !== nextOrder) {
            throw new common_1.BadRequestException({
                message: `Invalid milestone order expected  ${nextOrder}`,
                expectedOrder: nextOrder,
                receivedOrder: milestoneOrder,
            });
        }
        const milestone = await this.prisma.milestone.create({
            data: {
                planId,
                ...milestoneData,
                milestoneOrder: nextOrder,
                amount: amount || 0,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
            include: {
                plan: {
                    select: {
                        id: true,
                        name: true,
                        property: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Milestone created successfully',
            data: milestone,
        };
    }
    async findAll(filterDto) {
        const { planId, hasDueDate, page = 1, limit = 50, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (planId)
            where.planId = planId;
        if (hasDueDate !== undefined) {
            where.dueDate = hasDueDate ? { not: null } : null;
        }
        const [milestones, total] = await Promise.all([
            this.prisma.milestone.findMany({
                where,
                include: {
                    plan: {
                        select: {
                            id: true,
                            name: true,
                            property: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    payments: {
                        where: {
                            status: 'VERIFIED'
                        },
                        select: {
                            id: true,
                            status: true
                        }
                    },
                    _count: {
                        select: {
                            payments: true,
                        },
                    },
                },
                orderBy: [
                    { planId: 'asc' },
                    { milestoneOrder: 'asc' },
                ],
                skip,
                take: limit,
            }),
            this.prisma.milestone.count({ where }),
        ]);
        return {
            success: true,
            data: milestones,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id },
            include: {
                plan: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
                payments: {
                    orderBy: { paidAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!milestone) {
            throw new common_1.NotFoundException(`Milestone with ID ${id} not found`);
        }
        return {
            success: true,
            data: milestone,
        };
    }
    async findByPlan(planId, filterDto) {
        await this.validatePaymentPlan(planId);
        return this.findAll({ ...filterDto, planId });
    }
    async findUpcoming(days = 30) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const milestones = await this.prisma.milestone.findMany({
            where: {
                dueDate: {
                    not: null,
                    gte: now,
                    lte: futureDate,
                },
            },
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
            orderBy: {
                dueDate: 'asc',
            },
        });
        return {
            success: true,
            data: milestones,
            count: milestones.length,
            timeframe: `${days} days`,
        };
    }
    async update(id, updateMilestoneDto) {
        await this.findOne(id);
        const { planId, dueDate, amount, ...updateData } = updateMilestoneDto;
        if (planId) {
            await this.validatePaymentPlan(planId);
        }
        if (updateData.milestoneOrder) {
            const currentMilestone = await this.prisma.milestone.findUnique({
                where: { id },
                select: { planId: true },
            });
            if (!currentMilestone) {
                throw new common_1.NotFoundException(`Milestone with ID ${id} not found`);
            }
            const targetPlanId = planId || currentMilestone.planId;
            const existingMilestone = await this.prisma.milestone.findUnique({
                where: {
                    planId_milestoneOrder: {
                        planId: targetPlanId,
                        milestoneOrder: updateData.milestoneOrder,
                    },
                },
            });
            if (existingMilestone && existingMilestone.id !== id) {
                throw new common_1.BadRequestException(`Milestone with order ${updateData.milestoneOrder} already exists for this payment plan`);
            }
        }
        const updatedMilestone = await this.prisma.milestone.update({
            where: { id },
            data: {
                ...updateData,
                amount: amount !== undefined ? amount : undefined,
                ...(dueDate && { dueDate: new Date(dueDate) }),
                ...(planId && { planId }),
            },
            include: {
                plan: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Milestone updated successfully',
            data: updatedMilestone,
        };
    }
    async reorder(planId, items) {
        await this.validatePaymentPlan(planId);
        const milestoneIds = items.map(item => item.id);
        const milestones = await this.prisma.milestone.findMany({
            where: {
                id: { in: milestoneIds },
                planId,
            },
        });
        if (milestones.length !== items.length) {
            throw new common_1.BadRequestException('Some milestones do not belong to this plan');
        }
        const orders = items.map(item => item.milestoneOrder);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            throw new common_1.BadRequestException('Duplicate milestone orders');
        }
        const updates = items.map(item => this.prisma.milestone.update({
            where: { id: item.id },
            data: { milestoneOrder: item.milestoneOrder },
        }));
        await this.prisma.$transaction(updates);
        return {
            success: true,
            message: 'Milestones reordered successfully',
        };
    }
    async remove(id) {
        await this.findOne(id);
        const paymentsCount = await this.prisma.milestonePayment.count({
            where: { milestoneId: id },
        });
        if (paymentsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete milestone with ${paymentsCount} payments`);
        }
        await this.prisma.milestone.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Milestone deleted successfully',
        };
    }
    async removeAllByPlan(planId) {
        await this.validatePaymentPlan(planId);
        const milestonesWithPayments = await this.prisma.milestone.findMany({
            where: {
                planId,
                payments: {
                    some: {},
                },
            },
            select: {
                id: true,
                milestoneOrder: true,
                _count: {
                    select: { payments: true },
                },
            },
        });
        if (milestonesWithPayments.length > 0) {
            const milestoneInfo = milestonesWithPayments
                .map(m => `Order ${m.milestoneOrder} (${m._count.payments} payments)`)
                .join(', ');
            throw new common_1.BadRequestException(`Cannot delete milestones with payments: ${milestoneInfo}`);
        }
        const result = await this.prisma.milestone.deleteMany({
            where: { planId },
        });
        return {
            success: true,
            message: `Successfully deleted ${result.count} milestones`,
            count: result.count,
        };
    }
    async getPlanSummary(planId) {
        await this.validatePaymentPlan(planId);
        const milestones = await this.prisma.milestone.findMany({
            where: { planId },
            include: {
                _count: {
                    select: { payments: true },
                },
            },
            orderBy: {
                milestoneOrder: 'asc',
            },
        });
        const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
        const withDueDate = milestones.filter(m => m.dueDate).length;
        const withConstructionProgress = milestones.filter(m => m.constructionProgress).length;
        return {
            success: true,
            data: {
                planId,
                totalMilestones: milestones.length,
                totalAmount,
                withDueDate,
                withConstructionProgress,
                milestones: milestones.map(m => ({
                    id: m.id,
                    order: m.milestoneOrder,
                    tittle: m.tittle,
                    description: m.description,
                    amount: m.amount,
                    dueDate: m.dueDate,
                    constructionProgress: m.constructionProgress,
                    paymentCount: m._count.payments,
                })),
            },
        };
    }
    async getPropertyConstructionProgress(propertyId) {
        const milestones = await this.prisma.milestone.findMany({
            where: {
                plan: {
                    propertyId,
                },
            },
            include: {
                payments: {
                    where: {
                        status: 'VERIFIED',
                    },
                },
            },
        });
        if (milestones.length === 0) {
            return {
                success: true,
                data: {
                    totalMilestones: 0,
                    completedMilestones: 0,
                    constructionProgress: 0,
                },
            };
        }
        const completedMilestones = milestones.filter(m => m.payments.length > 0).length;
        const constructionProgress = (completedMilestones / milestones.length) * 100;
        return {
            success: true,
            data: {
                totalMilestones: milestones.length,
                completedMilestones,
                constructionProgress: Math.round(constructionProgress),
            },
        };
    }
    async validatePaymentPlan(planId) {
        const plan = await this.prisma.paymentPlan.findUnique({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Payment plan with ID ${planId} not found`);
        }
        return plan;
    }
};
exports.MilestoneService = MilestoneService;
exports.MilestoneService = MilestoneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MilestoneService);
//# sourceMappingURL=milestone.service.js.map