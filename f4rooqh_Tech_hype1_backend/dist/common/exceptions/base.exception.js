"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
class BaseException extends common_1.HttpException {
    code;
    errors;
    instruction;
    details;
    constructor(optionsOrMessage, status, defaultCode = 'INTERNAL_ERROR') {
        const options = typeof optionsOrMessage === 'string'
            ? { message: optionsOrMessage }
            : optionsOrMessage || {};
        const { message = 'An error occurred', code = defaultCode, errors, instruction, details, } = options;
        const responseBody = {
            message,
            code,
            errors: errors || (message ? [{ code, message }] : []),
            instruction,
            details,
        };
        super(responseBody, status);
        this.code = code;
        this.errors = responseBody.errors;
        this.instruction = instruction;
        this.details = details;
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map