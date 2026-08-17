"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const common_1 = require("@nestjs/common");
const milestone_payment_module_1 = require("../milestone-payment/milestone-payment.module");
const agent_controller_1 = require("./agent.controller");
const agent_service_1 = require("./agent.service");
const config_1 = require("@nestjs/config");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = __decorate([
    (0, common_1.Module)({
        imports: [milestone_payment_module_1.MilestonePaymentModule, config_1.ConfigModule],
        controllers: [agent_controller_1.AgentMilestonePaymentController],
        providers: [agent_service_1.AgentMilestonePaymentService],
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map