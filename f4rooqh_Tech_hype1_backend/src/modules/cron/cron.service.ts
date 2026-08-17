import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../common/context/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Run every day at midnight to check for payments due or overdue
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePaymentReminders() {
    this.logger.log('Running daily payment reminder check...');
    try {
      // Find all payment plans acceptances with their milestones and related data
      const acceptances = await this.prisma.paymentPlanAcceptance.findMany({
        include: {
          buyer: true,
          property: {
            include: {
              agent: {
                include: { user: true }
              }
            }
          },
          paymentPlan: {
            include: {
              milestones: {
                where: {
                  dueDate: { not: null },
                },
                include: {
                  payments: true,
                },
              },
            },
          },
        },
      });

      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      for (const acceptance of acceptances) {
        if (!acceptance.paymentPlan?.milestones) continue;

        for (const milestone of acceptance.paymentPlan.milestones) {
          if (!milestone.dueDate) continue;

          const milestoneDate = new Date(milestone.dueDate);
          milestoneDate.setHours(0, 0, 0, 0); // Start of due date

          // Check if it's already paid/verified
          const isVerified = milestone.payments.some((p) => p.status === 'VERIFIED');
          const isPendingReview = milestone.payments.some((p) => p.status === 'PENDING' || p.status === 'AGENT_REVIEWED');

          // If payment is completely done or under review, skip reminding
          if (isVerified || isPendingReview) continue;

          // Calculate difference in days
          const diffTime = Math.abs(now.getTime() - milestoneDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const buyerEmail = acceptance.buyer?.email;
          const agentEmail = acceptance.property?.agent?.user?.email;

          if (!buyerEmail) continue;

          // Condition 1: Due exact today
          if (now.getTime() === milestoneDate.getTime()) {
            this.logger.log(`Sending Due Today reminder for milestone ${milestone.tittle} to ${buyerEmail}`);
            await this.mailService.sendPaymentReminderEmail(
              buyerEmail,
              agentEmail || '',
              milestone.tittle || 'Milestone',
              milestone.dueDate,
              false // isLate = false
            );
          }

          // Condition 2: Overdue (e.g., exactly 1 day, 3 days, 7 days late)
          if (now.getTime() > milestoneDate.getTime()) {
            if (diffDays === 1 || diffDays === 3 || diffDays === 7 || diffDays % 7 === 0) {
              this.logger.log(`Sending Overdue (${diffDays} days late) reminder for milestone ${milestone.tittle} to ${buyerEmail}`);
              await this.mailService.sendPaymentReminderEmail(
                buyerEmail,
                agentEmail || '',
                milestone.tittle || 'Milestone',
                milestone.dueDate,
                true // isLate = true
              );
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to run payment reminder cron job', error);
    }
  }
}
