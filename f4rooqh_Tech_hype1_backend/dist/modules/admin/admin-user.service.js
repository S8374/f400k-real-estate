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
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let AdminUserService = class AdminUserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers(adminId, query) {
        const { page = 1, limit = 10, search, role, status } = query;
        const skip = (page - 1) * limit;
        const where = {
            id: { not: adminId },
            status: status ? status : { not: client_1.UserStatus.DELETED },
        };
        if (role)
            where.role = role;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phoneNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    agentProfile: true,
                    buyerProfile: true,
                    _count: {
                        select: {
                            kycDocuments: true,
                            sentMessages: true,
                        }
                    }
                }
            }),
            this.prisma.user.count({ where }),
        ]);
        const [totalUsers, activeUsers, bannedUsers, pendingUsers] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: client_1.UserStatus.ACTIVE } }),
            this.prisma.user.count({ where: { status: client_1.UserStatus.BANNED } }),
            this.prisma.user.count({ where: { status: client_1.UserStatus.PENDING_VERIFICATION } }),
        ]);
        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats: {
                totalUsers,
                activeUsers,
                bannedUsers,
                pendingUsers
            }
        };
    }
    async getUserDetails(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                agentProfile: {
                    include: {
                        properties: {
                            take: 5,
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                },
                buyerProfile: true,
                kycDocuments: true,
                bankAccounts: true,
                _count: {
                    select: {
                        sentMessages: true,
                        savedListings: true,
                    }
                }
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUserStatus(userId, status) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { status },
        });
        return {
            success: true,
            message: `User status updated to ${status}`,
            data: updatedUser
        };
    }
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: client_1.UserStatus.DELETED },
        });
        return {
            success: true,
            message: 'User deleted successfully'
        };
    }
};
exports.AdminUserService = AdminUserService;
exports.AdminUserService = AdminUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminUserService);
//# sourceMappingURL=admin-user.service.js.map