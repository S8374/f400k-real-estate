import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentPlanAcceptanceDto } from './create-payment-plan-acceptance.dto';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdatePaymentPlanAcceptanceDto extends PartialType(CreatePaymentPlanAcceptanceDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}