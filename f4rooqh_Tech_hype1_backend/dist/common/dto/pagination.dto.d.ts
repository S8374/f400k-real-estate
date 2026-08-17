export declare class PaginationMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;
    constructor(total: number, page: number, limit: number);
}
