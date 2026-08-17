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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const admin_user_service_1 = require("./admin-user.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminUserController = class AdminUserController {
    adminUserService;
    constructor(adminUserService) {
        this.adminUserService = adminUserService;
    }
    async getAllUsers(adminId, page, limit, search, role, status) {
        return this.adminUserService.getAllUsers(adminId, {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            search,
            role,
            status,
        });
    }
    async getUserDetails(userId) {
        return this.adminUserService.getUserDetails(userId);
    }
    async updateStatus(userId, status) {
        return this.adminUserService.updateUserStatus(userId, status);
    }
    async deleteUser(userId) {
        return this.adminUserService.deleteUser(userId);
    }
};
exports.AdminUserController = AdminUserController;
__decorate([
    (0, common_1.Get)(':adminId'),
    __param(0, (0, common_1.Param)('adminId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('role')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('details/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Patch)(':userId/status'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "deleteUser", null);
exports.AdminUserController = AdminUserController = __decorate([
    (0, common_1.Controller)('admin/users'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_user_service_1.AdminUserService])
], AdminUserController);
//# sourceMappingURL=admin-user.controller.js.map