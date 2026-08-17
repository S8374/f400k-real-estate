/**
 * Admin Milestone Payment Controller
 * Handles statistics, listings, and verification of milestone payments.
 */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AdminVerifyDto } from '../milestone-payment/dto/admin-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { AdminMilestonePaymentService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/milestone-payments')
@Roles(Role.ADMIN)
export class AdminMilestonePaymentController {
  constructor(private readonly service: AdminMilestonePaymentService) { }

  /**
   * Get global stats/overview for dashboard
   */
  @Get('stats/:adminId')
  async getOverview(@Param('adminId', ParseUUIDPipe) adminId: string) {
    return this.service.getOverview(adminId);
  }

  /**
   * Get pending verification payments
   */
  @Get('pending/:adminId')
  async getPendingVerification(
    @Param('adminId', ParseUUIDPipe) adminId: string,
    @Query() filterDto: FilterMilestonePaymentDto,
  ) {
    return this.service.getPendingVerification(adminId, filterDto);
  }

  /**
   * Get unread count
   */
  @Get('unread/:adminId')
  async getUnreadCount(@Param('adminId', ParseUUIDPipe) adminId: string) {
    return this.service.getUnreadCount(adminId);
  }

  /**
   * Get full details of a specific payment
   */
  @Get('details/:id/:adminId')
  async getPaymentDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('adminId', ParseUUIDPipe) adminId: string,
  ) {
    return this.service.getPaymentDetails(id, adminId);
  }

  @Post('verify')
  async verifyPayment(@Body() dto: AdminVerifyDto) {
    return this.service.verifyPayment(dto);
  }

  @Post('mark-read')
  async markAsRead(@Body() dto: MarkAsReadDto) {
    return this.service.markAsRead(dto);
  }
}