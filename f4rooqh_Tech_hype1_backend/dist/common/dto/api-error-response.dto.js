"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorResponseDto = exports.ErrorDetail = void 0;
class ErrorDetail {
    code;
    message;
    field;
}
exports.ErrorDetail = ErrorDetail;
class ApiErrorResponseDto {
    success = false;
    statusCode;
    message;
    requestId;
    timestamp;
    path;
    errors;
    instruction;
    details;
    stack;
    constructor(statusCode, message, errors, path, requestId, instruction, details, stack) {
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.path = path;
        this.requestId = requestId;
        this.timestamp = new Date().toISOString();
        this.instruction = instruction;
        this.details = details;
        this.stack = stack;
    }
}
exports.ApiErrorResponseDto = ApiErrorResponseDto;
//# sourceMappingURL=api-error-response.dto.js.map