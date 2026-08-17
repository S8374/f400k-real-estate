"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = exports.ApiResponseDto = void 0;
const pagination_dto_1 = require("./pagination.dto");
class ApiResponseDto {
    success;
    statusCode;
    message;
    meta;
    requestId;
    timestamp;
    path;
    data;
    constructor(success, statusCode, message, path, requestId, data, meta) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.meta = meta;
        this.requestId = requestId;
        this.timestamp = new Date().toISOString();
        this.path = path;
        this.data = data;
    }
}
exports.ApiResponseDto = ApiResponseDto;
class PaginatedResponseDto {
    data;
    meta;
    constructor(data, total, page, limit) {
        this.data = data;
        this.meta = new pagination_dto_1.PaginationMetaDto(total, page, limit);
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=api-response.dto.js.map