"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityException = exports.UnsupportedMediaTypeException = exports.NotAcceptableException = exports.MethodNotAllowedException = exports.TooManyRequestsException = exports.BadGatewayException = exports.GatewayTimeoutException = exports.ServiceUnavailableException = exports.TimeoutException = exports.ExternalServiceException = exports.InternalServerException = exports.RateLimitException = exports.PayloadTooLargeException = exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class BadRequestException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Bad Request', common_1.HttpStatus.BAD_REQUEST, 'BAD_REQUEST');
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Authentication required', common_1.HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Insufficient permissions', common_1.HttpStatus.FORBIDDEN, 'AUTHORIZATION_ERROR');
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Resource not found', common_1.HttpStatus.NOT_FOUND, 'NOT_FOUND');
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Resource conflict', common_1.HttpStatus.CONFLICT, 'CONFLICT_ERROR');
    }
}
exports.ConflictException = ConflictException;
class PayloadTooLargeException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Payload too large', common_1.HttpStatus.PAYLOAD_TOO_LARGE, 'PAYLOAD_TOO_LARGE');
    }
}
exports.PayloadTooLargeException = PayloadTooLargeException;
class RateLimitException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS, 'RATE_LIMIT_ERROR');
    }
}
exports.RateLimitException = RateLimitException;
class InternalServerException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');
    }
}
exports.InternalServerException = InternalServerException;
class ExternalServiceException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'External service error', common_1.HttpStatus.BAD_GATEWAY, 'EXTERNAL_SERVICE_ERROR');
    }
}
exports.ExternalServiceException = ExternalServiceException;
class TimeoutException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Request timeout', common_1.HttpStatus.REQUEST_TIMEOUT, 'TIMEOUT_ERROR');
    }
}
exports.TimeoutException = TimeoutException;
class ServiceUnavailableException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Gateway timeout', common_1.HttpStatus.GATEWAY_TIMEOUT, 'GATEWAY_TIMEOUT');
    }
}
exports.GatewayTimeoutException = GatewayTimeoutException;
class BadGatewayException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Bad gateway', common_1.HttpStatus.BAD_GATEWAY, 'BAD_GATEWAY_ERROR');
    }
}
exports.BadGatewayException = BadGatewayException;
class TooManyRequestsException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
class MethodNotAllowedException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Method not allowed', common_1.HttpStatus.METHOD_NOT_ALLOWED, 'METHOD_NOT_ALLOWED');
    }
}
exports.MethodNotAllowedException = MethodNotAllowedException;
class NotAcceptableException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Not acceptable', common_1.HttpStatus.NOT_ACCEPTABLE, 'NOT_ACCEPTABLE');
    }
}
exports.NotAcceptableException = NotAcceptableException;
class UnsupportedMediaTypeException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Unsupported media type', common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'UNSUPPORTED_MEDIA_TYPE');
    }
}
exports.UnsupportedMediaTypeException = UnsupportedMediaTypeException;
class UnprocessableEntityException extends base_exception_1.BaseException {
    constructor(options) {
        super(options || 'Unprocessable entity', common_1.HttpStatus.UNPROCESSABLE_ENTITY, 'UNPROCESSABLE_ENTITY');
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
//# sourceMappingURL=http.exceptions.js.map