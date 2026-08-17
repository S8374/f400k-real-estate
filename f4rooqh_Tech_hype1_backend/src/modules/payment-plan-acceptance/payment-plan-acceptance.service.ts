import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreatePaymentPlanAcceptanceDto } from './dto/create-payment-plan-acceptance.dto';
import { UpdatePaymentPlanAcceptanceDto } from './dto/update-payment-plan-acceptance.dto';
import { FilterPaymentPlanAcceptanceDto } from './dto/filter-payment-plan-acceptance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentPlanAcceptanceService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDto: CreatePaymentPlanAcceptanceDto) {
    const { agentId, propertyId, paymentPlanId, buyerId } = createDto;

    // Validate all entities exist and the property belongs to the agent
    await this.validateAgent(agentId, propertyId);
    await this.validateBuyer(buyerId);
    await this.validatePaymentPlan(paymentPlanId);

    // Check if already exists
    const existing = await this.prisma.paymentPlanAcceptance.findUnique({
      where: {
        buyerId_propertyId_paymentPlanId: {
          buyerId: agentId,
          propertyId,
          paymentPlanId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Acceptance already exists');
    }

    try {
      // Transaction: create acceptance + update property
      const [acceptance] = await this.prisma.$transaction([
        this.prisma.paymentPlanAcceptance.create({
          data: {
            buyerId: agentId,
            propertyId,
            paymentPlanId,
            acceptedById: buyerId,
            acceptedAt: new Date(),
          },
          include: {
            buyer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            property: {
              select: {
                id: true,
                title: true,
              },
            },
            paymentPlan: {
              select: {
                id: true,
                name: true,
              },
            },
            acceptedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        }),
        this.prisma.property.update({
          where: { id: propertyId },
          data: { isBooked: true },
        }),
      ]);

      return {
        success: true,
        message: 'Payment plan accepted successfully and property booked',
        data: acceptance,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Acceptance already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid foreign key reference');
        }
      }
      throw error;
    }
  }

  async toggle(createDto: CreatePaymentPlanAcceptanceDto) {
    const { agentId, propertyId, paymentPlanId, buyerId } = createDto;

    // Validate entities exist and the property belongs to the agent
    await this.validateAgent(agentId, propertyId);
    await this.validateBuyer(buyerId);
    await this.validatePaymentPlan(paymentPlanId);

    const existing = await this.prisma.paymentPlanAcceptance.findUnique({
      where: {
        buyerId_propertyId_paymentPlanId: {
          buyerId: agentId,
          propertyId,
          paymentPlanId,
        },
      },
    });

    if (existing) {
      // If exists, delete it (toggle off)
      await this.prisma.paymentPlanAcceptance.delete({
        where: { id: existing.id },
      });

      return {
        success: true,
        message: 'Payment plan acceptance removed',
        data: { accepted: false },
      };
    } else {
      // If doesn't exist, create it (toggle on)
      const acceptance = await this.prisma.paymentPlanAcceptance.create({
        data: {
          buyerId: agentId,
          propertyId,
          paymentPlanId,
          acceptedById: buyerId,
          acceptedAt: new Date(),
        },
      });

      // Auto-adjust any milestones that are already past due
      const now = new Date();
      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(now.getDate() + 3);

      await this.prisma.milestone.updateMany({
        where: {
          planId: paymentPlanId,
          dueDate: {
            lt: now,
          },
        },
        data: {
          dueDate: threeDaysFromNow,
        },
      });

      return {
        success: true,
        message: 'Payment plan accepted',
        data: { ...acceptance, accepted: true },
      };
    }
  }

  async findOne(id: string) {
    const acceptance = await this.prisma.paymentPlanAcceptance.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        paymentPlan: {
          include: {
            milestones: {
              orderBy: {
                milestoneOrder: 'asc',
              },
            },
          },
        },
        acceptedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!acceptance) {
      throw new NotFoundException(`Payment plan acceptance with ID ${id} not found`);
    }

    return {
      success: true,
      data: acceptance,
    };
  }

  async findByAgent(agentId: string, filterDto: FilterPaymentPlanAcceptanceDto) {
    await this.validateAgent(agentId);

    if (filterDto.propertyId) {
      await this.validateAgent(agentId, filterDto.propertyId);
    }

    return this.findAll({ ...filterDto, buyerId: agentId });
  }

  async findByBuyer(buyerId: string, filterDto: FilterPaymentPlanAcceptanceDto) {
    await this.validateBuyer(buyerId);

    return this.findAll({ ...filterDto, acceptedById: buyerId });
  }

  async findAll(filterDto: FilterPaymentPlanAcceptanceDto) {
    const {
      buyerId,
      acceptedById,
      propertyId,
      paymentPlanId,
      withVerifier,
      page = 1,
      limit = 50,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.PaymentPlanAcceptanceWhereInput = {};

    if (buyerId) where.buyerId = buyerId;
    if (acceptedById) where.acceptedById = acceptedById;
    if (propertyId) where.propertyId = propertyId;
    if (paymentPlanId) where.paymentPlanId = paymentPlanId;
    if (withVerifier) where.acceptedById = { not: null };

    const [acceptances, total] = await Promise.all([
      this.prisma.paymentPlanAcceptance.findMany({
        where,
        include: {
          buyer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          paymentPlan: {
            select: {
              id: true,
              name: true,
            },
          },
          acceptedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },

        },
        orderBy: {
          acceptedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.paymentPlanAcceptance.count({ where }),
    ]);

    return {
      success: true,
      data: acceptances,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkAcceptance(agentId: string, propertyId: string, paymentPlanId: string) {
    const isAgentProperty = await this.isAgentProperty(agentId, propertyId);

    const acceptance = await this.prisma.paymentPlanAcceptance.findUnique({
      where: {
        buyerId_propertyId_paymentPlanId: {
          buyerId: agentId,
          propertyId,
          paymentPlanId,
        },
      },
      include: {
        acceptedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        isAgentProperty,
        accepted: !!acceptance,
        acceptance: acceptance || null,
      },
    };
  }

  private async validateBuyer(buyerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: buyerId },
      include: {
        buyerProfile: true
      }
    });

    if (!user) {
      throw new NotFoundException(`Buyer with ID ${buyerId} not found`);
    }

    if (user.role !== 'BUYER' || !user.buyerProfile) {
      throw new BadRequestException(`User with ID ${buyerId} is not a buyer`);
    }

    return user.buyerProfile;
  }

  private async validateAgent(agentId: string, propertyId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: agentId },
      include: {
        agentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    if (user.role !== 'AGENT' || !user.agentProfile) {
      throw new BadRequestException(`User with ID ${agentId} is not an agent`);
    }

    if (!propertyId) {
      return user.agentProfile;
    }

    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        listingAgentId: agentId,
      },
      select: {
        id: true,
        listingAgentId: true,
      },
    });

    if (!property) {
      const existingProperty = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });

      if (!existingProperty) {
        throw new NotFoundException(`Property with ID ${propertyId} not found`);
      }

      throw new BadRequestException(`Property with ID ${propertyId} does not belong to agent ${agentId}`);
    }

    return property;
  }

  private async isAgentProperty(agentId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        listingAgentId: agentId,
      },
      select: {
        id: true,
      },
    });

    return !!property;
  }

  private async validatePaymentPlan(paymentPlanId: string) {
    const plan = await this.prisma.paymentPlan.findUnique({
      where: { id: paymentPlanId },
    });

    if (!plan) {
      throw new NotFoundException(`Payment plan with ID ${paymentPlanId} not found`);
    }

    return plan;
  }
}