import { Injectable, BadRequestException } from '@nestjs/common';
import { MilestonePaymentService } from '../milestone-payment/milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateMilestonePaymentDto } from '../milestone-payment/dto/create-milestone-payment.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { MilestonePaymentStatus } from '@prisma/client';

@Injectable()
export class BuyerMilestonePaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly milestonePaymentService: MilestonePaymentService,
  ) { }

  async uploadPayment(dto: CreateMilestonePaymentDto & { buyerId: string }) {
    const { milestoneId, propertyId, buyerId, amountPaid, proofUrls, notes } = dto;

    // Validate buyer
    await this.milestonePaymentService.validateBuyer(buyerId);

    // Validate milestone
    await this.milestonePaymentService.validateMilestone(milestoneId, propertyId);

    // Check for existing pending payment
    const existing = await this.prisma.milestonePayment.findFirst({
      where: {
        milestoneId,
        buyerId,
        status: {
          in: [MilestonePaymentStatus.PENDING, MilestonePaymentStatus.AGENT_REVIEWED, MilestonePaymentStatus.REJECTED],
        },
      },
    });

    let payment;
    if (existing) {
      // Update existing record
      payment = await this.prisma.milestonePayment.update({
        where: { id: existing.id },
        data: {
          amountPaid,
          proofUrls,
          notes: notes || existing.notes,
          isReadByAgent: false,
          isReadByAdmin: false,
          isReadByBuyer: true,
          status: MilestonePaymentStatus.PENDING, // Reset status on re-upload
          paidAt: new Date(),
        },
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
    } else {
      // Create new payment record
      payment = await this.prisma.milestonePayment.create({
        data: {
          milestoneId,
          buyerId,
          amountPaid,
          proofUrls,
          notes,
          status: MilestonePaymentStatus.PENDING,
          paidAt: new Date(),
          isReadByBuyer: true,
          isReadByAgent: false,
          isReadByAdmin: false,
        },
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
    }

    return {
      success: true,
      message: 'Payment uploaded successfully',
      data: payment,
    };
  }

  async getMyPayments(buyerId: string, filterDto: FilterMilestonePaymentDto) {
    await this.milestonePaymentService.validateBuyer(buyerId);

    const where = {
      buyerId,
      ...(filterDto.status && { status: filterDto.status }),
      ...(filterDto.milestoneId && { milestoneId: filterDto.milestoneId }),
    };

    const result = await this.milestonePaymentService.findPayments(
      where,
      {
        milestone: {
          include: {
            plan: {
              include: {
                property: {
                  select: {
                    id: true,
                    title: true,
                    images: true,
                  },
                },
              },
            },
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

  async markAsRead(dto: MarkAsReadDto) {
    const { paymentId, userId, userRole } = dto;

    // Validate access
    await this.milestonePaymentService.validatePaymentAccess(paymentId, userId);

    // Mark as read
    const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);

    return {
      success: true,
      message: 'Marked as read',
      data: updated,
    };
  }

  async getPaymentDetails(id: string, buyerId: string) {
    await this.milestonePaymentService.validatePaymentAccess(id, buyerId);
    const payment = await this.milestonePaymentService.findOne(id);

    return {
      success: true,
      data: payment,
    };
  }

  async getUnreadCount(buyerId: string) {
    await this.milestonePaymentService.validateBuyer(buyerId);
    return this.milestonePaymentService.getUnreadCount(buyerId, 'BUYER');
  }

  async getPerformanceStats(buyerId: string) {
    await this.milestonePaymentService.validateBuyer(buyerId);

    // Count unique properties viewed
    const propertyViews = await this.prisma.propertyView.groupBy({
      by: ['propertyId'],
      where: { userId: buyerId },
    });

    const [savedCount, ownedCount] = await Promise.all([
      this.prisma.savedListing.count({
        where: { userId: buyerId },
      }),
      this.prisma.paymentPlanAcceptance.count({
        where: { buyerId: buyerId },
      }),
    ]);

    return {
      success: true,
      data: {
        propertiesViewed: propertyViews.length,
        propertiesSaved: savedCount,
        propertiesOwned: ownedCount,
      },
    };
  }

  async getGoldenVisaProgress(buyerId: string) {
    await this.milestonePaymentService.validateBuyer(buyerId);

    const acceptance = await this.prisma.paymentPlanAcceptance.findFirst({
      where: {
        buyerId,
        property: {
          type: 'GOLDEN_VISA',
        },
      },
      include: {
        property: true,
      },
    });
    console.log('acceptance', acceptance);
    if (!acceptance) {
      return {
        success: true,
        data: {
          hasGoldenVisaProject: false,
          progress: 0,
          milestoneProgress: 0,
          documentProgress: 0,
        },
      };
    }

    // Milestone progress: each verified milestone payment adds 10%, max 60%
    // Fetch ALL payments for this buyer to see what's actually in the DB
    const allBuyerPayments = await this.prisma.milestonePayment.findMany({
      where: { buyerId },
      include: {
        milestone: true,
      },
    });

    console.log(`[DEBUG] Found ${allBuyerPayments.length} total payments for buyer ${buyerId}`);
    allBuyerPayments.forEach(p => {
      console.log(`[DEBUG] Payment ID: ${p.id}, Status: ${p.status}, PlanID: ${p.milestone?.planId}`);
    });

    const verifiedPayments = allBuyerPayments.filter(p => p.status === MilestonePaymentStatus.VERIFIED);
    console.log('[DEBUG] Verified payments count:', verifiedPayments.length);
    const verifiedPaymentProgress = verifiedPayments.length * 10;

    // Filter by the specific plan associated with the Golden Visa property
    // const planPayments = verifiedPayments.filter(p => p.milestone.planId === acceptance.paymentPlanId);
    // console.log('[DEBUG] Verified payments for current plan:', planPayments.length);

    // const uniqueMilestonesPaid = new Set(planPayments.map((p) => p.milestoneId)).size;
    // console.log('uniqueMilestonesPaid', uniqueMilestonesPaid);
    // const milestoneProgress = Math.min(uniqueMilestonesPaid * 10, 60);
    // console.log('milestoneProgress', milestoneProgress);
    // Document progress: 40% if all verified
    const buyerProfile = await this.prisma.buyerProfile.findUnique({
      where: { userId: buyerId },
    });
    console.log('buyerProfile', buyerProfile);
    const userDocument = await this.prisma.kycDocument.findMany({
      where: { userId: buyerId },
    });

    console.log('userDocument', userDocument);
    // KYC Document progress: 40% if the profile is VERIFIED
    const verifiedDocs = userDocument.filter(
      doc => doc.verificationStatus === 'VERIFIED'
    );

    const verifiedCount = verifiedDocs.length;

    console.log('verifiedCount:', verifiedCount);
    const documentProgress = verifiedCount * 8;
    console.log("documentProgress", documentProgress);

    return {
      success: true,
      data: {
        totalProgress: documentProgress + verifiedPaymentProgress,
      },
    };
  }
}
