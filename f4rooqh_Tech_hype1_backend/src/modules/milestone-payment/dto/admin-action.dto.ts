import { IsUUID, IsBoolean, IsString, IsOptional } from 'class-validator';

export class AdminVerifyDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  approve: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}