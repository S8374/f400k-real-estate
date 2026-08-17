"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationMetaDto = void 0;
class PaginationMetaDto {
    page;
    limit;
    total;
    totalPages;
    hasNext;
    hasPrevious;
    constructor(total, page, limit) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.hasNext = this.page < this.totalPages;
        this.hasPrevious = this.page > 1;
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
//# sourceMappingURL=pagination.dto.js.map