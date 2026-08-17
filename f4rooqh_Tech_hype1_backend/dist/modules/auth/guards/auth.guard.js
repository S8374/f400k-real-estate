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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwtHelper_1 = require("../../../helper/jwt/jwtHelper");
const config_1 = require("@nestjs/config");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let AuthGuard = class AuthGuard {
    configService;
    reflector;
    constructor(configService, reflector) {
        this.configService = configService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        console.log('AuthGuard - canActivate started');
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('AuthGuard - isPublic:', isPublic);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request) || this.extractTokenFromHeader(request);
        if (!token)
            throw new common_1.UnauthorizedException('Authentication token not found');
        try {
            const secret = this.configService.get('JWT_SECRET') || 'your-default-secret';
            const payload = (0, jwtHelper_1.verifyToken)(token, secret);
            request.user = payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired authentication token');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
    extractTokenFromCookie(request) {
        const origin = request.headers.origin || request.headers.referer || '';
        if (origin.includes('3002') || origin.includes('3001') || origin.includes('admin')) {
            return request.cookies?.['adminAccessToken'] || request.cookies?.['accessToken'];
        }
        return request.cookies?.['accessToken'];
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map