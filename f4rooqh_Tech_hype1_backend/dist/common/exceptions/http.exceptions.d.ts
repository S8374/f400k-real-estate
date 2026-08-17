import { BaseException, ExceptionOptions } from './base.exception';
type ExceptionArgs = ExceptionOptions | string;
export declare class BadRequestException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class UnauthorizedException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class ForbiddenException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class NotFoundException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class ConflictException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class PayloadTooLargeException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class RateLimitException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class InternalServerException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class ExternalServiceException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class TimeoutException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class ServiceUnavailableException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class GatewayTimeoutException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class BadGatewayException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class TooManyRequestsException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class MethodNotAllowedException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class NotAcceptableException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class UnsupportedMediaTypeException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export declare class UnprocessableEntityException extends BaseException {
    constructor(options?: ExceptionArgs);
}
export {};
