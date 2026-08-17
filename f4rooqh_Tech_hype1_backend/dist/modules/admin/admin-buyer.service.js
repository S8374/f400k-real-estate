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
exports.AdminBuyerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let AdminBuyerService = class AdminBuyerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBuyers(adminId, query) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: client_1.Role.ADMIN },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Unauthorized: Only admins can manage buyers');
        }
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.Role.BUYER,
            ...(search && {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { phoneNumber: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [buyers, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    avatarUrl: true,
                    status: true,
                    isVerified: true,
                    lastLogin: true,
                    isOnline: true,
                    buyerProfile: true,
                    _count: {
                        select: {
                            propertyViews: true,
                            savedListings: true,
                            buyerAcceptances: true
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        const formattedBuyers = buyers.map((buyer) => ({
            ...buyer,
            stats: {
                views: buyer._count?.propertyViews || 0,
                saved: buyer._count?.savedListings || 0,
                owned: buyer._count?.buyerAcceptances || 0
            }
        }));
        return {
            success: true,
            data: formattedBuyers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getBuyerStats(adminId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: client_1.Role.ADMIN },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Unauthorized: Only admins can view statistics');
        }
        const [total, kycVerified, nafathVerified, statusCounts] = await Promise.all([
            this.prisma.user.count({ where: { role: client_1.Role.BUYER } }),
            this.prisma.buyerProfile.count({ where: { kycStatus: client_1.KycStatus.VERIFIED } }),
            this.prisma.buyerProfile.count({ where: { isNafathVerified: true } }),
            this.prisma.user.groupBy({
                by: ['status'],
                where: { role: client_1.Role.BUYER },
                _count: true,
            }),
        ]);
        return {
            success: true,
            data: {
                totalBuyers: total,
                kycVerified,
                nafathVerified,
                statusBreakdown: statusCounts.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
            },
        };
    }
    async updateBuyerStatus(userId, status) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, role: client_1.Role.BUYER },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Buyer with ID ${userId} not found`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { status },
            select: {
                id: true,
                fullName: true,
                status: true,
            },
        });
        return {
            success: true,
            message: `Buyer account updated to ${status} successfully`,
            data: updatedUser,
        };
    }
};
exports.AdminBuyerService = AdminBuyerService;
exports.AdminBuyerService = AdminBuyerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminBuyerService);
//# sourceMappingURL=admin-buyer.service.js.map