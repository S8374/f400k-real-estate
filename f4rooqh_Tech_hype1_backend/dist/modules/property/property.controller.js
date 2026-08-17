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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const search_property_dto_1 = require("./dto/search-property.dto");
const client_1 = require("@prisma/client");
let PropertyController = class PropertyController {
    propertyService;
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    create(createPropertyDto) {
        return this.propertyService.create(createPropertyDto);
    }
    async findAll(searchDto) {
        return this.propertyService.findAll(searchDto);
    }
    async getAllPropertyTypes() {
        return this.propertyService.getAllPropertyTypes();
    }
    async getAdminStats(adminId) {
        return this.propertyService.getAdminStats(adminId);
    }
    findOne(id) {
        return this.propertyService.findOne(id);
    }
    update(id, updatePropertyDto) {
        return this.propertyService.update(id, updatePropertyDto);
    }
    remove(id) {
        return this.propertyService.remove(id);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_property_dto_1.SearchPropertyDto]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/categories'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getAllPropertyTypes", null);
__decorate([
    (0, common_1.Get)('/admin/stats/:adminId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "remove", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('property'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map