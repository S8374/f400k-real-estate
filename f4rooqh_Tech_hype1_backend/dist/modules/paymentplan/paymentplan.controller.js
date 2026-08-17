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
exports.PaymentPlanController = void 0;
const common_1 = require("@nestjs/common");
const filter_payment_plan_dto_1 = require("./dto/filter-payment-plan.dto");
const create_paymentplan_dto_1 = require("./dto/create-paymentplan.dto");
const update_paymentplan_dto_1 = require("./dto/update-paymentplan.dto");
const paymentplan_service_1 = require("./paymentplan.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
let PaymentPlanController = class PaymentPlanController {
    paymentPlanService;
    constructor(paymentPlanService) {
        this.paymentPlanService = paymentPlanService;
    }
    create(user, dto) {
        return this.paymentPlanService.create(user.userId, dto);
    }
    getPlansByCreator(creatorId, propertyId) {
        return this.paymentPlanService.getByCreatorId(creatorId, propertyId);
    }
    getPlansByBuyer(buyerId, propertyId) {
        return this.paymentPlanService.getByBuyerId(buyerId, propertyId);
    }
    findAll(filterDto) {
        return this.paymentPlanService.findAll(filterDto);
    }
    async getPropertyStats(propertyId) {
        return this.paymentPlanService.getPropertyStats(propertyId);
    }
    findByProperty(propertyId, filterDto) {
        return this.paymentPlanService.findByProperty(propertyId, filterDto);
    }
    getSummary() {
        return this.paymentPlanService.getSummary();
    }
    getPropertySummary(propertyId) {
        return this.paymentPlanService.getPropertySummary(propertyId);
    }
    findOne(id) {
        return this.paymentPlanService.findOne(id);
    }
    update(id, updatePaymentPlanDto) {
        return this.paymentPlanService.update(id, updatePaymentPlanDto);
    }
    remove(id) {
        return this.paymentPlanService.remove(id);
    }
};
exports.PaymentPlanController = PaymentPlanController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_paymentplan_dto_1.CreatePaymentPlanDto]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my/:creatorId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('creatorId')),
    __param(1, (0, common_1.Query)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "getPlansByCreator", null);
__decorate([
    (0, common_1.Get)('buyer/:buyerId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('buyerId')),
    __param(1, (0, common_1.Query)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "getPlansByBuyer", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_payment_plan_dto_1.FilterPaymentPlanDto]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':propertyId/stats'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('propertyId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentPlanController.prototype, "getPropertyStats", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_payment_plan_dto_1.FilterPaymentPlanDto]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('property/:propertyId/summary'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "getPropertySummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_paymentplan_dto_1.UpdatePaymentPlanDto]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentPlanController.prototype, "remove", null);
exports.PaymentPlanController = PaymentPlanController = __decorate([
    (0, common_1.Controller)('payment-plans'),
    __metadata("design:paramtypes", [paymentplan_service_1.PaymentPlanService])
], PaymentPlanController);
//# sourceMappingURL=paymentplan.controller.js.map