import { IsUUID, IsNumber, IsString, IsOptional, IsUrl, Min, IsArray } from 'class-validator';

export class CreateMilestonePaymentDto {
  @IsUUID()
  milestoneId: string;

  @IsUUID()
  propertyId: string;

  @IsUUID()
  paymentplanId: string;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  @IsArray()
  @IsUrl({}, { each: true })
  proofUrls: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}