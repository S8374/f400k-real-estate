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
exports.MilestoneController = void 0;
const common_1 = require("@nestjs/common");
const milestone_service_1 = require("./milestone.service");
const create_milestone_dto_1 = require("./dto/create-milestone.dto");
const update_milestone_dto_1 = require("./dto/update-milestone.dto");
const filter_milestone_dto_1 = require("./dto/filter-milestone.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let MilestoneController = class MilestoneController {
    milestoneService;
    constructor(milestoneService) {
        this.milestoneService = milestoneService;
    }
    create(createMilestoneDto) {
        return this.milestoneService.create(createMilestoneDto);
    }
    reorder(planId, items) {
        return this.milestoneService.reorder(planId, items);
    }
    findAll(filterDto) {
        return this.milestoneService.findAll(filterDto);
    }
    findByPlan(planId, filterDto) {
        return this.milestoneService.findByPlan(planId, filterDto);
    }
    findUpcoming(days) {
        return this.milestoneService.findUpcoming(days ? +days : 30);
    }
    getPlanSummary(planId) {
        return this.milestoneService.getPlanSummary(planId);
    }
    findOne(id) {
        return this.milestoneService.findOne(id);
    }
    update(id, updateMilestoneDto) {
        return this.milestoneService.update(id, updateMilestoneDto);
    }
    remove(id) {
        return this.milestoneService.remove(id);
    }
    removeAllByPlan(planId) {
        return this.milestoneService.removeAllByPlan(planId);
    }
};
exports.MilestoneController = MilestoneController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_milestone_dto_1.CreateMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('plan/:planId/reorder'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('planId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "reorder", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_milestone_dto_1.FilterMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('plan/:planId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('planId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_milestone_dto_1.FilterMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "findByPlan", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)('plan/:planId/summary'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('planId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "getPlanSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_milestone_dto_1.UpdateMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('plan/:planId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('planId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestoneController.prototype, "removeAllByPlan", null);
exports.MilestoneController = MilestoneController = __decorate([
    (0, common_1.Controller)('milestones'),
    __metadata("design:paramtypes", [milestone_service_1.MilestoneService])
], MilestoneController);
//# sourceMappingURL=milestone.controller.js.map