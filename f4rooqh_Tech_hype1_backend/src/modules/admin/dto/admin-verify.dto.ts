import { IsUUID, IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class AdminVerifyDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  adminId: string;

  @IsBoolean()
  approve: boolean;

  @ValidateIf(o => !o.approve)
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}