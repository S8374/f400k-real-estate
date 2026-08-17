import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { FilterMilestoneDto } from './dto/filter-milestone.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MilestoneService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMilestoneDto: CreateMilestoneDto) {
    const { planId, dueDate, amount, milestoneOrder, ...milestoneData } = createMilestoneDto;

    // Validate payment plan
    await this.validatePaymentPlan(planId);

    // Get last milestone
    const lastMilestone = await this.prisma.milestone.findFirst({
      where: { planId },
      orderBy: { milestoneOrder: 'desc' },
      select: { milestoneOrder: true },
    });

    const nextOrder = lastMilestone ? lastMilestone.milestoneOrder + 1 : 1;

    // ❗ If frontend order wrong → throw error
    if (milestoneOrder !== nextOrder) {
      throw new BadRequestException({
        message: `Invalid milestone order expected  ${nextOrder}`,
        expectedOrder: nextOrder,
        receivedOrder: milestoneOrder,
      });
    }

    const milestone = await this.prisma.milestone.create({
      data: {
        planId,
        ...milestoneData,
        milestoneOrder: nextOrder,
        amount: amount || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            property: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Milestone created successfully',
      data: milestone,
    };
  }
  async findAll(filterDto: FilterMilestoneDto) {
    const {
      planId,
      hasDueDate,
      page = 1,
      limit = 50,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.MilestoneWhereInput = {};

    if (planId) where.planId = planId;
    if (hasDueDate !== undefined) {
      where.dueDate = hasDueDate ? { not: null } : null;
    }

    const [milestones, total] = await Promise.all([
      this.prisma.milestone.findMany({
        where,
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              property: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: [
          { planId: 'asc' },
          { milestoneOrder: 'asc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.milestone.count({ where }),
    ]);

    return {
      success: true,
      data: milestones,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        plan: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return {
      success: true,
      data: milestone,
    };
  }

  async findByPlan(planId: string, filterDto: FilterMilestoneDto) {
    await this.validatePaymentPlan(planId);
    return this.findAll({ ...filterDto, planId });
  }

  async findUpcoming(days: number = 30) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const milestones = await this.prisma.milestone.findMany({
      where: {
        dueDate: {
          not: null,
          gte: now,
          lte: futureDate,
        },
      },
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
      orderBy: {
        dueDate: 'asc',
      },
    });

    return {
      success: true,
      data: milestones,
      count: milestones.length,
      timeframe: `${days} days`,
    };
  }

  async update(id: string, updateMilestoneDto: UpdateMilestoneDto) {
    // First check if milestone exists
    await this.findOne(id);

    const { planId, dueDate, amount, ...updateData } = updateMilestoneDto;

    if (planId) {
      await this.validatePaymentPlan(planId);
    }

    // If updating order, check for conflicts
    if (updateData.milestoneOrder) {
      const currentMilestone = await this.prisma.milestone.findUnique({
        where: { id },
        select: { planId: true },
      });

      if (!currentMilestone) {
        throw new NotFoundException(`Milestone with ID ${id} not found`);
      }

      const targetPlanId = planId || currentMilestone.planId;

      const existingMilestone = await this.prisma.milestone.findUnique({
        where: {
          planId_milestoneOrder: {
            planId: targetPlanId,
            milestoneOrder: updateData.milestoneOrder,
          },
        },
      });

      if (existingMilestone && existingMilestone.id !== id) {
        throw new BadRequestException(
          `Milestone with order ${updateData.milestoneOrder} already exists for this payment plan`,
        );
      }
    }

    const updatedMilestone = await this.prisma.milestone.update({
      where: { id },
      data: {
        ...updateData,
        amount: amount !== undefined ? amount : undefined,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(planId && { planId }),
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Milestone updated successfully',
      data: updatedMilestone,
    };
  }

  async reorder(planId: string, items: { id: string; milestoneOrder: number }[]) {
    await this.validatePaymentPlan(planId);

    // Validate all items belong to this plan
    const milestoneIds = items.map(item => item.id);
    const milestones = await this.prisma.milestone.findMany({
      where: {
        id: { in: milestoneIds },
        planId,
      },
    });

    if (milestones.length !== items.length) {
      throw new BadRequestException('Some milestones do not belong to this plan');
    }

    // Check for duplicate order numbers
    const orders = items.map(item => item.milestoneOrder);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new BadRequestException('Duplicate milestone orders');
    }

    // Update in transaction
    const updates = items.map(item =>
      this.prisma.milestone.update({
        where: { id: item.id },
        data: { milestoneOrder: item.milestoneOrder },
      })
    );

    await this.prisma.$transaction(updates);

    return {
      success: true,
      message: 'Milestones reordered successfully',
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if milestone has payments
    const paymentsCount = await this.prisma.milestonePayment.count({
      where: { milestoneId: id },
    });

    if (paymentsCount > 0) {
      throw new BadRequestException(
        `Cannot delete milestone with ${paymentsCount} payments`,
      );
    }

    await this.prisma.milestone.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Milestone deleted successfully',
    };
  }

  async removeAllByPlan(planId: string) {
    await this.validatePaymentPlan(planId);

    // Check if any milestones have payments
    const milestonesWithPayments = await this.prisma.milestone.findMany({
      where: {
        planId,
        payments: {
          some: {},
        },
      },
      select: {
        id: true,
        milestoneOrder: true,
        _count: {
          select: { payments: true },
        },
      },
    });

    if (milestonesWithPayments.length > 0) {
      const milestoneInfo = milestonesWithPayments
        .map(m => `Order ${m.milestoneOrder} (${m._count.payments} payments)`)
        .join(', ');

      throw new BadRequestException(
        `Cannot delete milestones with payments: ${milestoneInfo}`,
      );
    }

    const result = await this.prisma.milestone.deleteMany({
      where: { planId },
    });

    return {
      success: true,
      message: `Successfully deleted ${result.count} milestones`,
      count: result.count,
    };
  }

  async getPlanSummary(planId: string) {
    await this.validatePaymentPlan(planId);

    const milestones = await this.prisma.milestone.findMany({
      where: { planId },
      include: {
        _count: {
          select: { payments: true },
        },
      },
      orderBy: {
        milestoneOrder: 'asc',
      },
    });

    const totalAmount = milestones.reduce(
      (sum, m) => sum + (m.amount || 0),
      0,
    );

    const withDueDate = milestones.filter(m => m.dueDate).length;
    const withConstructionProgress = milestones.filter(m => m.constructionProgress).length;

    return {
      success: true,
      data: {
        planId,
        totalMilestones: milestones.length,
        totalAmount,
        withDueDate,
        withConstructionProgress,
        milestones: milestones.map(m => ({
          id: m.id,
          order: m.milestoneOrder,
          tittle: m.tittle,
          description: m.description,
          amount: m.amount,
          dueDate: m.dueDate,
          constructionProgress: m.constructionProgress,
          paymentCount: m._count.payments,
        })),
      },
    };
  }

  async getPropertyConstructionProgress(propertyId: string) {
    // Get all milestones for this property
    const milestones = await this.prisma.milestone.findMany({
      where: {
        plan: {
          propertyId,
        },
      },
      include: {
        payments: {
          where: {
            status: 'VERIFIED',
          },
        },
      },
    });

    if (milestones.length === 0) {
      return {
        success: true,
        data: {
          totalMilestones: 0,
          completedMilestones: 0,
          constructionProgress: 0,
        },
      };
    }

    // Calculate construction progress based on verified payments
    const completedMilestones = milestones.filter(m => m.payments.length > 0).length;
    const constructionProgress = (completedMilestones / milestones.length) * 100;

    return {
      success: true,
      data: {
        totalMilestones: milestones.length,
        completedMilestones,
        constructionProgress: Math.round(constructionProgress),
      },
    };
  }

  private async validatePaymentPlan(planId: string) {
    const plan = await this.prisma.paymentPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Payment plan with ID ${planId} not found`);
    }

    return plan;
  }
}