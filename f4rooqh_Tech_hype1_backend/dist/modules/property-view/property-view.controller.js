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
exports.PropertyViewController = void 0;
const common_1 = require("@nestjs/common");
const property_view_service_1 = require("./property-view.service");
const create_property_view_dto_1 = require("./dto/create-property-view.dto");
const filter_property_view_dto_1 = require("./dto/filter-property-view.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let PropertyViewController = class PropertyViewController {
    service;
    constructor(service) {
        this.service = service;
    }
    async track(createDto) {
        return this.service.track(createDto);
    }
    async findAll(filterDto) {
        return this.service.findAll(filterDto);
    }
    async findByProperty(propertyId, filterDto) {
        return this.service.findByProperty(propertyId, filterDto);
    }
    async findByUser(userId, filterDto) {
        return this.service.findByUser(userId, filterDto);
    }
    async getPropertyStats(propertyId) {
        return this.service.getPropertyStats(propertyId);
    }
    async getTrendingProperties(days = 7, limit = 10) {
        return this.service.getTrendingProperties(days, limit);
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
};
exports.PropertyViewController = PropertyViewController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_view_dto_1.CreatePropertyViewDto]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "track", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_property_view_dto_1.FilterPropertyViewDto]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_property_view_dto_1.FilterPropertyViewDto]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_property_view_dto_1.FilterPropertyViewDto]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('property/:propertyId/stats'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "getPropertyStats", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "getTrendingProperties", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyViewController.prototype, "findOne", null);
exports.PropertyViewController = PropertyViewController = __decorate([
    (0, common_1.Controller)('property-views'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [property_view_service_1.PropertyViewService])
], PropertyViewController);
//# sourceMappingURL=property-view.controller.js.map