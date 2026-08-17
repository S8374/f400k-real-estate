import { IsUUID, IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyAgentRegaDto {
  @IsUUID()
  agentId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  isRegaVerified: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VerifyAgentNafathDto {
  @IsUUID()
  agentId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  isNafathVerified: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VerifyAgentResponseDto {
  success: boolean;
  message: string;
  data: {
    agentId: string;
    isRegaVerified: boolean;
    isNafathVerified: boolean;
    verifiedAt?: Date;
  };
}