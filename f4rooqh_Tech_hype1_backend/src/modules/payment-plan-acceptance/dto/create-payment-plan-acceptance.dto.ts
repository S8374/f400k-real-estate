import { IsUUID } from 'class-validator';

export class CreatePaymentPlanAcceptanceDto {
  @IsUUID()
  agentId!: string;

  @IsUUID()
  propertyId!: string;

  @IsUUID()
  paymentPlanId!: string;

  @IsUUID()
  buyerId!: string;
}