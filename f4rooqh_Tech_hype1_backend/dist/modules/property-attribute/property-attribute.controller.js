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
exports.PropertyAttributeController = void 0;
const common_1 = require("@nestjs/common");
const property_attribute_service_1 = require("./property-attribute.service");
const create_property_attribute_dto_1 = require("./dto/create-property-attribute.dto");
const update_property_attribute_dto_1 = require("./dto/update-property-attribute.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PropertyAttributeController = class PropertyAttributeController {
    propertyAttributeService;
    constructor(propertyAttributeService) {
        this.propertyAttributeService = propertyAttributeService;
    }
    create(createPropertyAttributeDto) {
        return this.propertyAttributeService.create(createPropertyAttributeDto);
    }
    findAll(propertyId) {
        if (propertyId) {
            return this.propertyAttributeService.findByProperty(propertyId);
        }
        return this.propertyAttributeService.findAll();
    }
    findOne(id) {
        return this.propertyAttributeService.findOne(id);
    }
    findByProperty(propertyId) {
        return this.propertyAttributeService.findByProperty(propertyId);
    }
    update(id, updatePropertyAttributeDto) {
        return this.propertyAttributeService.update(id, updatePropertyAttributeDto);
    }
    remove(id) {
        return this.propertyAttributeService.remove(id);
    }
};
exports.PropertyAttributeController = PropertyAttributeController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_attribute_dto_1.CreatePropertyAttributeDto]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_attribute_dto_1.UpdatePropertyAttributeDto]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyAttributeController.prototype, "remove", null);
exports.PropertyAttributeController = PropertyAttributeController = __decorate([
    (0, common_1.Controller)('property-attributes'),
    __metadata("design:paramtypes", [property_attribute_service_1.PropertyAttributeService])
], PropertyAttributeController);
//# sourceMappingURL=property-attribute.controller.js.map