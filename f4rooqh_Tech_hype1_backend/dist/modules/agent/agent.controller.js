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
exports.AgentMilestonePaymentController = void 0;
const common_1 = require("@nestjs/common");
const agent_action_dto_1 = require("../milestone-payment/dto/agent-action.dto");
const mark_as_read_dto_1 = require("../milestone-payment/dto/mark-as-read.dto");
const filter_milestone_payment_dto_1 = require("../milestone-payment/dto/filter-milestone-payment.dto");
const agent_service_1 = require("./agent.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const auth_guard_1 = require("../auth/guards/auth.guard");
let AgentMilestonePaymentController = class AgentMilestonePaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getPendingPayments(agentId, filterDto) {
        return this.service.getPendingPayments(agentId, filterDto);
    }
    async getUnreadCount(agentId) {
        return this.service.getUnreadCount(agentId);
    }
    async uploadDocument(dto) {
        return this.service.uploadDocument(dto);
    }
    async reviewPayment(dto) {
        return this.service.reviewPayment(dto);
    }
    async markAsRead(dto) {
        return this.service.markAsRead(dto);
    }
    async getPerformance(agentId) {
        const data = await this.service.getAgentPerformance(agentId);
        return {
            success: true,
            message: 'Agent performance stats fetched successfully',
            data,
        };
    }
    async findByAgent(agentId) {
        return this.service.findByAgent(agentId);
    }
    async getAgentDashboardStats(agentId) {
        return this.service.getAgentDashboardStats(agentId);
    }
    async getPaymentDetails(id, agentId) {
        return this.service.getPaymentDetails(id, agentId);
    }
};
exports.AgentMilestonePaymentController = AgentMilestonePaymentController;
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_milestone_payment_dto_1.FilterMilestonePaymentDto]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Query)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_action_dto_1.AgentUploadDto]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)('review'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_action_dto_1.AgentReviewDto]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "reviewPayment", null);
__decorate([
    (0, common_1.Post)('mark-read'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkAsReadDto]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)(':agentId/performance'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('agentId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "getPerformance", null);
__decorate([
    (0, common_1.Get)('/my/:agentId'),
    __param(0, (0, common_1.Param)('agentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "findByAgent", null);
__decorate([
    (0, common_1.Get)('/agent/:agentId/dashboard-stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('agentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "getAgentDashboardStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AgentMilestonePaymentController.prototype, "getPaymentDetails", null);
exports.AgentMilestonePaymentController = AgentMilestonePaymentController = __decorate([
    (0, common_1.Controller)('agent/milestone-payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    __metadata("design:paramtypes", [agent_service_1.AgentMilestonePaymentService])
], AgentMilestonePaymentController);
//# sourceMappingURL=agent.controller.js.map