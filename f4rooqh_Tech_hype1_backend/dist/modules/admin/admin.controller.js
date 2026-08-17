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
exports.AdminMilestonePaymentController = void 0;
const common_1 = require("@nestjs/common");
const admin_action_dto_1 = require("../milestone-payment/dto/admin-action.dto");
const mark_as_read_dto_1 = require("../milestone-payment/dto/mark-as-read.dto");
const filter_milestone_payment_dto_1 = require("../milestone-payment/dto/filter-milestone-payment.dto");
const admin_service_1 = require("./admin.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminMilestonePaymentController = class AdminMilestonePaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getOverview(adminId) {
        return this.service.getOverview(adminId);
    }
    async getPendingVerification(adminId, filterDto) {
        return this.service.getPendingVerification(adminId, filterDto);
    }
    async getUnreadCount(adminId) {
        return this.service.getUnreadCount(adminId);
    }
    async getPaymentDetails(id, adminId) {
        return this.service.getPaymentDetails(id, adminId);
    }
    async verifyPayment(dto) {
        return this.service.verifyPayment(dto);
    }
    async markAsRead(dto) {
        return this.service.markAsRead(dto);
    }
};
exports.AdminMilestonePaymentController = AdminMilestonePaymentController;
__decorate([
    (0, common_1.Get)('stats/:adminId'),
    __param(0, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('pending/:adminId'),
    __param(0, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_milestone_payment_dto_1.FilterMilestonePaymentDto]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "getPendingVerification", null);
__decorate([
    (0, common_1.Get)('unread/:adminId'),
    __param(0, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('details/:id/:adminId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "getPaymentDetails", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_action_dto_1.AdminVerifyDto]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('mark-read'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkAsReadDto]),
    __metadata("design:returntype", Promise)
], AdminMilestonePaymentController.prototype, "markAsRead", null);
exports.AdminMilestonePaymentController = AdminMilestonePaymentController = __decorate([
    (0, common_1.Controller)('admin/milestone-payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminMilestonePaymentService])
], AdminMilestonePaymentController);
//# sourceMappingURL=admin.controller.js.map