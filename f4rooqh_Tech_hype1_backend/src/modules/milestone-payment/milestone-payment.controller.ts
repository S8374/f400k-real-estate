import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CreateMilestonePaymentDto } from '../milestone-payment/dto/create-milestone-payment.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { BuyerMilestonePaymentService } from '../buyer/buyer.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('buyer/milestone-payments')
@Roles(Role.BUYER)
export class BuyerMilestonePaymentController {
  constructor(private readonly service: BuyerMilestonePaymentService) { }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async uploadPayment(@Body() dto: CreateMilestonePaymentDto, @Query('buyerId') buyerId: string) {
    return this.service.uploadPayment({ ...dto, buyerId });
  }

  @Get('my-payments')
  async getMyPayments(
    @Query('buyerId') buyerId: string,
    @Query() filterDto: FilterMilestonePaymentDto,
  ) {
    return this.service.getMyPayments(buyerId, filterDto);
  }

  @Get('unread')
  async getUnreadCount(@Query('buyerId') buyerId: string) {
    return this.service.getUnreadCount(buyerId);
  }

  @Post('mark-read')
  async markAsRead(@Body() dto: MarkAsReadDto) {
    return this.service.markAsRead(dto);
  }

  @Get(':id')
  async getPaymentDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('buyerId') buyerId: string,
  ) {
    return this.service.getPaymentDetails(id, buyerId);
  }

}