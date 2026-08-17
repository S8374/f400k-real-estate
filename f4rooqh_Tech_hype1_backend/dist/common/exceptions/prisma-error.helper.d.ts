import { HttpStatus } from '@nestjs/common';
interface PrismaError {
    status: HttpStatus;
    message: string;
}
export declare const PRISMA_ERROR_MAP: Record<string, PrismaError>;
export declare function getPrismaError(code: string): PrismaError | undefined;
export {};
