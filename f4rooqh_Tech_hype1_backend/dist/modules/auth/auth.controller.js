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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_auth_dto_1 = require("./dto/login-auth.dto");
const register_auth_dto_1 = require("./dto/register-auth.dto");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const resend_otp_dto_1 = require("./dto/resend-otp.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const forget_password_dto_1 = require("./dto/forget-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_guard_1 = require("./guards/auth.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const UpdateUserProfileDto_1 = require("./dto/UpdateUserProfileDto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async verifyOtp(verifyOtpDto, res) {
        return this.authService.verifyOtp(verifyOtpDto, res);
    }
    async resendOtp(resendOtpDto) {
        return this.authService.resendOtp(resendOtpDto);
    }
    async login(loginDto, res) {
        return this.authService.login(loginDto, res);
    }
    async adminLogin(loginDto, res) {
        return this.authService.adminLogin(loginDto, res);
    }
    logout(res) {
        return this.authService.logout(res);
    }
    async changePassword(changePasswordDto) {
        return this.authService.changePassword(changePasswordDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async verifyResetOtp(verifyOtpDto, res) {
        return this.authService.verifyResetOtp(verifyOtpDto, res);
    }
    async resetPassword(resetPasswordDto, req, res) {
        return this.authService.resetPassword(resetPasswordDto, req, res);
    }
    async getCurrentUser(user) {
        console.log('AuthController - getCurrentUser - user:', user);
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (!user.userId) {
            console.log('AuthController - userId missing from user:', user);
            throw new common_1.UnauthorizedException('Invalid user payload');
        }
        return this.authService.getCurrentUser(user.userId);
    }
    updateProfile(user, dto) {
        return this.authService.updateProfile(user.userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, response_message_decorator_1.ResponseMessage)('OTP sent to your email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Account verified successfully'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('OTP resent successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Login successful'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LogInAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('admin-login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Admin login successful'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LogInAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Logout successful'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Password changed successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Reset OTP sent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-reset-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('OTP verified'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)('Password reset successfully'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserProfileDto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map