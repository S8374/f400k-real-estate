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
exports.AdminMilestonePaymentService = void 0;
const common_1 = require("@nestjs/common");
const milestone_payment_service_1 = require("../milestone-payment/milestone-payment.service");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let AdminMilestonePaymentService = class AdminMilestonePaymentService {
    prisma;
    milestonePaymentService;
    constructor(prisma, milestonePaymentService) {
        this.prisma = prisma;
        this.milestonePaymentService = milestonePaymentService;
    }
    async getPendingVerification(adminId, filterDto) {
        await this.milestonePaymentService.validateAdmin(adminId);
        const where = {
            status: filterDto.status || client_1.MilestonePaymentStatus.AGENT_REVIEWED,
            ...(filterDto.unreadOnly && { isReadByAdmin: false }),
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
            agent: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        }, filterDto.page, filterDto.limit);
        return {
            success: true,
            data: result.data,
            meta: result.meta,
        };
    }
    async verifyPayment(dto) {
        const { paymentId, adminId, approve, rejectionReason, notes } = dto;
        await this.milestonePaymentService.validateAdmin(adminId);
        const payment = await this.prisma.milestonePayment.findUnique({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.BadRequestException('Payment not found');
        }
        if (payment.status !== client_1.MilestonePaymentStatus.AGENT_REVIEWED) {
            throw new common_1.BadRequestException('Payment must be reviewed by agent first');
        }
        let updated;
        if (approve) {
            updated = await this.prisma.milestonePayment.update({
                where: { id: paymentId },
                data: {
                    adminId,
                    verifiedAt: new Date(),
                    status: client_1.MilestonePaymentStatus.VERIFIED,
                    notes: notes ? `${payment.notes || ''} | Admin verified: ${notes}` : payment.notes,
                    isReadByBuyer: false,
                    isReadByAgent: false,
                    isReadByAdmin: true,
                },
                include: {
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
                },
            });
            return {
                success: true,
                message: 'Payment verified successfully',
                data: updated,
            };
        }
        else {
            if (!rejectionReason) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            updated = await this.prisma.milestonePayment.update({
                where: { id: paymentId },
                data: {
                    adminId,
                    rejectedAt: new Date(),
                    status: client_1.MilestonePaymentStatus.REJECTED,
                    rejectionReason,
                    notes: notes ? `${payment.notes || ''} | Admin rejected: ${notes}` : payment.notes,
                    isReadByBuyer: false,
                    isReadByAgent: false,
                    isReadByAdmin: true,
                },
            });
            return {
                success: true,
                message: 'Payment rejected',
                data: updated,
            };
        }
    }
    async markAsRead(dto) {
        const { paymentId, userId, userRole } = dto;
        await this.milestonePaymentService.validateAdmin(userId);
        const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);
        return {
            success: true,
            message: 'Marked as read',
            data: updated,
        };
    }
    async getPaymentDetails(id, adminId) {
        await this.milestonePaymentService.validateAdmin(adminId);
        const payment = await this.milestonePaymentService.findOne(id);
        return {
            success: true,
            data: payment,
        };
    }
    async getUnreadCount(adminId) {
        await this.milestonePaymentService.validateAdmin(adminId);
        return this.milestonePaymentService.getUnreadCount(adminId, 'ADMIN');
    }
    async getOverview(adminId) {
        await this.milestonePaymentService.validateAdmin(adminId);
        const [pendingAgent, pendingAdmin, verified, rejected, totalAmount,] = await Promise.all([
            this.prisma.milestonePayment.count({ where: { status: client_1.MilestonePaymentStatus.PENDING } }),
            this.prisma.milestonePayment.count({ where: { status: client_1.MilestonePaymentStatus.AGENT_REVIEWED } }),
            this.prisma.milestonePayment.count({ where: { status: client_1.MilestonePaymentStatus.VERIFIED } }),
            this.prisma.milestonePayment.count({ where: { status: client_1.MilestonePaymentStatus.REJECTED } }),
            this.prisma.milestonePayment.aggregate({
                where: { status: client_1.MilestonePaymentStatus.VERIFIED },
                _sum: { amountPaid: true },
            }),
        ]);
        return {
            success: true,
            data: {
                pendingAgentReview: pendingAgent,
                pendingAdminVerification: pendingAdmin,
                verified,
                rejected,
                totalVerifiedAmount: totalAmount._sum.amountPaid || 0,
            },
        };
    }
};
exports.AdminMilestonePaymentService = AdminMilestonePaymentService;
exports.AdminMilestonePaymentService = AdminMilestonePaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        milestone_payment_service_1.MilestonePaymentService])
], AdminMilestonePaymentService);
//# sourceMappingURL=admin.service.js.map