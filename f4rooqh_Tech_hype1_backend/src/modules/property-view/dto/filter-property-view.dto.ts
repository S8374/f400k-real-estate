import { IsOptional, IsUUID, IsEnum, IsDateString, IsInt, Min, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ViewSource } from './create-property-view.dto';

export class FilterPropertyViewDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(ViewSource)
  source?: ViewSource;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  uniqueUsers?: boolean;

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

export class PropertyViewAnalyticsDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(ViewSource)
  source?: ViewSource;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' | 'source' | 'property';
}