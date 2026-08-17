import { IsOptional, IsUUID, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPaymentPlanAcceptanceDto {
  @IsOptional()
  @IsUUID()
  buyerId?: string;

  @IsOptional()
  @IsUUID()
  acceptedById?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  paymentPlanId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  withVerifier?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}