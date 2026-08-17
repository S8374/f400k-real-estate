import { Module } from '@nestjs/common';
import { MilestonePaymentModule } from '../milestone-payment/milestone-payment.module';
import { PrismaService } from '../../common/context/prisma.service';
import { AdminMilestonePaymentController } from './admin.controller';
import { AdminMilestonePaymentService } from './admin.service';
import { AdminAgentController } from './admin-agent.controller';
import { AdminAgentService } from './admin-agent.service';
import { AdminBuyerController } from './admin-buyer.controller';
import { AdminBuyerService } from './admin-buyer.service';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [MilestonePaymentModule],
  controllers: [
    AdminMilestonePaymentController, 
    AdminAgentController,
    AdminBuyerController,
    AdminUserController
  ],
  providers: [AdminMilestonePaymentService, AdminAgentService, AdminBuyerService, AdminUserService],
})
export class AdminModule { }