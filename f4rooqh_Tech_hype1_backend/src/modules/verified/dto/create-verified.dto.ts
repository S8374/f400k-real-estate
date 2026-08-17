import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class VerifyAgentDto {
  @IsUUID()
  agentId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  isRegaVerified: boolean;

  @IsBoolean()
  isNafathVerified: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VerifyPropertyDto {
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

export class VerificationFilterDto {
  @IsOptional()
  @IsString()
  type?: 'agent' | 'property' | 'all';

  @IsOptional()
  @IsBoolean()
  pendingOnly?: boolean;

  @IsOptional()
  @IsUUID()
  agentId?: string;
}