import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MilestonePaymentService } from '../milestone-payment/milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';
import { AgentUploadDto, AgentReviewDto } from '../milestone-payment/dto/agent-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { MilestonePaymentStatus, PropertyStatus } from '@prisma/client';

@Injectable()
export class AgentMilestonePaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly milestonePaymentService: MilestonePaymentService,
  ) { }
//  new updsted 
  async getPendingPayments(agentId: string, filterDto: FilterMilestonePaymentDto) {
    await this.milestonePaymentService.validateAgent(agentId);

    // Get properties this agent manages
    const properties = await this.prisma.property.findMany({
      where: { listingAgentId: agentId },
      select: { id: true },
    });

    const propertyIds = properties.map(p => p.id);

    const where = {
      status: MilestonePaymentStatus.PENDING,
      milestone: {
        plan: {
          propertyId: { in: propertyIds },
        },
      },
      ...(filterDto.unreadOnly && { isReadByAgent: false }),
    };

    const result = await this.milestonePaymentService.findPayments(
      where,
      {
        milestone: {
          include: {
            plan: {
              include: {
                property: true,
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
      },
      filterDto.page,
      filterDto.limit,
    );

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  async uploadDocument(dto: AgentUploadDto) {
    const { paymentId, agentId, agentDocumentUrls, notes } = dto;

    // Validate access
    const payment = await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, agentId);

    // Update payment with agent document
    const updated = await this.prisma.milestonePayment.update({
      where: { id: paymentId },
      data: {
        agentDocumentUrls,
        agentDocumentNote: notes,
        agentUploadedAt: new Date(),
        isReadByBuyer: false, // Buyer needs to see this
        isReadByAgent: true, // Agent just uploaded and thus read it
        notes: notes ? `${payment.notes || ''} | Agent uploaded: ${notes}` : payment.notes,
      },
      include: {
        buyer: {
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
      message: 'Document uploaded successfully',
      data: updated,
    };
  }

  async reviewPayment(dto: AgentReviewDto) {
    const { paymentId, agentId, notes, status } = dto;

    // Validate access
    await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, agentId);

    // Check status
    const payment = await this.prisma.milestonePayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== MilestonePaymentStatus.PENDING) {
      throw new BadRequestException(
        `Payment cannot be reviewed. Current status: ${payment.status}`,
      );
    }

    // Update payment
    const updated = await this.prisma.milestonePayment.update({
      where: { id: paymentId },
      data: {
        agentId,
        agentReviewedAt: new Date(),
        status,
        notes: notes ? `${payment.notes || ''} | Agent review: ${notes}` : payment.notes,
        isReadByAdmin: false, // Admin needs to see this
        isReadByAgent: true, // Agent just reviewed and thus read it
        isReadByBuyer: false, // Buyer needs to know status changed
      },
      include: {
        buyer: {
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
      message: 'Payment reviewed successfully',
      data: updated,
    };
  }

  async markAsRead(dto: MarkAsReadDto) {
    const { paymentId, userId, userRole } = dto;

    // Validate access
    await this.milestonePaymentService.validatePaymentAccess(paymentId, undefined, userId);

    const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);

    return {
      success: true,
      message: 'Marked as read',
      data: updated,
    };
  }

  async getAgentPerformance(agentId: string) {
    // Validate agent exists
    const agent = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: { user: true },
    });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    // Get agent properties
    const properties = await this.prisma.property.findMany({
      where: { listingAgentId: agentId },
      select: {
        id: true,
        status: true,
      },
    });
    const propertyIds = properties.map(p => p.id);

    const totalListings = properties.length;
    const activeListings = properties.filter(p => p.status === PropertyStatus.ACTIVE).length;

    // Deals Completed = Milestone payments verified for agent's properties
    const dealsCompleted = await this.prisma.milestonePayment.count({
      where: {
        agentId,
        status: MilestonePaymentStatus.VERIFIED,
        milestone: {
          plan: {
            propertyId: { in: propertyIds },
          },
        },
      },
    });

    return {
      totalListings,
      activeListings,
      dealsCompleted,
    };
  }

  async getPaymentDetails(id: string, agentId: string) {
    await this.milestonePaymentService.validatePaymentAccess(id, undefined, agentId);
    const payment = await this.milestonePaymentService.findOne(id);

    return {
      success: true,
      data: payment,
    };
  }
  async findByAgent(agentId: string) {
    // Validate agent exists and get agent details
    const agentExists = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            phoneNumber: true,
            createdAt: true,
          },
        },
      },
    });

    if (!agentExists) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    // Get all properties for this agent with all relations
    const properties = await this.prisma.property.findMany({
      where: { listingAgentId: agentId },
      include: {
        developer: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        attributes: true,
        media: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        units: {
          include: {
            media: true,
          },
        },
        paymentPlans: {
          include: {
            milestones: {
              orderBy: {
                milestoneOrder: 'asc',
              },
            },
            acceptances: {
              include: {
                buyer: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        propertyViews: {
          orderBy: {
            viewedAt: 'desc',
          },
          take: 50, // Recent 50 views
        },
        savedBy: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        invisitor: true,
        bankAccount: true,
        nearbyProjects: {
          where: { isActive: true },
          orderBy: {
            distanceKm: 'asc',
          },
        },
        paymentPlanAcceptances: {
          include: {
            buyer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            paymentPlan: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            units: true,
            savedBy: true,
            propertyViews: true,
            paymentPlans: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return properties;
  }
  async getAgentDashboardStats(agentId: string) {
    // Validate agent exists
    const agentExists = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!agentExists) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    // Get all properties for this agent
    const agentProperties = await this.prisma.property.findMany({
      where: { listingAgentId: agentId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        media: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    });

    const propertyIds = agentProperties.map(p => p.id);

    // Run all queries in parallel
    const [
      totalListings,
      activeListings,
      soldListings,
      pendingListings,
      totalLeads,
      totalViews
    ] = await Promise.all([
      // Total Listings
      this.prisma.property.count({
        where: { listingAgentId: agentId },
      }),

      // Active Listings (ACTIVE status)
      this.prisma.property.count({
        where: {
          listingAgentId: agentId,
          status: 'ACTIVE', // Changed from 'PENDING' to 'ACTIVE'
        },
      }),

      // Sold Listings
      this.prisma.property.count({
        where: {
          listingAgentId: agentId,
          status: 'SOLD',
        },
      }),

      // Pending Listings
      this.prisma.property.count({
        where: {
          listingAgentId: agentId,
          status: 'PENDING',
        },
      }),

      // Total Leads (messages about agent's properties)
      this.prisma.message.count({
        where: {
          conversation: {
            propertyId: {
              in: propertyIds.length > 0 ? propertyIds : ['no-properties'],
            },
          },
        },
      }),

      // Total Views
      this.prisma.propertyView.count({
        where: {
          propertyId: {
            in: propertyIds.length > 0 ? propertyIds : ['no-properties'],
          },
        },
      }),

      // Listings by Status
      this.prisma.property.groupBy({
        by: ['status'],
        where: { listingAgentId: agentId },
        _count: true,
      }),

      // Recent Views
      propertyIds.length > 0
        ? this.prisma.propertyView.findMany({
          where: {
            propertyId: {
              in: propertyIds,
            },
          },
          take: 5,
          orderBy: { viewedAt: 'desc' },
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        })
        : Promise.resolve([]),

      // Recent Leads (Messages)
      propertyIds.length > 0
        ? this.prisma.message.findMany({
          where: {
            conversation: {
              propertyId: {
                in: propertyIds,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                fullName: true,
              },
            },
          },
        })
        : Promise.resolve([]),

      // Recent Saves
      propertyIds.length > 0
        ? this.prisma.savedListing.findMany({
          where: {
            propertyId: {
              in: propertyIds,
            },
          },
          take: 5,
          orderBy: { savedAt: 'desc' },
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        })
        : Promise.resolve([]),

      // Top Performing Properties
      this.getTopPerformingProperties(agentId, 5),
    ]);

    // Calculate conversion rate
    const conversionRate = totalViews > 0
      ? ((totalLeads / totalViews) * 100).toFixed(1)
      : '0.0';




    return {
      success: true,
      data: {
        totalListings,
        activeListings,
        soldListings,
        pendingListings,
        totalLeads,
        conversionRate: `${conversionRate}%`,
      },
    };
  }
  // Helper method to get top performing properties
  private async getTopPerformingProperties(agentId: string, limit: number = 5) {
    const properties = await this.prisma.property.findMany({
      where: {
        listingAgentId: agentId,
        status: 'ACTIVE', // Only active properties in top performers
      },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        media: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
        _count: {
          select: {
            propertyViews: true,
            savedBy: true,
          },
        },
      },
      orderBy: {
        propertyViews: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    // Get leads count for each property
    const propertiesWithLeads = await Promise.all(
      properties.map(async (property) => {
        const leads = await this.prisma.message.count({
          where: {
            conversation: {
              propertyId: property.id,
            },
          },
        });

        return {
          id: property.id,
          title: property.title,
          price: property.price,
          currency: property.currency,
          image: property.media[0]?.url || null,
          views: property._count.propertyViews,
          saves: property._count.savedBy,
          leads,
          engagementScore: this.calculateEngagementScore(
            property._count.propertyViews,
            property._count.savedBy,
            leads
          ),
        };
      })
    );

    // Sort by engagement score
    return propertiesWithLeads.sort((a, b) => b.engagementScore - a.engagementScore);
  }

  private calculateEngagementScore(views: number, saves: number, leads: number): number {
    // Simple weighted engagement score
    return (views * 0.3) + (saves * 1.5) + (leads * 2);
  }

  async getUnreadCount(agentId: string) {
    await this.milestonePaymentService.validateAgent(agentId);
    return this.milestonePaymentService.getUnreadCount(agentId, 'AGENT');
  }

}