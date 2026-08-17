import { Module } from '@nestjs/common';
import { MilestonePaymentService } from './milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  providers: [MilestonePaymentService],
  exports: [MilestonePaymentService],
})
export class MilestonePaymentModule {}