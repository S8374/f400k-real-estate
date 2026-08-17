import { Module } from '@nestjs/common';

import { MilestonePaymentModule } from '../milestone-payment/milestone-payment.module';
import { PrismaService } from '../../common/context/prisma.service';
import { BuyerMilestonePaymentController } from './buyer.controller';
import { BuyerMilestonePaymentService } from './buyer.service';

@Module({
  imports: [MilestonePaymentModule],
  controllers: [BuyerMilestonePaymentController],
  providers: [BuyerMilestonePaymentService],
})
export class BuyerModule { }