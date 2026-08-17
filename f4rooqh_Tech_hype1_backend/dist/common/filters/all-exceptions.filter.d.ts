import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ContextService } from '../context/context.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly contextService;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost, contextService: ContextService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private buildValidationErrors;
}
