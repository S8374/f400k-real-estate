"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const milestone_payment_module_1 = require("../milestone-payment/milestone-payment.module");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_agent_controller_1 = require("./admin-agent.controller");
const admin_agent_service_1 = require("./admin-agent.service");
const admin_buyer_controller_1 = require("./admin-buyer.controller");
const admin_buyer_service_1 = require("./admin-buyer.service");
const admin_user_controller_1 = require("./admin-user.controller");
const admin_user_service_1 = require("./admin-user.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [milestone_payment_module_1.MilestonePaymentModule],
        controllers: [
            admin_controller_1.AdminMilestonePaymentController,
            admin_agent_controller_1.AdminAgentController,
            admin_buyer_controller_1.AdminBuyerController,
            admin_user_controller_1.AdminUserController
        ],
        providers: [admin_service_1.AdminMilestonePaymentService, admin_agent_service_1.AdminAgentService, admin_buyer_service_1.AdminBuyerService, admin_user_service_1.AdminUserService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map