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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const media_service_1 = require("./media.service");
const create_media_dto_1 = require("./dto/create-media.dto");
const update_media_dto_1 = require("./dto/update-media.dto");
const filter_media_dto_1 = require("./dto/filter-media.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    create(createMediaDto) {
        return this.mediaService.create(createMediaDto);
    }
    findAll(filterDto) {
        return this.mediaService.findAll(filterDto);
    }
    findByProperty(propertyId) {
        return this.mediaService.findByProperty(propertyId);
    }
    findByUnit(unitId) {
        return this.mediaService.findByUnit(unitId);
    }
    findPrimary(entityType, entityId) {
        return this.mediaService.findPrimary(entityType, entityId);
    }
    getMediaTypes() {
        return this.mediaService.getMediaTypes();
    }
    findOne(id) {
        return this.mediaService.findOne(id);
    }
    update(id, updateMediaDto) {
        return this.mediaService.update(id, updateMediaDto);
    }
    remove(id) {
        return this.mediaService.remove(id);
    }
    removeAllByProperty(propertyId) {
        return this.mediaService.removeAllByProperty(propertyId);
    }
    removeAllByUnit(unitId) {
        return this.mediaService.removeAllByUnit(unitId);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_dto_1.CreateMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_media_dto_1.FilterMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('unit/:unitId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('unitId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findByUnit", null);
__decorate([
    (0, common_1.Get)('primary/:entityType/:entityId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findPrimary", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "getMediaTypes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_media_dto_1.UpdateMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('property/:propertyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "removeAllByProperty", null);
__decorate([
    (0, common_1.Delete)('unit/:unitId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('unitId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "removeAllByUnit", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map