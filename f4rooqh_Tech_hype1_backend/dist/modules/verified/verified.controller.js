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
exports.VerifiedController = void 0;
const common_1 = require("@nestjs/common");
const verified_service_1 = require("./verified.service");
const create_verified_dto_1 = require("./dto/create-verified.dto");
const update_verified_dto_1 = require("./dto/update-verified.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_guard_1 = require("../auth/guards/auth.guard");
const client_1 = require("@prisma/client");
let VerifiedController = class VerifiedController {
    verifiedService;
    constructor(verifiedService) {
        this.verifiedService = verifiedService;
    }
    async getPendingAgents() {
        return this.verifiedService.getPendingAgents();
    }
    async getVerifiedAgents() {
        return this.verifiedService.getVerifiedAgents();
    }
    async getAgentVerificationStatus(agentId) {
        return this.verifiedService.getAgentVerificationStatus(agentId);
    }
    async verifyAgent(verifyAgentDto) {
        return this.verifiedService.verifyAgent(verifyAgentDto);
    }
    async getPendingProperties() {
        return this.verifiedService.getPendingProperties();
    }
    async getVerifiedProperties() {
        return this.verifiedService.getVerifiedProperties();
    }
    async getPropertyVerificationStatus(propertyId) {
        return this.verifiedService.getPropertyVerificationStatus(propertyId);
    }
    async verifyProperty(verifyPropertyDto) {
        return this.verifiedService.verifyProperty(verifyPropertyDto);
    }
    async getAllVerificationStatus(filterDto) {
        return this.verifiedService.getAllVerificationStatus(filterDto);
    }
    async getVerificationStats() {
        return this.verifiedService.getVerificationStats();
    }
    async getAgentPropertiesVerification(agentId) {
        return this.verifiedService.getAgentPropertiesVerification(agentId);
    }
    findOne(id) {
        return this.verifiedService.findOne(id);
    }
    update(id, updateVerifiedDto) {
        return this.verifiedService.update(id, updateVerifiedDto);
    }
};
exports.VerifiedController = VerifiedController;
__decorate([
    (0, common_1.Get)('agents/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getPendingAgents", null);
__decorate([
    (0, common_1.Get)('agents/verified'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getVerifiedAgents", null);
__decorate([
    (0, common_1.Get)('agents/:agentId'),
    __param(0, (0, common_1.Param)('agentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getAgentVerificationStatus", null);
__decorate([
    (0, common_1.Post)('agents/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_verified_dto_1.VerifyAgentDto]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "verifyAgent", null);
__decorate([
    (0, common_1.Get)('properties/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getPendingProperties", null);
__decorate([
    (0, common_1.Get)('properties/verified'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getVerifiedProperties", null);
__decorate([
    (0, common_1.Get)('properties/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getPropertyVerificationStatus", null);
__decorate([
    (0, common_1.Post)('properties/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_verified_dto_1.VerifyPropertyDto]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "verifyProperty", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_verified_dto_1.VerificationFilterDto]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getAllVerificationStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getVerificationStats", null);
__decorate([
    (0, common_1.Get)('agent/:agentId/properties'),
    __param(0, (0, common_1.Param)('agentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerifiedController.prototype, "getAgentPropertiesVerification", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VerifiedController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_verified_dto_1.UpdateVerifiedDto]),
    __metadata("design:returntype", void 0)
], VerifiedController.prototype, "update", null);
exports.VerifiedController = VerifiedController = __decorate([
    (0, common_1.Controller)('verified'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [verified_service_1.VerifiedService])
], VerifiedController);
//# sourceMappingURL=verified.controller.js.map