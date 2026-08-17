import { Injectable, BadRequestException } from '@nestjs/common';
import { MilestonePaymentService } from '../milestone-payment/milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';
import { AdminVerifyDto } from '../milestone-payment/dto/admin-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { MilestonePaymentStatus } from '@prisma/client';

@Injectable()
export class AdminMilestonePaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly milestonePaymentService: MilestonePaymentService,
  ) { }

  async getPendingVerification(adminId: string, filterDto: FilterMilestonePaymentDto) {
    await this.milestonePaymentService.validateAdmin(adminId);

    const where = {
      status: filterDto.status || MilestonePaymentStatus.AGENT_REVIEWED,
      ...(filterDto.unreadOnly && { isReadByAdmin: false }),
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
        agent: {
          select: {
            id: true,
            fullName: true,
            email: true,
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

  async verifyPayment(dto: AdminVerifyDto) {
    const { paymentId, adminId, approve, rejectionReason, notes } = dto;

    // Validate admin
    await this.milestonePaymentService.validateAdmin(adminId);

    // Get payment
    const payment = await this.prisma.milestonePayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== MilestonePaymentStatus.AGENT_REVIEWED) {
      throw new BadRequestException('Payment must be reviewed by agent first');
    }

    let updated;

    if (approve) {
      // Approve payment
      updated = await this.prisma.milestonePayment.update({
        where: { id: paymentId },
        data: {
          adminId,
          verifiedAt: new Date(),
          status: MilestonePaymentStatus.VERIFIED,
          notes: notes ? `${payment.notes || ''} | Admin verified: ${notes}` : payment.notes,
          isReadByBuyer: false, // Buyer needs to know
          isReadByAgent: false, // Agent needs to know
          isReadByAdmin: true,
        },
        include: {
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
        },
      });

      return {
        success: true,
        message: 'Payment verified successfully',
        data: updated,
      };
    } else {
      // Reject payment
      if (!rejectionReason) {
        throw new BadRequestException('Rejection reason is required');
      }

      updated = await this.prisma.milestonePayment.update({
        where: { id: paymentId },
        data: {
          adminId,
          rejectedAt: new Date(),
          status: MilestonePaymentStatus.REJECTED,
          rejectionReason,
          notes: notes ? `${payment.notes || ''} | Admin rejected: ${notes}` : payment.notes,
          isReadByBuyer: false, // Buyer needs to know
          isReadByAgent: false, // Agent needs to know
          isReadByAdmin: true,
        },
      });

      return {
        success: true,
        message: 'Payment rejected',
        data: updated,
      };
    }
  }

  async markAsRead(dto: MarkAsReadDto) {
    const { paymentId, userId, userRole } = dto;

    await this.milestonePaymentService.validateAdmin(userId);
    const updated = await this.milestonePaymentService.markAsRead(paymentId, userRole);

    return {
      success: true,
      message: 'Marked as read',
      data: updated,
    };
  }

  async getPaymentDetails(id: string, adminId: string) {
    await this.milestonePaymentService.validateAdmin(adminId);
    const payment = await this.milestonePaymentService.findOne(id);

    return {
      success: true,
      data: payment,
    };
  }

  async getUnreadCount(adminId: string) {
    await this.milestonePaymentService.validateAdmin(adminId);
    return this.milestonePaymentService.getUnreadCount(adminId, 'ADMIN');
  }

  async getOverview(adminId: string) {
    await this.milestonePaymentService.validateAdmin(adminId);

    const [
      pendingAgent,
      pendingAdmin,
      verified,
      rejected,
      totalAmount,
    ] = await Promise.all([
      this.prisma.milestonePayment.count({ where: { status: MilestonePaymentStatus.PENDING } }),
      this.prisma.milestonePayment.count({ where: { status: MilestonePaymentStatus.AGENT_REVIEWED } }),
      this.prisma.milestonePayment.count({ where: { status: MilestonePaymentStatus.VERIFIED } }),
      this.prisma.milestonePayment.count({ where: { status: MilestonePaymentStatus.REJECTED } }),
      this.prisma.milestonePayment.aggregate({
        where: { status: MilestonePaymentStatus.VERIFIED },
        _sum: { amountPaid: true },
      }),
    ]);

    return {
      success: true,
      data: {
        pendingAgentReview: pendingAgent,
        pendingAdminVerification: pendingAdmin,
        verified,
        rejected,
        totalVerifiedAmount: totalAmount._sum.amountPaid || 0,
      },
    };
  }


}