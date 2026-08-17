import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  Length,
  Equals,
} from 'class-validator';

export class CreatePaymentPlanDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  downPaymentPercent?: number;

  @IsInt()
  @Min(6)
  @Max(6)
  totalInstallments: number;
  
  @IsOptional()
  @IsString()
  description?: string;
}