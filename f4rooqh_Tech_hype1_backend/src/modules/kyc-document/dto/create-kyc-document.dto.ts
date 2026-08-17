import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsUrl,
  IsDateString,
  Length,
} from 'class-validator';
import { KycStatus } from '@prisma/client';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  RESIDENT_ID = 'RESIDENT_ID',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  BANK_STATEMENT = 'BANK_STATEMENT',
  TAX_CERTIFICATE = 'TAX_CERTIFICATE',
  COMPANY_REGISTRATION = 'COMPANY_REGISTRATION',
  TRADE_LICENSE = 'TRADE_LICENSE',
  OTHER = 'OTHER'
}

export class CreateKycDocumentDto {
  @IsUUID()
  userId: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsUrl()
  fileUrl: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;
}

export class AdminVerifyKycDto {
  @IsUUID()
  documentId: string;

  @IsUUID()
  adminId: string;

  @IsEnum(KycStatus)
  status: KycStatus

  @IsOptional()
  @IsString()
  @Length(1, 500)
  rejectionReason?: string;
}