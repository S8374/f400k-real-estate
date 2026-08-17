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
exports.ResponseStandardizationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const api_response_dto_1 = require("../dto/api-response.dto");
const context_service_1 = require("../context/context.service");
const core_1 = require("@nestjs/core");
const response_message_decorator_1 = require("../decorators/response-message.decorator");
let ResponseStandardizationInterceptor = class ResponseStandardizationInterceptor {
    contextService;
    reflector;
    constructor(contextService, reflector) {
        this.contextService = contextService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const path = request.url;
        const handler = context.getHandler();
        const requestId = this.contextService.getRequestId() || null;
        const customMessage = this.reflector.get(response_message_decorator_1.RESPONSE_MESSAGE_KEY, handler);
        return next.handle().pipe((0, operators_1.map)((data) => {
            const statusCode = response.statusCode;
            if (data instanceof api_response_dto_1.PaginatedResponseDto) {
                return new api_response_dto_1.ApiResponseDto(true, statusCode, customMessage || 'Data fetched successfully (paginated)', path, requestId, data.data, data.meta);
            }
            return new api_response_dto_1.ApiResponseDto(true, statusCode, customMessage || 'Operation successful', path, requestId, data);
        }));
    }
};
exports.ResponseStandardizationInterceptor = ResponseStandardizationInterceptor;
exports.ResponseStandardizationInterceptor = ResponseStandardizationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_service_1.ContextService,
        core_1.Reflector])
], ResponseStandardizationInterceptor);
//# sourceMappingURL=response-standardization.interceptor.js.map