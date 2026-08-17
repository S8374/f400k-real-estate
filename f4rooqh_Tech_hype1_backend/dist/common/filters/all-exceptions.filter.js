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
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const context_service_1 = require("../context/context.service");
const api_error_response_dto_1 = require("../dto/api-error-response.dto");
const prisma_error_helper_1 = require("../exceptions/prisma-error.helper");
const base_exception_1 = require("../exceptions/base.exception");
function isPrismaError(exception) {
    return (typeof exception === 'object' &&
        exception !== null &&
        exception.constructor?.name ===
            'PrismaClientKnownRequestError' &&
        typeof exception.code === 'string');
}
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    httpAdapterHost;
    contextService;
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    constructor(httpAdapterHost, contextService) {
        this.httpAdapterHost = httpAdapterHost;
        this.contextService = contextService;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const path = request.url;
        const requestId = this.contextService.getRequestId() || null;
        const stack = exception?.stack;
        let httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let errors = [];
        let instruction = undefined;
        let details = undefined;
        if (exception instanceof base_exception_1.BaseException) {
            httpStatus = exception.getStatus();
            const response = exception.getResponse();
            message = response.message;
            errors =
                response.errors ||
                    (response.message
                        ? [
                            {
                                code: response.code || exception.name,
                                message: response.message,
                            },
                        ]
                        : []);
            instruction = response.instruction;
            details = response.details;
        }
        else if (exception instanceof common_1.HttpException) {
            httpStatus = exception.getStatus();
            const response = exception.getResponse();
            const isClassValidatorResponse = (res) => typeof res === 'object' &&
                res !== null &&
                'message' in res &&
                Array.isArray(res.message);
            const isGenericErrorResponse = (res) => typeof res === 'object' && res !== null;
            if (exception instanceof common_1.BadRequestException &&
                isClassValidatorResponse(response)) {
                message = 'Validation Failed';
                errors = this.buildValidationErrors(response.message);
            }
            else if (typeof response === 'string') {
                message = response;
                errors = [{ code: exception.name, message: response }];
            }
            else if (isGenericErrorResponse(response)) {
                const responseMessage = response.message;
                if (Array.isArray(responseMessage)) {
                    message = responseMessage.join(', ');
                }
                else if (typeof responseMessage === 'string') {
                    message = responseMessage;
                }
                else {
                    message = exception.name;
                }
                const responseCode = typeof response.code === 'string' ? response.code : exception.name;
                const errorMessage = Array.isArray(responseMessage)
                    ? responseMessage.join(', ')
                    : typeof responseMessage === 'string'
                        ? responseMessage
                        : 'An unexpected error occurred';
                errors = [
                    {
                        code: responseCode,
                        message: errorMessage,
                    },
                ];
            }
        }
        else if (isPrismaError(exception)) {
            const prismaError = (0, prisma_error_helper_1.getPrismaError)(exception.code);
            if (prismaError) {
                httpStatus = prismaError.status;
                message = prismaError.message;
                errors = [
                    {
                        code: `DB_${exception.code}`,
                        message: prismaError.message,
                        field: exception.meta?.target?.join('.'),
                    },
                ];
            }
            else {
                httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'An unhandled database error occurred.';
                errors = [
                    { code: `DB_UNKNOWN_${exception.code}`, message: exception.message },
                ];
            }
            this.logger.error(`Prisma Error: ${exception.code} | Message: ${exception.message}`, exception.stack, `RequestID: ${requestId}`);
        }
        else if (exception instanceof Error) {
            message = exception.message;
            errors = [
                { code: exception.name || 'Error', message: exception.message },
            ];
            this.logger.error(`Generic Error: ${message}`, exception.stack, `RequestID: ${requestId}`);
        }
        else {
            message = 'An unknown error occurred.';
            errors = [
                { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' },
            ];
            this.logger.error('Unknown exception caught', exception, `RequestID: ${requestId}`);
        }
        if (httpStatus !== common_1.HttpStatus.NOT_FOUND) {
            this.logger.error(`[${requestId}] ${httpStatus} ${message} - ${path}`, stack ?? JSON.stringify(exception));
        }
        const responseBody = new api_error_response_dto_1.ApiErrorResponseDto(httpStatus, message, errors, path, requestId, instruction, details, process.env.NODE_ENV !== 'production' ? stack : undefined);
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
    buildValidationErrors(validationErrors) {
        const errors = [];
        const traverseErrors = (err, parentField) => {
            const field = parentField
                ? `${parentField}.${err.property}`
                : err.property;
            if (err.constraints) {
                for (const key of Object.keys(err.constraints)) {
                    errors.push({
                        code: 'VALIDATION_ERROR',
                        message: err.constraints[key],
                        field: field,
                    });
                }
            }
            if (err.children && err.children.length > 0) {
                for (const child of err.children) {
                    traverseErrors(child, field);
                }
            }
        };
        for (const error of validationErrors) {
            traverseErrors(error);
        }
        return errors;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost,
        context_service_1.ContextService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map