import { IsOptional, IsString, IsNumber, IsArray, MaxLength } from 'class-validator';

export class UpdateUserProfileDto {
  // USER TABLE
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationality?: string;

  // AGENT PROFILE
  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  yearsExperience?: number;

  // BUYER PROFILE
  @IsOptional()
  @IsNumber()
  investmentBudgetMin?: number;

  @IsOptional()
  @IsNumber()
  investmentBudgetMax?: number;

  @IsOptional()
  @IsString()
  investmentField?: string;

  @IsOptional()
  @IsArray()
  preferredPropertyTypes?: string[];
}