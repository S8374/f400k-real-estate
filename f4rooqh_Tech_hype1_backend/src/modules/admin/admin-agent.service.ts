import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class AdminAgentService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get all agents with their profile and property stats
   */
  async getAllAgents(adminId: string, query: { page?: number; limit?: number; search?: string }) {
    // Validate admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Unauthorized: Only admins can manage agents');
    }

    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      role: Role.AGENT,
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

    // Enhance response with manual counts if needed (e.g., Rega verified properties per agent)
    const enhancedAgents = await Promise.all(
      agents.map(async (agent) => {
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
      }),
    );

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

  /**
   * Get global agent statistics for dashboard cards
   */
  async getAgentStats(adminId: string) {
    // Validate admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Unauthorized: Only admins can view statistics');
    }

    const [total, regaVerified, nafathVerified, statusCounts] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.AGENT } }),
      this.prisma.agentProfile.count({ where: { isRegaVerified: true } }),
      this.prisma.agentProfile.count({ where: { isNafathVerified: true } }),
      this.prisma.user.groupBy({
        by: ['status'],
        where: { role: Role.AGENT },
        _count: true,
      }),
    ]);

    // Calculate unverified (neither Rega nor Nafath)
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
        }, {} as Record<string, number>),
      },
    };
  }

  /**
   * Update agent status (Block/Unblock)
   */
  async updateAgentStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, role: Role.AGENT },
    });

    if (!user) {
      throw new NotFoundException(`Agent with ID ${userId} not found`);
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
      message: `Agent ${status === UserStatus.BANNED ? 'blocked' : 'updated'} successfully`,
      data: updatedUser,
    };
  }
}
