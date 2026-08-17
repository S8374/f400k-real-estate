import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { UserStatus, Role, KycStatus } from '@prisma/client';

@Injectable()
export class AdminBuyerService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get all buyers with their profile and activity stats
   */
  async getAllBuyers(adminId: string, query: { page?: number; limit?: number; search?: string }) {
    // Validate admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Unauthorized: Only admins can manage buyers');
    }

    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      role: Role.BUYER,
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

    const formattedBuyers = buyers.map((buyer: any) => ({
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

  /**
   * Get global buyer statistics for dashboard cards
   */
  async getBuyerStats(adminId: string) {
    // Validate admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Unauthorized: Only admins can view statistics');
    }

    const [total, kycVerified, nafathVerified, statusCounts] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.BUYER } }),
      this.prisma.buyerProfile.count({ where: { kycStatus: KycStatus.VERIFIED } }),
      this.prisma.buyerProfile.count({ where: { isNafathVerified: true } }),
      this.prisma.user.groupBy({
        by: ['status'],
        where: { role: Role.BUYER },
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
        }, {} as Record<string, number>),
      },
    };
  }

  /**
   * Update buyer status (Block/Unblock)
   */
  async updateBuyerStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, role: Role.BUYER },
    });

    if (!user) {
      throw new NotFoundException(`Buyer with ID ${userId} not found`);
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
}
