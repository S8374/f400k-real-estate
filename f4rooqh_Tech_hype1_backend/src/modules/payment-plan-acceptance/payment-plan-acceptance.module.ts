import { Module } from '@nestjs/common';
import { PaymentPlanAcceptanceService } from './payment-plan-acceptance.service';
import { PaymentPlanAcceptanceController } from './payment-plan-acceptance.controller';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  controllers: [PaymentPlanAcceptanceController],
  providers: [PaymentPlanAcceptanceService],
  exports: [PaymentPlanAcceptanceService],
})
export class PaymentPlanAcceptanceModule {}