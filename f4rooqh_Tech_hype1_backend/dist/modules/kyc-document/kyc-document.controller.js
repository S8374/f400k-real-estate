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
exports.KycDocumentController = void 0;
const common_1 = require("@nestjs/common");
const kyc_document_service_1 = require("./kyc-document.service");
const create_kyc_document_dto_1 = require("./dto/create-kyc-document.dto");
const update_kyc_document_dto_1 = require("./dto/update-kyc-document.dto");
const filter_kyc_document_dto_1 = require("./dto/filter-kyc-document.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let KycDocumentController = class KycDocumentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(createDto) {
        return this.service.upload(createDto);
    }
    async verify(verifyDto) {
        return this.service.verify(verifyDto);
    }
    async findAll(filterDto) {
        return this.service.findAll(filterDto);
    }
    async findByUser(userId, filterDto) {
        return this.service.findByUser(userId, filterDto);
    }
    async getUserStats(userId) {
        return this.service.getUserStats(userId);
    }
    async getUserKycStatus(userId) {
        return this.service.getUserKycStatus(userId);
    }
    async update(id, updateDto) {
        return this.service.update(id, updateDto);
    }
    async remove(id) {
        return this.service.remove(id);
    }
};
exports.KycDocumentController = KycDocumentController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kyc_document_dto_1.CreateKycDocumentDto]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kyc_document_dto_1.AdminVerifyKycDto]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_kyc_document_dto_1.FilterKycDocumentDto]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_kyc_document_dto_1.FilterKycDocumentDto]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('user/:userId/stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('user/:userId/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "getUserKycStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kyc_document_dto_1.UpdateKycDocumentDto]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.BUYER, client_1.Role.AGENT, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycDocumentController.prototype, "remove", null);
exports.KycDocumentController = KycDocumentController = __decorate([
    (0, common_1.Controller)('kyc-documents'),
    __metadata("design:paramtypes", [kyc_document_service_1.KycDocumentService])
], KycDocumentController);
//# sourceMappingURL=kyc-document.controller.js.map