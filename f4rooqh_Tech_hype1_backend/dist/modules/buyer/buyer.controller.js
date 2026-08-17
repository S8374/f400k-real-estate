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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerMilestonePaymentController = void 0;
const common_1 = require("@nestjs/common");
const create_milestone_payment_dto_1 = require("../milestone-payment/dto/create-milestone-payment.dto");
const mark_as_read_dto_1 = require("../milestone-payment/dto/mark-as-read.dto");
const filter_milestone_payment_dto_1 = require("../milestone-payment/dto/filter-milestone-payment.dto");
const buyer_service_1 = require("./buyer.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let BuyerMilestonePaymentController = class BuyerMilestonePaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async uploadPayment(dto, buyerId) {
        return this.service.uploadPayment({ ...dto, buyerId });
    }
    async getMyPayments(buyerId, filterDto) {
        return this.service.getMyPayments(buyerId, filterDto);
    }
    async getUnreadCount(buyerId) {
        return this.service.getUnreadCount(buyerId);
    }
    async getPerformanceStats(buyerId) {
        return this.service.getPerformanceStats(buyerId);
    }
    async markAsRead(dto) {
        return this.service.markAsRead(dto);
    }
    async getGoldenVisaProgress(queryBuyerId, user) {
        const buyerId = queryBuyerId || user?.userId;
        return this.service.getGoldenVisaProgress(buyerId);
    }
    async getPaymentDetails(id, buyerId) {
        return this.service.getPaymentDetails(id, buyerId);
    }
};
exports.BuyerMilestonePaymentController = BuyerMilestonePaymentController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_milestone_payment_dto_1.CreateMilestonePaymentDto, String]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "uploadPayment", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    __param(0, (0, common_1.Query)('buyerId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_milestone_payment_dto_1.FilterMilestonePaymentDto]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "getMyPayments", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Query)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('performance-stats'),
    __param(0, (0, common_1.Query)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "getPerformanceStats", null);
__decorate([
    (0, common_1.Post)('mark-read'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkAsReadDto]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('golden-visa-progress'),
    __param(0, (0, common_1.Query)('buyerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "getGoldenVisaProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BuyerMilestonePaymentController.prototype, "getPaymentDetails", null);
exports.BuyerMilestonePaymentController = BuyerMilestonePaymentController = __decorate([
    (0, common_1.Controller)('buyer/milestone-payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER),
    __metadata("design:paramtypes", [buyer_service_1.BuyerMilestonePaymentService])
], BuyerMilestonePaymentController);
//# sourceMappingURL=buyer.controller.js.map