"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentPlanAcceptanceModule = void 0;
const common_1 = require("@nestjs/common");
const payment_plan_acceptance_service_1 = require("./payment-plan-acceptance.service");
const payment_plan_acceptance_controller_1 = require("./payment-plan-acceptance.controller");
let PaymentPlanAcceptanceModule = class PaymentPlanAcceptanceModule {
};
exports.PaymentPlanAcceptanceModule = PaymentPlanAcceptanceModule;
exports.PaymentPlanAcceptanceModule = PaymentPlanAcceptanceModule = __decorate([
    (0, common_1.Module)({
        controllers: [payment_plan_acceptance_controller_1.PaymentPlanAcceptanceController],
        providers: [payment_plan_acceptance_service_1.PaymentPlanAcceptanceService],
        exports: [payment_plan_acceptance_service_1.PaymentPlanAcceptanceService],
    })
], PaymentPlanAcceptanceModule);
//# sourceMappingURL=payment-plan-acceptance.module.js.map