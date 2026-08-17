import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { UserStatus, Role } from '@prisma/client';

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all users with stats and pagination
   */
  async getAllUsers(adminId: string, query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: UserStatus;
  }) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      id: { not: adminId }, // Don't list the current admin
      status: status ? status : { not: UserStatus.DELETED }, // Hide deleted by default
    };

    if (role) where.role = role;
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

    // Get some stats for cards
    const [totalUsers, activeUsers, bannedUsers, pendingUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { status: UserStatus.BANNED } }),
      this.prisma.user.count({ where: { status: UserStatus.PENDING_VERIFICATION } }),
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

  /**
   * Get single user details
   */
  async getUserDetails(userId: string) {
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
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user status (Block/Unblock)
   */
  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

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

  /**
   * Delete user (Soft delete)
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // We do a soft delete by updating status
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED },
    });

    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
}
