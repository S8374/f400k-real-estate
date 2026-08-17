import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { MilestonePaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class MilestonePaymentService {
  constructor(private readonly prisma: PrismaService) { }

  // ==================== VALIDATION METHODS ====================
  async validateMilestone(milestoneId: string, propertyId?: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        plan: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${milestoneId} not found`);
    }

    if (propertyId && milestone.plan.propertyId !== propertyId) {
      throw new BadRequestException('Milestone does not belong to the specified property');
    }

    return milestone;
  }

  async validateBuyer(buyerId: string) {
    if (!buyerId) {
      throw new BadRequestException('Buyer ID is required');
    }

    const buyer = await this.prisma.buyerProfile.findUnique({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new NotFoundException(`Buyer with ID ${buyerId} not found`);
    }

    return buyer;
  }

  async validateAgent(agentId: string) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    return agent;
  }

  async validateAdmin(adminId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    return admin;
  }

  async validatePaymentAccess(paymentId: string, buyerId?: string, agentId?: string) {
    const payment = await this.prisma.milestonePayment.findUnique({
      where: { id: paymentId },
      include: {
        milestone: {
          include: {
            plan: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (buyerId && payment.buyerId !== buyerId) {
      throw new BadRequestException('You do not have access to this payment');
    }

    if (agentId && payment.milestone.plan.property.listingAgentId !== agentId) {
      throw new BadRequestException('You do not have access to this payment');
    }

    return payment;
  }

  // ==================== SHARED METHODS ====================
  async findPayments(
    where: Prisma.MilestonePaymentWhereInput,
    include?: Prisma.MilestonePaymentInclude,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.milestonePayment.findMany({
        where,
        include: include || {
          milestone: {
            include: {
              plan: {
                include: {
                  property: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
          buyer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          agent: {
            select: {
              id: true,
              fullName: true,
            },
          },
          admin: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.milestonePayment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.milestonePayment.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            plan: {
              include: {
                milestones: {
                  include: {
                    payments: true,
                  },
                },
                property: {
                  select: {
                    id: true,
                    title: true,
                    listingAgentId: true,
                  },
                },
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        agent: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        admin: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async markAsRead(paymentId: string, userRole: string) {
    const updateData = {};

    switch (userRole) {
      case 'BUYER':
        updateData['isReadByBuyer'] = true;
        break;
      case 'AGENT':
        updateData['isReadByAgent'] = true;
        break;
      case 'ADMIN':
        updateData['isReadByAdmin'] = true;
        break;
    }
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Invalid user role for marking as read');
    }

    return this.prisma.milestonePayment.update({
      where: { id: paymentId },
      data: updateData,
    });
  }

  async getUnreadCount(userId: string, role: string) {
    let where = {};

    if (role === 'BUYER') {
      where = { buyerId: userId, isReadByBuyer: false };
    } else if (role === 'AGENT') {
      const properties = await this.prisma.property.findMany({
        where: { listingAgentId: userId },
        select: { id: true },
      });

      where = {
        isReadByAgent: false,
        milestone: {
          plan: {
            propertyId: { in: properties.map(p => p.id) },
          },
        },
      };
    } else if (role === 'ADMIN') {
      where = { isReadByAdmin: false };
    }

    const count = await this.prisma.milestonePayment.count({ where });
    return { unreadCount: count };
  }

}