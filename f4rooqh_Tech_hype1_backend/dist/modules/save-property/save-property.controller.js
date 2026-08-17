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
exports.SavedListingController = void 0;
const common_1 = require("@nestjs/common");
const save_property_service_1 = require("./save-property.service");
const create_save_property_dto_1 = require("./dto/create-save-property.dto");
const filter_saved_dto_1 = require("./dto/filter-saved.dto");
let SavedListingController = class SavedListingController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(createDto) {
        return this.service.create(createDto);
    }
    async toggle(createDto) {
        return this.service.toggle(createDto);
    }
    async findAll(filterDto) {
        return this.service.findAll(filterDto);
    }
    async findByUser(userId, filterDto) {
        return this.service.findByUser(userId, filterDto);
    }
    async checkSaved(userId, propertyId) {
        return this.service.checkSaved(userId, propertyId);
    }
    async findOne(userId, propertyId) {
        return this.service.findOne(userId, propertyId);
    }
};
exports.SavedListingController = SavedListingController;
__decorate([
    (0, common_1.Post)('/saved'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_save_property_dto_1.CreateSavedListingDto]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/unsaved'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_save_property_dto_1.CreateSavedListingDto]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "toggle", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_saved_dto_1.FilterSavedListingDto]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_saved_dto_1.FilterSavedListingDto]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "checkSaved", null);
__decorate([
    (0, common_1.Get)(':userId/:propertyId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SavedListingController.prototype, "findOne", null);
exports.SavedListingController = SavedListingController = __decorate([
    (0, common_1.Controller)('property'),
    __metadata("design:paramtypes", [save_property_service_1.SavedListingService])
], SavedListingController);
//# sourceMappingURL=save-property.controller.js.map