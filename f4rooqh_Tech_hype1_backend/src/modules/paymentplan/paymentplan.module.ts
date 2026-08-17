import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../../common/context/prisma.service';
import { PaymentPlanService } from './paymentplan.service';
import { PaymentPlanController } from './paymentplan.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentPlanController],
  providers: [PaymentPlanService],
  exports: [PaymentPlanService],
})
export class PaymentPlanModule {}