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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mail_service_1 = require("../../mail/mail.service");
const prisma_service_1 = require("../../common/context/prisma.service");
let CronService = CronService_1 = class CronService {
    prisma;
    mailService;
    logger = new common_1.Logger(CronService_1.name);
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async handlePaymentReminders() {
        this.logger.log('Running daily payment reminder check...');
        try {
            const acceptances = await this.prisma.paymentPlanAcceptance.findMany({
                include: {
                    buyer: true,
                    property: {
                        include: {
                            agent: {
                                include: { user: true }
                            }
                        }
                    },
                    paymentPlan: {
                        include: {
                            milestones: {
                                where: {
                                    dueDate: { not: null },
                                },
                                include: {
                                    payments: true,
                                },
                            },
                        },
                    },
                },
            });
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            for (const acceptance of acceptances) {
                if (!acceptance.paymentPlan?.milestones)
                    continue;
                for (const milestone of acceptance.paymentPlan.milestones) {
                    if (!milestone.dueDate)
                        continue;
                    const milestoneDate = new Date(milestone.dueDate);
                    milestoneDate.setHours(0, 0, 0, 0);
                    const isVerified = milestone.payments.some((p) => p.status === 'VERIFIED');
                    const isPendingReview = milestone.payments.some((p) => p.status === 'PENDING' || p.status === 'AGENT_REVIEWED');
                    if (isVerified || isPendingReview)
                        continue;
                    const diffTime = Math.abs(now.getTime() - milestoneDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const buyerEmail = acceptance.buyer?.email;
                    const agentEmail = acceptance.property?.agent?.user?.email;
                    if (!buyerEmail)
                        continue;
                    if (now.getTime() === milestoneDate.getTime()) {
                        this.logger.log(`Sending Due Today reminder for milestone ${milestone.tittle} to ${buyerEmail}`);
                        await this.mailService.sendPaymentReminderEmail(buyerEmail, agentEmail || '', milestone.tittle || 'Milestone', milestone.dueDate, false);
                    }
                    if (now.getTime() > milestoneDate.getTime()) {
                        if (diffDays === 1 || diffDays === 3 || diffDays === 7 || diffDays % 7 === 0) {
                            this.logger.log(`Sending Overdue (${diffDays} days late) reminder for milestone ${milestone.tittle} to ${buyerEmail}`);
                            await this.mailService.sendPaymentReminderEmail(buyerEmail, agentEmail || '', milestone.tittle || 'Milestone', milestone.dueDate, true);
                        }
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to run payment reminder cron job', error);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handlePaymentReminders", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], CronService);
//# sourceMappingURL=cron.service.js.map