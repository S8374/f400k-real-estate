import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingPurpose } from '@prisma/client';

export class SearchPropertyDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ListingPurpose)
  listingPurpose?: ListingPurpose;

  @IsOptional()
  @IsString() // Changed from IsEnum to IsString to accept "allproperties"
  type?: string; // Can be ProjectType enum value OR "allproperties"

  @IsOptional()
  @IsString()
  zoneId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  timeFilter?: 'today' | 'this_week' | 'this_month' | 'this_year';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'createdAt' | 'views' | 'title';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}