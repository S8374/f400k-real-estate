import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '../../../helper/jwt/jwtHelper';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector, // ✅ add this
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard - canActivate started');

    // Check if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('AuthGuard - isPublic:', isPublic);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request) || this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Authentication token not found');

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'your-default-secret';
      const payload = verifyToken(token, secret);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: any): string | undefined {
    const origin = request.headers.origin || request.headers.referer || '';
    if (origin.includes('3002') || origin.includes('3001') || origin.includes('admin')) {
      return request.cookies?.['adminAccessToken'] || request.cookies?.['accessToken'];
    }
    return request.cookies?.['accessToken'];
  }
}