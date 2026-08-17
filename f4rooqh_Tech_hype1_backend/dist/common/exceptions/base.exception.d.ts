import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDetail } from '../dto/api-error-response.dto';
export interface ExceptionOptions {
    message?: string;
    code?: string;
    errors?: ErrorDetail[];
    instruction?: string;
    details?: unknown;
}
export declare class BaseException extends HttpException {
    readonly code: string;
    readonly errors: ErrorDetail[];
    readonly instruction?: string;
    readonly details?: unknown;
    constructor(optionsOrMessage: ExceptionOptions | string, status: HttpStatus, defaultCode?: string);
}
