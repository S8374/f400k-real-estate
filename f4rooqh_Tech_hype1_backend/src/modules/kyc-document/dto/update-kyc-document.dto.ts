import { PartialType } from '@nestjs/mapped-types';
import { IsUUID, IsOptional, IsEnum, IsString } from 'class-validator';
import { CreateKycDocumentDto } from './create-kyc-document.dto';
import { KycStatus } from '@prisma/client';

export class UpdateKycDocumentDto extends PartialType(CreateKycDocumentDto) {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEnum(KycStatus)
  @IsOptional()
  verificationStatus?: KycStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}