import {
  IsString,
  IsUUID,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsUUID()
  planId: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  tittle?: string;

  @IsInt()
  @Min(1)
  milestoneOrder: number;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  constructionProgress?: number;
}