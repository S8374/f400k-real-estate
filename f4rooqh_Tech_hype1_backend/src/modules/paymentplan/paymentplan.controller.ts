import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { FilterPaymentPlanDto } from './dto/filter-payment-plan.dto';
import { CreatePaymentPlanDto } from './dto/create-paymentplan.dto';
import { UpdatePaymentPlanDto } from './dto/update-paymentplan.dto';
import { PaymentPlanService } from './paymentplan.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) { }

  @Post('/create')
  @UseGuards(AuthGuard)
  create(
    @CurrentUser() user,
    @Body() dto: CreatePaymentPlanDto,
  ) {
    return this.paymentPlanService.create(user.userId, dto);
  }

  @Get('my/:creatorId')
  @UseGuards(AuthGuard)
  getPlansByCreator(
    @Param('creatorId') creatorId: string,
    @Query('propertyId') propertyId?: string,
  ) {
    return this.paymentPlanService.getByCreatorId(creatorId, propertyId);
  }

  @Get('buyer/:buyerId')
  @UseGuards(AuthGuard)
  getPlansByBuyer(
    @Param('buyerId') buyerId: string,
    @Query('propertyId') propertyId?: string,
  ) {
    return this.paymentPlanService.getByBuyerId(buyerId, propertyId);
  }

  @Get('/all')
  @Public()
  findAll(@Query() filterDto: FilterPaymentPlanDto) {
    return this.paymentPlanService.findAll(filterDto);
  }
  // Get property plan statistics
  @Get(':propertyId/stats')
  @UseGuards(AuthGuard)
  async getPropertyStats(
    @Param('propertyId', new ParseUUIDPipe()) propertyId: string,
  ) {
    return this.paymentPlanService.getPropertyStats(propertyId);
  }

  @Get('property/:propertyId')
  @Public()
  findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() filterDto: FilterPaymentPlanDto,
  ) {
    return this.paymentPlanService.findByProperty(propertyId, filterDto);
  }

  @Get('summary')
  @Public()
  getSummary() {
    return this.paymentPlanService.getSummary();
  }

  @Get('property/:propertyId/summary')
  @Public()
  getPropertySummary(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.paymentPlanService.getPropertySummary(propertyId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentPlanService.findOne(id);
  }

  @Patch('/update/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentPlanDto: UpdatePaymentPlanDto,
  ) {
    return this.paymentPlanService.update(id, updatePaymentPlanDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentPlanService.remove(id);
  }

}