import { IsOptional, IsUUID, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MilestonePaymentStatus } from '@prisma/client';

export class FilterMilestonePaymentDto {
  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsEnum(MilestonePaymentStatus)
  status?: MilestonePaymentStatus;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  unreadOnly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}