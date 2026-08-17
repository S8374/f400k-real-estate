import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dto/api-response.dto';
import { ContextService } from '../context/context.service';
import { Reflector } from '@nestjs/core';
export declare class ResponseStandardizationInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T | T[]>> {
    private readonly contextService;
    private readonly reflector;
    constructor(contextService: ContextService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T | T[]>>;
}
