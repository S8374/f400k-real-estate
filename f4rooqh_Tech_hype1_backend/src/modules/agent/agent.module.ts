import { Module } from '@nestjs/common';

import { MilestonePaymentModule } from '../milestone-payment/milestone-payment.module';
import { PrismaService } from '../../common/context/prisma.service';
import { AgentMilestonePaymentController } from './agent.controller';
import { AgentMilestonePaymentService } from './agent.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MilestonePaymentModule, ConfigModule],
  controllers: [AgentMilestonePaymentController],
  providers: [AgentMilestonePaymentService],
})
export class AgentModule { }