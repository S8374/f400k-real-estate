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
} from '@nestjs/common';
import { PaymentPlanAcceptanceService } from './payment-plan-acceptance.service';
import { CreatePaymentPlanAcceptanceDto } from './dto/create-payment-plan-acceptance.dto';
import { UpdatePaymentPlanAcceptanceDto } from './dto/update-payment-plan-acceptance.dto';
import { FilterPaymentPlanAcceptanceDto } from './dto/filter-payment-plan-acceptance.dto';

@Controller('payment-plan')
export class PaymentPlanAcceptanceController {
  constructor(private readonly service: PaymentPlanAcceptanceService) { }

  @Post('/accept')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreatePaymentPlanAcceptanceDto) {
    return this.service.create(createDto);
  }

  @Post('toggle')
  toggle(@Body() createDto: CreatePaymentPlanAcceptanceDto) {
    return this.service.toggle(createDto);
  }
  @Get('check')
  async checkAcceptance(
    @Query('agentId', ParseUUIDPipe) agentId: string,
    @Query('propertyId', ParseUUIDPipe) propertyId: string,
    @Query('paymentPlanId', ParseUUIDPipe) paymentPlanId: string,
  ) {
    return this.service.checkAcceptance(agentId, propertyId, paymentPlanId);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
  @Get('agent/:agentId')
  findByAgent(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Query() filterDto: FilterPaymentPlanAcceptanceDto,
  ) {
    return this.service.findByAgent(agentId, filterDto);
  }

  @Get('buyer/:buyerId')
  findByBuyer(
    @Param('buyerId', ParseUUIDPipe) buyerId: string,
    @Query() filterDto: FilterPaymentPlanAcceptanceDto,
  ) {
    return this.service.findByBuyer(buyerId, filterDto);
  }

}