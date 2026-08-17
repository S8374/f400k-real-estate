import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationality?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  // Agent fields
  @IsOptional()
  @IsNumber()
  licenseNumber?: number;

  @IsOptional()
  @IsNumber()
  ragaId?: number;

  @IsOptional()
  @IsString()
  agencyName?: string;

  // Buyer fields
  @IsOptional()
  @IsString()
  investmentField?: string;

  @IsOptional()
  @IsNumber()
  investmentBudgetMin?: number;

  @IsOptional()
  @IsNumber()
  investmentBudgetMax?: number;

  // Terms
  @IsBoolean()
  termsAndCondition: boolean;
}