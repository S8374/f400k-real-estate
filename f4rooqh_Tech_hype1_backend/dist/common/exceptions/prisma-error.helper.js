"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRISMA_ERROR_MAP = void 0;
exports.getPrismaError = getPrismaError;
const common_1 = require("@nestjs/common");
exports.PRISMA_ERROR_MAP = {
    P2000: {
        status: common_1.HttpStatus.BAD_REQUEST,
        message: 'The provided value for the column is too long.',
    },
    P2002: {
        status: common_1.HttpStatus.CONFLICT,
        message: 'A record with this value already exists (unique constraint failed).',
    },
    P2003: {
        status: common_1.HttpStatus.CONFLICT,
        message: 'Foreign key constraint failed.',
    },
    P2014: {
        status: common_1.HttpStatus.NOT_FOUND,
        message: 'The related record could not be found.',
    },
    P2018: {
        status: common_1.HttpStatus.NOT_FOUND,
        message: 'The required connected records were not found.',
    },
    P2025: {
        status: common_1.HttpStatus.NOT_FOUND,
        message: 'The record you tried to operate on could not be found.',
    },
    P2001: {
        status: common_1.HttpStatus.NOT_FOUND,
        message: 'The record searched for in the where condition does not exist.',
    },
};
function getPrismaError(code) {
    return exports.PRISMA_ERROR_MAP[code];
}
//# sourceMappingURL=prisma-error.helper.js.map