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
exports.BuyerMilestonePaymentService = void 0;
const common_1 = require("@nestjs/common");
const milestone_payment_service_1 = require("../milestone-payment/milestone-payment.service");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let BuyerMilestonePaymentService = class BuyerMilestonePaymentService {
    prisma;
    milestonePaymentService;
    constructor(prisma, milestonePaymentService) {
        this.prisma = prisma;
        this.milestonePaymentService = milestonePaymentService;
    }
    async uploadPayment(dto) {
        const { milestoneId, propertyId, buyerId, amountPaid, proofUrls, notes } = dto;
        await this.milestonePaymentService.validateBuyer(buyerId);
        await this.milestonePaymentService.validateMilestone(milestoneId, propertyId);
        const existing = await this.prisma.milestonePayment.findFirst({
            where: {
                milestoneId,
                buyerId,
                status: {
                    in: [client_1.MilestonePaymentStatus.PENDING, client_1.MilestonePaymentStatus.AGENT_REVIEWED, client_1.MilestonePaymentStatus.REJECTED],
                },
            },
        });
        let payment;
        if (existing) {
            payment = await this.prisma.milestonePayment.update({
                where: { id: existing.id },
                data: {
                    amountPaid,
                    proofUrls,
                    notes: notes || existing.notes,
                    isReadByAgent: false,
                    isReadByAdmin: false,
                    isReadByBuyer: true,
                    status: client_1.MilestonePaymentStatus.PENDING,
                    paidAt: new Date(),
                },
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
        }
        else {
            payment = await this.prisma.milestonePayment.create({
                data: {
                    milestoneId,
                    buyerId,
                    amountPaid,
                    proofUrls,
                    notes,
                    status: client_1.MilestonePaymentStatus.PENDING,
                    paidAt: new Date(),
                    isReadByBuyer: true,
                    isReadByAgent: false,
                    isReadByAdmin: false,
                },
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
        }
        return {
            success: true,
            message: 'Payment uploaded successfully',
            data: payment,
        };
    }
    async getMyPayments(buyerId, filterDto) {
        await this.milestonePaymentService.validateBuyer(buyerId);
        const where = {
            buyerId,
            ...(filterDto.status && { status: filterDto.status }),
            ...(filterDto.milestoneId && { milestoneId: filterDto.milestoneId }),
        };
        const result = await this.milestonePaymentService.findPayments(where, {
            milestone: {
                include: {
                    plan: {
                        include: {
                            property: {
                                select: {
                                    id: true,
                                    title: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
            },
        }, filterDto.page, filterDto.limit);
        return {
            success: true,
            data: result.data,
            meta: result.meta,
        };
    }
    async markAsRead(dto) {
        const { paymentId, userId, userRole } = dto;
        await this.milestonePaymentService.validatePaymentAccess(paymentId, userId);
        const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);
        return {
            success: true,
            message: 'Marked as read',
            data: updated,
        };
    }
    async getPaymentDetails(id, buyerId) {
        await this.milestonePaymentService.validatePaymentAccess(id, buyerId);
        const payment = await this.milestonePaymentService.findOne(id);
        return {
            success: true,
            data: payment,
        };
    }
    async getUnreadCount(buyerId) {
        await this.milestonePaymentService.validateBuyer(buyerId);
        return this.milestonePaymentService.getUnreadCount(buyerId, 'BUYER');
    }
    async getPerformanceStats(buyerId) {
        await this.milestonePaymentService.validateBuyer(buyerId);
        const propertyViews = await this.prisma.propertyView.groupBy({
            by: ['propertyId'],
            where: { userId: buyerId },
        });
        const [savedCount, ownedCount] = await Promise.all([
            this.prisma.savedListing.count({
                where: { userId: buyerId },
            }),
            this.prisma.paymentPlanAcceptance.count({
                where: { buyerId: buyerId },
            }),
        ]);
        return {
            success: true,
            data: {
                propertiesViewed: propertyViews.length,
                propertiesSaved: savedCount,
                propertiesOwned: ownedCount,
            },
        };
    }
    async getGoldenVisaProgress(buyerId) {
        await this.milestonePaymentService.validateBuyer(buyerId);
        const acceptance = await this.prisma.paymentPlanAcceptance.findFirst({
            where: {
                buyerId,
                property: {
                    type: 'GOLDEN_VISA',
                },
            },
            include: {
                property: true,
            },
        });
        console.log('acceptance', acceptance);
        if (!acceptance) {
            return {
                success: true,
                data: {
                    hasGoldenVisaProject: false,
                    progress: 0,
                    milestoneProgress: 0,
                    documentProgress: 0,
                },
            };
        }
        const allBuyerPayments = await this.prisma.milestonePayment.findMany({
            where: { buyerId },
            include: {
                milestone: true,
            },
        });
        console.log(`[DEBUG] Found ${allBuyerPayments.length} total payments for buyer ${buyerId}`);
        allBuyerPayments.forEach(p => {
            console.log(`[DEBUG] Payment ID: ${p.id}, Status: ${p.status}, PlanID: ${p.milestone?.planId}`);
        });
        const verifiedPayments = allBuyerPayments.filter(p => p.status === client_1.MilestonePaymentStatus.VERIFIED);
        console.log('[DEBUG] Verified payments count:', verifiedPayments.length);
        const verifiedPaymentProgress = verifiedPayments.length * 10;
        const buyerProfile = await this.prisma.buyerProfile.findUnique({
            where: { userId: buyerId },
        });
        console.log('buyerProfile', buyerProfile);
        const userDocument = await this.prisma.kycDocument.findMany({
            where: { userId: buyerId },
        });
        console.log('userDocument', userDocument);
        const verifiedDocs = userDocument.filter(doc => doc.verificationStatus === 'VERIFIED');
        const verifiedCount = verifiedDocs.length;
        console.log('verifiedCount:', verifiedCount);
        const documentProgress = verifiedCount * 8;
        console.log("documentProgress", documentProgress);
        return {
            success: true,
            data: {
                totalProgress: documentProgress + verifiedPaymentProgress,
            },
        };
    }
};
exports.BuyerMilestonePaymentService = BuyerMilestonePaymentService;
exports.BuyerMilestonePaymentService = BuyerMilestonePaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        milestone_payment_service_1.MilestonePaymentService])
], BuyerMilestonePaymentService);
//# sourceMappingURL=buyer.service.js.map