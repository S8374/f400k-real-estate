import { IsUUID, IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyPropertyRegaDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  isRegaVerified: boolean;

  @IsOptional()
  @IsString()
  sakNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PropertyVerificationStatusDto {
  @IsUUID()
  propertyId: string;

  @IsBoolean()
  isRegaVerified: boolean;

  @IsOptional()
  @IsString()
  sakNumber?: string;
}