import { IsOptional, IsUUID, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMilestoneDto {
  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasDueDate?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasConstructionProgress?: boolean;

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