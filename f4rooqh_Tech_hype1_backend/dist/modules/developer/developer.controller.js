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
exports.DeveloperController = void 0;
const common_1 = require("@nestjs/common");
const developer_service_1 = require("./developer.service");
const create_developer_dto_1 = require("./dto/create-developer.dto");
const update_developer_dto_1 = require("./dto/update-developer.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DeveloperController = class DeveloperController {
    developerService;
    constructor(developerService) {
        this.developerService = developerService;
    }
    create(createDeveloperDto) {
        return this.developerService.create(createDeveloperDto);
    }
    findAll(includeProjects) {
        return this.developerService.findAll(includeProjects === 'true');
    }
    findOne(id, includeProjects) {
        return this.developerService.findOne(id, includeProjects === 'true');
    }
    update(id, updateDeveloperDto) {
        return this.developerService.update(id, updateDeveloperDto);
    }
    remove(id) {
        return this.developerService.remove(id);
    }
    searchByName(name) {
        return this.developerService.searchByName(name);
    }
};
exports.DeveloperController = DeveloperController;
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_developer_dto_1.CreateDeveloperDto]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/get'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('includeProjects')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeProjects')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_developer_dto_1.UpdateDeveloperDto]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search/:name'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeveloperController.prototype, "searchByName", null);
exports.DeveloperController = DeveloperController = __decorate([
    (0, common_1.Controller)('developers'),
    __metadata("design:paramtypes", [developer_service_1.DeveloperService])
], DeveloperController);
//# sourceMappingURL=developer.controller.js.map