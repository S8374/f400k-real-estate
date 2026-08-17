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
var RequestLoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const context_service_1 = require("../context/context.service");
let RequestLoggerMiddleware = RequestLoggerMiddleware_1 = class RequestLoggerMiddleware {
    contextService;
    logger = new common_1.Logger(RequestLoggerMiddleware_1.name);
    constructor(contextService) {
        this.contextService = contextService;
    }
    use(req, res, next) {
        const method = req.method;
        const originalUrl = req.originalUrl;
        const ip = req.ip;
        const body = req.body;
        const userAgent = req.get('user-agent') || '';
        const start = Date.now();
        const requestId = this.contextService.getRequestId() || 'unknown';
        const requestLog = {
            event: 'http_request',
            requestId,
            direction: 'incoming',
            method,
            url: originalUrl,
            ip,
            userAgent,
            body,
        };
        this.logger.log(JSON.stringify(requestLog));
        res.on('finish', () => {
            const { statusCode } = res;
            const durationMs = Date.now() - start;
            const contentLength = res.get('content-length');
            const responseLog = {
                event: 'http_response',
                requestId,
                direction: 'outgoing',
                method,
                url: originalUrl,
                statusCode,
                durationMs,
                contentLength: contentLength || '0',
            };
            this.logger.log(JSON.stringify(responseLog));
        });
        next();
    }
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = RequestLoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_service_1.ContextService])
], RequestLoggerMiddleware);
//# sourceMappingURL=request-logger.middleware.js.map