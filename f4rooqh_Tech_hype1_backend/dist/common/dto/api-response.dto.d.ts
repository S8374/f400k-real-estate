import { PaginationMetaDto } from './pagination.dto';
export declare class ApiResponseDto<T> {
    readonly success: boolean;
    readonly statusCode: number;
    readonly message: string;
    readonly meta?: PaginationMetaDto;
    readonly requestId: string | null;
    readonly timestamp: string;
    readonly path: string;
    readonly data: T | null;
    constructor(success: boolean, statusCode: number, message: string, path: string, requestId: string | null, data: T | null, meta?: PaginationMetaDto);
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: PaginationMetaDto;
    constructor(data: T[], total: number, page: number, limit: number);
}
