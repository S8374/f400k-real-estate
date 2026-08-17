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
exports.SubscriberService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const mail_service_1 = require("../../mail/mail.service");
let SubscriberService = class SubscriberService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async subscribe(email) {
        const existingSubscriber = await this.prisma.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (existingSubscriber) {
            throw new common_1.HttpException('You are already subscribed.', common_1.HttpStatus.CONFLICT);
        }
        const newSubscriber = await this.prisma.newsletterSubscriber.create({
            data: { email },
        });
        await this.mailService.sendNewsletterNotification(email);
        return {
            success: true,
            message: 'Successfully subscribed to the newsletter!',
            data: newSubscriber,
        };
    }
    async getSubscribers() {
        return await this.prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id) {
        await this.prisma.newsletterSubscriber.delete({
            where: { id },
        });
        return { success: true, message: 'Subscriber removed successfully' };
    }
};
exports.SubscriberService = SubscriberService;
exports.SubscriberService = SubscriberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], SubscriberService);
//# sourceMappingURL=subscriber.service.js.map