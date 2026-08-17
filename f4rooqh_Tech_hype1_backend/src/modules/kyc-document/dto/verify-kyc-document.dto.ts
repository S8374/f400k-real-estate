import { IsUUID, IsEnum, IsString, IsOptional } from 'class-validator';
import { KycStatus } from '@prisma/client';

export class VerifyKycDocumentDto {
  @IsUUID()
  documentId: string;

  @IsUUID()
  adminId: string;

  @IsEnum(KycStatus)
  status: KycStatus; // Just use the enum type, not specific values

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}