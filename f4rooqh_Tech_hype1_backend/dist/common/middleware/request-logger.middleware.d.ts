import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextService } from '../context/context.service';
export declare class RequestLoggerMiddleware implements NestMiddleware {
    private readonly contextService;
    private readonly logger;
    constructor(contextService: ContextService);
    use(req: Request, res: Response, next: NextFunction): void;
}
