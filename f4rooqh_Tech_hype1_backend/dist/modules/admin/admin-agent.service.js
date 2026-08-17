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
exports.AdminAgentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let AdminAgentService = class AdminAgentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAgents(adminId, query) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: client_1.Role.ADMIN },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Unauthorized: Only admins can manage agents');
        }
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.Role.AGENT,
            ...(search && {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { phoneNumber: { contains: search, mode: 'insensitive' } },
                    { agentProfile: { agencyName: { contains: search, mode: 'insensitive' } } },
                ],
            }),
        };
        const [agents, total] = await Promise.all([
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
                    agentProfile: {
                        include: {
                            _count: {
                                select: {
                                    properties: true,
                                },
                            },
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        const enhancedAgents = await Promise.all(agents.map(async (agent) => {
            const verifiedPropsCount = await this.prisma.property.count({
                where: {
                    listingAgentId: agent.id,
                    isRegaVerified: true,
                },
            });
            return {
                ...agent,
                stats: {
                    totalProperties: agent.agentProfile?._count?.properties || 0,
                    verifiedProperties: verifiedPropsCount,
                },
            };
        }));
        return {
            success: true,
            data: enhancedAgents,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAgentStats(adminId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: client_1.Role.ADMIN },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Unauthorized: Only admins can view statistics');
        }
        const [total, regaVerified, nafathVerified, statusCounts] = await Promise.all([
            this.prisma.user.count({ where: { role: client_1.Role.AGENT } }),
            this.prisma.agentProfile.count({ where: { isRegaVerified: true } }),
            this.prisma.agentProfile.count({ where: { isNafathVerified: true } }),
            this.prisma.user.groupBy({
                by: ['status'],
                where: { role: client_1.Role.AGENT },
                _count: true,
            }),
        ]);
        const unverifiedCount = await this.prisma.agentProfile.count({
            where: {
                isRegaVerified: false,
                isNafathVerified: false,
            }
        });
        return {
            success: true,
            data: {
                totalAgents: total,
                regaVerified,
                nafathVerified,
                unverifiedCount,
                statusBreakdown: statusCounts.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
            },
        };
    }
    async updateAgentStatus(userId, status) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, role: client_1.Role.AGENT },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Agent with ID ${userId} not found`);
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
            message: `Agent ${status === client_1.UserStatus.BANNED ? 'blocked' : 'updated'} successfully`,
            data: updatedUser,
        };
    }
};
exports.AdminAgentService = AdminAgentService;
exports.AdminAgentService = AdminAgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminAgentService);
//# sourceMappingURL=admin-agent.service.js.map