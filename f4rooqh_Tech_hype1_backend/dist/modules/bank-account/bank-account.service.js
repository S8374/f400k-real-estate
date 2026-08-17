"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let BankAccountService = class BankAccountService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { propertyId, userId, ...accountData } = createDto;
        await this.validateProperty(propertyId);
        await this.validateUser(userId);
        const existing = await this.prisma.bankAccountDetails.findUnique({
            where: { propertyId },
        });
        if (existing) {
            throw new common_1.ConflictException('This property already has a bank account');
        }
        const existingIban = await this.prisma.bankAccountDetails.findFirst({
            where: { iban: accountData.iban },
        });
        if (existingIban) {
            throw new common_1.ConflictException('This IBAN is already registered');
        }
        try {
            const bankAccount = await this.prisma.bankAccountDetails.create({
                data: {
                    propertyId,
                    userId,
                    ...accountData,
                },
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'Bank account created successfully',
                data: bankAccount,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Bank account already exists for this property');
                }
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException('Property or User not found');
                }
            }
            throw error;
        }
    }
    async findAll(filterDto) {
        const { propertyId, userId, bankName, page = 1, limit = 20, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (userId)
            where.userId = userId;
        if (bankName) {
            where.bankName = {
                contains: bankName,
                mode: 'insensitive',
            };
        }
        const [bankAccounts, total] = await Promise.all([
            this.prisma.bankAccountDetails.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            status: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.bankAccountDetails.count({ where }),
        ]);
        return {
            success: true,
            data: bankAccounts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const bankAccount = await this.prisma.bankAccountDetails.findUnique({
            where: { id },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        if (!bankAccount) {
            throw new common_1.NotFoundException(`Bank account with ID ${id} not found`);
        }
        const maskedAccount = {
            ...bankAccount,
            accountNumber: this.maskAccountNumber(bankAccount.accountNumber),
            iban: this.maskIban(bankAccount.iban),
        };
        return {
            success: true,
            data: maskedAccount,
        };
    }
    async findByProperty(propertyId, filterDto) {
        await this.validateProperty(propertyId);
        return this.findAll({ ...filterDto, propertyId });
    }
    async findByUser(userId, filterDto) {
        await this.validateUser(userId);
        return this.findAll({ ...filterDto, userId });
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const { propertyId, userId, ...updateData } = updateDto;
        if (propertyId) {
            await this.validateProperty(propertyId);
            if (propertyId) {
                const existing = await this.prisma.bankAccountDetails.findUnique({
                    where: { propertyId },
                });
                if (existing && existing.id !== id) {
                    throw new common_1.ConflictException('Target property already has a bank account');
                }
            }
        }
        if (userId) {
            await this.validateUser(userId);
        }
        if (updateData.iban) {
            const existingIban = await this.prisma.bankAccountDetails.findFirst({
                where: {
                    iban: updateData.iban,
                    id: { not: id },
                },
            });
            if (existingIban) {
                throw new common_1.ConflictException('This IBAN is already registered');
            }
        }
        const updated = await this.prisma.bankAccountDetails.update({
            where: { id },
            data: {
                ...updateData,
                ...(propertyId && { propertyId }),
                ...(userId && { userId }),
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Bank account updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.bankAccountDetails.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Bank account deleted successfully',
        };
    }
    maskAccountNumber(accountNumber) {
        if (accountNumber.length <= 4)
            return '****';
        const lastFour = accountNumber.slice(-4);
        return `****${lastFour}`;
    }
    maskIban(iban) {
        if (iban.length <= 8)
            return '****';
        const firstFour = iban.slice(0, 4);
        const lastFour = iban.slice(-4);
        return `${firstFour}****${lastFour}`;
    }
    async validateProperty(propertyId) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        return property;
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
};
exports.BankAccountService = BankAccountService;
exports.BankAccountService = BankAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BankAccountService);
//# sourceMappingURL=bank-account.service.js.map