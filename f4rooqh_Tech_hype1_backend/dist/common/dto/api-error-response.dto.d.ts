export declare class ErrorDetail {
    code: string;
    message: string;
    field?: string;
}
export declare class ApiErrorResponseDto {
    readonly success: boolean;
    readonly statusCode: number;
    readonly message: string;
    readonly requestId: string | null;
    readonly timestamp: string;
    readonly path: string;
    readonly errors: ErrorDetail[];
    readonly instruction?: string;
    readonly details?: unknown;
    readonly stack?: string;
    constructor(statusCode: number, message: string, errors: ErrorDetail[], path: string, requestId: string | null, instruction?: string, details?: unknown, stack?: string);
}
