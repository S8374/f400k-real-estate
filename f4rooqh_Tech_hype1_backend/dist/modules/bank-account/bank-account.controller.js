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
exports.BankAccountController = void 0;
const common_1 = require("@nestjs/common");
const bank_account_service_1 = require("./bank-account.service");
const create_bank_account_dto_1 = require("./dto/create-bank-account.dto");
const update_bank_account_dto_1 = require("./dto/update-bank-account.dto");
const filter_bank_account_dto_1 = require("./dto/filter-bank-account.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let BankAccountController = class BankAccountController {
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
exports.BankAccountController = BankAccountController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bank_account_dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_bank_account_dto_1.FilterBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_bank_account_dto_1.FilterBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_bank_account_dto_1.FilterBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bank_account_dto_1.UpdateBankAccountDto]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountController.prototype, "remove", null);
exports.BankAccountController = BankAccountController = __decorate([
    (0, common_1.Controller)('bank-accounts'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    __metadata("design:paramtypes", [bank_account_service_1.BankAccountService])
], BankAccountController);
//# sourceMappingURL=bank-account.controller.js.map