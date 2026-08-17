import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare class AuthGuard implements CanActivate {
    private configService;
    private reflector;
    constructor(configService: ConfigService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
    private extractTokenFromCookie;
}
