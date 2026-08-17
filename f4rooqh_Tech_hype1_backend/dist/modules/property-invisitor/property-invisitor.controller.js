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
exports.PropertyInvisitorController = void 0;
const common_1 = require("@nestjs/common");
const property_invisitor_service_1 = require("./property-invisitor.service");
const create_property_invisitor_dto_1 = require("./dto/create-property-invisitor.dto");
const update_property_invisitor_dto_1 = require("./dto/update-property-invisitor.dto");
const filter_property_invisitor_dto_1 = require("./dto/filter-property-invisitor.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PropertyInvisitorController = class PropertyInvisitorController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(createDto) {
        return this.service.create(createDto);
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
    async update(id, updateDto) {
        return this.service.update(id, updateDto);
    }
    async remove(id) {
        return this.service.remove(id);
    }
};
exports.PropertyInvisitorController = PropertyInvisitorController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_invisitor_dto_1.CreatePropertyInvisitorDto]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_property_invisitor_dto_1.FilterPropertyInvisitorDto]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_property_invisitor_dto_1.FilterPropertyInvisitorDto]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_property_invisitor_dto_1.FilterPropertyInvisitorDto]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_invisitor_dto_1.UpdatePropertyInvisitorDto]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyInvisitorController.prototype, "remove", null);
exports.PropertyInvisitorController = PropertyInvisitorController = __decorate([
    (0, common_1.Controller)('property-invisitors'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __metadata("design:paramtypes", [property_invisitor_service_1.PropertyInvisitorService])
], PropertyInvisitorController);
//# sourceMappingURL=property-invisitor.controller.js.map