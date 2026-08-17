import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { FilterPaymentPlanDto } from './dto/filter-payment-plan.dto';
import { MilestonePaymentStatus, Prisma } from '@prisma/client';
import { UpdatePaymentPlanDto } from './dto/update-paymentplan.dto';
import { CreatePaymentPlanDto } from './dto/create-paymentplan.dto';

@Injectable()
export class PaymentPlanService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, createPaymentPlanDto: CreatePaymentPlanDto) {
    const { propertyId, ...planData } = createPaymentPlanDto;

    // Validate property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // ✅ Check if property already has ANY payment plan
    const existingPlan = await this.prisma.paymentPlan.findFirst({
      where: {
        propertyId,
      },
    });

    if (existingPlan) {
      throw new BadRequestException(
        `Property "${property.title}" already has a payment plan. ` +
        `Each property can only have one payment plan. ` +
        `Existing plan ID: ${existingPlan.id}`
      );
    }

    const paymentPlan = await this.prisma.paymentPlan.create({
      data: {
        propertyId,
        createdById: userId,
        ...planData,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        createdBy: {
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
      message: `Payment plan created successfully for property "${property.title}"`,
      data: paymentPlan,
    };
  }


  async findAll(filterDto: FilterPaymentPlanDto) {
    const { propertyId, page = 1, limit = 20 } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.PaymentPlanWhereInput = {};

    if (propertyId) where.propertyId = propertyId;

    const [paymentPlans, total] = await Promise.all([
      this.prisma.paymentPlan.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
          milestones: {  // ✅ Include milestones
            orderBy: {
              milestoneOrder: 'asc',
            },
            select: {
              id: true,
              tittle: true,
              milestoneOrder: true,
              description: true,
              amount: true,
              dueDate: true,
              constructionProgress: true,
            },
          },
          _count: {
            select: {
              milestones: true,
            },
          },
        },
        orderBy: [{ propertyId: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.paymentPlan.count({ where }),
    ]);

    // Calculate additional milestone stats
    const plansWithStats = paymentPlans.map(plan => {
      const totalMilestoneAmount = plan.milestones.reduce(
        (sum, m) => sum + (m.amount || 0),
        0
      );

      const propertyPrice = plan.property.price || 0;
      const coveragePercentage = propertyPrice > 0
        ? Math.round((totalMilestoneAmount / propertyPrice) * 100)
        : 0;

      return {
        ...plan
      };
    });

    return {
      success: true,
      data: plansWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const paymentPlan = await this.prisma.paymentPlan.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            developer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!paymentPlan) {
      throw new NotFoundException(`Payment plan with ID ${id} not found`);
    }

    return {
      success: true,
      data: paymentPlan,
    };
  }


  async findByProperty(propertyId: string, filterDto: FilterPaymentPlanDto) {
    await this.validateProperty(propertyId);
    return this.findAll({ ...filterDto, propertyId });
  }

  async update(id: string, updatePaymentPlanDto: UpdatePaymentPlanDto) {
    await this.findOne(id);

    const { propertyId, ...updateData } = updatePaymentPlanDto;

    if (propertyId) {
      await this.validateProperty(propertyId);
    }

    // Check for duplicate name if name is being updated
    if (updateData.name) {
      const existingPlan = await this.prisma.paymentPlan.findFirst({
        where: {
          propertyId: propertyId || (await this.getPropertyId(id)),
          name: updateData.name,
          id: { not: id },
        },
      });

      if (existingPlan) {
        throw new BadRequestException(
          `Payment plan with name "${updateData.name}" already exists for this property`,
        );
      }
    }

    const updatedPaymentPlan = await this.prisma.paymentPlan.update({
      where: { id },
      data: {
        ...updateData,
        ...(propertyId && { propertyId }),
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Payment plan updated successfully',
      data: updatedPaymentPlan,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if plan has any payments (to prevent data loss)
    const paymentsCount = await this.prisma.milestonePayment.count({
      where: {
        milestone: {
          planId: id,
        },
      },
    });

    // if (milestonesCount > 0) {
    //   throw new BadRequestException(
    //     `Cannot delete payment plan with ${milestonesCount} milestones. Delete milestones first or use force delete.`,
    //   );
    // }

    // Use transaction to ensure both operations succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      // First delete all milestones associated with this plan
      const deletedMilestones = await tx.milestone.deleteMany({
        where: { planId: id },
      });

      // Then delete the payment plan
      await tx.paymentPlan.delete({
        where: { id },
      });

      return {
        success: true,
        message: `Payment plan and ${deletedMilestones.count} associated milestones deleted successfully`,
        data: {
          deletedMilestonesCount: deletedMilestones.count,
        },
      };
    });
  }

  async getByCreatorId(creatorId: string, propertyId?: string) {
    const plans = await this.prisma.paymentPlan.findMany({
      where: {
        createdById: creatorId,
        ...(propertyId && { propertyId })
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            isBooked: true,
            images: true
          }
        },
        acceptances: {
          select: {
            acceptedAt: true
          },
          orderBy: {
            acceptedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const plansWithStatus = plans.map(plan => ({
      ...plan,
      accepted: plan.acceptances && plan.acceptances.length > 0,
      isAccepted: plan.acceptances && plan.acceptances.length > 0,
      acceptedAt: plan.acceptances?.[0]?.acceptedAt || null
    }));

    const plansWithSummary = await this.enrichPlansWithSummary(plansWithStatus);

    // Calculate overall statistics for all plans
    const overallStats = this.calculateOverallStats(plansWithSummary);

    return {
      success: true,
      message: `Payment plans created by user ${creatorId}`,
      data: {
        plans: plansWithSummary,
        overallStats
      },
    };
  }

  async getByBuyerId(buyerId: string, propertyId?: string) {
    // 1. Find properties where this user is an invisitor
    const invisitors = await this.prisma.propertyInvisitor.findMany({
      where: {
        userId: buyerId,
        ...(propertyId && { propertyId })
      },
      select: { propertyId: true }
    });
    const propertyIdsFromInvisitor = invisitors.map(i => i.propertyId);

    // 2. Find plans this user has accepted
    const acceptances = await this.prisma.paymentPlanAcceptance.findMany({
      where: {
        acceptedById: buyerId,
        ...(propertyId && { propertyId })
      },
      select: { paymentPlanId: true, propertyId: true, acceptedAt: true }
    });
    const planIdsFromAcceptance = acceptances.map(a => a.paymentPlanId);
    const propertyIdsFromAcceptance = acceptances.map(a => a.propertyId);

    const allPropertyIds = [...new Set([...propertyIdsFromInvisitor, ...propertyIdsFromAcceptance])];

    // 3. Find all plans for these properties
    const plans = await this.prisma.paymentPlan.findMany({
      where: {
        OR: [
          { propertyId: { in: allPropertyIds } },
          { id: { in: planIdsFromAcceptance } }
        ],
        ...(propertyId && { propertyId })
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            isBooked: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const plansWithStatus = plans.map(plan => {
      const acceptance = acceptances.find(a => a.paymentPlanId === plan.id);
      return {
        ...plan,
        accepted: !!acceptance,
        isAccepted: !!acceptance,
        acceptedAt: acceptance?.acceptedAt || null
      };
    });

    const plansWithSummary = await this.enrichPlansWithSummary(plansWithStatus);
    const overallStats = this.calculateOverallStats(plansWithSummary);

    return {
      success: true,
      message: `Payment plans for buyer ${buyerId}`,
      data: {
        plans: plansWithSummary,
        overallStats
      },
    };
  }

  private calculateOverallStats(plansWithSummary: any[]) {
    const stats = plansWithSummary.reduce(
      (acc, plan) => {
        acc.totalPlans += 1;
        acc.totalMilestones += plan.summary.totalMilestones;
        acc.verifiedMilestones += plan.summary.verifiedMilestones;
        acc.pendingMilestones += plan.summary.pendingMilestones;
        acc.totalPaid += plan.summary.totalPaid;
        acc.totalPrice += plan.summary.totalPrice;
        acc.totalConstructionProgress += plan.summary.constructionProgress;
        return acc;
      },
      {
        totalPlans: 0,
        totalMilestones: 0,
        verifiedMilestones: 0,
        pendingMilestones: 0,
        totalPaid: 0,
        totalPrice: 0,
        totalConstructionProgress: 0,
        overallPaymentProgress: 0,
        averageConstructionProgress: 0,
      }
    );

    stats.overallPaymentProgress = stats.totalMilestones > 0
      ? Math.round((stats.verifiedMilestones / stats.totalMilestones) * 100)
      : 0;

    stats.averageConstructionProgress = stats.totalPlans > 0
      ? Math.round(stats.totalConstructionProgress / stats.totalPlans)
      : 0;

    return stats;
  }

  private async enrichPlansWithSummary(plans: any[]) {
    return await Promise.all(
      plans.map(async (plan) => {
        // Get all milestones for this plan
        const milestones = await this.prisma.milestone.findMany({
          where: { planId: plan.id },
          orderBy: { milestoneOrder: 'asc' },
        });

        const milestoneIds = milestones.map(m => m.id);

        // Get all payments for this plan's milestones
        const payments = await this.prisma.milestonePayment.findMany({
          where: {
            milestoneId: { in: milestoneIds }
          },
          include: {
            milestone: true,
            admin: {
              select: {
                fullName: true
              }
            }
          },
        });

        // --- PAYMENT STATISTICS ---

        // Total milestones count
        const totalMilestones = milestones.length;

        // Count milestones by payment status
        const verifiedPaymentIds = new Set(
          payments
            .filter(p => p.status === 'VERIFIED')
            .map(p => p.milestoneId)
        );

        const pendingPaymentIds = new Set(
          payments
            .filter(p => p.status === 'PENDING' || p.status === 'AGENT_REVIEWED')
            .map(p => p.milestoneId)
        );

        const rejectedPaymentIds = new Set(
          payments
            .filter(p => p.status === 'REJECTED')
            .map(p => p.milestoneId)
        );

        const verifiedMilestones = verifiedPaymentIds.size;
        const pendingMilestones = pendingPaymentIds.size;
        const rejectedMilestones = rejectedPaymentIds.size;
        const unpaidMilestones = totalMilestones -
          verifiedMilestones - pendingMilestones - rejectedMilestones;

        // Total amount paid (only verified payments)
        const totalPaid = payments
          .filter(p => p.status === 'VERIFIED')
          .reduce((sum, p) => sum + p.amountPaid, 0);

        const totalPrice = plan.property?.price || 0;

        // Payment progress percentage (based on verified milestones count instead of amount)
        const paymentProgress = totalMilestones > 0
          ? Math.round((verifiedMilestones / totalMilestones) * 100)
          : 0;

        // --- CORRECTED CONSTRUCTION PROGRESS CALCULATION ---
        // Sum the constructionProgress values from verified milestones only
        let constructionProgress = 0;

        // Get verified milestone IDs
        const verifiedMilestoneIds = new Set(
          payments
            .filter(p => p.status === 'VERIFIED')
            .map(p => p.milestoneId)
        );

        // Sum constructionProgress from verified milestones
        constructionProgress = milestones
          .filter(m => verifiedMilestoneIds.has(m.id))
          .reduce((sum, m) => sum + (m.constructionProgress || 0), 0);

        // Cap at 100% (though your sum should never exceed 100 with your template)
        constructionProgress = Math.min(constructionProgress, 100);

        // --- MILESTONE DETAILS WITH PAYMENT STATUS ---

        const milestoneDetails = milestones.map(m => {
          const milestonePayments = payments.filter(p => p.milestoneId === m.id);
          const latestPayment = milestonePayments.sort((a, b) =>
            b.paidAt.getTime() - a.paidAt.getTime()
          )[0];

          const totalMilestonePaid = milestonePayments
            .filter(p => p.status === 'VERIFIED')
            .reduce((sum, p) => sum + p.amountPaid, 0);

          let paymentStatus = 'UNPAID';
          if (milestonePayments.some(p => p.status === 'VERIFIED')) {
            paymentStatus = 'VERIFIED';
          } else if (milestonePayments.some(p => p.status === 'AGENT_REVIEWED')) {
            paymentStatus = 'AGENT_REVIEWED';
          } else if (milestonePayments.some(p => p.status === 'PENDING')) {
            paymentStatus = 'PENDING';
          } else if (milestonePayments.some(p => p.status === 'REJECTED')) {
            paymentStatus = 'REJECTED';
          }
          
          let adminNote: string | null = null;
          let pureBuyerNote = latestPayment?.notes || null;
          
          if (latestPayment?.notes && latestPayment.notes.includes('| Admin verified:')) {
            const parts = latestPayment.notes.split('| Admin verified:');
            pureBuyerNote = parts[0].trim();
            adminNote = parts[1].trim();
          }

          return {
            id: m.id,
            tittle: m.tittle,
            order: m.milestoneOrder,
            description: m.description,
            amount: m.amount,
            dueDate: m.dueDate,
            constructionProgress: m.constructionProgress,
            paymentStatus,
            amountPaid: totalMilestonePaid,
            paymentId: latestPayment?.id || null,
            paidAt: latestPayment?.paidAt || null,
            proofUrl: latestPayment?.proofUrls?.[0] || null,
            proofUrls: latestPayment?.proofUrls || [],
            agentDocumentUrl: latestPayment?.agentDocumentUrls?.[0] || null,
            agentDocumentUrls: latestPayment?.agentDocumentUrls || [],
            agentDocumentNote: latestPayment?.agentDocumentNote || null,
            buyerNote: pureBuyerNote,
            adminNote: adminNote,
            adminName: latestPayment?.admin?.fullName || null,
            isReadByBuyer: latestPayment?.isReadByBuyer || false,
            isReadByAgent: latestPayment?.isReadByAgent || false,
            isReadByAdmin: latestPayment?.isReadByAdmin || false,
          };
        });

        // Calculate cumulative progress up to each milestone for display
        let cumulativeProgress = 0;
        const milestonesWithCumulative = milestoneDetails.map(m => {
          cumulativeProgress += (m.paymentStatus === 'VERIFIED' ? (m.constructionProgress || 0) : 0);
          return {
            ...m,
            cumulativeProgress,
          };
        });

        // --- RECENT PAYMENTS ---

        const recentPayments = payments
          .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())
          .slice(0, 5)
          .map(p => {
            const milestone = milestones.find(m => m.id === p.milestoneId);
            return {
              id: p.id,
              amount: p.amountPaid,
              status: p.status,
              paidAt: p.paidAt,
              milestoneId: p.milestoneId,
              milestoneOrder: milestone?.milestoneOrder,
              milestoneTitle: milestone?.tittle,
              constructionProgress: milestone?.constructionProgress,
            };
          });

        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          totalInstallments: plan.totalInstallments,
          createdAt: plan.createdAt,
          property: plan.property,
          accepted: plan.accepted || false,
          acceptedAt: plan.acceptedAt || null,
          summary: {
            // Milestone counts
            totalMilestones,
            verifiedMilestones,
            pendingMilestones,
            rejectedMilestones,
            unpaidMilestones,

            // Payment amounts
            totalPaid,
            totalPrice,
            remainingAmount: totalPrice - totalPaid,
            paymentProgress,

            // Construction progress (sum of constructionProgress from verified milestones)
            constructionProgress,

            // Display formatted strings
            display: {
              verifiedPayments: `${verifiedMilestones} / ${totalMilestones}`,
              pendingReviews: pendingMilestones,
              constructionProgress: `${constructionProgress}%`,
              totalPaidFormatted: `${plan.property?.currency || 'SAR'} ${totalPaid.toLocaleString()}`,
              remainingFormatted: `${plan.property?.currency || 'SAR'} ${(totalPrice - totalPaid).toLocaleString()}`,
            },
          },
          recentPayments,
          milestones: milestonesWithCumulative,
        };
      }),
    );
  }

  async getSummary() {
    const [
      totalPlans,
      plansWithMilestones,
      avgInstallments,
      propertyStats,
    ] = await Promise.all([
      this.prisma.paymentPlan.count(),
      this.prisma.paymentPlan.count({
        where: {
          milestones: {
            some: {},
          },
        },
      }),
      this.prisma.paymentPlan.aggregate({
        _avg: { totalInstallments: true },
      }),
      this.prisma.paymentPlan.groupBy({
        by: ['propertyId'],
        _count: true,
        orderBy: {
          _count: {
            propertyId: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Get property details for top properties
    const topProperties = await Promise.all(
      propertyStats.map(async stat => {
        const property = await this.prisma.property.findUnique({
          where: { id: stat.propertyId },
          select: { id: true, title: true },
        });
        return {
          ...property,
          planCount: stat._count,
        };
      }),
    );

    return {
      success: true,
      data: {
        totalPlans,
        plansWithMilestones,
        plansWithoutMilestones: totalPlans - plansWithMilestones,
        averageInstallments: avgInstallments._avg.totalInstallments || 0,
        topPropertiesByPlans: topProperties,
      },
    };
  }

  async getPropertySummary(propertyId: string) {
    await this.validateProperty(propertyId);

    const [totalPlans, plansWithMilestones, milestoneStats] =
      await Promise.all([
        this.prisma.paymentPlan.count({
          where: { propertyId },
        }),
        this.prisma.paymentPlan.count({
          where: {
            propertyId,
            milestones: {
              some: {},
            },
          },
        }),
        this.prisma.milestone.aggregate({
          where: {
            plan: {
              propertyId,
            },
          },
          _count: true,
        }),
      ]);

    const plans = await this.prisma.paymentPlan.findMany({
      where: { propertyId },
      include: {
        _count: {
          select: { milestones: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: {
        propertyId,
        totalPlans,
        plansWithMilestones,
        plansWithoutMilestones: totalPlans - plansWithMilestones,
        totalMilestones: milestoneStats._count,
        plans: plans.map(plan => ({
          id: plan.id,
          name: plan.name,
          totalInstallments: plan.totalInstallments,
          milestoneCount: plan._count.milestones,
        })),
      },
    };
  }

  async getPropertyStats(propertyId: string) {
    // Validate property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        paymentPlans: {
          include: {
            milestones: {
              orderBy: { milestoneOrder: 'asc' }
            }
          }
        }
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    const totalPrice = property.price;

    // Get all milestones for this property
    const allMilestones = property.paymentPlans.flatMap(plan => plan.milestones);

    if (allMilestones.length === 0) {
      return {
        totalPrice,
        totalPaid: 0,
        remainingAmount: totalPrice,
        percentagePaid: 0,
        verifiedPayments: '0 / 0',
        pendingReview: 0,
        constructionProgress: 0,
      };
    }

    const milestoneIds = allMilestones.map(m => m.id);

    // Get all payments for these milestones
    const payments = await this.prisma.milestonePayment.findMany({
      where: {
        milestoneId: { in: milestoneIds },
      },
      orderBy: { paidAt: 'desc' },
    });

    // Calculate verified payments total amount
    const verifiedPayments = payments.filter(p => p.status === MilestonePaymentStatus.VERIFIED);
    const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    // Calculate percentage paid based on verified milestones
    const percentagePaid = allMilestones.length > 0 ? (verifiedPayments.length / allMilestones.length) * 100 : 0;

    // Calculate pending reviews
    const pendingReview = payments.filter(p =>
      p.status === MilestonePaymentStatus.PENDING ||
      p.status === MilestonePaymentStatus.AGENT_REVIEWED
    ).length;





    // Calculate total construction progress based on milestone constructionProgress values
    const totalConstructionProgress = allMilestones.length > 0
      ? allMilestones
        .map(m => m.constructionProgress ?? 0) // fallback to 0 if undefined
        .reduce((sum, prog) => sum + prog, 0) / allMilestones.length
      : 0;


    return {
      success: true,
      data: {
        property: {
          id: property.id,
          title: property.title,
          price: property.price,
          currency: property.currency,
        },
        paymentProgress: {
          totalPrice,
          totalPaid,
          remainingAmount: totalPrice - totalPaid,
          percentagePaid: Math.round(percentagePaid * 100) / 100,
          verifiedPayments: `${verifiedPayments.length} / ${allMilestones.length}`,
          pendingReview,
          constructionProgress: Math.round(totalConstructionProgress),
        },
      },
    };
  }

  private async validateProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }

  private async getPropertyId(planId: string): Promise<string> {
    const plan = await this.prisma.paymentPlan.findUnique({
      where: { id: planId },
      select: { propertyId: true },
    });

    if (!plan) {
      throw new NotFoundException(`Payment plan with ID ${planId} not found`);
    }

    return plan.propertyId;
  }

}
